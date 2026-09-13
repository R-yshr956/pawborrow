import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Appointments from './pages/Appointments';
import Necessities from './pages/Necessities';
import Pets from './pages/Pets';
import Order from './pages/Order';
import Reviews from './pages/Reviews';

function App() {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/necessities" element={<Necessities/>} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/order" element={<Order />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </div>
  );
}

export default App;