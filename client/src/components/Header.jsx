import { RiSearchLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

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
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-white'>Homyz</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
                <form onSubmit={handleSubmit} className='bg-white px-3 py-2 rounded-lg flex items-center'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <button>
                        <RiSearchLine className='text-slate-600 mr-2' />
                    </button>
                </form>
                <ul className='flex gap-4'>
                    <li className='hidden sm:inline text-white hover:underline'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='hidden sm:inline text-white hover:underline'><Link to="/about">About</Link></li>
                    {
                        currentUser ? (<Link to={"/profile"}><img src={currentUser?.avatar} alt='profile' className='rounded-full h-7 w-7 object-cover' referrerPolicy="no-referrer" /></Link>)
                            :
                            (<li className='hidden sm:inline text-white hover:underline'> <Link to="/signin">Sign in</Link></li>)
                    }

                </ul>
            </div>
        </header>
    )
}

export default Header