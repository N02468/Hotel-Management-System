import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, []); // Runs only once when the component mounts

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>
          <br />
          <h1>Name: {user?.name}</h1>
          <h1>Email: {user?.email}</h1>
          <h1>isAdmin: {user?.isAdmin ? 'YES' : 'NO'}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings user={user} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
        setBookings(response.data); // Set the response data to state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setLoading(false);
        setError(err);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array to run this effect only once

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = await axios.post('/api/cancelbooking', { bookingid, roomid });
      console.log(result);
      setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingid));
      setLoading(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
      setLoading(false);
      setError(error);
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {bookings.length === 0 && !loading && <div>No bookings available</div>}
          {bookings &&
            bookings.map((booking) => (
              <div className="bs" key={booking._id}>
                <h1>{booking.room}</h1>
                <p>
                  <b>BookingId:</b> {booking._id}
                </p>
                <p>
                  <b>CheckIn:</b> {booking.fromdate}
                </p>
                <p>
                  <b>Check Out:</b> {booking.todate}
                </p>
                <p>
                  <b>Amount:</b> {booking.totalamount}
                </p>
                <p>
                  <b>Status:</b> {booking.status === 'booked' ? 'CONFIRMED' : 'CANCELLED'}
                </p>
                <div className="text-right">
                  <button
                    className="btn btn-primary"
                    onClick={() => cancelBooking(booking._id, booking.roomid)}
                  >
                    CANCEL BOOKING
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
