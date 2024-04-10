import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { Button, Input } from '@material-tailwind/react';

const Hero = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <section className='text-white bg-[#131110] relative pb-8 px-6'>
            <div className='absolute w-72 h-72 bg-[rgb(255,255,255,0.522)] blur-[150px]' />
            <div className='p-5 w-full flex items-end flex-wrap gap-8 justify-around'>
                <div className='flex flex-col justify-center items-start gap-7'>
                    <div className='relative z-[1]'>
                        <div className=' h-14 w-14 rounded-full absolute right-[31%] top-[-7%] z-[-1] bg-orange-500' />
                        <motion.h1
                            initial={{ y: "2rem", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 1.5,
                                type: "ease-in"
                            }}
                            className=' font-bold text-[3.6rem] spacing leading-[4rem]'>
                            Find your
                            <br />
                            next perfect <br />
                            place with ease<br />
                        </motion.h1>
                    </div>

                    <div className='flex flex-col justify-center items-start text-[rgb(140,139,139)]'>
                        <span>Find a variety of properties that suit you very easilty</span>
                        <span>Forget all difficulties in finding a residence for you</span>
                    </div>

                    <form onSubmit={handleSubmit} className="relative flex w-full max-w-[24rem] border-blue-400 sm:hidden ">
                        <Input
                            type="text"
                            color="white"
                            label="Search for your dream place"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-20"
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                        <Button
                            size="sm"
                            color={searchTerm ? "white" : "blue-gray"}
                            disabled={!searchTerm}
                            className="!absolute right-1 top-1 rounded"
                        >
                            Search
                        </Button>
                    </form>

                    <div className='flex items-center flex-wrap w-full justify-between'>
                        <div className=' flex flex-col justify-center items-start'>
                            <span>
                                <CountUp start={8800} end={9000} duration={4} className='text-3xl' />
                                <span className='text-orange-600 text-3xl'>+</span>
                            </span>
                            <span className='text-[0.9rem] text-[rgb(140,139,139)]'>Premium Products</span>
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                            <span>
                                <CountUp start={1950} end={2000} duration={4} className=' text-3xl' />
                                <span className='text-orange-600 text-3xl'>+</span>
                            </span>
                            <span className='text-[rgb(140,139,139)] text-[0.9rem]'>Happy Customers</span>
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                            <span>
                                <CountUp end={28} className='text-3xl' />
                                <span className='text-orange-600 text-3xl'>+</span>
                            </span>
                            <span className=' text-[0.9rem] text-[rgb(140,139,139)]'>Award Winning</span>
                        </div>
                    </div>

                </div>
                <motion.div
                    initial={{ x: "7rem", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        type: "ease-in"
                    }}
                    className='w-[30rem] h-[35rem] overflow-hidden rounded-t-[15rem] border-solid border-[7px] border-gray-700' >
                    <img src='./hero-image.png' className='w-full h-full' alt='hero-img' />
                </motion.div>
            </div>
        </section>
    )
}

export default Hero