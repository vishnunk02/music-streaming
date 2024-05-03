import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEllipsisVertical, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import './playlistdetail.css'

function Playlistdetail(props) {
    const { id } = useParams(); // Extracting id from useParams()

    let sid = id

    const [playlists, setSongs] = useState([]);
    const [songId, setId] = useState([]);


    const fetchPlaylistData = async (playlistId) => {
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
            const response = await fetch(`http://localhost:8000/playlist/${playlistId}/listplaylistsong/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSongs(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchPlaylistData(id);
    }, [id]);


    function handleLoadedMetadata(e, index) {
        const audio = e.target;
        const duration = audio.duration;
        const durationCell = document.getElementById(`duration-${index}`);
        durationCell.textContent = formatDuration(duration);
    }

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const fetchDataDetail = (id) => {
        console.log(id);
        setId(id);
        props.sendData(id);
    }

    let port = "http://localhost:8000/"

    const deletePlay = async (id) => {
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
            const response = await fetch(`http://localhost:8000/deletesong/${id}/${playlists[0].playlist.id}/`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            fetchPlaylistData(sid);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            {playlists && playlists.length > 0 && (
                <div className="playlist-detail p-4">
                    <div className="d-flex">
                        <h1 className="text-white">{playlists[0].playlist.playlist_name}</h1>
                    </div>
                </div>
            )}
            <Card className="card">
                <table className="table">
                    <thead className="fixed">
                        <tr>
                            <th>#</th>
                            <th colSpan={2}>Title</th>
                            <th>Artist</th>
                            <th colSpan={2}>Duration</th>
                        </tr>
                    </thead>
                    <tbody className="playlist-body">
                        {playlists.map((playlist, index) => (
                            <tr key={index} className="list-row" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                <td className="index">
                                    <span className={`mt-5 number ${hoveredIndex === index ? 'hidden' : ''}`}>{index + 1}</span>
                                    <span onClick={() => fetchDataDetail(playlist.song.id)} className={`mt-5 play-button ${hoveredIndex !== index ? 'hidden' : ''}`}>
                                        <FontAwesomeIcon className='me-3' icon={faPlay}></FontAwesomeIcon>
                                    </span>

                                </td>

                                <td>
                                    <img className="table-image rounded" src={port + playlist.song.image} />
                                </td>
                                <td>
                                    <span className="ms-2">{playlist.song.name}</span>
                                </td>
                                <td>{playlist.song.artist_name}</td>
                                <td id={`duration-${index}`}>Loading...</td>
                                <td><button className="btn"><FontAwesomeIcon onClick={ () => deletePlay(playlist.song.id)} icon={faTrash} className="icon"></FontAwesomeIcon></button></td>
                                <td style={{ display: "none" }}>
                                    <audio controls onLoadedMetadata={e => handleLoadedMetadata(e, index)}>
                                        <source src={port + playlist.song.song_file} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ListGroup className="listgroup">
                    {playlists.map((playlist, index) => (
                        <ListGroup.Item key={index} onClick={() => fetchDataDetail(playlist.song.id)} className="listitem">
                            <span>
                                <img className="table-image rounded" src={port + playlist.song.image} alt={playlist.song.name} />
                            </span>
                            <span className="song-details ms-2">
                                <span className="song-name">{playlist.song.name}</span>
                            </span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Card>
        </div>
    );
}

export default Playlistdetail;
