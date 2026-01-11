
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components (to be created)
import LoginPage from './pages/LoginPage.jsx';
import ServiceListPage from './pages/ServiceListPage';
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import PrivateRoute from './components/PrivateRoute'; // To protect pages


function App() {
  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ServiceListPage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/book/:serviceId" element={<BookingFormPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
