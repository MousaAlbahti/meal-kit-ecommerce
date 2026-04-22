import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;