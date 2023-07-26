import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import { Routes, Route, useParams } from 'react-router-dom';
import { Navigate } from "react-router-dom";
function DetailBlog(props){
const params = useParams();
const [data, setData] = useState({});
const [forms, setForms] = useState([{}]);
const [addForm, setaddForm] = useState(false);
const [FormImageTitle, setImageTitle] = useState([]);
const [deleteForms, SetDelete]  = useState([]);
const [savaChange, SetChange] = useState(false);
const formData = new FormData();
const Id = params.id;
useEffect(()=>{
    axios.get("http://127.0.0.1:8000/blogs/detail",{ 
        headers: { 
            'Content-Type': 'application/json',
        },
        params: {
            'id': Id
        }
    }).then((response)=>{
        setData(response.data);
        console.log(response.data.extra_images);
        setForms(response.data.extra_images);
        setaddForm(true);
    })
}, []);
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
        SetDelete((Deleteform)=>{
          const array_delete_forms = [...Deleteform];
          array_delete_forms.push(forms[index].id);
          return array_delete_forms;
        });
        array.splice(index, 1);
        return array;
    });
}
function sendRequest(event){
  event.preventDefault();
  formData.append("id_blog", Id);
  formData.append("title", data.title);
  formData.append("main_text", data.main_text);
  formData.append("title_image", FormImageTitle);
  formData.append("change_title_image", data.change_title_image);
  formData.append("change_extra_images", data.change_extra_images);
  formData.append("on_delete", JSON.stringify(deleteForms));
  forms.forEach((form, index) => {
    formData.append(`image_${index}`, form.main_images);
  });
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios.post("http://127.0.0.1:8000/blogs/detail",formData,{headers
}).then((response)=>{
    let data = response.data;
    if (data.state == "good"){
      SetChange(true);
    }
  });
}
const handleFileChange = (event,index) => {
    const files = event.target.files;
    console.log(forms);
    setForms(prevForms => {
      const newForms = [...prevForms];
      newForms[index].main_images = files[0];
      if (forms[index].filename != "NEW"){
        SetDelete((Deleteform)=>{
          const array_delete_forms = [...Deleteform];
          array_delete_forms.push(forms[index].id);
          return array_delete_forms;
        });
      }
      newForms[index].filename = files[0].name;
      return newForms;
    });
    setData(prevData => {
      const Data = {...prevData};
      Data.change_extra_images = true;
      return Data; 
    });
};
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
function titleImageHandle(event){
  let file = event.target.files;
  setImageTitle(file[0]);
  setData(prevData => {
    const Data = {...prevData};
    Data.title_image = file[0].name;
    Data.change_title_image = true;
    return Data; 
  });
}
return (
    <div className="container">
      {savaChange && <Navigate to="/blogs" replace={true}/>}
      <form content-type="multipart/form-data" onSubmit={sendRequest}>
        <div className="mt-4">
          <label htmlFor="title">Title:</label>
          <input className="form-control" value={data.title} id="title" onChange={titleHandle}/>
        </div>
        <div className="mt-4">
          <label htmlFor="text">Text of article:</label>
          <textarea className="form-control" value={data.main_text} id="text" Style="height:400px" onChange={textHandle} ></textarea>
        </div>
        <div className="mt-4">
          <label htmlFor="image">Title image:</label>
          <p class="text-muted">Current file: {data.title_image}</p>
          <input className="form-control" id="title_image" type="file" alt="Submit" onChange={titleImageHandle}></input>
        </div>
        <div className="mt-4">
          <label>Main images:</label>
        </div>
        <div className="mt-4">
          {addForm && forms.map((form, index) => (
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
        <button className="btn btn-primary mt-4" type="submit">Save</button>
      </form>
    </div>
  );
}
export default DetailBlog;