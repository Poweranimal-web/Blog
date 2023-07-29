import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css"
import "./Main.css"
import Cookies from 'js-cookie';
import { extend } from "jquery";
import moment from 'moment';
import "moment-timezone"; 

function Main(){
    const [blogs, SetBlogs] = useState([]);
    const fixedDate = "2023-07-28";
    useEffect(() =>{
        axios.post("http://127.0.0.1:8000/main", {"state": "get_data"}).then((response)=>{
            let data = response.data;
            console.log(data);
            SetBlogs(data);
        });
    },[]);
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
        return time.slice(0,5);
    }
    return(
                <div className="container">
                    <div className="row">
                        {blogs.map(blog =>(
                                <div className="col-12 mt-3">
                                    <div className="card">
                                        <img className="card-img-top" src={"http://127.0.0.1:8000/media/"+ blog.title_image} alt="Card" Style="height: 500px"/>
                                        <div className="card-body">
                                            <a href={"/blog/"+blog.id} Style="text-decoration: none; color:black;" ><h4 className="card-title">{blog.title}</h4></a>
                                            <p className="card-text text-truncate">{blog.main_text}</p>
                                            <div class="d-flex">
                                                <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" className="rounded-circle me-3" Style="width: 60px;" alt="Avatar" />
                                                <div class="d-flex flex-column">
                                                    <h6 className="fw-bold mb-1">{blog.last_name} {blog.first_name}</h6>
                                                    <p className="text-muted">{returnRelevetiveTime(blog.create_date)} {returnTime(blog.create_time)}</p>
                                                </div>
                                                <div className="ms-auto">
                                                    <a href="#!" Style="text-decoration: none;" className="link-muted me-2"><i className="fa fa-thumbs-up me-1" Style="font-size: 30px;"></i>{blog.likes}</a>
                                                    <a href="#!" Style="text-decoration: none;" className="link-muted"><i className="fa fa-thumbs-down me-1" Style="font-size: 30px;"></i>{blog.dislikes}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        ))}
                    </div>
                </div>
  );
    // return(<h1>Hello world</h1>);
}
export default Main;