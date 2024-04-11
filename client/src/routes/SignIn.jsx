import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Spinner
} from "@material-tailwind/react";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // redux helping in reducing the states created

  const { loading, error } = useSelector((state) => state.user) // user is the name of state created in userSlice
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const notifySuccess = () => toast.success("sign in done!");
  const notifyFail = () => toast.error("Please try again.")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      await axios.post('/api/auth/signin', formData).then((response) => {
        // console.log(response);
        dispatch(signInSuccess(response?.data?.data));
        notifySuccess();
        setTimeout(() => {
          navigate('/');
        }, 2000)
      }).catch((err) => {
        // console.log(err)
        dispatch(signInFailure(err.response?.data?.message));
        notifyFail();
        return;
      })
    } catch (error) {
      dispatch(signInFailure(error));
      // console.log('failed here');
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <Button type='submit' disabled = {loading} className='text-xs'>
          {loading ? <Spinner /> : 'Sign In'}
        </Button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/signup"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
    </div>
  )
}

export default SignIn