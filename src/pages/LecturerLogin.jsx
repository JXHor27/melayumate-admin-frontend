import React, { useState } from 'react';
import { API_BASE_URL } from "../api/apiConfig";
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
function LecturerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim()){
      setError('Username cannot be empty.'); 
      return;
    }

    if (!password.trim()){
      setError('Password cannot be empty.');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-100 dark:bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
            Lecturer Portal
          </h2>
          <p className="mt-2 text-center text-slate-800 dark:text-slate-400">
            Sign in to manage lesson content.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-200 dark:bg-slate-900 border border-slate-700 text-gray-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 text-lg rounded-t-md"
                placeholder="Username"
              />
            </div>
          <div className="w-full p-3 rounded-lg bg-slate-200 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-100 flex border border-slate-700 justify-between items-center focus-within:ring-2 focus:ring-purple-500 mt-2 text-lg" >
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="display:none w-full rounded-full outline-none placeholder-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> 
                <span><FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer'}}/>
                </span>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-center text-sm font-semibold">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturerLogin;