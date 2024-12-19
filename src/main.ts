import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="header">
        <img src="/images/Text/logo.jpg">
    </div>
    <div id="game">
        <canvas id="canvas" height="768" width="1024"></canvas>
        <img src="/images/PlayerSpaceShip.png" id="player-spaceship" style="display:none" />
        <img src="/images/PlayerSpaceShip_WithThrust.png" id="player-spaceship-with-thrust" style="display:none" />
        <img src="/images/Enemy1.png" id="enemy1-spaceship" style="display:none" />
        <img src="/images/Bullet1.png" id="player-bullet" style="display:none" />
    </div>
`
