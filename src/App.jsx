import { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';

// Pages: 'home' | 'booking' | 'confirmation'
export default function App() {
  const [page, setPage]           = useState('home');
  const [pendingAppt, setPending] = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = useCallback((t) => {
    setToast(null);                        // force re-trigger if same message
    setTimeout(() => setToast(t), 10);
  }, []);

  function goHome() {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBooking() {
    setPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBookingConfirm(appt) {
    setPending(appt);
    setPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AppProvider>
      <Navbar onHome={goHome} onNewBooking={goBooking} />
      <Toast toast={toast} />

      {page === 'home' && (
        <HomePage onNewBooking={goBooking} onToast={showToast} />
      )}
      {page === 'booking' && (
        <BookingPage onConfirm={handleBookingConfirm} onToast={showToast} />
      )}
      {page === 'confirmation' && (
        <ConfirmationPage
          appt={pendingAppt}
          onGoHome={goHome}
          onToast={showToast}
        />
      )}
    </AppProvider>
  );
}
