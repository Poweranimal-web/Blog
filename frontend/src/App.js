import axios from "axios";
import React from "react";
import "./App.css"
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import Main from "./Main";
import AboutBlog from "./AboutBlog";
import { BrowserRouter, Routes, Route } from "react-router-dom";
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  
  render(){
    
    return (
        <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/blog/:id" element={<AboutBlog/>} />
            </Routes>
        </div>  

    
    );
  }
} 


export default App;
