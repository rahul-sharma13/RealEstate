import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

// useNavigate is a hook but navigate is a component
const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user) 

  return currentUser ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoute