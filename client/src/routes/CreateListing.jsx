import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Input,
    Checkbox,
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
    Textarea,
    Button
} from '@material-tailwind/react';

// TODO : 1) add loaders to different routes  2) handling listing page 3) responsive design and home page 

const CreateListing = () => {
    const notifySuccess = () => toast.success("Listing Added!");
    const notifyFail = () => toast.error("Please try again.");

    const notifyImage = () => toast.success("image uploaded successfully");
    const notifyImageFail = () => toast.error("image upload fail");

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
                notifyImage();
                setUploading(false);
            }).catch((error) => {
                notifyImageFail();
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

            await axios.post('/api/listing/create', { ...formData, userRef: currentUser._id })
                .then((response) => {
                    console.log(response?.data);
                    notifySuccess();
                    setLoading(false);
                    setTimeout(() => {
                        navigate(`/listing/${response.data._id}`);
                    }, 2000)
                }).catch((error) => {
                    setLoading(false);
                    setError(error);
                    notifyFail();
                })
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <Typography variant='h2' color='black' className='text-left mb-2 text-[#1f3e72]'>Create Listing</Typography>
            <p className='mb-2 text-slate-400 font-bold text-[1rem]'>Tell us more about your property</p>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-row gap-4'>
                    <div className='flex flex-col gap-4 flex-1'>
                        <Input
                            label='Name'
                            id='name'
                            maxLength='62'
                            minLength='10'
                            required
                            onChange={handleChange}
                            value={formData.name}
                            color='blue'
                        />

                        <Textarea
                            variant="outlined"
                            label="Description"
                            color='blue'
                            id='description'
                            required
                            onChange={handleChange}
                            value={formData.description}
                        />
                        <Input
                            label='Address'
                            id='address'
                            required
                            onChange={handleChange}
                            value={formData.address}
                            color='blue'
                        />

                        <div className='flex flex-wrap gap-6'>

                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='regularPrice'
                                    min='50'
                                    max='1000000'
                                    className='p-3 border border-gray-300 focus:outline-blue-400 rounded-lg' required
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
                        <Card className="w-full max-w-[24rem] border-2">
                            <List className="flex-row">
                                <ListItem className="p-0">
                                    <label
                                        htmlFor="sell"
                                        className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id="sale"
                                                onChange={handleChange}
                                                checked={formData.type === 'sale'}
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-0",
                                                }}
                                                color='blue'
                                            />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="font-medium">
                                            Sale
                                        </Typography>
                                    </label>
                                </ListItem>
                                <ListItem className="p-0">
                                    <label
                                        htmlFor="rent"
                                        className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id="rent"
                                                onChange={handleChange}
                                                checked={formData.type === 'rent'}
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-0",
                                                }}
                                                color='blue'
                                            />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="font-medium">
                                            Rent
                                        </Typography>
                                    </label>
                                </ListItem>

                                <ListItem className="p-0">
                                    <label
                                        htmlFor="horizontal-list-offer"
                                        className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id="offer"
                                                ripple={false}
                                                onChange={handleChange}
                                                checked={formData.offer}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-0",
                                                }}
                                                color='blue'
                                            />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="font-medium">
                                            Offer
                                        </Typography>
                                    </label>
                                </ListItem>
                            </List>
                        </Card>

                        <Card className="w-full max-w-[24rem] border-2">
                            <List className='flex-row'>
                                <ListItem className="p-0">
                                    <label
                                        htmlFor="parking"
                                        className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id="parking"
                                                onChange={handleChange}
                                                checked={formData.parking}
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-0",
                                                }}
                                                color='blue'
                                            />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="font-medium">
                                            Parking Spot
                                        </Typography>
                                    </label>
                                </ListItem>

                                <ListItem className="p-0">
                                    <label
                                        htmlFor="furnished"
                                        className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id="furnished"
                                                onChange={handleChange}
                                                checked={formData.furnished}
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-0",
                                                }}
                                                color='blue'
                                            />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="font-medium">
                                            Furnished
                                        </Typography>
                                    </label>
                                </ListItem>
                            </List>
                        </Card>

                        <div className='flex items-center gap-3 mt-6'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='bedrooms'
                                    min='1'
                                    max='10'
                                    className='p-3 border border-gray-300 focus:outline-blue-400  rounded-lg' required
                                    onChange={handleChange}
                                    value={formData.bedrooms}
                                />
                                <p>Beds</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='number' id='bathrooms' min='1' max='10' className='p-3 border border-gray-300 focus:outline-blue-400  rounded-lg' required
                                    onChange={handleChange}
                                    value={formData.bathrooms}
                                />
                                <p>Baths</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <p className='font-semibold mb-2'><span className='text-xl'>Images:</span><br />
                        <span className='font-normal text-gray-600'>The first image will be cover(max 6)</span>
                    </p>
                    <div className='flex gap-4 mb-2'>
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
                    <Button disabled={loading || uploading} color='blue' className='mt-2' size='lg' variant="gradient" type='submit'>
                        {loading ? 'Creating...' : 'Create Listing'}
                    </Button>
                </div>
            </form>
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
        </main>
    )
}

export default CreateListing