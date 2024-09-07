import React, { useState, useEffect } from 'react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0 });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editProduct, setEditProduct] = useState(null); // Track product being edited
    const [updateError, setUpdateError] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:2004/products');
            const data = await response.json();
            setProducts(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            const addedProduct = await response.json();
            if (response.ok) {
                setProducts([...products, addedProduct.data]);
                setNewProduct({ name: '', description: '', price: 0 });
            } else {
                setAddError(addedProduct.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/products/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.success) {
                setProducts(products.filter(product => product.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        console.log("Updating product:", editProduct);

        try {
            const response = await fetch(`http://localhost:2004/products/update/${editProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editProduct),
            });

            const updatedProduct = await response.json();
            if (response.ok) {
                setProducts(products.map(prod => prod.id === editProduct.id ? updatedProduct.data : prod));
                setEditProduct(null);
            } else {
                setUpdateError(updatedProduct.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
    };

    useEffect(() => {
        
        console.log(products);
        fetchProducts();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Products</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
    <thead>
        <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Description</th>
            <th className="border border-gray-400 px-4 py-2">Price</th>
            <th className="border border-gray-400 px-4 py-2">Stock Quantity</th>
            <th className="border border-gray-400 px-4 py-2">Image</th> 
            <th className="border border-gray-400 px-4 py-2">Actions</th>
        </tr>
    </thead>
    <tbody>
        {products.length > 0 ? (
            products.map(product => (
                //  console.log(product.images);
                <tr key={product.id} className="text-center">
                    <td className="border border-gray-400 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-400 px-4 py-2">{product.description}</td>
                    <td className="border border-gray-400 px-4 py-2">${product.price}</td>
                    <td className="border border-gray-400 px-4 py-2">{product.stock_quantity}</td>
                    <td className="border border-gray-400 px-4 py-2">
                        {product.images? (
                           
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-16 h-16 object-cover" // Adjust size as needed
                            />
                        ) : (
                            <span>No Image</span>
                         )} 
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                        <button
                            onClick={() => deleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => handleEditProduct(product)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                        >
                            Update
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="6" className="border border-gray-400 px-4 py-2 text-center">No products found</td>
            </tr>
        )}
    </tbody>
</table>


                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Product</h2>
                    <form onSubmit={addProduct} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Name:</label>
                            <input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Description:</label>
                            <input
                                type="text"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Price:</label>
                            <input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Stock Quantity:</label>
                            <input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseFloat(e.target.value) })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Product
                        </button>
                    </form>

                    {editProduct && (
                        <form onSubmit={updateProduct} className="mt-5">
                            <h2 className="text-xl font-bold">Update Product</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Name:</label>
                                <input
                                    type="text"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Description:</label>
                                <input
                                    type="text"
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Price:</label>
                                <input
                                    type="number"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Product
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditProduct(null)}
                                className="bg-gray-
                                500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
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

export default Products;
