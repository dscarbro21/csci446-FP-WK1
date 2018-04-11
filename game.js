var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

// NUM COLORS IS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
var numColors = 4;

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;

var colorArr = [];
var adjArr = [];

var score = 0;
var numBlocks = 400;

var i = 0;

var setup = true;
var gameOver = false;
var winner = false; // When the player beats the last level set this guy to true

//TODO::modify
function draw() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);

	if (setup) {
		for (var i = 0; i < 20; i++) {
			for (var j = 0; j < 20; j++) {
				if (numColors == 1) {
					colorArr[i + j * 20] = 0;
					ctx.fillStyle = "red";
				}
				else if (numColors == 2) {
					colorArr[i + j * 20] = Math.floor(Math.random() * 2);
					if (colorArr[i + j * 20] === 0) {
						ctx.fillStyle = "red";
					}
					else if (colorArr[i + j * 20] === 1) {
						ctx.fillStyle = "blue";
					}
				}
				else if (numColors == 3) {
					colorArr[i + j * 20] = Math.floor(Math.random() * 3);
					if (colorArr[i + j * 20] === 0) {
						ctx.fillStyle = "red";
					}
					else if (colorArr[i + j * 20] === 1) {
						ctx.fillStyle = "blue";
					}
					else {
						ctx.fillStyle = "yellow";
					}
				}
				else {
					colorArr[i + j * 20] = Math.floor(Math.random() * 4);
					if (colorArr[i + j * 20] === 0) {
						ctx.fillStyle = "red";
					}
					else if (colorArr[i + j * 20] === 1) {
						ctx.fillStyle = "blue";
					}
					else if (colorArr[i + j * 20] === 2) {
						ctx.fillStyle = "yellow";
					}
					else if (colorArr[i + j * 20] === 3) {
						ctx.fillStyle = "green";
					}	
				}
				ctx.fillRect(i * 40 + 1, j * 40 + 1, 39, 39);
				ctx.stroke();
			}
			setup = false;
		}
	}
	else {
		for (var i = 0; i < 20; i++) {
			for (var j = 0; j < 20; j++) {
				if (colorArr[i + j * 20] === 0) {
					ctx.fillStyle = "red";
				}
				else if (colorArr[i + j * 20] === 1) {
					ctx.fillStyle = "blue";
				}
				else if (colorArr[i + j * 20] === 2) {
					ctx.fillStyle = "yellow";
				}
				else if (colorArr[i + j * 20] === 3) {
					ctx.fillStyle = "green";
				}
				else {
					ctx.fillStyle = "gray";
				}
	 			ctx.fillRect(i * 40 + 1, j * 40 + 1, 39, 39);
				ctx.stroke();
			}
		}
	}

  if(gameOver) {
    gameOverF();
  }
  else if(winner) {
    winnerF();
  }
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

  ctx.drawImage(happy, 50, 300, 180, 180);
  ctx.drawImage(sperngeberb, canv.width / 2, 300, 200, 200);
}

function gameOverF() {
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
	ctx.font = "80px Arial";
	ctx.fillText("GAME OVER", canv.width / 2, canv.height / 2);

  var marvin = document.getElementById("marvin");
  var richmond = document.getElementById("richmond");
  var thomas = document.getElementById("thomas");

  ctx.drawImage(marvin, canv.width / 2, 300, 200, 200);
  ctx.drawImage(thomas, 50, 300, 180, 180);
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
						clickIndex = Math.floor(mousePosY / 40) * 20 + Math.floor(mousePosX / 40);
						//console.log("index: " + clickIndex + "color: " + colorArr[clickIndex]);
						checkAdjacency();
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