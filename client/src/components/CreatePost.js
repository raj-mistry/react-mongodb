
import './CreatePost.css'
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {MdSend} from 'react-icons/md';

const CreatePost = (props) =>{
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");

    function autoResize() {
        const textarea = document.getElementById("postTextArea");
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    
    async function createBlog(){
        let res = await props.sendData({title: postTitle, text: postText})
        if (res.status == 'ok'){
            setPostTitle('');
            setPostText('');
        }
    }

    return (
            <div className="form-group createPost">
                {!props.posted ? <p className="reminder">It looks like you haven't journaled today!</p>: ""}
                <InputGroup className="mb-3">
                    <Form.Control
                    placeholder="Title"
                    aria-label="Username"
                    value={postTitle}
                    onChange={(e) => {setPostTitle(e.target.value)}}
                    aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <br/>
                <textarea style={{resize: "vertical" }}className="form-control" rows="6" placeholder="Text" id="postTextArea" value={postText} onChange={(e) => {setPostText(e.target.value); autoResize();}}></textarea>
                <br/>
                <div className="postButtonContainer">
                <button className="closeButton" onClick={(e) => {createBlog();}}><MdSend className="postButton"/></button>
                </div>
            </div>
    )
}

export default CreatePost