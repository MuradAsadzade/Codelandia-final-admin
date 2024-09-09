import React, { useState, useEffect } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [newOrder, setNewOrder] = useState({ user_id: '', total_amount: '', status: "" });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editOrder, setEditOrder] = useState(null); // Track order being edited
    const [updateError, setUpdateError] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:2004/orders');
            const data = await response.json();
            setOrders(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/orders/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });
            const addedOrder = await response.json();
            if (response.ok) {
                setOrders([...orders, addedOrder.data]);
                setNewOrder({ user_id: '', total_amount: '', status: "" });
            } else {
                setAddError(addedOrder.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    const deleteOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/orders/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.success) {
                setOrders(orders.filter(order => order.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    const updateOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/orders/update/${editOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editOrder),
            });

            const updatedOrder = await response.json();
            if (response.ok) {
                setOrders(orders.map(order => order.id === editOrder.id ? updatedOrder.data : order));
                setEditOrder(null);
            } else {
                setUpdateError(updatedOrder.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    const handleEditOrder = (order) => {
        setEditOrder(order);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Orders</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">ID</th>
                                <th className="border border-gray-400 px-4 py-2">User ID</th>
                                <th className="border border-gray-400 px-4 py-2">Total Amount</th>
                                <th className="border border-gray-400 px-4 py-2">Status</th>

                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <tr key={order.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{order.id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{order.user_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">${order.total_amount}</td>
                                        <td className="border border-gray-400 px-4 py-2">{order.status}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteOrder(order.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditOrder(order)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border border-gray-400 px-4 py-2 text-center">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Order</h2>
                    <form onSubmit={addOrder} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">User ID:</label>
                            <input
                                type="number"
                                value={newOrder.user_id}
                                onChange={(e) => setNewOrder({ ...newOrder, user_id: e.target.value })}
                                className="shadowappearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Total Amount:</label>
                            <input
                                type="number"
                                value={newOrder.total_amount}
                                onChange={(e) => setNewOrder({ ...newOrder, total_amount: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Status:</label>
                            <input
                                type="text"
      
                                value={newOrder.status}
                                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Order
                        </button>
                    </form>

                    {editOrder && (
                        <form onSubmit={updateOrder} className="mt-5">
                            <h2 className="text-xl font-bold">Update Order</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">User ID:</label>
                                <input
                                    type="number"
                                    value={editOrder.user_id}
                                    onChange={(e) => setEditOrder({ ...editOrder, user_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Total Amount:</label>
                                <input
                                    type="number"
                                    value={editOrder.total_amount}
                                    onChange={(e) => setEditOrder({ ...editOrder, total_amount: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Status:</label>
                                <input
                                    type="text"

                                    value={editOrder.status}
                                    onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Order
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditOrder(null)}
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
}

export default Orders;