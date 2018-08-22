botData = [
  {
    "name": "Jack",
    "func": function (myself, grid, bots, gameInfo) {
    var col = myself[0];
    var myX = myself[1];
    var myY = myself[2];

    var notPreferred = [];

    var move = "wait";
    if(grid[myX][myY] != col){
        var go = checkMove(move, grid[myX][myY]);
        if(go) {
            if(go == "notPreferred") {
                //notPreferred.push(move);
            } else {
                nextMove(move, "standard");
                return move;
            }
        }
    }

    move = "left";
    if(myX > 0 && grid[myX-1][myY] != col){
        var go = checkMove(move, grid[myX-1][myY]);
        if(go) {
            if(go == "notPreferred") {
                notPreferred.push(move);
            } else {
                nextMove(move, "standard");
                return move;
            }
        }
    }

    move = "right";
    if(myX < grid.length-1 && grid[myX+1][myY] != col){
        var go = checkMove(move, grid[myX+1][myY]);
        if(go) {
            if(go == "notPreferred") {
                notPreferred.push(move);
            } else {
                nextMove(move, "standard");
                return move;
            }
        }
    }

    move = "up";
    if(myY > 0 && grid[myX][myY-1] != col){
        var go = checkMove(move, grid[myX][myY-1]);
        if(go) {
            if(go == "notPreferred") {
                notPreferred.push(move);
            } else {
                nextMove(move, "standard");
                return move;
            }
        }
    }

    move = "down";
    if(myY < grid[0].length && grid[myX][myY+1] != col){
        var go = checkMove(move, grid[myX][myY+1]);
        if(go) {
            if(go == "notPreferred") {
                notPreferred.push(move);
            } else {
                nextMove(move, "standard");
                return move;
            }
        }
    }

    if(notPreferred[0]) {
        nextMove(notPreferred[0], "notPreferred");
        return notPreferred[0];
    }
    var r = ["up","down","left","right"][Math.random() *4|0];
    nextMove(r, "random");
    return r;

    function checkMove(move, currentColor) {
        var go = false;
        if(currentColor === 0) {
            go = true;
        } else {
            var z = [col, 0, currentColor][Math.abs(col - currentColor)%3]
            go = z == 0 ? "notPreferred" : z != currentColor;
        }

        if(go) {
            if(localStorage.nextMoveShouldNotBe && localStorage.nextMoveShouldNotBe == move) {
                return false;
            }
        }
        return go;
    }

    function nextMove(move, message) {
        var oppositeMove = "wait";
        if(move == "left") {
            oppositeMove = "right";
        } else if(move == "right") {
            oppositeMove = "left";
        } else if(move == "up") {
            oppositeMove = "down";
        } else if(move == "down") {
            oppositeMove = "up";
        }
        localStorage.nextMoveShouldNotBe = oppositeMove;
    }
}
  },
  {
    "name": "Fuzzy Guy",
    "func": function(myself, grid, bots, gameInfo) {
    var i,j,x,y = 0;
    this.answerToLifeTheUniverseAndEverything = 42;
    this.round = gameInfo[0];
    this.coloringStruggle = [];
    this.myColor = myself[0];
    this.botCount = bots.length;
    this.sizeOfGrid = grid.length;
    this.storageName = 'm53kp1of6igcnpsq';
    this.distances = {up: 0, right: 0, down: 0, left: 0};
    this.foodSmell = {up: 0, right: 0, down: 0, left: 0};
    this.botSmell = {up: 0, right: 0, down: 0, left: 0};
    this.botPredictedSmell = {up: 0, right: 0, down: 0, left: 0};
    this.directionPoints = {up: 0, right: 0, down: 0, left: 0};

    this.blockedMoves = function() {
        var blocked = [];
        if(myself[1] == 0) {
            blocked.push('left');
        }
        if(myself[2] == 0) {
            blocked.push('up');
        }
        if(myself[1] == this.sizeOfGrid - 1) {
            blocked.push('right');
        }
        if(myself[2] == this.sizeOfGrid - 1) {
            blocked.push('down');
        }

        return blocked;
    }

    this.getDistance = function(x1,y1) {
        return [Math.abs(myself[1]-x1), Math.abs(myself[2]-y1)];
    }

    this.finddeliciousDirection = function() {
        for (x = 0; x < this.sizeOfGrid; x++) {
            for (y = 0; y < this.sizeOfGrid; y++) {
                if (y < myself[2]) {
                    this.foodSmell.up+= ((1.9 - this.coloringStruggle[x][y]) / this.getDistance(x, y).reduce((a, b) => a + b, 0)) / 4;
                }
                if (y > myself[2]) {
                    this.foodSmell.down+= ((1.9 - this.coloringStruggle[x][y]) / this.getDistance(x, y).reduce((a, b) => a + b, 0)) / 4;
                }
                if (x < myself[1]) {
                    this.foodSmell.left+= ((1.9 - this.coloringStruggle[x][y]) / this.getDistance(x, y).reduce((a, b) => a + b, 0)) / 4;
                }
                if (x > myself[1]) {
                    this.foodSmell.right+= ((1.9 - this.coloringStruggle[x][y]) / this.getDistance(x, y).reduce((a, b) => a + b, 0)) / 4;
                }
            }
        }
    }

    this.predictFuture = function(x0,y0,x1,y1) {
        var xMovement = x1-x0;
        var yMovement = y1-y0;
        var xAfter2Turns = x1 + xMovement * 2;
        var yAfter2Turns = y1 + yMovement * 2;
        var hitsWall = [1, 1];

        if (xMovement == 1) {
            hitsWall = [2, 1]
        } else if (xMovement == -1) {
            hitsWall = [0, 1]
        } else if (yMovement == 1) {
            hitsWall = [1, 2]
        } else if (yMovement == -1) {
            hitsWall = [1, 0]
        } else {
            hitsWall = [1, 1]
        }

        if (xAfter2Turns < 0) {
            xAfter2Turns = 0;
        } else if (xAfter2Turns >= this.sizeOfGrid) {
            xAfter2Turns = this.sizeOfGrid -1;
        }


        if (yAfter2Turns < 0) {
            yAfter2Turns = 0;
        } else if (yAfter2Turns >= this.sizeOfGrid) {
            yAfter2Turns = this.sizeOfGrid -1;
        }

        return [xAfter2Turns, yAfter2Turns, hitsWall];
    }

    this.findCloseBots = function() {
        var prevPositions;
        var currentBot;
        var future;
        if (this.round > 1) {
            prevPositions = JSON.parse(localStorage.getItem(this.storageName));
        }

        for (i = 0; i < bots.length; i++) {
            if (bots[i][2] < myself[2]) {
                this.botSmell.up+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0)) + 0.333 / this.getDistance(bots[i][1], bots[i][2])[1];
            }
            if (bots[i][2] > myself[2]) {
                this.botSmell.down+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0)) + 0.333 / this.getDistance(bots[i][1], bots[i][2])[1];
            }
            if (bots[i][1] < myself[1]) {
                this.botSmell.left+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0)) + 0.333 / this.getDistance(bots[i][1], bots[i][2])[0];
            }
            if (bots[i][1] > myself[1]) {
                this.botSmell.right+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0)) + 0.333 / this.getDistance(bots[i][1], bots[i][2])[0];
            }

            if (this.round > 1) {
                currentBot = prevPositions.find(function(element) {
                    return element[0] == bots[i][0];
                });

                if (currentBot[0] != this.myColor) {
                    future = this.predictFuture(currentBot[1], currentBot[2], bots[i][1], bots[i][2]);
                    if (future[1] < myself[2]) {
                        this.botPredictedSmell.up+= 3.14159 / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[1] > myself[2]) {
                        this.botPredictedSmell.down+= 3.14159 / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[0] < myself[1]) {
                        this.botPredictedSmell.left+= 3.14159 / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[0] > myself[1]) {
                        this.botPredictedSmell.right+= 3.14159 / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }

                    if (future[2][0] == 0) {
                        this.botPredictedSmell.left+=0.314159;
                    }
                    if (future[2][0] == 2) {
                        this.botPredictedSmell.right+=0.314159;
                    }
                    if (future[2][1] == 0) {
                        this.botPredictedSmell.up+=0.314159;
                    }
                    if (future[2][1] == 2) {
                        this.botPredictedSmell.down+=0.314159;
                    }
                }
            }
        }

        localStorage.setItem(this.storageName, JSON.stringify(bots));
    }


    this.calculateColoringStruggle = function() {
        for (x = 0; x < this.sizeOfGrid; x++) {
            var yAxis = [];
            for (y = 0; y < this.sizeOfGrid; y++) {
                if (this.myColor == grid[x][y]) {
                    yAxis[y] = 2;
                } else if (grid[x][y] == 0) {
                    yAxis[y] = 0;
                }
                else {
                    yAxis[y] = [0, 1, 2][Math.abs(this.myColor - grid[x][y])%3];
                }
            }
            this.coloringStruggle.push(yAxis);
        }
    }

    this.getEmptySlotsInDirection = function() {

        for (x = (myself[1] + 1); x < this.sizeOfGrid; x++) {
            if (grid[x][myself[2]] == 0) {
                this.distances.right = (x-myself[1]) * 1.23456789;
            } else {
                if (x-myself[1]-1 == 0) {
                    this.distances.right = 0;
                }
                break;
            }
        }
        for (y = (myself[2] + 1); y < this.sizeOfGrid; y++) {
            if (grid[myself[1]][y] == 0) {
                this.distances.down = (y-myself[2]) * 1.23456789;
            } else {
                if (y-myself[2]-1 == 0) {
                    this.distances.down = 0;
                }
                break;
            }
        }
        for (x = (myself[1] - 1); x > -1; x--) {
            if (grid[x][myself[2]] == 0) {
                this.distances.left = (myself[1]-x) * 1.23456789;
            } else {
                if (myself[1]-x-1 == 0) {
                    this.distances.left = 0;
                }
                break;
            }
        }
        for (y = (myself[2] - 1); y > -1; y--) {
            if (grid[myself[1]][y] == 0) {
                this.distances.up = (myself[2]-y) * 1.23456789;
            } else {
                if (myself[2]-y-1 == 0) {
                    this.distances.up = 0;
                }
                break;
            }
        }
    }
    this.getBestDistance = function() {
        var max = -999, maxDir = 'up';
        for (var property in this.distances) {
            if (this.distances.hasOwnProperty(property)) {
                this.directionPoints[property] = (this.distances[property] + this.foodSmell[property] - this.botSmell[property] - this.botPredictedSmell[property]);
                if (this.directionPoints[property] > max && this.blockedMoves().indexOf(property) == -1) {
                    max = this.directionPoints[property];
                    maxDir = property;
                }
            }
        }

        return maxDir;
    };

    this.findCloseBots();
    this.calculateColoringStruggle();
    this.getEmptySlotsInDirection();
    this.finddeliciousDirection();
    return(this.getBestDistance());
}
  },
  {
    "name": "Territorial",
    "func": function (myself, grid, bots, gameInfo) {
        const w = 6, h = 6;
        let my_c = myself[0], my_x = myself[1], my_y = myself[2], size = grid.length, roundnum = gameInfo[0];

        let getDistance = function (x1, y1, x2, y2) {
            return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
        };

        let getColorValue = function (color) {
            if (color === 0) {
                return my_c;
            }
            return [my_c, 0, color][Math.abs(my_c - color) % 3];
        };

        //Choosing closest corner to defend
        const topLeft = [0, 0], bottomLeft = [0, size - 1], topRight = [size - 1, 0], bottomRight = [size - 1, size - 1];

        var distanceToTopLeft = getDistance(my_x, my_y, topLeft[0], topLeft[1]);
        var distanceToTopRight = getDistance(my_x, my_y, topRight[0], topRight[1]);
        var distanceToBottomLeft = getDistance(my_x, my_y, bottomLeft[0], bottomLeft[1]);
        var distanceToBottomRight = getDistance(my_x, my_y, bottomRight[0], bottomRight[1]);

        var nearestCorner = Math.min(distanceToTopLeft, distanceToTopRight, distanceToBottomLeft, distanceToBottomRight);

        //And save it
        if (!localStorage.territorial) {
            if (nearestCorner === distanceToTopLeft) {
                //console.log('nearest corner is: topLeft');
                var offset_x = topLeft[0];
                var offset_y = topLeft[1];
                var innermostCorner_x = topLeft[0] + w - 1;
                var innermostCorner_y = topLeft[1] + h - 1;
            } else if (nearestCorner === distanceToTopRight) {
                //console.log('nearest corner is: topRight');
                var offset_x = topRight[0] - (w - 1);
                var offset_y = topRight[1];
                var innermostCorner_x = offset_x;
                var innermostCorner_y = topRight[1] + h - 1;
            } else if (nearestCorner === distanceToBottomLeft) {
                //console.log('nearest corner is: bottomLeft');
                var offset_x = bottomLeft[0];
                var offset_y = bottomLeft[1] - (h - 1);
                var innermostCorner_x = bottomLeft[0] + w - 1;
                var innermostCorner_y = offset_y;
            } else if (nearestCorner === distanceToBottomRight) {
                //console.log('nearest corner is: bottomRight');
                var offset_x = bottomRight[0] - (w - 1);
                var offset_y = bottomRight[1] - (h - 1);
                var innermostCorner_x = offset_x;
                var innermostCorner_y = offset_y;
            }
            localStorage.territorial = JSON.stringify([offset_x, offset_y, innermostCorner_x, innermostCorner_y]);
        }
        offsets = JSON.parse(localStorage.territorial);
        offset_x = offsets[0];
        offset_y = offsets[1];
        innermostCorner_x = offsets[2];
        innermostCorner_y = offsets[3];

        let targets = [];
        for (let grid_x = offset_x; grid_x < offset_x + w; grid_x++)
        {
            for (let grid_y = offset_y; grid_y < offset_y + h; grid_y++)
            {
                if (grid[grid_x][grid_y] !== my_c && getColorValue(grid[grid_x][grid_y]) !== grid[grid_x][grid_y])
                {
                    targets.push([grid_x, grid_y]);
                }
            }
        }

        let target = targets.pop();
        //If territory is safe, move to border nearest boardCenter
        if (target === undefined) {
            targets.push([innermostCorner_x, innermostCorner_y]);
            target = targets.pop();
        }

        if (target === undefined)
            return 'wait';
        if (target[0] > my_x)
            return 'right';
        if (target[0] < my_x)
            return 'left';
        if (target[1] > my_y)
            return 'down';
        if (target[1] < my_y)
            return 'up';

        return "wait";
    }
  },
  {
    "name": "Bob",
    "func": function(myself, grid, bots, gameInfo) {
  var [mc, mx, my] = myself;
  var output;
  var allowRetracing = false;

  var size = 3;
  var scoreboard = grid.map(column=>column.map(c=>c==mc? 0 : overMap(c, 2, 1, 0)));
  for (let [bc, bx, by] of bots) if (bc != mc) {log([bc,bx,by],[mc,mx,my]);
    scoreboard[bx][by] = -100;
    if (inbounds([bx-2, by])) scoreboard[bx-2][by] = -50;
    if (inbounds([bx+2, by])) scoreboard[bx+2][by] = -50;
    if (inbounds([bx, by-2])) scoreboard[bx][by-2] = -50;
    if (inbounds([bx, by+2])) scoreboard[bx][by+2] = -50;
  }

  function scoreOf (x, y) {
    let score = 0;
    for (let dx = -size; dx <= size; dx++) {
      let cx = dx + x;
      if (cx < 1 || cx >= grid.length-1) continue;
      for (let dy = -size; dy <= size; dy++) {
        let cy = dy + y;
        if (cy < 1 || cy >= grid.length-1) continue;
        score+= scoreboard[cx][cy];
      }
    }
    return score;
  }
  var storage = this;
  if (gameInfo[0] < 10) this.timer = 10000;
  function rescore() {
    storage.bestScore = -Infinity;
    var blur = scoreboard.map((column, x)=>column.map((c, y) => {
      let score = scoreOf(x, y);
      if (score > storage.bestScore) {
        storage.bestScore = score;
        storage.bestX = x;
        storage.bestY = y;
      }
      return score;
    }));
    storage.atBest = false;
    storage.timer = 0;
    log(blur);
  }
  if (this.timer > 200) rescore();

  if (grid[mx][my] == 0 && !bots.some(([col, bx, by])=> col != mc && bx==mx && by==my)) return "wait";


  // annoying localStorage
  if (!localStorage.dzaima_pastMoves) {
    pastMoves = ["-1;0"];
    nowMoves = new Array(30).fill("-1;0");
  } else {
    pastMoves = JSON.parse(localStorage.dzaima_pastMoves);
    nowMoves = JSON.parse(localStorage.dzaima_pastMoves);
  }
  nowMoves.push(mx+";"+my);
  nowMoves.shift();
  localStorage.dzaima_pastMoves = JSON.stringify(nowMoves);



  function log(...args) {
    // console.log(...args);
  }
  function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
    let res = Math.abs(mc-col) % 3;
    return res==1? 0 : res==0? 1 : -1;
  }
  function overMap(col, best, good, bad, mine = good) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
    let res = Math.abs(mc-col) % 3;
    return col == mc? mine : res==1? good : res==0? best : bad;
  }
  var iwin = col=>over(col) == 1;
  var zeroes = col=>over(col) == 0;
  function to([x, y]) {
    //debugger
    var LR = x > mx? [mx+1, my] : x < mx? [mx-1, my] : null;
    var UD = y > my? [mx, my+1] : y < my? [mx, my-1] : null;
    if (LR && UD) {
      var LRScore = overMap(LR, 2, 1, 0, 0);
      var UDScore = overMap(UD, 2, 1, 0, 0);
      if (LRScore == UDScore) return toPos([LR, UD][Math.random()>.5? 1 : 0])
      else if (LRScore > UDScore) return toPos(LR);
      else return toPos(UD);
    } else return toPos(LR || UD || [x, y]);
  }
  function toPos([x,y]) {
      if (x > mx) return "right";
      if (x < mx) return "left";
      if (y < my) return "up";
      if (y > my) return "down";
      return 'wait';
  }
  function inbounds([x, y]) {
    // if (x<grid.length && y<grid.length && x>=0 && y>=0) return true;
    if (x<grid.length-1 && y<grid.length-1 && x>=1 && y>=1) return true;
    return false;
  }
  function get([x,y]) {
    if (inbounds([x, y])) return grid[x][y];
    return 0;
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
    }
    if (bestScore < -500000) {
      if (allowRetracing) log("RETRACING");
      else return false;
    }
    output = to(bestPos);
    return true;
  }


  // log(x,this.bestX, y,this.bestY);
  var distToBest = Math.abs(this.bestX-mx) + Math.abs(this.bestY-my);
  if (this.atBest || distToBest < 10) {
    log("at best; collecting");
    this.atBest = true;
    var orth = [[-1,0],[0,-1],[1,0],[0,1]];
    var neighbors = orth
      .map(([x,y])=>[x+mx, y+my])
      .filter(c=>inbounds(c))
      .filter(([x,y])=>!bots.some(([bid, bx, by]) => bx==x && by==y))
      .map(c=>[c,get(c)]);

    var best = neighbors.filter(([_, col]) => col != mc && col != 0 && over(col) == 1);
    if (bestOf(best.map(([pos, col]) => pos))) {
      log("best");
      return output;
    }

    var good = neighbors.filter(([_, col]) => col == 0);
    if (bestOf(good.map(([pos, col]) => pos))) {
      log("good");
      return output;
    }

    var okay = neighbors.filter(([_, col]) => over(col) == 0);
    if (bestOf(okay.map(([pos, col]) => pos))) {
      log("okay");
      return output;
    }


    for (let i = 2; i < grid.length; i++) {
      if (i > 6) allowRetracing = true;
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


    return ['right','left','up','down'][Math.floor(Math.random()*4)];
  } else log("going to best");
  if (scoreOf(this.bestX, this.bestY) < this.bestScore/2 || distToBest > 20) rescore();

  return to([this.bestX, this.bestY]);
}
  },
  {
    "name": "AnnoyingLittleBrother",
    "func": function(myself, grid, bots, gameInfo) {          

  // Some paramters
  var brother_loop_length = 200; // For how long will we follow a brother?
  var brother_loop_count = 0;
  var brother_score = -1;          
  var brother_id = -1;  

  var saw_all_brothers_moves = false;
  var moves_i = 0;          
  var moves_to_follow = 5;      // How much moves will we follow?          
  var moves_saw = makeArray(moves_to_follow, 2, 0);

  var my_id = myself[0];
  var my_x = myself[1];
  var my_y = myself[2];
  var round = gameInfo[0];
  var end_round = gameInfo[1];
  var last_num_of_bots = 0;

  // console.log('-------------------------------');

  // Handle Storage 
  if(round === 1){ // First round  TODO Why start with round 2?

    brother_id = -1; // Choose a Big Brother randomly                         
    brother_loop_count = 10;// Refind after 10 rounds
    moves_i = 0;
    moves_saw = makeArray(moves_to_follow, 2, 0);
    // console.log(moves_saw);
    // console.log(encode_moves(moves_saw));

    localStorage.LB_moves_saw = encode_moves(moves_saw); 
    localStorage.LB_moves_i = moves_i;// Save it         
    localStorage.LB_brother_id = brother_id;// Save it            
    localStorage.LB_brother_loop_count = brother_loop_count; // Save it            
    localStorage.LB_saw_all_brothers_moves = saw_all_brothers_moves;

    // console.log('My ID: ' + my_id);
  }
  else{            
    moves_saw = decode_moves(localStorage.LB_moves_saw);            
    moves_i = localStorage.LB_moves_i;
    brother_id = parseInt(localStorage.LB_brother_id); 
    brother_loop_count = parseInt(localStorage.LB_brother_loop_count);
    saw_all_brothers_moves = (localStorage.LB_saw_all_brothers_moves === 'true');
    last_num_of_bots = parseInt(localStorage.LB_last_num_of_bots);
  }         

  // console.log('Round: '+round + ' , BLC: ' + brother_loop_count);     
  // console.log('Me: ' + my_x + ', ' + my_x);

  // Check if a bot was eliminated
  if(last_num_of_bots != bots.length){
    // A bot was elimitated. Just tell LittleBrother to search for a new brother
    brother_loop_count = 0;
    brother_id = -1;
    last_num_of_bots = bots.length;        
  }

  // Are we tired of this brother yet?
  if (brother_loop_count === 0){
    // Yes, we are            

    // Find highest scoring brother          
    var bot_scores = Array.apply(null, Array(bots.length+1)).map(Number.prototype.valueOf,0);
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid.length; y++) {
        bot_scores[grid[x][y]] += 1;    // Increase the score of the bot's who color this is
      }
    }  
    //console.log('Scores:');
    //console.log(bot_scores);
    for (var uid = 0; uid < bot_scores.length; uid++){
      if (bot_scores[uid]>brother_score && uid>0 && my_id!=uid){
        if (Math.abs(my_id - (uid))%3<2){// Will it be annoying to the brother?                  
          brother_score = bot_scores[uid];
          brother_id = uid-1;                  
        }
      }
    }

    // Start the brother follow count
    brother_loop_count = brother_loop_length;
    moves_i = 0;
    saw_all_brothers_moves = 0;
    // console.log('Now following brother: ' + brother_id);
    // console.log(bots[brother_id]);
  }

  // No, we will still follow him               
  brother_loop_count -= 1; // But only for so long            

  // Now do the actual following
  var aim_x = -1;
  var aim_y = -1;
  if (brother_id > -1){

       // console.log('Brother ID: ' + brother_id);
       // console.log('Brother Location: ' + bots[brother_id][1] + ', ' + bots[brother_id][2]);

    // Which point are we aiming for?            
    if(saw_all_brothers_moves === true){ // Did I see how my brother moves?

      //console.log('Footsteps:');
      //console.log(moves_saw);

      // Check if we are in his footsteps?
      var in_brothers_footsteps = false;
      for (var step = 0; step<moves_to_follow; step++){
        if ((moves_saw[step][0] == my_x) && ((moves_saw[step][1] == my_y))){
          in_brothers_footsteps = true;
          break;
        }
      }

      if(in_brothers_footsteps === true){
        // We are in his footsteps. Go to the next one!
        // console.log('We are following in brothers footsteps');
        step++; if (step >= moves_to_follow){step=0;}
        aim_x = moves_saw[step][0];aim_y = moves_saw[step][1];
      }
      else{
        // We are not in his footsteps, aim for the footsteps
        // console.log('We are moving to brothers trail');
        aim_x = 0; aim_y = 0;
        for (var step = 0; step<moves_to_follow; step++){// Calculate step's center of mass
           aim_x += moves_saw[step][0];aim_y += moves_saw[step][1];
        }                                
        aim_x /= moves_to_follow; aim_y /= moves_to_follow;
      }

    }
    else{
      // No, not yet. Just run towards him
      //console.log('Blindly running to brother');              
      aim_x = bots[brother_id][1];
      aim_y = bots[brother_id][2];
    }          
  }
  //console.log('My goal: [' + aim_x + ', ' + aim_y + ']');

  // Watch big brother's moves
  if(brother_id > - 1){
    moves_saw[moves_i][0] = bots[brother_id][1];
    moves_saw[moves_i][1] = bots[brother_id][2];            

    moves_i ++;
    if (moves_i===moves_to_follow){
      moves_i = 0; // Wrap counter for circular buffer

      // Have I seen enough of them?
      if(saw_all_brothers_moves === false){
        saw_all_brothers_moves = true;
        // console.log('Saw enough of big brothers steps now...')
      }
    }            
  }

  // Save updated variables
  localStorage.LB_moves_saw = encode_moves(moves_saw); 
  localStorage.LB_moves_i = moves_i;// Save it         
  localStorage.LB_brother_id = brother_id;// Save it            
  localStorage.LB_brother_loop_count = brother_loop_count; // Save it            
  localStorage.LB_saw_all_brothers_moves = saw_all_brothers_moves;
  localStorage.LB_last_num_of_bots = last_num_of_bots;

  // Finish function          
  if (brother_id < 0){ // If not following anybody, move randomly
    return ["up","down","left","right"][Math.random()*4|0];
  }
  else{
    // Following a big brother!
    // console.log('Move: ' + toPos([aim_x, aim_y]));
    return toPos([aim_x, aim_y]);
  }

  // Some functions to ease the load
  function toPos([x,y]) {
    var dx = x - my_x;
    var dy = y - my_y;
    if(Math.abs(dx)>Math.abs(dy)){
      if (x > my_x) return "right";
      if (x < my_x) return "left";
      if (y < my_y) return "up";
      if (y > my_y) return "down";
    }
    else{              
      if (y < my_y) return "up";
      if (y > my_y) return "down";
      if (x > my_x) return "right";
      if (x < my_x) return "left";
    }
    return 'wait';
  }
  function decode_moves(moves_str){            
    var moves_array = [];
    var moves_strs = moves_str.split(';');
    for (var i = 0; i<5; i++){         
      var splot = moves_strs[i].split(',');              
      moves_array[i] = [];
      moves_array[i][0] = parseInt(splot[0]);
      moves_array[i][1] = parseInt(splot[1]);
    }
    return moves_array;
  }
  function encode_moves(moves_array){
    var moves_str = "";
    for (var i = 0; i < moves_array.length; i++){              
      moves_str += moves_array[i][0] + ',' + moves_array[i][1];
      if (i < moves_array.length - 1){moves_str += ';';}              
    }
    return moves_str;
  }
  function makeArray(w, h, val) {
    var arr = [];
    for(i = 0; i < w; i++) {
      arr[i] = [];
      for(j = 0; j < h; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }
}
  },
  {
    "name": "NotSoDumbBot",
    "func": function(myself, grid, bots, gameInfo) {
  let myCol = myself[0];
  let myX = myself[1];
  let myY = myself[2];

  function getScore(x) {
    let score = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == x) {
          score++;
        }
      }
    }
    return score;
  }

  let myScoreHistory = {};
  if (localStorage.samYonnouMyScoreHistory) {
    myScoreHistory = JSON.parse(localStorage.samYonnouMyScoreHistory);
  }
  let myScore = getScore(myCol);
  myScoreHistory[gameInfo[0]] = myScore;
  localStorage.samYonnouMyScoreHistory = JSON.stringify(myScoreHistory);

  function isProbalyTrolled() {
    if (gameInfo[0] < bots.length * 2) {
      return false; // too early to tell
    }
    if (localStorage.samYonnouEvasiveActionsStarted && gameInfo[0] - parseInt(localStorage.samYonnouEvasiveActionsStarted, 10) > 8) {
      if (gameInfo[0] - parseInt(localStorage.samYonnouEvasiveActionsStarted, 10) > 13) {
        localStorage.samYonnouEvasiveActionsStarted = null;
      }
      return false; // we need to test if our evasive actions worked
    }
    for (let i = bots.length; i > 0; i--) {
      if (myScoreHistory[gameInfo[0] - i] < myScoreHistory[gameInfo[0] - i + 1]) {
        return false;
      }
    }
    return true;
  }

  function isTimeForAggression() {
    return myScore > bots.length * 8;
  }

  function isInferiorExplorer(x, y) {
    return grid[x][y] != myCol && Math.abs(grid[x][y] - myCol) % 3 == 0;
  }

  function isEnemyTerritory(x, y) {
    let enemyScore = getScore(x, y);
    return isTimeForAggression() && Math.abs(grid[x][y] - myCol) % 3 == 1 && enemyScore / myScore > 2;
  }

  function isRipeForExploration(x, y) {
    return (grid[x][y] == 0 || isInferiorExplorer(x, y));
  }

  function getExplorationPriority(x, y) {
    if (isInferiorExplorer(x, y)) {
      let inferiorExplorerScore = getScore(grid[x][y]);
      if (isTimeForAggression() && inferiorExplorerScore > myScore * 1.5) {
        // this explorer is a danger and needs to be knocked down a peg
        return inferiorExplorerScore;
      }
    }
    let closestBot = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < bots.length; i++) {
      if (bots[i][0] != myCol) {
        let distance = Math.abs(bots[i][1] - myX) + Math.abs(bots[i][2] - myY);
        if (distance < closestBot) {
          closestBot = distance;
        }
      }
    }
    // the farther away the closest bot is the better
    return -((2 * grid.length) - closestBot);
  }

  function selectPath(selectionFunction, adhereToDirectionBan) {
    let possiblePaths = [];
    let possiblePathPriority = [];

    if (myX > 0 && selectionFunction(myX - 1, myY)) {
      possiblePaths.push("left");
      possiblePathPriority.push(getExplorationPriority(myX - 1, myY));
    }
    if (myX < grid.length - 1 && selectionFunction(myX + 1, myY)) {
      possiblePaths.push("right");
      possiblePathPriority.push(getExplorationPriority(myX + 1, myY));
    }
    if (myY > 0 && selectionFunction(myX, myY - 1)) {
      possiblePaths.push("up");
      possiblePathPriority.push(getExplorationPriority(myX, myY - 1));
    }
    if (myY < grid[0].length - 1 && selectionFunction(myX, myY + 1)) {
      possiblePaths.push("down");
      possiblePathPriority.push(getExplorationPriority(myX, myY + 1));
    }

    let tryPickPath = possiblePaths.length > 0;
    while (tryPickPath) {
      tryPickPath = false;
      let selection = null;
      let chosenPathPriority = Number.MIN_SAFE_INTEGER;

      for (let i = 0; i < possiblePathPriority.length; i++) {
        if (possiblePathPriority[i] > chosenPathPriority) {
          selection = possiblePaths[i];
          chosenPathPriority = possiblePathPriority[i];
        }
      }
      if (adhereToDirectionBan && localStorage.samYonnouBannedDirection && selection == localStorage.samYonnouBannedDirection) {
        possiblePaths.splice(localStorage.samYonnouBannedDirection, 1);
        tryPickPath = possiblePaths.length > 0;
      } else {
        return selection;
      }
    }

    return null;
  }

  if (isProbalyTrolled()) {
    // we are likely being trolled, try to lose the troll by going close to another explorer the troll can target
    let closestDecoyDistance = Number.MAX_SAFE_INTEGER;
    let closestDecoy = null;
    let closestDecoyScore = 0;
    for (let i = 0; i < bots.length; i++) {
      if (bots[i][0] != myCol && Math.abs(bots[i][0] - myCol) % 3 == 0) {
        let distance = Math.abs(bots[i][1] - myX) + Math.abs(bots[i][2] - myY);
        if (distance > 1 && distance < closestDecoyDistance + 50) {
          let decoyScore = getScore(bots[i][0]);
          if (decoyScore > closestDecoyScore) {
            closestDecoyDistance = distance;
            closestDecoy = bots[i];
            closestDecoyScore = decoyScore;
          }
        }
      }
    }
    if (closestDecoy) {
      if (!localStorage.samYonnouEvasiveActionsStarted && closestDecoyDistance < 3) {
        localStorage.samYonnouEvasiveActionsStarted = JSON.stringify(gameInfo[0]);
      }
      localStorage.samYonnouBannedDirection = null;
      if (closestDecoy[1] > myX) {
        return "right";
      }
      if (closestDecoy[2] > myY) {
        return "down";
      }
      if (closestDecoy[1] < myX) {
        return "left";
      }
      if (closestDecoy[2] < myY) {
        return "up";
      }
    }
  }

  let selection = selectPath(isRipeForExploration, true);
  if (!selection) {
    selection = selectPath(isEnemyTerritory, true);
    if (!selection) {
      selection = selectPath(isRipeForExploration, false);
      if (!selection) {
        function findNewStart(selectionFunction) {
          let newStart = null;
          let bestDistance = Number.MAX_SAFE_INTEGER;

          for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
              if (selectionFunction(i, j)) {
                let distance = Math.abs(i - myX) + Math.abs(j - myY);
                if (distance > 1 && distance < bestDistance) {
                  newStart = [i, j];
                  bestDistance = distance;
                }
              }
            }
          }
          return newStart;
        }
        let newStart = findNewStart(isRipeForExploration);
        if (!newStart) {
          newStart = findNewStart(isEnemyTerritory);
          if (!newStart) {
            newStart = [(myX + 23) % grid.length, (myY + 23) % grid.length];
          }
        }

        if (newStart[0] > myX) {
          selection = "right";
        }
        if (newStart[1] > myY) {
          selection = "down";
        }
        if (newStart[0] < myX) {
          selection = "left";
        }
        if (newStart[1] < myY) {
          selection = "up";
        }
      }
    }
  }

  localStorage.samYonnouBannedDirection = (selection == "left") ? "right" : ((selection == "up") ? "down" : ((selection == "down") ? "up" : "left"));
  return selection;
}
  },
  {
    "name": "Boxer",
    "func": function(myself, grid, bots, gameInfo) {
    let val = gameInfo[0] % 16;
    if(val < 3){
        return "right";
    }else if(val < 6){
        return "up";
    }else if(val < 9){
        return "left";
    }else if(val < 12){
        return "down";
    }else if(val < 14){
        return ["up","down","left","right"][Math.random() *4 |0];
    }else{
        let xdist = myself[1];
        let ydist = myself[2];
        let xfardist = grid.length - 1 - myself[1];
        let yfardist = grid.length - 1 - myself[2];
        if(gameInfo[0] % 400 < 200){
            if (xdist < ydist && xdist < xfardist && xdist < yfardist){
                return "right";
            }else if (ydist < xfardist && ydist < yfardist){
                return "down";
            }else if (xfardist < yfardist){
                return "left";
            }else{
                return "up";
            }
        }else{
            if (xdist > ydist && xdist > xfardist && xdist > yfardist){
                return "right";
            }else if (ydist > xfardist && ydist > yfardist){
                return "up";
            }else if (xfardist > yfardist){
                return "left";
            }else{
                return "down";
            }
        }
    }
}
  },
  {
    "name": "Kneecapper",
    "func": function(myself, grid, bots, gameInfo) {
    let [myId, myX, myY] = myself;

    // Figure out who's doing well.
    let targets = bots.map(bot => bot[0]).filter(id => (id !== myId) && (Math.abs(id - myId) % 3 !== 2));
    let flatGrid = [].concat.apply([], grid);
    targets = targets.sort((a, b) => flatGrid.reduce((n, val) => n + (val === a) - (val === b), 0));

    let targetX, targetY;
    let targetScore = 0;
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            let dist = Math.abs(x - myX) + Math.abs(y - myY);
            let scariness = targets.indexOf(grid[x][y]) + 1;
            if (scariness === 0) { continue; }

            // Find a successful opponent who's not too far away.
            let score = scariness ** 1.5 / (dist + 1);
            if (score > targetScore) {
                targetX = x;
                targetY = y;
                targetScore = score;
            }
        }
    }

    // Move toward the target.
    if (targetX < myX) { return "left"; }
    if (targetX > myX) { return "right"; }
    if (targetY < myY) { return "up"; }
    if (targetY > myY) { return "down"; }
    return "wait";
}
  },
  {
    "name": "MC",
    "func": function(myself, grid, bots, gameInfo) {
    const W = grid.length, H = grid[0].length;
    const meIdx = bots.findIndex(b => b[0] == myself[0]);
    const meClr = bots[meIdx][0];

    function copy2D(a) {
        return a.map(l => l.slice());
    }

    function paintValue(gr, x, y, clr) {
        if (gr[x][y] == 0) return clr;
        else return [clr, 0, gr[x][y]][Math.abs(clr - gr[x][y]) % 3];
    }

    function paint(gr, x, y, clr) {
        gr[x][y] = paintValue(gr, x, y, clr);
    }

    function randomStep(gr, bt) {
        const lastDir = new Array(bt.length).fill(-1);

        for (let i = 0; i < bt.length; i++) {
            const b = bt[i];

            while (Math.random() < 0.95) {
                const dir = Math.random() * 4 | 0;
                if (dir == lastDir[i]) continue;

                switch (dir) {
                    case 0: if (b[1] < W-1) b[1]++; else continue; break;
                    case 1: if (b[2] < H-1) b[2]++; else continue; break;
                    case 2: if (b[1] > 0) b[1]--; else continue; break;
                    case 3: if (b[2] > 0) b[2]--; else continue; break;
                }
                break;
            }

            paint(gr, b[1], b[2], b[0]);
        }
    }

    function calcScore(gr, id) {
        let sc = 0;
        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                sc += gr[x][y] == id;
            }
        }
        return sc;
    }

    const dxes = [1, 0, -1, 0, 0], dyes = [0, 1, 0, -1, 0];
    const outputs = ["right", "down", "left", "up", "wait"];

    let maxscore = -1, maxat = -1;

    for (let i = 0; i < 5; i++) {
        const nx = bots[meIdx][1] + dxes[i];
        const ny = bots[meIdx][2] + dyes[i];
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;

        const grid2 = copy2D(grid);
        const bots2 = copy2D(bots);
        bots2[meIdx][1] = nx;
        bots2[meIdx][2] = ny;
        paint(grid2, nx, ny, meClr);

        let score = 0;

        for (let playouti = 0; playouti < 100; playouti++) {
            const grid3 = copy2D(grid2);
            const bots3 = copy2D(bots2);
            for (let si = 0; si < 5; si++) {
                randomStep(grid3, bots3);
            }

            score += calcScore(grid3, meClr);
        }

        if (score > maxscore) {
            maxscore = score;
            maxat = i;
        }
    }

    if (maxscore == -1) return outputs[Math.random() * 5 | 0];
    else return outputs[maxat];
}
  },
  {
    "name": "Euclid",
    "func": function euclidFn(myself, grid, bots, gameInfo) {
    const W = grid.length, H = grid[0].length;
    const meIdx = bots.findIndex(b => b[0] == myself[0]);
    const meClr = bots[meIdx][0];

    const botIdToIndex = {};
    for (let i = 0; i < bots.length; i++) {
        botIdToIndex[bots[i][0]] = i;
    }

    function paintValue(floor, clr) {
        if (floor == 0) return clr;
        else return [clr, 0, floor][Math.abs(clr - floor) % 3];
    }

    function paint(gr, x, y, clr) {
        gr[x][y] = paintValue(gr[x][y], clr);
    }

    function distance(x1, y1, x2, y2) {
        return Math.abs(y2 - y1) + Math.abs(x2 - x1);
    }

    function calcHeatmap() {
        const heat = new Array(W).fill(0).map(() => new Array(H).fill(0));

        function weight(dx, dy) {
            const d = dx + dy;
            return d < 3 ? 1 / (1 + d) : 0;
        }

        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                let s=0;
                for (let x2 = Math.max(x-3, 0); x2 <= Math.min(W-1, x+3); x2++) {
                    for (let y2 = Math.max(y-3, 0); y2 <= Math.min(H-1, y+3); y2++) {
                        if (grid[x2][y2] == meClr) {
                            s += weight(Math.abs(x2 - x), Math.abs(y2 - y));
                        }
                    }
                }
                heat[x][y] = s;
            }
        }

        return heat;
    }

    const heatmap = calcHeatmap();

    function scorePos(px, py) {
        let sc = 0;
        if (grid[px][py] != meClr && paintValue(grid[px][py], meClr) == meClr) {
            sc += 100;
        }

        let mindist = W + H + 1;
        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                if (grid[x][y] != meClr && paintValue(grid[x][y], meClr) == meClr) {
                    let d = distance(px, py, x, y);
                    if (d < mindist) mindist = d;
                }
            }
        }
        sc -= 3 * mindist;

        mindist = W + H + 1;
        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                if (grid[x][y] == largestBotId) {
                    let d = distance(px, py, x, y);
                    if (d < mindist) mindist = d;
                }
            }
        }
        sc -= 6 * mindist;

        sc -= 3 * heatmap[px][py];

        sc += Math.random();
        return sc;
    }

    function calcBotScores() {
        const res = new Array(bots.length).fill(0).map((_,i) => [bots[i][0], 0]);

        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                if (grid[x][y] > 0) {
                    let i = botIdToIndex[grid[x][y]];
                    if (i != undefined) res[i][1]++;
                }
            }
        }

        return res;
    }

    const botScores = calcBotScores();  // [id, size]
    const largestBotId = botScores
        .filter(p => p[0] != meClr && paintValue(p[0], meClr) == meClr)
        .sort((a,b) => b[1] - a[1])
        [0][0];

    const dxes = [1, 0, -1, 0, 0], dyes = [0, 1, 0, -1, 0];
    const outputs = ["right", "down", "left", "up", "wait"];

    let allscores = [];
    let maxscore = -Infinity, maxat = -1;

    let allowWait = grid[bots[meIdx][1]][bots[meIdx][2]] == 0;

    for (let i = 0; i < 4 + allowWait; i++) {
        const nx = bots[meIdx][1] + dxes[i];
        const ny = bots[meIdx][2] + dyes[i];
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
            allscores.push(null);
            continue;
        }

        let score = scorePos(nx, ny);
        if (i == 4) score -= 20;
        if (euclidFn.lastMove != undefined && i != euclidFn.lastMove) score -= 3;

        allscores.push(~~(score * 1000) / 1000);

        if (score > maxscore) {
            maxscore = score;
            maxat = i;
        }
    }

    // console.log([maxscore, maxat], allscores);

    let move = maxscore == -1 ? Math.random() * 5 | 0 : maxat;
    euclidFn.lastMove = move;

    return outputs[move];
}
  },
  {
    "name": "DFSBot",
    "func": function(myself, grid, bots, gameinfo) {
    my_id = myself[0];
    my_x = myself[1];
    my_y = myself[2];
    delta = [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]];
    seen = Array(grid.length).fill().map(() => Array(grid.length).fill(false)); 
    scores = Array(bots.length + 2).fill(0);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            scores[grid[i][j]]++;
        }
    }
    function search(x, y, depth) {
        if (depth == 11) {
            return [4, 0];
        }
        let max_score = 0;
        let best_move = 0;
        for (let i = 0; i < 4; i++) {
            let x1 = x + delta[i][0];
            let y1 = y + delta[i][1];
            if ((x1 < 0) || (x1 >= grid.length)) {
                continue;
            }
            if ((y1 < 0) || (y1 >= grid.length)) {
                continue;
            }
            if (seen[x1][y1]) {
                continue;
            }
            let n = 0;
            for (let j = 0; j < 4; j++) {
                if (Math.abs(i - j) == 1) {
                    continue;
                }
                let x2 = x1 + delta[j][0];
                let y2 = y1 + delta[j][1];
                if ((x2 < 0) || (x2 >= grid.length)) {
                    continue;
                }
                if ((y2 < 0) || (y2 >= grid.length)) {
                    continue;
                }
                if (grid[x2][y2] == my_id) {
                    n++;
                }
            }
            let prev = grid[x1][y1];
            if (prev == 0) {
                next = my_id;
            } else {
                next = [my_id, 0, prev][Math.abs(my_id - prev) % 3];
            }
            let score = 0;
            score += 1e-10 * (n + 0.1 * Math.random());
            if (next != prev) {
                if (next == my_id) {
                    score += 1;
                }
                if (prev == 0 || scores[prev] > scores[my_id]) {
                    score += 1e-6;    
                } 
            }
            grid[x1][y1] = next;
            seen[x1][y1] = true;
            let final_score = 0.05 * score + 0.95 * search(x1, y1, depth + 1)[1];
            seen[x1][y1] = false;
            grid[x1][y1] = prev;
            if (final_score > max_score) {
                max_score = final_score;
                best_move = i;
            }
        }
        return [best_move, max_score];
    }
    let best_move = search(my_x, my_y, 0)[0];
    return ["up", "down", "left", "right", "wait"][best_move];
}
  },
  {
    "name": "GiveMeSpace",
    "func": function(myself, grid, bots, gameInfo){
    if(!localStorage.givemespace){
        localStorage.givemespace = JSON.stringify({
            recent:[],
            timeout:-1,
            corner:[9999,-1,-1],
            following:[]
        });
    }
    var firstchoice = {up:-1,down:-1,left:-1,right:-1}, nearestblank = [9999,-1,-1], store = JSON.parse(localStorage.givemespace), unique = [], numunique = 0,
        currdist, i, j;
    if(store.timeout >= 0 && store.corner[1] >= 0 && store.corner[2] >= 0){
        store.timeout--;
        persiststorage(store);
        if(store.corner[2] < myself[2]){
            return 'up';
        }
        if(store.corner[2] > myself[2]){
            return 'down';
        }
        if(store.corner[1] < myself[1]){
            return 'left';
        }
        if(store.corner[1] > myself[1]){
            return 'right';
        }
    }
    if(store.recent.length == 20){
        for(i=0;i<store.recent.length;i++){
            if(unique.indexOf(store.recent[i][1]+"_"+store.recent[i][2]) == -1){
                unique.push(store.recent[i][1]+"_"+store.recent[i][2]);
                numunique++;
            }
        }
        if(numunique <= 6){
            store.recent = [];
            store.timeout = 10+numunique;
            store.corner = [[-1,0,0],[-1,0,bots.length*3-1],[-1,bots.length*3-1,0],[-1,bots.length*3-1,bots.length*3-1]][Math.random()*4|0];
            persiststorage(store);
        }
    }
    function dist(a,b){
        return Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
    }
    function finalcolor(a,b){
        return Math.abs(a-b)%3;
    }
    function persiststorage(store){
        if(store.recent.length > 20) store.recent = store.recent.slice(1);
        localStorage.givemespace = JSON.stringify(store);
    }
    store.recent.push(myself);
    persiststorage(store);
    if(myself[2] > 0 && myself[0] != grid[myself[1]][myself[2]-1] && (grid[myself[1]][myself[2]-1] == 0 || finalcolor(myself[0],grid[myself[1]][myself[2]-1]) == 0)){
        firstchoice.up = 9999;
    }
    if(myself[2] < bots.length*3-1 && myself[0] != grid[myself[1]][myself[2]+1] && (grid[myself[1]][myself[2]+1] == 0 || finalcolor(myself[0],grid[myself[1]][myself[2]+1]) == 0)){
        firstchoice.down = 9999;
    }
    if(myself[1] > 0 && myself[0] != grid[myself[1]-1][myself[2]] && (grid[myself[1]-1][myself[2]] == 0 || finalcolor(myself[0],grid[myself[1]-1][myself[2]]) == 0)){
        firstchoice.left = 9999;
    }
    if(myself[1] < bots.length*3-1 && myself[0] != grid[myself[1]+1][myself[2]] && (grid[myself[1]+1][myself[2]] == 0 || finalcolor(myself[0],grid[myself[1]+1][myself[2]]) == 0)){
        firstchoice.right = 9999;
    }
    if(firstchoice.up > 0 || firstchoice.down > 0 || firstchoice.left > 0 || firstchoice.right > 0){
        for(i=0;i<bots.length;i++){
            if(bots[i][0] != myself[0]){
                if(firstchoice.up > 0){
                    currdist = dist(bots[i],[0,myself[1],myself[2]-1]);
                    if(currdist < firstchoice.up){
                        firstchoice.up = currdist;
                    }
                }
                if(firstchoice.down > 0){
                    currdist = dist(bots[i],[0,myself[1],myself[2]+1]);
                    if(currdist < firstchoice.down){
                        firstchoice.down = currdist;
                    }
                }
                if(firstchoice.left > 0){
                    currdist = dist(bots[i],[0,myself[1]-1,myself[2]]);
                    if(currdist < firstchoice.left){
                        firstchoice.left = currdist;
                    }
                }
                if(firstchoice.right > 0){
                    currdist = dist(bots[i],[0,myself[1]+1,myself[2]]);
                    if(currdist < firstchoice.right){
                        firstchoice.right = currdist;
                    }
                }
            }
        }
        if(firstchoice.up >= firstchoice.down && firstchoice.up >= firstchoice.left && firstchoice.up >= firstchoice.right){
            return 'up';
        }
        else if(firstchoice.down >= firstchoice.left && firstchoice.down >= firstchoice.right){
            return 'down';
        }
        else if(firstchoice.left >= firstchoice.right){
            return 'left';
        }
        else{
            return 'right';
        }
    }
    for(i=0;i<bots.length*3;i++){
        for(j=0;j<bots.length*3;j++){
            if((i != myself[1] || j != myself[2]) && grid[i][j] != myself[0] && (grid[i][j] == 0 || finalcolor(myself[0],grid[i][j]) == 0)){
                currdist = dist(myself,[0,i,j]);
                if(currdist < nearestblank[0]){
                    nearestblank[0] = currdist;
                    nearestblank[1] = i;
                    nearestblank[2] = j;
                }
            }
        }
    }
    if(nearestblank[0] < 9999){
        if(nearestblank[2] < myself[2]){
            return 'up';
        }
        if(nearestblank[2] > myself[2]){
            return 'down';
        }
        if(nearestblank[1] < myself[1]){
            return 'left';
        }
        if(nearestblank[1] > myself[1]){
            return 'right';
        }
    }
    return ['up','down','left','right'][Math.random()*4|0];
}
  },
  {
    "name": "Smart Ant V4",
    "func": function(myself, grid, bots, gameInfo) {
    // Assign variables.
    let dest = {left: "left", right: "right", up: "up", down: "down", wait: "wait"};
    let deltas = {x: {left: -1, right: +1, up: 0, down: 0, wait: 0}, y: {left: 0, right: 0, up: -1, down: +1, wait: 0}};
    let [name, me, [rcurr, rmax], [gmin, gmax], blank] = ["Smart Ant V4", { c: myself[0], x: myself[1], y: myself[2] }, gameInfo, [0, grid.length - 1], 0];
    // Define local functions.
    function onEdge(pos, x = me.x, y = me.y) { // Returns true if on the edge.
        switch (pos) {
            case dest.left:  return x == gmin; break;
            case dest.right: return x == gmax; break;
            case dest.up:    return y == gmin; break;
            case dest.down:  return y == gmax; break;
            default: return x == gmin || x == gmax || y == gmin || y == gmax;
        }
    }
    function validXY(x, y) { // Validate coordinates.
        return (gmin <= x && gmin <= y && x <= gmax && y <= gmax);
    }
    function validMove(pos = db['curr_pos'], x = me.x, y = me.y) {
        return validXY(x + deltas.x[pos], y + deltas.y[pos]);
    }
    function toEdge(pos = db['curr_pos'], x = me.x, y = me.y) { // Returns true if the next move is towards the edge.
        return onEdge(pos, x + deltas.x[pos], y + deltas.y[pos]);
    }
    function turnLeft(pos = db['curr_pos']) { // Get the new direction after turning left.
        next = {left: dest.down, right: dest.up, up: dest.left, down: dest.right}; return next[pos];
    }
    function turnRight(pos = db['curr_pos']) { // Get the new direction after turning right.
        next = {left: dest.up, right: dest.down, up: dest.right, down: dest.left}; return next[pos];
    }
    function getColorAbs(x, y) { // Get color using absolute position.
        return validXY(x, y) ? grid[x][y] : -1;
    }
    function getColorRel(x, y) { // Get color using relative position.
        return getColorAbs(me.x + x, me.y + y);
    }
    function getColorDir(pos = db['curr_pos']) { // Get color at the direction.
        return getColorRel(deltas.x[pos], deltas.y[pos]);
    }
    function getNextColor(color) { // Predict the next color.
        return color == blank ? me.c : [me.c, 0, color][Math.abs(me.c - color) % 3];
    }
    function noBlanks(color) { // Returns true if no blank squares around.
        return Math.min(getColorDir(dest.left), getColorDir(dest.right), getColorDir(dest.up), getColorDir(dest.down)) > blank;
    }
    function isEdibleXY(x, y) { // Returns true if square is edible.
        return (getColorAbs(x, y) != me.c && getNextColor(getColorAbs(x, y)) != getColorAbs(x, y));
    }
    function isBotXY(bx = me.x, by = me.y) {
        return Object.keys(bots).map(function(key, index) {
            [c, x, y] = bots[key];
            return me.c != c && bx == x && by == y;
        });
    }
    function calcEdibleSq(pos = db['curr_pos'], mx = me.x, my = me.y) { // Calculate number of edible squares minus distance for the given direction.
        let [counter, penalty, x, y] = [0, 0, mx, my];
        while (validXY(x, y)) {
            [x, y, penalty] = [x + deltas.x[pos], y + deltas.y[pos], penalty + 1/gmax*2];
            if (isEdibleXY(x, y)) counter += Math.max(0, getColorAbs(x, y) == blank ? 1 - penalty : 1 - penalty/2);
            else if (getColorAbs(x, y) == me.c || isBotXY(x, y)) counter -= 1 - penalty;
        }
        return counter;
    }
    function getRandomDir() { // Get a random move.
        Object.values(dest)[Math.floor(Math.random() * Object.values(dest).length)]
    }
    function getLongestDir() { // Get the longest direction (away from the edges).
        return [me.x > gmax/2 ? dest.left : dest.right, me.y > gmax/2 ? dest.up : dest.down][Math.floor(Math.random() * 2)];
    }
    function getEdibleDir() { // Get direction based on number of edible squares.
        best_moves = []
        // Check current position.
        routes = [{left: calcEdibleSq(dest.left)}, {right: calcEdibleSq(dest.right)}, {up: calcEdibleSq(dest.up)}, {down: calcEdibleSq(dest.down)}]
            .sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        best_moves.push(routes[0]);
        // Check other 4 positions.
        pos = dest.left;
        routes = [
            {left: calcEdibleSq(dest.left, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {left: calcEdibleSq(dest.right, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {left: calcEdibleSq(dest.up, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {left: calcEdibleSq(dest.down, me.x + deltas.x[pos], me.y + deltas.y[pos])},
        ].sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        best_moves.push(routes[0]);
        pos = dest.right;
        routes = [
            {right: calcEdibleSq(dest.left, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {right: calcEdibleSq(dest.right, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {right: calcEdibleSq(dest.up, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {right: calcEdibleSq(dest.down, me.x + deltas.x[pos], me.y + deltas.y[pos])},
        ].sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        best_moves.push(routes[0]);
        pos = dest.up;
        routes = [
            {up: calcEdibleSq(dest.left, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {up: calcEdibleSq(dest.right, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {up: calcEdibleSq(dest.up, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {up: calcEdibleSq(dest.down, me.x + deltas.x[pos], me.y + deltas.y[pos])},
        ].sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        best_moves.push(routes[0]);
        pos = dest.down;
        routes = [
            {down: calcEdibleSq(dest.left, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {down: calcEdibleSq(dest.right, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {down: calcEdibleSq(dest.up, me.x + deltas.x[pos], me.y + deltas.y[pos])},
            {down: calcEdibleSq(dest.down, me.x + deltas.x[pos], me.y + deltas.y[pos])},
        ].sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        best_moves.push(routes[0]);
        best_moves.sort(function(a, b) { return Object.values(b)[0] - Object.values(a)[0]});
        [cost1, cost2] = [Object.values(Object.values(best_moves)[0])[0], Object.values(Object.values(best_moves)[1])[0]];
        best_pos = Object.keys(Object.values(best_moves)[0])[0];
        //if (cost1 <= 0) { console.log(best_moves); }
        return cost1 > 0 ? best_pos : getLongestDir() || getRandomDir(); 
    }
    function rightMove(pos = db['curr_pos'], prev = db['prev_pos'], pri = 0) { // Check if our next move is right.
        if (!validMove(pos)) return false; // Invalid move.
        if (toEdge(pos)) return pri > 8; // Towards the edge.
        if (getColorDir(pos) == me.c) return pri > 8; // Our color.
        if (getNextColor(getColorDir(pos)) != me.c) return pri > 4; // Avoid not paintable squares.
        if (deltas.x[pos] + deltas.x[prev] == 0 && deltas.y[pos] + deltas.y[prev] == 0) return pri > 4; // Prevent going back.
        if (pos == dest.wait == prev) return false; // Do not wait twice.
        return true;
    }
    let db = JSON.parse(localStorage.getItem(name)) || {};
    if (rcurr == 1) db['curr_pos'] = getEdibleDir();
    db['prev_pos'] = db['curr_pos'];
    // Main code.
    let next_move = db['curr_pos'];
    let counter = 0;
    if (isBotXY().includes(true)) {
        // In case of clash with another bot, wait or dance random to avoid loops.
        next_move = db['prev_pos'] != dest.wait ? dest.wait : getRandomDir();
    }
    else if (noBlanks() && !rightMove(next_move)) {
        next_move = getEdibleDir();
    }
    else while (!rightMove(next_move, db['prev_pos'], counter)) {
        next_move = turnRight(next_move);
        if (++counter > 12) { next_move = getEdibleDir(); break; }
    }
    db['curr_pos'] = next_move || getLongestDir() || getRandomDir();
    localStorage.setItem(name, JSON.stringify(db));
    return db.curr_pos;
}
  },
  {
    "name": "Humble Paint Salesman",
    "func": function(myself, grid, bots, gameInfo) {
    let [id, x, y] = myself;
    // if first move
    if(gameInfo[0] == 1) {
        this.size = grid.length;
        this.mid = this.size / 2;
        this.dx = x < this.mid ? "right" : "left";
        this.dy = y < this.mid ? "down" : "up";
        this.flip = function(v) {
            this.dict = this.dict || {
                right: "left",
                left: "right",
                down: "up",
                up: "down"
            };
            return this.dict[v];
        }
        this.queue = [];
    }
    if(grid[x][y] == 0) {
        return "wait";
    }
    else if(this.queue.length) {
        return this.queue.shift();
    }
    else if(x == 0 || x + 1 == this.size) {
        this.dx = this.flip(this.dx);
        if(y == 0 || y + 1 == this.size) {
            this.dy = this.flip(this.dy);
        }
        this.queue.push(this.dx);
        return this.dy;
    }
    return this.dx;
}
  },
  {
    "name": "Clever Name",
    "func": function(myself, grid, bots, gameInfo) {
    // Parse the arguments.
    let myId = myself[0];
    let myX = myself[1];
    let myY = myself[2];

    // Check each square to see if it's a good target.
    let targetX, targetY, targetDist = Infinity;
    let numAtDist;
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            // We don't care about our own squares.
            if (grid[x][y] === myId) { continue; }

            // Only squares that we can recolor are useful.
            if (grid[x][y] === 0 || Math.abs(grid[x][y] - myId) % 3 !== 2) {
                // If this is the closest we've seen, target it.
                let dist = Math.abs(myX - x) + Math.abs(myY - y);
                if (dist < targetDist) {
                    targetX = x;
                    targetY = y;
                    targetDist = dist;
                    numAtDist = 1;
                // If it's tied for the closest, sometimes target it.
                } else if (dist === targetDist) {
                    numAtDist++;
                    if (Math.floor(numAtDist * Math.random()) === 0) {
                        targetX = x;
                        targetY = y;
                    }
                }
            }
        }
    }

    // Move toward the target.
    if (targetX < myX) { return "left"; }
    if (targetX > myX) { return "right"; }
    if (targetY < myY) { return "up"; }
    if (targetY > myY) { return "down"; }
    return "wait";
}
  },
  {
    "name": "M.A.D.S.",
    "func": function(myself, grid, bots, gameInfo)
{
    const w = 6, h = 6;
    let my_c = myself[0], my_x = myself[1], my_y = myself[2], size = grid.length, roundnum = gameInfo[0];

    if (!localStorage.steelyeyedmissileman) {
        var offset_x = Math.random() *(size-w-1) |0;
        var offset_y = Math.random() *(size-h-1) |0;
        localStorage.steelyeyedmissileman = JSON.stringify([offset_x, offset_y]);
    }
    offsets = JSON.parse(localStorage.steelyeyedmissileman);
    offset_x = offsets[0];
    offset_y = offsets[1];

    let targets = [];
    for(let grid_x = offset_x; grid_x < offset_x+6; grid_x++)
    {
        for(let grid_y = offset_y; grid_y < offset_y+6; grid_y++)
        {
            if(grid[grid_x][grid_y] != my_c)
            {
                targets.push([grid_x, grid_y]);
            }
        }
    }
    let target = targets.pop();
    if(target == undefined) return 'wait';
    if(target[0] > my_x) return 'right';
    if(target[0] < my_x) return 'left';
    if(target[1] > my_y) return 'down';
    if(target[1] < my_y) return 'up';
    return "left";
}
  },
  {
    "name": "Hunter-Killer",
    "func": function(myself, grid, bots, gameInfo) {
    targetColour = myself[0] % 3;
    // If I can paint someone else's space to my colour, do so.
    var options = [];
    if (myself[1] !== 0 && grid[myself[1] - 1][myself[2]] % 3 === targetColour && grid[myself[1] - 1][myself[2]] !== myself[0] && grid[myself[1] - 1][myself[2]] !== 0)
        options.push("left");
    if (myself[1] !== grid.length - 1 && grid[myself[1] + 1][myself[2]] % 3 === targetColour && grid[myself[1] + 1][myself[2]] !== myself[0] && grid[myself[1] + 1][myself[2]] !== 0)
        options.push("right");
    if (myself[2] !== 0 && grid[myself[1]][myself[2] - 1] % 3 === targetColour && grid[myself[1]][myself[2] - 1] !== myself[0] && grid[myself[1]][myself[2] - 1] !== 0)
        options.push("up");
    if (myself[2] !== grid.length - 1 && grid[myself[1]][myself[2] + 1] % 3 === targetColour && grid[myself[1]][myself[2] + 1] !== myself[0] && grid[myself[1]][myself[2] + 1] !== 0)
        options.push("down");
    if (options.length > 0) return options[Math.random() * options.length | 0];

    // Otherwise, move to the closest bot I can paint over.
    var targetBots = bots.filter(bot => {
        if (bot[0] === myself[0] || bot[0] % 3 !== targetColour) return false;
        return true;
    });
    if (targetBots.length > 0) {
        targetBots.sort((a, b) => (Math.abs(a[1] - myself[1]) + Math.abs(a[2] - myself[2])) < (Math.abs(a[1] - myself[1]) + Math.abs(a[2] - myself[2])));
        if (Math.abs(targetBots[0][1] - myself[1]) > Math.abs(targetBots[0][2] - myself[2])){
            return targetBots[0][1] - myself[1] > 0 ? "right" : "left";
        }
        return targetBots[0][2] - myself[2] > 0 ? "down" : "up";
    }

    options = [];
    // If we've killed them all, try to move to a blank space.
    if (myself[1] !== 0 && grid[myself[1] - 1][myself[2]] === 0 && grid[myself[1] - 1][myself[2]] !== myself[0])
        options.push("left");
    if (myself[1] !== grid.length - 1 && grid[myself[1] + 1][myself[2]] === 0 && grid[myself[1] + 1][myself[2]] !== myself[0])
        options.push("right");
    if (myself[2] !== 0 && grid[myself[1]][myself[2] - 1] === 0 && grid[myself[1]][myself[2] - 1] !== myself[0])
        options.push("up");
    if (myself[2] !== grid.length - 1 && grid[myself[1]][myself[2] + 1] === 0 && grid[myself[1]][myself[2] + 1] !== myself[0])
        options.push("down");
    if (options.length > 0) return options[Math.random() * options.length | 0];

    options = [];
    // If there aren't any, try to move to a space I can paint white.
    targetColour = (targetColour + 2) % 3
    if (myself[1] !== 0 && grid[myself[1] - 1][myself[2]] % 3 === 0 && grid[myself[1] - 1][myself[2]] !== myself[0])
        options.push("left");
    if (myself[1] !== grid.length - 1 && grid[myself[1] + 1][myself[2]] % 3 === 0 && grid[myself[1] + 1][myself[2]] !== myself[0])
        options.push("right");
    if (myself[2] !== 0 && grid[myself[1]][myself[2] - 1] % 3 === 0 && grid[myself[1]][myself[2] - 1] !== myself[0])
        options.push("up");
    if (myself[2] !== grid.length - 1 && grid[myself[1]][myself[2] + 1] % 3 === 0 && grid[myself[1]][myself[2] + 1] !== myself[0])
        options.push("down");
    if (options.length > 0) return options[Math.random() * options.length | 0];

    // Otherwise, pick one at random.
    return ["up","down","left","right"][Math.random() * 4 | 0];
}
  },
  {
    "name": "No Do Overs",
    "func": function(myself, grid, bots, gameInfo) {
    var c = myself[0];
    var x = myself[1];
    var y = myself[2];
    var n = grid.length;

    var dirs = ["left", "up", "down", "right"]
    for(var _ = 0; _ < 4; _++) {
     var dir = dirs.splice(Math.random() * dirs.length | 0, 1);
     if(dir == "left" && x != 0 && grid[x-1][y] == 0) {
      return "left";
     }
     if(dir == "right" && x != n - 1&& grid[x+1][y] == 0) {
      return "right";
     }
     if(dir == "up" && y != 0 && grid[x][y-1] == 0) {
      return "up";
     }
     if(dir == "down" && y != n - 1 && grid[x][y+1] == 0) {
      return "down";
     }
     if(dir == "left" && x != 0 && grid[x-1][y] != c) {
      return "left";
     }
     if(dir == "right" && x != n - 1 && grid[x+1][y] != c) {
      return "right";
     }
     if(dir == "up" && y != 0 && grid[x][y-1] != c) {
      return "up";
     }
     if(dir == "down" && y != n - 1 && grid[x][y+1] != c) {
      return "down";
     }
    }
    dirs = [];
    if(x != 0) dirs[dirs.length] = "left";
    if(x != n - 1) dirs[dirs.length] = "right";
    if(y != 0) dirs[dirs.length] = "up";
    if(y != n - 1) dirs[dirs.length] = "down";
    return dirs[Math.random() * dirs.length | 0];
}
  },
  {
    "name": "Trollbot",
    "func": function(myself, grid, bots, gameInfo) {
    var c = myself[0];
    var x = myself[1];
    var y = myself[2];

    var cd = -1;
    var cx = -1;
    var cy = -1;
    var i;
    for(i = 0; i < bots.length; i++){
        var bc = bots[i][0];
        var bx = bots[i][1];
        var by = bots[i][2];
        var flatGrid = grid.reduce((acc, val) => acc.concat(val), []);
        var botAlive = flatGrid.filter(function(cell) {return cell == bc}).length > 1;

        if (botAlive && c != bc && Math.abs(c-bc)%3 == 0) {
            var d = Math.abs(x-bx)+Math.abs(y-by);

            if (d > 0 && (cd == -1 || d<cd)) {
                cd = d;
                cx = bx;
                cy = by;
            }
        }
    }

    if (cd == -1) {
        var j;
        for(i=0; i<grid.length; i++) {
            for(j=0; j<grid.length; j++) {
                if (grid[i][j] == 0) {
                    var d = Math.abs(x-i)+Math.abs(y-j);
                    var sharingWithBot = (i == x && j == y && bots.filter((item) => item[1] == i && item[2] == j).length > 1);
                    if (!sharingWithBot && (cd == -1 || d<cd)) {
                        cd = d;
                        cx = i;
                        cy = j;
                    }
                }
            }
        }
    }


    var move;
    var dx = cx-x;
    var dy = cy-y;
    if (cd == -1) {
        move = ["up","down","left","right"][Math.random() *4 |0];
    } else if (dx == 0 && dy == 0) {
        move = "wait";
    } else if (Math.abs(dx) > Math.abs(dy) || (Math.abs(dx) == Math.abs(dy) && Math.random() * 2 < 1)) {
        if (dx > 0) {
            move = "right";
        } else {
            move = "left";
        }
    } else {
        if (dy > 0) {
            move = "down";
        } else {
            move = "up";
        }
    }
    return move;
}
  },
  {
    "name": "The Bot That Paints The Board Constantly But Is Not A Painter",
    "func": function (me, board, painters, info) {
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
        let score = 0, paintersLength = painters.length, i;

        for (let bX = 0; bX < size; bX++) {
            for (let bY = 0; bY < size; bY++) {
                let distance = getDistance(x, y, bX, bY);
                let colorValue = getColorValue(board[bX][bY]);
                let factor = 1;

                if (distance === 1) {
                    for (i = 0; i < paintersLength; i++) if (painters[i][1] === bX && painters[i][2] === bY) factor = 0;
                    if (factor > 0) factor = 3;
                }

                score += (colorValue / (distance / 4)) * factor;
            }
        }

        for (i = 0; i < paintersLength; i++) {
            let pId = painters[i][0], pX = painters[i][1], pY = painters[i][2];
            if (pId === id) continue;
            let pDistance = getDistance(x, y, pX, pY);
            let pIdValue = getColorValue(pId);
            score -= (pIdValue / (pDistance / 2)) / 4;
        }

        return score + Math.random();
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
  },
  {
    "name": "Random Filler",
    "func": function([id, x, y], grid, bots, gameInfo) {
    let painted = {
        false: {
            un: [],
            other: [],
            me: [],
        },
        true: {
            un: [],
            other: [],
            me: [],
        },
    };
    let moves = {
        left: {x: x - 1, y},
        up: {x, y: y - 1},
        right: {x: x + 1, y},
        down: {x, y: y + 1},
        wait: {x, y},
    };
    let isbot = m => bots.some(([, x, y]) => m.x == x && m.y == y);
    let whose = n => n ? n == id || Math.abs(id - n) % 3 > 1 ? "me" : "other" : "un";
    for (let dir in moves) {
        let move = moves[dir];
        if (move.x >= 0 && move.x < grid.length && move.y >= 0 && move.y < grid.length)
            painted[isbot(move)][whose(grid[move.x][move.y])].push(dir);
    }
    choices = [painted.false.un, painted.false.other, painted.true.un, painted.true.other, painted.false.me, painted.true.me].find(choices => choices.length);
    let move = choices[Math.random() * choices.length | 0];
    return move;
}
  },
  {
    "name": "NearSightedGreed",
    "func": function(myself, grid, bots, gameInfo) {
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
        ret.push("right")
    }
    return ret[Math.random() * ret.length|0]
}
  },
  {
    "name": "CandyButton",
    "func": function(myself, grid, bots, gameInfo) {
var mc = myself[0];
var mx = myself[1];
var my = myself[2];

if(grid[mx][my]==0) return "wait"; // Edit: wait when white.
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
  },
  {
    "name": "Borderline",
    "func": function(myself, grid, bots, gameInfo) {
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
  },
  {
    "name": "Jim",
    "func": function(myself, grid, bots, gameInfo) {
  var [mc, mx, my] = myself;
  var output;
  var allowRetracing = false;

  var size = 3;
  var scoreboard = grid.map(column=>column.map(c=>c==mc? 0 : overMap(c, 2, 1, 0)));
  for (let [bc, bx, by] of bots) if (bc != mc) {log([bc,bx,by],[mc,mx,my]);
    scoreboard[bx][by] = -100;
    if (inbounds([bx-2, by])) scoreboard[bx-2][by] = -50;
    if (inbounds([bx+2, by])) scoreboard[bx+2][by] = -50;
    if (inbounds([bx, by-2])) scoreboard[bx][by-2] = -50;
    if (inbounds([bx, by+2])) scoreboard[bx][by+2] = -50;
  }

  function scoreOf (x, y) {
    let score = 0;
    for (let dx = -size; dx <= size; dx++) {
      let cx = dx + x;
      if (cx < 1 || cx >= grid.length-1) continue;
      for (let dy = -size; dy <= size; dy++) {
        let cy = dy + y;
        if (cy < 1 || cy >= grid.length-1) continue;
        score+= scoreboard[cx][cy];
      }
    }
    return score;
  }
  var storage = this;
  if (gameInfo[0] < 10) this.timer = 10000;
  function rescore() {
    storage.bestScore = -Infinity;
    var blur = scoreboard.map((column, x)=>column.map((c, y) => {
      let score = scoreOf(x, y);
      if (score > storage.bestScore) {
        storage.bestScore = score;
        storage.bestX = x;
        storage.bestY = y;
      }
      return score;
    }));
    storage.atBest = false;
    storage.timer = 0;
    log(blur);
  }
  if (this.timer > 200) rescore();

  if (grid[mx][my] == 0 && !bots.some(([col, bx, by])=> col != mc && bx==mx && by==my)) return "wait";


  // annoying localStorage
  if (!localStorage.dzaima_pastMoves) {
    pastMoves = ["-1;0"];
    nowMoves = new Array(30).fill("-1;0");
  } else {
    pastMoves = JSON.parse(localStorage.dzaima_pastMoves);
    nowMoves = JSON.parse(localStorage.dzaima_pastMoves);
  }
  nowMoves.push(mx+";"+my);
  nowMoves.shift();
  localStorage.dzaima_pastMoves = JSON.stringify(nowMoves);



  function log(...args) {
    // console.log(...args);
  }
  function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
    let res = Math.abs(mc-col) % 3;
    return res==1? 0 : res==0? 1 : -1;
  }
  function overMap(col, best, good, bad, mine = good) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
    let res = Math.abs(mc-col) % 3;
    return col == mc? mine : res==1? good : res==0? best : bad;
  }
  var iwin = col=>over(col) == 1;
  var zeroes = col=>over(col) == 0;
  function to([x, y]) {
    //debugger
    var LR = x > mx? [mx+1, my] : x < mx? [mx-1, my] : null;
    var UD = y > my? [mx, my+1] : y < my? [mx, my-1] : null;
    if (LR && UD) {
      var LRScore = overMap(LR, 2, 1, 0, 0);
      var UDScore = overMap(UD, 2, 1, 0, 0);
      if (LRScore == UDScore) return toPos([LR, UD][Math.random()>.5? 1 : 0])
      else if (LRScore > UDScore) return toPos(LR);
      else return toPos(UD);
    } else return toPos(LR || UD || [x, y]);
  }
  function toPos([x,y]) {
      if (x > mx) return "right";
      if (x < mx) return "left";
      if (y < my) return "up";
      if (y > my) return "down";
      return 'wait';
  }
  function inbounds([x, y]) {
    // if (x<grid.length && y<grid.length && x>=0 && y>=0) return true;
    if (x<grid.length-1 && y<grid.length-1 && x>=1 && y>=1) return true;
    return false;
  }
  function get([x,y]) {
    if (inbounds([x, y])) return grid[x][y];
    return 0;
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
    }
    if (bestScore < -500000) {
      if (allowRetracing) log("RETRACING");
      else return false;
    }
    output = to(bestPos);
    return true;
  }


  // log(x,this.bestX, y,this.bestY);
  var distToBest = Math.abs(this.bestX-mx) + Math.abs(this.bestY-my);
  if (this.atBest || distToBest < 10) {
    log("at best; collecting");
    this.atBest = true;
    var orth = [[-1,0],[0,-1],[1,0],[0,1]];
    var neighbors = orth
      .map(([x,y])=>[x+mx, y+my])
      .filter(c=>inbounds(c))
      .filter(([x,y])=>!bots.some(([bid, bx, by]) => bx==x && by==y))
      .map(c=>[c,get(c)]);

    var best = neighbors.filter(([_, col]) => col != mc && col != 0 && over(col) == 1);
    if (bestOf(best.map(([pos, col]) => pos))) {
      log("best");
      return output;
    }

    var good = neighbors.filter(([_, col]) => col == 0);
    if (bestOf(good.map(([pos, col]) => pos))) {
      log("good");
      return output;
    }

    var okay = neighbors.filter(([_, col]) => over(col) == 0);
    if (bestOf(okay.map(([pos, col]) => pos))) {
      log("okay");
      return output;
    }


    for (let i = 2; i < grid.length; i++) {
      if (i > 6) allowRetracing = true;
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


    return ['right','left','up','down'][Math.floor(Math.random()*4)];
  } else log("going to best");
  if (scoreOf(this.bestX, this.bestY) < this.bestScore/2 || distToBest > 20) rescore();

  return to([this.bestX, this.bestY]);
}
  },
  {
    "name": "¯\\_(ツ)_/¯ (Random moves)",
    "func": function(myself, grid, bots, gameInfo) {
    return ["up","down","left","right"][Math.random() *4 |0]
}
  }
];