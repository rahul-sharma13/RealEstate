import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFail, deleteUserFail, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFail, signOutUserSuccess } from '../redux/user/userSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null); // reference created to do the input functionality by clicking on the profile img

  // to handle the image upload, it is done using storage of firebase
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  // console.log(filePerc);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); // to get percentage,error etc of file uploaded

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
      // console.log('upload is ' + progress + '%done');
    },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      await axios.post(`/api/users/update/${currentUser._id}`, formData).then((response) => {
        dispatch(updateUserSuccess(response?.data?.data));
      }).catch((error) => {
        dispatch(updateUserFail(error))
      })
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      await axios.delete(`/api/users/delete/${currentUser?._id}`).then((response) => {
        dispatch(deleteUserSuccess(response?.data));
      }).catch((error) => {
        console.log(error);
      })
    } catch (error) {
      dispatch(deleteUserFail(error?.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await axios.get('api/auth/signOut').then((response) => {
        dispatch(signOutUserSuccess(response?.data))
      })
    } catch (error) {
      dispatch(signOutUserFail(error));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      await axios.get(`/api/users/listings/${currentUser._id}`)
        .then((response) => {
          // console.log(response);
          setUserListing(response?.data?.data);
        })
        .catch((error) => {
          setShowListingError(true);
        })
    } catch (error) {
      setShowListingError(true);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />

        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser?.avatar}
          alt='profile-img'
          className='rounded-full w-24 h-24 object-cover cursor-pointer self-center'
        />

        {/* to show the upload completion */}
        <p className='text-center'>
          {fileUploadError ? <span className='text-red-700'> error image upload(image must be less than 2MB)</span>
            :
            filePerc > 0 && filePerc < 100 ?
              <span className='text-slate-700'>{`
              Uploading ${filePerc}%
            `}</span>
              :
              filePerc === 100 ?
                <span className='text-green-700'>Upload completed</span>
                :
                ""
          }
        </p>

        <input type='text' id='username' placeholder='username' className='border p-3 rounded-lg' defaultValue={currentUser?.username} onChange={handleChange} />
        <input type='email' id='email' placeholder='email' className='border p-3 rounded-lg' defaultValue={currentUser?.email} onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'loading...' : 'Update'}
        </button>
        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>

      <button className='text-green-700 w-full' onClick={handleShowListings}>Show Listings</button>

      <p className='text-red-700 mt-5'>{showListingError ? 'Error showing listings' : ''}</p>

      {userListing && userListing.length > 0 &&
        userListing.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center mb-3 gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img 
                src={listing.imageUrls[0]} 
                alt='listing-img' 
                className='h-16 w-16 object-contain'
              />
            </Link>
            <p className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.name}</p>

            <div className='flex flex-col items-center'>
              <button className='text-red-700 uppercase'>Delete</button>
              <button className='text-green-700 uppercase'>Edit</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Profile