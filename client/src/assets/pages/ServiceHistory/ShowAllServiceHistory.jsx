import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
export default function ShowAllServiceHistory() {
    const [serviceHistories, setServiceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const componentRef = useRef();

    useEffect(() => {
        fetchServiceHistories();
    }, []);

    const fetchServiceHistories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8076/ServiceHistory');
            setServiceHistory(response.data.service);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8076/searchservices?search=${searchQuery}`);
            setServiceHistory(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const applyServiceHistoryFilter = (service) => {
        const query = searchQuery ? searchQuery.toLowerCase() : ""; // Check if searchQuery is defined
        return (
            (service.Customer_Name && service.Customer_Name.toLowerCase().includes(query)) ||
            (service.Allocated_Employee && service.Allocated_Employee.toLowerCase().includes(query)) ||
            (service.Vehicle_Number && service.Vehicle_Number.toLowerCase().includes(query)) ||
            (service.Service_History && service.Service_History.toLowerCase().includes(query)) ||
            (service.Service_Date && service.Service_Date.toLowerCase().includes(query)) ||
            (service.Month && service.Month.toLowerCase().includes(query)) // Add searching for the Month field
        );
    };
    

    const filteredServiceHistories = serviceHistories.filter(applyServiceHistoryFilter);

    // Report generating
    const generatePDF = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'vehicle List',
        onAfterPrint: () => alert('Data saved in PDF'),
    });

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Service History</h1>
                <Link to={'/ServiceHistory/create'} className="text-sky-800 text-4xl">Add history</Link>

                <div className="mb-4"></div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter details..."
                    className="mr-2 border border-gray-400 p-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Search
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <table className='w-full border-separate border-spacing-2' ref={componentRef}>
                        <thead>
                            <tr>
                                <th className='border border-green-800 rounded-md'>Customer Name</th>
                                <th className='border border-green-800 rounded-md'>Allocated Employee</th>
                                <th className='border border-green-800 rounded-md'>Vehicle Number</th>
                                <th className='border border-green-800 rounded-md'>Service History</th>
                                <th className='border border-green-800 rounded-md'>Service Date</th>
                                <th className='border border-green-800 rounded-md'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServiceHistories.map((service, index) => (
                                <tr key={service._id}>
                                    <td className='border border-gray-600 rounded-md'>{service.Customer_Name}</td>
                                    <td className='border border-gray-600 rounded-md'>{service.Allocated_Employee}</td>
                                    <td className='border border-gray-600 rounded-md'>{service.Vehicle_Number}</td>
                                    <td className='border border-gray-600 rounded-md'>{service.Service_History}</td>
                                    <td className='border border-gray-600 rounded-md'>{service.Service_Date}</td>
                                    <td className='border border-gray-600 rounded-md'>
                                        <Link to={`/ServiceHistory/edit/${service._id}`} className='bg-green-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded'>Edit</Link>
                                        <Link to={`/ServiceHistory/delete/${service._id}`} className='bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded'>Delete</Link>
                                        <Link to={`/ServiceHistory/get/${service._id}`} className='bg-green-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded'>Show</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredServiceHistories.length === 0 && <p>No results found.</p>}
                </div>
            )}

            <div className="flex justify-center items-center mt-8">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generatePDF}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
};
