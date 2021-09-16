import React, { Component } from 'react';
import logo from './logo.svg';
import { Nav } from './features/nav/Nav';
import { Counter } from './features/counter/Counter';
import { TicTacToe } from './features/tictactoe/TicTacToe';
import { ConnectX } from './features/connectX/ConnectX';
import { Tbd } from './features/bejeweled/Tbd';

// CSS
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: {
        'Counter': Counter,
        'TicTacToe': TicTacToe,
        'ConnectX': ConnectX,
        'Tbd': Tbd
      },
      itemSelected: null,      
    };
    this.handleClick = this.handleClick.bind(this);    
  }

  handleClick(i) {
    this.setState({ itemSelected: i.target.name});
  }

  render() {

    const itemSelected = this.state.itemSelected ? React.createElement(this.state.items[this.state.itemSelected], {pseudo: this.props.match.params.pseudo}) : null;    
    return (
      <div className="App">
        <Nav items={this.state.items} handleClick={this.handleClick}/>
        <div className="main">{itemSelected}</div>
{/*        <footer>
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
        </footer>*/}
      </div>
    );
  }
}

export default App;