import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Error from '../components/Error';
import Loader from "../components/Loader";
import moment from 'moment';

function BookingScreen() {
    const { roomid, fromdate, todate } = useParams(); // Use useParams to extract route parameters
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [room, setroom] = useState();
    const [totalamount, settotalamount] = useState(0);

    const fromDate = moment(fromdate, 'DD-MM-YYYY');
    const toDate = moment(todate, 'DD-MM-YYYY');
    const totaldays = moment.duration(toDate.diff(fromDate)).asDays() + 1;

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                setloading(true);
                const { data } = await axios.post('/api/rooms/getaroombyid', { roomid });
                setroom(data);
                settotalamount(data.rentperday * totaldays);
                setloading(false);
            } catch (error) {
                seterror(true);
                setloading(false);
            }
        };

        fetchRoomDetails();
    }, [roomid, totaldays]);

    const bookRoom = async () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
        if (!currentUser) {
            alert('You need to log in to book a room.');
            // Optionally redirect to login page
            window.location.href = '/login';
            return;
        }
    
        const bookingDetails = {
            room,
            userid: currentUser._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
        };
    
        try {
            const result = await axios.post('/api/bookings/bookroom', bookingDetails);
            console.log(result.data);
            alert('Booking successful');
        } catch (error) {
            console.error(error);
            alert('Booking failed');
        }
    };
    

    return (
        <div className='m-5'>
            {loading ? (
                <Loader />
            ) : error ? (
                <Error />
            ) : (
                <div>
                    <div className='row justify-content-center mt-5 bs'>
                        <div className='col-md-6'>
                            <h1>{room.name}</h1>
                            <img src={room.imageurls[0]} className='bigimg' alt='Room' />
                        </div>
                        <div className='col-md-6'>
                            <div style={{ textAlign: 'right' }}>
                                <h1>Booking Details</h1>
                                <hr />
                                <b>
                                    <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                    <p>From Date: {fromdate}</p>
                                    <p>To Date: {todate}</p>
                                    <p>Max Count: {room.maxcount}</p>
                                </b>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <b>
                                    <h1>Amount</h1>
                                    <hr />
                                    <p>Total Days: {totaldays}</p>
                                    <p>Rent per day: {room.rentperday}</p>
                                    <p>Total Amount: {totalamount}</p>
                                </b>
                            </div>
                            <div style={{ float: "right" }}>
                                <button className='btn btn-primary' onClick={bookRoom}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingScreen;
