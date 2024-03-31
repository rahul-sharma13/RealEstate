import { Route, Routes } from "react-router-dom";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import About from "./routes/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./routes/CreateListing";
import UpdateListing from "./routes/UpdateListing";
import Listing from "./routes/Listing";

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
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<UpdateListing />}/>
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/listing/:id" element={<Listing />}/>
      </Routes>
    </>
  )
}

export default App