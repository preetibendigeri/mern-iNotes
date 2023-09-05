import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'

const Signup = (props) => {
  const[credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""})
  let navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {name,email,password}=credentials;
    const response = await fetch("http://127.0.0.1:8890/api/auth/createuser", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({name,email,password })
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth token & redirect
      localStorage.setItem('token', json.authtoken)
      navigate("/")
      props.showAlert("Account created successful","success")
    }
    else {
      props.showAlert("Invalid credentials","danger")
    }

  }
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })


  }
  return (
    <div className='container mt-3'>
      <h2>Signup to create account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" onChange={handleChange} name="name"aria-describedby="emailHelp" />

        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Id</label>
          <input type="email" className="form-control" id="email" onChange={handleChange} aria-describedby="emailHelp" name="email" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" onChange={handleChange} className="form-control" name="password" id="password" minLength={5}required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" onChange={handleChange} className="form-control" name="cpassword" id="cpassword"  minLength={5}required/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
