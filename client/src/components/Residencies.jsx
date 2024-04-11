import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import data from '../constants/SliderData.json'
import { sliderSettings } from '../constants/common'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Residencies = () => {
    const [price, setPrice] = useState(null);
    const [listings, setListings] = useState([]);
    const url = '/api/listing/allListings';

    useEffect(() => {
        const getAllListings = async () => {
            try {
                const response = await axios.get(url);
                setListings(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getAllListings();
    }, [url]);

    const navigate = useNavigate();

    return (
        <section className='overflow-hidden relative md:px-36 mt-10'>
            <div className='p-[1.5rem] w-full'>
                <div className='flex flex-col justify-center md:items-start items-center mb-8'>
                    <span className='text-orange-500 text-2xl font-semibold'>Best Choices</span>
                    <span className='text-[#1f3e72] font-bold text-[2rem]'>Popular Residencies</span>
                </div>

                <Swiper {...sliderSettings} className=''>
                    <SliderButtons />
                    {listings.map((card, i) => (
                        <SwiperSlide key={i} className='md:flex md:justify-start flex justify-center' onClick={() => navigate(`/listing/${card._id}`)}>
                            <div
                                className='relative max-w-xs overflow-hidden rounded-2xl shadow-lg group h-72 w-60 cursor-pointer z-[-1]'
                                onMouseOver={() => setPrice(i)}
                                onMouseLeave={() => setPrice(false)}
                            >
                                <img
                                    src={card.imageUrls[0]}
                                    alt='home'
                                    className='transition-transform hover:scale-105 group-hover:scale-110 duration-200 h-full w-full object-cover'
                                />

                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end'>
                                    {price === i && (
                                        <div>
                                            <span className='absolute text-white top-[49%] left-[28%] text-xl z-[1]'>$ {card.regularPrice}</span>
                                        </div>
                                    )}
                                    <div className='p-4 text-white'>
                                        <h1 className='text-[16px] mb-1'>{card.name}</h1>
                                        <p className='text-xs text-slate-400 line-clamp-2'>{card.description}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default Residencies

const SliderButtons = () => {
    const swiper = useSwiper();

    return (
        <div className='flex md:justify-start justify-center items-center flex-wrap gap-1 mt-5'>
            <button
                onClick={() => swiper.slidePrev()}
                className='text-[1.2rem] py-[0.2rem] px-[0.8rem] text-blue-500 border-none border-r-[5px] bg-[#dbdbf5] cursor-pointer'
            >
                &lt;
            </button>
            <button onClick={() => swiper.slideNext()}
                className='text-[1.2rem] py-[0.2rem] px-[0.8rem] text-blue-500 border-none border-r-[5px] bg-[#dbdbf5] cursor-pointer'
            >&gt;</button>
        </div>
    )
}