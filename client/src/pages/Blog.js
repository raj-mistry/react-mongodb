import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import './Blog.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {AiFillCloseCircle} from 'react-icons/ai';

const Blog = () =>{

    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('')
    const [newText, setNewText] = useState('')
    const [blogs, setBlogs] = useState([])


    async function submitBlog(e){
        e.preventDefault()

        let req = await fetch ('http://localhost:5000/api/blog',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title: newTitle, text: newText})
        })

        let data = await req.json()

        if (data.status === 'ok'){
            setNewTitle('');
            setNewText('');
            await populateBlog();
        }
        else{
            alert(data.error)
        }
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
            setBlogs(data.blogs)
        }
    }


    async function deleteBlog(_id){
        console.log(_id)
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

        if (data.status === 'ok'){
            populateBlog();
        }
        else{
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
                <Card className="blogContainer" style={{ width: '18rem' }}>
                <Card.Body>
                    
                    <button className="closeButton" value={blog._id} onClick={(e) => {deleteBlog(e.currentTarget.value); }}><AiFillCloseCircle className="closeIcon"/></button>
                    <Card.Title className="blogtitle">{blog.title}</Card.Title>
                    <Card.Text >
                        <p className="blogdescription">{blog.text}</p>
                    
                    </Card.Text>
                </Card.Body>
                </Card>

            )
        }
    )


    return (
        <div>

            <h2>Create a new Blogpost</h2>
            <form onSubmit={submitBlog}>
                <input type="text" value={newTitle} onChange={(e)=>{setNewTitle(e.target.value)}}></input>
                <input type="text" value={newText} onChange={(e)=>{setNewText(e.target.value)}}></input>
                <input type="submit" text="submit"></input>
            </form>
            <p>{blogs.toString}</p>
            <div style={{background: "black"}}>
            <div className="blogposts">
            {blogList}
            </div>
            </div>

        </div>
    )
}

export default Blog