import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Routes, Route, useParams } from 'react-router-dom';
import moment from 'moment';
import "moment-timezone";
import { event } from "jquery";
function AboutBlog(props){
    const params = useParams();
    const [article, SetArticle] = useState({});
    const [images, SetImages] = useState([]);
    const [clicked, SetClicked] = useState(false);
    const [comment, SetComment] = useState();
    const [comments, SetComments] = useState([]);
    const [feedback, SetFeedBack] = useState();
    const id = Cookies.get("id")===undefined?"undefined":Cookies.get("id");
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/about",{ 
            headers: { 
                'Content-Type': 'application/json',
            },
            params: {
                "state": "get_data",
                'id': params.id}}).then((response) =>{
                        let data = response.data;
                        SetArticle(data);
                        SetImages(data.images);
            });
            axios.get("http://127.0.0.1:8000/create_comment",{ 
                headers: { 
                    'Content-Type': 'application/json',
                },
                params: {
                    "state": "get_data",
                    'blog_id': params.id,
                    "type":"comment"}}).then((response) =>{
                            let data = response.data;
                            SetComments(data);
                });
    }, []);
    function startWrite(event){
        if (id !== "undefined"){
            event.preventDefault();
            SetClicked(true);
        }
        else{
            alert("Log in pls to your account");
        }
    }
    function stopWrite(event){
        event.preventDefault();
        SetClicked(false);
    }
    function createComment(event){
        event.preventDefault();
        axios.post("http://127.0.0.1:8000/create_comment", {"state":"create_comment", "type":"comment", "comment": comment, "blog_id": params.id,"customer_id":id}).then((response)=>{
            let data = response.data;
            if (data.state === "created"){
                window.location.reload(false);
            }
        })
    }
    function setText(event){
        const text = event.target.value;
        SetComment(text);
    }
    function returnRelevetiveTime(string){
        var day = moment(string, "YYYY-MM-DD");
        var iscurrentDate = day.isSame(new Date(), "day");
        if(iscurrentDate) {
            return "Today";
        }
        else{
            return day.fromNow();
        }

    }
    function returnTime(time){
        return String(time).slice(0,5);
    }
    function writeAnswer(event, index){
        event.preventDefault()
        if (id !== "undefined"){
        SetComments((review)=>{
            let reviews = [...review];
            reviews[index].write = true;
            return reviews;
        })
        }
        else{
            alert("Log in pls to your account");
        }
        
    }
    function stopAnswer(event, index){
        event.preventDefault()
        SetComments((review)=>{
            let reviews = [...review];
            reviews[index].write = false;
            return reviews;
        })
    }
    function setAnswer(event){
        let text = event.target.value;
        event.preventDefault();
        SetFeedBack(text);
    }
    function createAnswer(event, comment_id){
        event.preventDefault();
        axios.post("http://127.0.0.1:8000/create_comment", {"state":"create_answer", "type":"answer", "comment": feedback, "answer_on": comment_id, "blog_id": params.id,"customer_id":id}).then((response)=>{
            let data = response.data;
            if (data.state === "created"){
                window.location.reload(false);
            }
        })

    }
    return(
        <div className="container">
           <div className="row">
                <div className="d-flex justify-content-center">
                    <h1>{article.title}</h1>
                </div>
           </div> 
           <div className="row">
                <img src={"http://127.0.0.1:8000/media/"+ article.title_image} alt="Title"></img>
           </div> 
           <div className="row">
                <p className="mt-3" Style="font-size: 20px;">{article.main_text}</p>
           </div>
           <div className="row">
                {images.map((image)=>(
                    <img src={"http://127.0.0.1:8000/media/"+image.main_images} alt="Main"></img>
                ))}
           </div>
           <div className="row">
                <div className="d-flex justify-content-end mt-3">
                    <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" className="rounded-circle" Style="width: 120px;" alt="Avatar"></img>
                    <div class="d-flex align-items-center">
                        <h6 className="fw-bold ms-1">{article.last_name} {article.first_name} </h6>
                    </div>
                </div>
                
           </div>
           <div className="row">
                <h3>Reviews:</h3>
                <div className="card-footer py-3 border-0">
                    <div className="d-flex flex-start w-100">
                        {/* <img className="rounded-circle shadow-1-strong me-3"
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp" alt="avatar" width="40"
                            height="40" /> */}
                        <div className="form-outline w-100">
                            <textarea className="form-control" id="textAreaExample" rows="4" onClick={startWrite} onChange={setText}></textarea>
                            <label className="form-label" for="textAreaExample">Your Message</label>
                        </div>
                    </div>
                    {clicked &&
                        <div className="float-end mt-2 pt-1">
                            <button type="button" className="btn btn-primary btn-sm me-2" onClick={createComment}>Post comment</button>
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={stopWrite}>Cancel</button>
                        </div>
                    }
                </div>
           </div>
                { comments.map((com,index)=>(
                    <div>
                    <div class="row">
                        <div class="col-md-12 mt-3 mb-3">
                            <div class="d-flex flex-start">
                            {/* <img class="rounded-circle shadow-1-strong me-3"
                                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width="65"
                                height="65" /> */}
                                <div class="flex-grow-1 flex-shrink-1">
                                    <div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <p class="mb-1">
                                        {com.last_name} {com.first_name} <span class="small">{returnRelevetiveTime(com.create_date)} {returnTime(com.create_time)} </span>
                                        </p>
                                        <a href="#!" Style="text-decoration: none;" onClick={(event) => writeAnswer(event,index)}><i class="fa fa-reply fa-xs"></i><span class="small"> reply</span></a>
                                    </div>
                                    <p class="small mb-0">
                                        {com.comment}
                                    </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {com.write && 
                        <div>
                            <div className="row ms-2">
                                <div className="col-md-12">
                                    <div className="card-footer py-3 border-0">
                                        <div className="d-flex flex-start w-100">
                                            {/* <img className="rounded-circle shadow-1-strong me-3"
                                                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp" alt="avatar" width="40"
                                                height="40" /> */}
                                            <div className="form-outline w-100">
                                                <textarea className="form-control" id="textAreaExample" rows="4" onChange={setAnswer}></textarea>
                                                <label className="form-label" for="textAreaExample">Your Message</label>
                                            </div>
                                        </div>
                                        <div className="float-end mt-2 pt-1">
                                            <button type="button" className="btn btn-primary btn-sm me-2" onClick={(event) => createAnswer(event,com.id)}>Post answer</button>
                                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={(event)=> stopAnswer(event,index)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { com.answers.map((answer,index)=>(
                                    <div className="row ms-4">
                                        <div class="col-md-12 mt-3 mb-3">
                                            <div class="d-flex flex-start">
                                                {/* <img class="rounded-circle shadow-1-strong me-3"
                                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width="65"
                                                    height="65" /> */}
                                                <div class="flex-grow-1 flex-shrink-1">
                                                    <div>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <p class="mb-1">
                                                        {answer.last_name} {answer.first_name} <span class="small">{returnRelevetiveTime(answer.create_date)} {returnTime(answer.create_time)} </span>
                                                        </p>
                                                    </div>
                                                    <p class="small mb-0">
                                                        {answer.comment}
                                                    </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                            ))
                            }
                            
                        </div>
                    }
                    </div>
                ))
                }
        </div>
    )
}
export default AboutBlog;