import React from 'react';
import Slot from './Slot';

// STYLE
import { transitionBoards, styleWin } from '../ConnectXTransitions.js';
import styles from '../ConnectX.module.css';

class Board extends React.Component {

  // ANIMATION & WIN TRIGGER //
  componentDidUpdate() {
    // We use this hook to manipulate the transitions on the dom elements 
    const transitions = this.props.transitions;
    if(this.props.isMainBoard) {
      transitionBoards();
      // If there are no transitions and the game is won, we style it directly
      if ((!transitions || (!transitions.slots && !transitions.board && !transitions.status)) && this.props.winIndexes.length) {
        styleWin();
      }
      // We reset the vh unit to keep the display in check when the viewport height changes (for example on mobile)
      // We put it here so it's intuitive and hidden to the user
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
  }

  // TRANSITIONS CALLBACK //
  handleTransitionEnd = (event) => {
    // We wait for the end of the transitions to style the winning slots
    console.log("hey style win transitionend");
    styleWin();
  };

  // PREPARE THE SLOT //
  renderSlot = (i, isBoardWon, transition, animation) => {
    // We deactivate the handleclick action if the board is won
    const onClickFunc = isBoardWon ? undefined : () => this.props.onClick(i);

    // Determine if the slot is part of a winning streak
    const winIndexes = isBoardWon ? this.props.winIndexes : null;
    const winStyle = winIndexes && winIndexes.includes(i) ? true : false;

    let slotScore = 0;
    let transitionCallback;
    if(transition) {
      // Assign the slot a score based on the animation map: the higher the score, the longer the animation 
      slotScore = transition;
      if(winStyle) { // For now we only put the callback to style a win 
        const transitions = this.props.transitions.slots;
        // Sort out the null elements, then sort in descending order the slotScores that are left inside
        // and take out the first value, which indicates the maximum animation score for this render
        const maxScore = transitions.filter(el => {return el !== 0;}).sort((a, b) => b - a)[0];
        // Finds the first index with a maxScore in the map and check if it corresponds to the current index
        const isFirstMaxScoreSlot = i === transitions.findIndex(e => e === maxScore);
        // We make this slot a reference for the longest animation and put the callback onto it
        if(isFirstMaxScoreSlot) transitionCallback = (i) => this.handleTransitionEnd(i);
      }
    }

    return (
      <Slot
        key={i}
        value={this.props.slots[i]}
        onClick={onClickFunc}
        slotScore={slotScore}
        winStyle={winStyle}
        animation={animation}
        handleTransitionEnd={transitionCallback}
      /> 
    );
  }

  // STRUCTURE THE SLOTS AND STYLE THE BOARD  //
  createBoard = (boardParams, isMainBoard, isBoardWon) => {
    let board = []
    let index = 0;
    const transitions = this.props.transitions;
    const slotTransitions = transitions ? this.props.transitions.slots : null;
    const slotAnimations = this.props.animations ? this.props.animations : null;
    let slotTransition = 0;
    let slotAnimation = 0;
    // Outer loop adding the full rows to the board
    for (let i = 0; i < boardParams.height; i++) {
      let slots = [];
      // Inner loop creating the slots of the rows
      for (let j = 0; j < boardParams.width; j++) {
        if (slotTransitions) slotTransition = slotTransitions[index];
        if (slotAnimations) slotAnimation = slotAnimations[index];
        slots.push(this.renderSlot(index, isBoardWon, slotTransition, slotAnimation));
        index++;
      }
      // At the end of the outer loop, we encapsulate our slots in row
      board.push(<div key={i} className={styles.board_row}>{slots}</div>)
    }

    const startAngle = transitions ? this.props.transitions.board : 0;
    
    // We include the board flip in the classes to make sure the board classes reload 
    // when we flip the board. Otherwise, React wouldn't re-assign the values even though the Board was re-rendered,
    // it's probably a React feature, but i'm not certain of what is happening
    return (
      <div style={{'--boardStartPos': `rotateZ(${startAngle}deg)`}}
          className={`
              ${styles.board} 
              ${isMainBoard ? styles.main_board : ""} 
              ${isMainBoard ? this.props.flip : ""} 
              ${startAngle === 0 ? "" : `${styles.flip} ${styles.hasTransition}`} 
              ${this.props.isSelected ? styles.selected : ""}
            `}
          onTransitionEnd={isMainBoard && isBoardWon ? () => this.handleTransitionEnd() : undefined} >
        {board}
      </div>
    );
  };

  // RETURN THE BOARD'S OWN CSS VARIABLES //
  styleBoard = (size, boardParams) => {
    const paramsHeight = boardParams.height; 
    const paramsWidth = boardParams.width;
    const heightCoeff = this.props.showHistory ? 0.55 : 0.70;
    console.log(window.innerWidth);
    // Align the size of the board to fit the slots  
    // Arbitrary decision to occupy (X%) amount of space in the viewport
    // Calculate two sizes for the slot based on the available space on both axes in the viewport
    let slotSize = Math.floor(window.innerHeight * heightCoeff / (paramsHeight * size));
    let slotSizeDiff = Math.floor(window.innerHeight * heightCoeff / (paramsWidth * size));
    let slotSize2 = Math.floor(window.innerWidth * 0.85 / (paramsHeight * size));
    let slotSizeDiff2 = Math.floor(window.innerWidth * 0.85 / (paramsWidth * size));

    // The final size will be the smallest of the two, as we want the board to fit inside the viewport whatever the
    // flip state of the board
    slotSize = slotSize <= slotSizeDiff ? slotSize : slotSizeDiff;
    slotSize2 = slotSize2 <= slotSizeDiff2 ? slotSize2 : slotSizeDiff2;

    slotSize = slotSize <= slotSize2 ? slotSize : slotSize2;

    const boardWidth = slotSize * paramsWidth;
    const boardHeight = slotSize * paramsHeight;

    return {
      '--boardWidth': boardWidth + 'px',
      '--boardHeight': boardHeight + 'px',
      '--slotSize': slotSize + 'px',
      '--slotContentSize': Math.floor(slotSize * 0.75 - 1) + 'px',
    }
  };

  render() {
    // The board flip indicates us which dimension to take as which for the board
    let boardParams = this.props.boardParams;
    if (this.props.flip % 2 !== 0) {
      boardParams = {width: boardParams.height, height: boardParams.width};
    }
    const isMainBoard = this.props.isMainBoard;

    let cssCoeff = 4;
    let boardClass = styles.moves_board;
    let disabledClass = '';
    let isBoardWon = false;   
    let statusHandler = null;
    if (isMainBoard) {
      cssCoeff = 1;
      boardClass = `${styles.main} ${this.props.showHistory ? "" : styles.large}`;
      if (this.props.statusClass.disabled) disabledClass = styles.disabledBoard;
      const statusClass = this.props.statusClass;
      // console.log(this.props.onClick);

      statusHandler = 
        <div className={styles.statusHandler}>
          <button className={`${statusClass.current}`}></button>
          <button onClick={this.props.endTurnFunc} className={`${statusClass.previous}`}></button>
        </div>;
      if (this.props.winIndexes.length) isBoardWon = true;   
    }
    // We tweak the style of the board depending on it being the main one or not
    // styleBoard(n, params) styles the board at a 1:n ratio
    return (
      <div style={this.styleBoard(cssCoeff, boardParams)} 
          className={`${boardClass} ${disabledClass}`}>
        {statusHandler}
        {this.createBoard(boardParams, isMainBoard, isBoardWon)}
      </div>
    );
  }
}

export default Board;