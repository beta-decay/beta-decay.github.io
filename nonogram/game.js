var grid = [[]]

var player_grid = [[]];

var boardSize = 10;

function checkGame() {
	var check_grid = [];

	for (var x = 0; x < boardSize; x++) {
		check_grid.push([]);

		for (var y = 0; y < boardSize; y++) {
			if (player_grid[x][y] != 1) {
				check_grid[x].push(0);
			} else {
				check_grid[x].push(1);
			}
		}
	}

	if (JSON.stringify(check_grid) == JSON.stringify(grid)) {
		alert("You're correct!");
	} else {
		alert("Incorrect. Keep trying!");
	}
}

function drawGrid() {
	// Get canvas and context
	var canvas = document.getElementById("gridCanvas");

	canvas.width = boardSize*30;
	canvas.height = canvas.width;

	var ctx = canvas.getContext("2d");
	
	// Draw vertical lines
	for (var x = 0; x < canvas.width; x+=30) {
		ctx.beginPath();
		ctx.strokeStyle = x%150==0&&x>0?"#00F":"#777";
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
		ctx.closePath();
	}

	// Draw horizontal lines
	for (var y = 0; y < canvas.height; y+=30) {
		ctx.beginPath();
		ctx.strokeStyle = y%150==0&&y>0?"#00F":"#777";
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
		ctx.closePath();
	}

	// Draw the squares
	for (var x = 0; x < boardSize; x++) {
		for (var y = 0; y < boardSize; y++) {
			var square = player_grid[x][y];

			if (square > 0) {
				// Color squares
				ctx.beginPath();
				ctx.fillStyle = (square == 1)?"#00A":"#A00";

				ctx.fillRect(x*30+1, y*30+1, 28, 28);
				ctx.closePath();
			}
		}
	}
}

function generateClues() {
	document.getElementById("horizontalClues").innerHTML = "";
	document.getElementById("verticalClues").innerHTML = "";

	// Generate horizontal clues
	for (var y = 0; y < boardSize; y++) {
		horizontal_clues = [0];

		for (var x = 0; x < boardSize; x++) {
			if (grid[x][y] == 1) {
				horizontal_clues[horizontal_clues.length - 1] += 1;
			} else if (horizontal_clues[horizontal_clues.length - 1] > 0) {
				horizontal_clues.push(0);
			}
		}

		if (horizontal_clues[horizontal_clues.length - 1] == 0) {
			horizontal_clues.pop();
		}

		document.getElementById("horizontalClues").innerHTML += "<li>"+horizontal_clues.join(" ")+"</li>";
	}

	// Generate vertical clues
	for (var x = 0; x < boardSize; x++) {
		vertical_clues = [0];

		for (var y = 0; y < boardSize; y++) {
			if (grid[x][y] == 1) {
				vertical_clues[vertical_clues.length - 1] += 1;
			} else if (vertical_clues[vertical_clues.length - 1] > 0) {
				vertical_clues.push(0);
			}
		}

		if (vertical_clues[vertical_clues.length - 1] == 0) {
			vertical_clues.pop();
		}

		document.getElementById("verticalClues").innerHTML += "<li>"+vertical_clues.join(" ")+"</li>";
	}
}

function printGrid() {
	console.log(JSON.stringify(player_grid));
}

function generateGame() {
	boardSize = document.getElementById("boardSizeInput").value;
	
	grid = [];
	player_grid = [];

	// Generate the grid
	for (var x = 0; x < boardSize; x++) {
		grid.push([]);
		player_grid.push([])

		for (var y = 0; y < boardSize; y++) {
			grid[x].push(Math.round(Math.random()));
			player_grid[x].push(0);
		}
	}

	drawGrid();
	generateClues();
}

function loadSavedGame() {
	boardSize = document.getElementById("boardSizeSelect").value;
	var gridNumber = document.getElementById("gridNumberSelect").value;

	grid = savedGrids[boardSize][gridNumber-1];
	player_grid = [];

	// Generate the grid
	for (var x = 0; x < boardSize; x++) {
		grid.push([]);
		player_grid.push([])

		for (var y = 0; y < boardSize; y++) {
			grid[x].push(Math.round(Math.random()));
			player_grid[x].push(0);
		}
	}

	drawGrid();
	generateClues();
}

function revealAnswer() {
	player_grid = JSON.parse(JSON.stringify(grid));

	drawGrid();
}

function clearGrid() {
	for (var x = 0; x < boardSize; x++) {
		for (var y = 0; y < boardSize; y++) {
			player_grid[x][y] = 0;
		}
	}

	drawGrid();
}

function on_canvas_click(ev) {
	var canvas = document.getElementById("gridCanvas");

    var x = ev.clientX - canvas.getBoundingClientRect().left;
    var y = ev.clientY - canvas.getBoundingClientRect().top;

    // Find square
    var x_grid = Math.floor(x/30);
    var y_grid = Math.floor(y/30);

    player_grid[x_grid][y_grid] = (player_grid[x_grid][y_grid] + 1) % 3;

    drawGrid();
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('gridCanvas').addEventListener('click', on_canvas_click, false);

	generateGame();
});