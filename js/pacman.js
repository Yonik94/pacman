'use strict'
var gPacDegree = 360
var pacman = `<div style="transform: rotate(${gPacDegree}deg)"><img src="img/pacman.png" alt=""></div>`;

var gPacman;
var gPacmanDirection;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = pacman;
}
function movePacman(eventKeyboard) {
  // rotatePacman(degree)
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;
  // Hitting FOOD? update score
  if (nextCell === FOOD || nextCell === SUPER_FOOD || nextCell === CHERRY) {
    audioEat.play()
    if (nextCell === CHERRY) {
      updateScore(10);
    } else {
      updateScore(1);
    }
  } else if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      for (var i = 0; i < gGhosts.length; i++) {
        if ((gGhosts[i].location.i === nextLocation.i)
          && (gGhosts[i].location.j === nextLocation.j)) {
          if (gGhosts[i].currCellContent === FOOD || gGhosts[i].currCellContent === SUPER_FOOD) {
            updateScore(1);
          }
          gGhosts.splice(i, 1)
        }
      }
    } else {
      gameOver()
      renderEndGameTxt('GAME IS OVER');
      renderCell(gPacman.location, EMPTY);
      audioEat.pause()
      audioLoose.play()
      return;

    }
  }
  if (gBoard[gPacman.location.i][gPacman.location.j].includes(SUPER_FOOD)) {
    gBoard[gPacman.location.i][gPacman.location.j] = SUPER_FOOD;
    // Update the DOM
    renderCell(gPacman.location, SUPER_FOOD);
  } else {
    // Update the model to reflect movement
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // Update the DOM
    renderCell(gPacman.location, EMPTY);
  }
  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;
  if ((gBoard[gPacman.location.i][gPacman.location.i] === SUPER_FOOD) && (gPacman.isSuper === true)) {
    gBoard[gPacman.location.i][gPacman.location.j] += pacman;
  } else {
    gBoard[gPacman.location.i][gPacman.location.j] = pacman;
  }
  if (nextCell === SUPER_FOOD) {
    if (!gPacman.isSuper) {
      gPacman.isSuper = true
      var strHtml = 'Now you are SUPER-POWER!'
      renderSuperFoodStatus(strHtml)
      setTimeout(function () {
        gPacman.isSuper = false
        strHtml = ''
        renderSuperFoodStatus(strHtml)
      }, 5000)
    }
  }
  // Render updated model to the DOM
  renderCell(gPacman.location, pacman);
  var cherryCells = getCellsWith(gBoard, CHERRY)
  var foodCells = getCellsWith(gBoard, FOOD)
  var superFoodCells = getCellsWith(gBoard, SUPER_FOOD)
  // Check if victory
  if ((foodCells.length === 0) && (cherryCells.length === 0) && (superFoodCells.length === 0)) {
    gameOver()
    renderEndGameTxt('YOU ARE VICTORY');
    audioEat.pause()
    audioWin.play()
  }
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };
  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      gPacDegree = 270
      pacman = `<div style="transform: rotate(${gPacDegree}deg)"><img src="img/pacman.png" alt=""></div>`
      break;
    case 'ArrowDown':
      nextLocation.i++;
      gPacDegree = 90
      pacman = `<div style="transform: rotate(${gPacDegree}deg)"><img src="img/pacman.png" alt=""></div>`
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      gPacDegree = 180
      pacman = `<div style="transform: rotate(${gPacDegree}deg)"><img src="img/pacman.png" alt=""></div>`
      break;
    case 'ArrowRight':
      nextLocation.j++;
      gPacDegree = 360
      pacman = `<div style="transform: rotate(${gPacDegree}deg)"><img src="img/pacman.png" alt=""></div>`

      break;
    default: return null;
  }
  return nextLocation;
}