import React, { useState, useEffect } from 'react';

const Shippings = () => {
    const [shippings, setShippings] = useState([]);
    const [newShipping, setNewShipping] = useState({ order_id: '', shipping_address: '', shipping_method: '', shipping_status: '', shipping_date: '' });
    const [editShipping, setEditShipping] = useState(null);
    const [error, setError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Fetch all shippings
    const fetchShippings = async () => {
        try {
            const response = await fetch('http://localhost:2004/shippings');
            const data = await response.json();
            setShippings(data.data);
            console.log(data.data);
            
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new shipping
    const addShipping = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/shippings/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newShipping),
            });
            const addedShipping = await response.json();
            if (response.ok) {
                setShippings([...shippings, addedShipping.data]);
                setNewShipping({ order_id: '', shipping_address: '', shipping_method: '', shipping_status: '', shipping_date: '' });
            } else {
                setAddError(addedShipping.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete a shipping
    const deleteShipping = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/shippings/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setShippings(shippings.filter(shipping => shipping.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update a shipping
    const updateShipping = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/shippings/update/${editShipping.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editShipping),
            });
            const updatedShipping = await response.json();
            if (response.ok) {
                setShippings(shippings.map(shipping => shipping.id === editShipping.id ? updatedShipping.data : shipping));
                setEditShipping(null);
            } else {
                setUpdateError(updatedShipping.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Handle editing of a shipping
    const handleEditShipping = (shipping) => {
        setEditShipping(shipping);
    };

    useEffect(() => {
        fetchShippings();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Shippings</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Order ID</th>
                                <th className="border border-gray-400 px-4 py-2">Shipping Address</th>
                                <th className="border border-gray-400 px-4 py-2">Shipping Method</th>
                                <th className="border border-gray-400 px-4 py-2">Shipping Status</th>
                                <th className="border border-gray-400 px-4 py-2">Shipping Date</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shippings.length > 0 ? (
                                shippings.map(shipping => (
                                    <tr key={shipping.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{shipping.order_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{shipping.shipping_address}</td>
                                        <td className="border border-gray-400 px-4 py-2">{shipping.shipping_method}</td>
                                        <td className="border border-gray-400 px-4 py-2">{shipping.shipping_status}</td>
                                        <td className="border border-gray-400 px-4 py-2">{shipping.shipping_date}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteShipping(shipping.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditShipping(shipping)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border border-gray-400 px-4 py-2 text-center">No shippings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Shipping</h2>
                    <form onSubmit={addShipping} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Order ID:</label>
                            <input
                                type="text"
                                value={newShipping.order_id}
                                onChange={(e) => setNewShipping({ ...newShipping, order_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Shipping Address:</label>
                            <input
                                type="text"
                                value={newShipping.shipping_address}
                                onChange={(e) => setNewShipping({ ...newShipping, shipping_address: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Shipping Method:</label>
                            <input
                                type="text"
                                value={newShipping.shipping_method}
                                onChange={(e) => setNewShipping({ ...newShipping, shipping_method: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Shipping Status:</label>
                            <input
                                type="text"
                                value={newShipping.shipping_status}
                                onChange={(e) => setNewShipping({ ...newShipping, shipping_status: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Shipping Date:</label>
                            <input
                                type="date"
                                value={newShipping.shipping_date}
                                onChange={(e) => setNewShipping({ ...newShipping, shipping_date: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Shipping
                        </button>
                    </form>

                    {editShipping && (
                        <form onSubmit={updateShipping} className="mt-5">
                            <h2 className="text-xl font-bold">Update Shipping</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Order ID:</label>
                                <input
                                    type="number"
                                    value={editShipping.order_id}
                                    onChange={(e) => setEditShipping({ ...editShipping, order_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Shipping Address:</label>
                                <input
                                    type="text"
                                    value={editShipping.shipping_address}
                                    onChange={(e) => setEditShipping({ ...editShipping, shipping_address: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Shipping Method:</label>
                                <input
                                    type="text"
                                    value={editShipping.shipping_method}
                                    onChange={(e) => setEditShipping({ ...editShipping, shipping_method: e.target.value })}
                                    
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Shipping Status:</label>
                                <textarea
                                    value={editShipping.shipping_status}
                                    onChange={(e) => setEditShipping({ ...editShipping, shipping_status: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Shipping Date:</label>
                                <textarea
                                    value={editShipping.shipping_date}
                                    onChange={(e) => setEditShipping({ ...editShipping, shipping_date: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Shipping
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default Shippings;
