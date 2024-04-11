import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OAuth from '../components/OAuth'
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Spinner
} from '@material-tailwind/react';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData, // keeping the previous data
      [e.target.id]: e.target.value, // adding the value to the id whos data is changed
    })
  }
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await axios.post('/api/auth/signup', formData).then((response) => {
      // console.log(response?.data?.message);
      setLoading(false);
      setError(null);
      navigate('/signin');
    }).catch((err) => {
      // console.log(err);
      setError(err.response?.data?.message);
      setLoading(false);
      return;
    })
  }

  return (
    // <div className='p-3 max-w-lg mx-auto'>
    //   <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
    //   <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
    //     <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
    //     <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
    //     <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
    //     <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
    //       {loading ? 'please wait...' : 'Sign Up'}
    //     </button>
    //     <OAuth />
    //   </form>
    //   <div className='flex gap-2 mt-5'>
    //     <p>Have an account?</p>
    //     <Link to={"/signin"}>
    //       <span className='text-blue-700'>Sign in</span>
    //     </Link>
    //   </div>
    //   {error && <p className='text-red-700 mt-5'>{error}</p>}
    // </div>
    <div className='md:p-3 p-5 max-w-lg mx-auto'>
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              id="username"
              onChange={handleChange}
              placeholder="Name"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              id="email"
              onChange={handleChange}
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              id="password"
              onChange={handleChange}
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button className="mt-6 mb-3" disabled={loading} fullWidth type="submit">
            {loading ? <Spinner size="sm" /> : "Sign Up"}
          </Button>
          <OAuth />
            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-gray-900">
                Sign In
              </Link>
            </Typography>
        </form>
        {error && <p className='text-red-700 mt-5'>{error}</p>}
      </Card>
    </div>
  )
}

export default SignUp