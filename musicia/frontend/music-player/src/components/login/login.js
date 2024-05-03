import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';


import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [loginFormData, setLoginFormData] = useState({});
    const [signupFormData, setSignupFormData] = useState({});
   

    const handleLoginInputChange = (event) => {
        const { name, value } = event.target;
        setLoginFormData({
            ...loginFormData,
            [name]: value
        });
    };

    const handleSignupInputChange = (event) => {
        const { name, value } = event.target;
        setSignupFormData({
            ...signupFormData,
            [name]: value
        });
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginFormData)
        };

        fetch('http://localhost:8000/token/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let token = "Token " + data.token;
                localStorage.setItem('token', token);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupFormData)
        };

        fetch('http://localhost:8000/user/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <Container className='log-cont'>
            <Card>
                <div className='login-card'>
                    <div className='log-c-btn'>
                        <a href='#login' className='btn btn-log'>
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </a>
                        <a href='#signin' className='btn btn-log'>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </a>
                    </div>
                    <div className='login fade-in' id='login'>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group mb-3 mt-3">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    value={loginFormData.username || ''}
                                    onChange={handleLoginInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={loginFormData.password || ''}
                                    onChange={handleLoginInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="form-control btn btn-outline-light rounded submit px-3">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='signin fade-in' id='signin'>
                        <form onSubmit={handleSignupSubmit}>
                            <div className="form-group mb-3 mt-3">
                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    placeholder="First Name"
                                    value={signupFormData.first_name || ''}
                                    onChange={handleSignupInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    placeholder="Last Name"
                                    value={signupFormData.last_name || ''}
                                    onChange={handleSignupInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    value={signupFormData.username || ''}
                                    onChange={handleSignupInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={signupFormData.email || ''}
                                    onChange={handleSignupInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={signupFormData.password || ''}
                                    onChange={handleSignupInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="form-control btn btn-outline-light rounded submit px-3">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Card>
        </Container>
    );
}

export default Login;
