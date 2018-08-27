botData = [
  {
    "name": "AoE",
    "func": function(me,grid,bots,info){
    var A = this;
    var u = 'up', d = 'down', l = 'left', r = 'right', nearestblank = [9999,-1,-1], areanum = 0, areacount = [], areanear = [], areamax = 0, chk = 0, movestr = '', ttl = 250, fm = [r,r,u,l,d],
        currdist, mygrid, i, j;
    if(info[0] < 5){
        A.lr = l;
        A.nlr = r;
        A.ud = u;
        A.nud = d;
        A.ttl = ttl;
        return fm[info[0]];
    }
    function dist(a,b){
        return Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
    }
    function finalcolor(a,b){
        return Math.abs(a-b)%3;
    }
    function emptygrid(len){
        var empty = [];
        for(var i=0;i<len;i++){
            empty[i] = new Array(len).fill(0);
        }
        return empty;
    }
    function map(me,grid,x,y){
        var dirs = [[0,-1,0,1],[-1,0,1,0]];
        if(mygrid[x][y] == 0 && grid[x][y] != me[0] && (grid[x][y] == 0 || finalcolor(me[0],grid[x][y]) == 0)){
            mygrid[x][y] = areanum;
            if(areacount[areanum] === undefined){
                areacount[areanum] = 0;
            }
            areacount[areanum]++;
            if(areacount[areanum] > areamax){
                areamax = areanum;
            }
            var currdist = dist(me,[0,x,y]);
            if(areanear[areanum] === undefined){
                areanear[areanum] = [0,9999,9999];
            }
            if(currdist < dist(me,areanear[areanum])){
                areanear[areanum] = [0,x,y];
            }
            for(var i=0;i<4;i++){
                if(x+dirs[0][i] >= 0 && x+dirs[0][i] < grid.length){
                    for(var j=0;j<4;j++){
                        if(y+dirs[1][j] >= 0 && y+dirs[1][j] < grid.length && mygrid[x+dirs[0][i]][y+dirs[1][j]] == 0 && chk < 5000){
                            chk++;
                            map(me,grid,x+dirs[0][i],y+dirs[1][j]);
                        }
                    }
                }
            }
        }
    }
    if(A.ttl == 0){
        mygrid = emptygrid(grid.length);
        for(i=0;i<grid.length;i++){
            for(j=0;j<grid.length;j++){
                chk = 0;
                areanum++;
                map(me,grid,i,j);
            }
        }
        A.target = areanear[areamax];
        A.ttl = ttl;
    }
    if(A.target){
        var choices = [];
        if(A.target[1] < me[1]){
            choices.push(l);
            A.lr = l;
            A.nlr = r;
        }
        else if(A.target[1] > me[1]){
            choices.push(r);
            A.lr = r;
            A.nlr = l;
        }
        if(A.target[2] < me[2]){
            choices.push(u);
            A.ud = u;
            A.nud = d;
        }
        else if(A.target[2] > me[2]){
            choices.push(d);
            A.ud = d;
            A.nud = u;
        }
        if(choices.length){
            return choices[Math.random()*choices.length|0];
        }
        else{
            A.target = null;
        }
    }
    movestr = '';
    if(me[1] > 1 && me[0] != grid[me[1]-1][me[2]] && (grid[me[1]-1][me[2]] == 0 || finalcolor(me[0],grid[me[1]-1][me[2]]) == 0)){
        movestr += l;
    }
    if(me[2] > 1 && me[0] != grid[me[1]][me[2]-1] && (grid[me[1]][me[2]-1] == 0 || finalcolor(me[0],grid[me[1]][me[2]-1]) == 0)){
        movestr += u;
    }
    if(me[1] < grid.length-2 && me[0] != grid[me[1]+1][me[2]] && (grid[me[1]+1][me[2]] == 0 || finalcolor(me[0],grid[me[1]+1][me[2]]) == 0)){
        movestr += r;
    }
    if(me[2] < grid.length-2 && me[0] != grid[me[1]][me[2]+1] && (grid[me[1]][me[2]+1] == 0 || finalcolor(me[0],grid[me[1]][me[2]+1]) == 0)){
        movestr += d;
    }
    if(movestr != ''){
        A.ttl--;
        if(movestr.indexOf(A.lr) >= 0){
            return A.lr;
        }
        else if(movestr.indexOf(A.ud) >= 0){
            return A.ud;
        }
        else if(movestr.indexOf(A.nlr) >= 0){
            return A.nlr;
        }
        else if(movestr.indexOf(A.nud) >= 0){
            return A.nud;
        }
    }
    for(i=1;i<grid.length-1;i++){
        for(j=1;j<grid.length-1;j++){
            if((i != me[1] || j != me[2]) && grid[i][j] != me[0] && (grid[i][j] == 0 || finalcolor(me[0],grid[i][j]) == 0)){
                currdist = dist(me,[0,i,j]);
                if(currdist < nearestblank[0]){
                    nearestblank[0] = currdist;
                    nearestblank[1] = i;
                    nearestblank[2] = j;
                }
            }
        }
    }
    if(nearestblank[0] < 9999){
        movestr = '';
        if(nearestblank[2] > me[2]){
            movestr += d;
        }
        else if(nearestblank[1] > me[1]){
            movestr += r;
        }
        else if(nearestblank[2] < me[2]){
            movestr += u;
        }
        else if(nearestblank[1] < me[1]){
            movestr += l;
        }
        if(movestr != ''){
            A.ttl--;
            if(movestr.indexOf(A.lr) >= 0){
                return A.lr;
            }
            else if(movestr.indexOf(A.ud) >= 0){
                return A.ud;
            }
            else if(movestr.indexOf(A.nlr) >= 0){
                return A.nlr;
            }
            else if(movestr.indexOf(A.nud) >= 0){
                return A.nud;
            }
        }
    }
    return [u,d,l,r][Math.random()*4|0];
}
  },
  {
    "name": "Bernard Szumborski",
    "func": function (me, board, painters, info) {
    let id = me[0], meX = me[1], meY = me[2], size = board.length, sectionSize = Math.ceil(size / 3), paintersLength = painters.length, round = info[0], storage, storageKey = 'jijdfoadofsdfasz', s1, s2, i;

    if (round === 1 || typeof this[storageKey] === 'undefined') {
        let bounds = [
            [0, 0, sectionSize - 1, sectionSize - 1],
            [sectionSize, 0, (sectionSize * 2) - 1, sectionSize - 1],
            [sectionSize * 2, 0, size - 1, sectionSize - 1],
            [sectionSize * 2, sectionSize, size - 1, (sectionSize * 2) - 1],
            [sectionSize * 2, sectionSize * 2, size - 1, size - 1],
            [sectionSize, sectionSize * 2, (sectionSize * 2) - 1, size - 1],
            [0, sectionSize * 2, sectionSize - 1, size - 1],
            [0, sectionSize, sectionSize - 1, (sectionSize * 2) - 1],
        ];

        let n = sectionSize + painters[0][1];
        s1 = bounds[n % 8];
        s2 = bounds[(n + 1) % 8];
        storage = this[storageKey] = {s1: s1, s2: s2, sInfo: {}, target: null};
    } else {
        storage = this[storageKey];
        s1 = storage.s1;
        s2 = storage.s2;
    }

    let isInSection = function (x, y, section) {
        return (x >= section[0] && y >= section[1] && x <= section[2] && y <= section[3]);
    };

    let getDistance = function (x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
    };

    let getColorValue = function (color) {
        if (color === 0) return 2;
        if (color === id) return 0;
        return 2 - (Math.abs(id - color) % 3);
    };

    let getScore = function (x, y) {
        let score = 0;
        if (!isInSection(x, y, s2)) return -100000;
        for (let bX = s2[0]; bX <= s2[2]; bX++) for (let bY = s2[1]; bY <= s2[3]; bY++) score += getColorValue(board[bX][bY]) / (getDistance(x, y, bX, bY) / 2);
        for (let i = 0; i < paintersLength; i++) {
            let pId = painters[i][0], pX = painters[i][1], pY = painters[i][2];
            if (pId === id) continue;
            let pDistance = getDistance(x, y, pX, pY);
            if (pDistance > 3) continue;
            score += (getColorValue(pId) / (pDistance / 2)) * 3;
        }
        return score + (Math.random() * 20);
    };

    let getTargetScore = function (x, y, targetId) {
        let score = 0;
        for (let bX = 0; bX < size; bX++) {
            for (let bY = 0; bY < size; bY++) {
                if (board[bX][bY] === targetId) {
                    score += 2 / (getDistance(x, y, bX, bY) / 2);
                }
            }
        }
        return score + Math.random();
    };

    let getPossibleMoves = function () {
        let possibleMoves = [{x: 0, y: 0, c: 'wait'}];
        if (meX > 0) possibleMoves.push({x: -1, y: 0, c: 'left'});
        if (meY > 0) possibleMoves.push({x: -0, y: -1, c: 'up'});
        if (meX < size - 1) possibleMoves.push({x: 1, y: 0, c: 'right'});
        if (meY < size - 1) possibleMoves.push({x: 0, y: 1, c: 'down'});
        return possibleMoves;
    };

    let getNormalMove = function () {
        if (isInSection(meX, meY, s2)) {
            let possibleMoves = getPossibleMoves();
            let topCommand, topScore = null;
            for (i = 0; i < possibleMoves.length; i++) {
                let score = getScore(meX + possibleMoves[i].x, meY + possibleMoves[i].y);
                if (topScore === null || score > topScore) {
                    topScore = score;
                    topCommand = possibleMoves[i].c;
                }
            }
            return topCommand;
        } else {
            let dX = ((s2[0] + s2[2]) / 2) - meX, dY = ((s2[1] + s2[3]) / 2) - meY;
            if (Math.abs(dX) > Math.abs(dY)) return (dX < 0 ? 'left' : 'right');
            else return (dY < 0 ? 'up' : 'down');
        }
    };

    let getTargetMove = function (targetId) {
        let possibleMoves = getPossibleMoves();
        let topCommand, topScore = null;
        for (i = 0; i < possibleMoves.length; i++) {
            let score = getTargetScore(meX + possibleMoves[i].x, meY + possibleMoves[i].y, targetId);
            if (topScore === null || score > topScore) {
                topScore = score;
                topCommand = possibleMoves[i].c;
            }
        }
        return (topScore === 0 ? getNormalMove() : topCommand);
    };

    for (i = 0; i < paintersLength; i++) {
        let pId = painters[i][0], pX = painters[i][1], pY = painters[i][2];
        if (pId === id) continue;
        if (isInSection(pX, pY, s1) || (isInSection(pX, pY, s2) && round < 5e2) || pX === 0 || pY === 0 || pX === size - 1 || pY === size - 1) {
            if (typeof storage.sInfo[pId] === 'undefined') storage.sInfo[pId] = 1; else storage.sInfo[pId]++;
        } else if (typeof storage.sInfo[pId] !== 'undefined' && storage.sInfo[pId] === round - 1) {
            storage.sInfo[pId] = 0;
        }
    }

    if (round < 5e2) {
        return getNormalMove();
    } else {
        if (round % 250 === 0) {
            let scores = {};
            for (let bX = 0; bX < size; bX++) {
                for (let bY = 0; bY < size; bY++) {
                    let color = board[bX][bY];
                    if (color === 0) continue;
                    if (typeof scores[color] === 'undefined') scores[color] = 1;
                    else scores[color]++;
                }
            }

            let targetScore = null;
            let target = null;
            for (i = 0; i < paintersLength; i++) {
                let pId = painters[i][0];
                if (getColorValue(pId) === 0 || typeof storage.sInfo[pId] === 'undefined' || storage.sInfo[pId] < (round / 100)) continue;
                let score = (typeof  scores[pId] === 'undefined' ? 0 : scores[pId]);
                if (targetScore === null || targetScore < score) {
                    targetScore = score;
                    target = pId;
                }
            }

            storage.target = target;
        }

        if (storage.target === null) {
            return getNormalMove();
        } else {
            return getTargetMove(storage.target);
        }
    }
}
  },
  {
    "name": "Jake",
    "func": function([mc, mx, my], grid, bots, [round, maxRound]) {const ID = 1;
  var S = this;
  const botAm = 3;
  function log(...args) {
    // if (round > 1) console.log(ID+" "+args[0], ...args.slice(1));
    return true;
  }
  if (round == 1) {
    var all = new Array(bots.length).fill().map((_,i)=>i+1);
    S.fs = new Array(botAm).fill().map(c =>
      [all.slice(), all.slice(), all.slice(), all.slice()]
    );
    S.doneSetup = false;
    var center = grid.length/2;
    // UL=0; DL=1; DR=2; UR=3
    S.dir = mx<center? (my<center? 0 : 1) : (my<center? 3 : 2);
    S.job = 0;
    S.botAm = bots.length;
    S.keys = [[1,1,0,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,0],
              [0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1,0,0,0,1,1],
              [1,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0]];
    /*if (ID == 2) */{
      S.chased = 0;
      S.ignore = [];
      S.badMoves = 0;
      S.pastMoves = new Array(100).fill("-1;0");
      S.timer = 0;
      S.jimFn = function([mc, mx, my], grid, bots, [round, maxRound]) { // ---------- BEGIN JIM ---------- \\
        var output;
        var allowRetracing = false;

        var checkSize = 3;
        var eatSize = 5;
        var myScore;
        var scoreboard;



        if (grid[mx][my] == 0 && !bots.some(([col, bx, by])=> col != mc && bx==mx && by==my)) return "wait"; // collect those sweet points

        // rescore every now and then
        if (S.timer > 200) rescore();

        S.pastMoves.push(mx+";"+my);
        S.pastMoves.shift();


        var orth = [[-1,0],[0,-1],[1,0],[0,1]];
        if (S.atTarget
        || S.targetX === undefined || S.targetY === undefined
        || S.targetX === mx && S.targetY === my
        || orth.map(([x,y])=>[mx+x,my+y]).filter(c=>get(c)==0 && inbounds(c)).length > 2) {

          S.atTarget = true;
          var neighbors = orth
            .map(([x,y]) => [x+mx, y+my])
            .filter(inbounds)
            .filter(([x,y]) => !bots.some(([bid, bx, by]) => bx==x && by==y))
            .map(c=>[c,get(c)]);

          let test = (neighbors, f, msg) => {
            return bestOf(neighbors.filter(f).map(c=>c[0])) && log(msg);
          }

          if (test(neighbors, ([,c]) => c===0        , "good")) return output;
          if (test(neighbors, ([,c]) => overMap(c, 1),  "sad")) return output;

          S.atTarget = false;
          S.targetX = S.targetY = undefined;
          let bestScore = 7;
          let bfscore = 0;

          for (let dist = 4; dist < 8; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds([cx, cy])) {
                  let score = scoreOf(cx, cy, 1, false);
                  if(score>bfscore)bfscore=score;
                  if (score > bestScore) {
                    bestScore = score;
                    S.targetX = cx;
                    S.targetY = cy;
                  }
                }
              }
            }
          }
          if (S.targetX) {
            log("short goto", S.targetX, S.targetY,"(rel",S.targetX-mx, S.targetY-my,") score", bestScore);
            return to([S.targetX, S.targetY]);
          } else log("long goto",bfscore);


          rescore();
          return to([S.targetX, S.targetY]);
        } else log("going to target", S.targetX, S.targetY);

        return to([S.targetX, S.targetY]);

        function myScore() {
          if (!myScore) calculateScoreboard();
          return myScore;
        }
        function calculateScoreboard() {
          scoreboard = grid.map(column=> {
            var arr = new Int16Array(grid.length);
            column.forEach((c, x) => (
              myScore+= c==mc,
              arr[x] = overMap(c, 1, 0, 0, 0, 5)
            ));
            return arr;
          });
          for (let [bc, bx, by] of bots) if (bc != mc) {
            scoreboard[bx][by] = -100;
            if (inbounds([bx-2, by])) scoreboard[bx-2][by] = -50;
            if (inbounds([bx+2, by])) scoreboard[bx+2][by] = -50;
            if (inbounds([bx, by-2])) scoreboard[bx][by-2] = -50;
            if (inbounds([bx, by+2])) scoreboard[bx][by+2] = -50;
          }
        }
        function scoreOf (x, y, size, includeEnemies) {
          if (!scoreboard) calculateScoreboard();
          let score = 0;
          for (let dx = -size; dx <= size; dx++) {
            let cx = dx + x;
            if (cx < 1 || cx >= grid.length-1) continue;
            for (let dy = -size; dy <= size; dy++) {
              let cy = dy + y;
              if (cy < 1 || cy >= grid.length-1) continue;
              let cs = scoreboard[cx][cy];
              if (cs > 0 || includeEnemies) score+= cs;
            }
          }
          return score;
        }
        function rescore() { // heatmap of best scoring places
          //log(JSON.stringify(scoreboard));
          S.bestScore = -Infinity;
          var blur = grid.map((column, x)=>column.map((c, y) => {
            let score = scoreOf(x, y, checkSize, true);
            if (score > S.bestScore) {
              S.bestScore = score;
              S.targetX = x;
              S.targetY = y;
            }
            return score;
          }));
          S.atTarget = false;
          S.timer = 0;
          S.bestScore = scoreOf(S.targetX, S.targetY, eatSize);
          S.badMoves = 0;
          // log("scored to", S.targetX, S.targetY, S.bestScore);
        }
        function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
          let res = Math.abs(mc-col) % 3;
          return res==1? 0 : res==0? 1 : -1;
        }
        function overMap(col, best = 0, good = 0, bad = 0, mine = 0, zero = 0) { // best if overrides happen, bad if overrides don't happen, good if override = 0
          let res = Math.abs(mc-col) % 3;
          return col == 0? zero : col == mc? mine : res==1? good : res==0? best : bad;
        }
        function iwin   (col) { return over(col) == 1; }
        function zeroes (col) { return over(col) == 0; }
        function to([x, y]) {
          //debugger
          var LR = x > mx? [mx+1, my] : x < mx? [mx-1, my] : null;
          var UD = y > my? [mx, my+1] : y < my? [mx, my-1] : null;
          if (LR && UD) {
            var LRScore = overMap(LR, 1, 0, 0, 0, 3);
            var UDScore = overMap(UD, 1, 0, 0, 0, 3);
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
            score-= Math.sqrt((x-S.targetX)**2 + (y-S.targetY)**2);
            if (S.pastMoves.includes(x+";"+y)) score-= 1000000;

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
      } // ---------- END JIM ---------- \\
    }
  }
  const dirs = ['up','left','down','right'];

  if (!S.doneSetup) { // ---------- HANDSHAKE ---------- \\
    let finished = 0;
    if (round != 1) {
      for (let id = 0; id < botAm; id++) {
        let f = S.fs[id];
        let remaining = f.map(c=>c.length).reduce((a,b)=>a+b);
        if (remaining == 1) {
          finished++;
          continue;
        }
        if (remaining == 0) {
          // mourn the loss of a good friend
          finished++;
          continue;
        }
        for (let dir = 0; dir < 4; dir++) {
          let possible = f[dir];

          for (let i = possible.length-1; i >= 0; i--) {
            let bc = possible[i];
            let curr =       bots.find(c=>c[0]==bc);
            let prev = S.pastBots.find(c=>c[0]==bc);
            let dx = curr[1]-prev[1];
            let dy = curr[2]-prev[2];
            let move;
            if (dy == 0) {
              if (dx == 1) move = 'right';
              else         move = 'left';
            } else {
              if (dy == 1) move = 'down';
              else         move = 'up';
            }
            let omove = rotate(move, dir);
            let expected = ['down','right'][S.keys[id][round-1]];
            // if (id == 0 && dir == S.dir) log();
            if (omove != expected) possible.splice(i,1);
          }
        }
      }
    }
    S.pastBots = bots;
    if (finished == botAm) {
      S.doneSetup = true;
      S.BCs = new Array(botAm).fill().map((_,i) => (S.fs[i].find(c=>c.length > 0) || [-1])[0]); // AKA idtoc
      S.fighters = S.BCs.slice(0,2);
      S.ctoid = {[S.BCs[0]]:0, [S.BCs[1]]:1, [S.BCs[2]]:2};
      log("identified", S.BCs);
      if (ID == 2) {
        log("can beat", bots.filter(c=>S.fighters.filter(b=>Math.abs(b-c[0])%3 != 2).length > 0).map(c=>c[3]));
      }
    } else {
      // log(ID,S.fs);
      return rotate(['down','right'][S.keys[ID][round]], S.dir);
    }
  }


  if (S.doneSetup && ID == 2) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]);




  if (!bots.find(c=>c[0]==S.fighters[1-ID])) return 'wait'; // for my demise
  if (round < 50 || !bots.find(c=>c[0]==S.BCs[2])) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]); // if Jim's dead, be Jim so others don't win needlessly
  // TODO yeah no

  let tbot = bots.find(c=>c[0] == S.tbotc);


  // ---------- NEW TARGET ---------- \\
  let tried;
  while ((!S.tbotc || !tbot) && !S.finished) {
    if (!tried) tried = S.BCs.slice();
    S.gotoX = S.gotoY = undefined;
    let scores = new Uint32Array(S.botAm+1);
    for (let column of grid) for (let item of column) scores[item]++;
    var bbc, bbs=-Infinity;
    for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && !tried.includes(i)) {
      bbs = scores[i];
      bbc = i;
    }
    S.tbotc = bbc;
    tbot = bots.find(c=>c[0] == bbc);

    S.jobs = [0,0];
    let executers = S.fighters.filter(c=>Math.abs(c-bbc)%3 == 1).concat(S.fighters.filter(c=>Math.abs(c-bbc)%3 == 0));
    if (executers.length > 1) {
      S.jobs[S.ctoid[executers.pop()]] = 1;
      S.jobs[S.ctoid[executers.pop()]] = 2;
      //S.jobs.forEach((c,id) => c==0? S.jobs[id]=2 : 0);
      log("targetting", botName(bbc),"jobs",S.jobs);
    } else {
      // cry
      tried.push(bbc);
      S.tbotc = tbot = undefined;
    }
    S.job = S.jobs[ID];
    if (tried.length >= bots.length) {
      // everyone is dead
      S.job = 0;
      S.jobs = new Array(2).fill(0);
      S.finished = true;
      break;
    }
  }

  if (tbot && !S.finished) {
    let [_, tx, ty] = tbot;

    switch (S.job) {
      case 1: // follow
        return to(tx, ty, S.tbotc);
      break;
      case 2: // erase
        let endingClearing = false;
        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          S.gotoX = undefined;
          var ending = [S.tbotc, ...S.fighters.filter(c=>c != mc)].map(c => bots.find(b=>b[0]==c)).filter(I=>I);
          search: for (let dist = 1; dist < grid.length*2+2; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds(cx, cy)) {
                  if (grid[cx][cy] == S.tbotc && ending.every(([_,bx,by]) => (bx-cx)**2 + (by-cy)**2 > Math.random()*10)) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
          if (S.gotoX === undefined) {
            let available = [];
            grid.forEach((column, x) => column.forEach((c, y) => c==S.tbotc? available.push([x,y]) : 0));
            [S.gotoX, S.gotoY] = available[Math.floor(Math.random()*available.length)];
            endingClearing = true;
          }
        }
        return to(S.gotoX, S.gotoY, endingClearing? undefined : S.tbotc);
      break;
      case 0: // exercise

        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          let scores = new Uint32Array(S.botAm+1);
          for (let column of grid) for (let item of column) scores[item]++;
          var bbc, bbs=-Infinity;
          for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && Math.abs(mc-i)%3 == 0 && !S.BCs.includes(i)) {
            bbs = scores[i];
            bbc = i;
          }
          if (bbc) {
            S.gotoX = undefined;
            search: for (let dist = 1; dist < grid.length*2+2; dist++) {
              for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
                for (let i = 0; i < dist; i++) {
                  let cx = dx*i + dsx*dist + mx;
                  let cy = dy*i + dsy*dist + my;
                  if (inbounds(cx, cy) && grid[cx][cy] == bbc) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
        }
        if (S.gotoX !== undefined) return to(S.gotoX, S.gotoY);
        return dirs[Math.floor(Math.random()*4)];
      break;
    }
  }


  function to (x, y, col) {
    if  (x == mx&&y== my) return 'wait';
    let dx =   x    - mx ;
    let dy =      y - my ;
    let ax = Math.abs(dx);
    let ay = Math.abs(dy);
    var          diag;
    if   (     ax==ay   ) {
      if (col&&ax+ ay==2) {
        let i=[[x, my], [mx, y]].findIndex(c=>grid[c[0]][c[1]]==col);
        if (i<0) diag = Math.random()>=.5;
        else     diag =           i  == 0;
      } else     diag = Math.random()>=.5;
    }
    if (ax==ay?  diag :  ax>ay) {
      if (dx>0) return 'right';
      else      return  'left';
    } else {
      if (dy>0) return  'down';
      else      return    'up';
    }
  }

  function rotate (move, dir) {
    if ((move == 'up' || move == 'down') && (dir && dir<3)) {
      if (move == 'up') return 'down';
      else return 'up';
    }
    if ((move == 'left' || move == 'right') && dir>1) {
      if (move == 'left') return 'right';
      else return 'left';
    }
    return move;
  }
  function botName(id) {
    return bots.find(c=>c[0]==id)[3] + "/" + id;
  }
  function inbounds(x, y) { return x<grid.length && y<grid.length && x>=0 && y>=0 }
}
  },
  {
    "name": "Drone-FA57",
    "func": function(myData, gridData, botData, gameInfoData) {
  function customSetup(fThis) {
    fThis.botUID = 2;
    fThis.swarm = new Array(3);
    fThis.matchedSize = 0;
    bots.forEach(b => { b.failedSignal = 0; b.trespass = 0; b.desecrate = 0; });
  }

  let XY = this.xyClass;
  let Bot = this.botClass;
  let Cell = this.cellClass;

  function at(pos, usedGrid = grid) { // NEVER EVER THINK ABOUT PUTTING THIS ON THE GRID ITSELF
    return pos.withinBounds() ? usedGrid[pos.toIndex()] : new Cell(null);
  }

  if (!this.setupDone) {
    this.xyClass = (class XY {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      static fromIndex(index) {
        return new XY(Math.floor(index / gridSize), index % gridSize);
      }
      toIndex() {
        return this.x * gridSize + this.y;
      }

      add(other) {
        return new XY(this.x + other.x, this.y + other.y);
      }
      sub(other) {
        return new XY(this.x - other.x, this.y - other.y);
      }
      div(value) {
        return new XY(Math.round(this.x / v), Math.round(this.y / v));
      }
      mul(value) {
        return new XY(Math.round(this.x * m), Math.round(this.y * m));
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }

      distance(other) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
      }
      chebyshevDistance(other) {
        return Math.max(Math.abs(other.x - this.x), Math.abs(other.y - this.y));
      }

      withinBounds() {
        return this.x >= 0 && this.x < gridSize && this.y >= 0 && this.y < gridSize;
      }

      getNeighbors() {
        return neighbors.map(p => this.add(p));
      }
      getRealNeighbors() {
        return this.getNeighbors().filter(p => p.withinBounds());
      }
    });
    XY = this.xyClass;
    this.botClass = (class Bot extends XY {
      constructor(botData) {
        super(botData[1], botData[2]);
        this.id = botData[0];
        this.score = 0;
        this.dead = true;
      }
    });
    Bot = this.botClass;
    this.cellClass = (class Cell {
      constructor(id, xy) {
        this.id = id;
        this.pos = xy;
      }
    });
    Cell = this.cellClass;

    this.botMap = [];
    this.botIDs = [];
    botData.forEach(d => { this.botMap[d[0]] = new Bot(d); this.botIDs.push(d[0]); });
    this.currentRound = 0;
  }

  const gridSize = gridData.length;
  const gridSizeSqr = gridSize * gridSize;
  const grid = new Array(gridSize * gridSize);
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      grid[x * gridSize + y] = new Cell(gridData[x][y], new XY(x, y));
    }
  }
  const prevGrid = this.prevGrid;
  this.prevGrid = grid;

  const bots = [];
  const botMap = this.botMap;
  this.botIDs.forEach(id => botMap[id].dead = true);
  botData.forEach(d => {
    const r = botMap[d[0]];
    r.dead = false;
    r.lastPosition = new XY(r.x, r.y);
    r.x = d[1];
    r.y = d[2];
    r.score = grid.reduce((sum, cell) => sum + (cell.id === r.id), 0);
    bots.push(r);
    at(r).bot = r;
  });
  const me = botMap[myData[0]];

  const currentRound = this.currentRound++;
  const maxRound = gameInfoData[1] - 1;

  const zero = new XY(0, 0);
  const neighbors = [new XY(1, 0), new XY(0, 1), new XY(-1, 0), new XY(0, -1)];
  const moves = ["right", "down", "left", "up", "wait"];

  if (!this.setupDone) {
    customSetup(this);
    this.setupDone = true;
  }

  function rand(max = 1, min = 0) {
    return min + Math.random() * (max - min);
  }
  function randInt(max, min = 0) {
    return Math.floor(rand(max, min));
  }
  function roll(chance = 0.5) {
    return Math.random() < chance;
  }

  function separation(id1, id2) {
    return Math.abs(id1 - id2) % 3;
  }

  function value(id, bot = me) {
    return id === bot.id ? 1 : id === 0 ? 4 : id === null ? 0 : [5, 3, 2][separation(bot.id, id)];
  }

  function travelTo(goal, start = me) {
    const relative = goal.sub(start);
    return Math.abs(relative.x) > Math.abs(relative.y) ? (
      relative.x > 0 ? 0 : 2
    ) : (
      relative.y > 0 ? 1 : relative.y < 0 ? 3 : 4
    );
  }
  function travelToList(goal, start = me) {
    const relative = goal.sub(start);
    return [...start.getRealNeighbors(), start].sort((a, b) => (a.chebyshevDistance(goal) - b.chebyshevDistance(goal)) * gridSizeSqr + (a.distance(goal) - b.distance(goal)));
  }

  const swarm = this.swarm;
  const swarmSize = swarm.length;
  const botUID = this.botUID;

  const signalPatterns = [[3, 0, 1, 1, 0], [0, 1, 2, 2, 2, 3, 3, 2, 2, 1], [2, 3, 2, 3, 0, 0, 1, 0, 3, 3]];
  function patternMove(pos, round, ...pattern) {
    const e = pattern[round % pattern.length];
    const f = (e + 2) % 4;
    function calcPos(d) { return pos.add(neighbors[d]); }
    if (calcPos(e).withinBounds()) {
      return e;
    } else {
      return f;
    }
  }
  function signal(uid = botUID, pos = me, round = currentRound) {
    return patternMove(pos, round, ...signalPatterns[uid]);
  }

  if (currentRound) {
    for (var i = 0; i < swarmSize; i++) {
      if (!swarm[i]) {
        const consideredBots = bots.filter(b => !(b.failedSignal & (1 << i)));
        const matchedBots = consideredBots.filter(b => {
          const prevPos = b.lastPosition;
          const expected = neighbors[signal(i, prevPos, currentRound - 1)];
          const performed = b.sub(prevPos);
          const matched = performed.equals(expected);
          if (!matched) {
            b.failedSignal |= (1 << i);
          }
          return matched;
        });
        if (matchedBots.length === 1) {
          swarm[i] = matchedBots[0];
          swarm[i].member = true;
          swarm[i].uid = i;
          this.matchedSize++;
          console.log("Swarm member", i, "found!");
        }
      }
    }
  }

  function findTarget() {
    const lists = [];
    lists.unshift(bots.filter(b => b.removal.candidate));
    lists.unshift(lists[0].filter(b => b.removal.separations[0] === 0));
    lists.unshift(lists[0].filter(b => b.removal.speed === 3));
    lists.unshift(lists[2].filter(b => b.removal.separations[0] === 2));
    const bestList = lists.find(l => l.length);
    if (!bestList) {
      console.log("No more targets!");
      return undefined;
    }
    const bestTarget = bestList.sort((a, b) => b.trespass - a.trespass)[0]; // TODO: Remove sort. TODO: Improve.
    console.log("Best target:", bestTarget);
    return bestTarget;
  }

  if (this.matchedSize === swarmSize) {
    if (!this.connected) {
      bots.forEach(b => {
        const separations = swarm.map(m => separation(b.id, m.id));
        const speed = Math.floor(separations.reduce((sum, val) => sum + (val < 2 ? 1 : 0.5), 0));
        b.removal = {separations: separations, speed: speed, candidate: speed > 1 && !b.member};
      });
      console.log("All connections established.");
      this.connected = true;
    }

    bots.forEach(b => {
      if (b.removal.separations[0] !== 2 && at(b, prevGrid).id === swarm[0].id) {
        b.desecrate++;
      }
      swarm.forEach((m, i) => {
        if (b.removal.separations[i] !== 2 && at(b, prevGrid).id === m.id) {
          b.trespass++;
        }
      });
    });

    if (!this.target || this.target.dead) {
      this.target = findTarget();

      swarm.forEach(b => {
        delete b.partner;
      });

      const sep = this.target.removal.separations;
      const overwriters = [];
      const eraser = [];
      const helpers = []; 
      for (var i = 0; i < swarmSize; i++) {
        if (swarm[i].partner) {
          continue;
        }
        if (sep[i] === 0) {
          overwriters.push(swarm[i]);
        } else if (sep[i] === 1) {
          eraser.push(swarm[i]);
        } else if (sep[i] === 2) {
          for (var j = i + 1; j < swarmSize; j++) {
            if (sep[j] === 2) {
              swarm[j].partner = swarm[i];
              swarm[i].partner = swarm[j];
              eraser.push(swarm[i]);
              break;
            }
          }
          if (!swarm[i].partner) {
            helpers.push(swarm[i]);
          }
        }
      }

      this.chaser = eraser.pop() || overwriters.pop();
      this.cleaners = [...overwriters, ...eraser];
      this.roamers = helpers; // TODO: Make helpers more useful by making them simply target the next guy?
    }

    function findImmediate(target, bot = me) {
      const list = travelToList(target, bot);
      return list.find(p => !at(p).reserved) || list[0];
    }

    grid.forEach(c => c.reserved = 0);
    function reserve(bot, target) {
      if (!bot.target) {
        bot.immediateTarget = findImmediate(target, bot);
        bot.target = target;
        at(bot.immediateTarget).reserved++;
        at(target).reserved++;
      }
    }
    function unreserve(bot) {
      if (bot.target) {
        at(bot.immediateTarget).reserved--;
        at(bot.target).reserved--;
        delete bot.immediateTarget;
        delete bot.target;
      }
    }

    reserve(this.chaser, chase(this.target));

    for (var i = 0; i < swarmSize; i++) {
      const emergency = preserveLife(swarm[i]);
      if (emergency) {
        unreserve(swarm[i]);
        reserve(swarm[i], emergency);
      }
    }

    this.cleaners.forEach(b => reserve(b, clean(b, this.target, this.cleaners)));
    this.roamers.forEach(b => reserve(b, roam(b)));

    const immediateTarget = me.immediateTarget || findImmediate(me.partner.target);
    swarm.forEach(b => unreserve(b));

    return moves[travelTo(immediateTarget)];
  } else {
    return moves[signal()];
  }

  function chase(target) {
    return target;
  }
  function clean(bot, target, cleaners) {
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const closest = Math.min(...cleaners.map(b => b.distance(pos)));
      const distance = bot.distance(pos);
      const wrongness = distance - closest;
      const distanceFromTarget = target.distance(pos);
      if (c.id === target.id && !c.reserved && (wrongness < best.wrongness || (wrongness === best.wrongness && (distance < best.distance || (distance === best.distance && distanceFromTarget > best.distanceFromTarget))))) {
        return {wrongness: wrongness, distance: distance, distanceFromTarget: distanceFromTarget, pos: pos};
      } else {
        return best;
      }
    }, {wrongness: Infinity, distance: Infinity, distanceFromTarget: -Infinity, pos: bot}).pos;
  }
  function roam(bot) {
    const dangerousBots = bots.filter(b => !b.member && separation(b.id, bot.id) !== 2);
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const val = value(c.id, bot);
      const distance = bot.distance(pos);
      const comfyness = pos.getNeighbors().reduce((sum, next) => sum + (value(at(next).id, bot) <= 2), 0);
      const closestBotDist = Math.min(...dangerousBots.map(b => b.distance(pos)));
      if (val >= 4 && !swarm.find(m => m.id === c.id) && !c.bot && (distance < best.distance || (distance === best.distance && (val > best.val || (val === best.val && (comfyness > best.comfyness || (comfyness === best.comfyness && closestBotDist > best.closestBotDist))))))) {
        return {distance: distance, val: val, comfyness: comfyness, closestBotDist: closestBotDist, pos: pos};
      } else {
        return best;
      }
    }, {distance: Infinity, val: -Infinity, comfyness: -Infinity, closestBotDist: -Infinity, pos: bot}).pos;
  }
  function preserveLife(bot) {
    if (bot.score < 20) {
      return roam(bot);
    }
  }
}
  },
  {
    "name": "Drone-B075",
    "func": function(myData, gridData, botData, gameInfoData) {
  function customSetup(fThis) {
    fThis.botUID = 1;
    fThis.swarm = new Array(3);
    fThis.matchedSize = 0;
    bots.forEach(b => { b.failedSignal = 0; b.trespass = 0; b.desecrate = 0; });
  }

  let XY = this.xyClass;
  let Bot = this.botClass;
  let Cell = this.cellClass;

  function at(pos, usedGrid = grid) { // NEVER EVER THINK ABOUT PUTTING THIS ON THE GRID ITSELF
    return pos.withinBounds() ? usedGrid[pos.toIndex()] : new Cell(null);
  }

  if (!this.setupDone) {
    this.xyClass = (class XY {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      static fromIndex(index) {
        return new XY(Math.floor(index / gridSize), index % gridSize);
      }
      toIndex() {
        return this.x * gridSize + this.y;
      }

      add(other) {
        return new XY(this.x + other.x, this.y + other.y);
      }
      sub(other) {
        return new XY(this.x - other.x, this.y - other.y);
      }
      div(value) {
        return new XY(Math.round(this.x / v), Math.round(this.y / v));
      }
      mul(value) {
        return new XY(Math.round(this.x * m), Math.round(this.y * m));
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }

      distance(other) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
      }
      chebyshevDistance(other) {
        return Math.max(Math.abs(other.x - this.x), Math.abs(other.y - this.y));
      }

      withinBounds() {
        return this.x >= 0 && this.x < gridSize && this.y >= 0 && this.y < gridSize;
      }

      getNeighbors() {
        return neighbors.map(p => this.add(p));
      }
      getRealNeighbors() {
        return this.getNeighbors().filter(p => p.withinBounds());
      }
    });
    XY = this.xyClass;
    this.botClass = (class Bot extends XY {
      constructor(botData) {
        super(botData[1], botData[2]);
        this.id = botData[0];
        this.score = 0;
        this.dead = true;
      }
    });
    Bot = this.botClass;
    this.cellClass = (class Cell {
      constructor(id, xy) {
        this.id = id;
        this.pos = xy;
      }
    });
    Cell = this.cellClass;

    this.botMap = [];
    this.botIDs = [];
    botData.forEach(d => { this.botMap[d[0]] = new Bot(d); this.botIDs.push(d[0]); });
    this.currentRound = 0;
  }

  const gridSize = gridData.length;
  const gridSizeSqr = gridSize * gridSize;
  const grid = new Array(gridSize * gridSize);
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      grid[x * gridSize + y] = new Cell(gridData[x][y], new XY(x, y));
    }
  }
  const prevGrid = this.prevGrid;
  this.prevGrid = grid;

  const bots = [];
  const botMap = this.botMap;
  this.botIDs.forEach(id => botMap[id].dead = true);
  botData.forEach(d => {
    const r = botMap[d[0]];
    r.dead = false;
    r.lastPosition = new XY(r.x, r.y);
    r.x = d[1];
    r.y = d[2];
    r.score = grid.reduce((sum, cell) => sum + (cell.id === r.id), 0);
    bots.push(r);
    at(r).bot = r;
  });
  const me = botMap[myData[0]];

  const currentRound = this.currentRound++;
  const maxRound = gameInfoData[1] - 1;

  const zero = new XY(0, 0);
  const neighbors = [new XY(1, 0), new XY(0, 1), new XY(-1, 0), new XY(0, -1)];
  const moves = ["right", "down", "left", "up", "wait"];

  if (!this.setupDone) {
    customSetup(this);
    this.setupDone = true;
  }

  function rand(max = 1, min = 0) {
    return min + Math.random() * (max - min);
  }
  function randInt(max, min = 0) {
    return Math.floor(rand(max, min));
  }
  function roll(chance = 0.5) {
    return Math.random() < chance;
  }

  function separation(id1, id2) {
    return Math.abs(id1 - id2) % 3;
  }

  function value(id, bot = me) {
    return id === bot.id ? 1 : id === 0 ? 4 : id === null ? 0 : [5, 3, 2][separation(bot.id, id)];
  }

  function travelTo(goal, start = me) {
    const relative = goal.sub(start);
    return Math.abs(relative.x) > Math.abs(relative.y) ? (
      relative.x > 0 ? 0 : 2
    ) : (
      relative.y > 0 ? 1 : relative.y < 0 ? 3 : 4
    );
  }
  function travelToList(goal, start = me) {
    const relative = goal.sub(start);
    return [...start.getRealNeighbors(), start].sort((a, b) => (a.chebyshevDistance(goal) - b.chebyshevDistance(goal)) * gridSizeSqr + (a.distance(goal) - b.distance(goal)));
  }

  const swarm = this.swarm;
  const swarmSize = swarm.length;
  const botUID = this.botUID;

  const signalPatterns = [[3, 0, 1, 1, 0], [0, 1, 2, 2, 2, 3, 3, 2, 2, 1], [2, 3, 2, 3, 0, 0, 1, 0, 3, 3]];
  function patternMove(pos, round, ...pattern) {
    const e = pattern[round % pattern.length];
    const f = (e + 2) % 4;
    function calcPos(d) { return pos.add(neighbors[d]); }
    if (calcPos(e).withinBounds()) {
      return e;
    } else {
      return f;
    }
  }
  function signal(uid = botUID, pos = me, round = currentRound) {
    return patternMove(pos, round, ...signalPatterns[uid]);
  }

  if (currentRound) {
    for (var i = 0; i < swarmSize; i++) {
      if (!swarm[i]) {
        const consideredBots = bots.filter(b => !(b.failedSignal & (1 << i)));
        const matchedBots = consideredBots.filter(b => {
          const prevPos = b.lastPosition;
          const expected = neighbors[signal(i, prevPos, currentRound - 1)];
          const performed = b.sub(prevPos);
          const matched = performed.equals(expected);
          if (!matched) {
            b.failedSignal |= (1 << i);
          }
          return matched;
        });
        if (matchedBots.length === 1) {
          swarm[i] = matchedBots[0];
          swarm[i].member = true;
          swarm[i].uid = i;
          this.matchedSize++;
          console.log("Swarm member", i, "found!");
        }
      }
    }
  }

  function findTarget() {
    const lists = [];
    lists.unshift(bots.filter(b => b.removal.candidate));
    lists.unshift(lists[0].filter(b => b.removal.separations[0] === 0));
    lists.unshift(lists[0].filter(b => b.removal.speed === 3));
    lists.unshift(lists[2].filter(b => b.removal.separations[0] === 2));
    const bestList = lists.find(l => l.length);
    if (!bestList) {
      console.log("No more targets!");
      return undefined;
    }
    const bestTarget = bestList.sort((a, b) => b.trespass - a.trespass)[0]; // TODO: Remove sort. TODO: Improve.
    console.log("Best target:", bestTarget);
    return bestTarget;
  }

  if (this.matchedSize === swarmSize) {
    if (!this.connected) {
      bots.forEach(b => {
        const separations = swarm.map(m => separation(b.id, m.id));
        const speed = Math.floor(separations.reduce((sum, val) => sum + (val < 2 ? 1 : 0.5), 0));
        b.removal = {separations: separations, speed: speed, candidate: speed > 1 && !b.member};
      });
      console.log("All connections established.");
      this.connected = true;
    }

    bots.forEach(b => {
      if (b.removal.separations[0] !== 2 && at(b, prevGrid).id === swarm[0].id) {
        b.desecrate++;
      }
      swarm.forEach((m, i) => {
        if (b.removal.separations[i] !== 2 && at(b, prevGrid).id === m.id) {
          b.trespass++;
        }
      });
    });

    if (!this.target || this.target.dead) {
      this.target = findTarget();

      swarm.forEach(b => {
        delete b.partner;
      });

      const sep = this.target.removal.separations;
      const overwriters = [];
      const eraser = [];
      const helpers = []; 
      for (var i = 0; i < swarmSize; i++) {
        if (swarm[i].partner) {
          continue;
        }
        if (sep[i] === 0) {
          overwriters.push(swarm[i]);
        } else if (sep[i] === 1) {
          eraser.push(swarm[i]);
        } else if (sep[i] === 2) {
          for (var j = i + 1; j < swarmSize; j++) {
            if (sep[j] === 2) {
              swarm[j].partner = swarm[i];
              swarm[i].partner = swarm[j];
              eraser.push(swarm[i]);
              break;
            }
          }
          if (!swarm[i].partner) {
            helpers.push(swarm[i]);
          }
        }
      }

      this.chaser = eraser.pop() || overwriters.pop();
      this.cleaners = [...overwriters, ...eraser];
      this.roamers = helpers; // TODO: Make helpers more useful by making them simply target the next guy?
    }

    function findImmediate(target, bot = me) {
      const list = travelToList(target, bot);
      return list.find(p => !at(p).reserved) || list[0];
    }

    grid.forEach(c => c.reserved = 0);
    function reserve(bot, target) {
      if (!bot.target) {
        bot.immediateTarget = findImmediate(target, bot);
        bot.target = target;
        at(bot.immediateTarget).reserved++;
        at(target).reserved++;
      }
    }
    function unreserve(bot) {
      if (bot.target) {
        at(bot.immediateTarget).reserved--;
        at(bot.target).reserved--;
        delete bot.immediateTarget;
        delete bot.target;
      }
    }

    reserve(this.chaser, chase(this.target));

    for (var i = 0; i < swarmSize; i++) {
      const emergency = preserveLife(swarm[i]);
      if (emergency) {
        unreserve(swarm[i]);
        reserve(swarm[i], emergency);
      }
    }

    this.cleaners.forEach(b => reserve(b, clean(b, this.target, this.cleaners)));
    this.roamers.forEach(b => reserve(b, roam(b)));

    const immediateTarget = me.immediateTarget || findImmediate(me.partner.target);
    swarm.forEach(b => unreserve(b));

    return moves[travelTo(immediateTarget)];
  } else {
    return moves[signal()];
  }

  function chase(target) {
    return target;
  }
  function clean(bot, target, cleaners) {
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const closest = Math.min(...cleaners.map(b => b.distance(pos)));
      const distance = bot.distance(pos);
      const wrongness = distance - closest;
      const distanceFromTarget = target.distance(pos);
      if (c.id === target.id && !c.reserved && (wrongness < best.wrongness || (wrongness === best.wrongness && (distance < best.distance || (distance === best.distance && distanceFromTarget > best.distanceFromTarget))))) {
        return {wrongness: wrongness, distance: distance, distanceFromTarget: distanceFromTarget, pos: pos};
      } else {
        return best;
      }
    }, {wrongness: Infinity, distance: Infinity, distanceFromTarget: -Infinity, pos: bot}).pos;
  }
  function roam(bot) {
    const dangerousBots = bots.filter(b => !b.member && separation(b.id, bot.id) !== 2);
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const val = value(c.id, bot);
      const distance = bot.distance(pos);
      const comfyness = pos.getNeighbors().reduce((sum, next) => sum + (value(at(next).id, bot) <= 2), 0);
      const closestBotDist = Math.min(...dangerousBots.map(b => b.distance(pos)));
      if (val >= 4 && !swarm.find(m => m.id === c.id) && !c.bot && (distance < best.distance || (distance === best.distance && (val > best.val || (val === best.val && (comfyness > best.comfyness || (comfyness === best.comfyness && closestBotDist > best.closestBotDist))))))) {
        return {distance: distance, val: val, comfyness: comfyness, closestBotDist: closestBotDist, pos: pos};
      } else {
        return best;
      }
    }, {distance: Infinity, val: -Infinity, comfyness: -Infinity, closestBotDist: -Infinity, pos: bot}).pos;
  }
  function preserveLife(bot) {
    if (bot.score < 20) {
      return roam(bot);
    }
  }
}
  },
  {
    "name": "Drone-BEA7",
    "func": function(myData, gridData, botData, gameInfoData) {
  function customSetup(fThis) {
    fThis.botUID = 0;
    fThis.swarm = new Array(3);
    fThis.matchedSize = 0;
    bots.forEach(b => { b.failedSignal = 0; b.trespass = 0; b.desecrate = 0; });
  }

  let XY = this.xyClass;
  let Bot = this.botClass;
  let Cell = this.cellClass;

  function at(pos, usedGrid = grid) { // NEVER EVER THINK ABOUT PUTTING THIS ON THE GRID ITSELF
    return pos.withinBounds() ? usedGrid[pos.toIndex()] : new Cell(null);
  }

  if (!this.setupDone) {
    this.xyClass = (class XY {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      static fromIndex(index) {
        return new XY(Math.floor(index / gridSize), index % gridSize);
      }
      toIndex() {
        return this.x * gridSize + this.y;
      }

      add(other) {
        return new XY(this.x + other.x, this.y + other.y);
      }
      sub(other) {
        return new XY(this.x - other.x, this.y - other.y);
      }
      div(value) {
        return new XY(Math.round(this.x / v), Math.round(this.y / v));
      }
      mul(value) {
        return new XY(Math.round(this.x * m), Math.round(this.y * m));
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }

      distance(other) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
      }
      chebyshevDistance(other) {
        return Math.max(Math.abs(other.x - this.x), Math.abs(other.y - this.y));
      }

      withinBounds() {
        return this.x >= 0 && this.x < gridSize && this.y >= 0 && this.y < gridSize;
      }

      getNeighbors() {
        return neighbors.map(p => this.add(p));
      }
      getRealNeighbors() {
        return this.getNeighbors().filter(p => p.withinBounds());
      }
    });
    XY = this.xyClass;
    this.botClass = (class Bot extends XY {
      constructor(botData) {
        super(botData[1], botData[2]);
        this.id = botData[0];
        this.score = 0;
        this.dead = true;
      }
    });
    Bot = this.botClass;
    this.cellClass = (class Cell {
      constructor(id, xy) {
        this.id = id;
        this.pos = xy;
      }
    });
    Cell = this.cellClass;

    this.botMap = [];
    this.botIDs = [];
    botData.forEach(d => { this.botMap[d[0]] = new Bot(d); this.botIDs.push(d[0]); });
    this.currentRound = 0;
  }

  const gridSize = gridData.length;
  const gridSizeSqr = gridSize * gridSize;
  const grid = new Array(gridSize * gridSize);
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      grid[x * gridSize + y] = new Cell(gridData[x][y], new XY(x, y));
    }
  }
  const prevGrid = this.prevGrid;
  this.prevGrid = grid;

  const bots = [];
  const botMap = this.botMap;
  this.botIDs.forEach(id => botMap[id].dead = true);
  botData.forEach(d => {
    const r = botMap[d[0]];
    r.dead = false;
    r.lastPosition = new XY(r.x, r.y);
    r.x = d[1];
    r.y = d[2];
    r.score = grid.reduce((sum, cell) => sum + (cell.id === r.id), 0);
    bots.push(r);
    at(r).bot = r;
  });
  const me = botMap[myData[0]];

  const currentRound = this.currentRound++;
  const maxRound = gameInfoData[1] - 1;

  const zero = new XY(0, 0);
  const neighbors = [new XY(1, 0), new XY(0, 1), new XY(-1, 0), new XY(0, -1)];
  const moves = ["right", "down", "left", "up", "wait"];

  if (!this.setupDone) {
    customSetup(this);
    this.setupDone = true;
  }

  function rand(max = 1, min = 0) {
    return min + Math.random() * (max - min);
  }
  function randInt(max, min = 0) {
    return Math.floor(rand(max, min));
  }
  function roll(chance = 0.5) {
    return Math.random() < chance;
  }

  function separation(id1, id2) {
    return Math.abs(id1 - id2) % 3;
  }

  function value(id, bot = me) {
    return id === bot.id ? 1 : id === 0 ? 4 : id === null ? 0 : [5, 3, 2][separation(bot.id, id)];
  }

  function travelTo(goal, start = me) {
    const relative = goal.sub(start);
    return Math.abs(relative.x) > Math.abs(relative.y) ? (
      relative.x > 0 ? 0 : 2
    ) : (
      relative.y > 0 ? 1 : relative.y < 0 ? 3 : 4
    );
  }
  function travelToList(goal, start = me) {
    const relative = goal.sub(start);
    return [...start.getRealNeighbors(), start].sort((a, b) => (a.chebyshevDistance(goal) - b.chebyshevDistance(goal)) * gridSizeSqr + (a.distance(goal) - b.distance(goal)));
  }

  const swarm = this.swarm;
  const swarmSize = swarm.length;
  const botUID = this.botUID;

  const signalPatterns = [[3, 0, 1, 1, 0], [0, 1, 2, 2, 2, 3, 3, 2, 2, 1], [2, 3, 2, 3, 0, 0, 1, 0, 3, 3]];
  function patternMove(pos, round, ...pattern) {
    const e = pattern[round % pattern.length];
    const f = (e + 2) % 4;
    function calcPos(d) { return pos.add(neighbors[d]); }
    if (calcPos(e).withinBounds()) {
      return e;
    } else {
      return f;
    }
  }
  function signal(uid = botUID, pos = me, round = currentRound) {
    return patternMove(pos, round, ...signalPatterns[uid]);
  }

  if (currentRound) {
    for (var i = 0; i < swarmSize; i++) {
      if (!swarm[i]) {
        const consideredBots = bots.filter(b => !(b.failedSignal & (1 << i)));
        const matchedBots = consideredBots.filter(b => {
          const prevPos = b.lastPosition;
          const expected = neighbors[signal(i, prevPos, currentRound - 1)];
          const performed = b.sub(prevPos);
          const matched = performed.equals(expected);
          if (!matched) {
            b.failedSignal |= (1 << i);
          }
          return matched;
        });
        if (matchedBots.length === 1) {
          swarm[i] = matchedBots[0];
          swarm[i].member = true;
          swarm[i].uid = i;
          this.matchedSize++;
          console.log("Swarm member", i, "found!");
        }
      }
    }
  }

  function findTarget() {
    const lists = [];
    lists.unshift(bots.filter(b => b.removal.candidate));
    lists.unshift(lists[0].filter(b => b.removal.separations[0] === 0));
    lists.unshift(lists[0].filter(b => b.removal.speed === 3));
    lists.unshift(lists[2].filter(b => b.removal.separations[0] === 2));
    const bestList = lists.find(l => l.length);
    if (!bestList) {
      console.log("No more targets!");
      return undefined;
    }
    const bestTarget = bestList.sort((a, b) => b.trespass - a.trespass)[0]; // TODO: Remove sort. TODO: Improve.
    console.log("Best target:", bestTarget);
    return bestTarget;
  }

  if (this.matchedSize === swarmSize) {
    if (!this.connected) {
      bots.forEach(b => {
        const separations = swarm.map(m => separation(b.id, m.id));
        const speed = Math.floor(separations.reduce((sum, val) => sum + (val < 2 ? 1 : 0.5), 0));
        b.removal = {separations: separations, speed: speed, candidate: speed > 1 && !b.member};
      });
      console.log("All connections established.");
      this.connected = true;
    }

    bots.forEach(b => {
      if (b.removal.separations[0] !== 2 && at(b, prevGrid).id === swarm[0].id) {
        b.desecrate++;
      }
      swarm.forEach((m, i) => {
        if (b.removal.separations[i] !== 2 && at(b, prevGrid).id === m.id) {
          b.trespass++;
        }
      });
    });

    if (!this.target || this.target.dead) {
      this.target = findTarget();

      swarm.forEach(b => {
        delete b.partner;
      });

      const sep = this.target.removal.separations;
      const overwriters = [];
      const eraser = [];
      const helpers = []; 
      for (var i = 0; i < swarmSize; i++) {
        if (swarm[i].partner) {
          continue;
        }
        if (sep[i] === 0) {
          overwriters.push(swarm[i]);
        } else if (sep[i] === 1) {
          eraser.push(swarm[i]);
        } else if (sep[i] === 2) {
          for (var j = i + 1; j < swarmSize; j++) {
            if (sep[j] === 2) {
              swarm[j].partner = swarm[i];
              swarm[i].partner = swarm[j];
              eraser.push(swarm[i]);
              break;
            }
          }
          if (!swarm[i].partner) {
            helpers.push(swarm[i]);
          }
        }
      }

      this.chaser = eraser.pop() || overwriters.pop();
      this.cleaners = [...overwriters, ...eraser];
      this.roamers = helpers; // TODO: Make helpers more useful by making them simply target the next guy?
    }

    function findImmediate(target, bot = me) {
      const list = travelToList(target, bot);
      return list.find(p => !at(p).reserved) || list[0];
    }

    grid.forEach(c => c.reserved = 0);
    function reserve(bot, target) {
      if (!bot.target) {
        bot.immediateTarget = findImmediate(target, bot);
        bot.target = target;
        at(bot.immediateTarget).reserved++;
        at(target).reserved++;
      }
    }
    function unreserve(bot) {
      if (bot.target) {
        at(bot.immediateTarget).reserved--;
        at(bot.target).reserved--;
        delete bot.immediateTarget;
        delete bot.target;
      }
    }

    reserve(this.chaser, chase(this.target));

    for (var i = 0; i < swarmSize; i++) {
      const emergency = preserveLife(swarm[i]);
      if (emergency) {
        unreserve(swarm[i]);
        reserve(swarm[i], emergency);
      }
    }

    this.cleaners.forEach(b => reserve(b, clean(b, this.target, this.cleaners)));
    this.roamers.forEach(b => reserve(b, roam(b)));

    const immediateTarget = me.immediateTarget || findImmediate(me.partner.target);
    swarm.forEach(b => unreserve(b));

    return moves[travelTo(immediateTarget)];
  } else {
    return moves[signal()];
  }

  function chase(target) {
    return target;
  }
  function clean(bot, target, cleaners) {
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const closest = Math.min(...cleaners.map(b => b.distance(pos)));
      const distance = bot.distance(pos);
      const wrongness = distance - closest;
      const distanceFromTarget = target.distance(pos);
      if (c.id === target.id && !c.reserved && (wrongness < best.wrongness || (wrongness === best.wrongness && (distance < best.distance || (distance === best.distance && distanceFromTarget > best.distanceFromTarget))))) {
        return {wrongness: wrongness, distance: distance, distanceFromTarget: distanceFromTarget, pos: pos};
      } else {
        return best;
      }
    }, {wrongness: Infinity, distance: Infinity, distanceFromTarget: -Infinity, pos: bot}).pos;
  }
  function roam(bot) {
    const dangerousBots = bots.filter(b => !b.member && separation(b.id, bot.id) !== 2);
    return grid.reduce((best, c, i) => {
      const pos = XY.fromIndex(i);
      const val = value(c.id, bot);
      const distance = bot.distance(pos);
      const comfyness = pos.getNeighbors().reduce((sum, next) => sum + (value(at(next).id, bot) <= 2), 0);
      const closestBotDist = Math.min(...dangerousBots.map(b => b.distance(pos)));
      if (val >= 4 && !swarm.find(m => m.id === c.id) && !c.bot && (distance < best.distance || (distance === best.distance && (val > best.val || (val === best.val && (comfyness > best.comfyness || (comfyness === best.comfyness && closestBotDist > best.closestBotDist))))))) {
        return {distance: distance, val: val, comfyness: comfyness, closestBotDist: closestBotDist, pos: pos};
      } else {
        return best;
      }
    }, {distance: Infinity, val: -Infinity, comfyness: -Infinity, closestBotDist: -Infinity, pos: bot}).pos;
  }
  function preserveLife(bot) {
    if (bot.score < 20) {
      return roam(bot);
    }
  }
}
  },
  {
    "name": "P",
    "func": function (myself, grid, bots, gameInfo) {

"use strict";

if (this.O == null) this.O = {};
const O = this.O;

// console.log(this);

const MAXBOTS = 60;
const MAXSZ = 3 * MAXBOTS;
const MAXID = MAXBOTS + 1;

if (gameInfo[0] == 1) {
    if (bots.length > MAXBOTS) {
        alert("ASSERTION FAILED: MAXBOTS EXCEEDED (contact @tomsmeding)");
        return 0;
    }

    for (const b of bots) {
        if (b[0] < 0 || b[0] > MAXID) {
            alert("ASSERTION FAILED: MAXID EXCEEDED (contact @tomsmeding)");
            return 0;
        }
    }
}

function from_base64(bs) {
    if (bs.length % 4 != 0) throw new Error("Invalid Base64 string");

    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const beta = new Array(256).fill(-1);

    for (let i = 0; i < alpha.length; i++) beta[alpha.charCodeAt(i)] = i;

    const arrbuf = new ArrayBuffer(bs.length / 4 * 3 | 0);
    const buf = new Uint8Array(arrbuf);

    let j = 0;
    for (let i = 0; i < bs.length; i += 4) {
        buf[j++] = (beta[bs.charCodeAt(i+0)] << 2) | (beta[bs.charCodeAt(i+1)] >> 4);
        if (bs[i+2] == "=") break;
        buf[j++] = (beta[bs.charCodeAt(i+1)] << 4) | (beta[bs.charCodeAt(i+2)] >> 2);
        if (bs[i+3] == "=") break;
        buf[j++] = (beta[bs.charCodeAt(i+2)] << 6) | (beta[bs.charCodeAt(i+3)] >> 0);
    }

    return new Uint8Array(arrbuf, 0, j);
}

function repeat(str, times) {
    return new Array(times + 1).join(str);
}

function println_func(ptr) {
    let s = "";
    for (; ptr < O.wa_membuf.length; ptr++) {
        if (O.wa_membuf[ptr] == 0) break;
        s += String.fromCharCode(O.wa_membuf[ptr]);
    }
    console.log(s);
}

function print_int_func(value) {
    console.log(value);
}

function seed_random() {
    for (let i = 0; i < O.wa_rand_state.length; i++) {
        O.wa_rand_state[i] = (Math.random() * 256) & 0xff;
    }
}

function transfer_myself(myself) {
    O.wa_my_id[0] = myself[0];
}

function transfer_grid(grid) {
    const W = grid.length, H = grid[0].length;
    O.wa_width[0] = W;
    O.wa_height[0] = H;
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            O.wa_grid[W * y + x] = grid[x][y];
        }
    }
}

function transfer_bots(bots) {
    O.wa_nbots[0] = bots.length;
    for (let i = 0; i < bots.length; i++) {
        O.wa_bots[3 * i + 0] = bots[i][0];
        O.wa_bots[3 * i + 1] = bots[i][1];
        O.wa_bots[3 * i + 2] = bots[i][2];
    }
}

function transfer_gameInfo(gameInfo) {
    O.wa_round_idx[0] = gameInfo[0];
    O.wa_total_rounds[0] = gameInfo[1];
}

function stringify(thing) {
    if (Array.isArray(thing)) {
        return "[" + thing.map(stringify).join(",") + "]";
    } else if (thing instanceof Int8Array) {
        return "[" + thing.toString() + "]";
    } else {
        return thing.toString();
    }
}

function mc_calcmove() {
    // console.log("mc_calcmove(" + stringify(myself) + "," + stringify(grid) + "," + stringify(bots) + "," + stringify(gameInfo) + ")");
    transfer_myself(myself);
    transfer_grid(grid);
    transfer_bots(bots);
    transfer_gameInfo(gameInfo);
    return ["right", "down", "left", "up", "wait"][O.wa_mc_calcmove()];
    // return O.wa_mc_calcmove();
}

if (O.wasm_bytes == null) {
    O.wasm_bytes = from_base64(
// INSERT-WASM-HERE
"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LmdpdCAwZTAxMjk4NGIwOTkwMzJkZDhhNjUxNTFhNzg4MmMzMDVlMWYzN2I0KSAoaHR0cDovL2xsdm0ub3JnL2dpdC9sbHZtLmdpdCAzZDc2NWNlNGI3ZjJmZDI1YmRiYzBlZmMyNmFmZGY0MmU4NGZlY2IyKQBtYWluLmMAL2hvbWUvdG9tL3BwY2ctMTcwOTA4L3dhc20AcHRycwBfX0FSUkFZX1NJWkVfVFlQRV9fAHdpZHRoAGludABoZWlnaHQAbmJvdHMAcm91bmRfaWR4AHRvdGFsX3JvdW5kcwBteV9pZABncmlkAHVuc2lnbmVkIGNoYXIAdWludDhfdABib3RzAGlkAHgAeQBib3QAcmFuZF9zdGF0ZQB1bnNpZ25lZCBpbnQAdWludDMyX3QAaGF2ZV9iZWVuAF9Cb29sAHByZXZpb3VzX2lzX21lAGJvdF9ldmlsX3Njb3JlAGJvdF9keABib3RfZHkAZGlyX2R4AGRpcl9keQBwbGFjZV9oYXNfYm90AGJvdF9wcmV2cG9zAGhlYXRfbWFwAGZsb2F0AGV2aWxfZmFjdG9yX2NhY2hlAHByZXZfcm91bmRfaWR4AHN0YXRlAGxvbmcgbG9uZyB1bnNpZ25lZCBpbnQAdWludDY0X3QAcF9zZXR1cF9kYXRhAG1lbXNldF94AGRzdF8AdmFsdWUAbgBkc3Q2NABkc3Q4AGkAcG9wdWxhdGVfcHRycwBwX2NhbGNtb3ZlAG1lSWR4AG1heG51bQBtYXhhdABwb3MAbl9fAHBhaW50X3ZhbHVlAGZsb29yAHBfcG9wdWxhdGVfaGVhdG1hcABwX2ZpbGxfZXZpbF9mYWN0b3JfY2FjaGUAY3gAY3kAZHkAZHgAcF9ldmlsX2ZhY3RvcgBzYwBieQBieABqAGQAZGV0ZXJtaW5pc3RpY19yYW5kAHhvcndvdwB0AHMAcF9wYWludFNjb3JlAGlkeABlbnRyeV9mbgBwX2ZpbmRwYXRoAG1vZGUAZGVwdGgAb3JpZ19oYXZlX2JlZW4AAP4OCi5kZWJ1Z19sb2MrAAAAXAAAAAMAEQCfAAAAAAAAAACnAAAABxQAAAMAEACfAAAAAAAAAACnAAAAugAAAAMAEQCfAAAAAAAAAAD3AAAA9wAAAAMAEQCf9wAAAA0BAAADABEBnw0BAAAYAQAAAwARAp8YAQAAIwEAAAMAEQOfIwEAAC4BAAADABEEny4BAAA5AQAAAwARBZ85AQAARAEAAAMAEQafRAEAAE8BAAADABEHn08BAABaAQAAAwARCJ9aAQAAZQEAAAMAEQmfZQEAAHABAAADABEKn3ABAAB7AQAAAwARC597AQAAhgEAAAMAEQyfhgEAAJEBAAADABENn5EBAACcAQAAAwARDp+cAQAApwEAAAMAEQ+fpwEAALIBAAADABEQn7IBAAC9AQAAAwAREZ+9AQAAyAEAAAMAERKfyAEAANMBAAADABEUn9MBAADeAQAAAwARE5/eAQAA6QEAAAMAERWf6QEAAPQBAAADABEWn/QBAAD/AQAAAwARF5//AQAACgIAAAMAERifCgIAABUCAAADABEZnxUCAAAgAgAAAwARGp8gAgAAKwIAAAMAERufKwIAADYCAAADABEcnzYCAABBAgAAAwARHZ9BAgAATAIAAAMAER6fTAIAAAcUAAADABEfnwAAAAAAAAAATAIAAFcCAAADABEAn1cCAABiAgAAAwARAZ9iAgAAbQIAAAMAEQKfbQIAAHgCAAADABEDn3gCAACDAgAAAwARBJ+DAgAAjgIAAAMAEQafjgIAAJkCAAADABEFn5kCAACkAgAAAwARB5+kAgAArwIAAAMAEQifrwIAALoCAAADABEJn7oCAADFAgAAAwARCp/FAgAA0AIAAAMAEQuf0AIAANsCAAADABEMn9sCAADmAgAAAwARDZ/mAgAA8QIAAAMAEQ6f8QIAAPwCAAADABEPn/wCAAAHAwAAAwAREJ8HAwAAEgMAAAMAERGfEgMAAB0DAAADABESnx0DAAAoAwAAAwARE58oAwAAMwMAAAMAERSfMwMAAD4DAAADABEVnz4DAABJAwAAAwARFp9JAwAAVAMAAAMAERefVAMAAF8DAAADABEYn18DAABqAwAAAwARGZ9qAwAAdQMAAAMAERqfdQMAAIADAAADABEbn4ADAACLAwAAAwARHJ+LAwAAlgMAAAMAER2flgMAAKEDAAADABEen6EDAAAHFAAAAwARH58AAAAAAAAAAKEDAACsAwAAAwARAJ+sAwAAtwMAAAMAEQGftwMAAMIDAAADABECn8IDAADNAwAAAwARA5/NAwAA2AMAAAMAEQSf2AMAAOMDAAADABEFn+MDAADuAwAAAwAR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1gUiIAUJWAPdfjwFGAYD0QEgBQEDGVgCAQABAQDDCQdsaW5raW5nAQjWhICAACUAAAIIZW50cnlfZm4BAAZoZWlnaHQDAAQBAAV3aWR0aAIABAECCWhhdmVfYmVlbgsAkP0BAQIOcHJldmlvdXNfaXNfbWUMAJD9AQECDmJvdF9ldmlsX3Njb3JlDQD4AQECBmJvdF9keA4A+AEBAgZib3RfZHkPAPgBAQIGLkwuc3RyAQABABAAABABAQAEcHRycwAAJAEABW5ib3RzBAAEAQAJcm91bmRfaWR4BQAEAQAMdG90YWxfcm91bmRzBgAEAQAFbXlfaWQHAAQBAARncmlkCACQ/QEBAARib3RzCQC0AQEACnJhbmRfc3RhdGUKABQBAg1wbGFjZV9oYXNfYm90EACQ/QEBAgtib3RfcHJldnBvcxEA+AEBAghoZWF0X21hcBUAwPQHAQIRZXZpbF9mYWN0b3JfY2FjaGUSAMD0BwACAwpwX2ZpbmRwYXRoAQIhZGV0ZXJtaW5pc3RpY19yYW5kLnByZXZfcm91bmRfaWR4FgAEAQIaZGV0ZXJtaW5pc3RpY19yYW5kLnN0YXRlLjMaAAQBAhpkZXRlcm1pbmlzdGljX3JhbmQuc3RhdGUuMhkABAECGmRldGVybWluaXN0aWNfcmFuZC5zdGF0ZS4xGAAEAQIaZGV0ZXJtaW5pc3RpY19yYW5kLnN0YXRlLjAXAAQBAhpkZXRlcm1pbmlzdGljX3JhbmQuc3RhdGUuNBsABAECEXBfY2FsY21vdmUuZGlyX2R4EwAQAQIRcF9jYWxjbW92ZS5kaXJfZHkUABADAgUDAgYDAgcDAgkDAgsF2ISAgAAcCS5ic3MucHRycxAADi5yb2RhdGEuLkwuc3RyAQAKLmJzcy53aWR0aAQACy5ic3MuaGVpZ2h0BAAKLmJzcy5uYm90cwQADi5ic3Mucm91bmRfaWR4BAARLmJzcy50b3RhbF9yb3VuZHMEAAouYnNzLm15X2lkBAAJLmJzcy5ncmlkEAAJLmJzcy5ib3RzEAAPLmJzcy5yYW5kX3N0YXRlEAAOLmJzcy5oYXZlX2JlZW4QABMuYnNzLnByZXZpb3VzX2lzX21lEAATLmJzcy5ib3RfZXZpbF9zY29yZRAACy5ic3MuYm90X2R4EAALLmJzcy5ib3RfZHkQ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"
    );

    // require("fs").writeFileSync("reverse-base64-output.txt", Buffer.from(O.wasm_bytes));

    O.memory = new WebAssembly.Memory({initial: 15});
    // O.importObject = {js: {mem: O.memory}, env: {println: println_func}};
    O.importObject = {
        env: {
            println: println_func,
            print_int: print_int_func,
            __linear_memory: O.memory,
            __indirect_function_table: new WebAssembly.Table({initial: 0, element: "anyfunc"}),
        },
    };

    // let wa_membuf, wa_width, wa_height, wa_nbots, wa_round_idx, wa_total_rounds, wa_my_id, wa_grid, wa_bots, wa_rand_state;

    /*const promise = fetch('../out/main.wasm').then(response =>
        response.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, O.importObject)
    );*/
    // const promise = WebAssembly.instantiate(fs.readFileSync("hotpatcher/out.wasm"), O.importObject);
    const promise = WebAssembly.instantiate(O.wasm_bytes, O.importObject);

    promise.then(results => {
        const instance = results.instance;

        // console.log(instance.exports);

        // First set some pointers
        instance.exports.entry_fn(0);

        O.wa_membuf = new Uint8Array(O.memory.buffer);
        const ptrs = new Uint32Array(O.memory.buffer, 0, 9 * 4);

        O.wa_width = new Int32Array(O.memory.buffer, ptrs[0], 1);
        O.wa_height = new Int32Array(O.memory.buffer, ptrs[1], 1);
        O.wa_nbots = new Int32Array(O.memory.buffer, ptrs[2], 1);
        O.wa_round_idx = new Int32Array(O.memory.buffer, ptrs[3], 1);
        O.wa_total_rounds = new Int32Array(O.memory.buffer, ptrs[4], 1);
        O.wa_my_id = new Int32Array(O.memory.buffer, ptrs[5], 1);
        O.wa_grid = new Uint8Array(O.memory.buffer, ptrs[6], MAXSZ * MAXSZ);
        O.wa_bots = new Uint8Array(O.memory.buffer, ptrs[7], MAXBOTS * 3);
        O.wa_rand_state = new Uint8Array(O.memory.buffer, ptrs[8], 5 * 4);

        O.wa_mc_calcmove = function() { return instance.exports.entry_fn(2); }

        seed_random();

        // Signal that we're done setting up, and the wasm code can set itself up
        instance.exports.entry_fn(1);

        O.instantiated = true;
    }).catch(console.error);
}

if (O.instantiated) {
    const start = new Date();
    const output = mc_calcmove();
    const end = new Date();


    if (O.time_sum == null) O.time_sum = 0;
    O.time_sum += end - start;

    return output;
} else {
    return ["right", "down", "left", "up"][Math.random() * 4 | 0];
}

}
  },
  {
    "name": "Unfollowable Follower",
    "func": function(myself, grid, bots, gameInfo) {
    var dirs;
    if(gameInfo[0] == 1) {
      window.localStorage._FCOLOR = 0;
      window.localStorage._FDIR = "";
      window.localStorage._FTR = 0;
      window.localStorage._TROLLC = 0;
      window.localStorage._FDX = 0;
      window.localStorage._FDY = 0;
    }

    var c = myself[0];
    var x = myself[1];
    var y = myself[2];
    var n = grid.length;

    var TROLL_COUNT = 100;
    var TROLL_DIST = 1;

    if(window.localStorage._FTR == 1) {
        return "wait";
    }

    if(window.localStorage._TROLLC >= TROLL_COUNT && window.localStorage._FTR == 0) {
        console.log("UNFOLLOWABLE FOLLOWER: SUICIDE");
        window.localStorage._FTR = 1;
        return "wait";
    }

    function result(color) {
        if(color == 0) return c;
        else return [c, 0, color][Math.abs(c - color)%3];
    }

    var PREV_C = window.localStorage._TROLLC;

    for(var i = 0; i < bots.length; i++) {
        var bot = bots[i];
        if(bot[0] != c && Math.abs(bot[1]-x) + Math.abs(bot[2]-y) <= TROLL_DIST && (result(bot[0]) == 0 || result(bot[0]) == c)) {
            window.localStorage._TROLLC++;
            break;
        }
    }

    if(PREV_C == window.localStorage._TROLLC) {
        window.localStorage._TROLLC = 0;
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 5; _++) {
        var dir = _ == 0 ? window.localStorage._FDIR : dirs.splice(Math.random() * dirs.length |0, 1);
        if(window.localStorage._FCOLOR != 0 && dir == "left" && x != 0 && grid[x-1][y] == window.localStorage._FCOLOR) {
            window.localStorage._FDIR = dir;
            return "left";
        }
        if(window.localStorage._FCOLOR != 0 && dir == "right" && x != n-1 && grid[x+1][y] == window.localStorage._FCOLOR) {
            window.localStorage._FDIR = dir;
            return "right";
        }
        if(window.localStorage._FCOLOR != 0 && dir == "up" && y != 0 && grid[x][y-1] == window.localStorage._FCOLOR) {
            window.localStorage._FDIR = dir;
            return "up";
        }
        if(window.localStorage._FCOLOR != 0 && dir == "down" && y != n-1 && grid[x][y+1] == window.localStorage._FCOLOR) {
            window.localStorage._FDIR = dir;
            return "down";
        }
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0 && grid[x-1][y] != 0 && grid[x-1][y] != c && result(grid[x-1][y]) == c) {
            window.localStorage._FCOLOR = grid[x-1][y];
            window.localStorage._FDIR = dir;
            return "left";
        }
        if(dir == "right" && x != n-1 && grid[x+1][y] != 0 && grid[x+1][y] != c && result(grid[x+1][y]) == c) {
            window.localStorage._FCOLOR = grid[x+1][y];
            window.localStorage._FDIR = dir;
            return "right";
        }
        if(dir == "up" && y != 0 && grid[x][y-1] != 0 && grid[x][y-1] != c && result(grid[x][y-1]) == c) {
            window.localStorage._FCOLOR = grid[x][y-1];
            window.localStorage._FDIR = dir;
            return "up";
        }
        if(dir == "down" && y != n-1 && grid[x][y+1] != 0 && grid[x][y+1] != c && result(grid[x][y+1]) == c) {
            window.localStorage._FCOLOR = grid[x][y+1];
            window.localStorage._FDIR = dir;
            return "down";
        }
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0 && grid[x-1][y] != 0 && grid[x-1][y] != c && result(grid[x-1][y]) == 0) {
            window.localStorage._FDIR = dir;
            return "left";
        }
        if(dir == "right" && x != n-1 && grid[x+1][y] != 0 && grid[x+1][y] != c && result(grid[x+1][y]) == c) {
            window.localStorage._FDIR = dir;
            return "right";
        }
        if(dir == "up" && y != 0 && grid[x][y-1] != 0 && grid[x][y-1] != c && result(grid[x][y-1]) == c) {
            window.localStorage._FDIR = dir;
            return "up";
        }
        if(dir == "down" && y != n-1 && grid[x][y+1] != 0 && grid[x][y+1] != c && result(grid[x][y+1]) == c) {
            window.localStorage._FDIR = dir;
            return "down";
        }
    }

    //window.localStorage._FCOLOR = 0;
    window.localStorage._FDIR = "";

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0 && grid[x-1][y] == 0) return "left";
        if(dir == "right" && x != n-1 && grid[x+1][y] == 0) return "right";
        if(dir == "up" && y != 0 && grid[x][y-1] == 0) return "up";
        if(dir == "down" && y != n-1 && grid[x][y+1] == 0) return "down";
    }

    if(window.localStorage._FDX == 0 && window.localStorage._FDY == 0) {
      window.localStorage._FDX = Math.random() * n | 0;
      window.localStorage._FDY = Math.random() * n | 0;
      //console.log("DESTINATION: " + window.localStorage._FDX + ", " + window.localStorage._FDY);
    }

    if(x > window.localStorage._FDX) return "left";
    if(x < window.localStorage._FDX) return "right";
    if(y > window.localStorage._FDY) return "up";
    if(y < window.localStorage._FDY) return "down";
    window.localStorage._FDX = window.localStorage._FDY = 0;
    if(x != 0) return "left";
    if(x != n-1) return "right";
    if(y != 0) return "up";
    if(y != n-1) return "down";
    return "wait";
}
  },
  {
    "name": "Muncher",
    "func": function(myself, grid, bots, gameInfo) {
    const W = grid.length, H = grid[0].length;
    const rounds_left = gameInfo[1] - gameInfo[0];
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    function rank_square([x, y]) {
        if (grid[x][y] == myself[0]) return 3;
        if (grid[x][y] == 0) return 1;
        var value = Math.abs(grid[x][y] - myself[0]) % 3;
        if (value) value += 1;
        return value;
    }


    function select_long_paths() {
        const ranked = directions.map(to_coords).filter(legal).map((coords)=>{
            return calculate_min_score(4, [coords]);
        });
        const min = Math.min(...ranked);
        const result = directions.filter((dir, index)=>{return ranked[index] == min;});
        return result;
    }

    function new_coords([x, y], path) {
        const last_coords = path[path.length - 1];
        return [x + last_coords[0], y + last_coords[1]]; 
    }

    function calculate_min_score(num_steps, path_so_far) {
        if (!num_steps) return 0;
            var scores = directions.map((dir)=>{
            return new_coords(dir, path_so_far);
        }).filter(legal).filter((coords)=>{
            var i;
            for (i = 0; i < path_so_far.length; i++) {
                if (path_so_far[i] == coords) return false;
            }
            return true;
        }).map((coords)=>{
            var new_path = path_so_far.slice();
            new_path.push(coords);
            return rank_square(coords) + calculate_min_score(num_steps - 1, new_path);
        });
        return Math.min(...scores);
    }

    function to_coords([x, y]) {
        return [x + myself[1], y + myself[2]];
    }

    function legal([x, y]) {
        return 0 <= x && x < W && 0 <= y && y < H;
    }

    function filter_by_strength(dirs) {
        const ranked = dirs.map(to_coords).filter(legal).map(rank_square);
        const min = Math.min(...ranked);
        const result = dirs.filter((dir, index)=>{return ranked[index] == min;});
        return result;
    }

    function convert([x, y]) {
        x += myself[1];
        y += myself[2];

        if (x > myself[1]) return "right";
        if (x < myself[1]) return "left";
        if (y < myself[2]) return "up";
        return "down";
    }

    const options = select_long_paths();
    const choices = filter_by_strength(options);

    return convert(choices[Math.random() * choices.length |0]);
}
  },
  {
    "name": "bounce 2",
    "func": function([id,x,y],map,bots,[round]){
    var {length:width,0:{length:height}}=map;
    if(round===1){
        this.last_pos=Array(bots.length);
        this.waiting=Array(bots.length).fill(0);
        this.following=Array(bots.length).fill(0);
    }

    for(var [bot,bx,by] of bots){
        if(id!==bot && this.last_pos[bot]){
            //check for trollbot
            if(dist(x,y,bx,by)<3 && this.stuck!==bot){
                if(this.following[bot]++>5){
                    //commit suicide by leading trollbot to this bot's colored areas
                    var target=manhattan_search(x,y,width,(x,y)=>
                        map[x] && map[x][y]===id
                    );
                    if(target)
                        return ["left",["up","wait","down"][Math.sign(target.y-y)+1],"right"][Math.sign(target.x-x)+1];
                }
            }else
                this.following[bot]=0;
            //check for bots that haven't moved in a while
            if(x==bx && y==by)
                this.waiting[bot]=-100;
            else if(this.last_pos[bot].x==bx && this.last_pos[bot].y==by){
                //move towards stuck bot
                if(this.waiting[bot]++>50){
                    this.stuck=bot;
                    this.vx=Math.sign(bx-x);
                    this.vy=Math.sign(by-y);
                }
            }else
                this.waiting[bot]=0;
        }
        this.last_pos[bot]={x:bx,y:by};
    }

    //always move "diagonally"
    if(!this.vx)
        this.vx=1
    if(!this.vy)
        this.vy=-1

    //bounce off edges
    if(x===0)
        this.vx=1
    else if(x===width-1)
        this.vx=-1
    if(y===0)
        this.vy=1
    else if(y===height-1)
        this.vy=-1
    //choose direction
    return round%2?
    ["left",["up","wait","down"][this.vy+1],"right"][this.vx+1]:
    ["up",["left","wait","right"][this.vx+1],"down"][this.vy+1];


    function manhattan_search(x,y,board_size,callback){
        var dest_x,dest_y;
        if(callback(x,y))
            return {x:x,y:y};
        try{
            for(var dist=1;dist<board_size*2;dist++){
                check(0, dist); //x+
                check(0,-dist); //x-
                check( dist,0); //y+
                check(-dist,0); //y-
                for(var i=1;i<dist;i++){
                    check( i,  dist-i ); //++
                    check(-i,  dist-i ); //-+
                    check( i,-(dist-i)); //+-
                    check(-i,-(dist-i)); //--
                }
            }
            return undefined;
        }catch(e){
            return {x:dest_x,y:dest_y};
        }
        function check(vx,vy){
            dest_x=x+vx;
            dest_y=y+vy;
            if(callback(dest_x,dest_y))
                throw undefined;
        }
    }

    function dist(x,y,x2,y2){
        return Math.abs(x-x2)+Math.abs(y-y2);
    }
}
  },
  {
    "name": "Feudal Noble",
    "func": function (me, board, painters, info) {
    let meX = me[1], meY = me[2], round = info[0], size = board.length, sectionSize = Math.ceil(size / 3), storage, storageKey = 'jijdfoadofsdfasz', section;

    if (round === 1 || typeof this[storageKey] === 'undefined') {
        let bounds = [
            [0, 0, sectionSize - 1, sectionSize - 1],
            [sectionSize, 0, (sectionSize * 2) - 1, sectionSize - 1],
            [sectionSize * 2, 0, size - 1, sectionSize - 1],
            [sectionSize * 2, sectionSize, size - 1, (sectionSize * 2) - 1],
            [sectionSize * 2, sectionSize * 2, size - 1, size - 1],
            [sectionSize, sectionSize * 2, (sectionSize * 2) - 1, size - 1],
            [0, sectionSize * 2, sectionSize - 1, size - 1],
            [0, sectionSize, sectionSize - 1, (sectionSize * 2) - 1],
        ];
        section = bounds[(sectionSize + painters[0][1]) % 8];
        storage = this[storageKey] = {section: section, mode: 0, move: 1};
    } else {
        storage = this[storageKey];
        section = storage.section;
    }

    let isInSection = function (x, y, section) {
        return (x >= section[0] && y >= section[1] && x <= section[2] && y <= section[3]);
    };

    if (isInSection(meX, meY, section)) {
        let mode = storage.mode, move = storage.move, nextY, nextX;

        if (mode === 0) {
            if (meX <= section[0]) mode = 1;
            else if (meY <= section[1]) mode = 2;
            else if (meX >= section[2]) mode = 3;
            else if (meY >= section[3]) mode = 4;
            storage.mode = mode;
        }

        if (mode === 1) {
            nextY = meY + move;
            if (nextY < section[1] || nextY > section[3]) {
                nextX = meX + 1;
                if (nextX > section[2]) {
                    storage.mode = (nextY < section[1] ? 2 : 4);
                    storage.move = -1;
                    return 'left';
                } else {
                    storage.move *= -1;
                    return 'right';
                }
            } else {
                return (move > 0 ? 'down' : 'up');
            }
        } else if (mode === 2) {
            nextX = meX + move;
            if (nextX < section[0] || nextX > section[2]) {
                nextY = meY + 1;
                if (nextY > section[3]) {
                    storage.mode = (nextX < section[0] ? 1 : 3);
                    storage.move = -1;
                    return 'up';
                } else {
                    storage.move *= -1;
                    return 'down';
                }
            } else {
                return (move > 0 ? 'right' : 'left');
            }
        } else if (mode === 3) {
            nextY = meY + move;
            if (nextY < section[1] || nextY > section[3]) {
                nextX = meX - 1;
                if (nextX < section[0]) {
                    storage.mode = (nextY < section[1] ? 2 : 4);
                    storage.move = 1;
                    return 'right';
                } else {
                    storage.move *= -1;
                    return 'left';
                }
            } else {
                return (move > 0 ? 'down' : 'up');
            }
        } else if (mode === 4) {
            nextX = meX + move;
            if (nextX < section[0] || nextX > section[2]) {
                nextY = meY - 1;
                if (nextY < section[1]) {
                    storage.mode = (nextX < section[0] ? 1 : 3);
                    storage.move = 1;
                    return 'down';
                } else {
                    storage.move *= -1;
                    return 'up';
                }
            } else {
                return (move > 0 ? 'right' : 'left');
            }
        }

        return 'wait';
    } else {
        let dX = ((section[0] + section[2]) / 2) - meX, dY = ((section[1] + section[3]) / 2) - meY;
        if (Math.abs(dX) > Math.abs(dY)) return (dX < 0 ? 'left' : 'right');
        else return (dY < 0 ? 'up' : 'down');
    }
}
  },
  {
    "name": "ClaimEverything",
    "func": function (myself, grid, bots, gameInfo) {
            let my_c = myself[0], my_x = myself[1], my_y = myself[2], size = grid.length, roundnum = gameInfo[0];

            let getDistance = function (x1, y1, x2, y2) {
                return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
            };

            let getColorValue = function (color) {
                if (color === 0) {
                    return my_c;
                }
                return [my_c, 0, color][Math.abs(my_c - color) % 3];
            };

            if (!localStorage.claim) {
                let lastMove = "";
                localStorage.claim = JSON.stringify([lastMove]);
            }
            offsets = JSON.parse(localStorage.claim);
            lastMove = offsets[0];

            let targets = [];
            let distance = 999999;
            let lowestDistance = 999999;
            for (let grid_x = 0; grid_x < size; grid_x++)
            {
                for (let grid_y = 0; grid_y < size; grid_y++)
                {
                    if (grid[grid_x][grid_y] !== my_c && getColorValue(grid[grid_x][grid_y]) === my_c)
                    {
                        distance = getDistance(my_x, my_y, grid_x, grid_y);
                        targets[distance] = [grid_x, grid_y];

                        if (distance < lowestDistance) {
                            lowestDistance = distance;
                        }
                    }
                }
            }
            let target = targets[lowestDistance];

            //Nothing directly paintable available, search for erasable
            if (target === undefined)
            {
                targets = [];
                distance = 999999;
                lowestDistance = 999999;
                for (let grid_x = 0; grid_x < size; grid_x++)
                {
                    for (let grid_y = 0; grid_y < size; grid_y++)
                    {
                        if (grid[grid_x][grid_y] !== my_c && getColorValue(grid[grid_x][grid_y]) !== grid[grid_x][grid_y])
                        {
                            distance = getDistance(my_x, my_y, grid_x, grid_y);
                            targets[distance] = [grid_x, grid_y];

                            if (distance < lowestDistance) {
                                lowestDistance = distance;
                            }
                        }
                    }
                }
            }
            target = targets[lowestDistance];

            let move = "";
            if (target === undefined) {
                move = 'wait';
            } else if (target[0] > my_x) {
                move = 'right';
            } else if (target[0] < my_x) {
                move = 'left';
            } else if (target[1] > my_y) {
                move = 'down';
            } else if (target[1] < my_y) {
                move = 'up';
            } else {
                move = "wait";
            }

            if (move === "wait" && lastMove === "wait") {
                move = "left";
            }

            localStorage.claim = JSON.stringify([move]);

            return move;
        }
  },
  {
    "name": "Leonardo da Pixli",
    "func": function(myself, grid, bots, gameInfo) {
    var ME = this;
    var w='up',a='left',s='down',d='right';
    var ps = [
        [
            16,30,0,11,
            [s,s,d,s,d,d,w,w,w,w,a,a,d,d,d,w,s,s,s,s,s,d,w,w,s,d,s,s,d,s,s,a,s,a,a,s,a,s,s,a,s,s,s,s,s,s,s,a,a,s,d,w,d,s,d,w,d,s,d,w,w,a,a,w,d,w,a,w,d,d,s,w,w,a,a,w,d,w,d,s,w,d,w,d,w,w,w,d,s,s,s,d,s,s,d,s,d,s,d,s,s,s,s,a,s,d,d,w,d,s,d,w,w,a,a,w,d,d,w,a,a,w,d,d,a,w,a,a,a,w,d,d,a,w,a,d,w,w,w,w,d,a,a,a,a,a,a,w,d,d,d,d,d,d,w,a,a,a,a,a,w,d,d,d,d,w,a,a,a,a,a,w,a,d,d,d,d,d,d,d,w,a,a,a,a,a,a,a,w,d,d,d,d,d,d,d,d,w,w,s,s,a,a,w,a,a,a,a,a,a,w,a,a,a,s,s,w,w,d,d,d,d,d,d,d,d,w,d,d,a,a,a,a,a,a,a,a,d,w,d,d,d,d,d,d,w,a,w,a,s,a,w,a,s,a,a,a,a,s,a,a,w,w,w,w,d,a,w,w,d,w,d,s,d,w,d,s,d,s,d,s,a,a,w,a,s,s,d,d,d,s,a,a]
        ],
        [
            18,26,11,0,
            [w,d,w,d,w,d,d,w,d,d,w,d,d,d,w,d,d,d,d,d,s,d,s,s,s,s,s,a,w,a,w,a,d,s,d,s,s,s,s,s,a,s,s,a,d,s,d,s,d,s,s,s,s,s,s,s,s,s,s,d,a,s,a,w,w,s,a,s,a,w,w,w,s,a,s,s,a,w,a,w,w,w,s,a,a,d,s,s,a,s,a,w,a,w,s,s,a,w,a,s,a,w,a,w,a,d,d,d,w,w,d,a,a,a,s,a,w,a,w,d,w,a,w,d,d,s,w,d,d,s,s,w,d,d,s,d,s,w,w,d,a,a,a,w,a,w,d,d,w,d,a,a,a,w,d,w,d,d,d,w,d,s,d,d,d,s,d,s,s,w,w,a,w,a,a,a,a,a,a,a,s,a,a,a,s,a,s,a,w,w,d,w,a,d,w,d,w,d,d,w,a,d,w,w,a,d,d,d,s,s,w,w,d,w,a,d,d,d,s,d,s,s,s,w,w,d,w,a,w,a,w,a,w,a,s,a,w,a,s,a,w,a,s,a,s,d,s,d,w,a,a,a,s,a,s,d,a,w,a,w,w,w]
        ],
        [
            21,24,11,0,
            [d,s,d,s,s,d,d,s,a,s,s,s,w,w,a,w,a,s,s,s,a,w,d,w,w,a,w,w,a,w,a,a,s,d,d,s,s,a,w,w,a,a,s,d,s,s,a,w,a,s,s,d,s,s,s,d,a,a,a,s,a,a,s,s,a,s,s,s,d,d,w,a,w,w,d,w,d,s,w,w,d,s,d,w,s,d,s,a,d,d,d,d,d,d,d,w,w,w,a,a,a,a,d,d,d,d,s,s,d,w,d,d,s,s,d,s,s,s,a,a,w,d,w,w,a,w,a,s,a,a,s,a,a,a,a,a,a,s,d,d,d,d,d,d,s,a,a,a,a,a,a,s,d,d,d,d,d,d,s,d,s,d,s,s,d,d,s,d,d,a,a,a,a,w,a,s,a,w,w,d,w,a,a,s,w,w,a,s,w,a,a,s,a,s,a,s,s,a,a,a,a,a,a,d,d,w,d,d,d,w,a,w,d,d,d,d,d,w,a,a,a,a,a]
        ],
        [
            16,16,7,0,
            [a,a,s,a,a,s,a,s,a,s,s,a,s,s,s,s,s,s,d,s,d,s,s,d,s,d,d,d,d,d,d,d,d,d,w,d,w,w,d,w,d,w,w,w,w,w,w,a,w,w,a,w,a,w,a,a,w,a,a,a,a,d,s,d,s,a,s,a,s,a,a,a,w,s,d,s,d,a,s,s,s,a,s,d,d,s,a,a,w,a,a,s,d,d,s,a,w,d,d,d,d,s,s,w,w,d,d,d,s,s,w,w,d,d,d,s,d,d,w,w,a,s,a,w,a,a,d,d,w,a,w,w,w,a,w,d,d,w,s,a,a,a,w,a,s]
        ],
        [
            16,14,15,0,
            [a,a,s,a,s,s,d,d,w,d,s,s,s,s,s,s,s,s,s,s,s,a,w,w,w,w,w,w,w,w,w,a,s,s,s,s,s,s,s,s,a,w,w,w,w,w,w,a,w,d,w,a,w,w,a,s,s,s,a,w,w,w,a,s,s,s,s,s,w,a,w,w,w,w,s,a,a,s,d,s,s,a,w,s,s,a,w,s,s,s,s,d,s,d,d,d,d,w,d,d,w,s,s,s,s,a,w,w,a,s,s,a,w,a,s,a,w,a,a,w,a,w,w,w,w,a,s,s,s,s,w,a,w,w,w,a,s,w,w,w,w,d,d,s,w,w,a,d,d,w,a,d,d,w,d,s,w,d,w,d,d,d,d,d]
        ],
        [
            14,14,2,6,
            [w,a,s,a,s,d,s,a,s,d,s,a,s,d,s,a,s,w,w,d,d,w,w,w,d,s,s,s,s,d,s,d,w,w,a,w,d,w,a,w,d,w,a,d,w,w,w,w,a,w,a,a,a,s,w,d,d,w,d,d,s,w,w,d,s,s,s,s,s,s,s,s,s,s,s,d,w,w,w,w,w,w,d,s,a,s,s,d,s,s,s,s,s,d,w,w,w,w,w,d,s,s,s,s,w,d,d,s,d,s,w,w,w,a,a,w,d,d,w,a,a,a,w,d,d,d,w,a,a,w,d,w,a,w,d,a,w,a,s,w,w,a,s,a,w,w,a,s,s,s,w]
        ],
        [
            16,27,2,11,
            [a,s,s,s,s,d,a,a,s,s,s,s,s,s,s,s,d,d,d,w,w,w,a,d,d,w,s,a,s,s,s,a,a,a,s,d,s,d,s,d,d,d,d,d,d,d,d,d,d,d,d,w,d,w,w,w,w,w,a,w,a,a,a,a,a,s,w,d,d,d,w,w,w,a,a,a,a,a,a,a,a,a,s,s,a,d,w,w,d,d,d,d,d,d,d,d,d,d,w,w,w,w,a,w,d,w,d,w,w,w,a,a,a,w,w,d,d,w,d,a,w,a,s,a,w,a,s,a,s,s,s,w,w,w,a,a,a,s,a,d,w,d,d,w,d,d,w,w,w,a,a,a,a,s,a,a,s,a,s,a,s,s,s,d,d,d,s,s,d,a,s,w,a,w,w,a,a,a,s,s,s,s,d,s,d,d,d,d,d,w,d,w,s,s,d,w,s,d,d]
        ],
        [
            20,20,5,10,
            [a,s,d,s,d,s,a,a,w,a,s,s,a,s,d,d,w,d,s,d,w,d,s,s,d,s,a,a,w,a,s,a,w,a,s,a,w,a,s,s,a,s,d,d,w,d,s,d,w,d,s,d,w,d,s,d,w,d,s,d,w,d,s,d,w,d,s,d,w,d,s,d,w,d,s,d,d,w,a,w,w,a,s,a,w,a,s,a,w,a,s,a,a,w,d,w,w,d,s,d,w,d,s,d,d,w,a,w,w,a,s,a,a,w,d,w,d,w,a,w,w,a,s,a,w,a,s,a,w,a,s,a,w,a,s,a,a,w,d,w,w,d,s,d,w,d,s,d,w,d,s,d,d,w,a,w,w,a,s,a,w,a,s,a,a,w,d,w,w,d,s,d,d,w,a,w,w,a,s]
        ]
    ];
    if(ME.c === undefined){
        ME.c = 9999;
        ME.t = [];
        ME.n = Math.floor(Math.random()*Math.floor(ps.length));
    }
    if(gameInfo[0] == 1 && myself[1] < grid.length-ps[ME.n][0]+ps[ME.n][2] && myself[1] > ps[ME.n][2] && myself[2] < grid.length-ps[ME.n][1]+ps[ME.n][3] && myself[2] > ps[ME.n][3]){
        ME.c = 0;
    }
    if(ps[ME.n][4][ME.c] !== undefined){
        return ps[ME.n][4][ME.c++];
    }
    else if(ME.c < 9999){
        ME.c = 9999;
        ME.n = Math.floor(Math.random()*Math.floor(ps.length));
    }
    if(ME.t.length == 0){
        var rand = [
                [parseInt(Math.random()*(grid.length-ps[ME.n][0]))+ps[ME.n][2],parseInt(Math.random()*(grid.length-ps[ME.n][1]))+ps[ME.n][3]],
                [parseInt(Math.random()*(grid.length-ps[ME.n][0]))+ps[ME.n][2],parseInt(Math.random()*(grid.length-ps[ME.n][1]))+ps[ME.n][3]],
                [parseInt(Math.random()*(grid.length-ps[ME.n][0]))+ps[ME.n][2],parseInt(Math.random()*(grid.length-ps[ME.n][1]))+ps[ME.n][3]]
            ],
            colorable = [0,0,0],
            i, j, k;
        for(i=0;i<rand.length;i++){
            for(j=rand[i][0]-ps[ME.n][2];j<rand[i][0]-ps[ME.n][2]+ps[ME.n][0];j++){
                for(k=rand[i][1]-ps[ME.n][3];k<rand[i][1]-ps[ME.n][2]+ps[ME.n][1];k++){
                    if(grid[j][k] == 0 || (grid[j][k] != myself[0] && grid[j][k]%3 == 0)){
                        colorable[i]++;
                    }
                }
            }
        }
        if(colorable[0] >= colorable[1] && colorable[0] >= colorable[2]){
            ME.t = [rand[0][0],rand[0][1]];
        }
        else if(colorable[1] >= colorable[2]){
            ME.t = [rand[1][0],rand[1][1]];
        }
        else{
            ME.t = [rand[2][0],rand[2][1]];
        }
    }
    if(ME.t[0] > myself[1]){
        return 'right';
    }
    else if(ME.t[0] < myself[1]){
        return 'left';
    }
    else if(ME.t[1] > myself[2]){
        return 'down';
    }
    else if(ME.t[1] < myself[2]){
        return 'up';
    }
    else{
        ME.t = [];
        ME.c = 0;
    }
}
  },
  {
    "name": "Big Game Hunter",
    "func": function(myself, grid, bots, gameInfo) {
    let myC = myself[0];
    let myX = myself[1];
    let myY = myself[2];

    function distance(a, b) {
        return Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
    }

    function isTheMostDangerousGame(c) {
      return c != 0 && Math.abs(myC - c) % 3 == 2;
    }

    let scores = Array(bots.length + 2).fill(0);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            scores[grid[i][j]]++;
        }
    }
    scores[0] = 0;

    let positions = {};
    let maxScore = 0;
    let target = null;
    for (let i = 0; i < bots.length; i++) {
        positions[bots[i][0]] = bots[i];
        if (scores[bots[i][0]] >  maxScore) {
            maxScore = scores[bots[i][0]];
            target = bots[i];
        }
    }

    if (!!this.target && gameInfo[0] > 1) {
        let prevTargetScore = scores[this.target[0]];
        let prevTargetScoreGoal = this.targetScoreGoal;
        if (prevTargetScore > prevTargetScoreGoal) {
            target = [this.target[0], positions[this.target[0]][1], positions[this.target[0]][2]];
        }
    }

    if (target) {
        this.target = target;
        this.targetScoreGoal = Math.max(maxScore - bots.length, maxScore * 8 / 9);
    }

    if (!target) {
        target = [0, grid.length / 2, grid.length / 2];
    }

    if (isTheMostDangerousGame(target[0])) {
        let bestDistanceFromTarget= Number.MAX_SAFE_INTEGER;
        let bestDistanceFromMe = Number.MAX_SAFE_INTEGER;
        let newTarget = null;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if (Math.abs(myC - grid[i][j]) % 0 != 2) {
                    if (myC != grid[i][j]) {
                        let spot = [0, i, j];
                        let distanceFromMe = distance(myself, spot);
                        let distanceFromTarget = distance(target, spot);
                        if (Math.abs(myC - grid[i][j]) % 0 == 1) {
                            distanceFromMe++;
                            distanceFromTarget++;
                        }
                        if (distanceFromMe <= distanceFromTarget && distanceFromTarget < bestDistanceFromTarget) {
                            if (distanceFromMe <= bestDistanceFromMe || distanceFromTarget * 3 / 2 < bestDistanceFromTarget) {
                                bestDistanceFromMe = distanceFromMe;
                                bestDistanceFromTarget = distanceFromTarget;
                                newTarget = spot;
                            }
                        }
                    }
                }
            }
        }
        if (newTarget) {
            target = newTarget;
        }
    }

    if (Math.abs(myX - target[1]) > Math.abs(myY - target[2])) {
        if (myX < target[1]) {
            return "right";
        }
        if (myX > target[1]) {
            return "left";
        }
    }
    if (myY < target[2]) {
        return "down";
    }
    if (myY > target[2]) {
        return "up";
    }
    return "wait";
}
  },
  {
    "name": "HeatBot",
    "func": function(myself, grid, bots, gameInfo) {
    [myC, myX, myY] = myself;
    let heatMap = null;
    if (!this.heatMap) {
        heatMap = Array(grid.length).fill().map(() => new Float32Array(grid.length).fill(0));
    } else {
        heatMap = this.heatMap;
    }

    function isValidPosition(x, y) {
        return x >= 0 && y >= 0 && x < grid.length && y < grid.length;
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j] == 0 || (myC != grid[i][j] && Math.abs(myC - grid[i][j]) % 3 == 0)) {
                heatMap[i][j] /= 2;
            }
        }
    }

    for (let i = 0; i < bots.length; i++) {
        heatMap[bots[i][1]][bots[i][2]] += 1;
    }

    let heatDelta = Array(grid.length).fill().map(() => new Float32Array(grid.length).fill(0));

    function transferHeat(x0, y0, x1, y1) {
        if (isValidPosition(x1, y1)) {
            let heat0 = heatMap[x0][y0];
            let heat1 = heatMap[x1][y1];
            if (heat0 > heat1) {
                let dt = heat0 - heat1;
                let q = dt * 0.001;
                heatDelta[x0][y0] -= q;
                heatDelta[x1][y1] += q;
            }
        }
    }

    for (let steps = 0; steps < 3; steps++) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                transferHeat(i, j, i - 1, j);
                transferHeat(i, j, i + 1, j);
                transferHeat(i, j, i, j - 1);
                transferHeat(i, j, i, j + 1);
                transferHeat(i, j, i - 1, j + 1);
                transferHeat(i, j, i + 1, j - 1);
                transferHeat(i, j, i - 1, j - 1);
                transferHeat(i, j, i + 1, j + 1);
            }
        }

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                heatMap[i][j] += heatDelta[i][j];
                heatDelta[i][j] = 0;
            }
        }
    }

    let bestMove = "wait";
    let lowestHeat = Number.MAX_SAFE_INTEGER;
    let allMoves = [["up", myX, myY - 1], ["down", myX, myY + 1], ["left", myX - 1, myY], ["right", myX + 1, myY]];
    for (let i = 0; i < allMoves.length; i++) {
        if (isValidPosition(allMoves[i][1], allMoves[i][2])) {
            let heat = heatMap[allMoves[i][1]][allMoves[i][2]];
            if (heat < lowestHeat) {
                lowestHeat = heat;
                bestMove = allMoves[i][0];
            }
        }
    }

    this.heatMap = heatMap;
    return bestMove;
}
  },
  {
    "name": "John",
    "func": function([mc, mx, my], grid, bots, [round, maxRound]) {const ID = 0;
  var S = this;
  const botAm = 3;
  function log(...args) {
    // if (round > 1) console.log(ID+" "+args[0], ...args.slice(1));
    return true;
  }
  if (round == 1) {
    var all = new Array(bots.length).fill().map((_,i)=>i+1);
    S.fs = new Array(botAm).fill().map(c =>
      [all.slice(), all.slice(), all.slice(), all.slice()]
    );
    S.doneSetup = false;
    var center = grid.length/2;
    // UL=0; DL=1; DR=2; UR=3
    S.dir = mx<center? (my<center? 0 : 1) : (my<center? 3 : 2);
    S.job = 0;
    S.botAm = bots.length;
    S.keys = [[1,1,0,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,0],
              [0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1,0,0,0,1,1],
              [1,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0]];
    /*if (ID == 2) */{
      S.chased = 0;
      S.ignore = [];
      S.badMoves = 0;
      S.pastMoves = new Array(100).fill("-1;0");
      S.timer = 0;
      S.jimFn = function([mc, mx, my], grid, bots, [round, maxRound]) { // ---------- BEGIN JIM ---------- \\
        var output;
        var allowRetracing = false;

        var checkSize = 3;
        var eatSize = 5;
        var myScore;
        var scoreboard;



        if (grid[mx][my] == 0 && !bots.some(([col, bx, by])=> col != mc && bx==mx && by==my)) return "wait"; // collect those sweet points

        // rescore every now and then
        if (S.timer > 200) rescore();

        S.pastMoves.push(mx+";"+my);
        S.pastMoves.shift();


        var orth = [[-1,0],[0,-1],[1,0],[0,1]];
        if (S.atTarget
        || S.targetX === undefined || S.targetY === undefined
        || S.targetX === mx && S.targetY === my
        || orth.map(([x,y])=>[mx+x,my+y]).filter(c=>get(c)==0 && inbounds(c)).length > 2) {

          S.atTarget = true;
          var neighbors = orth
            .map(([x,y]) => [x+mx, y+my])
            .filter(inbounds)
            .filter(([x,y]) => !bots.some(([bid, bx, by]) => bx==x && by==y))
            .map(c=>[c,get(c)]);

          let test = (neighbors, f, msg) => {
            return bestOf(neighbors.filter(f).map(c=>c[0])) && log(msg);
          }

          if (test(neighbors, ([,c]) => c===0        , "good")) return output;
          if (test(neighbors, ([,c]) => overMap(c, 1),  "sad")) return output;

          S.atTarget = false;
          S.targetX = S.targetY = undefined;
          let bestScore = 7;
          let bfscore = 0;

          for (let dist = 4; dist < 8; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds([cx, cy])) {
                  let score = scoreOf(cx, cy, 1, false);
                  if(score>bfscore)bfscore=score;
                  if (score > bestScore) {
                    bestScore = score;
                    S.targetX = cx;
                    S.targetY = cy;
                  }
                }
              }
            }
          }
          if (S.targetX) {
            log("short goto", S.targetX, S.targetY,"(rel",S.targetX-mx, S.targetY-my,") score", bestScore);
            return to([S.targetX, S.targetY]);
          } else log("long goto",bfscore);


          rescore();
          return to([S.targetX, S.targetY]);
        } else log("going to target", S.targetX, S.targetY);

        return to([S.targetX, S.targetY]);

        function myScore() {
          if (!myScore) calculateScoreboard();
          return myScore;
        }
        function calculateScoreboard() {
          scoreboard = grid.map(column=> {
            var arr = new Int16Array(grid.length);
            column.forEach((c, x) => (
              myScore+= c==mc,
              arr[x] = overMap(c, 1, 0, 0, 0, 5)
            ));
            return arr;
          });
          for (let [bc, bx, by] of bots) if (bc != mc) {
            scoreboard[bx][by] = -100;
            if (inbounds([bx-2, by])) scoreboard[bx-2][by] = -50;
            if (inbounds([bx+2, by])) scoreboard[bx+2][by] = -50;
            if (inbounds([bx, by-2])) scoreboard[bx][by-2] = -50;
            if (inbounds([bx, by+2])) scoreboard[bx][by+2] = -50;
          }
        }
        function scoreOf (x, y, size, includeEnemies) {
          if (!scoreboard) calculateScoreboard();
          let score = 0;
          for (let dx = -size; dx <= size; dx++) {
            let cx = dx + x;
            if (cx < 1 || cx >= grid.length-1) continue;
            for (let dy = -size; dy <= size; dy++) {
              let cy = dy + y;
              if (cy < 1 || cy >= grid.length-1) continue;
              let cs = scoreboard[cx][cy];
              if (cs > 0 || includeEnemies) score+= cs;
            }
          }
          return score;
        }
        function rescore() { // heatmap of best scoring places
          //log(JSON.stringify(scoreboard));
          S.bestScore = -Infinity;
          var blur = grid.map((column, x)=>column.map((c, y) => {
            let score = scoreOf(x, y, checkSize, true);
            if (score > S.bestScore) {
              S.bestScore = score;
              S.targetX = x;
              S.targetY = y;
            }
            return score;
          }));
          S.atTarget = false;
          S.timer = 0;
          S.bestScore = scoreOf(S.targetX, S.targetY, eatSize);
          S.badMoves = 0;
          // log("scored to", S.targetX, S.targetY, S.bestScore);
        }
        function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
          let res = Math.abs(mc-col) % 3;
          return res==1? 0 : res==0? 1 : -1;
        }
        function overMap(col, best = 0, good = 0, bad = 0, mine = 0, zero = 0) { // best if overrides happen, bad if overrides don't happen, good if override = 0
          let res = Math.abs(mc-col) % 3;
          return col == 0? zero : col == mc? mine : res==1? good : res==0? best : bad;
        }
        function iwin   (col) { return over(col) == 1; }
        function zeroes (col) { return over(col) == 0; }
        function to([x, y]) {
          //debugger
          var LR = x > mx? [mx+1, my] : x < mx? [mx-1, my] : null;
          var UD = y > my? [mx, my+1] : y < my? [mx, my-1] : null;
          if (LR && UD) {
            var LRScore = overMap(LR, 1, 0, 0, 0, 3);
            var UDScore = overMap(UD, 1, 0, 0, 0, 3);
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
            score-= Math.sqrt((x-S.targetX)**2 + (y-S.targetY)**2);
            if (S.pastMoves.includes(x+";"+y)) score-= 1000000;

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
      } // ---------- END JIM ---------- \\
    }
  }
  const dirs = ['up','left','down','right'];

  if (!S.doneSetup) { // ---------- HANDSHAKE ---------- \\
    let finished = 0;
    if (round != 1) {
      for (let id = 0; id < botAm; id++) {
        let f = S.fs[id];
        let remaining = f.map(c=>c.length).reduce((a,b)=>a+b);
        if (remaining == 1) {
          finished++;
          continue;
        }
        if (remaining == 0) {
          // mourn the loss of a good friend
          finished++;
          continue;
        }
        for (let dir = 0; dir < 4; dir++) {
          let possible = f[dir];

          for (let i = possible.length-1; i >= 0; i--) {
            let bc = possible[i];
            let curr =       bots.find(c=>c[0]==bc);
            let prev = S.pastBots.find(c=>c[0]==bc);
            let dx = curr[1]-prev[1];
            let dy = curr[2]-prev[2];
            let move;
            if (dy == 0) {
              if (dx == 1) move = 'right';
              else         move = 'left';
            } else {
              if (dy == 1) move = 'down';
              else         move = 'up';
            }
            let omove = rotate(move, dir);
            let expected = ['down','right'][S.keys[id][round-1]];
            // if (id == 0 && dir == S.dir) log();
            if (omove != expected) possible.splice(i,1);
          }
        }
      }
    }
    S.pastBots = bots;
    if (finished == botAm) {
      S.doneSetup = true;
      S.BCs = new Array(botAm).fill().map((_,i) => (S.fs[i].find(c=>c.length > 0) || [-1])[0]); // AKA idtoc
      S.fighters = S.BCs.slice(0,2);
      S.ctoid = {[S.BCs[0]]:0, [S.BCs[1]]:1, [S.BCs[2]]:2};
      log("identified", S.BCs);
      if (ID == 2) {
        log("can beat", bots.filter(c=>S.fighters.filter(b=>Math.abs(b-c[0])%3 != 2).length > 0).map(c=>c[3]));
      }
    } else {
      // log(ID,S.fs);
      return rotate(['down','right'][S.keys[ID][round]], S.dir);
    }
  }


  if (S.doneSetup && ID == 2) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]);




  if (!bots.find(c=>c[0]==S.fighters[1-ID])) return 'wait'; // for my demise
  if (round < 50 || !bots.find(c=>c[0]==S.BCs[2])) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]); // if Jim's dead, be Jim so others don't win needlessly
  // TODO yeah no

  let tbot = bots.find(c=>c[0] == S.tbotc);


  // ---------- NEW TARGET ---------- \\
  let tried;
  while ((!S.tbotc || !tbot) && !S.finished) {
    if (!tried) tried = S.BCs.slice();
    S.gotoX = S.gotoY = undefined;
    let scores = new Uint32Array(S.botAm+1);
    for (let column of grid) for (let item of column) scores[item]++;
    var bbc, bbs=-Infinity;
    for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && !tried.includes(i)) {
      bbs = scores[i];
      bbc = i;
    }
    S.tbotc = bbc;
    tbot = bots.find(c=>c[0] == bbc);

    S.jobs = [0,0];
    let executers = S.fighters.filter(c=>Math.abs(c-bbc)%3 == 1).concat(S.fighters.filter(c=>Math.abs(c-bbc)%3 == 0));
    if (executers.length > 1) {
      S.jobs[S.ctoid[executers.pop()]] = 1;
      S.jobs[S.ctoid[executers.pop()]] = 2;
      //S.jobs.forEach((c,id) => c==0? S.jobs[id]=2 : 0);
      log("targetting", botName(bbc),"jobs",S.jobs);
    } else {
      // cry
      tried.push(bbc);
      S.tbotc = tbot = undefined;
    }
    S.job = S.jobs[ID];
    if (tried.length >= bots.length) {
      // everyone is dead
      S.job = 0;
      S.jobs = new Array(2).fill(0);
      S.finished = true;
      break;
    }
  }

  if (tbot && !S.finished) {
    let [_, tx, ty] = tbot;

    switch (S.job) {
      case 1: // follow
        return to(tx, ty, S.tbotc);
      break;
      case 2: // erase
        let endingClearing = false;
        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          S.gotoX = undefined;
          var ending = [S.tbotc, ...S.fighters.filter(c=>c != mc)].map(c => bots.find(b=>b[0]==c)).filter(I=>I);
          search: for (let dist = 1; dist < grid.length*2+2; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds(cx, cy)) {
                  if (grid[cx][cy] == S.tbotc && ending.every(([_,bx,by]) => (bx-cx)**2 + (by-cy)**2 > Math.random()*10)) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
          if (S.gotoX === undefined) {
            let available = [];
            grid.forEach((column, x) => column.forEach((c, y) => c==S.tbotc? available.push([x,y]) : 0));
            [S.gotoX, S.gotoY] = available[Math.floor(Math.random()*available.length)];
            endingClearing = true;
          }
        }
        return to(S.gotoX, S.gotoY, endingClearing? undefined : S.tbotc);
      break;
      case 0: // exercise

        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          let scores = new Uint32Array(S.botAm+1);
          for (let column of grid) for (let item of column) scores[item]++;
          var bbc, bbs=-Infinity;
          for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && Math.abs(mc-i)%3 == 0 && !S.BCs.includes(i)) {
            bbs = scores[i];
            bbc = i;
          }
          if (bbc) {
            S.gotoX = undefined;
            search: for (let dist = 1; dist < grid.length*2+2; dist++) {
              for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
                for (let i = 0; i < dist; i++) {
                  let cx = dx*i + dsx*dist + mx;
                  let cy = dy*i + dsy*dist + my;
                  if (inbounds(cx, cy) && grid[cx][cy] == bbc) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
        }
        if (S.gotoX !== undefined) return to(S.gotoX, S.gotoY);
        return dirs[Math.floor(Math.random()*4)];
      break;
    }
  }


  function to (x, y, col) {
    if  (x == mx&&y== my) return 'wait';
    let dx =   x    - mx ;
    let dy =      y - my ;
    let ax = Math.abs(dx);
    let ay = Math.abs(dy);
    var          diag;
    if   (     ax==ay   ) {
      if (col&&ax+ ay==2) {
        let i=[[x, my], [mx, y]].findIndex(c=>grid[c[0]][c[1]]==col);
        if (i<0) diag = Math.random()>=.5;
        else     diag =           i  == 0;
      } else     diag = Math.random()>=.5;
    }
    if (ax==ay?  diag :  ax>ay) {
      if (dx>0) return 'right';
      else      return  'left';
    } else {
      if (dy>0) return  'down';
      else      return    'up';
    }
  }

  function rotate (move, dir) {
    if ((move == 'up' || move == 'down') && (dir && dir<3)) {
      if (move == 'up') return 'down';
      else return 'up';
    }
    if ((move == 'left' || move == 'right') && dir>1) {
      if (move == 'left') return 'right';
      else return 'left';
    }
    return move;
  }
  function botName(id) {
    return bots.find(c=>c[0]==id)[3] + "/" + id;
  }
  function inbounds(x, y) { return x<grid.length && y<grid.length && x>=0 && y>=0 }
}
  },
  {
    "name": "Eraser",
    "func": function([id,x,y],grid,bots){
    function manhattan_search(x,y,board_size,callback){
        var dest_x,dest_y;
        try{
            for(var dist=1;dist<grid.length*2;dist++){
                check(0, dist); //x+
                check(0,-dist); //x-
                check( dist,0); //y+
                check(-dist,0); //y-
                for(var i=1;i<dist;i++){
                    check( i,  dist-i ); //++
                    check(-i,  dist-i ); //-+
                    check( i,-(dist-i)); //+-
                    check(-i,-(dist-i)); //--
                }
            }
            return undefined;
        }catch(e){
            //console.log(e);
            return [dest_x,dest_y];
        }
        function check(vx,vy){
            dest_x=x+vx;
            dest_y=y+vy;
            if(callback(dest_x,dest_y))
                throw undefined;
        }
    }
    function can_erase(x,y){
        if(grid[x]!==undefined && grid[x][y]!==undefined && grid[x][y]!==0 && Math.abs(id-grid[x][y])%3===1){
            for(var i=0;i<bots.length;i++)
                if(bots[i][0]===grid[x][y])
                    break;
            if(bots[i])
                return Math.abs(x-bots[i][1])+Math.abs(y-bots[i][2])>3;
        }
    }

    if(can_erase(x,y))
        return "wait";
    var name=["up","right","down","left"];
    var dx=[0,1,0,-1],dy=[-1,0,1,0];
    dir=this.last_dir-1&3;
    for(var i=1;i<=4;i++){
        if(can_erase(x+dx[dir],y+dy[dir]))
            return name[this.last_dir=dir];
        dir=dir+1&3;
    }
    var dest=manhattan_search(x,y,grid.length,can_erase);
    if(dest){
        return name[this.last_dir=[
            [0,0,1],
            [3,3,1],
            [3,2,2]
        ][Math.sign(dest[1]-y)+1][Math.sign(dest[0]-x)+1]];
    }
    return "left";
}
  },
  {
    "name": "Nice Bot",
    "func": function([id,x,y],map,bots,[round]){
    //set up checked spaces 2d array
    if(round===1)
        this.checked=make_2d_array(map.length,map[0].length);
    else
        //to avoid infinite loops, if previous position is now empty, don't pathfind to it.
        if(map[this.last_pos.x][this.last_pos.y]===0)
            map[this.last_pos.x][this.last_pos.y]=id;
    //console.log(checked);
    //store old position
    this.last_pos={x:x,y:y};
    //don't walk into spaces occupied by other bots
    bots.forEach(([id,x,y])=>{
        if(map[x][y]===0)
            map[x][y]=id;
    });
    //wall following
    var dx=[0,1,0,-1],dy=[-1,0,1,0];
    var dir=this.last_dir-1&3;
    for(var i=1;i<=4;i++){
        if(can_draw_at(x+dx[dir],y+dy[dir]))
            return ["up","right","down","left"][this.last_dir=dir];
        dir=dir+1&3;
    }
    //pathfinding
    fill_2d_array(this.checked,0);
    var spaces=[0,0,0,0];
    var next_level=[],current_level=[];
    var found_space=false;
    var extra_levels=0;
    //check initial surrounding points, with directions
    check(map,this.checked,current_level,x  ,y-1,0);
    check(map,this.checked,current_level,x+1,y  ,1);
    check(map,this.checked,current_level,x  ,y+1,2);
    check(map,this.checked,current_level,x-1,y  ,3);

    while(current_level.length && extra_levels<7){
        if(found_space)
            extra_levels++;
        while(current_level.length){
            [x,y,dir]=current_level.pop();
            check(map,this.checked,next_level,x  ,y-1,dir);
            check(map,this.checked,next_level,x+1,y  ,dir);
            check(map,this.checked,next_level,x  ,y+1,dir);
            check(map,this.checked,next_level,x-1,y  ,dir);
        }
        [current_level,next_level]=[next_level,current_level]; //current_level is empty here
    }
    //find the best direction
    console.log(spaces);
    if(found_space)
        return ["up","right","down","left"][this.last_dir=spaces.indexOf(Math.max(...spaces))];


    //check
    function check(map,checked,list,x,y,dir){
        if(checked[x] && checked[x][y]!==undefined && (checked[x][y] & 1<<dir)===0){
            if(can_walk_on(map[x][y])){
                list.push([x,y,dir]);
                checked[x][y] |= 1<<dir;
                if(map[x][y]===0){
                    found_space=true;
                    spaces[dir]+=1/(extra_levels+0.1);
                }//else
                    //spaces[dir]+=0.1/(extra_levels+0.1);
            }
        }
    }
    //if cell can be walked on without rudely changing the color
    function can_walk_on(floor){
        return floor===0||floor===id||Math.abs(id-floor)%3===2;
    }
    function can_draw_at(x,y){
        return map[x]&&map[x][y]===0;
    }
    //"2D" arrays in JS are so annoying
    function fill_2d_array(array,value){
        array.forEach(column=>column.fill(value));
    }
    function make_2d_array(width,height){
        return Array(width).fill().map(()=>Array(height));
    }
}
  },
  {
    "name": "NearRandomGridBot",
    "func": function randomGrid(myself, grid, bots, gameInfo){
  dir=0;tmp=(grid.length/2)|0;
  for(i=tmp-10;i<tmp+10;i++){
    for(j=tmp-10;j<tmp+10;j++){
      dir=(dir+grid[i][j])
    }
  }
  return ["up","right","down","left"][dir%4];
}
  },
  {
    "name": "DragonBot",
    "func": function dragonCurve(myself, grid, bots, gameInfo){
  dCurve=n=>{
    if(n==0){return "1 "}
    return dCurve(n-1).replace(/(.)(.)/g,"1$10$2")
  }
  [id,x,y]=myself;
  dir=0;
  if(gameInfo[0]==1){
    dragon=dCurve(12);
    if(x<3*bots.length-x){
      if(y<x){dir=0;}
      else if(3*bots.length-y<x){dir=2;}
      else{dir=3;}
    }
    else{
      if(y<3*bots.length-x){dir=0;}
      else if(y>x){dir=2;}
      else{dir=1;}
    }
    window.localStorage.setItem("dragon",dragon);
    window.localStorage.setItem("dragonDir",dir);
    window.localStorage.setItem("dragonStep",0);
    return ["up","right","down","left"][dir];
  }
  dragon=window.localStorage.getItem("dragon")
  dir=window.localStorage.getItem("dragonDir")-0;
  step=window.localStorage.getItem("dragonStep")-0;
  if(gameInfo[0]%2==0){
    return ["up","right","down","left"][dir];
  }
  validStep=false;
  while(!validStep){
    if(-dragon[step]){dir=(dir+1)%4;}
    else{dir=(dir+3)%4;}
    step+=1;
    validStep=((dir==0&&y!=0)||(dir==3&&x!=0)||(dir==1&&x!=3*bots.length-1)||(dir==2&&y!=3*bots.length-1));
  }
  window.localStorage.setItem("dragon",dragon);
  window.localStorage.setItem("dragonDir",dir);
  window.localStorage.setItem("dragonStep",step);
  return ["up","right","down","left"][dir];
}
  },
  {
    "name": "The Follower",
    "func": function(myself, grid, bots, gameInfo) {
    var dirs;

    window.localStorage.FCOLOR = window.localStorage.FCOLOR || 0;
    window.localStorage.FDIR = window.localStorage.FDIR || "";
    var c = myself[0];
    var x = myself[1];
    var y = myself[2];

    var n = grid.length;

    function result(color) {
        if(color == 0) return c;
        else return [c, 0, color][Math.abs(c - color)%3];
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 5; _++) {
        var dir = _ == 0 ? window.localStorage.FDIR : dirs.splice(Math.random() * dirs.length |0, 1);
        if(window.localStorage.FCOLOR != 0 && dir == "left" && x != 0 && grid[x-1][y] == window.localStorage.FCOLOR) {
            window.localStorage.FDIR = dir;
            return "left";
        }
        if(window.localStorage.FCOLOR != 0 && dir == "right" && x != n-1 && grid[x+1][y] == window.localStorage.FCOLOR) {
            window.localStorage.FDIR = dir;
            return "right";
        }
        if(window.localStorage.FCOLOR != 0 && dir == "up" && y != 0 && grid[x][y-1] == window.localStorage.FCOLOR) {
            window.localStorage.FDIR = dir;
            return "up";
        }
        if(window.localStorage.FCOLOR != 0 && dir == "down" && y != n-1 && grid[x][y+1] == window.localStorage.FCOLOR) {
            window.localStorage.FDIR = dir;
            return "down";
        }
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0 && grid[x-1][y] != 0 && grid[x-1][y] != c && result(grid[x-1][y]) == c) {
            window.localStorage.FCOLOR = grid[x-1][y];
            window.localStorage.FDIR = dir;
            return "left";
        }
        if(dir == "right" && x != n-1 && grid[x+1][y] != 0 && grid[x+1][y] != c && result(grid[x+1][y]) == c) {
            window.localStorage.FCOLOR = grid[x+1][y];
            window.localStorage.FDIR = dir;
            return "right";
        }
        if(dir == "up" && y != 0 && grid[x][y-1] != 0 && grid[x][y-1] != c && result(grid[x][y-1]) == c) {
            window.localStorage.FCOLOR = grid[x][y-1];
            window.localStorage.FDIR = dir;
            return "up";
        }
        if(dir == "down" && y != n-1 && grid[x][y+1] != 0 && grid[x][y+1] != c && result(grid[x][y+1]) == c) {
            window.localStorage.FCOLOR = grid[x][y+1];
            window.localStorage.FDIR = dir;
            return "down";
        }
    }

    //window.localStorage.FCOLOR = 0;
    window.localStorage.FDIR = "";

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0 && grid[x-1][y] == 0) return "left";
        if(dir == "right" && x != n-1 && grid[x+1][y] == 0) return "right";
        if(dir == "up" && y != 0 && grid[x][y-1] == 0) return "up";
        if(dir == "down" && y != n-1 && grid[x][y+1] == 0) return "down";
    }

    dirs = ["left", "right", "up", "down"];
    for(var _ = 0; _ < 4; _++) {
        var dir = dirs.splice(Math.random() * dirs.length |0, 1);
        if(dir == "left" && x != 0) return "left";
        if(dir == "right" && x != n-1) return "right";
        if(dir == "up" && y != 0) return "up";
        if(dir == "down" && y != n-1) return "down";
    }
    return "wait";
}
  },
  {
    "name": "FarSightedGreed",
    "func": function([id, x, y], grid, bots, gameInfo) {
    let value = n => n ? n == id ? 0 : 2 - Math.abs(id - n) % 3 : 2;
    let directions = [
        {name: "wait", x: 0, y: 0},
        {name: "left", x: -1, y: 0},
        {name: "up", x: 0, y: -1},
        {name: "right", x: 1, y: 0},
        {name: "down", x: 0, y: 1},
    ];
    for (let d of directions) {
        d.score = 0;
        for (let i = 1; ; i++) {
            let px = x + i * d.x;
            let py = y + i * d.y;
            if (px < 0 || py < 0 || px == grid.length || py == grid.length) break;
            if (bots.some(([, x, y]) => x == px && y == py)) break;
            d.score += value(grid[px][py]) / i;
        }
    }
    let best = Math.max(...directions.map(({score}) => score));
    return directions.find(({score}) => score == best).name;
}
  },
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

    var random = randomMove();
    nextMove(random, "random");
    return random;

    function checkMove(move, currentColor) {
        var go = false;
        if(currentColor === 0) {
            go = true;
        } else {
            var z = [col, 0, currentColor][Math.abs(col - currentColor)%3]
            go = z == 0 ? "notPreferred" : z != currentColor;
        }

        if(go) {
            if(localStorage.jacksNextMoveShouldNotBe && localStorage.jacksNextMoveShouldNotBe == move) {
                return false;
            }
        }
        return go;
    }

    function randomMove() {
        if(localStorage.jacksPreviousMoveWasRandom) {
            var repeatMove = localStorage.jacksPreviousMoveWasRandom;
            if(repeatMove == "left" && myX > 0 || repeatMove == "right" && myX < grid.length-1 || repeatMove == "up" && myY > 0 || repeatMove == "down" && myY < grid.length-1){
                return repeatMove;
            }
        }

        var random = ["up","down","left","right"][Math.random() *4|0];
        localStorage.jacksPreviousMoveWasRandom = random;
        return random;
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
        localStorage.jacksNextMoveShouldNotBe = oppositeMove;
        if(message != "random") {
            localStorage.jacksPreviousMoveWasRandom = "";
        }
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
    this.storageName2 = 'ji38df8djsdf8zf0a';
    this.distances = {up: 0, right: 0, down: 0, left: 0};
    this.foodSmell = {up: 0, right: 0, down: 0, left: 0};
    this.botSmell = {up: 0, right: 0, down: 0, left: 0};
    this.botPredictedSmell = {up: 0, right: 0, down: 0, left: 0};
    this.directionPoints = {up: 0, right: 0, down: 0, left: 0};

    this.blockedMoves = function() {
        var backwards = 'wait', prevDirection, blocked = [];
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

        if (this.round > 1) {
            prevDirection = JSON.parse(localStorage.getItem(this.storageName2));
            backwards = (prevDirection == 'up' ? 'down' : backwards);
            backwards = (prevDirection == 'down' ? 'up' : backwards);
            backwards = (prevDirection == 'left' ? 'right' : backwards);
            backwards = (prevDirection == 'right' ? 'left' : backwards);
            blocked.push(backwards);
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
                this.botSmell.up+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0));
            }
            if (bots[i][2] > myself[2]) {
                this.botSmell.down+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0));
            }
            if (bots[i][1] < myself[1]) {
                this.botSmell.left+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0));
            }
            if (bots[i][1] > myself[1]) {
                this.botSmell.right+= 3 / (this.getDistance(bots[i][1], bots[i][2]).reduce((a, b) => a + b, 0));
            }

            if (this.round > 1) {
                currentBot = prevPositions.find(function(element) {
                    return element[0] == bots[i][0];
                });

                if (currentBot[0] != this.myColor) {
                    future = this.predictFuture(currentBot[1], currentBot[2], bots[i][1], bots[i][2]);
                    if (future[1] < myself[2]) {
                        this.botPredictedSmell.up+= (3.14159 / 3 * ([Math.abs(this.myColor - bots[i][0])%3] + 1)) / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[1] > myself[2]) {
                        this.botPredictedSmell.down+= (3.14159 / 3 * ([Math.abs(this.myColor - bots[i][0])%3] + 1)) / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[0] < myself[1]) {
                        this.botPredictedSmell.left+= (3.14159 / 3 * ([Math.abs(this.myColor - bots[i][0])%3] + 1)) / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
                    }
                    if (future[0] > myself[1]) {
                        this.botPredictedSmell.right+= (3.14159 / 3 * ([Math.abs(this.myColor - bots[i][0])%3] + 1)) / (this.getDistance(future[0], future[1]).reduce((a, b) => a + b, 0));
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

    var answer = this.getBestDistance();
    localStorage.setItem(this.storageName2, JSON.stringify(answer));

    return(answer);
}
  },
  {
    "name": "Territorial",
    "func": function (myself, grid, bots, gameInfo) {
    const w = 15, h = 15;
    let my_c = myself[0], my_x = myself[1], my_y = myself[2], size = grid.length, roundnum = gameInfo[0];

    let getDistance = function (x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
    };

    let getColorValue = function (color) {
        if (color === 0) {
            return my_c;
        }
        return [my_c, 0, color][Math.abs(my_c - color) % 3];
    };

    if (!localStorage.territorial) {
        //Choosing closest corner to defend
        const topLeft = [0, 0], bottomLeft = [0, size - 1], topRight = [size - 1, 0], bottomRight = [size - 1, size - 1];

        var distanceToTopLeft = getDistance(my_x, my_y, topLeft[0], topLeft[1]);
        var distanceToTopRight = getDistance(my_x, my_y, topRight[0], topRight[1]);
        var distanceToBottomLeft = getDistance(my_x, my_y, bottomLeft[0], bottomLeft[1]);
        var distanceToBottomRight = getDistance(my_x, my_y, bottomRight[0], bottomRight[1]);

        var nearestCorner = Math.min(distanceToTopLeft, distanceToTopRight, distanceToBottomLeft, distanceToBottomRight);

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
        let lastMove = "";
        localStorage.territorial = JSON.stringify([offset_x, offset_y, innermostCorner_x, innermostCorner_y, lastMove]);
    }
    offsets = JSON.parse(localStorage.territorial);
    offset_x = offsets[0];
    offset_y = offsets[1];
    innermostCorner_x = offsets[2];
    innermostCorner_y = offsets[3];
    lastMove = offsets[4];

    let targets = [];
    let distance = 999999;
    let lowestDistance = 999999;
    for (let grid_x = offset_x; grid_x < offset_x + w; grid_x++)
    {
        for (let grid_y = offset_y; grid_y < offset_y + h; grid_y++)
        {
            if (grid[grid_x][grid_y] !== my_c && getColorValue(grid[grid_x][grid_y]) !== grid[grid_x][grid_y])
            {
                distance = getDistance(my_x, my_y, grid_x, grid_y);
                targets[distance] = [grid_x, grid_y];

                if (distance < lowestDistance) {
                    lowestDistance = distance;
                }
            }
        }
    }

    let target = targets[lowestDistance];
    //If territory is safe, move to border nearest boardCenter
    if (target === undefined) {
        targets.push([innermostCorner_x, innermostCorner_y]);
        target = targets.pop();
    }

    let move = "";
    if (target === undefined) {
        move = 'wait';
    } else if (target[0] > my_x) {
        move = 'right';
    } else if (target[0] < my_x) {
        move = 'left';
    } else if (target[1] > my_y) {
        move = 'down';
    } else if (target[1] < my_y) {
        move = 'up';
    } else {
        move = "wait";
    }

    if (move === "wait" && lastMove === "wait") {
        move = "left";
    }

    localStorage.territorial = JSON.stringify([offset_x, offset_y, innermostCorner_x, innermostCorner_y, w, h, move]);

    return move;
}
  },
  {
    "name": "AnnoyingLittleBrother",
    "func": function(myself, grid, bots, gameInfo) {   

    // Some paramters      
    var brother_loop_count = 0;
    var brother_score = -1;          
    var brother_id = 0;        
    var number_of_brothers_followed = 0;
    var num_of_bots = -1;

    var saw_all_brothers_moves = 0;
    var moves_write = 0;  
    let moves_to_follow = 30;      // How much moves will we follow? 
    let moves_to_use = 5; // Only follow the last 5 elements of this array
    var moves_saw = makeArray(moves_to_follow, 2, 0);  

    var my_id = myself[0];
    var my_x = myself[1];
    var my_y = myself[2];
    var round = gameInfo[0];
    var end_round = gameInfo[1];
    var last_num_of_bots = 0;  

    // Handle Storage 
    if(!localStorage.LB_nfirst){ // First round (Dont rely on round number)
      localStorage.LB_nfirst = true;

      brother_loop_count = 0;// lock on to anyone
      moves_write = 0;
      moves_saw = makeArray(moves_to_follow, 2, 0);
      let num_of_bots = bots.length;

      localStorage.LB_moves_saw = encode_moves(moves_saw);
      localStorage.LB_moves_write = moves_write;// Save it
      localStorage.LB_brother_id = brother_id;// Save it            
      localStorage.LB_brother_loop_count = brother_loop_count; // Save it     
      localStorage.LB_saw_all_brothers_moves = saw_all_brothers_moves;
      localStorage.LB_number_of_brothers_followed = number_of_brothers_followed;
      localStorage.LB_num_of_bots = num_of_bots;
    }
    else{
      moves_saw = decode_moves(localStorage.LB_moves_saw);
      moves_write = parseInt(localStorage.LB_moves_write);
      brother_id = parseInt(localStorage.LB_brother_id); 
      brother_loop_count = parseInt(localStorage.LB_brother_loop_count);
      saw_all_brothers_moves = parseInt(localStorage.LB_saw_all_brothers_moves);
      last_num_of_bots = parseInt(localStorage.LB_last_num_of_bots);
      number_of_brothers_followed = parseInt(localStorage.LB_number_of_brothers_followed);
      num_of_bots = parseInt(localStorage.LB_num_of_bots);
    }

    // Check if a bot was eliminated
    if(last_num_of_bots !== bots.length){
      // A bot was elimitated. Just tell LittleBrother to search for a new brother
      brother_loop_count = 0;
      brother_id = 0;
      last_num_of_bots = bots.length;       
    }

    // Are we tired of this brother yet?
    if (brother_loop_count === 0){
      // Determine each bot's score
      var bot_scores = new Uint32Array(num_of_bots+1);
      for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid.length; y++) {
          bot_scores[grid[x][y]] += 1;    // Increase the score of the bot's who color this is
          // The eliminated bots' scores will just stay zero
        }
      }

      // Find a bot to follow
      brother_id = 0;
      if (Math.random() > 0.6){
        var backup_bro = 0;
        var tolerance = 0;
        var chance = Math.random();
        if (chance > 0.7){tolerance = 1;} // 30% of the time I'll follow someone who I only clear
        if (chance > 2){tolerance = 2;} // Never
        for (var uid = 1; uid < bot_scores.length; uid++){
          if (bot_scores[uid]>brother_score && my_id!==uid){
            if (Math.abs(my_id - uid)%3<=tolerance){// Will it be annoying to the brother?  
              brother_score = bot_scores[uid];
              brother_id = uid;
            }
            else{
              if(Math.abs(my_id - uid)%3<2){
                backup_id = uid; // In case we didn't find what we wanted.
              }
            }
          }
        }
      }
      // If we don't have a brother yet, find a random one
      if (brother_id === 0){
        var tries = 0;
        do{
          var ridx = Math.round(Math.random()*(bots.length-1));
          if(bots[ridx][0]!==my_id && Math.abs(my_id - bots[ridx][0])%3===0){
            brother_id = bots[ridx][0];
          }
        }while(brother_id === 0 && tries++<=20);
      }
      if (brother_id===0){brother_id = (my_id===1)?2:1;}

      // Start the brother follow counter
      moves_write = 0;
      saw_all_brothers_moves = 0;
      brother_loop_count = 100 + 250*number_of_brothers_followed;
      number_of_brothers_followed ++;
    }

    // Decrease the loop count variable to make sure we don't stagnate
    brother_loop_count -= 1; // But only for so long

    // Now do the actual following
    var aim_x = -1;
    var aim_y = -1;
    var bro_x = -1;
    var bro_y = -1;
    if (brother_id > 0){

    // Find where brother currently is
    for (var i = 0; i < bots.length; i++){
      if (bots[i][0] === brother_id){
        brother_idx = i;
        break;
      }
    }

    // Which point are we aiming for?
    if(saw_all_brothers_moves === 1 || moves_write > moves_to_use){ // Did I see how my brother moves?

      // Calculate the slice of steps we are going to use
      var left = ((saw_all_brothers_moves===1) ? moves_write+1 : 0)%moves_to_follow;
      var right = ((saw_all_brothers_moves===1) ? moves_write+moves_to_use+1 : moves_to_use)%moves_to_follow;
      if (right > left){// want to read left --> right in moves_saw
         var steps_to_use = moves_saw.slice(left,right);
      }
      else{
        var steps_to_use = moves_saw.slice(0,right)
        steps_to_use.push(...moves_saw.slice(left));
      }

      // Check if we are in his footsteps?
      var in_brothers_footsteps = false;
      for (var step = 0; step<steps_to_use.length; step++){
        if ((steps_to_use[step][0] === my_x) && ((steps_to_use[step][1] === my_y))){
          in_brothers_footsteps = true;
          break;
        }
      }

      if(in_brothers_footsteps === true){
        // We are in his footsteps. Go to the next one!;
        step++; if (step >= steps_to_use.length){step=0;}
        aim_x = steps_to_use[step][0];aim_y = steps_to_use[step][1];
      }
      else{
        // We are not in his footsteps, aim for the footsteps
        aim_x = 0; aim_y = 0;
        for (var step = 0; step<steps_to_use.length; step++){// Calculate step's center of mass
           aim_x += steps_to_use[step][0];aim_y += steps_to_use[step][1];
        }
        aim_x /= moves_to_use; aim_y /= moves_to_use;
      }
    }
    else{
      // No, not yet. Just run towards him
      aim_x = bots[brother_idx][1];
      aim_y = bots[brother_idx][2];
    }  

    // Check if we might touch big brother
    let [dx, dy] = PosAt(toPos([aim_x, aim_y]));       
    if (my_x+dx===bots[brother_idx][1] && my_y+dy===bots[brother_idx][2]){
      // EEEUUW. Flinch away, because it's weird.
      aim_x = my_x; aim_y = my_y; 
    }
    }

    // Watch big brother's moves
    if(brother_id > 0){
      moves_saw[moves_write][0] = bots[brother_idx][1];
      moves_saw[moves_write][1] = bots[brother_idx][2];           
      moves_write ++;
      if (moves_write===moves_to_follow){
        moves_write = 0; // Wrap counter for circular buffer

        // Have I seen enough of them?
        if(saw_all_brothers_moves === 0){
          saw_all_brothers_moves = 1;          
        }
      }            
    }

    // Save updated variables
    localStorage.LB_moves_saw = encode_moves(moves_saw); 
    localStorage.LB_moves_write = moves_write;// Save it
    localStorage.LB_brother_id = brother_id;// Save it            
    localStorage.LB_brother_loop_count = brother_loop_count; // Save it       l     
    localStorage.LB_saw_all_brothers_moves = saw_all_brothers_moves;
    localStorage.LB_last_num_of_bots = last_num_of_bots;
    localStorage.LB_number_of_brothers_followed = number_of_brothers_followed;      

    // Finish function          
    if (brother_id <= 0){ // If not following anybody, move randomly
      return ["up","down","left","right"][Math.random()*4|0];
    }
    else{
      // Following a big brother!
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
    function PosAt(dir){
      if (dir === 'left') return [-1,0];
      if (dir === 'right') return [1, 0];
      if (dir === 'up') return [0, -1];
      if (dir === 'down') return [0, 1];
      return [0,0];    
      }
      function decode_moves(moves_str){            
      var moves_array = [];
      var moves_strs = moves_str.split(';');
      for (var i = 0; i<moves_to_follow; i++){         
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
    let round = gameInfo[0];

    // Find our friend.
    if (round === 1) {
        localStorage.kneecapper_possibleAllies = JSON.stringify(bots.map(bot => bot[0]));
    }
    let possibleAllies = JSON.parse(localStorage.kneecapper_possibleAllies);

    // Players who don't do the identifying dance aren't allies.
    if (1 < round && round <= 5) {
        let previousPositions = JSON.parse(localStorage.kneecapper_previousPositions);
        let expectedDx = [-1, 0, 1, 0];
        let expectedDy = [0, 1, 0, -1];
        let notAllies = [];
        for (let i = 0; i < possibleAllies.length; i++) {
            let j = possibleAllies[i] - 1;
            let dx = bots[j][1] - previousPositions[j][1];
            let dy = bots[j][2] - previousPositions[j][2];
            if (dx === 0 && dy === 0) {
                if (expectedDx === -1 && bots[j][1] !== 0) {
                    notAllies.push(possibleAllies[i]);
                } else if (expectedDx === 1 && bots[j][1] !== grid.length - 1) {
                    notAllies.push(possibleAllies[i]);
                } else if (expectedDy === -1 && bots[j][2] !== 0) {
                    notAllies.push(possibleAllies[i]);
                } else if (expectedDy === 1 && bots[j][2] !== grid.length - 1) {
                    notAllies.push(possibleAllies[i]);
                }
            }
            if (dx !== expectedDx[round % 4] || dy !== expectedDy[round % 4]) {
                notAllies.push(possibleAllies[i]);
            }
        }
        possibleAllies = possibleAllies.filter(id => notAllies.indexOf(id) < 0);
        localStorage.kneecapper_possibleAllies = JSON.stringify(possibleAllies);
    }
    localStorage.kneecapper_previousPositions = JSON.stringify(bots);

    let partner = possibleAllies[0];

    // Figure out who's doing well.
    let targets = bots.map(bot => bot[0]).filter(id => (id !== myId) && (id !== partner) && (Math.abs(id - myId) % 3 !== 2));
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
    "func": function (myself, grid, bots, gameInfo) {

"use strict";

if (this.O == null) this.O = {};
const O = this.O;

// console.log(this);

const MAXBOTS = 60;
const MAXSZ = 3 * MAXBOTS;
const MAXID = MAXBOTS + 1;

if (gameInfo[0] == 1) {
    if (bots.length > MAXBOTS) {
        alert("ASSERTION FAILED: MAXBOTS EXCEEDED (contact @tomsmeding)");
        return 0;
    }

    for (const b of bots) {
        if (b[0] < 0 || b[0] > MAXID) {
            alert("ASSERTION FAILED: MAXID EXCEEDED (contact @tomsmeding)");
            return 0;
        }
    }
}

function from_base64(bs) {
    if (bs.length % 4 != 0) throw new Error("Invalid Base64 string");

    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const beta = new Array(256).fill(-1);

    for (let i = 0; i < alpha.length; i++) beta[alpha.charCodeAt(i)] = i;

    const arrbuf = new ArrayBuffer(bs.length / 4 * 3 | 0);
    const buf = new Uint8Array(arrbuf);

    let j = 0;
    for (let i = 0; i < bs.length; i += 4) {
        buf[j++] = (beta[bs.charCodeAt(i+0)] << 2) | (beta[bs.charCodeAt(i+1)] >> 4);
        if (bs[i+2] == "=") break;
        buf[j++] = (beta[bs.charCodeAt(i+1)] << 4) | (beta[bs.charCodeAt(i+2)] >> 2);
        if (bs[i+3] == "=") break;
        buf[j++] = (beta[bs.charCodeAt(i+2)] << 6) | (beta[bs.charCodeAt(i+3)] >> 0);
    }

    return new Uint8Array(arrbuf, 0, j);
}

function repeat(str, times) {
    return new Array(times + 1).join(str);
}

function println_func(ptr) {
    let s = "";
    for (; ptr < O.wa_membuf.length; ptr++) {
        if (O.wa_membuf[ptr] == 0) break;
        s += String.fromCharCode(O.wa_membuf[ptr]);
    }
    console.log(s);
}

function print_int_func(value) {
    console.log(value);
}

function seed_random() {
    for (let i = 0; i < O.wa_rand_state.length; i++) {
        O.wa_rand_state[i] = (Math.random() * 256) & 0xff;
    }
}

function transfer_myself(myself) {
    O.wa_my_id[0] = myself[0];
}

function transfer_grid(grid) {
    const W = grid.length, H = grid[0].length;
    O.wa_width[0] = W;
    O.wa_height[0] = H;
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            O.wa_grid[W * y + x] = grid[x][y];
        }
    }
}

function transfer_bots(bots) {
    O.wa_nbots[0] = bots.length;
    for (let i = 0; i < bots.length; i++) {
        O.wa_bots[3 * i + 0] = bots[i][0];
        O.wa_bots[3 * i + 1] = bots[i][1];
        O.wa_bots[3 * i + 2] = bots[i][2];
    }
}

function transfer_gameInfo(gameInfo) {
    O.wa_round_idx[0] = gameInfo[0];
    O.wa_total_rounds[0] = gameInfo[1];
}

function stringify(thing) {
    if (Array.isArray(thing)) {
        return "[" + thing.map(stringify).join(",") + "]";
    } else if (thing instanceof Int8Array) {
        return "[" + thing.toString() + "]";
    } else {
        return thing.toString();
    }
}

function mc_calcmove() {
    // console.log("mc_calcmove(" + stringify(myself) + "," + stringify(grid) + "," + stringify(bots) + "," + stringify(gameInfo) + ")");
    transfer_myself(myself);
    transfer_grid(grid);
    transfer_bots(bots);
    transfer_gameInfo(gameInfo);
    return ["right", "down", "left", "up", "wait"][O.wa_mc_calcmove()];
    // return O.wa_mc_calcmove();
}

if (O.wasm_bytes == null) {
    O.wasm_bytes = from_base64(
// INSERT-WASM-HERE
"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AAC0BgAAvQYAAL8GAADIBgAAygYAACIHAAAkBwAALwcAADEHAAA6BwAAPAcAAEcHAABJBwAAUgcAAFQHAABkBwAAZgcAAG8HAABxBwAAegcAAHwHAACFBwAAhwcAAJAHAACSBwAArwcAALEHAAC6BwAAvAcAAMUHAADHBwAA0AcAANIHAADbBwAA3QcAAPUHAAD3BwAAAAgAAAIIAAALCAAADQgAABYIAAAYCAAAIQgAACMIAAAAAAAAAAAAAIcDAACLAwAAogMAANIDAAAAAAAAAAAAAD4FAACcBgAAngYAAKcGAACpBgAAsgYAALQGAAC9BgAAvwYAAMgGAADKBgAAIgcAACQHAAAvBwAAMQcAADoHAAA8BwAARwcAAEkHAABSBwAAVAcAAGMHAABmBwAAbwcAAHEHAAB6BwAAfAcAAIUHAACHBwAAkAcAAJIHAACnBwAAsQcAALoHAAC8BwAAxQcAAMcHAADQBwAA0gcAANsHAADdBwAA9AcAAPcHAAAACAAAAggAAAsIAAANCAAAFggAABgIAAAhCAAAIwgAAEUIAABWCAAA8QgAAAAJAAAHCQAAAAAAAAAAAABfBQAAmgUAAB8GAAA0BgAAngYAAKcGAACpBgAAsgYAALQGAAC9BgAAvwYAAMgGAADKBgAA2AYAACYHAAAvBwAAMQcAADoHAAA+BwAARwcAAEkHAABSBwAAVAcAAGMHAABmBwAAbwcAAHEHAAB6BwAAfAcAAIUHAACHBwAAkAcAAJIHAACgBwAAsQcAALoHAAC8BwAAxQcAAMcHAADQBwAA0gcAANsHAADdBwAA6wcAAPcHAAAACAAAAggAAAsIAAANCAAAFggAABgIAAAhCAAAIwgAADEIAAAAAAAAAAAAAF8FAACaBQAAHwYAADQGAACeBgAApwYAAKkGAACyBgAAtAYAAL0GAAC/BgAAyAYAAMoGAADYBgAAJgcAAC8HAAAxBwAAOgcAAD4HAABHBwAASQcAAFIHAABUBwAAYwcAAGYHAABvBwAAcQcAAHoHAAB8BwAAhQcAAIcHAACQBwAAkgcAAKAHAACxBwAAugcAALwHAADFBwAAxwcAANAHAADSBwAA2wcAAN0HAADrBwAA9wcAAAAIAAACCAAACwgAAA0IAAAWCAAAGAgAACEIAAAjCAAAMQgAAAAAAAAAAAAAXwUAAJoFAAAVBgAAnAYAAJ4GAACnBgAAqQYAALIGAAC0BgAAvQYAAL8GAADIBgAAygYAAOEGAAAmBwAALwcAADEHAAA6BwAAPgcAAEcHAABJBwAAUgcAAFQHAABjBwAAZgcAAG8HAABxBwAAegcAAHwHAACFBwAAhwcAAJAHAACSBwAApwcAALEHAAC6BwAAvAcAAMUHAADHBwAA0AcAANIHAADbBwAA3QcAAPQHAAD3BwAAAAgAAAIIAAALCAAADQgAABYIAAAYCAAAIQgAACMIAABFCAAAAAAAAAAAAAC2BQAA7QUAAOYGAAABBwAAHgcAACIHAAAkBwAAJgcAADwHAAA+BwAAAAAAAAAAAAC2BQAA7QUAAOYGAAABBwAAHgcAACIHAAAkBwAAJgcAADwHAAA+BwAAAAAAAAAAAABfBQAAnAYAAJ4GAACnBgAAqQYAALIGAAC0BgAAvQYAAL8GAADIBgAAygYAACIHAAAkBwAALwcAADEHAAA6BwAAPAcAAEcHAABJBwAAUgcAAFQHAABjBwAAZgcAAG8HAABxBwAAegcAAHwHAACFBwAAhwcAAJAHAACSBwAApwcAALEHAAC6BwAAvAcAAMUHAADHBwAA0AcAANIHAADbBwAA3QcAAPQHAAD3BwAAAAgAAAIIAAALCAAADQgAABYIAAAYCAAAIQgAACMIAABFCAAAVggAAOQIAAAAAAAAAAAAAF8FAACcBgAAngYAAKcGAACpBgAAsgYAALQGAAC9BgAAvwYAAMgGAADKBgAAIgcAACQHAAAvBwAAMQcAADoHAAA8BwAARwcAAEkHAABSBwAAVAcAAGMHAABmBwAAbwcAAHEHAAB6BwAAfAcAAIUHAACHBwAAkAcAAJIHAACnBwAAsQcAALoHAAC8BwAAxQcAAMcHAADQBwAA0gcAANsHAADdBwAA9AcAAPcHAAAACAAAAggAAAsIAAANCAAAFggAABgIAAAhCAAAIwgAAEUIAABWCAAA8QgAAAAAAAAAAAAAPgUAAJwGAACeBgAApwYAAKkGAACyBgAAtAYAAL0GAAC/BgAAyAYAAMoGAAAiBwAAJAcAAC8HAAAxBwAAOgcAADwHAABHBwAASQcAAFIHAABUBwAAYwcAAGYHAABvBwAAcQcAAHoHAAB8BwAAhQcAAIcHAACQBwAAkgcAAKcHAACxBwAAugcAALwHAADFBwAAxwcAANAHAADSBwAA2wcAAN0HAAD0BwAA9wcAAAAIAAACCAAACwgAAA0IAAAWCAAAGAgAACEIAAAjCAAARQgAAFYIAAAVCQAAAAAAAAAAAACfBAAAnAYAAJ4GAACnBgAAqQYAALIGAAC0BgAAvQYAAL8GAADIBgAAygYAACIHAAAkBwAALwcAADEHAAA6BwAAPAcAAEcHAABJBwAAUgcAAFQHAABjBwAAZgcAAG8HAABxBwAAegcAAHwHAACFBwAAhwcAAJAHAACSBwAApwcAALEHAAC6BwAAvAcAAMUHAADHBwAA0AcAANIHAADbBwAA3QcAAPQHAAD3BwAAAAgAAAIIAAALCAAADQgAABYIAAAYCAAAIQgAACMIAABFCAAAVggAAFQJAAAAAAAAAAAAAJ8EAACcBgAAngYAAKcGAACpBgAAsgYAALQGAAC9BgAAvwYAAMgGAADKBgAAIgcAACQHAAAvBwAAMQcAADoHAAA8BwAARwcAAEkHAABSBwAAVAcAAGMHAABmBwAAbwcAAHEHAAB6BwAAfAcAAIUHAACHBwAAkAcAAJIHAACnBwAAsQcAALoHAAC8BwAAxQcAAMcHAADQBwAA0gcAANsHAADdBwAA9AcAAPcHAAAACAAAAggAAAsIAAANCAAAFggAABgIAAAhCAAAIwgAAEUIAABWCAAAYQkAAAAAAAAAAAAARgIAAF4CAABiAgAAhAIAAIYCAACcBgAAngYAAKcGAACpBgAAsgYAALQGAAC9BgAAvwYAAMgGAADKBgAAIgcAACQHAAAvBwAAMQcAADoHAAA8BwAARwcAAEkHAABSBwAAVAcAAGMHAABmBwAAbwcAAHEHAAB6BwAAfAcAAIUHAACHBwAAkAcAAJIHAACnBwAAsQcAALoHAAC8BwAAxQcAAMcHAADQBwAA0gcAANsHAADdBwAA9AcAAPcHAAAACAAAAggAAAsIAAANCAAAFggAABgIAAAhCAAAIwgAAEUIAABWCAAAeQkAAAAAAAAAAAAAgQEAAIYBAACpAQAAXgIAAGICAACEAgAAhgIAAJwGAACeBgAApwYAAKkGAACyBgAAtAYAAL0GAAC/BgAAyAYAAMoGAAAiBwAAJAcAAC8HAAAxBwAAOgcAADwHAABHBwAASQcAAFIHAABUBwAAYwcAAGYHAABvBwAAcQcAAHoH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"
    );

    // require("fs").writeFileSync("reverse-base64-output.txt", Buffer.from(O.wasm_bytes));

    O.memory = new WebAssembly.Memory({initial: 15});
    // O.importObject = {js: {mem: O.memory}, env: {println: println_func}};
    O.importObject = {
        env: {
            println: println_func,
            print_int: print_int_func,
            __linear_memory: O.memory,
            __indirect_function_table: new WebAssembly.Table({initial: 0, element: "anyfunc"}),
        },
    };

    // let wa_membuf, wa_width, wa_height, wa_nbots, wa_round_idx, wa_total_rounds, wa_my_id, wa_grid, wa_bots, wa_rand_state;

    /*const promise = fetch('../out/main.wasm').then(response =>
        response.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, O.importObject)
    );*/
    // const promise = WebAssembly.instantiate(fs.readFileSync("hotpatcher/out.wasm"), O.importObject);
    const promise = WebAssembly.instantiate(O.wasm_bytes, O.importObject);

    promise.then(results => {
        const instance = results.instance;

        // console.log(instance.exports);

        // First set some pointers
        instance.exports.entry_fn(0);

        O.wa_membuf = new Uint8Array(O.memory.buffer);
        const ptrs = new Uint32Array(O.memory.buffer, 0, 9 * 4);

        O.wa_width = new Int32Array(O.memory.buffer, ptrs[0], 1);
        O.wa_height = new Int32Array(O.memory.buffer, ptrs[1], 1);
        O.wa_nbots = new Int32Array(O.memory.buffer, ptrs[2], 1);
        O.wa_round_idx = new Int32Array(O.memory.buffer, ptrs[3], 1);
        O.wa_total_rounds = new Int32Array(O.memory.buffer, ptrs[4], 1);
        O.wa_my_id = new Int32Array(O.memory.buffer, ptrs[5], 1);
        O.wa_grid = new Uint8Array(O.memory.buffer, ptrs[6], MAXSZ * MAXSZ);
        O.wa_bots = new Uint8Array(O.memory.buffer, ptrs[7], MAXBOTS * 3);
        O.wa_rand_state = new Uint8Array(O.memory.buffer, ptrs[8], 5 * 4);

        O.wa_mc_calcmove = function() { return instance.exports.entry_fn(2); }

        seed_random();

        // Signal that we're done setting up, and the wasm code can set itself up
        instance.exports.entry_fn(1);

        O.instantiated = true;
    }).catch(console.error);
}

if (O.instantiated) {
    const start = new Date();
    const output = mc_calcmove();
    const end = new Date();


    if (O.time_sum == null) O.time_sum = 0;
    O.time_sum += end - start;

    return output;
} else {
    return ["right", "down", "left", "up"][Math.random() * 4 | 0];
}

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
    let max_scores = Array(12);
    max_scores[11] = 0;
    max_scores[10] = 0.05 * (1 + 1e-6 + 16.1 * 1e-10);
    for (let i = 9; i >= 0; i--) {
        max_scores[i] = max_scores[10] + 0.95 * max_scores[i + 1];
    }
    let my_id = myself[0];
    let my_x = myself[1];
    let my_y = myself[2];
    let delta = [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]];
    let seen = Array(grid.length).fill().map(() => Array(grid.length).fill(false)); 
    let scores = Array(bots.length + 2).fill(0);
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
            for (let dx = -1; dx <= 1; dx++) {
                let x2 = x1 + dx;
                if ((x2 < 0) || (x2 >= grid.length)) {
                    continue;
                }
                for (let dy = -1; dy <= 1; dy++) {
                    if ((dx == 0) && (dy == 0)) {
                        continue;
                    }
                    let y2 = y1 + dy;
                    if ((y2 < 0) || (y2 >= grid.length)) {
                        continue;
                    }
                    n++;
                    if (grid[x2][y2] == my_id) {
                        n++;
                    }
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
            score *= 0.05;
            if (score + 0.95 * max_scores[depth + 1] <= max_score) {
                continue;
            }
            grid[x1][y1] = next;
            seen[x1][y1] = true;
            let final_score = score + 0.95 * search(x1, y1, depth + 1)[1];
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
            store.corner = [[-1,0,0],[-1,0,grid.length-1],[-1,grid.length-1,0],[-1,grid.length-1,grid.length-1]][Math.random()*4|0];
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
    if(myself[2] < grid.length-1 && myself[0] != grid[myself[1]][myself[2]+1] && (grid[myself[1]][myself[2]+1] == 0 || finalcolor(myself[0],grid[myself[1]][myself[2]+1]) == 0)){
        firstchoice.down = 9999;
    }
    if(myself[1] > 0 && myself[0] != grid[myself[1]-1][myself[2]] && (grid[myself[1]-1][myself[2]] == 0 || finalcolor(myself[0],grid[myself[1]-1][myself[2]]) == 0)){
        firstchoice.left = 9999;
    }
    if(myself[1] < grid.length-1 && myself[0] != grid[myself[1]+1][myself[2]] && (grid[myself[1]+1][myself[2]] == 0 || finalcolor(myself[0],grid[myself[1]+1][myself[2]]) == 0)){
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
    for(i=0;i<grid.length;i++){
        for(j=0;j<grid.length;j++){
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
    "name": "Jealous Ant V13 121492",
    "func": function ([mc, mx, my], grid, bots, [rcurr, rmax]) {
    var [dest, ddest, odest, rev] = [{ left: "left", right: "right", up: "up", down: "down" }, {leftup: ["left", "up"], leftdown: ["left", "down"], rightup: ["right", "up"], rightdown: ["right", "down"]}, {wait: "wait"}, {left: "right", right: "left", up: "down", down: "up" }];
    var deltas = { x: { wait: 0, left: -1, right: +1, up: 0, down: 0, leftup: -1, leftdown: -1, rightup: +1, rightdown: +1, wait: 0 }, y: { wait: 0, left: 0, right: 0, up: -1, down: +1, leftup: -1, leftdown: +1, rightup: +1, rightdown: -1}};
    var [[gmin, gmax], blank, name] = [[0, grid.length - 1], 0, "Jealous Ant V13 121492"];
    var db = JSON.parse(localStorage.getItem(name)) || onInit(db)
    var [pstrategy, pplus, pboost, pbotdist, pdepth, dsight] = db.params
    function calcColor(color = mc, x = mx, y = my) { return Object.keys({...dest, ...ddest, ...odest}).map(pos => getColorXY(x + deltas.x[pos], y + deltas.y[pos]) == color).filter(v => v).length; }
    function calcDistanceXY(x, y, xx = mx, yy = my) { return Math.abs(xx - x) + Math.abs(yy - y); }
    function calcPaintable(x = mx, y = my) { return Object.keys({...dest, ...ddest}).map(pos => isPaintableXY(x + deltas.x[pos], y + deltas.y[pos]) && !isFriendXY(x + deltas.x[pos], y + deltas.y[pos])).filter(v => v).length; }
    function calcScores() { return bots.map(c => [c[0], getScore(c[0])]); }
    function canMoveHard(pos) { return isValidMove(pos); }
    function canMoveSoft(pos, prev) { return canMoveHard(pos) && isEdible(pos) && !isNearEdge(pos) && !isPrevMove(pos, prev); }
    function doNoise(op) { console.log(name + ": " + op); }
    function getAvailMoves(x = mx, y = my) { return Object.values(dest).map(function (pos) { return isValidMove(pos, x, y) ? pos : false; }).filter(function (pos) { return pos; }); }
    function getBotXY(uid) { return bots.find(b => b[0] == uid).slice(1); }
    function getColor(pos) { return getColorXY(mx + deltas.x[pos], my + deltas.y[pos]); }
    function getColorXY(x, y) { return isValidXY(x, y) ? grid[x][y] : -1; }
    function getDistancePos(pos, x = mx, y = my) { return (deltas.x[pos] * (deltas.x[pos] * (deltas.x[pos] > 0 ? gmax : gmin) - x)) + (deltas.y[pos] * (deltas.y[pos] * (deltas.y[pos] > 0 ? gmax : gmin) - y)); }
    function getEnemyXY() { return getBotXY(db.enemies.length > 0 ? db.enemies[0][0] : db.scores.filter(bot => bot[0] != mc && Math.abs(mc - bot[0]) % 3 != 2).sort((a,b) => b[1] - a[1])[0][0]) || [mx, my]; }
    function getLongestDir() { return Object.keys(dest).sort((a,b) => getDistancePos(b) > getDistancePos(a))[0]; }
    function getRandomDir() { moves = Object.values(dest).filter(m => isValidMove(m)); return moves[Math.floor(Math.random() * moves.length)]; }
    function getBadBots() { return bots.filter(b => b[0] != mc && getNextColor(mc, b[0]) == b[0]).map(a => a[0]); }
    function getDiagonalMoves(moves) { return [].concat(...best.map(m => Object.values(ddest).filter(a => a.includes(m)))); }
    function getDirectionXY(x, y) { return Object.keys(dest).map(dir => [dir, calcDistanceXY(x - deltas.x[dir], y - deltas.y[dir])]).sort((a,b) => a[1] - b[1])[0][0]; }
    function getNextColor(color, base = mc) { return color == blank ? base : [base, 0, color][Math.abs(base - color) % 3]; }
    function getNextMove() { return db.steps > 0 || (db.steps > -10 && isPaintable(db.mpos) && !isFriendPos(db.mpos)) ? [db.mpos, db.steps] : getBestDir(db.mpos, db.mprev) || [dest.wait, 5]; }
    function getBestDir(pos, prev) {
        main_moves = getBestMoves() || [getDirectionXY(getEnemyXY(x, y))]
        diagonal = getDiagonalMoves(main_moves);
        if (main_moves.length == 1) return [main_moves[0], 1];
        routes = Object.values(main_moves).map(function (pos) { return { pos: pos, depth: 0, score: getScoreDir(pos, prev) }; });
        routes = routes.concat([].concat(...Object.values(diagonal)
            .map(function (pos) { score = getScoreDir(pos, prev); return [{pos: pos[0], depth: 0, score: score/2}, {pos: pos[1], depth: 0, score: score/2}]; }))
            .filter(p => main_moves.includes(p["pos"])));
        results = main_moves.map(pos => pos = [pos, routes.filter(a => a["pos"] == pos).reduce((a, b) => a + b["score"] - b["depth"] * 1/dsight, 0)]).sort((a, b) => b[1] - a[1]);
        routes.sort(function (a, b) { return b["score"] - a["score"] })
        var [depth, steps, best_pos, best_score, max_depth] = [0, 1, routes[0]["pos"], routes[0]["score"], gmax / rmax * Math.min(rcurr, rmax) / 2];
        if (routes.length > 1 && noEdible()) {
            for (depth = 1; depth <= max_depth; depth++) {
                routes = routes.concat(Object.values(main_moves).map(function (pos) {
                    [x, y] = [mx + deltas.x[pos] * depth, my + deltas.y[pos] * depth]; moves = getBestMoves(x, y);
                    return { pos: pos, depth: depth, score: Math.max(...Object.values(moves).map(function (pos) { return getScoreDir(pos, prev, x, y); }), 0) };
                }))
                routes = routes.concat([].concat(...Object.values(diagonal)
                    .map(function (pos) { score = getScoreDir(pos, prev); return [{pos: pos[0], depth: 0, score: score/2}, {pos: pos[1], depth: 0, score: score/2}]; }))
                    .filter(p => main_moves.includes(p["pos"])));
                routes.sort(function (a, b) { return b["score"] - a["score"] });
            }
            results = main_moves.map(pos => pos = [pos, routes.filter(a => a["pos"] == pos).reduce((a, b) => a + b["score"] - b["depth"] * 1/dsight, 0)]).sort((a, b) => b[1] - a[1]);
            [best_pos, best_score] = results[0];
        }
        return best_score > 0 ? [best_pos, 1] : [getDirectionXY(...getEnemyXY()), 1];
    }
    function getBestMoves(x = mx, y = my) {
        if (!isValidXY(x, y)) return [];
        avail = getAvailMoves(x, y);
        moves = [
            avail.filter(p => isPaintableXY(x + deltas.x[p], y + deltas.y[p]) && !isFriendXY(x + deltas.x[p], y + deltas.y[p]) && !isBotPos(p) && p != rev[db.mpos]),
            avail.filter(p => isSoftXY(x + deltas.x[p], y + deltas.y[p]) && !isBotPos(p) && p != rev[db.mpos]),
            avail.filter(p => p != rev[db.mpos]),
        ].filter(i => i.length > 0);
        best = moves.length > 0 ? moves[0].filter(m => Object.keys({...dest}).map(pos => isPaintableXY(x + deltas.x[m] + deltas.x[pos], y + deltas.y[m] + deltas.y[pos])).filter(v => v).length > 0) : [];
        return best.length > 0 ? best : moves[0] || avail;
    }
    function getEnemies() {
        var pts = getStats(mc)[1];
        return db.scores.filter(bot => bot[0] != mc && !isFriendCol(bot[0]) && bot[1] > pts && Math.abs(mc - bot[0]) % 3 != 2).sort((a,b) => b[1] - a[1]);
    }
    function getFriends() {
        if (rcurr == 10 && db.friends.length > 0) doNoise(Array(db.friends.length+1).join(" Eep!"));
        return rcurr == 9 ? db.start.filter(b => b[0] != mc && [3, 4].indexOf(calcColor(...b)) > -1 && calcDistanceXY(...db.start.find(s => s[0] == b[0]).slice(1), ...bots.find(s => s[0] == b[0]).slice(1)) == 1) : db.friends;
    }
    function getScoreDir(pos, prev, sx = mx, sy = my) {
        if (!isValidXY(sx, sy)) return -1;
        let [dx, dy] = [typeof pos == "object" ? pos.reduce((sum, p) => sum + deltas.x[p], 0) : deltas.x[pos], typeof pos == "object" ? pos.reduce((sum, p) => sum + deltas.y[p], 0) : deltas.y[pos]]
        let [score, penalty, x, y] = [calcPaintable(sx, sy) * pboost, 0, sx + dx, sy + dy];
        while (isValidXY(x, y)) {
            if (isBotAround(x, y, pbotdist)) score /= 2;
            else if (isEnemyXY(x, y)) score += pplus * calcColor(getColorXY(x, y), x, y) * pboost - penalty
            else if (isPaintableXY(x, y)  && !isFriendXY(x, y)) score += pplus * calcPaintable(x, y) * pboost - penalty
            else if (isPaintedXY(x, y) || isFriendXY(x, y)) score -= pplus - penalty;
            [x, y, penalty] = [x + dx, y + dy, penalty - pplus/Math.max(calcDistanceXY(x, y), 1)];
        }
        return parseFloat(score.toFixed(2));
    }
    function getStrategyPos(pos) {
        switch(Number(pstrategy)) {
            case 1: return isSafeXY() && rcurr % 2 != 0 ? turn(rcurr > 8 ? dest.left : dest.right) : pos;
            case 2: return isSafeXY() && rcurr % 2 != 0 ? turn(rcurr > 8 ? dest.right : dest.right) : pos;
            case 3: return isSafeXY() && rcurr % 2 != 0 ? turn(rcurr > 10 ? (rcurr % 6 != 0 ? dest.left : dest.right) : dest.right) : pos;
            default: return db.mpos;
        }
    }
    function getScore(uid) { res = 0; grid.forEach(function(x) { res += x.reduce((a,b) => a += b == uid, 0) }); return res; }
    function getStats(uid) { return db.scores.find(a => a[0] == uid); }
    function isColorEdible(color) { return color != getNextColor(color); }
    function isEdge(pos, x = mx, y = my) { return (dest.left && x == gmin) || (dest.right && x == gmax) || (dest.up && y == gmin) || (dest.down && y == gmax); }
    function isEdgeXY(x, y) { return x == gmin || y == gmin || x == gmax || y == gmax; }
    function isEdible(pos, x = mx, y = my) { return isEdibleXY(x + deltas.x[pos], y + deltas.y[pos]); }
    function isEdibleXY(x, y) { return isValidXY(x, y) && getColorXY(x, y) != getNextColor(getColorXY(x, y)); }
    function isEnemyXY(x, y) { return isValidXY(x, y) && db.enemies.map(e => getColorXY(x, y) == e[0]).includes(true); }
    function isFirstHalf() { return rcurr < rmax / 2; }
    function isFriendCol(uid) { return uid > 0 && db.friends.map(f => f[0]).indexOf(uid) > -1; }
    function isFriendPos(pos) { return isFriendCol(getColor(pos)); }
    function isFriendXY(x, y) { return isFriendCol(getColorXY(x, y)); }
    function isNearEdge(pos, x = mx, y = my) { return isEdge(pos, x + deltas.x[pos], y + deltas.y[pos]); }
    function isPaintable(pos, x = mx, y = my) { return isPaintableXY(x + deltas.x[pos], y + deltas.y[pos]); }
    function isPaintableAround(x = mx, y = my) { return !Object.keys({...dest}).map(a => isPaintableXY(x + deltas.x[a], y + deltas.y[a])).includes(false); };
    function isPaintableXY(x, y, self = false) { return isValidXY(x, y) && (getColorXY(x, y) != mc && getNextColor(getColorXY(x, y)) == mc) || isEnemyXY(x, y); }
    function isPaintedXY(x, y) { return getColorXY(x, y) == mc; }
    function isPrevMove(pos, prev) { return deltas.x[pos] + deltas.x[prev] == deltas.y[pos] + deltas.y[prev]; }
    function isSafeAround(x = mx, y = my) { return !Object.keys({...dest, ...ddest}).map(a => isSafeXY(x + deltas.x[a], y + deltas.y[a])).includes(false); };
    function isSafeXY(x = mx, y = my) { return isValidXY(x, y) && !isBotAround(x, y) && !isEdgeXY(x, y) && getNextColor(getColorXY(x, y)) == mc; }
    function isSoftXY(x = mx, y = my) { return isEdibleXY(x, y) && !isEdgeXY(x, y) && !isBotAround(x, y); }
    function isValidMove(pos, x = mx, y = my) { return isValidXY(x + deltas.x[pos], y + deltas.y[pos]); }
    function isValidXY(x, y) { return (gmin <= x && gmin <= y && x <= gmax && y <= gmax); }
    function noBlanks() { return !Object.values(dest).map(function (pos) { return getColor(pos) == blank; }).includes(true); }
    function noEdible() { return !Object.values(dest).map(function (pos) { return isColorEdible(getColor(pos)); }).includes(true); }
    function onInit() { return {mpos: getLongestDir(), mprev: "wait", steps: 1, chased: 0, params: name.split(" ").slice(-1)[0].split(""), start: bots, scores: [], enemies: [], friends: [], bad: getBadBots()}; }
    function turn(pos = db.mpos) { return pos == dest.left ? turnLeft() : (pos == dest.right ? turnRight() : turnRandom()); }
    function turnLeft(pos = db.mpos) { next = { left: dest.down, right: dest.up, up: dest.left, down: dest.right }; return next[pos]; }
    function turnRandom(pos = db.mpos) { return Math.floor(Math.random() * 2) ? turnLeft() : turnRight(); }
    function turnRight(pos = db.mpos) { next = { left: dest.up, right: dest.down, up: dest.right, down: dest.left }; return next[pos]; }
    function isBotAround(bx = mx, by = my, far = 1) { return Object.values(bots).map(function ([c, x, y]) { return db.bad.includes(c) && calcDistanceXY(x, y, bx, by) <= far; }).includes(true); }
    function isBotPos(pos) { return Object.values(bots).map(function ([c, bx, by]) { return c != mc && calcDistanceXY(bx + deltas.x[pos], by + deltas.y[pos]) == 0; }).includes(true); }
    function isChased() { hello = isBotAround(mx, my, 2); if (!hello) db.chased = Math.max(0, --db.chased); return hello && db.chased++ > 5; }
    // Main logic.
    [next_move, db.steps] = !isChased() ? getNextMove() : [getDirectionXY(...getEnemyXY()), db.chased--];
    db = {mpos: next_move, mprev: db.mpos, steps: --db.steps, chased: db.chased, params: db.params, start: db.start, scores: rcurr % 10 == 0 || rcurr == 1 ? calcScores() : db.scores, enemies: rcurr % 5 == 0 ? getEnemies() : db.enemies, friends: getFriends(), bad: db.bad};
    localStorage.setItem(name, JSON.stringify(db));
    if (!dest[next_move]) doNoise("Eeek!");
    return next_move;
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
    // Do a quick dance for identification.
    let round = gameInfo[0];
    if (round < 5) {
        return ["down", "right", "up", "left"][round % 4];
    }

    // Parse the arguments.
    let [myId, myX, myY] = myself;

    // Check each square to see if it's a good target.
    let targetX, targetY, targetDist = Infinity;
    let numAtDist;
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            // Whoever's fighting for this square can have it.
            if (x === myX && y === myY) { continue; }
            // We don't care about our own squares.
            if (grid[x][y] === myId) { continue; }

            // Only squares that we can recolor are useful.
            if (grid[x][y] === 0 || Math.abs(grid[x][y] - myId) % 3 !== 2) {
                // Avoid squares that take effort.
                if (Math.abs(grid[x][y] - myId) % 3 === 1 && Math.random() < 0.5) { continue; }

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
    this.setupDone = false; if(this.setupDone == false) {
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
} }
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

        if (c != bc && Math.abs(c-bc)%3 == 0) {
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
    let id = me[0], meX = me[1], meY = me[2], s = board.length, ss = Math.ceil(s / 3), pl = painters.length, r = info[0], storage, sk = 'jijdfoadofsdfasz', s1, s2, scores = [], i, j;

    let bos = [
        [0, 0, ss - 1, ss - 1], [ss, 0, (ss * 2) - 1, ss - 1], [ss * 2, 0, s - 1, ss - 1], [ss * 2, ss, s - 1, (ss * 2) - 1],
        [ss * 2, ss * 2, s - 1, s - 1], [ss, ss * 2, (ss * 2) - 1, s - 1], [0, ss * 2, ss - 1, s - 1], [0, ss, ss - 1, (ss * 2) - 1],
    ];

    if (r === 1 || typeof this[sk] === 'undefined') {
        let n = ss + painters[0][1];
        s1 = bos[n % 8];
        s2 = bos[(n + 1) % 8];
        storage = this[sk] = {s1: s1, s2: s2, bs: null, c: 0};
    } else {
        storage = this[sk];
        s1 = storage.s1;
        s2 = storage.s2;
    }

    let getDistance = function (x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
    };

    let getColorValue = function (c) {
        if (c === 0) return 2;
        if (c === id) return -1;
        let value = 2 - (Math.abs(id - c) % 3);
        if (value === 1) return 0.1;
        return value;
    };

    let getEnemyValue = function (eId) {
        if (eId === id) return 0;
        let value = 2 - (Math.abs(id - eId) % 3);
        return (value === 1 ? 1.75 : value);
    };

    let isInSection = function (x, y, s) {
        return (x >= s[0] && y >= s[1] && x <= s[2] && y <= s[3]);
    };

    let bs = null;
    if (storage.bs === null || storage.c <= 0) {
        let mysi = null;
        for (i = 0; i < bos.length; i++) {
            if (isInSection(meX, meY, bos[i])) mysi = i;
            if ((bos[i][0] === s1[0] && bos[i][1] === s1[1] && bos[i][2] === s1[2] && bos[i][3] === s1[3]) || (r < 5e2 && bos[i][0] === s2[0] && bos[i][1] === s2[1] && bos[i][2] === s2[2] && bos[i][3] === s2[3])) {
                scores[i] = -100000;
            } else {
                scores[i] = 0;
                for (let bX = Math.max(bos[i][0], 1); bX < Math.min(bos[i][2], s - 1); bX++) for (let bY = Math.max(bos[i][1], 1); bY < Math.min(bos[i][3], s - 1); bY++) scores[i] += getColorValue(board[bX][bY]);
                for (j = 0; j < pl; j++) {
                    let pId = painters[j][0], pX = painters[j][1], pY = painters[j][2];
                    if (pId === id || pX === 0 || pX === s - 1 || pY === 0 || pY === s - 1 || !isInSection(pX, pY, bos[i])) continue;
                    scores[i] -= (getEnemyValue(pId) * ss) * 4;
                }
            }
        }
        let bss = null;
        for (i = 0; i < scores.length; i++) {
            if (bss === null || bss < scores[i]) {
                bss = scores[i];
                bs = bos[i];
            }
        }
        if (mysi !== null && scores[mysi] * 1.1 > bss) bs = bos[mysi];
        storage.bs = bs;
        storage.c = 250;
    } else {
        bs = storage.bs;
        storage.c--;
    }

    let getScore = function (x, y) {
        let score = 0;
        if (!isInSection(x, y, bs)) score -= s * 10;
        for (let bX = bs[0]; bX <= bs[2]; bX++) {
            for (let bY = bs[1]; bY <= bs[3]; bY++) {
                let distance = getDistance(x, y, bX, bY);
                let colorValue = getColorValue(board[bX][bY]);
                let factor = 1;
                if (distance === 1) factor = 3;
                else if (distance === 2) factor = 2;
                score += (colorValue / (distance / 4)) * factor;
                if (x === meX && y === meY && x === bX && y === bY && colorValue < 2) score -= 1000;
            }
        }
        for (let i = 0; i < pl; i++) {
            let pId = painters[i][0], pX = painters[i][1], pY = painters[i][2];
            if (pId === id || pX === 0 || pX === s - 1 || pY === 0 || pY === s - 1) continue;
            let pDistance = getDistance(x, y, pX, pY);
            if (pDistance > 5) continue;
            let pIdValue = getEnemyValue(pId);
            let factor = 4;
            if (pDistance === 1) factor = 8;
            else if (pDistance === 2) factor = 6;
            else score -= (pIdValue / pDistance) * factor;
        }
        return score + (Math.random() * 10);
    };

    if (isInSection(meX, meY, bs)) {
        let possibleMoves = [{x: 0, y: 0, c: 'wait'}];
        if (meX > 1) possibleMoves.push({x: -1, y: 0, c: 'left'});
        if (meY > 1) possibleMoves.push({x: -0, y: -1, c: 'up'});
        if (meX < s - 2) possibleMoves.push({x: 1, y: 0, c: 'right'});
        if (meY < s - 2) possibleMoves.push({x: 0, y: 1, c: 'down'});
        let topCommand, topScore = null;
        for (i = 0; i < possibleMoves.length; i++) {
            let score = getScore(meX + possibleMoves[i].x, meY + possibleMoves[i].y);
            if (topScore === null || score > topScore) {
                topScore = score;
                topCommand = possibleMoves[i].c;
            }
        }
        return topCommand;
    } else {
        let dX = ((bs[0] + bs[2]) / 2) - meX, dY = ((bs[1] + bs[3]) / 2) - meY;
        if (Math.abs(dX) > Math.abs(dY)) return (dX < 0 ? 'left' : 'right');
        else return (dY < 0 ? 'up' : 'down');
    }
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
    "func": function([mc, mx, my], grid, bots, [round, maxRound]) {const ID = 2;
  var S = this;
  const botAm = 3;
  function log(...args) {
    // if (round > 1) console.log(ID+" "+args[0], ...args.slice(1));
    return true;
  }
  if (round == 1) {
    var all = new Array(bots.length).fill().map((_,i)=>i+1);
    S.fs = new Array(botAm).fill().map(c =>
      [all.slice(), all.slice(), all.slice(), all.slice()]
    );
    S.doneSetup = false;
    var center = grid.length/2;
    // UL=0; DL=1; DR=2; UR=3
    S.dir = mx<center? (my<center? 0 : 1) : (my<center? 3 : 2);
    S.job = 0;
    S.botAm = bots.length;
    S.keys = [[1,1,0,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,0],
              [0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1,0,0,0,1,1],
              [1,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0]];
    /*if (ID == 2) */{
      S.chased = 0;
      S.ignore = [];
      S.badMoves = 0;
      S.pastMoves = new Array(100).fill("-1;0");
      S.timer = 0;
      S.jimFn = function([mc, mx, my], grid, bots, [round, maxRound]) { // ---------- BEGIN JIM ---------- \\
        var output;
        var allowRetracing = false;

        var checkSize = 3;
        var eatSize = 5;
        var myScore;
        var scoreboard;



        if (grid[mx][my] == 0 && !bots.some(([col, bx, by])=> col != mc && bx==mx && by==my)) return "wait"; // collect those sweet points

        // rescore every now and then
        if (S.timer > 200) rescore();

        S.pastMoves.push(mx+";"+my);
        S.pastMoves.shift();


        var orth = [[-1,0],[0,-1],[1,0],[0,1]];
        if (S.atTarget
        || S.targetX === undefined || S.targetY === undefined
        || S.targetX === mx && S.targetY === my
        || orth.map(([x,y])=>[mx+x,my+y]).filter(c=>get(c)==0 && inbounds(c)).length > 2) {

          S.atTarget = true;
          var neighbors = orth
            .map(([x,y]) => [x+mx, y+my])
            .filter(inbounds)
            .filter(([x,y]) => !bots.some(([bid, bx, by]) => bx==x && by==y))
            .map(c=>[c,get(c)]);

          let test = (neighbors, f, msg) => {
            return bestOf(neighbors.filter(f).map(c=>c[0])) && log(msg);
          }

          if (test(neighbors, ([,c]) => c===0        , "good")) return output;
          if (test(neighbors, ([,c]) => overMap(c, 1),  "sad")) return output;

          S.atTarget = false;
          S.targetX = S.targetY = undefined;
          let bestScore = 7;
          let bfscore = 0;

          for (let dist = 4; dist < 8; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds([cx, cy])) {
                  let score = scoreOf(cx, cy, 1, false);
                  if(score>bfscore)bfscore=score;
                  if (score > bestScore) {
                    bestScore = score;
                    S.targetX = cx;
                    S.targetY = cy;
                  }
                }
              }
            }
          }
          if (S.targetX) {
            log("short goto", S.targetX, S.targetY,"(rel",S.targetX-mx, S.targetY-my,") score", bestScore);
            return to([S.targetX, S.targetY]);
          } else log("long goto",bfscore);


          rescore();
          return to([S.targetX, S.targetY]);
        } else log("going to target", S.targetX, S.targetY);

        return to([S.targetX, S.targetY]);

        function myScore() {
          if (!myScore) calculateScoreboard();
          return myScore;
        }
        function calculateScoreboard() {
          scoreboard = grid.map(column=> {
            var arr = new Int16Array(grid.length);
            column.forEach((c, x) => (
              myScore+= c==mc,
              arr[x] = overMap(c, 1, 0, 0, 0, 5)
            ));
            return arr;
          });
          for (let [bc, bx, by] of bots) if (bc != mc) {
            scoreboard[bx][by] = -100;
            if (inbounds([bx-2, by])) scoreboard[bx-2][by] = -50;
            if (inbounds([bx+2, by])) scoreboard[bx+2][by] = -50;
            if (inbounds([bx, by-2])) scoreboard[bx][by-2] = -50;
            if (inbounds([bx, by+2])) scoreboard[bx][by+2] = -50;
          }
        }
        function scoreOf (x, y, size, includeEnemies) {
          if (!scoreboard) calculateScoreboard();
          let score = 0;
          for (let dx = -size; dx <= size; dx++) {
            let cx = dx + x;
            if (cx < 1 || cx >= grid.length-1) continue;
            for (let dy = -size; dy <= size; dy++) {
              let cy = dy + y;
              if (cy < 1 || cy >= grid.length-1) continue;
              let cs = scoreboard[cx][cy];
              if (cs > 0 || includeEnemies) score+= cs;
            }
          }
          return score;
        }
        function rescore() { // heatmap of best scoring places
          //log(JSON.stringify(scoreboard));
          S.bestScore = -Infinity;
          var blur = grid.map((column, x)=>column.map((c, y) => {
            let score = scoreOf(x, y, checkSize, true);
            if (score > S.bestScore) {
              S.bestScore = score;
              S.targetX = x;
              S.targetY = y;
            }
            return score;
          }));
          S.atTarget = false;
          S.timer = 0;
          S.bestScore = scoreOf(S.targetX, S.targetY, eatSize);
          S.badMoves = 0;
          // log("scored to", S.targetX, S.targetY, S.bestScore);
        }
        function over(col) { // 1 if overrides happen, -1 if overrides don't happen, 0 if override = 0
          let res = Math.abs(mc-col) % 3;
          return res==1? 0 : res==0? 1 : -1;
        }
        function overMap(col, best = 0, good = 0, bad = 0, mine = 0, zero = 0) { // best if overrides happen, bad if overrides don't happen, good if override = 0
          let res = Math.abs(mc-col) % 3;
          return col == 0? zero : col == mc? mine : res==1? good : res==0? best : bad;
        }
        function iwin   (col) { return over(col) == 1; }
        function zeroes (col) { return over(col) == 0; }
        function to([x, y]) {
          //debugger
          var LR = x > mx? [mx+1, my] : x < mx? [mx-1, my] : null;
          var UD = y > my? [mx, my+1] : y < my? [mx, my-1] : null;
          if (LR && UD) {
            var LRScore = overMap(LR, 1, 0, 0, 0, 3);
            var UDScore = overMap(UD, 1, 0, 0, 0, 3);
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
            score-= Math.sqrt((x-S.targetX)**2 + (y-S.targetY)**2);
            if (S.pastMoves.includes(x+";"+y)) score-= 1000000;

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
      } // ---------- END JIM ---------- \\
    }
  }
  const dirs = ['up','left','down','right'];

  if (!S.doneSetup) { // ---------- HANDSHAKE ---------- \\
    let finished = 0;
    if (round != 1) {
      for (let id = 0; id < botAm; id++) {
        let f = S.fs[id];
        let remaining = f.map(c=>c.length).reduce((a,b)=>a+b);
        if (remaining == 1) {
          finished++;
          continue;
        }
        if (remaining == 0) {
          // mourn the loss of a good friend
          finished++;
          continue;
        }
        for (let dir = 0; dir < 4; dir++) {
          let possible = f[dir];

          for (let i = possible.length-1; i >= 0; i--) {
            let bc = possible[i];
            let curr =       bots.find(c=>c[0]==bc);
            let prev = S.pastBots.find(c=>c[0]==bc);
            let dx = curr[1]-prev[1];
            let dy = curr[2]-prev[2];
            let move;
            if (dy == 0) {
              if (dx == 1) move = 'right';
              else         move = 'left';
            } else {
              if (dy == 1) move = 'down';
              else         move = 'up';
            }
            let omove = rotate(move, dir);
            let expected = ['down','right'][S.keys[id][round-1]];
            // if (id == 0 && dir == S.dir) log();
            if (omove != expected) possible.splice(i,1);
          }
        }
      }
    }
    S.pastBots = bots;
    if (finished == botAm) {
      S.doneSetup = true;
      S.BCs = new Array(botAm).fill().map((_,i) => (S.fs[i].find(c=>c.length > 0) || [-1])[0]); // AKA idtoc
      S.fighters = S.BCs.slice(0,2);
      S.ctoid = {[S.BCs[0]]:0, [S.BCs[1]]:1, [S.BCs[2]]:2};
      log("identified", S.BCs);
      if (ID == 2) {
        log("can beat", bots.filter(c=>S.fighters.filter(b=>Math.abs(b-c[0])%3 != 2).length > 0).map(c=>c[3]));
      }
    } else {
      // log(ID,S.fs);
      return rotate(['down','right'][S.keys[ID][round]], S.dir);
    }
  }


  if (S.doneSetup && ID == 2) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]);




  if (!bots.find(c=>c[0]==S.fighters[1-ID])) return 'wait'; // for my demise
  if (round < 50 || !bots.find(c=>c[0]==S.BCs[2])) return S.jimFn([mc, mx, my], grid, bots, [round, maxRound]); // if Jim's dead, be Jim so others don't win needlessly
  // TODO yeah no

  let tbot = bots.find(c=>c[0] == S.tbotc);


  // ---------- NEW TARGET ---------- \\
  let tried;
  while ((!S.tbotc || !tbot) && !S.finished) {
    if (!tried) tried = S.BCs.slice();
    S.gotoX = S.gotoY = undefined;
    let scores = new Uint32Array(S.botAm+1);
    for (let column of grid) for (let item of column) scores[item]++;
    var bbc, bbs=-Infinity;
    for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && !tried.includes(i)) {
      bbs = scores[i];
      bbc = i;
    }
    S.tbotc = bbc;
    tbot = bots.find(c=>c[0] == bbc);

    S.jobs = [0,0];
    let executers = S.fighters.filter(c=>Math.abs(c-bbc)%3 == 1).concat(S.fighters.filter(c=>Math.abs(c-bbc)%3 == 0));
    if (executers.length > 1) {
      S.jobs[S.ctoid[executers.pop()]] = 1;
      S.jobs[S.ctoid[executers.pop()]] = 2;
      //S.jobs.forEach((c,id) => c==0? S.jobs[id]=2 : 0);
      log("targetting", botName(bbc),"jobs",S.jobs);
    } else {
      // cry
      tried.push(bbc);
      S.tbotc = tbot = undefined;
    }
    S.job = S.jobs[ID];
    if (tried.length >= bots.length) {
      // everyone is dead
      S.job = 0;
      S.jobs = new Array(2).fill(0);
      S.finished = true;
      break;
    }
  }

  if (tbot && !S.finished) {
    let [_, tx, ty] = tbot;

    switch (S.job) {
      case 1: // follow
        return to(tx, ty, S.tbotc);
      break;
      case 2: // erase
        let endingClearing = false;
        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          S.gotoX = undefined;
          var ending = [S.tbotc, ...S.fighters.filter(c=>c != mc)].map(c => bots.find(b=>b[0]==c)).filter(I=>I);
          search: for (let dist = 1; dist < grid.length*2+2; dist++) {
            for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
              for (let i = 0; i < dist; i++) {
                let cx = dx*i + dsx*dist + mx;
                let cy = dy*i + dsy*dist + my;
                if (inbounds(cx, cy)) {
                  if (grid[cx][cy] == S.tbotc && ending.every(([_,bx,by]) => (bx-cx)**2 + (by-cy)**2 > Math.random()*10)) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
          if (S.gotoX === undefined) {
            let available = [];
            grid.forEach((column, x) => column.forEach((c, y) => c==S.tbotc? available.push([x,y]) : 0));
            [S.gotoX, S.gotoY] = available[Math.floor(Math.random()*available.length)];
            endingClearing = true;
          }
        }
        return to(S.gotoX, S.gotoY, endingClearing? undefined : S.tbotc);
      break;
      case 0: // exercise

        if (S.gotoX === undefined  ||  S.gotoX==mx && S.gotoY==my  ||  grid[S.gotoX][S.gotoY] != S.tbotc) {
          let scores = new Uint32Array(S.botAm+1);
          for (let column of grid) for (let item of column) scores[item]++;
          var bbc, bbs=-Infinity;
          for (let i = 1; i < S.botAm+1; i++) if (scores[i] > bbs && Math.abs(mc-i)%3 == 0 && !S.BCs.includes(i)) {
            bbs = scores[i];
            bbc = i;
          }
          if (bbc) {
            S.gotoX = undefined;
            search: for (let dist = 1; dist < grid.length*2+2; dist++) {
              for (let [dsx, dsy, dx, dy] of [[0,-1,1,1], [1,0,-1,1], [0,1,-1,-1], [-1,0,1,-1]]) {
                for (let i = 0; i < dist; i++) {
                  let cx = dx*i + dsx*dist + mx;
                  let cy = dy*i + dsy*dist + my;
                  if (inbounds(cx, cy) && grid[cx][cy] == bbc) {
                    S.gotoX = cx;
                    S.gotoY = cy;
                    break search;
                  }
                }
              }
            }
          }
        }
        if (S.gotoX !== undefined) return to(S.gotoX, S.gotoY);
        return dirs[Math.floor(Math.random()*4)];
      break;
    }
  }


  function to (x, y, col) {
    if  (x == mx&&y== my) return 'wait';
    let dx =   x    - mx ;
    let dy =      y - my ;
    let ax = Math.abs(dx);
    let ay = Math.abs(dy);
    var          diag;
    if   (     ax==ay   ) {
      if (col&&ax+ ay==2) {
        let i=[[x, my], [mx, y]].findIndex(c=>grid[c[0]][c[1]]==col);
        if (i<0) diag = Math.random()>=.5;
        else     diag =           i  == 0;
      } else     diag = Math.random()>=.5;
    }
    if (ax==ay?  diag :  ax>ay) {
      if (dx>0) return 'right';
      else      return  'left';
    } else {
      if (dy>0) return  'down';
      else      return    'up';
    }
  }

  function rotate (move, dir) {
    if ((move == 'up' || move == 'down') && (dir && dir<3)) {
      if (move == 'up') return 'down';
      else return 'up';
    }
    if ((move == 'left' || move == 'right') && dir>1) {
      if (move == 'left') return 'right';
      else return 'left';
    }
    return move;
  }
  function botName(id) {
    return bots.find(c=>c[0]==id)[3] + "/" + id;
  }
  function inbounds(x, y) { return x<grid.length && y<grid.length && x>=0 && y>=0 }
}
  },
  {
    "name": "¯\\_(ツ)_/¯ (Random moves)",
    "func": function(myself, grid, bots, gameInfo) {
    return ["up","down","left","right"][Math.random() *4 |0]
}
  }
];