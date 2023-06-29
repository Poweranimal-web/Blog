import axios from "axios";
import React from "react";
class Reg extends React.Component{
    constructor(props){
        super(props);
        this.state = {}

    }
    render(){
        return(
            <form className="form">
                <div className="mt-2 mb-2">
                    <label className="form-label" for="first name">Name</label>
                    <input className="form-control" id="first name" placeholder="Enter your name"></input>
                </div>
            </form>
        );
    }
    
}
export default Reg;