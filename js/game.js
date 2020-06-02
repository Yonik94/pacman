'use strict';
const WALL = '<img src="img/wall.png" alt="">';
const FOOD = '<img src="img/food.png" alt="">';
const EMPTY = ' ';
const SUPER_FOOD = '<img src="img/hamburger.png" alt="">'
const CHERRY = '<img src="img/cherry.png" alt="">'

var audioWin = new Audio('sounds/win.mp3')
var audioLoose = new Audio('sounds/loose.mp3')
var audioEat = new Audio('sounds/eat.mp3')

var gBoard;
var gGame = {
  score: 0,
  isOn: false
};
var gCherryInv;
function init() {
  gGame.score = 0
  updateScore(0)
  gBoard = buildBoard(); 
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  gGame.isOn = true;
  gCherryInv = setInterval(function () { addCherry(gBoard) }, 15000)
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      if ((i === 1 && j === 1) || (i === SIZE - 2 && j === SIZE - 2)
        || (i === 1 && j === SIZE - 2) || (i === SIZE - 2 && j === 1)) {
        board[i][j] = SUPER_FOOD
      } else {
        board[i][j] = FOOD;
      }

      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
      }
    }
  }
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}

function gameOver() {
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = null;
  renderRestartButton();
  clearInterval(gCherryInv)
}

function renderEndGameTxt(txt) {
  var boardInHtml = document.querySelector('table');
  var strHtml = `<div class="gameOver">${txt}</div>`;
  boardInHtml.innerHTML += strHtml;
}
function renderRestartButton() {
  var buttonInHtml = document.querySelector('table');
  var strHtml = `<button onclick="init()">Start Again</button>`;
  buttonInHtml.innerHTML += strHtml;
}
function renderSuperFoodStatus(strHtml) {
  var superTxt = document.querySelector('.superFood')
  superTxt.innerText = strHtml
}
function addCherry(board) {
  var emptyCells = getCellsWith(board, EMPTY)
  if (emptyCells.length === 0) return;
  var num = getRandomIntInclusive(0, emptyCells.length - 1)
  var location = emptyCells[num]
  board[location.i][location.j] = CHERRY
  renderCell(location, CHERRY);
}
