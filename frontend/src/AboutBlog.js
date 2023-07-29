import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Routes, Route, useParams } from 'react-router-dom';
function AboutBlog(props){
    const params = useParams();
    const [article, SetArticle] = useState({});
    const [images, SetImages] = useState([]);
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/about",{ 
            headers: { 
                'Content-Type': 'application/json',
            },
            params: {
                "state": "get_data",
                'id': params.id}}).then((response) =>{
                        let data = response.data;
                        console.log(data);
                        SetArticle(data);
                        SetImages(data.images);
            });
    }, []);
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
        </div>
    )
}
export default AboutBlog;