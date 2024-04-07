import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OAuth from '../components/OAuth'

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
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await axios.post('https://real-estate-rho-two.vercel.app/auth/signup', formData).then((response) => {
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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'please wait...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp