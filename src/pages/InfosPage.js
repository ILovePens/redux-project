import React from 'react';

function InfosPage() {
  const connectXInfos = 
    <div className="infos">
      <h3>Connect-X</h3>
      <h4>General rules</h4>
      <p>It is a Connect 4 like game, in which you can choose the board dimensions, as well as use special actions!<br/>
      Each turn, in addition of playing a token, the players can choose to use one of three different actions during their turn:</p>
      <ul>
        <li>turn the gravity OFF or ON again</li>
        <li>flip the board to the left</li>
        <li>flip the board to the right</li>
      </ul>
      <h4>Versus mode</h4>
      <p>You can also play online versus an opponent! Just click on the multiplayer button and wait for your opponent to do the same, you'll be notified when the game starts!<br/>
      Note that the board dimensions that the versus will take place on are the one currently used by the first player to request the versus.</p>
    </div>

  return (
    <div className="infosPage">
      <h2>Welcome to the games!</h2>
      {connectXInfos}
      <h3>Other games to come soon...</h3>
    </div>
  );
}

export default InfosPage;