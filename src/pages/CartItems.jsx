import React, { useState, useEffect } from 'react';

const CartItems = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [newCartItem, setNewCartItem] = useState({ user_id: '', product_id: '', quantity: 1 });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editCartItem, setEditCartItem] = useState(null); // Track cart item being edited
    const [updateError, setUpdateError] = useState(null);

    // Fetch all cart items
    const fetchCartItems = async () => {
        try {
            const response = await fetch('http://localhost:2004/cart-items');
            const data = await response.json();
            setCartItems(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new cart item
    const addCartItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/cart-items/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCartItem),
            });
            const addedCartItem = await response.json();
            if (response.ok) {
                setCartItems([...cartItems, addedCartItem.data]);
                setNewCartItem({ user_id: '', product_id: '', quantity: 1 });
            } else {
                setAddError(addedCartItem.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete a cart item
    const deleteCartItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/cart-items/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCartItems(cartItems.filter(cartItem => cartItem.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update a cart item
    const updateCartItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/cart-items/update/${editCartItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editCartItem),
            });
            const updatedCartItem = await response.json();
            if (response.ok) {
                setCartItems(cartItems.map(cartItem => cartItem.id === editCartItem.id ? updatedCartItem.data : cartItem));
                setEditCartItem(null);
            } else {
                setUpdateError(updatedCartItem.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Trigger the edit form for a specific cart item
    const handleEditCartItem = (cartItem) => {
        setEditCartItem(cartItem);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Cart Items</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">User ID</th>
                                <th className="border border-gray-400 px-4 py-2">Product ID</th>
                                <th className="border border-gray-400 px-4 py-2">Quantity</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length > 0 ? (
                                cartItems.map(cartItem => (
                                    <tr key={cartItem.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{cartItem.user_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{cartItem.product_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{cartItem.quantity}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteCartItem(cartItem.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditCartItem(cartItem)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border border-gray-400 px-4 py-2 text-center">No cart items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Cart Item</h2>
                    <form onSubmit={addCartItem} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">User ID:</label>
                            <input
                                type="text"
                                value={newCartItem.user_id}
                                onChange={(e) => setNewCartItem({ ...newCartItem, user_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Product ID:</label>
                            <input
                                type="text"
                                value={newCartItem.product_id}
                                onChange={(e) => setNewCartItem({ ...newCartItem, product_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={newCartItem.quantity}
                                onChange={(e) => setNewCartItem({ ...newCartItem, quantity: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Cart Item
                        </button>
                    </form>

                    {editCartItem && (
                        <form onSubmit={updateCartItem} className="mt-5">
                            <h2 className="text-xl font-bold">Update Cart Item</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">User ID:</label>
                                <input
                                    type="text"
                                    value={editCartItem.user_id}
                                    onChange={(e) => setEditCartItem({ ...editCartItem, user_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Product ID:</label>
                                <input
                                    type="text"
                                    value={editCartItem.product_id}
                                    onChange={(e) => setEditCartItem({ ...editCartItem, product_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editCartItem.quantity}
                                    onChange={(e) => setEditCartItem({ ...editCartItem, quantity: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Cart Item
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default CartItems;
