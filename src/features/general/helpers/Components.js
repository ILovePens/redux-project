import React from 'react';

export function Switch(props) {
  return (
    <label className="switch">
		  <input
			  type="checkbox"
			  checked={props.isOn}
			  onClick={props.onClick}
			  readOnly
		  />
		  <span className="slider"></span>
		</label>
	);
}

export function Reset(props) {
  return (
    <button className="reset" onClick={props.onClick}>
    	{props.title}			  
	</button>
	);
}

