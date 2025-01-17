import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import BookingScreen from './screens/BookingScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// import Room from './components/Room';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Room/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/book/:roomid/:fromdate/:todate" element={<BookingScreen />} />
          <Route path="/register" element={<RegisterScreen/>}/>
          <Route path="/login" element={<LoginScreen/>}/>
          <Route path="/profile" element={<ProfileScreen/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
