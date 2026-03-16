let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();



document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });

  /*
  Add an event listener
  if the user presses the key r => play rock
  if the user presses the key p => play paper
  if the user presses the key s => play scissors
  */

document.addEventListener('keydown', (event) => {
  //const key = event.key.toLowerCase();

  if (key === 'r') {
    playGame('rock');
  } else if (key === 'p') {
    playGame('paper');
  } else if (key === 's') {
    playGame('scissors');
  }
});




  // calculate result
  // update the score and store it using localStorage.setItem
  // show the new score and the updated images using "document.querySelector"
  
function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';

  // Calculate result
  if (playerMove === computerMove) {
    result = 'Tie';
  } 
  else if (
    (playerMove === 'rock' && computerMove === 'scissors') ||
    (playerMove === 'paper' && computerMove === 'rock') ||
    (playerMove === 'scissors' && computerMove === 'paper')
  ) {
    result = 'You win';
  } 
  else {
    result = 'You lose';
  }
  // Update score
  if (result === 'You win') {
    score.wins++;
  } else if (result === 'You lose') {
    score.losses++;
  } else {
    score.ties++;
  }
  // Save score in localStorage
  localStorage.setItem('score', JSON.stringify(score));
  // Update score display
  updateScoreElement();
 // Show result on page
  document.querySelector('.js-result').innerHTML = result;
 document.querySelector('.js-moves').innerHTML =
    `You: ${playerMove} | Computer: ${computerMove}`;
}

function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}