
import {React} from 'react';
import { useState } from 'react';


function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function loginUser(event){
        event.preventDefault()//prevent refresh
        const response = await fetch('/api/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })

        const data = await response.json()
        console.log(data);

        if (data.user){
            localStorage.setItem('token', data.user)
            alert('Login successful')
            window.location.href = '/home'
        }
        else{
            if (data.error){
                alert(data.error);
            }
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={loginUser}>
                <input 
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                type="email" 
                placeholder="Email"/>
                <br/>
                <input 
                type="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                placeholder="Password"/>
                <input type="submit" value="Login"/>
            </form>
        </div>
    )
}

export default Login;