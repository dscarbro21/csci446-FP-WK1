var canv = document.getElementById("gamespace");
var ctx = canv.getContext("2d");

var upMenuHeight = 80;
var upMenuBorder = 3;
var upButtonBorder = 1;
var upButtonWidth = 150;
var upButtonHeight = 60;
var upButtonYPos = 10;

var HUDwidth = 200;
var HUDheight = 75;

var healthUpX = 20;
var damageUpX = 190;
var shotSpeedUpX = 360;
var medPackX = 530;

var tomX = 780;
var tomY = canv.height / 2;

var baseX = canv.width - 150;

var healthUpCost = 10;
var damageUpCost = 10;
var speedUpCost = 10;
var medPackCost = 50;

var coins = 100;

var health = 100;
var maxHealth = 100;
var damage = 1;
var maxDamage = 10;
var shotSpeed = 1;
var maxShotSpeed = 10;

var mousePosX;
var mousePosY;
var click = false;

// Enemies have various health amounts/speeds
var enemy1H = 2;
var enemy1S = 3;

var enemy2H = 5;
var enemy2S = 2;

var enemy3H = 10;
var enemy3S = 1;

//array that contains the random positions of the vectors
var xPos = [];
var yPos = [];

var i = 0;

// Bool for handling laser shooting timing
var isShooting = false;

var gameOver = false;
var level = 1;
var enemyHealth1 = []; // array keeping track of each enemies health
var enemyHealth2 = [];

var enemyAlive1 = [];
var enemyAlive2 = [];

var winner = false; // When the player beats the last level set this guy to true

var score = 0;

// Hit and shoot sound effects
var hitSound = new Audio("audio/hitSound.mp3");
var shootSound = new Audio("audio/shootSound.mp3");

// canv.addEventListener("mousedown", getPosClick, false);
// canv.addEventListener("mouseenter", getPosHover, false);


function checkHit() {
	for (i = 0; i < 7; i++) {
		if ((mousePosX >= xPos[i] + 1 && mousePosX <= xPos[i] + 46) && (mousePosY >= yPos[i] - 2 && mousePosY <= yPos[i] + 51)) {
			hitSound.play();
			if (level == 1) {
				enemyHealth1[i] -= damage;
				if (enemyHealth1[i] <= 0) {
					enemyAlive1[i] = false;
					score += 10;
					coins += 5;
				}
			}
			if (level == 2) {
				enemyHealth2[i] -= damage;
				if (enemyHealth2[i] <= 0) {
					enemyAlive2[i] = false;
					score += 30;
					coins += 10;
				}
			}
		}
	}
	
	checkLevelComplete();
}

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


//buttons for health, damage, shot speed, medpack
function drawUpButton(text, x, y, cost) {
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, upButtonWidth, upButtonHeight);
  if(click && mousePosX >= x && mousePosX <= x + upButtonWidth && mousePosY >= y && mousePosY <= y + upButtonHeight) {
    if(coins >= cost) {
      coins -= cost;
      if(text == "Health[1]") {
        maxHealth += 20;
        healthUpCost += 10;
        cost = healthUpCost;
      }
      else if(text == "Damage[2]") {
        damage += 1;
        damageUpCost += 10;
        cost = damageUpCost;
      }
      else if(text == "Shot Speed[3]") {
        shotSpeed += 1;
        speedUpCost += 10;
        cost = speedUpCost;
      }
      else if(text == "Med Pack[4]" && health != maxHealth) {
        if(health + 40 <= maxHealth) {
          health += 40;
        }
		else {
          health = maxHealth;
        }
      }
	  else if (health == maxHealth) {
	    coins += cost;
	  }
    }
    click = false;
    console.log(healthUpCost);
  }
  if(coins < cost) {
    ctx.fillStyle = "red"
  }
  else if(mousePosX >= x && mousePosX <= x + upButtonWidth && mousePosY >= y && mousePosY <= y + upButtonHeight) {
    ctx.fillStyle = "yellow";
  }
  else {
    ctx.fillStyle = "white";
  }
  ctx.fillRect(x + upButtonBorder, y + upButtonBorder, upButtonWidth - 2 * upButtonBorder, upButtonHeight - 2 * upButtonBorder);
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000000";
  ctx.fillText(text, x + upButtonWidth / 2, y + upButtonHeight / 3 + 5);
  ctx.fillStyle = "#c19e00";
  ctx.fillText(cost, x + upButtonWidth / 2, y + 2 * upButtonHeight / 3 + 10);
}

function drawUpgradeMenu() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, canv.height - upMenuHeight, canv.width, upMenuHeight);
  ctx.fillStyle = "#b2eaff"; //upMenu bg color
  ctx.fillRect(upMenuBorder, canv.height - upMenuHeight + upMenuBorder, canv.width - 2 * upMenuBorder, upMenuHeight - 2 * upMenuBorder);

  drawUpButton("Health[1]", healthUpX, upButtonYPos + canv.height - upMenuHeight, healthUpCost);
  drawUpButton("Damage[2]", damageUpX, upButtonYPos + canv.height - upMenuHeight, damageUpCost);
  drawUpButton("Shot Speed[3]", shotSpeedUpX, upButtonYPos + canv.height - upMenuHeight, speedUpCost);
  drawUpButton("Med Pack[4]", medPackX, upButtonYPos + canv.height - upMenuHeight, medPackCost);

  ctx.font = "bold 40px Arial";
  ctx.fillText(coins, medPackX + upButtonWidth + (canv.width - 530 - upButtonWidth) / 2, canv.height - upMenuHeight / 3);
}

function drawHUD() {
	ctx.fillStyle = "black";
	ctx.fillRect(canv.width - (HUDwidth + 5), 5, HUDwidth, HUDheight);
	if (isShooting) {
		ctx.fillStyle = "#b2eaff";
	}
	else {
		ctx.fillStyle = "#ff5151"
	}
	ctx.fillRect(canv.width - (HUDwidth + 4), 6, HUDwidth - 2, HUDheight - 2);

	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.font = "20px Arial";
	ctx.fillText("Health: " + Math.round(health) + "/" + maxHealth, canv.width - (HUDwidth + 3), HUDheight - 0);
	ctx.fillText("Damage: " + damage, canv.width -(HUDwidth + 3), HUDheight - 25);
	ctx.fillText("Shot Speed: " + shotSpeed, canv.width - (HUDwidth + 3), HUDheight - 50);
}

function drawLaser() {
	shootSound.play();
	isShooting = true;

	ctx.beginPath();
	ctx.moveTo(tomX, tomY);
	ctx.lineTo(mousePosX, mousePosY);
	ctx.strokeStyle = "red";
	ctx.stroke();

	checkHit();
	setTimeout(draw, 300*(maxShotSpeed - shotSpeed));
	setTimeout(doneShooting, 300*(maxShotSpeed - shotSpeed));
	click = false;
}

function doneShooting() {
	isShooting = false;
}

function drawEnemy() {
    var troll = document.getElementById("troll");
    var forever = document.getElementById("foreveralone");

    for (i = 0; i < 7; i++) {
        if (level == 1) {
            if (enemyAlive1[i] == true) { //level one draws the troll meme.
                ctx.drawImage(troll, xPos[i], yPos[i], 50, 50);
            }
        }
        else if (level == 2) {
            if (enemyAlive2[i] == true) { //level two draws the forever alone meme. 
                ctx.drawImage(forever, xPos[i], yPos[i], 50, 50);
            }
        }
    }
}

function drawBaseLine() {
  ctx.beginPath();
	ctx.moveTo(baseX, 5 + HUDheight);
	ctx.lineTo(baseX, canv.height - upMenuHeight);
	ctx.strokeStyle = "red";
	ctx.stroke();
}

function drawTom() {
    var tom = document.getElementById("tom");
    ctx.drawImage(tom, baseX + 25, 200, 150, 150);
}

function draw() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canv.width, canv.height);

  // mousePos = getMousePos(event);

  drawUpgradeMenu();
  drawHUD();
  drawEnemy();
  drawBaseLine();
  drawTom();

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

	// draw();
	// updateEnemies(event);
}

function getMouseClick(event) {
	var frame = canv.getBoundingClientRect();
	mousePosX = event.clientX - frame.left;
	mousePosY = event.clientY - frame.top;
	click = true;
	draw();
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

function damageTom() { // need to truncate health or adjust speed
  if(health < 0) {
	gameOverF();
  }
  else {
	health -= 0.01;
  }
}

function updateEnemies() {
  for (i = 0; i < 7; i++) {
	if(xPos[i] + 0.3 < baseX) {
	  xPos[i] += 0.3;
	}
	else {
	  damageTom();
	}
  }
  draw();
}

$(document).ready(function () {
    $("#instructionTitle").click(function () {
        $("#instructions").slideToggle("fast");
    });
    $("#instructions").click(function () {
        $(this).slideToggle("fast");
    });

    $("#gamespace").click(function () {
        if (mousePosY < canv.height - upMenuHeight && isShooting == false) {
            drawLaser();
        }
		click = false;
    });
	$(document).keydown(function(e){
		if (e.keyCode == 49) {
			if (coins >= healthUpCost) {
				coins -= healthUpCost;
				maxHealth += 20;
				healthUpCost += 10;
			}
		}
	});
	$(document).keydown(function(e){
		if (e.keyCode == 50) {
			if (coins >= damageUpCost) {
				coins -= damageUpCost;
				damage += 1;
				damageUpCost += 10;
			}
		}
	});
	$(document).keydown(function(e){
		if (e.keyCode == 51) {
			if (coins >= speedUpCost) {
				coins -= speedUpCost;
				shotSpeed += 1;
				speedUpCost += 10;
			}
		}
	});
	$(document).keydown(function(e){
		if (e.keyCode == 52) {
			if (coins >= medPackCost && health != maxHealth) {
				coins -= medPackCost;
				if (health + 50 <= maxHealth) {
					health += 50;
				}
				else {
					health = maxHealth;
				}
			}
		}
	});
	
	var x;
	var y;
	for (i = 0; i < 7; i++) {
		x = Math.random() * 200;
		y = Math.random() * 250 + 80;
		Math.round(x);
		Math.round(y);
		xPos.push(x);
		yPos.push(y);
		enemyHealth1[i] = 3;
		enemyHealth2[i] = 5;
		enemyAlive1[i] = true;
		enemyAlive2[i] = true;
	}
	
	drawEnemy();

});

window.setInterval(function(){
  updateEnemies();
}, 50)
draw();
update_scores();