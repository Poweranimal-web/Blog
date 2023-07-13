import axios from "axios";
import React from "react";
import "./Reg.css"
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
class Reg extends React.Component{
    constructor(props){
        super(props);
        this.state = {hide: true, password: "", email: "", surname:"",name:"",log: false}
        this.addform = this.addform.bind(this);
        this.formEmail = this.formEmail.bind(this);
        this.formName = this.formName.bind(this);
        this.formSurname = this.formSurname.bind(this);
        this.sendreqest = this.sendreqest.bind(this);
    }
    sendreqest(e){
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json"
        };
        axios.post("http://127.0.0.1:8000/reg",{
                "last_name": this.state.surname,
                "first_name": this.state.name,
                "email": this.state.email,
                "password": this.state.password,
            },{headers,
               xsrfCookieName: 'XSRF-TOKEN',
               xsrfHeaderName: 'HTTP_X_XSRF_TOKEN'
            }).then((response)=>{
                Cookies.set('token', response.data.token, { expires: 7 });
                this.setState({log: true})
            }).catch((e) => {
                console.log(e);
                //this console logs Error: Network Error
                // at createError (monkeytype.js:formatted:35086:25)
                // at XMLHttpRequest.handleError (monkeytype.js:formatted:34457:28)
            });

    }
    formName(e){
        let text = e.target.value;
        this.setState({
            name: text
        });

    }
    formSurname(e){
        let text = e.target.value;
        this.setState({
            surname: text
        });

    }
    formEmail(e){
        let text = e.target.value;
        this.setState({
            email: text
        });

    }
    addform(e){
        let text = e.target.value;
        let password = text;
        this.setState({
            password: password
        });
        let len = text.length;
        if (len > 0){
            this.setState({
                hide: false
            });
        }
        else{
            this.setState({
                hide: true
            });
        }

    }

    render(){
        const hide = this.state.hide;
        const log = this.state.log;
        return(
            <div className="d-flex align-items-center justify-content-center vh-100">
                <form className="w-50" onSubmit={this.sendreqest}>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="first name">Name</label>
                        <input className="form-control" id="first name" placeholder="Enter your name" onChange={this.formName}/>
                    </div>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="last name">Last Name</label>
                        <input className="form-control" id="last name" placeholder="Enter your surname" onChange={this.formSurname} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="email">Last Name</label>
                        <input className="form-control" id="email" type="email" placeholder="Enter email" onChange={this.formEmail} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" id="password" type="password" placeholder="Enter password" onChange={this.addform}/>
                    </div>
                    { log && <Navigate to="/" replace={true} />
                    }
                    { !hide && 
                        <div className="mb-2">
                            <label className="form-label" htmlFor="repeat_password">Repeat Password</label>
                            <input className="form-control" id="repeat_password" type="password" placeholder="Enter password again"/>
                        </div>
                    }
                    <button className="btn btn-success" type="submit">Continue</button>
                </form>
            </div>
        );
    }
    
}
export default Reg;
