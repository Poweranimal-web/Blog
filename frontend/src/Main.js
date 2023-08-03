import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css"
import "./Main.css"
import Cookies from 'js-cookie';
import { event, extend } from "jquery";
import moment from 'moment';
import "moment-timezone"; 
function Main(){
    const [blogs, SetBlogs] = useState([]);
    const [loading, SetLoad] = useState(false);
    const [start, SetStart] = useState(0);
    const [end, SetEnd] = useState(2);
    const id = Cookies.get("id")===undefined?"undefined":Cookies.get("id");
    useEffect(() =>{
        axios.post("http://127.0.0.1:8000/main", {"state": "get_data", "end": end, "start": start, "customer_id":id}).then((response)=>{
            let data = response.data;
            SetBlogs(data);
            console.log(data);
        });
    },[]);
    function downloadContent(){
        if (loading === true){
                axios.post("http://127.0.0.1:8000/main", {"state": "get_data","start":start, "end":end, "customer_id":id}).then((response)=>{
                let data = response.data;
                if (data.length!==0){
                    data.map((item,index)=>(
                        SetBlogs((PreveousBlogs)=>{
                            const array = [...PreveousBlogs];
                            array.push(item);
                            return array;
                        })
                    ));
                    
                }
                SetLoad(false);
            });
        }
    }
    function handleScroll(){
        if (document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight){
            SetLoad(true);
            SetStart(start+2);
            SetEnd(end+2);
        }
    }
    window.addEventListener("scroll", handleScroll);
    useEffect(()=>{
        downloadContent();
    },[loading])
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
    function putLike(event, id_blog, index) {
        event.preventDefault();
        console.log(Cookies.get("token"));
        if (Cookies.get("token") != undefined){
            const have_like = blogs[index].like;
            const have_dislike = blogs[index].dislike;
            if (!have_like && have_dislike){
                    axios.post("http://127.0.0.1:8000/main", {"state": "change_on_like", "blog_id":id_blog, "customer_id": id}).then((response)=>{
                    let data = response.data;
                    if (data.state === "put"){
                        SetBlogs((Blogs)=>{
                            const array = [...Blogs];
                            array[index].likes = data.likes;
                            array[index].dislikes = data.dislikes;
                            array[index].like = true;
                            array[index].dislike = false;
                            return array;
                        });
    
                    }
    
                });
            }
            else if (!have_like){
                axios.post("http://127.0.0.1:8000/main", {"state": "like", "blog_id":id_blog, "customer_id": id}).then((response)=>{
                    let data = response.data;
                    if (data.state === "put"){
                        SetBlogs((Blogs)=>{
                            const array = [...Blogs];
                            array[index].likes = data.likes;
                            array[index].dislikes =  data.dislikes;
                            array[index].like = true;
                            array[index].dislike = false;
                            return array;
                        });
    
                    }
    
                });
    
            }
        }
        
    }
    function putDislike(event, id_blog, index) {
        event.preventDefault();
        if (Cookies.get("token") != undefined){
            const have_like = blogs[index].like;
            const have_dislike = blogs[index].dislike;
            if (!have_dislike && have_like){
                    axios.post("http://127.0.0.1:8000/main", {"state": "change_on_dislike", "blog_id":id_blog, "customer_id": id}).then((response)=>{
                    let data = response.data;
                    if (data.state === "put"){
                        SetBlogs((Blogs)=>{
                            const array = [...Blogs];
                            array[index].dislikes = data.dislikes;
                            array[index].likes = data.likes;
                            array[index].like = false;
                            array[index].dislike = true;
                            return array;
                        });
                    }
                    
                })
            }
            else if (!have_dislike){
                axios.post("http://127.0.0.1:8000/main", {"state": "dislike", "blog_id":id_blog, "customer_id": id}).then((response)=>{
                    let data = response.data;
                    if (data.state === "put"){
                        SetBlogs((Blogs)=>{
                            const array = [...Blogs];
                            array[index].dislikes = data.dislikes;
                            array[index].likes = data.likes;
                            array[index].like = false;
                            array[index].dislike = true;
                            return array;
                        });
                    }
                    
                })
            }
        }
    }
    function returnTime(time){
        return String(time).slice(0,5);
    }
    return(
                <div className="container" id="main">
                    <div className="row">
                        {blogs.map((blog, index) =>(
                                <div key={index} className="col-12 mt-3 mb-4">
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
                                                    <a href="#!" Style="text-decoration: none;" className="link-muted me-2" onClick={(event) => putLike(event, blog.id, index)}><i className={blog.like? "fa fa-thumbs-up me-1 active":"fa fa-thumbs-up me-1"} Style="font-size: 30px;"></i>{blog.likes}</a>
                                                    <a href="#!" Style="text-decoration: none;" className="link-muted" onClick={(event) => putDislike(event, blog.id, index)}><i className={blog.dislike? "fa fa-thumbs-down me-1 active":"fa fa-thumbs-down me-1"} Style="font-size: 30px;"></i>{blog.dislikes}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        ))}
                        {/* {loading && <button className="btn" Style="border:none" disabled>
                                <span className="spinner-border spinner-border-sm"></span>
                                Loading..
                            </button>
                        } */}
                    </div>
                </div>
  );
}
export default Main;