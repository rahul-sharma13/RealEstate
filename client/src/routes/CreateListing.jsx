import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    // console.log(files);
    const [formData, setformData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    // console.log(formData);

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

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <input type='text' placeholder='Description' className='border p-3 rounded-lg' id='Description' required />
                    <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-1'>
                            <input type='checkbox' id='sale' className='w-5 cursor-pointer' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-1'>
                            <input type='checkbox' id='rent' className='w-5 cursor-pointer' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-1'>
                            <input type='checkbox' id='parking' className='w-5 cursor-pointer' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-1'>
                            <input type='checkbox' id='furnished' className='w-5 cursor-pointer' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-1'>
                            <input type='checkbox' id='offer' className='w-5 cursor-pointer' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='10' className='p-3 border border-gray-300 rounded-lg' required />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='10' className='p-3 border border-gray-300 rounded-lg' required />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' min='1' max='10' className='p-3 border border-gray-300 rounded-lg' required />
                            <div className='flex flex-col'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountPrice' min='1' max='10' className='p-3 border border-gray-300 rounded-lg' required />
                            <div className='flex flex-col'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>
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
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-2'>Create Listing</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing