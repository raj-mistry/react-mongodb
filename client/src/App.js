import React, { Component } from 'react';
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Blog from './pages/Blog';
import './App.css'


class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" exact element={<Login/>}/>
            <Route path="/register" exact element={<Register/>}/>
            <Route path="/home" exact element={<Home/>}/>
            <Route path="/blog" exact element={<Blog/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;