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
	}
]