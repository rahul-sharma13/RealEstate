import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      await axios.post('api/auth/google', { name: result.user.displayName, email: result.user.email, photo: result.user.photoURL }).then((response) => {
        // console.log(response)
        dispatch(signInSuccess(response?.data?.data))
        navigate('/')
      }).catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log('Could not sign in with google', error)
    }
  }

  return (
    // adding type here as button so that it does not submit on click which is by default as it is written inside a form
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with Google</button>
  )
}

export default OAuth