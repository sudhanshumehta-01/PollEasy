import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CreatePolls from "./pages/CreatePolls";
import BrowsePolls from "./pages/BrowsePoll";
import Vote from "./pages/Vote";
import Result from "./pages/Result";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <div className="app">
      <NavBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createPolls" element={<CreatePolls />} />
          <Route path="/browse" element={<BrowsePolls />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/vote/:id" element={<Vote />} />
          <Route path="/vieResults/:id" element={<Result />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
