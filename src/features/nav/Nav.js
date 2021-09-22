import React from 'react';
import { useDispatch } from 'react-redux';
import { reset } from './navSlice';
import { Reset } from '../general/helpers/Components';
// import styles from './Nav.module.css';

export function Nav(props) {
  const dispatch = useDispatch();
  const navItems = Object.keys(props.items)
        .map((key,index) =>
          <button name={key} key={index} onClick={(i) => props.handleClick(i)}>{key}</button>
        );
  return (
    <header className="App-header">
      <div className="nav-items">
        {navItems}
      </div>
      <Reset title="Reset all" onClick={() => dispatch(reset())}/>        
    </header>
  );
}
