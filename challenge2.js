/*

CURRENT FUNCTIONALITY IS LISTED IN THIS COMMENT BLOCK ----------------------------------------------------------------------

DRAWS INITIAL CHECKERBOARD AND CHECKERS in draw()
CAN CHECK VALID MOVES AND BASIC JUMPS (no double jumps or more) in checkMoves()
HIGHLIGHTS VALID MOVES FOR TESTING in checkMoves()
PIECES MOVE IF VALID AND JUMPS KILL
PIECES CAN BECOME A KING WITH FULL KING FUNCTIONALITY

BUGSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

THE LAST RED CHECKER IS HIGHLIGHTED EVERY TIME YOU TRY TO SHOW POSSIBLE MOVES
IF THE LAST RED CHECKER MOVES, IT LEAVES BEHIND AN INDIGO CHECKER THAT DISAPPEARS AFTER THE NEXT MOVE
IF IN THE MIDDLE OF A DOUBLE JUMP, YOU CAN SKIP TO ANOTHER PIECE
DOUBLE JUMPS WORK...AUTOMATICALLY. ITS A FEATURE NOT A BUG :(
*/
class Checker {
	constructor(index, king) {
		this.index = index;
		this.king = king;
	}
}

var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

var displayMoves = true; // FOR TESTING MOVES

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;
var turn = "Red";
var moveReady = false;
var startPos;

var redCheckers = [];
var blackCheckers = [];
var allCheckers = [];
var validMove = [];
var deathArr = [];

var scorep1 = 0;
var scorep2 = 0;
var numBlocks = 64;

var time = 30;
var timer;

var i = 0;

var setup = true;
var gameOver = false;
var winner = "";

//TODO::modify
function draw() {
	clearInterval(timer);
	time = 30;
	timer = setInterval(function() {
		if (time == 0) {
			if (turn == "Red") {
				turn = "Black";
				$("#turn").html("Turn: Black (Player 2)");
			}
			else {
				turn = "Red";
				$("#turn").html("Turn: Red (Player 1)");
			}
			draw();
		}
		--time;
		if (time < 10) {
			$("#timer").html("0:0" + time);
		}
		else {
			$("#timer").html("0:" + time);
		}
		
	}, 1000);
	if (setup) {
		$("#turn").html("Turn: Red (Player 1)");
	}
	ctx.font = "15px Arial";
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
		if (setup) {
			if (i < 3) {
				blackCheckers.push(new Checker(((i * 8) + j), false));
				allCheckers.push((i * 8) + j);
			}
			else if (i > 4) {
				redCheckers.push(new Checker(((i * 8) + j), false));
				allCheckers.push((i * 8) + j);
			}
		}
	  }	
	  ctx.fillRect(i * 100 + 1, j * 100 + 1, 99, 99);
	  ctx.fill();
	}
  }
  
  /* if (setup) {
		blackCheckers.push(new Checker(42, false));
		redCheckers.push(new Checker(49, false));
		redCheckers.push(new Checker(30, false));
		allCheckers.push(49);
		allCheckers.push(30);
		allCheckers.push(42);
  } */
  setup = false;
  
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
	
	if (redCheckers.length == 0) {
		gameOver = true;
		winner = "Black";
	}
	else if (blackCheckers.length == 0) {
		gameOver = true;
		winner = "Red";
	}

  if(gameOver) {
    gameOverF();
  }
}

// sees what moves can be used by the player when selecting a checker
function checkMoves() {
	console.log(turn);
	// if the game is ready to execute a move, set that up first
	var ownSpace = false;
	var isKing = false;
	
	// if the turn is red, check the red array
	if (turn == "Red") {
		
		// if a red checker was clicked on, say so by turning ownSpace = true -- and then checking if it is a king
		for (var i = 0; i < redCheckers.length; ++i) {
			if (redCheckers[i].index == clickIndex) {
				ownSpace = true;
				if (redCheckers[i].king == true) {
					isKing = true;
				}
				break;
			}
		}
		
		// if red checker is clicked
		if (ownSpace) {
			
			// moves for a king (moving down instead of only up)
			if (isKing && clickIndex < 56) {
				// if all the way on the left, don't go left!
				if ((clickIndex % 8) != 0) {
					// if the space is empty, mark it as available
					if (!spaceOccupied(clickIndex + 7)) {
						validMove.push(clickIndex + 7);
						deathArr.push(-1);
					}
					// if space is occupied, check if you can jump it
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
				// if all the way on the right, don't go right!
				if ((clickIndex % 8) != 7) {
					// if the space is empty, mark it as available
					if (!spaceOccupied(clickIndex + 9)) {
						validMove.push(clickIndex + 9);
						deathArr.push(-1);
					}
					// if space is occupied, check if you can jump it
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
				// check if the piece is all the way at the top -- if not, perform non-king move check too
				if (clickIndex > 7) {
					isKing = false;
				}
			}
			
			// moves for all pieces
			if (!isKing) {
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
	}
	
	// otherwise check the black array
	else {
		// if a black checker was clicked on, say so by turning ownSpace = true -- and then checking if it is a king
		for (var i = 0; i < blackCheckers.length; ++i) {
			if (blackCheckers[i].index == clickIndex) {
				ownSpace = true;
				if (blackCheckers[i].king == true) {
					isKing = true;
				}
				break;
			}
		}
		
		// if black checker was clicked
		if (ownSpace) {
			
			// moves for a king (moving up instead of only down)
			if (isKing && clickIndex > 7) {
				// if all the way on the left, don't go left!
				if ((clickIndex % 8) != 0) {
					// if the space is empty, mark it as available
					if (!spaceOccupied(clickIndex - 9)) {
						validMove.push(clickIndex - 9);
						deathArr.push(-1);
					}
					// if space is occupied, check if you can jump it
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
				// if all the way on the right, don't go right!
				if ((clickIndex % 8) != 7) {
					// if the space is empty, mark it as available
					if (!spaceOccupied(clickIndex - 7)) {
						validMove.push(clickIndex - 7);
						deathArr.push(-1);
					}
					// if space is occupied, check if you can jump it
					else {
						if (spaceOccupiedByEnemy(clickIndex - 7)) {
							// determine if jumping is possible
							if ((clickIndex + 9) % 8 != 7) {
								if (!spaceOccupied(clickIndex - 14)) {
									validMove.push(clickIndex - 14);
									deathArr.push(clickIndex - 7);
								}
							}
						}
					}
				}
				// check if the piece is all the way at the bottom -- if not, perform non-king move check too
				if (clickIndex < 56) {
					isKing = false;
				}
			}
			
			// moves for all pieces
			if (!isKing) {
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
	var doubleJump = false;
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
					doubleJump = checkMoreJumps();
				}
				if (!doubleJump) {
					turn = "Black";
					$("#turn").html("Turn: Black (Player 2)");
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
					doubleJump = checkMoreJumps();
				}
				if (!doubleJump) {
					turn = "Red";
					$("#turn").html("Turn: Red (Player 1)");
				}
			}
		}
	}
	moveReady = false;
	draw();
	if (doubleJump) {
		if (displayMoves) {
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = "10";
			for (var i = 0; i < validMove.length; ++i) {
				ctx.strokeRect((validMove[i] % 8) * 100 + 6, Math.floor((validMove[i] / 8)) * 100 + 6, 89, 89);
			}
			ctx.stroke();
		}
		console.log("H");
		clickIndex = validMove[0];
		makeMove();
	}
	validMove = [];
	deathArr = [];
}

// this checks for double jumps, triple jumps, etc. ----------------------- WORK IN PROGRESS
function checkMoreJumps() {
	//console.log("OH YEAH");
	draw();
	deathArr = [];
	validMove = [];
	checkMoves();
	moreJumps = false;
	for (var i = 0; i < deathArr.length; ++i) {
		if (deathArr[i] != -1) {
			moreJumps = true;
		}
	}
	
	if (moreJumps) {
		for (var i = 0; i < deathArr.length; ++i) {
			if (deathArr[i] == -1) {
				deathArr.splice(i, 1);
				validMove.splice(i, 1);
			}
		}
		if (displayMoves) {
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = "10";
			for (var i = 0; i < validMove.length; ++i) {
				ctx.strokeRect((validMove[i] % 8) * 100 + 6, Math.floor((validMove[i] / 8)) * 100 + 6, 89, 89);
			}
			ctx.stroke();
		}
		return true;
	}
	
	if (turn == "red") {
		turn = "Red";
		$("#turn").html("Turn: Red (Player 1)");
	}
	else {
		turn = "Black";
		$("#turn").html("Turn: Black (Player 2)");
	}
	
	return false;
	
}

function getMousePos(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
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
	if (winner == "Red") {
		ctx.fillStyle = "black";
		ctx.fillText("PLAYER 1 WINS", canv.width / 2, canv.height / 2);
	}
	else {
		ctx.fillText("PLAYER 2 WINS", canv.width / 2, canv.height / 2);
	}

  var marvin = document.getElementById("marvin");
  var richmond = document.getElementById("richmond");
  var thomas = document.getElementById("thomas");

  ctx.drawImage(marvin, canv.width / 2, 600, 200, 200);
  ctx.drawImage(thomas, 50, 400, 180, 180);
  ctx.drawImage(richmond, 60, 30, 180, 160);

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
});

//draw();

function reset() {
	scorep1 = 0;
	scorep2 = 0;
	setup = true;
	$('#scorep1').text(scorep1.toString());
	$('#scorep2').text(scorep2.toString());
	draw();
}
