import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@material-tailwind/react';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("sign in done!");
  const notifyFail = () => toast.error("Please try again.");

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      await axios.post('api/auth/google', { name: result.user.displayName, email: result.user.email, photo: result.user.photoURL }).then((response) => {
        // console.log(response)
        dispatch(signInSuccess(response?.data?.data))
        notifySuccess();
        setTimeout(() => {
          navigate('/');
        }, 2000)
      }).catch((err) => {
        console.log(err)
        notifyFail();
      })
    } catch (error) {
      console.log('Could not sign in with google', error)
    }
  }

  return (
    // adding type here as button so that it does not submit on click which is by default as it is written inside a form
    <Button onClick={handleGoogleClick} type='button' color='red' fullWidth>Continue with Google</Button>
  )
}

export default OAuth