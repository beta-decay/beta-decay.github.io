botData = [
	{
		name: "Random Moves",
		func: function(myself, grid, bots, gameInfo) {
    		return ["up","down","left","right"][Math.random() *4 |0]
		}
	}, {
		name: "Jim",
		func: function(myself, grid, bots, gameInfo) {
		  var mc = myself[0];
		  var mx = myself[1];
		  var my = myself[2];
		  var pastMoves, nowMoves;
		  var allowRetracing = false;
		  var output = null;
		  
		  // annoying localStorage
		  if (!localStorage.dzaima_pastMoves) {
		    pastMoves = new Array(10).fill("-1;0");
		    nowMoves = new Array(10).fill("-1;0");
		  } else {
		    pastMoves = JSON.parse(localStorage.dzaima_pastMoves);
		    nowMoves = JSON.parse(localStorage.dzaima_pastMoves);
		  }
		  nowMoves.push(mx+";"+my);
		  nowMoves.shift();
		  localStorage.dzaima_pastMoves = JSON.stringify(nowMoves);
		  
		  function log(...args) {
		    //console.log(...args);
		  }
		  
		  function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
		    //[mc, 0, col][Math.abs(mc-col) % 3];
		    res = Math.abs(mc-col) % 3;
		    return res==1? 0 : res==0? 1 : -1;
		  }
		  function bestOf (arr) {
		    if (arr.length == 0) return false;
		    var bestScore = -Infinity;
		    var bestPos;
		    for (var [x, y] of arr) {
		      let score = 0;
		      for (var [bcol, bx, by] of bots) {
		        let dist = Math.sqrt((x-bx)**2 + (y-by)**2);
		        let res = over(bcol);
		        let power = res==0? 1 : res==1? 0.4 : 1.4;
		        score+= power * dist;
		      }
		      
		      if (pastMoves.includes(x+";"+y)) score-= 1000000;
		      
		      if (score > bestScore) {
		        bestScore = score;
		        bestPos = [x,y];
		      }
		      // log([x,y], score);
		    }
		    if (bestScore < -500000) {
		      if (allowRetracing) log("RETRACING");
		      else return false;
		    }
		    output = to(bestPos);
		    return true;
		  }
		  function random(arr) {
		  	return arr[Math.floor(Math.random()*arr.length)];
		  }
		  function to([x, y]) {
		  	var rx = x-mx;
		  	var ry = y-my;
		  	if (rx >  0 && ry == 0) return "right";
		  	if (rx  < 0 && ry == 0) return "left";
		  	if (rx == 0 && ry  < 0) return "up";
		  	if (rx == 0 && ry >  0) return "down";
		  }
		  function inbounds([x, y]) {
		  	if (x<grid.length && y<grid.length && x>=0 && y>=0) return true;
		  	return false;
		  }
		  function get([x,y]) {
		    if (inbounds([x, y])) return grid[x][y];
		    return 0;
		  }
		  var orth = [[-1,0],[0,-1],[1,0],[0,1]];
		  
		  

		  var neighbors = orth
		    .map(([x,y])=>[x+mx, y+my])
		    .filter(c=>inbounds(c))
		    .map(c=>[c,get(c)]);
		  
		  
		  var best = neighbors.filter(([_, col]) => col == 0 || (col != mc && over(col) == 1));
		  if (bestOf(best.map(([pos, col]) => pos))) {
		    log("best of best");
		  	return output;
		  }
		  var okay = neighbors.filter(([_, col]) => over(col) == 0);
		  if (bestOf(okay.map(([pos, col]) => pos))) {
		    log("okay");
		    return output;
		  }
		  
		  
		  
		  for (let i = 1; i < grid.length; i++) {
		    if (i > 2) allowRetracing = true;
		    neighbors = orth
		      .map(([x, y]) => [x*i + mx, y*i + my])
		      .filter(c=>inbounds(c))
		      .map(c=>[c,get(c)]);
		    
		        
			  best = neighbors.filter(([_, col]) => col == 0 || (col != mc && over(col) == 1));
		    if (bestOf(best.map(([pos, col]) => pos))) {
		      log("best dist");
		      return output;
		    }
		    okay = neighbors.filter(([_, col]) => over(col) == 0);
		    if (bestOf(okay.map(([pos, col]) => pos))) {
		      log("okay dist");
		      return output;
		    }
		    
		  }
		}
	}, {
		name: "Borderline",
		func: function(myself, grid, bots, gameInfo) {
		    // Check if already on border
		    if (myself[1] == 0 || myself[1] == grid.length-1 || myself[2] == 0 || myself[2] == grid.length-1) {
		        // Move anticlockwise around the border
		        if (myself[1] == 0 && myself[2] != 0 && myself[2] != grid.length-1) {
		            return "down";
		        }
		        if (myself[1] == 0 && myself[2] == 0) {
		            return "down";
		        }

		        if (myself[2] == grid.length-1 && myself[1] != 0 && myself[1] != grid.length-1) {
		            return "right";
		        }
		        if (myself[1] == 0 && myself[2] == grid.length-1) {
		            return "right";
		        }

		        if (myself[1] == grid.length-1 && myself[2] != 0 && myself[2] != grid.length-1) {
		            return "up";
		        }
		        if (myself[1] == grid.length-1 && myself[2] == grid.length-1) {
		            return "up";
		        }

		        if (myself[2] == 0 && myself[1] != 0 && myself[1] != grid.length-1) {
		            return "left";
		        }
		        if (myself[1] == grid.length-1 && myself[2] == 0) {
		            return "left";
		        }
		    } else {
		        // Find the nearest border and move to it
		        if (myself[1] <= grid.length-1 - myself[1]) {
		            // Move to left border
		            return "left";
		        } else {
		            // Move to right border
		            return "right";
		        }
		    }
		}
	}, {
		name: "Candy Button",
		func: function(myself, grid, bots, gameInfo) {
		var mc = myself[0];
		var mx = myself[1];
		var my = myself[2];

		if(mx==grid.length-1 && my<grid.length-1) return "down";
		if(my==grid.length-1 && mx>0) return "left";
		if(mx==0 && my>0) return "up";
		if(mx==0 && my==0) return "right";
		if(mx%2){
		    if(my<grid.length-2) return "down";
		    return "right";
		}
		if(my>0) return "up"
		return "right";
		}
	}, {
		name: "Near Sighted Greed",
		func: function(myself, grid, bots, gameInfo) {
		    let ret = [];
		    let col = myself[0];
		    let myX = myself[1];
		    let myY = myself[2];

		    if(grid[myX][myY] != col){
		        return "wait";
		    }
		    if(myX != 0 && grid[myX-1][myY] != col){
		        ret.push("up")
		    }
		    if(myX != grid.length-1 && grid[myX+1][myY] != col){
		        ret.push("down")
		    }
		    if(myY != 0 && grid[myX][myY-1] != col){
		        ret.push("left")
		    }
		    if(myY != grid[0].length && grid[myX][myY+1] != col){
		        ret.push("rigth")
		    }
		    return ret[Math.random() * ret.length|0]
		}
	}, {
		name: "Random Filler",
		func: function([id, x, y], grid, bots, gameInfo) {
		    let painted = {
		        un: [],
		        other: [],
		        me: [],
		    };
		    let whose = n => n ? n == id || Math.abs(id - n) % 3 > 1 ? "me" : "other" : "un";
		    if (x > 0) painted[whose(grid[x - 1][y])].push("left");
		    if (y > 0) painted[whose(grid[x][y - 1])].push("up");
		    if (x + 1 < grid.length) painted[whose(grid[x + 1][y])].push("right");
		    if (y + 1 < grid[x].length) painted[whose(grid[x][y + 1])].push("down");
		    let moves = painted.un.length ? painted.un : grid[x][y] ? painted.other.length ? painted.other : painted.me : ["wait"];
		    let move = moves[Math.random() * moves.length | 0];
		    return move;
		}
	}, {
		name: "The Bot That Paints The Board",
		func: function (me, board, painters, info) {
		    let id = me[0], meX = me[1], meY = me[2], size = board.length, round = info[0], end = info[1], i;

		    let getDistance = function (x1, y1, x2, y2) {
		        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
		    };

		    let getColorValue = function (color) {
		        if (color === 0) return 2;
		        if (color === id) return 0;
		        return 2 - (Math.abs(id - color) % 3);
		    };

		    let getScore = function (x, y) {
		        let score = 0, paintersLength = painters.length;

		        for (let bX = 0; bX < size; bX++) {
		            for (let bY = 0; bY < size; bY++) {
		                let distance = getDistance(x, y, bX, bY);
		                let colorValue = getColorValue(board[bX][bY]);
		                score += (colorValue / (distance / 4)) * (distance === 1 ? 3 : 1);
		            }
		        }

		        for (let i = 0; i < paintersLength; i++) {
		            let pId = painters[i][0], pX = painters[i][1], pY = painters[i][2];
		            if (pId === id) continue;
		            let pDistance = getDistance(x, y, pX, pY);
		            let pIdValue = getColorValue(pId);
		            score -= (pIdValue / (pDistance / 2)) / 4;
		        }

		        return score;
		    };

		    let possibleMoves = [{x: 0, y: 0, c: 'wait'}];
		    if (meX > 0) possibleMoves.push({x: -1, y: 0, c: 'left'});
		    if (meY > 0) possibleMoves.push({x: -0, y: -1, c: 'up'});
		    if (meX < size - 1) possibleMoves.push({x: 1, y: 0, c: 'right'});
		    if (meY < size - 1) possibleMoves.push({x: 0, y: 1, c: 'down'});

		    let topCommand, topScore = null;
		    for (i = 0; i < possibleMoves.length; i++) {
		        let score = getScore(meX + possibleMoves[i].x, meY + possibleMoves[i].y);
		        if (topScore === null || score > topScore) {
		            topScore = score;
		            topCommand = possibleMoves[i].c;
		        }
		    }

		    return topCommand;
		}
	}
]