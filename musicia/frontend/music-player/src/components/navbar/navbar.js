import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { redirect } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faBars, faHeart, faMusic, faPlay, faQuestion, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Login from '../login/login';
import Song from '../songs/songs';
import Songdetail from '../songdetail/songdetail';
import Playlist from '../playlist/playlist';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,

} from "react-router-dom";

import './navbar.css';
import Search from '../search/search';
import Playlistdetail from '../playlistdetail/playlistdetail';
import Liked from '../liked/liked';
function NavBar() {

  const [user, setUser] = useState([]);

  let token = localStorage.getItem('token');

  const [open, setOpen] = useState(false);


  const fetchUserdata = async () => {
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
      const response = await fetch(`http://localhost:8000/detail/userdetail/`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    if (token) {
      fetchUserdata();
    }
  }, []);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [song, setSongs] = useState([]);

  const [id, setData] = useState()

  const sendData = (data) => {
    setData(data)
  }

  const renderTooltipLog = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <p>Logout</p>
    </Tooltip>
  );


  const renderTooltipUser = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div>
        <p>Login</p>
      </div>
    </Tooltip>
  );

  const logOut = () => {
    localStorage.removeItem('token')
    window.location.reload();
  }


  return (
    <div className='bdy'>
      <Router>
        <Navbar expand="lg" className="nav">
          <Navbar.Brand href="#home" className='musicia text-white'><FontAwesomeIcon className='me-3' icon={faMusic}></FontAwesomeIcon><strong>Musicia</strong></Navbar.Brand>
          <Navbar.Toggle className='toggle'>

            <Button variant='btn' onClick={handleShow}>
              <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </Button>
          </Navbar.Toggle>
        </Navbar>
        <Row className='main'>
          <Col lg="4" className="d-none d-lg-block">
            <div className='col-sidebar rounded mt-3 ms-3'>
              <nav id="sidebar" className='rounded'>
                <ul className="list-unstyled components ms-3">
                  <li className="active">
                    <Link to="/song"><FontAwesomeIcon className='me-3' icon={faHome}></FontAwesomeIcon><strong>Home</strong></Link>
                  </li>
                  <li className="active">
                    <Link to="/search"><FontAwesomeIcon className='me-3' icon={faSearch}></FontAwesomeIcon><strong>Search</strong></Link>
                  </li>
                </ul>
              </nav>
              <nav id="sidebar" className='rounded nav2'>
                {token && (
                  <ul className="list-unstyled components ms-3">
                    <li>
                      <Link to="/playlist"><FontAwesomeIcon className='me-3' icon={faPlay}></FontAwesomeIcon><strong>Playlists</strong></Link>
                    </li>
                    <li>
                      <Link to="/liked"><FontAwesomeIcon className='me-3' icon={faHeart}></FontAwesomeIcon><strong>Liked</strong></Link>
                    </li>
                  </ul>
                )}
              </nav>
              <nav id="sidebar" className='rounded nav3'>
                {token ? (
                  <ul className="list-unstyled components ms-3">
                    <li className="active d-flex">
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipLog}
                      >
                        <Link><FontAwesomeIcon className='me-3 ms-1' icon={faUser}></FontAwesomeIcon><strong>{user.first_name}</strong></Link>
                      </OverlayTrigger>
                    </li>
                    <li className="active d-flex">
                      <button className='ms-3 mt-2 mb-3 btn btn-outline-light' onClick={() => logOut()}>Logout</button>
                    </li>
                  </ul>
                ) : (
                  <ul className="list-unstyled components ms-3">
                    <li className="active d-flex">
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipUser}
                      >
                        <Link to="/login"><FontAwesomeIcon className='me-3' icon={faQuestion}></FontAwesomeIcon><strong>Dont have an account?</strong></Link>
                      </OverlayTrigger>
                    </li>
                  </ul>
                )}
              </nav>
            </div>
          </Col>
          <Col lg="8" className='rounded cont mt-3'>
            <Routes>
              <Route
                path="/song"
                element={<Song sendData={sendData} />}
              ></Route>
            </Routes>
            <Routes>
              <Route
                path="/search"
                element={<Search sendData={sendData} />}
              ></Route>
            </Routes>
            <Routes>
              <Route
                path="/playlist"
                element={<Playlist />}
              ></Route>
            </Routes>
            <Routes>
              <Route
                path="/playlistdetail/:id"
                element={<Playlistdetail sendData={sendData} />}
              ></Route>
            </Routes>
            <Routes>
              <Route
                path="/liked"
                element={<Liked sendData={sendData} />}
              ></Route>
            </Routes>
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              ></Route>
            </Routes>
          </Col>
        </Row>
        <div className='play fixed-bottom'>
          <Songdetail idtopass={id} />
        </div>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header className='collapse-title' closeButton>
            <Offcanvas.Title><FontAwesomeIcon className='me-3' icon={faMusic}></FontAwesomeIcon><strong>Musicia</strong></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='off'>
            <div className='col-sidebar mt-3 ms-3'>
              <nav id="sidebar" className='rounded'>
                <ul className="list-unstyled components ms-3">
                  <li className="active" onClick={() => handleClose()}>
                    <Link to="/song"><FontAwesomeIcon className='me-3' icon={faHome}></FontAwesomeIcon><strong>Home</strong></Link>
                  </li>
                  <li className="active" onClick={() => handleClose()}>
                    <Link to="/search"><FontAwesomeIcon className='me-3' icon={faSearch}></FontAwesomeIcon><strong>Search</strong></Link>
                  </li>
                  {token && (
                    <div>
                      <li onClick={() => handleClose()}>
                        <Link to="/playlist"><FontAwesomeIcon className='me-3' icon={faPlay}></FontAwesomeIcon><strong>Playlists</strong></Link>
                      </li>
                      <li onClick={() => handleClose()}>
                        <Link to="/liked"><FontAwesomeIcon className='me-3' icon={faHeart}></FontAwesomeIcon><strong>Liked</strong></Link>
                      </li>
                    </div>
                  )}
                  {token ? (
                    <div>
                      <li className="active d-flex" onClick={() => handleClose()}>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltipLog}
                        >
                          <Link><FontAwesomeIcon className='me-3 ms-1' icon={faUser}></FontAwesomeIcon><strong>{user.first_name}</strong></Link>
                        </OverlayTrigger>
                      </li>
                      <li className="active d-flex" onClick={() => handleClose()}>
                        <button className='ms-3 mt-2 mb-3 btn btn-outline-light' onClick={() => logOut()}>Logout</button>
                      </li>
                    </div>
                  ) : (
                    <li className="active d-flex" onClick={() => handleClose()}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipUser}
                      >
                        <Link to="/login"><FontAwesomeIcon className='me-3' icon={faQuestion}></FontAwesomeIcon><strong>Dont have an account?</strong></Link>
                      </OverlayTrigger>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Router>
    </div >

  );
}

export default NavBar;