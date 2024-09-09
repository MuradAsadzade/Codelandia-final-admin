import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:2004/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(data.message);
                // Call the onLoginSuccess prop to update the auth state in App
                onLoginSuccess();
                // Optionally store the token in localStorage
                localStorage.setItem('token', data.data.token);
                console.log("Murad:", data);
                console.log(data.data.token);

                // useNavigate("/");

            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-center text-2xl font-extrabold">Login</h1>
            <form onSubmit={handleLogin} className="mt-5">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Login
                </button>

                <Link to="/register">
                    <span className="bg-black ml-10 w-10 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Dont have account?
                    </span>
                </Link>
            </form>

        </div>
    );
};

export default Login;
