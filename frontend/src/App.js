import axios from "axios";
import React from "react";
import "./App.css"
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import Main from "./Main";
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  
  render(){
    
    return (
      <div>
        <Navbar/>
        <Main/>
      </div>
    );
  }
} 


export default App;
