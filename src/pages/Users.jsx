import React, { useState, useEffect } from 'react';

const User = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [addError, setAddError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:2004/users');
            const data = await response.json();
            setUsers(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2004/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const addedUser = await response.json();
            if (response.ok) {
                setUsers([...users, addedUser.data]);
                setNewUser({ name: '', email: '' });
            } else {
                setAddError(addedUser.message);
            }
        } catch (error) {
            setAddError(error.message);
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:2004/users/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.success) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                const errorData = await response.json();
                setDeleteError(errorData.message);
            }
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:2004/users/update/${editUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });
            const updatedUser = await response.json();
            console.log(updatedUser);
            
            if (response.ok) {
                setUsers(users.map(user => user.id === editUser.id ? updatedUser.data : user));
                setEditUser(null);
            } else {
                setUpdateError(updatedUser.message);
            }
        } catch (error) {
            setUpdateError(error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <h1 className="text-center text-2xl font-extrabold">Users</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-10">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Username</th>
                                <th className="border border-gray-400 px-4 py-2">Email</th>
                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{user.username}</td>
                                        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border border-gray-400 px-4 py-2 text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {deleteError && <p className="text-red-500 mt-4">Error: {deleteError}</p>}

                    <h2 className="text-xl font-bold mt-10">Add New User</h2>
                    <form onSubmit={addUser} className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Username:</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        {addError && <p className="text-red-500">{addError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add User
                        </button>
                    </form>

                    {editUser && (
                        <form onSubmit={updateUser} className="mt-5">
                            <h2 className="text-xl font-bold">Update User</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Username:</label>
                                <input
                                    type="text"
                                    value={editUser.username}
                                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update User
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditUser(null)}
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

export default User;
