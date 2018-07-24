import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    // define more variables and render them in your JSX
    let helloWorld = 'Welcome to the Road to learn React';
    // use a complex object to represent a user with a first name and last name
    let user = {
      'first_name': 'Vincent',
      'last_name': `D'Onofrio`
    };
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{helloWorld}</h2>
        {/* render the user properties in your JSX */}
        <p>My name is {user.last_name}, {user.first_name} {user.last_name}</p>
      </div>
    );
  }
}

export default App;
