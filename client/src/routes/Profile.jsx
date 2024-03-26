import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null); // reference created to do the input functionality by clicking on the profile img

  // to handle the image upload, it is done using storage of firebase
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  // console.log(filePerc);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>

        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData?.avatar || currentUser?.avatar} 
          alt='profile-img' 
          className='rounded-full w-24 h-24 object-cover cursor-pointer self-center' r
          eferrerPolicy='no-referrer' 
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

        <input type='text' id='username' placeholder='username' className='border p-3 rounded-lg' />
        <input type='email' id='email' placeholder='email' className='border p-3 rounded-lg' />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile