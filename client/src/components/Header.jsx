import { RiSearchLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { currentUser } = useSelector(state => state.user)

    return (
        <header className='bg-[#131110] shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-white'>Homyz</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
                <form className='bg-white px-3 py-2 rounded-lg flex items-center'>
                    <RiSearchLine className='text-slate-600 mr-2' />
                    <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                </form>
                <ul className='flex gap-4'>
                    <li className='hidden sm:inline text-white hover:underline'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='hidden sm:inline text-white hover:underline'><Link to="/about">About</Link></li>
                    {/* {console.log(currentUser.avatar)}  */}
                    {
                        currentUser ? (<Link to={"/profile"}><img src={currentUser?.avatar} alt='profile' className='rounded-full h-7 w-7 object-cover' referrerPolicy="no-referrer"/></Link>)
                        :
                        (<li className='hidden sm:inline text-white hover:underline'> <Link to="/signin">Sign in</Link></li>) 
                    }
                    
                </ul>
            </div>
        </header>
    )
}

export default Header