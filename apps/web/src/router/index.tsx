import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/AboutPage";
import Login from "@/pages/Login";
import Pets from "@/pages/Pets";
import Tos from "@/pages/Tos";
import Privacy from "@/pages/Privacy";
import BookingHistory from "@/pages/BookingHistory";
import LikedPets from "@/pages/LikedPets";
import Register from "@/pages/Register";
import Contact from "@/pages/ContactPage";
import Verify from "@/pages/Verify";
import Profile from "@/pages/Profile";
import BookingRequest from "@/pages/BookingRequest";
import SelectPaymentMethod from "@/pages/Payment";
import Review from "@/pages/Review";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/pets", element: <Pets /> },
  { path: "/bookings", element: <BookingHistory /> },
  { path: "/booking", element: <BookingRequest /> },
  { path: "/payment", element: <SelectPaymentMethod /> },
  { path: "/tos", element: <Tos /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/register", element: <Register /> },
  { path: "/contact", element: <Contact /> },
  { path: "/verify", element: <Verify /> },
  { path: "/favorites", element: <LikedPets /> },
  { path: "/profile", element: <Profile /> },
  { path: "/review/:bookingId", element: <Review /> },
]);

export default router;