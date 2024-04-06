import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import Spinner from '../../components/Spinner';

const ReadOneInventory = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation(); // Get location from useLocation hook

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8076/inventory/${id}`)
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newQuantity = searchParams.get('newQuantity');
    if (newQuantity !== null && inventory !== null) {
      // If newQuantity is present and inventory is fetched, update the quantity
      const updatedInventory = { ...inventory, Quantity: newQuantity };
      setInventory(updatedInventory);
      // Save updated quantity to the database
      axios.put(`http://localhost:8076/inventory/${id}`, updatedInventory)
        .then(() => console.log('Quantity updated in database'))
        .catch((error) => console.error('Error updating quantity in database:', error));
    }
  }, [location.search, id, inventory]);

  if (loading) {
    return <Spinner />;
  }

  if (!inventory) {
    return <p>Data is loading...</p>;
  }
  // Data has been fetched, render inventory details
  return (
    <div className='p-4'>
      <h1 className='text-3xl my-4'>Show Inventory</h1>
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Item Number</span>
          <span>{inventory._id}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Name</span>
          <span>{inventory.Name}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Location</span>
          <span>{inventory.Location}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Quantity</span>
          <span>{inventory.Quantity}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Purchased Price</span>
          <span>{inventory.PurchasedPrice}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Sell Price</span>
          <span>{inventory.SellPrice}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Supplier Name</span>
          <span>{inventory.SupplierName}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Supplier Phone</span>
          <span>{inventory.SupplierPhone}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Create Time</span>
          <span>{new Date(inventory.createdAt).toString()}</span>
        </div>
        <div className='my-4'>
          <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
          <span>{new Date(inventory.updatedAt).toString()}</span>
        </div>
        {/* Link to navigate to AddItemPage */}
        <div className='flex justify-between'>
          <Link to={`/inventory/addItem/${id}`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            Add Item
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReadOneInventory;
