import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  // console.log(files);
  const [formData, setformData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  });
  // console.log(formData);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      // console.log(listingId);
      const url = `/api/listing/get/${listingId}`;
      // console.log(url);
      await axios.get(url).then((response) => {
        setformData(response?.data?.data)
      }).catch((error) => {
        console.log(error)
      })
    }

    fetchListing();
  }, [])

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = []; // as we are uploading more than one image so there will be more than one asynchronous behaviour

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        setformData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls)
          // as we want to keep the prev values too
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((error) => {
        setImageUploadError('Image upload failed(2MB max size)');
        setUploading(false);
      })
    } else {
      setImageUploadError('Please upload 6 images only.');
      setUploading(false);
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // after this function all the downloadURL are stored in promises in above func
          })
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setformData({
        ...formData,
        type: e.target.id,
      })
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setformData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setformData({
        ...formData,
        [e.target.id]: e.target.value
        //using [] here as we need name not "name" as key
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) return setError('You must upload atleast one image');

      if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be less than the regular price');
      setLoading(true);
      setError(false);

      await axios.post(`/api/listing/updateListing/${params.listingId}`, { ...formData, userRef: currentUser._id })
        .then((response) => {
          setLoading(false);
          navigate(`/listing/${response._id}`);
        }).catch((error) => {
          setLoading(false);
          setError(error);
        })
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg' id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='description' className='border p-3 rounded-lg' id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg' id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className='flex flex-wrap gap-6'>
            <div className='flex gap-1'>
              <input
                type='checkbox'
                id='sale'
                className='w-5 cursor-pointer' onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-1'>
              <input type='checkbox' id='rent' className='w-5 cursor-pointer' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-1'>
              <input type='checkbox' id='parking' className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-1'>
              <input type='checkbox' id='furnished' className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-1'>
              <input type='checkbox' id='offer' className='w-5 cursor-pointer'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                className='p-3 border border-gray-300 rounded-lg' required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10' className='p-3 border border-gray-300 rounded-lg' required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='1000000'
                className='p-3 border border-gray-300 rounded-lg' required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col'>
                <p>Regular Price</p>
                <span className='text-xs'>($/month)</span>
              </div>
            </div>
            {formData?.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number' id='discountPrice'
                  min='0'
                  max='1000000'
                  className='p-3 border border-gray-300 rounded-lg' required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col'>
                  <p>Discounted Price</p>
                  <span className='text-xs'>($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be cover(max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
              onChange={(e) => setFiles(e.target.files)} />
            <button
              type='button'
              disabled={uploading}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              onClick={handleImageSubmit}
            >{uploading ? 'Uploading...' : 'Upload'}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={index} className='flex justify-between p-3 border items-center'>
                <img src={url} alt='img' className='w-20 h-20 object-contain rounded-lg' />
                {/* we need a callback here as otherwise it will call itself without even clicking */}
                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg hover:opacity-75'>
                  Delete
                </button>
              </div>
            ))
          }
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2'>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  )
}

export default UpdateListing