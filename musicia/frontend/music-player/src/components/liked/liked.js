import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEllipsisVertical, faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import './liked.css'


function Liked(props) {

    const [liked, setSongs] = useState([]);
    const [songId, setId] = useState([]);

    const fetchLikeddata = async () => {
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
            const response = await fetch(`http://localhost:8000/like/listlikedsong/`, requestOptions);
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
        fetchLikeddata();
    }, []);


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

    let port = "http://localhost:8000/"

    const fetchDataDetail = (id) => {
        console.log(id);
        setId(id);
        props.sendData(id);
    }

    return (
        <div>
            <Card className="card">
                <table className="table">
                    <thead className="fixed">
                        <tr>
                            <th>#</th>
                            <th colSpan={2}>Title</th>
                            <th>Artist</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody className="playlist-body">
                        {liked.map((like, index) => (
                            <tr key={index} className="list-row" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                <td className="index">
                                    <span className={`mt-5 number ${hoveredIndex === index ? 'hidden' : ''}`}>{index + 1}</span>
                                    <span onClick={() => fetchDataDetail(like.song.id)} className={`mt-5 play-button ${hoveredIndex !== index ? 'hidden' : ''}`}>
                                        <FontAwesomeIcon className='me-3' icon={faPlay}></FontAwesomeIcon>
                                    </span>

                                </td>

                                <td>
                                    <img className="table-image rounded" src={port + like.song.image} />
                                </td>
                                <td>
                                    <span className="ms-2">{like.song.name}</span>
                                </td>
                                <td>{like.song.artist_name}</td>
                                <td id={`duration-${index}`}>Loading...</td>
                                <td style={{ display: "none" }}>
                                    <audio controls onLoadedMetadata={e => handleLoadedMetadata(e, index)}>
                                        <source src={port + like.song.song_file} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ListGroup className="listgroup">
                    {liked.map((like, index) => (
                        <ListGroup.Item key={index} onClick={() => fetchDataDetail(like.song.id)} className="listitem">
                            <span>
                                <img className="table-image rounded" src={port + like.song.image} alt={like.song.name} />
                            </span>
                            <span className="song-details ms-2">
                                <span className="song-name">{like.song.name}</span>
                            </span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Card>
        </div>
    );

}

export default Liked