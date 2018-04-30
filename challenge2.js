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
var doubleJump = false;

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
var drawImages = false;
var minMarvin = -400;
var maxMarvin = 200;
var marvinWiggle = 0;
var marvinInc = true;

var thomasMinX = -50;
var thomasMaxX = 600;
var thomasWiggleX = 0;
var thomasIncX = true;
var thomasSpeedX = 2;
var thomasMaxY = 2;
var thomasMinY = -50;
var thomasWiggleY = 0;
var thomasIncY = true;
var thomasSpeedY = 1;
var thomasMinPulse = -20;
var thomasMaxPulse = 20;
var thomasPulseInc = true;
var thomasPulse = 0;
var thomasPulseRate = 1.5;

var richmondMinT = 0;
var richmondMaxT = 500;
var richmondTSpeed = 0.5;
var richmondTInc = true;
var richmondT = 0;
var richmondAmp = 80;
var richmondWiggle = 0;

var bWinAudio = document.getElementById("blackWin");
var dJumpAudio = document.getElementById("doubleJump");
var kingAudio = document.getElementById("kingMe");
var rWinAudio = document.getElementById("redWins");
var tieAudio = document.getElementById("tieCheckers");
var timeAudio = document.getElementById("timeout");

function draw() {
	clearInterval(timer);
	time = 30;
	timer = setInterval(function() {
		if (time == 0) {
			timeAudio.play();
			if (turn == "Red") {
				turn = "Black";
				$("#turn").html("Turn: Black (Player 2)");
				moveReady = false;
			}
			else {
				turn = "Red";
				$("#turn").html("Turn: Red (Player 1)");
				moveReady = false;
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

	ctx.fillStyle = "palegreen";

  /* if (setup) {
	redCheckers.push(new Checker(49, false));
	redCheckers.push(new Checker(28, false));
	redCheckers.push(new Checker(14, false));
	blackCheckers.push(new Checker(42, false));
	redCheckers.push(new Checker(30, false));
	allCheckers.push(49);
	allCheckers.push(30);
	allCheckers.push(42);
	allCheckers.push(28);
	allCheckers.push(14);
  } */
  setup = false;

	var badChecker = false;
	for (var i = 0; i < redCheckers.length; i++) {
		if (redCheckers[i].index == 62) {
			badChecker = true;
		}
	}

	if (!badChecker) {
		ctx.fillStyle = "palegreen";
		ctx.fillRect(6 * 100 + 1, 7 * 100 + 1, 99, 99);
		// ctx.fillRect(62 * 100 + 1, 0, 80000, 4345435353);
		ctx.fill();
	}

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

	if (checkGame() && (winner != "Black" && winner != "Red")) {
		gameOver = true;
		winner = "";
	}

	if (redCheckers.length == 0) {
		gameOver = true;
		winner = "Black";
	}
	else if (blackCheckers.length == 0) {
		gameOver = true;
		winner = "Red";
	}

	if (drawImages) {
		var marvin = document.getElementById("marvin");
	  var richmond = document.getElementById("richmond");
	  var thomas = document.getElementById("thomas");

		ctx.drawImage(marvin, canv.width / 2 + marvinWiggle, 600, 200, 200);
	  ctx.drawImage(thomas, 50 + thomasWiggleX, 400 + thomasWiggleY, 180 + thomasPulse, 180 + thomasPulse);
	  ctx.drawImage(richmond, 60 + richmondT, 75 + richmondWiggle, 180, 160);

		ctx.fillStyle = "white";
	  ctx.textAlign = "center";
		ctx.font = "80px Arial";
		if (winner == "Red") {
			rWinAudio.play();
			ctx.fillStyle = "black";
			ctx.fillText("PLAYER 1 WINS", canv.width / 2, canv.height / 2);
		}
		else if (winner == "Black") {
			bWinAudio.play();
			ctx.fillStyle = "red";
			ctx.fillText("PLAYER 2 WINS", canv.width / 2, canv.height / 2);
		}
		else {
			tieCheckers.play();
			ctx.fillText("...You tied. Seriously?", canv.width / 2, canv.height / 2);
		}
	}

  if(gameOver) {
	if (!drawImages)
    gameOverF();
  }

}

// sees what moves can be used by the player when selecting a checker
function checkMoves() {
	console.log("checking moves for " + clickIndex);
	validMove = [];
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
					if (!spaceOccupied(clickIndex + 7) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex + 9) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex - 9) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex - 7) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex - 9) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex - 7) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex + 7) && !doubleJump) {
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
					if (!spaceOccupied(clickIndex + 9) && !doubleJump) {
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
		// ctx.stroke();
	}
	// console.log(validMove);
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
	doubleJump = false;
	for (var i = 0; i < validMove.length; ++i) {
		// if a proper move is chosen
		if (clickIndex == validMove[i]) {
			if (turn == "Red") {
				for (var j = 0; j < redCheckers.length; ++j) {
					if (redCheckers[j].index == startPos) {
						if (clickIndex <= 7) {
							if (redCheckers[j].king == false) {
								kingAudio.play();
							}
							redCheckers[j] = new Checker(clickIndex, true);
							scorep1 += (time * 4);
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
					scorep1 += (time * 3);
					$("#scorep1").html(scorep1.toString());
					doubleJump = checkMoreJumps();
				}
				else {
					scorep1 += time;
					$("#scorep1").html(scorep1.toString());
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
							if (blackCheckers[j].king == false) {
								kingAudio.play();
							}
							blackCheckers[j] = new Checker(clickIndex, true);
							scorep2 += (time * 4);
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
					scorep2 += (time * 3);
					$("#scorep2").html(scorep2.toString());
					doubleJump = checkMoreJumps();
				}
				else {
					scorep2 += time;
					$("#scorep2").html(scorep2.toString());
				}
				if (!doubleJump) {
					turn = "Red";
					$("#turn").html("Turn: Red (Player 1)");
				}
			}
			break;
		}
	}
	moveReady = false;
	draw();
	validMove = [];
	deathArr = [];
	if (doubleJump) {
		checkMoves();
		moveReady = true;
	}
}

// this checks for double jumps, triple jumps, etc.
function checkMoreJumps() {
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

// Checks for ties
function checkGame() {
	console.log("checking for tie");
	var dispHolder = false;
	var turnHolder = turn;
	if (displayMoves) {
		dispHolder = true;
		displayMoves = false;
	}
	turn = "Red";
	for (var i = 0; i < redCheckers.length; ++i) {
		clickIndex = redCheckers[i].index;
		checkMoves();
		console.log(validMove);
		if (validMove.length > 0) {
			moveReady = false;
			displayMoves = dispHolder;
			turn = turnHolder;
			return false;
		}
	}
	turn = "Black";
	for (var i = 0; i < blackCheckers.length; ++i) {
		clickIndex = blackCheckers[i].index;
		checkMoves();
		if (validMove.length > 0) {
			moveReady = false;
			displayMoves = dispHolder;
			turn = turnHolder;
			return false;
		}
	}
	turn = turnHolder;
	console.log("TIE");
	return true;
}

function getMouseClick(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
	click = true;
}

function gameOverF() {
  // ctx.fillStyle = "white";
  // ctx.textAlign = "center";
	// ctx.font = "80px Arial";
	// if (winner == "Red") {
	// 	rWinAudio.play();
	// 	ctx.fillStyle = "black";
	// 	ctx.fillText("PLAYER 1 WINS", canv.width / 2, canv.height / 2);
	// }
	// else if (winner == "Black") {
	// 	bWinAudio.play();
	// 	ctx.fillStyle = "red";
	// 	ctx.fillText("PLAYER 2 WINS", canv.width / 2, canv.height / 2);
	// }
	// else {
	// 	tieCheckers.play();
	// 	ctx.fillText("...You tied. Seriously?", canv.width / 2, canv.height / 2);
	// }

	drawImages = true;
  // var marvin = document.getElementById("marvin");
  // var richmond = document.getElementById("richmond");
  // var thomas = document.getElementById("thomas");

	var id = setInterval(frame, 5);
	function frame() {
		if (marvinWiggle >= maxMarvin) {
			marvinInc = false;
			marvinWiggle = maxMarvin - 0.01;
		}
		else if (marvinWiggle <= minMarvin) {
			marvinInc = true;
			marvinWiggle = minMarvin + 0.01;
		}
		else if(marvinInc) {
			marvinWiggle += 1;
		}
		else {
			marvinWiggle -= 1;
		}

		if (thomasWiggleX >= thomasMaxX) {
			thomasIncX = false;
			thomasWiggleX = thomasMaxX - 0.01;
		}
		else if (thomasWiggleX <= thomasMinX) {
			thomasIncX = true;
			thomasWiggleX = thomasMinX + 0.01;
		}
		else if (thomasIncX) {
			thomasWiggleX += thomasSpeedX;
		}
		else {
			thomasWiggleX -= thomasSpeedY;
		}

		if (thomasWiggleY >= thomasMaxY) {
			thomasIncY = false;
			thomasWiggleY = thomasMaxY - 0.01;
		}
		else if (thomasWiggleY <= thomasMinY) {
			thomasIncY = true;
			thomasWiggleY = thomasMinY + 0.01;
		}
		else if (thomasIncY) {
			thomasWiggleY += thomasSpeedY;
		}
		else {
			thomasWiggleY -= thomasSpeedY;
		}

		if (thomasPulse >= thomasMaxPulse) {
			thomasPulseInc = false;
			thomasPulse = thomasMaxPulse - 0.1;
		}
		else if (thomasPulse <= thomasMinPulse) {
			thomasPulseInc = true;
			thomasPulse = thomasMinPulse + 0.1;
		}
		else if (thomasPulseInc) {
			thomasPulse += thomasPulseRate;
		}
		else {
			thomasPulse -= thomasPulseRate;
		}

		if (richmondT >= richmondMaxT) {
			richmondTInc = false;
			richmondT = richmondMaxT - 0.1;
		}
		else if (richmondT <= richmondMinT) {
			richmondTInc = true;
			richmondT = richmondMinT + 0.1;
		}
		else if (richmondTInc) {
			richmondT += richmondTSpeed;
		}
		else {
			richmondT -= richmondTSpeed;
		}
		richmondWiggle = richmondAmp * Math.cos(2 * Math.PI / 120 * richmondT);

		draw();
	}

  // ctx.drawImage(marvin, canv.width / 2 + marvinWiggle, 600, 200, 200);
  // ctx.drawImage(thomas, 50, 400, 180, 180);
  // ctx.drawImage(richmond, 60, 30, 180, 160);

}

$(document).ready(function () {
	$("#instructionTitle").click(function () {
        $("#instructions").slideToggle("fast");
    });
    $("#instructions").click(function () {
        $(this).slideToggle("fast");
    });

    $("#gamespace").click(function () {
		if (doubleJump) {
			for (var i = 0; i < validMove.length; ++i) {
				if ((Math.floor(mousePosY / 100) * 8 + Math.floor(mousePosX / 100)) == validMove[i]) {
					clickIndex = Math.floor(mousePosY / 100) * 8 + Math.floor(mousePosX / 100);
					dJumpAudio.load();
					dJumpAudio.play();
					makeMove();
				}
			}
		}
		else {
			clickIndex = Math.floor(mousePosY / 100) * 8 + Math.floor(mousePosX / 100);
			// console.log("index: " + clickIndex);
			if (moveReady == false) {
				checkMoves();
			}
			else {
				makeMove();
			}
			click = false;
		}
    });
});

function reset() {
	scorep1 = 0;
	scorep2 = 0;
	setup = true;
	$('#scorep1').text(scorep1.toString());
	$('#scorep2').text(scorep2.toString());
	redCheckers = [];
	blackCheckers = [];
	allCheckers = [];
	moveReady = false;
	click = false;
	validMove = [];
	deathArr = [];
	turn = "Red";
	gameOver = false;
	clearInterval(id);
	draw();
}
