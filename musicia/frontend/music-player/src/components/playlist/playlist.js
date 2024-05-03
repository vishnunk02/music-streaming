import React, { useState, useEffect } from "react";
import './playlist.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";

function Playlist() {
    const [formData, setFormData] = useState({});
    const [open, setOpen] = useState(false);
    const [playlist, setPlaylist] = useState([]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchPlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = new Headers();
            headers.append("Content-type", 'application/json');
            if (token) {
                headers.append('Authorization', token);
            }
            const requestOptions = {
                method: 'GET',
                headers: headers
            };

            const response = await fetch(`http://localhost:8000/playlist/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPlaylist(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const createPlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = new Headers();
            headers.append("Content-type", 'application/json');
            if (token) {
                headers.append('Authorization', token);
            }
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body:JSON.stringify(formData)
            };

            const response = await fetch(`http://localhost:8000/playlist/createplaylist/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPlaylist(prevPlaylist => [...prevPlaylist, data]);
            setOpen(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchPlaylist()
    }, []);


    const deletePlaylist = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = new Headers();
            headers.append("Content-type", 'application/json');
            if (token) {
                headers.append('Authorization', token);
            }
            const requestOptions = {
                method: 'GET',
                headers: headers,
            };

            const response = await fetch(`http://localhost:8000/playlist/${id}/deleteplaylist/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    } 

    return (
        <div>
            <div className="p-3 text-end">
                <form onSubmit={createPlaylist}>
                    <div id="playlist-in" style={{ display: open ? 'block' : 'none' }}>
                        <input
                            type="text"
                            name="playlist_name"
                            value={formData.playlist_name || ''}
                            onChange={handleInputChange}
                            className="playlist-name-input"
                            required
                        />
                        <button className="btn btn-light me-4" type="submit">Create</button>
                    </div>
                </form>
                <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => setOpen(!open)}
                    className="icon mt-2"
                />
            </div>
            <Row className="row">
                {playlist.map((play, index) => (
                    <Col lg="6" md="6" sm="12" key={index}>
                        <Card style={{ width: '18rem', position: 'relative' }} className="playlist-card m-4">
                            <div style={{ position: 'relative' }} className="card-bdy rounded">
                                <button className="btn" onClick={ () => deletePlaylist(play.id)}>
                                    <FontAwesomeIcon icon={faTrash} className="icon"></FontAwesomeIcon>
                                </button>
                                <div className="overlay d-flex justify-content-between align-items-center position-absolute w-100" style={{ bottom: '0', padding: '10px', color: 'white' }}>
                                    <span><h2>{play.playlist_name}</h2></span>
                                    <Link to={`/playlistdetail/${play.id}`} className="play-button" variant="btn">
                                        <FontAwesomeIcon size="2x" className="play-icon" icon={faCirclePlay}></FontAwesomeIcon>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Playlist;
