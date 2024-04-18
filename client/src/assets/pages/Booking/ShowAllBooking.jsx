import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
// import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import {MdOutlineAddBox , MdOutlineDelete} from 'react-icons/md';
import { useReactToPrint } from 'react-to-print';


export default function ShowAllBooking() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const componentRef = useRef();
  const [DAILY_BOOKING_LIMIT, setDAILY_BOOKING_LIMIT] = useState('');
  const [lastSetBookingLimit, setLastSetBookingLimit] = useState('');

  //search query
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8076/searchbooking?search=${searchQuery}`);
      setBookings(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8076/bookings/')
      .then((response) => {

        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

      });

  }, []);


  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8076/bookingLimits/')
      .then((response) => {
        // Set the last set booking limit
        setLastSetBookingLimit(response.data.BookingLimit);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);


  const handleSetDailyBookingLimit = () => {


    
    
    const data = {
      BookingLimit
  };

  setLoading(true);
  axios
      .post('http://localhost:8076/bookingLimits', data)
      .then(() => {
          setLoading(false);
          navigate('/show-all');

      })
      .catch((error) => {
           
          setLoading(false);
          alert('An error happened. Please Check Console for more informationnnn');
          console.log(error);

      });


  }; 








// Report generating
const generatePDF = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Booking List',
  onAfterPrint: () => alert('Data saved in PDF'),
});

//search filter 

const applySearchFilter = (booking) => {
  return (
    booking.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Vehicle_Number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const filteredBooking = bookings.filter(applySearchFilter);
  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Booking</h1>
        <Link to='/create'>
          <MdOutlineAddBox className='text-sky-800 text-5xl' />
        </Link>
        <div className="flex gap-2 items-center">
        <div className="mb-4"></div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ENTER"
          className="mr-2 border-1 border-gray-400 rounded-md p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
        </div>







        <div className="mt-4">
        <label htmlFor="DAILY_BOOKING_LIMIT" className="block text-sm font-medium text-gray-700">
          Set Daily Booking Limit:
        </label>
        <input
          type="number"
          id="DAILY_BOOKING_LIMIT"
          name="DAILY_BOOKING_LIMIT"
          value={DAILY_BOOKING_LIMIT}
          onChange={(e) => setDAILY_BOOKING_LIMIT(e.target.value)}
          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        <button
          onClick={handleSetDailyBookingLimit}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Set Limit
  </button>
  </div> 
      









      </div>

      
      {loading ? <p>Loading</p> : (
        <table className='w-full border-separate boarder-spacing-2' ref={componentRef}>
          <thead>
            <tr>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>No</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Booking_ID</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Package Name</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Services</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Customer_Name</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Vehicle_Type</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Vehicle_Number</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Contact_Number</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Email</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Booking_Date</th>
              <th className='border-3 border-slate-600 rounded-md bg-red-500 font-bold text-black'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooking.map((booking, index) => (
              <tr key={booking._id} className='h-8'>
                <td className='border-1 border-slate-700 rounded-md text-center bg-red-100 font-bold text-black '>
                  {index + 1}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Booking_Id}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.selectedPackage}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.selectedServices}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Customer_Name}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Vehicle_Type}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Vehicle_Number}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Contact_Number}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Email}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-blue-100 text-black'>
                  {booking.Booking_Date}
                </td>
                <td className='border-1 border-slate-700 rounded-md text-center bg-red-100'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/booking/read/${booking._id}`}>
                      <BsInfoCircle className='text-2x1 text-green-800' />
                    </Link>
                    <Link to={`/edit/${booking._id}`}>
                      <AiOutlineEdit className='text-2x1 text-yellow-600' />
                    </Link>
                    <Link to={`/booking/delete/${booking._id}`}>
                      <MdOutlineDelete className='text-2x1 text-red-600' />
                    </Link>

                  </div>



                </td>


              </tr>



            ))}


          </tbody>


        </table>
      )}
      <div className="flex justify-center items-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  )
}

