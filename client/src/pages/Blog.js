import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import './Blog.css';
import Card from 'react-bootstrap/Card';
import {AiFillCloseCircle} from 'react-icons/ai';
import CreatePost from '../components/CreatePost';
import sanitizeHtml from 'sanitize-html';

const Blog = () =>{

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([])
    const [posted, setPosted] = useState(false)

    //convert blogpost text to html elements
    function formatText(text) {
        // Split the text into lines
        const lines = text.split("\n");
        // Convert bullet points to <li> tags
        const listItems = lines.map((line) => {
          if (line.startsWith("- ")) {
            return `<li>${line.slice(2)}</li>`;
          } else {
            return `<br/>${line}`;
          }
        });
        // Join the lines back together with <br> tags
        let result = listItems.join("");
        result= sanitizeHtml(result, {
            allowedTags: ['br', 'li', 'em', 'strong', 'a','b']
          });
        return result;
      }

    //date of the blogpost
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return [year, month, day].join('-');
    }

    //submit a new blog
    const submitBlog = async (e) =>{
        let req = await fetch ('http://localhost:5000/api/blog',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title: e.title, text: e.text})
        })
        let data = await req.json();
        if (data.status === 'ok'){
            await populateBlog();
        }
        else{
            alert(data.error)
        }
        return data;
    }

    async function populateBlog(){
        const req = await fetch('http://localhost:5000/api/blog', 
        {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const data = await req.json()
        if (data.status === 'ok'){
            data.blogs = await populateAuthors(data.blogs)
            setBlogs(data.blogs)
        }
    }

    async function populateAuthors(blogs){
        const currentDate = new Date(Date.now());
        let hashBlogAuthors = {}
        let authorBlogs = await Promise.all(blogs.map(async (blog)=>{
            if (currentDate.toDateString() == new Date(blog.createdAt).toDateString()) {
                setPosted(true)
            }
            if (hashBlogAuthors[blog.user]){
                blog.author = hashBlogAuthors[blog.user]
                return blog
            }
            try{
                const req = await fetch('http://localhost:5000/api/user?id='+String(blog.user), 
                {
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                })
                const data = await req.json();
                if (data.status =='ok'){
                    hashBlogAuthors[blog.user] = data.user.name
                    blog.author = data.user.name? data.user.name : ""
                }
                else{
                    blog.author = ""
                }
            }
            catch(error){
            }
            return blog
        }))
        return authorBlogs
    }

    async function deleteBlog(_id){
        setBlogs(blogs.filter(blog => blog._id !== _id))
        const req = await fetch('http://localhost:5000/api/blog', 
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({id: _id})
        })
        const data = await req.json()
        if (data.status !== 'ok'){
            populateBlog();
            alert("error")
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if (token){
            const user = jwtDecode(token)

            if (!user){
                localStorage.removeItem('token')
                navigate.replace('/login')
            } else{
                populateBlog()
            }
        }
    }, [])

    const blogList=blogs.map(
        (blog)=>{
            return( 
                <Card key={blog._id}className="blogContainer">
                <Card.Body className="blogWrap">
                    <button className="closeButton" value={blog._id} onClick={(e) => {deleteBlog(e.currentTarget.value); }}><AiFillCloseCircle className="closeIcon"/></button>
                    <Card.Title className="blogtitle">{blog.title}</Card.Title>
                    <Card.Subtitle className="blogDate blogBody"><b>Author:</b> {blog.author}</Card.Subtitle>
                    <Card.Subtitle className="blogDate blogBody">{blog.updatedAt ? formatDate(blog.updatedAt): blog.createdAt ? formatDate(blog.createdAt) : ""}</Card.Subtitle>
                    <Card.Text >
                        <div className="blogdescription blogBody">
                        <div dangerouslySetInnerHTML={{ __html: formatText(blog.text) }} /></div>
                    </Card.Text>
                </Card.Body>
                </Card>

            )
        }
    )

    return (
        <div>
            <CreatePost sendData={submitBlog} posted={posted}/>
            <div style={{background: "black"}}>
            <div className="blogposts">
            {blogList}
            </div>
            </div>
        </div>
    )
}
export default Blog