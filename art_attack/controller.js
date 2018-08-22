var grid = [];
var CSS_COLOR_NAMES = ["Aqua","Bisque","Blue","BlueViolet","Brown","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var arenaSize = botData.length * 3;
var maxRounds = 200;
var turnNumber = 1;
var interval;
var running = false;

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}


var stringify = function(obj, prop) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift();
  });
  return 'this["' + prop + '"] = ' + json + ';';
};

function updateBotData() {
	botData = [];
	$.ajax(
		{
			url: "https://api.stackexchange.com/2.2/questions/170908/answers?page=1&site=codegolf&pagesize=100&filter=withbody&order=desc&sort=creation",
			method: "get",
			dataType: "jsonp", 
			crossDomain: !0,
			success: function(e){
				e.items.forEach(
					function(e){
						try {
							var answerBody = e.body;
							answerBody = answerBody.replace(/<[\/]*a[^>]*>/g,"");
							var regexp = /(?:<h\d>)([^<]+)(?=<\/h\d>)/g;
							var name = regexp.exec(answerBody)[1];
					
							var regexp2 = /(?:<code>)([^<]+)(?=<\/code>)/g
							var code = regexp2.exec(answerBody)[1];
							var func;

							eval("func = "+decodeHTMLEntities(code));

							botData.push({
								name: name,
								func: func
							});
						} catch(err) {
							// Do nothing
						}
					}
				)
				console.log(stringify(botData, "botData"));

				initialise();
				
			}
		}
	);
}

function runBots() {
	var bots_array = [];

	for (var j = 0; j < botData.length; j++) {
		if (!botData[j].eliminated) {
			bots_array.push([botData[j].uid, botData[j].x, botData[j].y]);
		}
	}

	for (var i = 0; i < botData.length; i++) {
		if (!botData[i].eliminated) {
			var uid =  botData[i].uid;
			var botself = [uid, botData[i].x, botData[i].y];
			var gameInfo = [turnNumber, maxRounds];

			var botself_copy = JSON.parse(JSON.stringify(botself));
			var grid_copy = JSON.parse(JSON.stringify(grid));
			var bots_array_copy = JSON.parse(JSON.stringify(bots_array));
			var gameInfo_copy = JSON.parse(JSON.stringify(gameInfo));

			var response = botData[i].func(botself_copy, grid_copy, bots_array_copy, gameInfo_copy);

			if (response == "up") {
				botData[i].y -= 1;

				if (botData[i].y == -1) {
					// Prevent bot from leaving arena
					botData[i].y = 0
				}
			} else if (response == "down") {
				botData[i].y += 1;

				if (botData[i].y == arenaSize) {
					// Prevent bot from leaving arena
					botData[i].y = arenaSize-1;
				}
			} else if (response == "right") {
				botData[i].x += 1;

				if (botData[i].x == arenaSize) {
					// Prevent bot from leaving arena
					botData[i].x = arenaSize-1;
				}
			}  else if (response == "left") {
				botData[i].x -= 1;

				if (botData[i].x == -1) {
					// Prevent bot from leaving arena
					botData[i].x = 0;
				}
			}

			if (grid[botData[i].x][botData[i].y] > 0) {
				grid[botData[i].x][botData[i].y] = [botData[i].uid, 0, grid[botData[i].x][botData[i].y]][Math.abs(botData[i].uid-grid[botData[i].x][botData[i].y])%3];
			} else {
				grid[botData[i].x][botData[i].y] = botData[i].uid;
			}
		}
	}

	for (var a = 0; a < botData.length; a++) {
		for (var b = 0; b < botData.length; b++) {
			if (!botData[a].eliminated && !botData[b].eliminated && botData[a] != botData[b] && botData[a].x == botData[b].x && botData[a].y == botData[b].y) {
				grid[botData[a].x][botData[a].y] = 0;
			}
		}
	}

	var count_array = findArea();

	for (var j = 0; j < count_array.length; j++) {
		if (count_array[j] <= 1 && turnNumber >= 5) {
			botData[j].eliminated = true;
		}
	}
}

function colourGrid() {
	var canvas = document.getElementById("playWindow");
	var ctx = canvas.getContext("2d");

	for (var x = 0; x < arenaSize; x++) {
		for (var y = 0; y < arenaSize; y++) {
			ctx.beginPath();

			if (grid[x][y] == 0 || (botData[grid[x][y]-1].eliminated)) {
				ctx.fillStyle = "#FFFFFF";
			} else {
				ctx.fillStyle = botData[grid[x][y]-1].colour;
			}

			ctx.fillRect(x*20+1, y*20+1, 18, 18);
			ctx.closePath();
		}
	}
}

function drawBots() {
	var canvas = document.getElementById("playWindow");
	var ctx = canvas.getContext("2d");

	for (var i = 0; i < botData.length; i++) {
		if (!botData[i].eliminated) {
			ctx.beginPath();
			ctx.fillStyle = "#000";

			var xpos = botData[i].x*20;
			var ypos = botData[i].y*20;

			ctx.fillRect(xpos, ypos, 20, 20);
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = botData[i].colour;

			ctx.fillRect(xpos+2, ypos+2, 16, 16);
			ctx.closePath();
		}
	}
}

function drawGrid() {
	var canvas = document.getElementById("playWindow");
	canvas.width = arenaSize*20;
	canvas.height = canvas.width;

	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.lineWidth = 1;
	for (var x = 0; x < canvas.width; x+=20) {
		ctx.beginPath();
		ctx.strokeStyle = "#DDDDDD";
		ctx.moveTo(x,0);
		ctx.lineTo(x, canvas.width);
		ctx.stroke();
		ctx.closePath();
	}

	for (var y = 0; y < canvas.width; y+=20) {
		ctx.beginPath();
		ctx.strokeStyle = "#DDDDDD";
		ctx.moveTo(0,y);
		ctx.lineTo(canvas.height, y);
		ctx.stroke();
		ctx.closePath();
	}
}

function findArea() {
	var count_array = new Array(botData.length);

	for (var x = 0; x < arenaSize; x++) {
		for (var y = 0; y < arenaSize; y++) {
			if (grid[x][y] > 0) {
				count_array[grid[x][y]-1] = (count_array[grid[x][y]-1] | 0) + 1;
			}
		}
	}

	return count_array;
}

function findWinner() {
	var count_array = findArea();

	for (var n = 0; n < count_array.length; n++) {
		if (count_array[n] === undefined) {
			count_array[n] = 0;
		}
	}

	var maxArea = Math.max.apply(null, count_array);
	
	var message = "";
	var end = " wins!"
	for (var i = 0; i < count_array.length; i++) {
		if (count_array[i] == maxArea && !botData[i].eliminated) {
			var name = botData[i].name;
			var colour = botData[i].colour;

			if (message.length == 0) {
				message += "<span style=\"color:"+colour+";\">" + name + "</span>";
			} else {
				message += " and <span style=\"color:"+colour+";\">" + name + "</span>";
				end = " win!";
			}
		}
	}

	message += end;

	document.getElementById("roundNum").innerHTML += " - "+message;
}

function removeBot(id) {
	botData.splice(id-1, 1);
	initialise();
}

function updateBoard() {
	document.getElementById("playerTable").innerHTML = "<tr><td style=\"font-size: 1.5em;font-weight: bold\">Player Name</td><td style=\"font-size: 1.5em;font-weight: bold\">Score</td><td style=\"font-size: 1.5em;font-weight: bold\">Eliminated?</td></tr>";

	var scores = findArea();

	for (var n = 0; n < scores.length; n++) {
		if (scores[n] === undefined) {
			scores[n] = 0;
		}
	}

	var maxArea = Math.max.apply(null, scores);
	var winners = [];

	for (var i = 0; i < scores.length; i++) {
		if (scores[i] == maxArea && !botData[i].eliminated) {
			winners.push(botData[i].name)
		}
	}

	for (var k = 0; k < botData.length; k++) {
		document.getElementById("playerTable").innerHTML += "<tr><td><span style=\"font-size: 1.5em;font-weight: bold;color:"+botData[k].colour+"\">"+botData[k].name + (winners.indexOf(botData[k].name)>=0?"*":"") + "</span></td><td><span style=\"font-size: 1.5em;font-weight: bold;color:"+botData[k].colour+"\">" + (botData[k].eliminated?0:scores[k]) + "</span></td><td><span style=\"font-size: 1.5em;font-weight: bold;color:"+botData[k].colour+"\">"+(botData[k].eliminated?"Yes":"No")+"</span></td><td><button onclick=\"javascript:removeBot("+botData[k].uid+")\">Remove Bot</button></td></tr>";
	}
}

function doStuff() {
	turnNumber++;

	if (turnNumber == maxRounds) {
		running = false;
		clearInterval(interval);
	}

	runBots();
	drawGrid();
	colourGrid();
	drawBots();
	updateBoard();

	document.getElementById("roundNum").innerHTML = turnNumber;

	if (turnNumber == maxRounds) {
		findWinner();
	}
}

function runGame() {
	if (!running) {
		maxRounds = document.getElementById("gameInput").value;
		var fps = document.getElementById("fpsInput").value;
		running = true;

		interval = setInterval(doStuff, 1/fps * 1000);
	}
}

function stopGame() {
	running = false;
	clearInterval(interval);
}

function initialise() {
	stopGame();

	localStorage.clear();

	document.getElementById("roundNum").innerHTML = "0";
	turnNumber = 0;
	
	arenaSize = botData.length * 3;
	grid = [];
	botData = botData.shuffle();

	for (var i = 0; i < arenaSize; i++) {
		grid.push([]);

		for (var j = 0; j < arenaSize; j++) {
			grid[i].push(0);
		}
	}

	var previous_x = [];
	var previous_y = [];

	for (var k = 0; k < botData.length; k++) {
		do {
			botData[k].x = Math.floor(Math.random()*arenaSize);
			botData[k].y = Math.floor(Math.random()*arenaSize);
		}
		while (previous_x.indexOf(botData[k].x) >= 0 || previous_y.indexOf(botData[k].y) >= 0)

		previous_x.push(botData[k].x);
		previous_y.push(botData[k].y);

		botData[k].colour = CSS_COLOR_NAMES[k];
		botData[k].uid = k+1;
		botData[k].eliminated = false;

		grid[botData[k].x][botData[k].y] = botData[k].uid;
	}

	updateBoard();
	drawGrid();
	drawBots();
}

function addNewBot() {
	botName = document.getElementById("newBotNameInput").value;
	eval("botFunction = "+document.getElementById("newBotCodeInput").value);

	stopGame();

	botData.push({
		name: botName,
		func: botFunction
	});

	initialise();
	runGame();
}

document.addEventListener("DOMContentLoaded", function(event) {
    initialise();
 });