import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const navigate = useNavigate();
    const [sidebarData, setSibebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)

    // this is to keep the url and our sidebar data same. If any changes is made in the URL or the search bar in header. It will reflected in the sidebar
    useEffect(() => {
        const urlparams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlparams.get('searchTerm');
        const typeFromUrl = urlparams.get('type');
        const parkingFromUrl = urlparams.get('parking');
        const furnishedFromUrl = urlparams.get('furnished');
        const offerFromUrl = urlparams.get('offer');
        const sortFromUrl = urlparams.get('sort');
        const orderFromUrl = urlparams.get('order');

        if (
            searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl
        ) {
            setSibebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlparams.toString();
            await axios.get(`/api/listing/get?${searchQuery}`).then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
        };

        fetchListings();
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSibebarData({ ...sidebarData, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSibebarData({ ...sidebarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSibebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.check === 'true' ? true : false })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSibebarData({ ...sidebarData, sort, order })
        }
    }
    // console.log(sidebarData)
    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData?.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-1 items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='all'
                                className='w-5'
                                checked={sidebarData?.type === 'all'}
                                onChange={handleChange}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebarData?.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='sale'
                                className='w-5'
                                checked={sidebarData?.type === 'sale'}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange}
                                checked={sidebarData?.offer === true}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData?.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData?.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 '>
                        <label className='font-semibold'>Sort:</label>
                        <select
                            id='sort_order'
                            className='border p-3 rounded-lg'
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Oldest</option>
                            <option value='createdAt_asc'>Newest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 text-white'>Search</button>
                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
            </div>
        </div>
    )
}

export default Search