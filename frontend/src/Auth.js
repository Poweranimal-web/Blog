import axios from "axios";
import React from "react";
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";
class Auth extends React.Component{
    constructor(props){
        super(props);
        this.state = {email: "", password:"", log:false}
        this.formEmail = this.formEmail.bind(this);
        this.formPassword = this.formPassword.bind(this);
        this.sendrequest = this.sendrequest.bind(this);
    }
    sendrequest(e){
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json"
        };
        axios.post("http://127.0.0.1:8000/auth",{
                "email": this.state.email,
                "password": this.state.password,
            },{headers
            }).then((response)=>{
                let data = response.data;
                console.log(data);
                if (data.state === "exist"){
                    Cookies.set("token",data.token);
                    this.setState({
                        log: true
                    });
                }
                // Cookies.set('token', response.data.token, { expires: 7 });
            }).catch((e) => {
                console.log(e);
                //this console logs Error: Network Error
                // at createError (monkeytype.js:formatted:35086:25)
                // at XMLHttpRequest.handleError (monkeytype.js:formatted:34457:28)
            });

    }
    formEmail(e){
        let text = e.target.value;
        this.setState({email: text});
    }
    formPassword(e){
        let text = e.target.value;
        this.setState({password: text});
    }
    render(){
        const log = this.state.log;
        return(
        <div className="d-flex align-items-center justify-content-center vh-100">
            <form className="w-50" onSubmit={this.sendrequest}>
                <div className="mb-3 mt-1">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id ="email"  className="form-control" onChange={this.formEmail}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" id="password" className="form-control" onChange={this.formPassword}/>
                </div>
                <button className="btn btn-success" type="submit">Continue</button>
                {log && <Navigate to="/" replace={true}/>}
            </form>
        </div>
        );
    }
}
export default Auth