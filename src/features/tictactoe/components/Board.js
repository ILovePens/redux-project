import React from 'react';
import Square from './Square';
import styles from '../Tictactoe.module.css';

class Board extends React.Component {
  renderSquare(i) {
    return (
    	<Square
    		key={i}   // We can't access "key" as a prop in child
    		index={i} // component so we pass it here instead
    		value={this.props.squares[i]}
    		onClick={() => this.props.onClick(i)}
    		winSquares={this.props.winSquares}
    	/> 
    );
  }

  createBoard() {
    let board = []
    let index = -1;
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let squares = [];
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        index++;
        squares.push(this.renderSquare(index));
      }
      //Create the parent and add the children
      board.push(<div key={i} className={styles.board_row}>{squares}</div>)
    }
    return board
  }

  render() {
    const isGameBoard = typeof this.props.isSelected === "undefined" ? true : false;

    const gameBoardClass = isGameBoard ? " " + styles.game_board : "";
    const selectedClass = this.props.isSelected ? " " + styles.selected : "";
    const title = isGameBoard ? "" : this.props.title;
    return (
      <div>
        <div className={styles.board + gameBoardClass + selectedClass} >
          {this.createBoard()}
        </div>
        <p>{title}</p>
      </div>
    );
  }
}

export default Board;