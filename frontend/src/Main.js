import axios from "axios";
import React, { useEffect } from "react";
import "./App.css"
import Cookies from 'js-cookie';
import { extend } from "jquery";

function Main(){
    useEffect(() =>{
        axios.post("http://127.0.0.1:8000/", {"state": "get_data"}).then((response)=>{
            let data = response.data;
            console.log(data);
        });
    },[]);
    // return(<h1>Hello world</h1>);
}
export default Main;