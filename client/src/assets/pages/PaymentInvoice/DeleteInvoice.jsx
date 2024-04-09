import React,{useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';


const DeleteInvoice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle the DeleteInvoice 
  const handleDeletePaymentInvoice = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:8076/PaymentInvoice/${id}`)
      .then(() => {
        
        setLoading(false);
        navigate('/PaymentInvoice/show');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.error(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton destination='/PaymentInvoice/show' /> {/* Pass the destination URL here */}
      
      <h1 className='text-3xl my-4'>Delete Invoice</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure you want to delete Invoice?</h3>
        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeletePaymentInvoice}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteInvoice;
