import React from 'react';
import Slot from './Slot';
import base from '../../../base';
import { getDatabase } from "firebase/database";

// const database = getDatabase();
// STYLE
import { animateBoards, styleWin } from '../ConnectXTransitions.js';
import styles from '../ConnectX.module.css';

class Board extends React.Component {
  componentDidMount() {
    if(this.props.isMainBoard) {
    }
  }

  // ANIMATION & WIN TRIGGER //
  componentDidUpdate() {
    // We use this hook to manipulate the transitions on the dom elements 
    const transitions = this.props.transitions;
    if(this.props.isMainBoard) {
    this.props.startWatchingStepNumber();
    console.log('main upadte')
      // If transitions are present, we play them
      if (transitions && (transitions.slots || transitions.board)) {
        animateBoards();
      } else {
        // If there's none, we directly style the winning slots
        if(this.props.winIndexes.length) styleWin();
      }
    }
  }

  // TRANSITIONS CALLBACK //
  handleTransitionEnd = (event) => {
    // We wait for the end of the transitions to style the winning slots
    styleWin();
  };

  // PREPARE THE SLOT //
  renderSlot = (i, isBoardWon) => {
    // We deactivate the handleclick action if the board is won
    const onClickFunc = isBoardWon ? undefined : () => this.props.onClick(i);

    // Determine if the slot is part of a winning streak
    const winIndexes = isBoardWon ? this.props.winIndexes : null;
    const winStyle = winIndexes && winIndexes.includes(i) ? true : false;  

    // Assign the slot a score based on the animation map: the higher the score, the longer the aniamtion 
    const transitions = this.props.transitions ? this.props.transitions.slots : null;
    let slotScore = 0;
    let animationCallback;
    if(transitions && transitions[i]) {
      slotScore = transitions[i];
      if(isBoardWon) { // For now we only put the callback to style a win 
        // Sort out the null elements, then sort in descending order the slotScores that are left inside
        // and take out the first value, which indicates the maximum animation score for this render
        const maxScore = transitions.filter(el => {return el != null;}).sort((a, b) => b - a)[0];
        // Finds the first index with a maxScore in the map and check if it corresponds to the current index
        const isFirstMaxScoreSlot = i === transitions.findIndex(e => e === maxScore);
        // We make this slot a reference for the longest animation and put the callback onto it
        if(isFirstMaxScoreSlot) animationCallback = (i) => this.handleTransitionEnd(i);
      }
    }
    return (
      <Slot
        key={i}
        value={this.props.slots[i]}
        onClick={onClickFunc}
        slotScore={slotScore}
        winStyle={winStyle}
        handleTransitionEnd={animationCallback}
      /> 
    );
  }

  // STRUCTURE THE SLOTS AND STYLE THE BOARD  //
  createBoard = (boardParams, isMainBoard, isBoardWon) => {
    let board = []
    let index = 0;
 
    // Outer loop adding the full rows to the board
    for (let i = 0; i < boardParams.height; i++) {
      let slots = [];
      // Inner loop creating the slots of the rows
      for (let j = 0; j < boardParams.width; j++) {
        slots.push(this.renderSlot(index, isBoardWon));
        index++;
      }
      // At the end of the outer loop, we encapsulate our slots in row
      board.push(<div key={i} className={styles.board_row}>{slots}</div>)
    }

    const startAngle = this.props.transitions && this.props.transitions.board ? this.props.transitions.board : 0;

    return (
      <div style={{'--boardStartPos': `rotateZ(${startAngle}deg)`}}
          className={`
              ${startAngle === 0 ? "" : `hasTransition ${styles.flip}`} 
              ${styles.board} 
              ${isMainBoard ? styles.main_board : ""} 
              ${this.props.isSelected ? styles.selected : ""}
            `}
          onTransitionEnd={isMainBoard && isBoardWon ? () => this.handleTransitionEnd() : undefined} >
        {board}
      </div>
    );
  };

  // RETURN THE BOARD'S OWN CSS VARIABLES //
  styleBoard = (size, boardParams) => {
    // Align the size of the board to fit the slots  
    // Arbitrary decision to occupy (X%) amount of space in the viewport
    // Calculate two sizes for the slot based on the available space on both axes in the viewport
    let slotSize = Math.floor(window.innerHeight * 0.55 / (boardParams.height * size));
    let slotSizeDiff = Math.floor(window.innerHeight * 0.55 / (boardParams.width * size));
    // let slotSizeDiff = Math.floor(window.innerWidth * 0.8 / (boardParams.width * size));

    // The final size will be the smallest of the two, as we want the board to fit inside the viewport
    slotSize = slotSize <= slotSizeDiff ? slotSize : slotSizeDiff;

    // let fontSize = Math.round((boardWidth / 15.22) * Math.pow(this.props.boardParams.width, -1) * 10 /*/ size*/) / 10;
    let fontSize = Math.round((boardParams.height / 130) * 10 /*/ size*/) / 10;
    if (fontSize <= 0.5) fontSize = 0;

    return {
      '--boardWidth': slotSize * boardParams.width + 'px',
      '--boardHeight': slotSize * boardParams.height + 'px',
      // We use margin-right: -1px to merge the borders together on the boards, so we bump the slot size by 1 to compensate
      '--slotSize': (slotSize + 1) + 'px',
      '--fontSize': fontSize + 'em'
    }
  };

  render() {
    // The board flip indicates us which dimension to take as which for the board
    if (this.props.flip % 2 === 0) {
      var boardParams = this.props.boardParams;
    } else {
      var boardParams = {width: this.props.boardParams.height, height: this.props.boardParams.width};
    }

    const isMainBoard = this.props.isMainBoard;
    // Display a title under the history moves
    const title = isMainBoard ? "" : this.props.title;

    const isBoardWon = isMainBoard && this.props.winIndexes.length ? true : false;   
    // We tweak the style of the board depending on it being the main one or not
    // styleBoard(n, params) styles the board at a 1:n ratio
    return (
      <div style={isMainBoard ? this.styleBoard(1, boardParams) : this.styleBoard(4, boardParams)} 
          className={isMainBoard ? styles.main : ""}>
        {this.createBoard(boardParams, isMainBoard, isBoardWon)}
        <p className={styles.title}>{title}</p>
      </div>
    );
  }
}

export default Board;