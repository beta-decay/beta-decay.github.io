var grid = [];
var arenaSize = botData.length * 3;
var maxRounds = 2000;
var maxGames = 10000;
var turnNumber = 1;
var gameNumber = 1;
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
			if (!botData[j].eliminated) {
				botData[j].noEliminated += 1;
			}

			botData[j].eliminated = true;
		}
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

function findTournamentWinner() {
	var winsArray = [];

	for (var n = 0; n < botData.length; n++) {
		winsArray.push(botData[n].noWins);	
	}

	var maxWins = Math.max.apply(null, winsArray);
	
	var message = "";
	var end = " wins!"
	for (var i = 0; i < botData.length; i++) {
		if (botData[i].noWins == maxWins) {
			var name = botData[i].name;


			if (message.length == 0) {
				message += name;
			} else {
				message += " and " + name;
				end = " win!";
			}
		}
	}

	message += end;

	document.getElementById("gameNumber").innerHTML += " - "+message;
}

function findWinner() {
	var count_array = findArea();

	for (var n = 0; n < count_array.length; n++) {
		if (count_array[n] === undefined) {
			count_array[n] = 0;
		}
	}

	var maxArea = Math.max.apply(null, count_array);
	
	
	for (var i = 0; i < count_array.length; i++) {
		if (count_array[i] == maxArea && !botData[i].eliminated) {
			botData[i].noWins += 1;
		}
	}
}

function removeBot(id) {
	botData.splice(id-1, 1);
	initialise();
}

function updateBoard() {
	document.getElementById("playerTable").innerHTML = "<tr><td style=\"font-size: 1.5em;font-weight: bold;background-color:#9e9e9e;color:black\">Player Name</td><td style=\"font-size: 1.5em;font-weight: bold;background-color:#9e9e9e;color:black\">No. Wins</td><td style=\"font-size: 1.5em;font-weight: bold;background-color:#9e9e9e;color:black\">No. Eliminated</td></tr>";

	var botData_copy = JSON.parse(JSON.stringify(botData));

	botData_copy.sort(function(a,b) {
		return b.noWins - a.noWins;
	});

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

	for (var k = 0; k < botData_copy.length; k++) {
		document.getElementById("playerTable").innerHTML += "<tr><td><span style=\"font-size: 1.5em;font-weight: bold;\">"+ botData_copy[k].name + "</span></td><td><span style=\"font-size: 1.5em;font-weight: bold;\">" + botData_copy[k].noWins + "</span></td><td><span style=\"font-size: 1.5em;font-weight: bold;\">"+botData_copy[k].noEliminated+"</span></td><td><button onclick=\"javascript:removeBot("+botData_copy[k].uid+")\">Remove Bot</button></td></tr>";
	}
}

function doStuff() {
	turnNumber = 1;
	while (turnNumber <= maxRounds) {
		runBots();
		turnNumber++;
	}

	findWinner();
	updateBoard();
}

function runGame() {
	maxRounds = document.getElementById("gameInput").value;

	doStuff();
}

function runTournament() {
	if (!running) {
		running = true;
		maxGames = document.getElementById("tournamentInput").value;
		gameNumber = 0;
		interval = setInterval(function() { 
			gameNumber++;

			if (gameNumber == maxGames) {
				running = false;
				clearInterval(interval);
			}

			localStorage.clear();
			document.getElementById("gameNumber").innerHTML = gameNumber;


			botData = botData.shuffle();

			grid = [];

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

				botData[k].uid = k+1;
				botData[k].eliminated = false;

				grid[botData[k].x][botData[k].y] = botData[k].uid;
			}

			runGame();

			updateBoard();

			if(gameNumber == maxGames) {
				findTournamentWinner();
			}
		}, 0);
	}
}

function stopTournament() {
	running = false;
	clearInterval(interval);
}

function initialise() {
	localStorage.clear();

	gameNumber = 0;
	document.getElementById("gameNumber").innerHTML = gameNumber;

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

		botData[k].uid = k+1;
		botData[k].eliminated = false;

		botData[k].noWins = 0;
		botData[k].noEliminated = 0;

		grid[botData[k].x][botData[k].y] = botData[k].uid;
	}

	updateBoard();
}

function addNewBot() {
	botName = document.getElementById("newBotNameInput").value;
	eval("botFunction = "+document.getElementById("newBotCodeInput").value);

	stopTournament();

	botData.push({
		name: botName,
		func: botFunction
	});

	initialise();
	runTournament();
}

document.addEventListener("DOMContentLoaded", function(event) {
    initialise();
 });