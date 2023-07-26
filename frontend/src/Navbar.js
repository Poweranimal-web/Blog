import axios from "axios";
import React from "react";
import "./App.css"
import Cookies from 'js-cookie';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blogs from "./Blogs";
import DetailBlog from "./Detail_Blog";
class Navbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {last_name:"", first_name:"",email: "" ,login: false, token:  Cookies.get('token')===undefined? "" : Cookies.get('token') }
    this.csrfCookie = Cookies.get('csrftoken'); 
    this.logout = this.logout.bind(this);
  }
  componentDidMount(){
    const config = {
      headers: { 'Content-Type': 'application/json', 
                //  "csrftoken": this.csrfCookie
    }
  };
  const bodyParameters ={"token": this.state.token, "state": "check_auth"};
  console.log(bodyParameters);
    axios.post("http://127.0.0.1:8000/",bodyParameters, config
    ).then((response)=> 
    {
      let data = response.data;
      console.log(data);
      Cookies.set("id",data.id);
      if (data.state === "exist"){
        this.setState({
          last_name: data.last_name,
          first_name: data.first_name,
          email: data.email,
          login: true
        });
        this.forceUpdate()
      }
    }).catch((e) => {
      console.error(e.response.data);  
    });
  }
  logout(){
    this.setState({last_name:"", first_name:"",email: "" ,login: false, token: ""});
    Cookies.remove("token")
  }
  render(){
    const login = this.state.login;
    let data = this.state;
    return (
      <div>
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
            { login===false &&
              <div className="collapse navbar-collapse" id="content">
                <ul className="navbar-nav ms-auto">
                      <li className="nav-item">
                        <a className="nav-link" href="/auth">Log in</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/reg">Sign up</a>
                      </li>
                </ul>
              </div>
            }
            { login===true &&
              <div className="collapse navbar-collapse ms-auto" id="content">
                  <div className="dropdown ms-auto">
                      <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">Welcome, {data.last_name} {data.first_name}</button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="/#">Link 1</a></li>
                        <li><a className="dropdown-item" href="/blogs">Your blogs</a></li>
                        <li><a className="dropdown-item" href="/" onClick={this.logout}>Logout</a></li>
                      </ul>
                  </div>
              </div>

            }
        </div>
      </nav>
          { login &&
          <Routes>
              <Route path="/blogs" element={<Blogs email={data.email}/>}>
              </Route>
              <Route path="/blogs/:id"  element={<DetailBlog/>}/>
          </Routes>
         }
      </div>

    );
  }
} 


export default Navbar;