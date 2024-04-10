import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import MobileMenu from './MobileMenu';
import { Input, Button } from '@material-tailwind/react';

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
            <div className='flex sm:justify-between justify-around items-center max-w-6xl mx-auto py-4 font-serif'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-white'>Homyz</span>
                </h1>

                <form onSubmit={handleSubmit} className='relative w-full max-w-[24rem] border-blue-400 sm:flex hidden'>
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
                            type='submit'
                            color={searchTerm ? "white" : "blue-gray"}
                            disabled={!searchTerm}
                            className="!absolute right-1 top-1 rounded"
                        >
                            Search
                        </Button>
                </form>
                <ul className='flex gap-4 items-center'>
                    <li className='hidden sm:inline text-gray-400 text-[16px]'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='hidden sm:inline text-gray-400 text-[16px]'><Link to="/create-listing">Add Property</Link></li>
                    {
                        currentUser ? (<Link to={"/profile"}><img src={currentUser?.avatar} alt='profile' className='sm:inline hidden rounded-full h-7 w-7 object-cover' referrerPolicy="no-referrer" /></Link>)
                            :
                            (
                                <button
                                    className="transition-colors focus-visible:outline-none sm:inline-flex hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10  items-center justify-center px-6 py-2 border-0 rounded-xl text-sm font-medium text-white bg-gradient-to-l from-[#4066ff] to-[#2949c6] shadow-lg hover:from-[#2949c6] hover:to-[#4066ff]"
                                >
                                    <Link to="/signin">
                                        SignIn
                                    </Link>
                                </button>
                            )
                    }
                </ul>

                <MobileMenu />
            </div>
        </header>
    )
}

export default Header