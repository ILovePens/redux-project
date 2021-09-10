import React, { Component } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { TicTacToe } from './features/tictactoe/TicTacToe';
import './App.css';

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      itemSelected: null,
      // showHideCounter: false
    };
    // this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    this.setState({ itemSelected: i.target.name});
  }

  render() {
    console.log(this.props);
    const itemSelected = this.state.itemSelected ? React.createElement(this.props.items[this.state.itemSelected], {}) : null;
    console.log(itemSelected)
    const navItems = Object.keys(this.props.items)
          .map((key,index) =>
            <button name={key} key={index} onClick={(i) => this.handleClick(i)}>{key}</button>
          );    
    // const {showHideCounter} = this.state;
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {itemSelected}
        <div className="nav-items">
          {navItems}
        </div>
      </header>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: {
        'Counter': Counter,
        'TicTacToe': TicTacToe
      },
    };
  } 
  render() {   
    return (
      <div className="App">
        <Nav items={this.state.items}/>
        <footer>
          <span>
            <span>Learn </span>
            <a
              className="App-link"
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux Toolkit
            </a>
            ,<span> and </span>
            <a
              className="App-link"
              href="https://react-redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Redux
            </a>
          </span>        
        </footer>
      </div>
    );
  }
}

export default App;
