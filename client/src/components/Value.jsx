import React, { useState } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'
import { MdOutlineArrowDropDown } from 'react-icons/md'
import data from '../constants/accordian'

const Value = () => {
    return (
        <section className='mt-10'>
            <div className='md:px-36 w-full flex md:flex-row flex-col items-center justify-center flex-wrap'>
                <div className='flex-1 w-full'>
                    <div className='md:w-[30rem] md:h-[35rem] h-[25rem] w-[85%] mx-auto overflow-hidden rounded-t-[15rem] border-solid border-[7px] border-slate-400'>
                        <img src='./value.png' className='object-cover'/>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-start flex-1 gap-[0.5rem] mt-5 md:mx-0 mx-10'>
                    <span className='text-orange-500 text-2xl font-semibold'>Our Value</span>
                    <span className='text-[#1f3e72] font-bold text-3xl'>Value we give to you</span>
                    <span className='text-[rgb(140,139,139)] text-[0.9rem]'>
                        We always ready to help by providijng the best services for you.
                        <br />
                        We beleive a good blace to live can make your life better
                    </span>

                    <Accordion
                        allowMultipleExpanded={false}
                        preExpanded={[0]}
                        className='mt-8 border-none'
                    >
                        {
                            data.map((item, i) => {
                                return (<AccordionItem className='bg-white border-solid border-[0.8px] border-slate-200 overflow-hidden mb-5' key={i} uuid={i}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton className='flex items-center justify-between flex-wrap bg-white p-1 w-full cursor-pointer'>
                                            <div className='flex items-center justify-center flex-wrap p-3 bg-[#eeeeff] text-blue-500'>{item.icon}</div>
                                            <span className='text-[#1f3e72] font-bold md:text-[1.1rem] text-[0.8rem]'>
                                                {item.heading}
                                            </span>
                                            <div className='flex items-center justify-center flex-wrap p-3 bg-[#eeeeff] text-blue-500'>
                                                <MdOutlineArrowDropDown size={20} />
                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>

                                    <AccordionItemPanel>
                                        <p className='text-[rgb(140,139,139)] text-[0.9rem]'>
                                            {item.detail}
                                        </p>
                                    </AccordionItemPanel>
                                </AccordionItem>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>
        </section>
    )
}

export default Value