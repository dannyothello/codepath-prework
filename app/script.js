// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var clueHoldTime = 1000
var pattern = new Array(8);
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var playerMistakes;

function startGame(){
  //initialize game variables
  clueHoldTime = 1000
  progress = 0;
  gamePlaying = true;
  playerMistakes = 0
  //initialize pattern
  for (var i = 0; i < pattern.length; i++) {
    pattern[i] = getRandomNum(8) + 1
  }
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 523.3,
  6: 659.3,
  7: 784,
  8: 932.3
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime
    clueHoldTime -= 15;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    //Guess is correct
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //It's game over. Player wins. 
        winGame();
      }
      else{
        //Pattern is correct. Play next clue segment. 
        progress++;
        playClueSequence();
      }
    }
    else{
      //Check the next guess. 
      guessCounter++;
    }
    
  }
  else{
    playerMistakes += 1
    if (playerMistakes === 3){
      loseGame();
    }
    else{
      giveStrike();
    }
    //Player guessed wrong. Player loses the game.
    // loseGame();
  }
}

function loseGame(){
  stopGame();
  alert("3 strikes. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won.");
}

function giveStrike(){
  alert(`Strike ${playerMistakes}`)
  playClueSequence();
}

function getRandomNum(max){
  return Math.floor(Math.random() * max);
}