import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
function CreateBlog(){
const [data, setData] = useState({});
const [forms, setForms] = useState([]);
const [saveChange, SetChange] = useState(false);
const formData = new FormData();
function titleHandle(event){
    let text = event.target.value;
    setData(prevData => {
      const Data = {...prevData};
      Data.title = text;
      return Data; 
    });
}
function textHandle(event){
  let text = event.target.value;
  setData(prevData => {
    const Data = {...prevData};
    Data.main_text = text;
    return Data; 
  });
}
const handleFileChange = (event,index) => {
    const files = event.target.files;
    setForms(prevForms => {
      const newForms = [...prevForms];
      newForms[index].main_images = files[0];
      newForms[index].filename = files[0].name;
      return newForms;
    });
};
function sendRequest(event){
    event.preventDefault();
    formData.append("id_customer", Cookies.get('id'));
    formData.append("title", data.title);
    formData.append("main_text", data.main_text);
    formData.append("title_image", data.title_image);
    forms.forEach((form, index) => {
      formData.append(`image_${index}`, form.main_images);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios.post("http://127.0.0.1:8000/blogs/create",formData,{headers
  }).then((response)=>{
      let data = response.data;
      if (data.state == "good"){
        SetChange(true);
      }
    });
  }
function titleImageHandle(event){
  let file = event.target.files;
  setData(prevData => {
    const Data = {...prevData};
    Data.title_image = file[0];
    return Data; 
  });
}
function addInput(e){
    e.preventDefault();
    setForms((Forms) =>{
        const array = [...Forms];
        array.push({'filename': "NEW"});
        return array;
    });
};
function deleteInput(e, index) {
    e.preventDefault();
    setForms((Forms) =>{
        const array = [...Forms];
        array.splice(index, 1);
        return array;
    });
}
return(
        <div className="container">
            {saveChange && <Navigate to="/blogs" replace={true}/>}
            <form content-type="multipart/form-data" onSubmit={sendRequest}>
                <div className="mt-4">
                    <label htmlFor="title">Title:</label>
                    <input className="form-control" id="title" onChange={titleHandle} required/>
                </div>
                <div className="mt-4">
                    <label htmlFor="text">Text of article:</label>
                    <textarea className="form-control" id="text" Style="height:400px" onChange={textHandle} required></textarea>
                </div>
                <div className="mt-4">
                    <label htmlFor="image">Title image:</label>
                    <input className="form-control" id="title_image" type="file" alt="Submit" onChange={titleImageHandle} required></input>
                </div>
                <div className="mt-4">
                    <label>Main images:</label>
                </div>
                <div className="mt-4">
                {forms.map((form, index) => (
                    <div key={index} className="d-flex flex-column mt-2 mb-2">
                        <p class="text-muted">Current file: {form.filename}</p>
                        <div className="d-flex">
                            <input className="form-control" type="file" id={"service" + (index+1)} name={"service" + (index+1)} onChange={(event) => handleFileChange(event,index)}></input>
                            <button className="btn btn-danger ms-2" onClick={(event) => deleteInput(event,index)}>Remove</button>
                        </div>
                    </div>
                ))}
                {forms.length < 4 && <button className="btn btn-success mt-2" onClick={addInput}>Add image</button>}
                </div>
                <button className="btn btn-primary mt-4" type="submit">Create</button>
            </form>
        </div>
);
}
export default CreateBlog; 