import React, { useState, useEffect } from 'react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editCategory, setEditCategory] = useState(null); // Track category being edited
    const [updateError, setUpdateError] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:2004/categories');
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/categories/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            const addedCategory = await response.json();
            if (response.ok) {
                setCategories([...categories, addedCategory.data]);
                setNewCategory({ name: '', description: '' });
            } else {
                setAddError(addedCategory.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/categories/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.success) {
                setCategories(categories.filter(category => category.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    const updateCategory = async (e) => {
        e.preventDefault();
        console.log("Murad");
        
        console.log("Updating category:", editCategory); // Log the category being updated

        try {
            const response = await fetch(`http://localhost:2004/categories/update/${editCategory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editCategory),
            });

            const updatedCategory = await response.json();
            console.log("API Response:", updatedCategory); // Log the API response

            if (response.ok) {
                setCategories(categories.map(cat => cat.id === editCategory.id ? updatedCategory.data : cat));
                setEditCategory(null); // Clear the form after update
                console.log("Category updated successfully");
            } else {
                setUpdateError(updatedCategory.message);
                console.log("Update failed:", updatedCategory.message);
            }
        } catch (error) {
            setUpdateError(error.message);
            console.error("Error during update:", error); // Log any errors
        }
    };


    // Define handleEditCategory function
    const handleEditCategory = (category) => {
        setEditCategory(category); // Set the selected category to be edited
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Categories</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">ID</th>
                                <th className="border border-gray-400 px-4 py-2">Name</th>
                                <th className="border border-gray-400 px-4 py-2">Description</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <tr key={category.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{category.id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{category.name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{category.description}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditCategory(category)} // Trigger the edit form
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border border-gray-400 px-4 py-2 text-center">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New Category</h2>
                    <form onSubmit={addCategory} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Name:</label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Description:</label>
                            <input
                                type="text"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Category
                        </button>
                    </form>

                    {editCategory && (
                        <form onSubmit={updateCategory} className="mt-5">
                            <h2 className="text-xl font-bold">Update Category</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Name:</label>
                                <input
                                    type="text"
                                    value={editCategory.name}
                                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Description:</label>
                                <input
                                    type="text"
                                    value={editCategory.description}
                                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Category
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditCategory(null)} // Cancel update
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

export default Categories;
