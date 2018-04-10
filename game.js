var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

var tomX = 780;
var tomY = canv.height / 2;

var baseX = canv.width - 150;

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;
// var notLeft = false;
// var notTop = false;
// var notRight = false;
// var notBottom = false;

var colorArr = [];
var adjArr = [];
var checkedArr = [];
var masterArr = [];

var score = 0;
var numBlocks = 400;

var i = 0;

var setup = true;
var gameOver = false;
var winner = false; // When the player beats the last level set this guy to true


//TODO:: Modify
function checkLevelComplete() {
	var levelComplete = true;
	for (i = 0; i < 7; i++) {
		if (level == 1 && enemyAlive1[i] == true) {
			levelComplete = false;
		}
		if (level == 2 && enemyAlive2[i] == true) {
			levelComplete = false;
		}
	}

	if (levelComplete == true && level == 1) {
		updateLevel();
	}
	if (levelComplete == true && level == 2) {
		winner = true;
	}
}


//TODO::don't need
function drawTom() {
    var tom = document.getElementById("tom");
    ctx.drawImage(tom, baseX + 25, 200, 150, 150);
}

//TODO::modify
function draw() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);

	//TODO::I don't know if I commented this out or not..
  // mousePos = getMousePos(event);
	if (setup) {
		for (var i = 0; i < 20; i++) {
			for (var j = 0; j < 20; j++) {
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



  drawTom();

  if(gameOver) {
    gameOverF();
  }
  else if(winner) {
    winnerF();
  }

}

//TODO:: keep
function getMousePos(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;

	// draw();
}

function check(clindex) {
	for (var i = 0; i < adjArr.length; i++) {
		if (clindex == adjArr[i]) {
			console.log("   copy found   " + clindex);
			return true;
		}
	}
	return false;
}

function checkAdjacency2(clindex) {
	console.log("::CALL checkAdjacency(clindex)");
	var notTop = notLeft = notRight = notBottom = false;
	if (clindex % 20 === 0) {
		notLeft = true;
	}
	else if ((clindex - 19) % 20 === 0) {
		notRight = true;
	}
	if (clindex < 20) {
		notTop = true;
	}
	else if (clindex >= 380) {
		notBottom = true;
	}
	if (notLeft == false) {
		// check color
		if (check(clindex -1)) {

		}
		else if (colorArr[clindex - 1] == colorArr[clindex]) {
			adjArr.push(clindex - 1);
			masterArr[clindex -1] = 0;
			// its adjacent
			checkAdjacency2(clindex -1);
		}
	}
	if (notRight == false) {
		// check color
		if (check(clindex + 1)) {

		}
		else if (colorArr[clindex + 1] == colorArr[clindex]) {
			// its adjacent
			adjArr.push(clindex + 1);
			masterArr[clindex + 1] = 0;
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
			masterArr[clindex - 20] = 0;
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
			masterArr[clindex + 20] = 0;
			checkAdjacency2(clindex + 20);
		}
	}
	notTop = notLeft = notRight = notBottom = false;


}

function checkAdjacency() {
	console.log("::CALL checkAdjacency");
	var notTop = notLeft = notRight = notBottom = false;
	var notAlone = false;
	adjArr.push(clickIndex);
	// masterArr[clickIndex] = 0;
	if (clickIndex % 20 === 0) {
		notLeft = true;
	}
	else if ((clickIndex - 19) % 20 === 0) {
		notRight = true;
	}
	if (clickIndex < 20) {
		notTop = true;
	}
	else if (clickIndex >= 380) {
		notBottom = true;
	}
	if (notLeft == false) {
		// check color

		if (check(clickIndex - 1)) {

		}
		else if (colorArr[clickIndex - 1] == colorArr[clickIndex]) {
			notAlone = true;
			adjArr.push(clickIndex - 1);
			masterArr[clickIndex -1] = 0;
			// its adjacent
			checkAdjacency2(clickIndex -1);
		}
	}
	if (notRight == false) {
		// check color
		if (check(clickIndex + 1)) {

		}
		else if (colorArr[clickIndex + 1] == colorArr[clickIndex]) {
			// its adjacent
			notAlone = true;
			adjArr.push(clickIndex + 1);
			masterArr[clickIndex + 1] = 0;
			checkAdjacency2(clickIndex + 1);
		}
	}
	if (notTop == false) {
		// check color
		if (check(clickIndex - 20)) {

		}
		else if (colorArr[clickIndex - 20] == colorArr[clickIndex]) {
			// its adjacent
			notAlone = true;
			adjArr.push(clickIndex - 20);
			masterArr[clickIndex - 20] = 0;
			checkAdjacency2(clickIndex - 20);
		}
	}
	if (notBottom == false) {
		// check color
		if (check(clickIndex + 20)) {

		}
		else if (colorArr[clickIndex + 20] == colorArr[clickIndex]) {
			// its adjacent
			notAlone = true;
			adjArr.push(clickIndex + 20);
			masterArr[clickIndex + 20] = 0;
			checkAdjacency2(clickIndex + 20);
		}
	}
	console.log("LENGTH" +  adjArr.length);
	ctx.fillStyle = "gray";
	for (var i = 0; i < adjArr.length; ++i) {
		console.log("YEET" + adjArr[i]);
		console.log("x: " + adjArr[i] % 20 + " y: " + adjArr[i] / 20);
		ctx.fillRect(adjArr[i] % 20 * 40 + 1, Math.floor(adjArr[i] / 20) * 40 + 1, 39, 39);
		ctx.stroke();
	}
	if (adjArr.length > 0) {
		ctx.fillRect(clickIndex % 20 * 40 + 1, Math.floor(clickIndex / 20) * 40 + 1, 39, 39);
	}
	
	if (colorArr[clickIndex] != 4) { // if the user did not click on a gray square, update the score
		updateScore();
	}
	notTop = notLeft = notRight = notBottom = false;
	console.log("matches: " + adjArr.length);
	//call a function to clear anything in adjArr at top (2s above)

	// if (adjArr.lenth >= 1) {
		// adjArr.push(clickIndex);
		// masterArr[clickIndex] = 0;
		if (notAlone) {
			masterArr[clickIndex] = 0;
		}
		replace();
	// }
	// else {
	// 	masterArr[clickIndex] = 1;
	// }
	// nameThisLater();
	console.log("color clicked: " + colorArr[clickIndex]);
	
	adjArr = [];

}

function updateScore() {
	score += adjArr.length * (adjArr.length - 1); //adds number of blocks * number of blocks - 1 to the score
	$('#score').text(score.toString());
	//TODO:: draw the score to the page still
	checkGame();
}

function checkGame() {
	numBlocks -= adjArr.length;
	console.log("BLOCKS LEFT: " + numBlocks);
	if(numBlocks == 0) {
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
				console.log("0")
				return true;
			} 
			//check right
			else if ((i + 1) <= 19 && colorArr[i+1] == colorArr[i] && colorArr[i] != 4) {
				//match to the right
				console.log("1");
				return true;
			}
			//check up (-20)
			else if ((i -20) >= 0 && colorArr[i-20] == colorArr[i] && colorArr[i] != 4) {
				//match above
				console.log("2");
				return true;
			}
			//check down (+20)
			else if ((i+20) <= 399 && colorArr[i+20] == colorArr[i] && colorArr[i] != 4) {
				//match below
				console.log("3");
				return true;
			}
		}
		//if no matches are found, call loser function
		gameOverF();
	}
}

// function nameThisLater() {
// 	for (var i = 0; i < adjArr.length; ++i) {
// 		var yeet = false;
// 		var dist = 20;
// 		if (adjArr[i] - 20 < 0) {
// 			// is it out of bounds???
// 			masterArr[adjArr[i]] = 2;
// 			colorArr[adjArr[i]] = 4;
//
// 			while (yeet == false) {
// 				if (masterArr[adjArr[i] + dist] == 0) {
// 					masterArr[adjArr[i] + dist] = 2;
// 					colorArr[adjArr[i] + dist] = 4;
// 					dist += 20;
// 				}
// 				else {
// 					yeet = true;
// 				}
// 			}
// 			// ?>??
// 		}
// 		else if (masterArr[adjArr[i] - 20] == 2) {
// 			masterArr[adjArr[i]] = 2;
// 			colorArr[adjArr[i]] = 4;
//
// 			while (yeet == false) {
// 				if (masterArr[adjArr[i] + dist] == 0) {
// 					masterArr[adjArr[i] + dist] = 2;
// 					colorArr[adjArr[i] + dist] = 4;
// 					dist += 20;
// 				}
// 				else {
// 					yeet = true;
// 				}
// 			}
// 			// ????
// 		}
// 	}
// }

function replace() {
	for (var j = 0; j < 20; j++) {
		for (var i = 0; i < 20; i++) {
			if((masterArr[j + i*20] == 1 /*|| masterArr[j + i*20] == 2*/) && masterArr[j + (i + 1) * 20] == 0) { //start of empty, i is last nonempty
				if (i == 0) {
					var color = colorArr[j + (i + 1) * 20];
					console.log("color:: " + color);
					for (var k = i + 2; k < 20; k++) {
						if (colorArr[j + k * 20] != color || k == 19) {
							colorArr[j + (k - 1) * 20] = colorArr[j + i * 20];
							masterArr[j + (k - 1) * 20] = masterArr[j + i * 20];
							for (var m = k - 2; m >= 0; m--) {
								colorArr[j + m * 20] = 4;
								masterArr[j + m * 20] = 2;
							}
							break;
						}
					}
				}
				else {
					for (var k = i + 1; k < 20; k++) { //find end of empty //TODO::end of board check (k < 19)
						if(masterArr[j + k*20] == 0 && (masterArr[j + (k+1) * 20] == 1 || k == 19)) { //end of empty at k
							for(var m = 0; m <= i; m++) { // i is last block before start of empty
								masterArr[j + (k - m) * 20] = masterArr[j + (i - m) * 20];
								masterArr[j + (i - m) * 20] = 2;
								colorArr[j + (k - m) * 20] = colorArr[j + (i - m) * 20];
								colorArr[j + (i - m) * 20] = 4;
								var rep = j + (k - m) * 20;
								var orig = j + (i - m) * 20;
							//	var old = j + (i - m) * 20;
								// console.log("Replacing " + rep + " with " + orig);
								// console.log("emptying  " + old);
							}
						}
					}
				}
			}
			else if (masterArr[j + i*20] == 2 && masterArr[j + (i + 1) * 20] == 0) {
				console.log("burt reynolds");
				if (i == 18) {
					console.log("Queen Elizabeth");
					for (var m = j; m < 19; m++) {
						for (var s = 0; s < 20; s++) {
							masterArr[m + s * 20] = masterArr[m + 1 + s * 20];
							colorArr[m + s * 20] = colorArr[m + 1 + s * 20];
						}
					}
					for (var s = 0; s < 20; s++) {
						masterArr[19 + s * 20] = 2;
						colorArr[19 + s * 20] = 4;
					}
				}
				else {
					for (var k = i + 2; k <= 20; k++) {
						if (masterArr[j + k * 20] == 1) {
							for (var m = i + 1; m < k; m++) {
								colorArr[j + m * 20] = 4;
								masterArr[j + m * 20] = 2;
							}
							break;
						}
						// do the squeeze here too oh well oops
						else if (k == 19 && masterArr[j + k * 20] == 0) {
							console.log("bob saget");
							for (var m = j; m < 19; m++) {
								for (var s = 0; s < 20; s++) {
									masterArr[m + s * 20] = masterArr[m + 1 + s * 20];
									colorArr[m + s * 20] = colorArr[m + 1 + s * 20];
								}
							}
							for (var s = 0; s < 20; s++) {
								masterArr[19 + s * 20] = 2;
								colorArr[19 + s * 20] = 4;
							}
						}
					}
				}
			}
			else if (i == 0 && masterArr[j + i * 20] == 0) {
				console.log("this guy");
				for (var k = i + 1; k <= 20; k++) {
					if (masterArr[j + k * 20] == 1 || k == 20) {
						for (var m = i; m < k; m++) {
							colorArr[j + m * 20] = 4;
							masterArr[j + m * 20] = 2;
						}
						break;
					}
				}
			}
		}
	}
	draw();
}

//TODO::keep
function getMouseClick(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
	click = true;
	// checkAdjacency();
	// draw();
}

//TODO::keep/modify
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

//TODO::keep/modify
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

//TODO:: don't need
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


//TODO::Don't need the keydown functions, just clicks
$(document).ready(function () {
	for (var i = 0; i < 400; i++) {
		masterArr.push(1);
	}
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
						console.log("index: " + clickIndex + "color: " + colorArr[clickIndex]);
						checkAdjacency();
        // }
		click = false;
    });
});

//TODO::don't need
// window.setInterval(function(){
//   updateEnemies();
// }, 50)
draw();
