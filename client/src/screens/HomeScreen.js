import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room'
import Loader from '../components/Loader';
// import 'antd/dist/antd.css'; 
import Error from '../components/Error';
import moment from 'moment'
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
function HomeScreen() {
  const [rooms, setrooms] = useState([])
  const [loading, setloading] = useState()
  const [error, seterror] = useState()

  const [fromdate, setFromDate] = useState()
  const [todate, setToDate] = useState()
  const [duplicaterooms, setduplicaterooms] = useState([])

  const[searchkey,setsearchkey]= useState('')
  const[type,settype]= useState('all')
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true)
        const data = (await axios.get('/api/rooms/getallrooms')).data;

        setrooms(data);
        setduplicaterooms(data)
        setloading(false)
      } catch (error) {
        seterror(true)
        console.error(error)
        setloading(false)

      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []);
  function filterByDate(dates) {
    setFromDate(moment(dates[0]).format('DD-MM-YYYY'))
    setToDate(moment(dates[1]).format('DD-MM-YYYY'))


    var temprooms = []
    var availability = false
    for (const room of duplicaterooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (!(moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
            && !(moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
          ) {
            if (
              moment(dates[0]).format('DD-MM-YYYY') !== booking.formdate &&
              moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.formdate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true
            }
          }
        }
      }
      if (availability == true || room.currentbookings.length == 0) {
        temprooms.push(room)
      }
      setrooms(temprooms)
    }
    
  }
  function filterBySearch() {
    const temprooms = duplicaterooms.filter((room) => {
      return typeof room.name === 'string' && room.name.toLowerCase().includes(searchkey.toLowerCase());
    });
    setrooms(temprooms);
  }
  function filterByType(e){
    settype(e)
    if(e!=='all'){
      const temprooms = duplicaterooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
      setrooms(temprooms)
    }
    else{
      setrooms(duplicaterooms)
    }
  }

  return (
    <div className='container'>
      {/* <div className='row'>
        {loading ? (<h1>Loading ....</h1>) : error ? (<h1>Error</h1>) : (rooms.map(room => {
          return <h1>{room.name}</h1>
        }))}
      </div> */}
      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
      
      <div className='col-md-5'>
        <input type="text" className='form-control' placeholder='search rooms'
        value={searchkey} onChange={(e)=>{setsearchkey(e.target.value)}} onKeyUp={filterBySearch}
        />
      </div>

      <div className='col-md-3'>
      <select className='form-control' value={type} onChange={(e)=>{filterByType(e.target.value)}}>
        <option value="all">All</option>
        <option value="all">Delux</option>
        <option value="non-delux">Non-Delux</option>
      </select>
     </div>
      </div>
      <div className='row justify-content-center mt-5'>
        {loading ?
          (<Loader />
          ) : (
            rooms.map(room => {
              return <div className='col-md-9 mt-3'>
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>;
            })

          )}
      </div>

    </div>
  );
}

export default HomeScreen;
