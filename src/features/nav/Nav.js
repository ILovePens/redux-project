import React from 'react';
// import { useDispatch } from 'react-redux';
import { reset } from './navSlice';
import { Reset } from '../general/helpers/Components';

export function Nav(props) {
  // const dispatch = useDispatch();
  console.log(props)
  const navItems = Object.keys(props.items)
        .map((key,index) =>
          <button name={key} key={index} className={props.itemSelected === key ? 'selected' : ''} onClick={(i) => props.handleClick(i)}>{key === 'Connect-X' ? `Jouer à ${key}` : key}</button>
        );
  return (
    <header className="App-header">
      <h1 className="logo">Redux-progress</h1>
      <div className="nav-items">
        {navItems}
      </div>
{/*      <Reset title="Reset all" onClick={() => dispatch(reset())}/>*/}
    </header>
  );
}
