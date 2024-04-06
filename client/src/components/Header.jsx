import { RiSearchLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

const Header = () => {
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // as we want to keep the track of all the queries in search and change the ones which are req
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
        <header className='bg-[#131110] shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto py-4 font-serif'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-white'>Homyz</span>
                </h1>
                <form onSubmit={handleSubmit} className='bg-white px-3 py-2 rounded-3xl flex items-center gap-2'>
                    <FaLocationDot className='text-gray-700' size={17} />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64
                        h-8 text-sm sm:text-base placeholder-slate-600'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <button>
                        <RiSearchLine className='text-slate-600 mr-2' />
                    </button>
                </form>
                <ul className='flex gap-4 items-center'>
                    <li className='hidden sm:inline text-gray-400 text-[16px]'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='hidden sm:inline text-gray-400 text-[16px]'><Link to="/create-listing">Add Property</Link></li>
                    {
                        currentUser ? (<Link to={"/profile"}><img src={currentUser?.avatar} alt='profile' className='rounded-full h-7 w-7 object-cover' referrerPolicy="no-referrer" /></Link>)
                            :
                            (
                                <button
                                    className="transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 inline-flex items-center justify-center px-6 py-2 border-0 rounded-xl text-sm font-medium text-white bg-gradient-to-l from-[#4066ff] to-[#2949c6] shadow-lg hover:from-[#2949c6] hover:to-[#4066ff]"
                                >
                                    <Link to="/signin">
                                        SignIn
                                    </Link>
                                </button>
                            )
                    }
                </ul>
            </div>
        </header>
    )
}

export default Header