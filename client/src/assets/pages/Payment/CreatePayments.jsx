import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../../images/Pback21.jpg'; // background image

const CreatePayments = () => {
  const [PaymentId, setPaymentId] = useState('');
  const [cusID, setCusID] = useState('');
  const [Vehicle_Number, setVehicle_Number] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [PaymentMethod, setPaymentMethod] = useState('');
  const [Booking_Id, setBooking_Id] = useState('');
  const [Package, setPackage] = useState('');
  const [selectedServices, setSelectedServices] = useState('');
  const [Pamount, setPamount] = useState('');
  const [Samount, setSamount] = useState('');
  const [email, setEmail] = useState('');
  const [Servicehistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    PaymentId: '',
    cusID: '',
    Vehicle_Number: '',
    PaymentDate: '',
    PaymentMethod: '',
    Booking_Id: '',
    Package: '',
    selectedServices: '',
    Pamount: '',
    Samount: '',
    email: ''
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleSavePayment();
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    if (!values.PaymentId) {
      errors.PaymentId = "PaymentId is required!";
    }
    // if (!values.cusID) {
    //   errors.cusID = "Customer ID is required!";
    // }
    if (!values.Booking_Id) {
      errors.Booking_Id = "Service ID is required!";
    }
    if (!values.Vehicle_Number) {
      errors.Vehicle_Number = "Vehicle Number is required!";
    }
    if (!values.PaymentDate) {
      errors.PaymentDate = "Payment Date is required!";
     }
    // if (!values.totalAmount) {
    //   errors.totalAmount = "Total Amount is required!";
    // }
    if (!values.PaymentMethod) {
      errors.PaymentMethod = "Payment Method is required!";
    }
    if (!values.Package) {
      errors.Package = "Package is required!";
    }
    // if (!values.selectedServices) {
    //   errors.selectedServices = "Service is required!";
    // }
    return errors;
  };

  const calculateTotalAmount = () => {
    return (parseFloat(formValues.Pamount) || 0) + (parseFloat(formValues.Samount) || 0);
  };

  const totalAmount = calculateTotalAmount();

  const handleSavePayment = () => {
    const data = {
      PaymentId: formValues.PaymentId,
      cusID: formValues.cusID,
      Booking_Id: formValues.Booking_Id,
      Vehicle_Number: formValues.Vehicle_Number,
      PaymentDate: formValues.PaymentDate,
      totalAmount: totalAmount, // Use the calculated total amount here
      PaymentMethod: formValues.PaymentMethod,
      Package: formValues.Package,
      selectedServices: formValues.selectedServices,
      Pamount: formValues.Pamount,
      Samount: formValues.Samount,
      email: formValues.email,
    };

    setLoading(true);
    axios
      .post(`http://localhost:8076/payments`, data)
      .then(() => {
        setLoading(false);
        navigate('/payments/pdashboard');
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8076/ServiceHistory')
      .then((res) => {
        setServiceHistory(res.data.service);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleServiceIdChange = (e) => {
    const selectedBooking_Id = e.target.value;
    const selectedServiceEntry = Servicehistory.find((service) => service.Booking_Id === selectedBooking_Id);
    
    if (selectedServiceEntry) {
      setVehicle_Number(selectedServiceEntry.Vehicle_Number);
      setPackage(selectedServiceEntry.Package);
      setSelectedServices(selectedServiceEntry.selectedServices);
      setCusID(selectedServiceEntry.cusID);
    
      setFormValues({
        ...formValues,
        Booking_Id: selectedBooking_Id,
        Vehicle_Number: selectedServiceEntry.Vehicle_Number,
        Package: selectedServiceEntry.Package,
        selectedServices: selectedServiceEntry.selectedServices,
        cusID: selectedServiceEntry.cusID
      });
    } else {
      setBooking_Id(selectedBooking_Id);
      setVehicle_Number(''); 
      setPackage(''); 
      setSelectedServices('');
      setCusID('');
      
      setFormValues({
        ...formValues,
        Booking_Id: selectedBooking_Id,
        Vehicle_Number: '',
        Package: '',
        selectedServices: '',
        cusID: ''
      });
    }
  };

  return (
   
       
    <div style={styles.container}>
      <div style={styles.formContainer}> 
      <h1 style={styles.heading}><BackButton destination='/payments/pdashboard' />Create Payment</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
            <label htmlFor="PaymentId"style={styles.label}>PaymentId</label>
            <input
              type='text'
              name='PaymentId'
              style={styles.input} 
              value={formValues.PaymentId}
             // placeholder='Payment Id'
              onChange={handleChange}
              // className='border-2 border-gray-500 px-4 py-2 w-full'
            />
            {formErrors.PaymentId && <p className='text-red-500'>{formErrors.PaymentId}</p>}
          </div> 
           <div style={styles.formGroup}>
            <label htmlFor='email'style={styles.label}>Email</label>
            <input
              type='email'
              name='email'
              value={email}
              placeholder='email'

              onChange={handleChange}
              // Make the input field read-only to prevent direct user input

              style={styles.input} 
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='Booking_Id'style={styles.label}>Service ID</label>
            <select
              name='Booking_Id'
              style={styles.select}
              value={formValues.Booking_Id}
              onChange={handleServiceIdChange}
            >
              <option value=''>Select Service ID</option>
              {Servicehistory.map((service) => (
                <option key={service._id} value={service.Booking_Id}>
                  {service.Booking_Id}
                </option>
              ))}
            </select>
            {formErrors.Booking_Id && <p className='text-red-500'>{formErrors.Booking_Id}</p>}
          </div>
            <div style={styles.formGroup}>
            <label  htmlFor="Vehicle_Number"style={styles.label}>Vehicle Number</label>
           < input
              style={styles.select}
              value={Vehicle_Number}
              placeholder='Vehicle Number'
              disabled
            />
          {formErrors.Vehicle_Number && <p className='text-red-500'>{formErrors.Vehicle_Number}</p>}
          </div>
          <div style={styles.formGroup}>
            <label  htmlFor="cusID"style={styles.label}>Customer ID</label>
            <input
              style={styles.select}
              value={cusID}
              placeholder='Customer ID'
              disabled
            />
          {formErrors.cusID && <p className='text-red-500'>{formErrors.cusID}</p>}
            </div>
          <div style={styles.formGroup}>
          <label htmlFor='Package'style={styles.label}>Package</label>
            <input
              style={styles.select}
              value={Package}
              placeholder='Package'
              disabled
            />
           {formErrors.Package && <p className='text-red-500'>{formErrors.Package}</p>}
          </div>
          <div style={styles.formGroup}>
          <label htmlFor='selectedServices'style={styles.label}>Service</label>
            <input
              style={styles.select}
              value={selectedServices}
              placeholder='Service'
              disabled
            />
           {formErrors.Package && <p className='text-red-500'>{formErrors.Package}</p>}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='PaymentDate'style={styles.label}>Payment Date</label>
            <input
              type='Date'
              name='PaymentDate'
              value={formValues.PaymentDate}
              onChange={handleChange}
              style={styles.input} 
            />
            {formErrors.PaymentDate && <p className='text-red-500'>{formErrors.PaymentDate}</p>}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='Pamount'style={styles.label}>Package Amount</label>
            <input
              type='number'
              name='Pamount'
              value={formValues.Pamount}
              onChange={handleChange}
              placeholder='Package Amount'
              style={styles.input} 
            />
            {/* {formErrors.totalAmount && <p className='text-red-500'>{formErrors.totalAmount}</p>} */}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='Samount'style={styles.label}>Service Amount</label>
            <input
              type='number'
              name='Samount'
              value={formValues.Samount}
              onChange={handleChange}
              placeholder='Service Amount'
              style={styles.input} 
            />
            {/* {formErrors.totalAmount && <p className='text-red-500'>{formErrors.totalAmount}</p>} */}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='totalAmount'style={styles.label}>totalAmount</label>
            <input
              type='number'
              name='totalAmount'
              value={totalAmount}
              placeholder='totalAmount'
              readOnly // Make the input field read-only to prevent direct user input
              style={styles.input} 
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor='PaymentMethod'style={styles.label}>Payment Method</label>
            <select
              name='PaymentMethod'
              style={styles.select}
              value={formValues.PaymentMethod}
              onChange={handleChange}
            >
              <option value=''>Select Payment Method</option>
              <option value='cash'>Cash</option>
              <option value='card'>Card</option>
            </select>
            {formErrors.PaymentMethod && <p className='text-red-500'>{formErrors.PaymentMethod}</p>}
          </div>
          <button className='p-3 bg-red-400 m-8' type='submit'>
            Save
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};
const styles = {
  select: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: 'black',

      outline: 'none'


  },
  container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
},
formContainer: {
  width: '50%',
  backgroundColor: 'rgba(5, 4, 2, 0.8)',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.8)',
  padding: '20px',
  border: '2px solid red', // Add a red border
  borderColor: 'red',
  margin: '10px',
  textAlign: 'center',
  position: 'relative', // Add this line for absolute positioning of the line
},

heading: {
  fontSize: '2rem',
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',

  marginBottom: '1.5rem',
},
form: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '500px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '10px',
},
formGroup: {
  marginBottom: '1.5rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  borderRadius: '5px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
  color: 'rgba(255, 255, 255, 0.8)',
  backgroundColor: 'rgba(5, 4, 2, 0.8)',
},
label: {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  flexDirection: 'column',
  fontSize: '1.2rem',
  color: 'white',
  textAlign: 'center',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center', 
  padding: '10px',
  display: 'block',
  textTransform: 'uppercase',
  backgroundColor: 'black',
},
input: {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: '#4A0404',
  color: 'white',
},
buttonContainer: {
  display: 'flex',
  justifyContent: 'center',
},
button: {
  backgroundColor: 'red',
  color: '#fff',
  border: 'none',
  borderRadius: '0.25rem',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
},
};

export default CreatePayments;