import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom'
import "./App.css"
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {last_name:"", first_name:""}
    
  }
  componentDidMount(){
    axios.get("http://127.0.0.1:8000/").then((response)=> {
        var data = response.data;
        // this.setState({
        //   name: data.Name,
        //   status: data.status
        // });

      }
        
    );
  }
  render(){
    return (
      <nav className="navbar navbar-inline navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="/#">Website</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#content">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="content">
              <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="/#">Zero</a>  
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#">One</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#">Two</a>
                  </li>
              </ul>
            </div>
            <div className="collapse navbar-collapse" id="content">
              <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <a className="nav-link" href="/#">Log in</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/reg">Sign up</a>
                    </li>
              </ul>
            </div>
        </div>
      </nav>

    );
  }
} 


export default App;
