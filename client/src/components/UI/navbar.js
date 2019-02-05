import React, { Component } from 'react';
import './navbar.css';
import {
  NavLink,
} from "react-router-dom";


class Header extends Component {
	render() {
		return (
		  <nav className="navbar navbar-dark  bg-dark">
				<div className="container">
					<h1 className="navbar-brand ">Navbar</h1>

					<NavLink to="/jobs">Browse Jobs</NavLink>
					<NavLink to="/client">Client</NavLink>
					<NavLink to="/login">Login</NavLink>
					<NavLink to="/sign_up">Sign Up</NavLink>
				</div>
		  </nav>
		)
	}
};


export default Header;
