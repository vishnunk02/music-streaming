import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import './songdetail.css';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBackward, faBars, faForward, faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Collapse from 'react-bootstrap/Collapse';

function Songdetail({ idtopass }) {
    const [song, setSong] = useState({});
    const [like, setLike] = useState({});
    const [playId, setId] = useState({});
    const [playlist, setPlaylist] = useState([]);
    const audioRef = useRef(null);



    const fetchDataDetail = async (id) => {
        try {
            let header = new Headers();
            header.append("Content-type", 'application/json');
            let token = localStorage.getItem('token');
            if (token) {
                header.append('Authorization', token);
            }
            const requestOptions = {
                method: 'GET',
                headers: header
            };

            const response = await fetch(`http://localhost:8000/song/${id}/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSong(data);
            var audio = document.getElementById("myAudio");
            audio.src = data.song_file;
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchLike = async (id) => {
        try {
            let header = new Headers();
            header.append("Content-type", 'application/json');
            let token = localStorage.getItem('token');
            if (token) {
                header.append('Authorization', token);
            }
            const requestOptions = {
                method: 'GET',
                headers: header
            };
            const response = await fetch(`http://localhost:8000/like/${id}/likedsongs/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLike(data)
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchPlaylist = async () => {
        try {
            let header = new Headers();
            header.append("Content-type", 'application/json');
            let token = localStorage.getItem('token');
            if (token) {
                header.append('Authorization', token);
            }
            const requestOptions = {
                method: 'GET',
                headers: header
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


    const addPlaylist = async (id) => {
        try {
            let header = new Headers();
            header.append("Content-type", 'application/json');
            let token = localStorage.getItem('token');
            if (token) {
                header.append('Authorization', token);
            }
            const requestOptions = {
                method: 'POST',
                headers: header
            };

            const response = await fetch(`http://localhost:8000/addtoplaylist/${song.id}/${id}/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPlaylist(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchPlaylist()
    }

    let token = localStorage.getItem('token');
    useEffect(() => {
        if (idtopass) {
            fetchDataDetail(idtopass);
            if (token) {
                fetchLike(idtopass)
            }
            setId(idtopass)
        }
        // var audio = document.getElementById("myAudio");
        // var currentSongIndex = 0;

    }, [idtopass]);
    const nextPlay = (opt) => {
        if (opt === 'pre') {
            setId(playId - 1)

        } else if (opt === 'nxe') {
            setId(playId + 1)
        }
        else if (playId < 1) {
            playId = 1;
        }

        fetchDataDetail(playId);

    }

    const [open, setOpen] = useState(false);

    if (!song) {
        setOpen(false)
    }


    const addtoPlaylist = (id) => {
        addPlaylist(id)
        setShow(false)
    }
    console.log(like);
    const iconColor = like === true ? 'red' : 'rgb(151, 151, 151)';



    const likeChange = async (id) => {
        try {
            let header = new Headers();
            header.append("Content-type", 'application/json');
            let token = localStorage.getItem('token');
            if (token) {
                header.append('Authorization', token);
            }
            if (like === false) {
                const requestOptions = {
                    method: 'POST',
                    headers: header
                };

                const response = await fetch(`http://localhost:8000/like/${id}/likesong/`, requestOptions);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLike(data);
            }
            else {
                const requestOptions = {
                    method: 'GET',
                    headers: header
                };

                const response = await fetch(`http://localhost:8000/like/${id}/unlikesong/`, requestOptions);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLike(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <div className="play-main-div">
                <Row className="play-div">
                    <Col lg="4" md="12" className="song-title">
                        <img src={song.image} className="song-image rounded ms-2" alt="" />
                        <h3 className="title ms-2 text-white">{song.name}</h3>
                    </Col>
                    <Col lg="4" md="12">
                        <div className="btn-col-div">
                            <Button
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                className="mt-4 up-button"
                                variant="btn"
                            >
                                <FontAwesomeIcon icon={faAngleUp} className="icon"></FontAwesomeIcon>
                            </Button>
                        </div>
                        <div className="collapse-container">
                            <Collapse in={open && song} className="mb-5 rounded">
                                {song && (
                                    <div id="example-collapse-text">
                                        <div className="collapse-head">
                                            <Button
                                                onClick={() => setOpen(!open)}
                                                aria-controls="example-collapse-text"
                                                aria-expanded={open}
                                                className="mt-4 up-button"
                                                variant="btn"
                                            >
                                                <FontAwesomeIcon icon={faAngleDown} className="icon"></FontAwesomeIcon>
                                            </Button>
                                            <div className="p-5 collapse-body">
                                                <img src={song.image} className="collapse-image rounded" />
                                                <h5 className="mt-4 text-center">{song.artist_name}</h5>
                                                <p className="text-center">{song.name}</p>
                                                {token && (
                                                    <div>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={<Tooltip id="button-tooltip">Like</Tooltip>}
                                                        >
                                                            <button className="icon-button btn">
                                                                <FontAwesomeIcon onClick={() => likeChange(song.id)} style={{ color: iconColor }} className="icon m-3 love" icon={faHeart} />
                                                            </button>
                                                        </OverlayTrigger>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={<Tooltip id="button-tooltip">Add to Playlist</Tooltip>}
                                                        >
                                                            <button className="icon-button btn" onClick={handleShow}>
                                                                <FontAwesomeIcon className="icon m-3" icon={faPlus} />
                                                            </button>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={<Tooltip id="button-tooltip">More Options</Tooltip>}
                                                        >
                                                            <button className="icon-button btn">
                                                                <FontAwesomeIcon className="icon m-3" icon={faBars} />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Collapse>

                        </div>
                        <div className="song">
                            <button className="icon-button btn" onClick={() => nextPlay('pre')}><FontAwesomeIcon icon={faBackward} className="icon me-3"></FontAwesomeIcon></button>
                            <div className="audio-player">
                                <audio id="myAudio" ref={audioRef} controls autoPlay className="spotify-audio-player">
                                    <source src="" />
                                </audio>
                            </div>

                            <button className="icon-button btn" onClick={() => nextPlay('nxe')}><FontAwesomeIcon icon={faForward} className="icon ms-3"></FontAwesomeIcon></button>
                        </div>
                    </Col>
                    <Col lg="4" md="12" className="text-end song-button">
                        {token && (
                            <div className="me-5">
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={<Tooltip id="button-tooltip">Like</Tooltip>}
                                >
                                    <button className="icon-button btn">
                                        <FontAwesomeIcon onClick={() => likeChange(song.id)} style={{ color: iconColor }} className="icon m-3" icon={faHeart} />
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={<Tooltip id="button-tooltip">Add to Playlist</Tooltip>}
                                >
                                    <button className="icon-button btn" onClick={handleShow}>
                                        <FontAwesomeIcon className="icon m-3" icon={faPlus} />
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={<Tooltip id="button-tooltip">More Options</Tooltip>}
                                >
                                    <button className="icon-button btn">
                                        <FontAwesomeIcon className="icon m-3" icon={faBars} />
                                    </button>
                                </OverlayTrigger>
                            </div>
                        )}
                    </Col>
                </Row>
                <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <div className="playlist-modal">
                        <Modal.Header>
                            <Modal.Title className="text-white">Playlists</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-white">
                            {playlist.length > 0 && (
                                playlist.map((play, index) => (
                                    <button onClick={() => addtoPlaylist(play.id)} className="btn btn-outline-light m-4" key={index}>{play.playlist_name}</button>
                                ))
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Songdetail;
