import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './style.css';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    borderWidth: 3,
 
    borderStyle: 'solid'
  }
});
var rows = [];
var currentPlayer = "human";
var currentChips = 21;
var take1 = false;
var take2 = false;
var take3 = false;
var playerWon = "";

function resetGame() {
  rows = [];
  currentPlayer = "human";
  currentChips = 21;
  take1 = false;
  take2 = false;
  take3 = false;
  playerWon = "";

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export function checkWinner(chips) {
  if (chips <= 0) {
    if (currentPlayer === "human") {
      return 'human';
    } else {
      return 'AI';
    }
  }
  return null;
}

function addRow(playerPick, computerPick) {
  return { playerPick, computerPick };
}

function takeChips(playerPick) {
  currentChips -= playerPick; // Subtract chips from player pick
  let modifiedChipsP = currentChips;

  if (currentChips <= 0) {
    playerWon = "Player won";
  }
  currentPlayer = 'AI';
  let computerPick = bestMove(currentChips); // To get the optimal pick
  currentChips -= computerPick; // Subtract chips from AI
  let modifiedChipsC = currentChips;
  if (currentChips <= 0) {
    playerWon = "Computer won";

  }
  rows.push(addRow(playerPick + ", Chips left: " + modifiedChipsP, computerPick + ", Chips left: " + modifiedChipsC)); // Add results to table


  if (currentChips <= 0) {
    take1 = true;
  }
  if (currentChips <= 1) {
    take2 = true;
  }
  if (currentChips <= 2) {
    
    take3 = true;
  }

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export function evaluate(chips) {
  return ((chips) % 3);
}

function App() {

  const classes = useStyles();
  return (
    <div Style="background-image:url(https://img.tukuppt.com/ad_preview/00/08/66/5d2c04199c786.jpg!/fw/780)">
    <div>
      
      <h1>Take away game</h1>
      
     
      <TableContainer >
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Computer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row.playerPick}</TableCell>
                <TableCell>{row.computerPick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => { takeChips(1) }} disabled={take1}>Take 1 (Eval: {evaluate(currentChips-1)})</Button>
      <Button onClick={() => { takeChips(2) }} disabled={take2}>Take 2 (Eval:{evaluate(currentChips-2)})</Button>
      <Button onClick={() => { takeChips(3) }} color="" disabled={take3}>Take 3 (Eval: {evaluate(currentChips-3)})</Button>
      <Button onClick={() => { resetGame() }} color="">Reset game</Button>
      <br></br>
      <h2>Chips left: {currentChips}</h2>
      <br></br>
      <h2>Turn: {currentPlayer}</h2>
      <br></br>
        <h2>{playerWon}</h2>
        </div>
        </div>
    


  );
}

// Minimax

function bestMove(chips) {
  // We set AI is the minimising player
  let bestScore = Infinity;
  let move;
  var time1 = performance.now();
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    if (i <= chips) {
      // When AI picks a chip
      chips -= i;
      currentPlayer = 'AI';
      let score = minimax(chips, Infinity, 'AI', true);
      chips += i;
      if (score < bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  var time2 = performance.now();
  alert("Performance for one turn: " + (time2 - time1) + " ms");
  return move;
}

let scores = {
  'human': 1,
  'AI': -1
};

function minimax(chips, depth, isMaximising) {
  let result = checkWinner(chips);
  // Check if there's a winner first
  if (result !== null) {
    //console.log(result);
    return scores[result];
  }

  if (isMaximising) {
    return maximiseScore(chips, depth);
  } else {
    return minimiseScore(chips, depth);
  }
}

function minimiseScore(chips, depth) {
  let bestScore = Infinity;
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    // Check if chips is greater than or equal to the number picked
    if (i <= chips) {
      chips -= i;
      currentPlayer = 'AI'
      let score = minimax(chips, depth - 1, true);
      // Undo move
      chips += i;
      bestScore = Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function maximiseScore(chips, depth) {
  let bestScore = -Infinity;
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    // Check if chips is greater than or equal to the number picked
    if (i <= chips) {
      chips -= i;
      currentPlayer = 'human';
      let score = minimax(chips, depth - 1, false);
      chips += i;
      bestScore = Math.max(score, bestScore);
    }
  }
  return bestScore;
}

export default App;
