import React from 'react'
import CountUp from 'react-countup'

const Hero = () => {
    return (
        <section className='text-white bg-[#131110] relative pb-8 px-20'>
            <div className='absolute w-72 h-72 bg-[rgb(255,255,255,0.522)] blur-[150px]' />
            <div className='p-5 w-full flex items-end flex-wrap gap-8 justify-around'>
                <div className='flex flex-col justify-center items-start gap-7'>
                    <div className='relative z-[1]'>
                        <div className=' h-14 w-14 rounded-full absolute right-[31%] top-[-7%] z-[-1] bg-orange-500' />
                        <h1 className=' font-bold text-[3.6rem] spacing leading-[4rem]'>
                            Find your  
                            <br />
                            next perfect <br />
                            place with ease<br />
                        </h1>
                    </div>

                    <div className='flex flex-col justify-center items-start text-[rgb(140,139,139)]'>
                        <span>Find a variety of properties that suit you very easilty</span>
                        <span>Forget all difficulties in finding a residence for you</span>
                    </div>

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
                <div className='w-[30rem] h-[35rem] overflow-hidden rounded-t-[15rem] border-solid border-[7px] border-gray-700' >
                    <img src='./hero-image.png' className='w-full h-full' alt='hero-img' />
                </div>
            </div>
        </section>
    )
}

export default Hero