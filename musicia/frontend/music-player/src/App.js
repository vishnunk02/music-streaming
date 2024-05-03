import './App.css';
import ReactDOM from 'react-dom/client';
import NavBar from './components/navbar/navbar'
import React from "react";
import { 
  Container,
  Row, 
  Col } from 'react-bootstrap';
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
} from "react-router-dom";


function App() {
  return (
    <div>
      <NavBar/>
    </div>
  )
}

export default App;
