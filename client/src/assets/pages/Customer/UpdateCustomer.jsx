import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';
import backgroundImage from '../../images/t.jpg';
import Swal from 'sweetalert2';

const UpdateCustomer = () => {
  const [customer, setCustomer] = useState({
    cusID: '',
    firstName: '',
    lastName: '',
    NIC: '',
    phone: '',
    email: '',
    password: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [validInputs, setValidInputs] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const storage = getStorage(app);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8076/customer/${id}`)
      .then((response) => {
        const data = response.data;
        setCustomer(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again later.',
        });
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    setValidInputs(validateInputs());
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCustomer({ ...customer, image: e.target.files[0] });
    }
  };

  const handleUpdateCustomer = () => {
    if (!validInputs) {
      return;
    }

    setLoading(true);

    if (customer.image) {
      const storageRef = ref(storage, `images/${customer.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, customer.image);

      uploadTask.on('state_changed',
        (snapshot) => {},
        (error) => {
          console.error(error);
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Image upload failed. Please try again.',
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const updatedCustomer = { ...customer, image: downloadURL };
            updateCustomer(updatedCustomer);
          });
        }
      );
    } else {
      // If there's no image to upload, just update the customer data
      updateCustomer(customer);
    }
  };

  const updateCustomer = (updatedCustomer) => {
    axios
      .put(`http://localhost:8076/customer/${id}`, updatedCustomer)
      .then(() => {
        setLoading(false);
        navigate('/customer/customerDashboard');
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again later.',
        });
        console.log(error);
      });
  };

  const validateInputs = () => {
    const { cusID, firstName, lastName, NIC, phone, email, password } = customer;
    
    if (!cusID || !firstName || !lastName || !NIC || !phone || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
      });
      return false;
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email address',
      });
      return false;
    }

    if (NIC.length > 12) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid NIC. Please Enter a valid NIC Number',
      });
      return false;
    }

    if (phone.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Phone number must have 10 digits',
      });
      return false;
    }

    return true;
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div style={styles.container}>
      {loading && <Spinner />}
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>EDIT PROFILE</h1>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              style={styles.input}
            />
            {customer.image && <img src={customer.image} alt="Customer" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Customer ID</label>
            <input
              type="text"
              name="cusID"
              value={customer.cusID}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={customer.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
           
          <div style={styles.formGroup}>
            <label style={styles.label}>NIC</label>
            <input
              type="text"
              name="NIC"
              value={customer.NIC}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="text"
              name="email"
              value={customer.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
           
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="text"
              name="password"
              value={customer.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.buttonContainer}>
            <button style={{ ...styles.button, opacity: validInputs ? 1 : 0.5 }} onClick={handleUpdateCustomer} disabled={!validInputs}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
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
    border: '2px solid red',
    borderColor: 'red',
    margin: '10px',
    textAlign: 'center',
    position: 'relative',
  },
  heading: {
    fontSize: '3rem',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
    color: 'red',
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', 
    padding: '10px',
    display: 'block',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: '10px',
    textAlign: 'left',
    display: 'block',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ff0000',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.8s',
  },
};

export default UpdateCustomer;
