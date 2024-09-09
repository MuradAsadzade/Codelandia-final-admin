import React, { useState, useEffect } from 'react';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({ order_id: '', payment_method: '', payment_status: '', payment_date: '' });
    const [editPayment, setEditPayment] = useState(null);
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Fetch all payments
    const fetchPayments = async () => {
        try {
            const response = await fetch('http://localhost:2004/payments');
            const data = await response.json();
            setPayments(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new payment
    const addPayment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/payments/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment),
            });
            const addedPayment = await response.json();
            if (response.ok) {
                setPayments([...payments, addedPayment.data]);
                setNewPayment({ order_id: '', payment_method: '', payment_status: '', payment_date: '' });
            } else {
                setAddError(addedPayment.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete a payment
    const deletePayment = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/payments/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPayments(payments.filter(payment => payment.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update a payment
    const updatePayment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/payments/update/${editPayment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editPayment),
            });
            const updatedPayment = await response.json();
            if (response.ok) {
                setPayments(payments.map(payment => payment.id === editPayment.id ? updatedPayment.data : payment));
                setEditPayment(null);
            } else {
                setUpdateError(updatedPayment.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Handle editing payment
    const handleEditPayment = (payment) => {
        setEditPayment(payment);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Payments</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Order ID</th>
                                <th className="border border-gray-400 px-4 py-2">Payment Method</th>
                                <th className="border border-gray-400 px-4 py-2">Payment Status</th>
                                <th className="border border-gray-400 px-4 py-2">Payment Date</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length > 0 ? (
                                payments.map(payment => (
                                    <tr key={payment.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{payment.order_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{payment.payment_method}</td>
                                        <td className="border border-gray-400 px-4 py-2">{payment.payment_status}</td>
                                        <td className="border border-gray-400 px-4 py-2">{payment.payment_date}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deletePayment(payment.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditPayment(payment)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border border-gray-400 px-4 py-2 text-center">No payments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Payment</h2>
                    <form onSubmit={addPayment} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Order ID:</label>
                            <input
                                type="text"
                                value={newPayment.order_id}
                                onChange={(e) => setNewPayment({ ...newPayment, order_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Payment Method:</label>
                            <input
                                type="text"
                                value={newPayment.payment_method}
                                onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Payment Status:</label>
                            <input
                                type="text"
                                value={newPayment.payment_status}
                                onChange={(e) => setNewPayment({ ...newPayment, payment_status: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Payment Date:</label>
                            <input
                                type="date"
                                value={newPayment.payment_date}
                                onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Payment
                        </button>
                    </form>

                    {editPayment && (
                        <form onSubmit={updatePayment} className="mt-5">
                            <h2 className="text-xl font-bold">Update Payment</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Order ID:</label>
                                <input
                                    type="text"
                                    value={editPayment.order_id}
                                    onChange={(e) => setEditPayment({ ...editPayment, order_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Payment Method:</label>
                                <input
                                    type="text"
                                    value={editPayment.payment_method}
                                    onChange={(e) => setEditPayment({ ...editPayment, payment_method: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Payment Status:</label>
                                <input
                                    type="text"
                                    value={editPayment.payment_status}
                                    onChange={(e) => setEditPayment({ ...editPayment, payment_status: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Payment Date:</label>
                                <input
                                    type="date"
                                    value={editPayment.payment_date}
                                    onChange={(e) => setEditPayment({ ...editPayment, payment_date: e.target.value })}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Payment
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default Payments;
