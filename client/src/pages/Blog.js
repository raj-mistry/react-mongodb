import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const Blog = () =>{

    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('')
    const [newText, setNewText] = useState('')
    const [blogs, setBlogs] = useState([{title: "Hi", text: "Hello"}])


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
            alert('quote successfully submitted')
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
                alert('success')
                populateBlog()
            }
        }
    }, [])


    const tableRows=blogs.map(
        (blog)=>{
            return( 
              <div key={blog._id}>
                <h1>{blog.title}</h1>
                <p>{blog.text}</p>
                <button value={blog._id} onClick={(e)=> deleteBlog(e.target.value)}>Delete</button>
              </div> 
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


                {tableRows}

        </div>
    )
}

export default Blog