/*

CURRENT FUNCTIONALITY IS LISTED IN THIS COMMENT BLOCK ----------------------------------------------------------------------

DRAWS INITIAL CHECKERBOARD AND CHECKERS in draw()
CAN CHECK VALID MOVES AND BASIC JUMPS (no double jumps or more) in checkMoves()
HIGHLIGHTS VALID MOVES FOR TESTING in checkMoves()
PIECES MOVE IF VALID AND JUMPS KILL
PIECES CAN BECOME A KING (no special abilities yet)

BUGSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

THE LAST RED CHECKER IS HIGHLIGHTED EVERY TIME YOU TRY TO SHOW POSSIBLE MOVES
IF THE LAST RED CHECKER MOVES, IT LEAVES BEHIND AN INDIGO CHECKER THAT DISAPPEARS AFTER THE NEXT MOVE

*/
class Checker {
	constructor(index, king) {
		this.index = index;
		this.king = king;
	}
}
var roasted = document.getElementById("roasted");
var og = document.getElementById("OGsound");
var timout = document.getElementById("timeout");

var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

// NUM COLORS IS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
var numColors = 2;

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;
var dropIndex;
var displayMoves = true;
var turn = "Red";
var moveReady = false;
var startPos;

var colorArr = [];
var adjArr = [];
var redCheckers = [];
var blackCheckers = [];
var allCheckers = [];
var validMove = [];
var deathArr = [];

var score = 0;
var frontPageScore = 0;
var numBlocks = 64;

var i = 0;

var setup = true;
var gameOver = false;
var winner = false; // When the player beats the last level set this guy to true
var started = false;

var timer = setInterval(mooveCows, 5000);

var cowArr = [];

var billyArr = [];
var fireArr = [];

function mooveCows() {
  if(started) {
    for (var i = 0; i < 8; i++) {
  	for (var j = 0; j < 8; j++) {
  		ctx.fillStyle = "cyan";
  	  ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
  	  ctx.fill();
  	}
    }
    cowArr = [];
    for (var i = 0; i < 5; i++) {
      cowArr.push(Math.floor(Math.random() * 64));
      var img=document.getElementById("moo");
      ctx.drawImage(img, cowArr[i] % 8 * 100 + 1, Math.floor(cowArr[i] / 8) * 100 + 1, 98, 98);
    }

    billyArr = [];
    for (var i = 0; i < 2; i++) {
      billyArr.push(Math.floor(Math.random() * 64));
      var img=document.getElementById("billy");
      ctx.drawImage(img, billyArr[i] % 8 * 100 + 1, Math.floor(billyArr[i] / 8) * 100 + 1, 98, 98);
    }
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  console.log("weeeeeee");
}

function drop(ev) {
  ev.preventDefault();
  var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
  console.log("drop it like it's hot at " + mousePosX + ", " + mousePosY);
  dropIndex = Math.floor(mousePosY / 100) * 8 + Math.floor(mousePosX / 100);
  console.log("     INDEX: " + dropIndex);
  // for (var i = 0; i < 8; i++) {
	// for (var j = 0; j < 8; j++) {
	// 	ctx.fillStyle = "cyan";
	//   ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
	//   ctx.fill();
	// }
  // }
  if (started) {
    var img=document.getElementById("boi");
    ctx.drawImage(img, dropIndex % 8 * 100 + 1, Math.floor(dropIndex / 8) * 100 + 1, 98, 98);
    var img=document.getElementById("fire");
    if (Math.floor(dropIndex / 8) == 0) {
      ctx.drawImage(img, (dropIndex % 8) * 100 + 1, Math.floor(dropIndex / 8 + 1) * 100 + 1, 98, 98);
      fireArr.push(dropIndex + 8);
    }
    else if (Math.floor(dropIndex / 8) == 7) {
      ctx.drawImage(img, (dropIndex % 8) * 100 + 1, Math.floor(dropIndex / 8 - 1) * 100 + 1, 98, 98);
      fireArr.push(dropIndex - 8);
    }
    else {
      ctx.drawImage(img, (dropIndex % 8) * 100 + 1, Math.floor(dropIndex / 8 + 1) * 100 + 1, 98, 98);
      ctx.drawImage(img, (dropIndex % 8) * 100 + 1, Math.floor(dropIndex / 8 - 1) * 100 + 1, 98, 98);
      fireArr.push(dropIndex + 8);
      fireArr.push(dropIndex - 8);
    }

    if (dropIndex % 8 * 100 == 0) {
      ctx.drawImage(img, (dropIndex % 8 + 1) * 100 + 1, Math.floor(dropIndex / 8) * 100 + 1, 98, 98);
      fireArr.push(dropIndex + 1);
    }
    else if (dropIndex % 8 * 100 == 7) {
      ctx.drawImage(img, (dropIndex % 8 - 1) * 100 + 1, Math.floor(dropIndex / 8) * 100 + 1, 98, 98);
      fireArr.push(dropIndex - 1);
    }
    else {
      ctx.drawImage(img, (dropIndex % 8 + 1) * 100 + 1, Math.floor(dropIndex / 8) * 100 + 1, 98, 98);
      ctx.drawImage(img, (dropIndex % 8 - 1) * 100 + 1, Math.floor(dropIndex / 8) * 100 + 1, 98, 98);
      fireArr.push(dropIndex + 1);
      fireArr.push(dropIndex - 1);
    }
    //draw fireeeeee
    checkFire();
}
}

function checkFire() {
  for (var i = 0; i < fireArr.length; i++) {
    for (var j = 0; j < cowArr.length; j++) {
      if (fireArr[i] == cowArr[j]) {
				roasted.load();
				roasted.play();
        score += 1; // change to burger pattie
        ctx.fillStyle = "cyan";
        ctx.fillRect(fireArr[i] % 8 * 100 + 1, Math.floor(fireArr[i] / 8) * 100 + 1, 99, 99);
        ctx.fill();
        var img = document.getElementById("burger");
        ctx.drawImage(img, fireArr[i] % 8 * 100 + 1, Math.floor(fireArr[i] / 8) * 100 + 1, 99, 99);
        cowArr[j] = -1;
      }

    }
    for (var k = 0; k < billyArr.length; k++) {
      if (fireArr[i] == billyArr[k]) {
				og.load();
				og.play();
				score -= 2; //burning people is BAD
        ctx.fillStyle = "cyan";
        ctx.fillRect(fireArr[i] % 8 * 100 + 1, Math.floor(fireArr[i] / 8) * 100 + 1, 99, 99);
        ctx.fill();
        var img = document.getElementById("rip");
        ctx.drawImage(img, fireArr[i] % 8 * 100 + 1, Math.floor(fireArr[i] / 8) * 100 + 1, 99, 99);
        billyArr[k] = -1;
        //delete billy and play ouch noise
      }
    }
  }
  updateScore();
  fireArr = [];
}

function drawBoard() {
  for (var i = 0; i < 8; i++) {
	for (var j = 0; j < 8; j++) {
		ctx.fillStyle = "cyan";
	  ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
	  ctx.fill();
	}
  }
  started = true;
  mooveCows();
}

function end() {
  alert("Game over! You scored: " + score);
  if (typeof(Storage) !== "undefined") {
    if (score > localStorage.getItem("score") || localStorage.getItem("score") == null) {
      localStorage.setItem("score", score);
      document.getElementById("displayScore4").innerHTML = localStorage.getItem("score");
    }
    else {
      document.getElementById("displayScore4".innerHTML = "Sorry, your browser does not support Web Storage.");
    }
  }
	timeout.play();
  started = false;
  reset();
}

//TODO::modify
function draw() {
	ctx.font = "15px Arial";
  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);

  //console.log(redCheckers);

  // make checkerboard
  for (var i = 0; i < 8; i++) {
	for (var j = 0; j < 8; j++) {
	  // if ((i + j) % 2 == 0) {
		ctx.fillStyle = "black";
	  // }
	  // else {
		// ctx.fillStyle = "palegreen";
		// if (setup) {
		// 	if (i < 3) {
		// 		blackCheckers.push(new Checker(((i * 8) + j), false));
		// 		allCheckers.push((i * 8) + j);
		// 	}
		// 	else if (i > 4) {
		// 		redCheckers.push(new Checker(((i * 8) + j), false));
		// 		allCheckers.push((i * 8) + j);
		// 	}
		// }
	  // }
	  ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
	  ctx.fill();
	}
  }
  setup = false;

	/* blackCheckers.push(24);
	blackCheckers.push(23);
	redCheckers.push(33);
	redCheckers.push(30);
	allCheckers.push(24);
	allCheckers.push(23);
	allCheckers.push(33);
	allCheckers.push(30); */

	// Display black checkers
	for (var i = 0; i < blackCheckers.length; ++i) {
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc((blackCheckers[i].index % 8) * 100 + 51, Math.floor((blackCheckers[i].index / 8)) * 100 + 51, 40, 0, 2 * Math.PI);
		ctx.fill();
		if (blackCheckers[i].king == true) {
			ctx.fillStyle = "yellow";
			ctx.fillText("King", (blackCheckers[i].index % 8) * 100 + 35, Math.floor((blackCheckers[i].index / 8)) * 100 + 51);
		}
	}

	// Display red checkers
	for (var i = 0; i < redCheckers.length; ++i) {
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc((redCheckers[i].index % 8) * 100 + 51, Math.floor((redCheckers[i].index / 8)) * 100 + 51, 40, 0, 2 * Math.PI);
		ctx.fill();
		if (redCheckers[i].king == true) {
			ctx.fillStyle = "black";
			ctx.fillText("King", (redCheckers[i].index % 8) * 100 + 35, Math.floor((redCheckers[i].index / 8)) * 100 + 51);
		}
	}

  if(gameOver) {
    gameOverF();
  }
  else if(winner) {
    winnerF();
  }
}

// sees what moves can be used by the player when selecting a checker
function checkMoves() {
	console.log(turn);
	// if the game is ready to execute a move, set that up first
	var ownSpace = false;
	// if the turn is red, check the red array
	if (turn == "Red") {
		for (var i = 0; i < redCheckers.length; ++i) {
			if (redCheckers[i].index == clickIndex) {
				ownSpace = true;
				break;
			}
		}
		if (ownSpace) {
			if ((clickIndex % 8) != 0) {
				if (!spaceOccupied(clickIndex - 9)) {
					validMove.push(clickIndex - 9);
					deathArr.push(-1);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex - 9)) {
						// determine if jumping is possible
						if ((clickIndex - 9) % 8 != 0) {
							if (!spaceOccupied(clickIndex - 18)) {
								validMove.push(clickIndex - 18);
								deathArr.push(clickIndex - 9);
							}
						}
					}
				}
			}
			if ((clickIndex % 8) != 7) {
				if (!spaceOccupied(clickIndex - 7)) {
					validMove.push(clickIndex - 7);
					deathArr.push(-1);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex - 7)) {
						// determine if jumping is possible
						if ((clickIndex - 7) % 8 != 7) {
							if (!spaceOccupied(clickIndex - 14)) {
								validMove.push(clickIndex - 14);
								deathArr.push(clickIndex - 7);
							}
						}
					}
				}
			}
		}
	}

	// otherwise check the black array
	else {
		for (var i = 0; i < blackCheckers.length; ++i) {
			if (blackCheckers[i].index == clickIndex) {
				ownSpace = true;
				break;
			}
		}
		if (ownSpace) {
			if ((clickIndex % 8) != 0) {
				if (!spaceOccupied(clickIndex + 7)) {
					validMove.push(clickIndex + 7);
					deathArr.push(-1);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex + 7)) {
						// determine if jumping is possible
						if ((clickIndex + 7) % 8 != 0) {
							if (!spaceOccupied(clickIndex + 14)) {
								validMove.push(clickIndex + 14);
								deathArr.push(clickIndex + 7);
							}
						}
					}
				}
			}
			if ((clickIndex % 8) != 7) {
				if (!spaceOccupied(clickIndex + 9)) {
					validMove.push(clickIndex + 9);
					deathArr.push(-1);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex + 9)) {
						// determine if jumping is possible
						if ((clickIndex + 9) % 8 != 7) {
							if (!spaceOccupied(clickIndex + 18)) {
								validMove.push(clickIndex + 18);
								deathArr.push(clickIndex + 9);
							}
						}
					}
				}
			}
		}
	}

	// if there are valid moves, say that a move is ready to be used
	if (validMove.length != 0) {
		moveReady = true;
		startPos = clickIndex;
	}

	// mark valid moves
	if (displayMoves) {
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = "10";
		for (var i = 0; i < validMove.length; ++i) {
			ctx.strokeRect((validMove[i] % 8) * 100 + 6, Math.floor((validMove[i] / 8)) * 100 + 6, 89, 89);
		}
		ctx.stroke();
	}
}

// checks if there is a checker at the index
function spaceOccupied(index) {
	for (var i = 0; i < allCheckers.length; ++i) {
		if (allCheckers[i] == index) {
			return true;
		}
	}
	return false;
}

// check if the checker at the index is the enemy's
function spaceOccupiedByEnemy(index) {
	if (turn == "Red") {
		for (var i = 0; i < blackCheckers.length; ++i) {
			if (index == blackCheckers[i].index) {
				return true;
			}
		}
	}

	else {
		for (var i = 0; i < redCheckers.length; ++i) {
			if (index == redCheckers[i].index) {
				return true;
			}
		}
	}
	return false;
}

// makes a move (if valid)
function makeMove() {
	var num;
	for (var i = 0; i < validMove.length; ++i) {
		// if a proper move is chosen
		if (clickIndex == validMove[i]) {
			if (turn == "Red") {
				for (var j = 0; j < redCheckers.length; ++j) {
					if (redCheckers[j].index == startPos) {
						if (clickIndex <= 7) {
							redCheckers[j] = new Checker(clickIndex, true);
							break;
						}
						redCheckers[j].index = clickIndex;
						break;
					}
				}
				num = allCheckers.indexOf(startPos);
				allCheckers[num] = clickIndex;
				turn = "Black";
				// check for jump
				if (deathArr[i] != -1) {
					for (var j = 0; j < blackCheckers.length; ++j) {
						if (blackCheckers[j].index == deathArr[i]) {
							blackCheckers.splice(j, 1);
							break;
						}
					}
					num = allCheckers.indexOf(deathArr[i]);
					allCheckers.splice(num, 1);
				}
			}
			else {
				for (var j = 0; j < blackCheckers.length; ++j) {
					if (blackCheckers[j].index == startPos) {
						if (clickIndex >= 56) {
							blackCheckers[j] = new Checker(clickIndex, true);
							break;
						}
						blackCheckers[j].index = clickIndex;
						break;
					}
				}
				num = allCheckers.indexOf(startPos);
				allCheckers[num] = clickIndex;
				turn = "Red";
				// check for jump
				if (deathArr[i] != -1) {
					for (var j = 0; j < redCheckers.length; ++j) {
						if (redCheckers[j].index == deathArr[i]) {
							redCheckers.splice(j, 1);
							break;
						}
					}
					num = allCheckers.indexOf(deathArr[i]);
					allCheckers.splice(num, 1);
				}
			}
		}
	}
	moveReady = false;
	validMove = [];
	deathArr = [];
	draw();
}

function getMousePos(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
}

function check(clindex) {
	for (var i = 0; i < adjArr.length; i++) {
		if (clindex == adjArr[i]) {
			return true;
		}
	}
	return false;
}

function checkAdjacency2(clindex) {
	var notTop = notLeft = notRight = notBottom = false;
	if (clindex % 20 == 0) {
		notLeft = true;
	}
	if ((clindex - 19) % 20 == 0) {
		notRight = true;
	}
	if (clindex < 20) {
		notTop = true;
	}
	if (clindex >= 380) {
		notBottom = true;
	}
	if (notLeft == false) {
		// check color
		if (check(clindex -1)) {

		}
		else if (colorArr[clindex - 1] == colorArr[clindex]) {
			adjArr.push(clindex - 1);
			// its adjacent
			checkAdjacency2(clindex -1);
		}
	}
	if (notRight == false) {
		console.log(clindex + 1);
		// check color
		if (check(clindex + 1)) {

		}
		else if ((clindex - 19) % 20 == 0) {

		}
		else if (colorArr[clindex + 1] == colorArr[clindex]) {
			// its adjacent
			adjArr.push(clindex + 1);
			checkAdjacency2(clindex + 1);
		}
	}

	if (notTop == false) {
		// check color
		if (check(clindex - 20)) {

		}
		else if (colorArr[clindex - 20] == colorArr[clindex]) {
			// its adjacent
			adjArr.push(clindex - 20);
			checkAdjacency2(clindex - 20);
		}
	}
	if (notBottom == false) {
		// check color
		if (check(clindex + 20)) {

		}
		else if (colorArr[clindex + 20] == colorArr[clindex]) {
			// its adjacent
			adjArr.push(clindex + 20);
			checkAdjacency2(clindex + 20);
		}
	}
	notTop = notLeft = notRight = notBottom = false;
}

function checkAdjacency() {
	var notTop = notLeft = notRight = notBottom = false;
	adjArr.push(clickIndex);
	if (clickIndex % 20 == 0) {
		notLeft = true;
	}
	if ((clickIndex - 19) % 20 == 0) {
		notRight = true;
	}
	if (clickIndex < 20) {
		notTop = true;
	}
	if (clickIndex >= 380) {
		notBottom = true;
	}

	if (notLeft == false) {
		// check color

		if (check(clickIndex - 1)) {

		}
		else if (colorArr[clickIndex - 1] == colorArr[clickIndex]) {
			adjArr.push(clickIndex - 1);
			// its adjacent
			checkAdjacency2(clickIndex -1);
		}
	}

	if (notRight == false) {
		// check color
		if (check(clickIndex + 1)) {

		}
		else if ((clickIndex - 19) % 20 == 0) {
		}
		else if (colorArr[clickIndex + 1] == colorArr[clickIndex]) {
			// its adjacent
			adjArr.push(clickIndex + 1);
			checkAdjacency2(clickIndex + 1);
		}
	}

	if (notTop == false) {
		// check color
		if (check(clickIndex - 20)) {

		}
		else if (colorArr[clickIndex - 20] == colorArr[clickIndex]) {
			// its adjacent
			adjArr.push(clickIndex - 20);
			checkAdjacency2(clickIndex - 20);
		}
	}

	if (notBottom == false) {
		// check color
		if (check(clickIndex + 20)) {

		}
		else if (colorArr[clickIndex + 20] == colorArr[clickIndex]) {
			// its adjacent
			adjArr.push(clickIndex + 20);
			checkAdjacency2(clickIndex + 20);
		}
	}
	console.log("LENGTH" +  adjArr.length);

	if (adjArr.length > 1) {
		toTop();
		updateScore();
	}
	adjArr = [];

}

function toTop() {
	adjArr.sort(function(a, b){return a - b});
	for (var i = 0; i < adjArr.length; ++i) {
		if (adjArr[i] - 20 >= 0) {
			if (colorArr[adjArr[i] - 20] != 4) {
				swap(adjArr[i]);
			}
			else {
				colorArr[adjArr[i]] = 4;
				if (adjArr[i] >= 380) {
					shiftRight(adjArr[i]);
					for (var j = i + 1; j < adjArr.length; ++j) {
						--adjArr[j];
					}
				}
			}
		}
		else {
			colorArr[adjArr[i]] = 4;
		}
	}
	draw();
}

function swap(riser) {
	var savedColor = colorArr[riser - 20];
	colorArr[riser - 20] = colorArr[riser];
	colorArr[riser] = savedColor;
	riser -= 20;

	if (riser - 20 >= 0) {
		var notDone = true;
		while (notDone) {
			if (riser - 20 < 0) {
				notDone = false;
				continue;
			}
			if (colorArr[riser - 20] != 4) {
				savedColor = colorArr[riser - 20];
				colorArr[riser - 20] = colorArr[riser];
				colorArr[riser] = savedColor;
				riser -= 20;
			}
			else {
				notDone = false;
			}
		}
	}
	colorArr[riser] = 4;
}

function shiftRight(baseBlock) {
	var notDone = true;
	var colArray = [];
	var savedColor;
	if ((baseBlock - 19) % 20 == 0) {
		notDone = false;
		return;
	}

	for (var i = 0; i < 20; ++i) {
		colArray.push(baseBlock);
		baseBlock -= 20;
	}
	baseBlock += 400;

	while (notDone) {
		if (baseBlock == 399) {
			notDone = false;
			continue;
		}
		console.log(colArray);
		if (colorArr[baseBlock + 1] != 4) {
			for (var i = 0; i < colArray.length; ++i) {
				savedColor = colorArr[colArray[i] + 1];
				colorArr[colArray[i] + 1] = colorArr[colArray[i]];
				colorArr[colArray[i]] = savedColor;
				++colArray[i];
			}
			++baseBlock;
		}
		else {
			notDone = false;
		}
	}

	for (var i = 0; i < colArray.length; ++i) {
		colorArr[colArray[i]] = 4;
	}
}

function updateScore() {
	updatedScore = score; //adds number of blocks * number of blocks - 1 to the score
	$('#score').text(updatedScore.toString());
	checkGame();
}

function checkGame() {
	numBlocks -= adjArr.length;
	if (numBlocks == 0) {
		winnerF();
	}
	else {
		//check if any moves are left.
		for(var i = 0; i < 400; i++) {
			//loop over colorArr, check all adj blocks for same color
			//if one is found, break out of loop
			//check left
			if((i-1) >= 0 && colorArr[i-1] == colorArr[i] && colorArr[i] != 4) {
				//match to the left
				//console.log("0")
				return true;
			}
			//check right
			else if ((i + 1) <= 19 && colorArr[i+1] == colorArr[i] && colorArr[i] != 4) {
				//match to the right
				//console.log("1");
				return true;
			}
			//check up (-20)
			else if ((i -20) >= 0 && colorArr[i-20] == colorArr[i] && colorArr[i] != 4) {
				//match above
				//console.log("2");
				return true;
			}
			//check down (+20)
			else if ((i+20) <= 399 && colorArr[i+20] == colorArr[i] && colorArr[i] != 4) {
				//match below
				//console.log("3");
				return true;
			}
		}
		//if no matches are found, call loser function
		gameOverF();
	}
}

function getMouseClick(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
	click = true;
}

function winnerF() {
  ctx.fillStyle = "blue";
  ctx.textAlign = "center";
	ctx.font = "80px Arial";
	ctx.fillText("WINNER", canv.width / 2, canv.height / 2);

  var sperngeberb = document.getElementById("sperngeberb");
  var happy = document.getElementById("happy");

  ctx.drawImage(happy, 50, 200, 180, 180);
  ctx.drawImage(sperngeberb, canv.width / 2, 450, 200, 200);
}

function gameOverF() {
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
	ctx.font = "80px Arial";
	ctx.fillText("GAME OVER", canv.width / 2, canv.height / 2);

  var marvin = document.getElementById("marvin");
  var richmond = document.getElementById("richmond");
  var thomas = document.getElementById("thomas");

  ctx.drawImage(marvin, canv.width / 2, 600, 200, 200);
  ctx.drawImage(thomas, 50, 400, 180, 180);
  ctx.drawImage(richmond, 60, 30, 180, 160);

  if(gameOver == false) {
	highscore(score);
  }

  gameOver = true;

}

function updateLevel() {
	for (i = 0; i < 7; i++) {
		x = Math.random() * 200;
		y = Math.random() * 250 + 80;
		Math.round(x);
		Math.round(y);
		xPos[i] = x;
		yPos[i] = y;
	}
	level = 2;
}

$(document).ready(function () {
	$("#instructionTitle").click(function () {
        $("#instructions").slideToggle("fast");
    });
    $("#instructions").click(function () {
        $(this).slideToggle("fast");
    });

    $("#gamespace").click(function () {
        // if (mousePosY < canv.height) {
            // drawLaser();
						clickIndex = Math.floor(mousePosY / 100) * 8 + Math.floor(mousePosX / 100);
						console.log("index: " + clickIndex);
						//checkAdjacency();
						if (moveReady == false) {
							checkMoves();
						}
						else {
							makeMove();
						}
        // }
		click = false;
    });

    if (typeof(Storage) !== "undefined" ) {
      if (localStorage.getItem("score") == null) {
        document.getElementById("displayScore4").innerHTML = "No High Score yet";
      }
      else {
      document.getElementById("displayScore4").innerHTML = localStorage.getItem("score");
      }
    }
    else {
      document.getElementById("displayScore4").innerHTML = "Sorry, your browser does not support Web Storage";
    }
		frontPageScore = localStorage.getItem("Score");
		getScore3();
});

draw();

function reset() {
	score = 0;
	setup = true;
	$('#score').text(score.toString());
	draw();
}
document.getElementById("score3").innerHTML = frontPageScore;
