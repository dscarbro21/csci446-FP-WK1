var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

var tomX = 780;
var tomY = canv.height / 2;

var baseX = canv.width - 150;

var mousePosX;
var mousePosY;
var click = false;
var clickIndex;

var i = 0;

var gameOver = false;
var winner = false; // When the player beats the last level set this guy to true

var score = 0;

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
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canv.width, canv.height);

	//TODO::I don't know if I commented this out or not..
  // mousePos = getMousePos(event);

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

//TODO::keep
function getMouseClick(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
	click = true;
	draw();
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
    $("#instructionTitle").click(function () {
        $("#instructions").slideToggle("fast");
    });
    $("#instructions").click(function () {
        $(this).slideToggle("fast");
    });

    $("#gamespace").click(function () {
        // if (mousePosY < canv.height) {
            // drawLaser();
						console.log("hiya");
						console.log(mousePosX + ", " + mousePosY);
						clickIndex = Math.floor(mousePosY / 40) * 20 + Math.floor(mousePosX / 40);
						console.log("index: " + clickIndex);
        // }
		click = false;
    });

	//TODO::don't need -possibly useful?
	// var x;
	// var y;
	// for (i = 0; i < 7; i++) {
	// 	x = Math.random() * 200;
	// 	y = Math.random() * 250 + 80;
	// 	Math.round(x);
	// 	Math.round(y);
	// 	xPos.push(x);
	// 	yPos.push(y);
	// 	enemyHealth1[i] = 3;
	// 	enemyHealth2[i] = 5;
	// 	enemyAlive1[i] = true;
	// 	enemyAlive2[i] = true;
	// }

	// drawEnemy();

});

//TODO::don't need
// window.setInterval(function(){
//   updateEnemies();
// }, 50)
draw();
