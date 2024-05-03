import React, { useState, useEffect } from "react";
import './search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';


function Search(props) {
    const [songs, setSongs] = useState([]);
    const [results, setResults] = useState([]);
    const [searchsong, setSearchSong] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [songId, setId] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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

                const response = await fetch('http://localhost:8000/song/', requestOptions);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSongs(data);
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const handleClick = (result) => {
        setSearchSong(result);
        setSearchTerm('')
    };

    const handleChange = (e) => {
        setSearchSong('')
        const pattern = e.target.value;
        setSearchTerm(pattern);
        const filteredSongs = songs.filter(item => item.name.toLowerCase().includes(pattern.toLowerCase()));
        setResults(filteredSongs);
    };

    const clearInput = () => {
        setSearchTerm('')
    }

    const fetchDataDetail = (id) => {
        console.log(id);
        setId(id);
        props.sendData(id);
    }

    return (
        <div>
            <div className="main-div">
                <div className="body">
                    <div className="wrap">
                        <div className="search mt-3">
                            <input type="text" onChange={handleChange} value={searchTerm} className="searchTerm" placeholder="What are you looking for?" />
                            <button type="submit" className="searchButton">
                                <FontAwesomeIcon icon={faXmark} onClick={() => clearInput()}></FontAwesomeIcon>
                            </button>
                        </div>
                        <div className="fixed">
                            {searchTerm.length > 0 && (
                                <ListGroup className="drop-menu mt-2">
                                    {results.map((result, index) => (
                                        <ListGroup.Item onClick={() => handleClick(result)} key={index} className="text-white menu-item">
                                            {result.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>
                    </div>
                </div>
                <Container>
                    <Card className="search-card">
                        {searchsong && (
                            <Row>
                                <Col lg="4" className="reslt-image">
                                    <img onClick={() => fetchDataDetail(searchsong.id)} src={searchsong.image} alt="" className="result-image rounded mt-5 ms-5" />
                                </Col>
                                <Col lg="8" className="search-result">
                                    <h3 className="text-white mt-5 clss">{searchsong.artist_name}</h3>
                                    <h5 className="text-white mt-5 clss">{searchsong.name}</h5>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Container>
            </div>
        </div>
    );
}

export default Search;
