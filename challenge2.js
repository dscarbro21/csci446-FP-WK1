/*

CURRENT FUNCTIONALITY IS LISTED IN THIS COMMENT BLOCK ----------------------------------------------------------------------

DRAWS INITIAL CHECKERBOARD AND CHECKERS in draw()
CAN CHECK VALID MOVES AND BASIC JUMPS (no double jumps or more) in checkMoves()
HIGHLIGHTS VALID MOVES FOR TESTING in checkMoves()

*/
var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

// NUM COLORS IS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
var numColors = 2;

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;
var displayMoves = true;
var turn = "black";

var colorArr = [];
var adjArr = [];
var checkerRedArr = [];
var checkerBlackArr = [];
var allCheckers = [];

var score = 0;
var numBlocks = 64;

var i = 0;

var setup = true;
var gameOver = false;
var winner = false; // When the player beats the last level set this guy to true

//TODO::modify
function draw() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);
  
  // make checkerboard
  for (var i = 0; i < 8; i++) {
	for (var j = 0; j < 8; j++) {
	  if ((i + j) % 2 == 0) {
		ctx.fillStyle = "indigo";
	  }
	  else {
		ctx.fillStyle = "palegreen";
		if (i < 3) {
			checkerBlackArr.push((i * 8) + j);
			allCheckers.push((i * 8) + j);
		}
		else if (i > 4) {
			checkerRedArr.push((i * 8) + j);
			allCheckers.push((i * 8) + j);
		}
	  }	
	  ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
	  ctx.stroke();
	}
  }
  
	/* checkerBlackArr.push(24);
	checkerBlackArr.push(23);
	checkerRedArr.push(33);
	checkerRedArr.push(30);
	allCheckers.push(24);
	allCheckers.push(23);
	allCheckers.push(33);
	allCheckers.push(30); */
  
	// Display black checkers
	for (var i = 0; i < checkerBlackArr.length; ++i) {
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc((checkerBlackArr[i] % 8) * 100 + 51, Math.floor((checkerBlackArr[i] / 8)) * 100 + 51, 40, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	// Display red checkers
	for (var i = 0; i < checkerRedArr.length; ++i) {
		console.log((checkerRedArr[i] / 8) * 100);
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc((checkerRedArr[i] % 8) * 100 + 51, Math.floor((checkerRedArr[i] / 8)) * 100 + 51, 40, 0, 2 * Math.PI);
		ctx.fill();
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
	var ownSpace = false;
	var validMove = [];
	// if the turn is red, check the red array
	if (turn == "red") {
		for (var i = 0; i < checkerRedArr.length; ++i) {
			if (checkerRedArr[i] == clickIndex) {
				ownSpace = true;
				break;
			}
		}
		if (ownSpace) {
			if ((clickIndex % 8) != 0) {
				if (!spaceOccupied(clickIndex - 9)) {
					validMove.push(clickIndex - 9);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex - 9)) {
						// determine if jumping is possible
						if ((clickIndex - 9) % 8 != 0) {
							if (!spaceOccupied(clickIndex - 18)) {
								validMove.push(clickIndex - 18);
							}
						}
					}
				}
			}
			if ((clickIndex % 8) != 7) {
				if (!spaceOccupied(clickIndex - 7)) {
					validMove.push(clickIndex - 7);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex - 7)) {
						// determine if jumping is possible
						if ((clickIndex - 7) % 8 != 7) {
							if (!spaceOccupied(clickIndex - 14)) {
								validMove.push(clickIndex - 14);
							}
						}
					}
				}
			}
		}
	}
	
	// otherwise check the black array
	else {
		for (var i = 0; i < checkerBlackArr.length; ++i) {
			if (checkerBlackArr[i] == clickIndex) {
				ownSpace = true;
				break;
			}
		}
		if (ownSpace) {
			if ((clickIndex % 8) != 0) {
				if (!spaceOccupied(clickIndex + 7)) {
					validMove.push(clickIndex + 7);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex + 7)) {
						// determine if jumping is possible
						if ((clickIndex + 7) % 8 != 0) {
							if (!spaceOccupied(clickIndex + 14)) {
								validMove.push(clickIndex + 14);
							}
						}
					}
				}
			}
			if ((clickIndex % 8) != 7) {
				if (!spaceOccupied(clickIndex + 9)) {
					validMove.push(clickIndex + 9);
				}
				else {
					if (spaceOccupiedByEnemy(clickIndex + 9)) {
						// determine if jumping is possible
						if ((clickIndex + 9) % 8 != 7) {
							if (!spaceOccupied(clickIndex + 18)) {
								validMove.push(clickIndex + 18);
							}
						}
					}
				}
			}
		}
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
	if (turn == "red") {
		for (var i = 0; i < checkerBlackArr.length; ++i) {
			if (index == checkerBlackArr[i]) {
				return true;
			}
		}
	}
	
	else {
		for (var i = 0; i < checkerRedArr.length; ++i) {
			if (index == checkerRedArr[i]) {
				return true;
			}
		}
	}
	return false;
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
	score += adjArr.length * (adjArr.length - 1); //adds number of blocks * number of blocks - 1 to the score
	$('#score').text(score.toString());
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
						checkMoves();
        // }
		click = false;
    });
});

draw();

function reset() {
	score = 0;
	setup = true;
	$('#score').text(score.toString());
	draw();
}
