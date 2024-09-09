import React, { useState, useEffect } from 'react';

const ProductImages = () => {
    const [productImages, setProductImages] = useState([]);
    const [newProductImage, setNewProductImage] = useState({ product_id: '', image_url: '' });
    const [editProductImage, setEditProductImage] = useState(null);
    const [error, setError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Fetch all product images
    const fetchProductImages = async () => {
        try {
            const response = await fetch('http://localhost:2004/product-images');
            const data = await response.json();
            setProductImages(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Add a new product image
    const addProductImage = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/product-images/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProductImage),
            });
            const addedProductImage = await response.json();
            if (response.ok) {
                setProductImages([...productImages, addedProductImage.data]);
                setNewProductImage({ product_id: '', image_url: '' });
            } else {
                setAddError(addedProductImage.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    // Delete a product image
    const deleteProductImage = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/product-images/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProductImages(productImages.filter(image => image.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Update a product image
    const updateProductImage = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/product-images/update/${editProductImage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editProductImage),
            });
            const updatedProductImage = await response.json();
            if (response.ok) {
                setProductImages(productImages.map(image => image.id === editProductImage.id ? updatedProductImage.data : image));
                setEditProductImage(null);
            } else {
                setUpdateError(updatedProductImage.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    // Handle editing of a product image
    const handleEditProductImage = (productImage) => {
        setEditProductImage(productImage);
    };

    useEffect(() => {
        fetchProductImages();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Product Images</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Product ID</th>
                                <th className="border border-gray-400 px-4 py-2">Image URL</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productImages.length > 0 ? (
                                productImages.map(image => (
                                    <tr key={image.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{image.product_id}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <img src={image.image_url} alt="Product" className="w-32 h-32 object-cover mx-auto" />
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteProductImage(image.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditProductImage(image)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border border-gray-400 px-4 py-2 text-center">No images found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Product Image</h2>
                    <form onSubmit={addProductImage} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Product ID:</label>
                            <input
                                type="text"
                                value={newProductImage.product_id}
                                onChange={(e) => setNewProductImage({ ...newProductImage, product_id: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Image URL:</label>
                            <input
                                type="text"
                                value={newProductImage.image_url}
                                onChange={(e) => setNewProductImage({ ...newProductImage, image_url: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Product Image
                        </button>
                    </form>

                    {editProductImage && (
                        <form onSubmit={updateProductImage} className="mt-5">
                            <h2 className="text-xl font-bold">Update Product Image</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Product ID:</label>
                                <input
                                    type="text"
                                    value={editProductImage.product_id}
                                    onChange={(e) => setEditProductImage({ ...editProductImage, product_id: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Image URL:</label>
                                <input
                                    type="text"
                                    value={editProductImage.image_url}
                                    onChange={(e) => setEditProductImage({ ...editProductImage, image_url: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Product Image
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default ProductImages;
