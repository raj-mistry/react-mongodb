import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Blog from './Blog'

const Home = () =>{

    const navigate = useNavigate();
    const [quote,setQuote] = useState('')
    const [newQuote, setNewQuote] = useState('')


    async function submitQuote(e){
        e.preventDefault()

        let req = await fetch ('http://localhost:5000/api/quote',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({quote: newQuote})
        })

        let data = await req.json()
        console.log(data)

        if (data.status === 'ok'){
            setNewQuote('');
            await populateQuote();
            alert('quote successfully submitted')
        }
        else{
            alert(data.error)
        }
    }

    async function populateQuote(){
        const req = await fetch('http://localhost:5000/api/quote', 
        {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })

        const data = await req.json()
        console.log(data)
        if (data.status === 'ok'){
            setQuote(data.quote)
        }
    }


    useEffect(()=>{
        console.log('useffect called')
        const token = localStorage.getItem('token')
        if (token){
            const user = jwtDecode(token)

            if (!user){
                localStorage.removeItem('token')
                navigate.replace('/login')
            } else{
                populateQuote()
            }
        }
    }, [])




    return (
        <div>
            <h1>Your quote: {quote || 'No quote found'}</h1>

            <h2>Set Quote</h2>
            <form onSubmit={submitQuote}>
                <input type="text" value={newQuote} onChange={(e)=>{setNewQuote(e.target.value)}}></input>
                <input type="submit" text="submit"></input>
            </form>

            <Blog></Blog>
        </div>
    )
}

export default Home