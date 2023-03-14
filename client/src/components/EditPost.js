
import './EditPost.css'
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {MdSend} from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import {AiFillCloseCircle} from 'react-icons/ai';

const EditPost = (props) =>{
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");

    function autoResize() {
        const textarea = document.getElementById("postTextArea");
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }

    function handleClose(){
        setPostText("");
        setPostTitle("");
        props.closeModal();
    }
    
    function handleUpdate(){
        props.handleUpdate();
    }
    
    async function updateBlog(){
        try{
        let req = await fetch ('http://localhost:5000/api/blog',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({_id: props.blogId, title: postTitle, text: postText})
        })
        let data = await req.json();
        if (data.status == 'ok'){
            handleUpdate();
            handleClose();
    
        }
        else{
            alert("update failed")
        }
        }
        catch(e){
            alert(e);
        }

    }

    useEffect(()=>{
        populateFields();
    }, [])

    async function populateFields(){
        try{
            const req = await fetch('http://localhost:5000/api/blog/'+String(props.blogId), 
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            const data = await req.json();
            if (data.status =='ok'){
                console.log(data);
                setPostTitle(data.blog.title);
                setPostText(data.blog.text);
            }
        }
        catch(error){
            alert(error)
        }
    }

    return (
        <div >
        <Modal centered 
        dialogClassName="my-modal" 
        show={true} 
        onHide={handleClose} 
        animation={true}>

            <Modal.Body >
            <div className="form-group">
                <button className="editCloseButton" onClick={(e) => {handleClose(); }}><AiFillCloseCircle className="closeIcon"/></button>
                <InputGroup className="mb-3 form-control">
                    <Form.Control
                    placeholder="Title"
                    aria-label="Username"
                    value={postTitle}
                    onChange={(e) => {setPostTitle(e.target.value)}}
                    aria-describedby="basic-addon1"
                    className="blogTitle"
                    />
                </InputGroup>
                <textarea style={{resize: "vertical" }}className="form-control" rows="6" placeholder="Text" id="postTextArea" value={postText} onChange={(e) => {setPostText(e.target.value); autoResize();}}></textarea>
                <br/>
                <div className="postButtonContainer">
                <button className="sendButton" onClick={(e) => {updateBlog();}}><MdSend className="postButton"/></button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
        </div>
            
    )
}

export default EditPost