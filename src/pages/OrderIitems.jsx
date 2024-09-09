import React, { useState, useEffect } from 'react';

const OrderItems = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState(null);
    const [newOrderItem, setNewOrderItem] = useState({ order_id: '', product_id: '', quantity: 1, price: 0 });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editOrderItem, setEditOrderItem] = useState(null); // Track order item being edited
    const [updateError, setUpdateError] = useState(null);

    // Fetch all order items
    const fetchOrderItems = async () => {
        try {
            const response = await fetch('http://localhost:2004/order-items');
            const data = await response.json();
            setOrderItems(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new order item
    const addOrderItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/order-items/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrderItem),
            });
            const addedOrderItem = await response.json();
            if (response.ok) {
                setOrderItems([...orderItems, addedOrderItem.data]);
                setNewOrderItem({ order_id: '', product_id: '', quantity: 1, price: 0 });
            } else {
                setAddError(addedOrderItem.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete an order item
    const deleteOrderItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/order-items/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setOrderItems(orderItems.filter(orderItem => orderItem.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update an order item
    const updateOrderItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/order-items/update/${editOrderItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editOrderItem),
            });
            const updatedOrderItem = await response.json();
            if (response.ok) {
                setOrderItems(orderItems.map(orderItem => orderItem.id === editOrderItem.id ? updatedOrderItem.data : orderItem));
                setEditOrderItem(null);
            } else {
                setUpdateError(updatedOrderItem.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Trigger the edit form for a specific order item
    const handleEditOrderItem = (orderItem) => {
        setEditOrderItem(orderItem);
    };

    useEffect(() => {
        fetchOrderItems();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Order Items</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Order ID</th>
                                <th className="border border-gray-400 px-4 py-2">Product ID</th>
                                <th className="border border-gray-400 px-4 py-2">Quantity</th>
                                <th className="border border-gray-400 px-4 py-2">Price</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.length > 0 ? (
                                orderItems.map(orderItem => (
                                    <tr key={orderItem.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{orderItem.order_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{orderItem.product_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{orderItem.quantity}</td>
                                        <td className="border border-gray-400 px-4 py-2">${orderItem.price}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteOrderItem(orderItem.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditOrderItem(orderItem)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border border-gray-400 px-4 py-2 text-center">No order items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Order Item</h2>
                    <form onSubmit={addOrderItem} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Order ID:</label>
                            <input
                                type="text"
                                value={newOrderItem.order_id}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, order_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Product ID:</label>
                            <input
                                type="text"
                                value={newOrderItem.product_id}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, product_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={newOrderItem.quantity}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, quantity: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Price:</label>
                            <input
                                type="number"
                                step="0.01"
                                value={newOrderItem.price}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, price: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Order Item
                        </button>
                    </form>

                    {editOrderItem && (
                        <form onSubmit={updateOrderItem} className="mt-5">
                            <h2 className="text-xl font-bold">Update Order Item</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Order ID:</label>
                                <input
                                    type="text"
                                    value={editOrderItem.order_id}
                                    onChange={(e) => setEditOrderItem({ ...editOrderItem, order_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Product ID:</label>
                                <input
                                    type="text"
                                    value={editOrderItem.product_id}
                                    onChange={(e) => setEditOrderItem({ ...editOrderItem, product_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editOrderItem.quantity}
                                    onChange={(e) => setEditOrderItem({ ...editOrderItem, quantity: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Price:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editOrderItem.price}
                                    onChange={(e) => setEditOrderItem({ ...editOrderItem, price: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Order Item
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditOrderItem(null)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default OrderItems;
