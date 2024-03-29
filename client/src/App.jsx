import { Route, Routes } from "react-router-dom";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import About from "./routes/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App