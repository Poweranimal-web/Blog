import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
function Blogs(props){
const [addblock, setState] = React.useState(false);
const [data, setData] = React.useState([]);
 useEffect(()=>{
axios.post("http://127.0.0.1:8000/blogs", {"state": "get_data" ,"email":props.email}).then((response)=>{
            const answer = response.data;
            if (answer.state=="exist"){
                setState(true);
                setData(answer.data);
            }
        });
},[]);
function Delete(event, id){
    event.preventDefault();
    axios.post("http://127.0.0.1:8000/blogs/delete", {"id": id}).then((response)=>{
            const answer = response.data;
            if (answer.state == "deleted"){
                window.location.reload();
            }
    });
}
return(
    <div className="container">
            <div className="col-md-12">
                <a href="/blogs/create"><button className="btn btn-primary mt-4 w-75">+</button></a>
            </div>
            {addblock && data.map((item) =>
            <div className="col-md-12">
                <div class="card w-75 mt-3" >
                    <img className="card-img-top" src={"http://127.0.0.1:8000"+"/media/"+item.title_image} height={400} alt="Card"/>
                    <div className="card-body">
                        <h4 className="card-title">{item.title}</h4>
                        <p className="card-text text-truncate">{item.main_text}</p>
                        <div className="d-flex">
                            <a href={"/blogs/"+ item.id}><button className="btn btn-primary">Change</button></a>
                            <button className="btn btn-danger ms-auto" onClick={(event) => Delete(event, item.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        
    </div>
);
}
export default Blogs;