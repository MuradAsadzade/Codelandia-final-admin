import React, { useState, useEffect } from 'react';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ product_id: '', user_id: '', rating: '', comment: '' });
    const [editReview, setEditReview] = useState(null);
    const [error, setError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:2004/reviews');
            const data = await response.json();
            setReviews(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new review
    const addReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/reviews/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            });
            const addedReview = await response.json();
            if (response.ok) {
                setReviews([...reviews, addedReview.data]);
                setNewReview({ product_id: '', user_id: '', rating: '', comment: '' });
            } else {
                setAddError(addedReview.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete a review
    const deleteReview = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/reviews/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setReviews(reviews.filter(review => review.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update a review
    const updateReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/reviews/update/${editReview.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editReview),
            });
            const updatedReview = await response.json();
            if (response.ok) {
                setReviews(reviews.map(review => review.id === editReview.id ? updatedReview.data : review));
                setEditReview(null);
            } else {
                setUpdateError(updatedReview.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Handle editing of a review
    const handleEditReview = (review) => {
        setEditReview(review);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Product Reviews</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Product ID</th>
                                <th className="border border-gray-400 px-4 py-2">User ID</th>
                                <th className="border border-gray-400 px-4 py-2">Rating</th>
                                <th className="border border-gray-400 px-4 py-2">Comment</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <tr key={review.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{review.product_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{review.user_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{review.rating}</td>
                                        <td className="border border-gray-400 px-4 py-2">{review.comment}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteReview(review.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditReview(review)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border border-gray-400 px-4 py-2 text-center">No reviews found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Review</h2>
                    <form onSubmit={addReview} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Product ID:</label>
                            <input
                                type="text"
                                value={newReview.product_id}
                                onChange={(e) => setNewReview({ ...newReview, product_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">User ID:</label>
                            <input
                                type="text"
                                value={newReview.user_id}
                                onChange={(e) => setNewReview({ ...newReview, user_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Rating (1-5):</label>
                            <input
                                type="number"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                min="1"
                                max="5"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Comment:</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Review
                        </button>
                    </form>

                    {editReview && (
                        <form onSubmit={updateReview} className="mt-5">
                            <h2 className="text-xl font-bold">Update Review</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Product ID:</label>
                                <input
                                    type="text"
                                    value={editReview.product_id}
                                    onChange={(e) => setEditReview({ ...editReview, product_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">User ID:</label>
                                <input
                                    type="text"
                                    value={editReview.user_id}
                                    onChange={(e) => setEditReview({ ...editReview, user_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Rating (1-5):</label>
                                <input
                                    type="number"
                                    value={editReview.rating}
                                    onChange={(e) => setEditReview({ ...editReview, rating: e.target.value })}
                                    min="1"
                                    max="5"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Comment:</label>
                                <textarea
                                    value={editReview.comment}
                                    onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Review
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default Reviews;
