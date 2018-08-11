//Controller for Gold Collector KoTH by RedwolfPrograms, tested and (mostly) functional
//
//Use botSetup() to prepare, and runBots() to run one move.

/* Unused colors:
#00d6e6
#ace2e6
#003340
#0077b3
#80d5ff
#007ae6
#203980
#070033
#968fbf
#a280ff
#aa00ff
#3d3040
#770080
#47004d
#e673de
#a6296c
#592d39
#e53950
#d9a3aa
*/

var botData = 
[
    {
        name: "Potentially Victorious",
	color: "#1600a6",
	run: function (me, others, coins)
	{
	    let huntingTimer = botNotes.getData("huntingTimer");
	    let huntedIndex = botNotes.getData("huntedIndex");
	    if(!huntingTimer)
		huntingTimer = 0;
	    else if(huntingTimer >0)
		huntingTimer--;
	    else if(huntingTimer == -1)
		huntingTimer = 20;
	    else
		huntingTimer++;

	    function U(x, y)
	    {
		function distance(X, Y) { return Math.abs(X-x) + Math.abs(Y-y); }
		function gravitation(k, X, Y) { return - k / ( distance(X, Y) + .2 ); }
		function exponential(k, q, X, Y) { return - 5*k * Math.exp(- q * distance(X,Y)); }

		// No going away from the arena.
		if(!((0 <= x) && (x < me.arenaLength) && (0 <= y) && (y < me.arenaLength)))
		{
		    return Infinity;
		}

		let potential = gravitation(40, coins[0][0], coins[0][1]); // Gold

		// Silver
		for(let i = 1; i < 5; i++)
		{
		    potential += gravitation(10, coins[i][0], coins[i][1]);
		}

		others.sort((a, b) => b[2] - a[2]);

		// Other bots
		for(let i = 0; i < others.length; i++)
		{
		    if(
			    ((Math.abs(me.locationX - others[i][0]) + Math.abs(me.locationY - others[i][1])) == 1) &&
			    (huntingTimer == 0) &&
			    (me.coins > 25) && (me.coins < 100) &&
			    (me.coins < (others[0][2] - 5)) &&
			    (others[i][2] < me.coins-5) && (others[i][2] >= (me.coins-5)/2)
		    )
		    {
			    huntingTimer = -10;
			    huntedIndex = i;
		    }

		    if((huntingTimer < 0) && (huntedIndex == i))
			   potential += exponential(30, 1, others[i][0], others[i][1]);
		    
		    if(others[i][2] >= me.coins)
		    {
			// Otherwise, they could eat us, and we will avoid them.
			potential += exponential(-1400, 3, others[i][0], others[i][1]);
		    }
		}

		// Wall
		// let wallDistance = Math.min(x, y, me.arenaLength - x, me.arenaLength - y);
		// potential += 10 * Math.exp(1 - wallDistance);

		return potential;
	    }
	    
	    // All possible squares we can move to, with their names.
	    let movements = [
		[ "north", U(me.locationX, me.locationY - 1)],
		[ "south", U(me.locationX, me.locationY + 1)],
		[ "east", U(me.locationX + 1, me.locationY)],
		[ "west", U(me.locationX - 1, me.locationY)],
		[ "none", U(me.locationX, me.locationY)]
	    ];

	    botNotes.storeData("huntingTimer", huntingTimer);
	    botNotes.storeData("huntedIndex", huntedIndex);

	    // Sort them according to the potential U and go wherever the potential is lowest.
	    movements.sort((a, b) => a[1] - b[1]);
	    return movements[0][0];
	}
    },
{
	name: "Feudal Noble",
	color: "#268299",
	run: function (noble, peasants, coins) {
	    var getDistance = function (x1, y1, x2, y2) {
		return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
	    };

	    var center = (noble.arenaLength - 1) / 2, centerSize = noble.arenaLength / 4, peasantsCount = peasants.length;
	    var centerMin = center - centerSize, centerMax = center + centerSize;

	    var isAtCenter = function (x, y) {
		return (x > centerMin && x < centerMax && y > centerMin && y < centerMax);
	    };

	    var getScore = function (x, y) {
		var score = 0, i;

		for (i = 0; i < peasantsCount; i++) {
		    var peasantCoins = peasants[i][2], peasantDistance = getDistance(x, y, peasants[i][0], peasants[i][1]);

		    if (noble.coins > peasantCoins && isAtCenter(x, y)) {
			score += Math.min(100, peasantCoins) / peasantDistance;
		    } else if (noble.coins <= peasantCoins && peasantDistance <= 3) {
			score -= (peasantDistance === 3 ? 50 : 2000);
		    }
		}

		for (i = 0; i < coins.length; i++) {
		    if (isAtCenter(coins[i][0], coins[i][1])) {
			var coinDistance = getDistance(x, y, coins[i][0], coins[i][1]),
			    coinValue = (i === 0 ? 500 : 200),
			    coinCloserPeasants = 1;

			for (var j = 0; j < peasantsCount; j++) {
			    var coinPeasantDistance = getDistance(peasants[j][0], peasants[j][1], coins[i][0], coins[i][1]);
			    if (coinPeasantDistance<= coinDistance && peasants[j][2] >= noble.coins) coinCloserPeasants++;
			}

			score += (coinValue / coinCloserPeasants) / (coinDistance / 3);
		    }
		}

		score -= getDistance(x, y, center, center) * 10;

		return score;
	    };

	    var possibleMoves = [{x: 0, y: 0, c: 'none'}];
	    if (noble.locationX > 0) possibleMoves.push({x: -1, y: 0, c: 'west'});
	    if (noble.locationY > 0) possibleMoves.push({x: -0, y: -1, c: 'north'});
	    if (noble.locationX < noble.arenaLength - 1) possibleMoves.push({x: 1, y: 0, c: 'east'});
	    if (noble.locationY < noble.arenaLength - 1) possibleMoves.push({x: 0, y: 1, c: 'south'});

	    var topCommand, topScore = null;
	    for (var i = 0; i < possibleMoves.length; i++) {
		var score = getScore(noble.locationX + possibleMoves[i].x, noble.locationY + possibleMoves[i].y);
		if (topScore === null || score > topScore) {
		    topScore = score;
		    topCommand = possibleMoves[i].c;
		}
	    }

	    return topCommand;
	}

},
{
	name: "Bait Bot",
	color: "#660000",
	run: function baitBot(me, others, coins) {
	  let directions = ['none','east','south','west','north']
	  function distanceTo(a) {
	    return (Math.abs(a[0] - me.locationX) + Math.abs(a[1] - me.locationY))
	  }
	  function distanceBetween(a, b){
	    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]))
	  }
	  function adjacentDir(a) {
	    //0 = no, 1,2,3,4 = ESWN
	    if(distanceTo(a) == 1) {
	      if(a[0] > me.locationX){ return 1}
	      else if(a[0] < me.locationX) {return 3}
	      else if(a[1] > me.locationY) {return 2}
	      else{ return 4}
	    }
	    else {return 0}
	  }
	  function edibility(a) {
	    return me.coins - a[2]
	  }

	  //Find nearest coin and get next to it
	  let closestCoin = coins.sort((a,b) => distanceTo(a) - distanceTo(b))[0]
	  if(distanceTo(closestCoin) > 1) {
	    if(closestCoin[0] > me.locationX){ return 'east'}
	    else if(closestCoin[0] < me.locationX){ return 'west'}
	    else if(closestCoin[1] > me.locationY){ return 'north'}
	    else if(closestCoin[1] < me.locationY){ return 'south'}
	  }

	  //If we're next to a coin and there's a threat close, just grab it
	  let nearestThreat = others.filter(a => edibility(a) < 0).sort((a,b) => distanceTo(a) - distanceTo(b))[0]
	  if(nearestThreat && (distanceTo(nearestThreat) <= 2)) {
	    return directions[adjacentDir(closestCoin)]
	  }

	  //Otherwise, wait until there's a target also next to the coin
	  let targets = others.filter(a => edibility(a) > 0 && distanceBetween(closestCoin, a) == 1)
	  if(targets.length > 0){
	    return directions[adjacentDir(closestCoin)]
	  }
	  return directions[0]

	}
},
{
	name: "1st Gen Algorithm",
	color: "#330d0d",
	run: function () {
		return ['north','east','south','west'][(Math.random()*4)|0];
	} 
},
{
	name: "GUT",
	color: "#a65e53",
	run: function gut(me, others, coins) {
	    // Prepare values for the calculation
	    var x = me.locationX;
	    var y = me.locationY;
	    var cMe = me.coins+1;
	    var arenaLen = me.arenaLength;

	    var objects = [];

	    // Add bots to objects
	    for (var i = 0; i < others.length; i++) {
		objects.push([others[i][0],others[i][1],others[i][2]/cMe]);
	    }

	    // Add coins to objects
	    for (var j = 0; j < coins.length; j++) {
		var coinVal = 0;

		if (j == 0) {
		    // Gold has a higher coin value
		    coinVal = -10;
		} else {
		    // Silver has a lower coin value
		    coinVal = -5;
		}

		objects.push([coins[j][0],coins[j][1],coinVal/cMe]);
	    }

	    // Perform the calculation
	    // x acceleration
	    var x_acceleration = 0;

	    for (var k=0; k < objects.length; k++) {
		var kval = objects[k][2];
		var xval = objects[k][0];

		x_acceleration += 200*kval/cMe*(x-xval)*Math.exp(Math.pow(kval,2)-50*Math.pow(x-xval,2));
	    }

	    // y acceleration
	    var y_acceleration = 0;

	    for (var l=0; l < objects.length; l++) {
		var kval = objects[l][2];
		var yval = objects[l][1];

		y_acceleration += 200*kval/cMe*(y-yval)*Math.exp(Math.pow(kval,2)-50*Math.pow(y-yval,2));
	    }

	    // Compare the values
	    if (Math.abs(y_acceleration)>Math.abs(x_acceleration)) {
		if (y_acceleration < 0) {
		    // Don't fall off the edge
		    if (y>0) {
			return "north";
		    } else {
			return "none";
		    }
		} else {
		    if (y<arenaLen-1) {
			return "south";
		    } else {
			return "none";
		    }
		}
	    } else if (Math.abs(y_acceleration)<Math.abs(x_acceleration)) {
		if (x_acceleration < 0) {
		    if (x>0) {
			return "west";
		    } else {
			return "none";
		    }
		} else {
		    if (x<arenaLen-1) {
			return "east";
		    } else {
			return "none";
		    }
		}
	    } else {
		return "none";
	    }
	} 
},
{
	name: "Anti-Capitalist",
	color: "#453c39",
	run: function (me, capitalists, coins){

	    function acquireTargets(capitalists){
		capitalists.sort((a, b) => a[2] < b[2]);
		let previousCapitalist;
		for(let i in capitalists){
		    let capitalist = capitalists[i];

		    if(capitalist[2] === 0){
			return false;
		    }
		    if(previousCapitalist && capitalist[2] === previousCapitalist[2]){
			return [previousCapitalist, capitalist];
		    }

		    previousCapitalist = capitalist;
		}

		return false;
	    }

	    function move(){
		const targets = acquireTargets(capitalists);
		if(!targets){
		    return 'none';
		}

		const coordinates = [Math.floor((targets[0][0] + targets[1][0]) / 2), Math.floor((targets[0][1] + targets[1][1]) / 2)];
		if(me.locationX !== coordinates[0]){
		    return me.locationX < coordinates[0] ? 'east' : 'west';
		}
		else if(me.locationX !== coordinates[1]){
		    return me.locationY < coordinates[1] ? 'south' : 'north';
		}
		else {
		    return 'none';
		}
	    }

	    return move();
	}
},
{
	name: "Quantum Gnat",
	color: "#4d3c39",
	run: function (me, others, coins) {
	  let quantumCoefficient = .2
	  let turn = botNotes.getData('turn')
	  botNotes.storeData('turn', turn+1)
	  botNotes.storeData('test', [2, 5, 7])
	  botNotes.getData('test')
	  let dG = {'none': [0, 0, -2, -2], 'east': [1, 0, me.arenaLength-1, -2], 'south': [0, 1, -2, me.arenaLength-1], 'west': [-1, 0, 0, -2], 'north': [0, -1, -2, 0]}

	  function randomInt(a) {
	    return Math.floor(Math.random() * a);
	  }
	  function getRandomDirection() {
	    return ['east', 'west', 'north', 'south'][randomInt(4)]
	  }
	  function distanceBetween(a, b){
	    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]))
	  }
	  function isTargetSafe(a) {
	    for (let i = 0; i < others.length; i++) {
	      if (others[i][2] >= me.coins && distanceBetween(a, others[i]) <= 1) {
		return false
	      }
	    }
	    return true
	  }
	  function isEnemySquare(a) {
	    for (let i = 0; i < others.length; i++) {
	      if (distanceBetween(a, others[i]) == 0) {
		return true
	      }
	    }
	    return false
	  }
	  function getSafeDirections() {
	    let candidates = {'none': true, 'east': true, 'south': true, 'west': true, 'north': true}
	    for (let key in dG) {
	      if (me.locationX == dG[key][2] || me.locationY == dG[key][3] || !isTargetSafe([me.locationX+dG[key][0], me.locationY+dG[key][1]])) {
		candidates[key] = false
	      }
	    }
	    //alert('Safe: ' + candidates['north'] + ', ' + candidates['east'] + ', ' + candidates['south'] + ', ' + candidates['west'])
	    return candidates
	  }
	  function getThreatDirections() {
	    let candidates = {'none': false, 'east': false, 'south': false, 'west': false, 'north': false}
	    for (let key in dG) {
	      if (isEnemySquare([me.locationX+dG[key][0], me.locationY+dG[key][1]])) {
		candidates[key] = true
	      }
	    }
	    return candidates
	  }
	  function getTargetDirections() {
	    let targetBot = null
	    let candidates = {'none': false, 'east': false, 'south': false, 'west': false, 'north': false}
	    for (let i = 0; i < others.length; i++) {
	      if (distanceBetween([me.locationX, me.locationY], others[i]) > 2 && (!targetBot || targetBot[2] < others[i][2])) {
		targetBot = others[i]
	      }
	    }
	    if (targetBot[0] < me.locationX) {
	      candidates['west'] = true
	    } else if (targetBot[0] > me.locationX) {
	      candidates['east'] = true
	    }
	    if (targetBot[1] > me.locationY) {
	      candidates['south'] = true
	    } else if (targetBot[1] < me.locationY) {
	      candidates['north'] = true
	    } 
	    //alert('Chasing ' + targetBot[0] + ', ' + targetBot[1] + ' (' + targetBot[2] + ')')
	    //alert('Path: ' + candidates['north'] + ', ' + candidates['east'] + ', ' + candidates['south'] + ', ' + candidates['west'])
	    return candidates
	  }

	  let safeDirections = getSafeDirections()
	  let threatDirections = getThreatDirections()
	  let targetDirections = getTargetDirections()
	  let chosenDir = null
	  let choices = []
	  for (key in safeDirections) {
	    if (safeDirections[key] && targetDirections[key]) {
	      choices.push(key)
	    }
	  }
	  if (choices.length == 0) {
	    //alert('Best options are blocked...')
	    for (key in safeDirections) {
	      if (safeDirections[key]) {
		choices.push(key)
	      }
	    }
	  }
	  for (key in threatDirections) {
	    if (threatDirections[key] && Math.random() < quantumCoefficient) {
	      //alert('Chance for quantum swap!')
	      choices.push(key)
	    }
	  }
	  if (choices.length > 0) {
	    chosenDir = choices[randomInt(choices.length)]
	  } else {
	    //alert('No options? Guess we spin the wheel.')
	    chosenDir = getRandomDirection()
	  }

	  return chosenDir
	}
},
{
	name: "Safety Coin",
	color: "#ffa280",
	run: function (myself,others,coins) {
	  x=myself.locationX;
	  y=myself.locationY;
	  power=myself.coins;
	  arenaSize=myself.arenaLength;
	  dist=0;
	  optimalCoin=7;
	  optimalDist=11*arenaSize;
	  for(i=0;i<coins.length;i++){
	    enemyDist=3*arenaSize;
	    dist=Math.abs(x-coins[i][0])+Math.abs(y-coins[i][1])
	    for(j=0;j<others.length;j++){
	      if(i==0){
		if(others[j][2]+5>=power){
		  enemyDist=Math.min(enemyDist,Math.abs(others[j][0]-coins[i][0])+Math.abs(others[j][1]-coins[i][1]))
		}
	      }
	      else{
		if(others[j][2]+2>=power){
		  enemyDist=Math.min(enemyDist,Math.abs(others[j][0]-coins[i][0])+Math.abs(others[j][1]-coins[i][1]))
		}
	      }

	    }
	    if(enemyDist>dist){
	      if(i==0){
		if(dist/5<optimalDist){
		  optimalDist=dist/5;
		  optimalCoin=i;
		}
	      }
	      else{
		if(dist/2<optimalDist){
		  optimalDist=dist/2;
		  optimalCoin=i;
		}
	      }
	    }
	  }
	  if(optimalCoin==7){
	    safeDir=15;
	    if(x==0){safeDir-=8;}
	    if(x==arenaSize-1){safeDir-=2;}
	    if(y==0){safeDir-=1;}
	    if(y==arenaSize-1){safeDir-=4;}
	    for(i=0;i<others.length;i++){
	      if(others[i][2]>=power){
		if(Math.abs(x-others[i][0])+Math.abs(y-others[i][1])==2){
		  if(x-others[i][0]>0){safeDir-=8;}
		  if(x-others[i][0]<0){safeDir-=2;}
		  if(y-others[i][1]>0){safeDir-=1;}
		  if(y-others[i][1]<0){safeDir-=4;}
		}
	      }
	    }
	    directions=["north","east","south","west"];
	    if(safeDir!=0){
	      tmp="";
	      tmp+="0".repeat(Math.max(Math.sqrt(arenaSize)/2|0,y-(arenaSize/2|0)));
	      tmp+="2".repeat(Math.max(Math.sqrt(arenaSize)/2|0,(arenaSize/2|0)-y));
	      tmp+="1".repeat(Math.max(Math.sqrt(arenaSize)/2|0,(arenaSize/2|0)-x));
	      tmp+="3".repeat(Math.max(Math.sqrt(arenaSize)/2|0,x-(arenaSize/2|0)));
	      rnd=tmp[Math.random()*tmp.length|0];
	      while(!(2**rnd&safeDir)){rnd=tmp[Math.random()*tmp.length|0];}
	      return directions[rnd];
	    }
	    return "none";//the only safe move is not to play :P
	  }
	  distX=coins[optimalCoin][0]-x;
	  distY=coins[optimalCoin][1]-y;
	  if(Math.abs(distX)>Math.abs(distY)){
	    if(distX>0){return "east";}
	    else{return "west";}
	  }
	  else{
	    if(distY>0){return "south";}
	    else{return "north";}
	  }
	}
},
{
	name: "Firebird",
	color: "#b2622d",
	run: function () {
	    var pos = botNotes.getData("pos");
	    if (pos === null || pos === "up") {
		botNotes.storeData("pos", "mid");
		return "south";
	    } else if (pos === "mid") {
		botNotes.storeData("pos", "down");
		return "south";
	    } else if (pos === "down") {
		botNotes.storeData("pos", "center");
		return "north";
	    } else {
		botNotes.storeData("pos", "up");
		return "north";
	    }
	}
},
{
	name: "Proton",
	color: "#ffd9bf",
	run:function (myself,others,coins){
		  x=myself.locationX;
		  y=myself.locationY;
		  power=myself.coins;
		  arenaSize=myself.arenaLength;
		  forceX=0;
		  forceY=0;
		  prevState=botNotes.getData("proton_velocity");
		  if(prevState){
		    velocity=prevState[0];
		    direction=prevState[1];
		  }
		  else{
		    velocity=0;
		    direction=0;
		  }
		  for(i=0;i<coins.length;i++){
		    if(Math.abs(x-coins[i][0])+Math.abs(y-coins[i][1])==1){
		      velocity=0;
		      direction=0;
		      botNotes.storeData("proton_velocity",[velocity,direction]);
		      if(x-coins[i][0]==1){return "west";}
		      if(coins[i][0]-x==1){return "east";}
		      if(y-coins[i][1]==1){return "north";}
		      if(coins[i][1]-y==1){return "south";}
		    }
		    else{
		      dist=Math.sqrt(Math.pow(x-coins[i][0],2)+Math.pow(y-coins[i][1],2));
		      if(i==0){
			forceX+=(x-coins[i][0])*5/Math.pow(dist,3);
			forceY+=(y-coins[i][1])*5/Math.pow(dist,3);
		      }
		      else{
			forceX+=(x-coins[i][0])*2/Math.pow(dist,3);
			forceY+=(y-coins[i][1])*2/Math.pow(dist,3);
		      }
		    }
		  }
		  for(i=0;i<others.length;i++){
		    if(Math.abs(x-others[i][0])+Math.abs(y-others[i][1])==1&&power>others[i][2]){
		      velocity=0;
		      direction=0;
		      botNotes.storeData("proton_velocity",[velocity,direction]);
		      if(x-others[i][0]==1){return "west";}
		      if(others[i][0]-x==1){return "east";}
		      if(y-others[i][1]==1){return "north";}
		      if(others[i][1]-y==1){return "south";}
		    }
		    else{
		      dist=Math.sqrt(Math.pow(x-others[i][0],2)+Math.pow(y-others[i][1],2));
		      forceX+=(x-others[i][0])*others[i][2]/Math.pow(dist,3);
		      forceY+=(y-others[i][1])*others[i][2]/Math.pow(dist,3);
		    }
		  }
		  vX=velocity*Math.cos(direction)+10*forceX/Math.max(1,power);
		  vY=velocity*Math.sin(direction)+10*forceY/Math.max(1,power);
		  velocity=Math.sqrt(vX*vX+vY*vY);
		  if(velocity==0){return "none"}
		  retval="none";
		  if(Math.abs(vX)>Math.abs(vY)){
		    if(vX>0){
		      if(x<arenaSize-1){retval="east";}
		      else{vX=-vX;retval="west";}
		    }
		    else{
		      if(x>0){retval="west";}
		      else{vX=-vX;retval="east";}
		    }
		  }
		  else{
		    if(vY>0){
		      if(y<arenaSize-1){retval="south";}
		      else{vY=-vY;retval="north";}
		    }
		    else{
		      if(y>0){retval="north";}
		      else{vY=-vY;retval="south";}
		    }
		  }
		  direction=Math.atan2(-vY,vX);
		  botNotes.storeData("proton_velocity",[velocity,direction]);
		  return retval;
		} 
	},
{
	name: "Weighted Motion",
	color: "#735839",
	run:function (myself,others,coins){
	  x=myself.locationX;
	  y=myself.locationY;
	  power=myself.coins;
	  arenaSize=myself.arenaLength;
	  dirX=0;
	  dirY=0;
	  for(i=0;i<coins.length;i++){
	    if(i==0){
	      dirX+=5/(x-coins[i][0]);
	      dirY+=5/(y-coins[i][1]);
	    }
	    else{
	      dirX+=2/(x-coins[i][0]);
	      dirY+=2/(y-coins[i][1]);
	    }
	  }
	  for(i=0; i<others.length;i++){
	    dirX+=(power-others[i][2])/(2*(x-others[i][0]));
	    dirY+=(power-others[i][2])/(2*(y-others[i][1]));
	  }
	  if(Math.abs(dirX)>Math.abs(dirY)){
	    if(dirX>0){
	      if(x>0){return "west";}
	      else{
		if(dirY>0){if(y>0)return "north";}
		else if(dirY<0){if(y<arenaSize-1)return "south";}
	      }
	    }
	    else if(x<arenaSize-1){return "east";}
	    else{
	      if(dirY>0){if(y>0)return "north";}
	      else if(dirY<0){if(y<arenaSize-1)return "south";}
	    }
	  }
	  else{
	    if(dirY>0){
	      if(y>0){return "north";}
	      else{
		if(dirX>0){if(x>0)return "west";}
		else if(dirX<0){if(x<arenaSize-1)return "east";}
	      }
	    }
	    else if(y<arenaSize-1){return "south";}
	    else{
	      if(dirX>0){if(x>0)return "west";}
	      else if(dirX<0){if(x<arenaSize-1){return "east";}
	    }
	  }
	  return "none";
	} 
}
},
{
	name: "Blindly",
	color: "#ffaa00",
	run:function(myself, others, coins){
	    mx = myself.locationX
	    my = myself.locationY
	    l="west"
	    r="east"
	    u="north"
	    d="south"
	    n="none"

	    if(coins.length == 0)
		return n

	    var closestCoin = coins.sort(a=>Math.sqrt(Math.pow(mx-a[0],2) + Math.pow(my-a[1],2))).pop()
	    cx = closestCoin[0]
	    cy = closestCoin[1]

	    return mx>cx?l:mx<cx?r:my>cy?u:my<cy?d:n
	} 
},
{
	name: "Damacy",
	color: "#997a00",
	run: function (me, others, coin) {
	  let xdist = t => Math.abs(t[0] - me.locationX)
	  let ydist = t => Math.abs(t[1] - me.locationY)
	  function distanceCompare(a, b, aWt, bWt) {
	    aWt = aWt || 1
	    bWt = bWt || 1
	    return (xdist(a) + ydist(a)) / aWt - (xdist(b) + ydist(b)) / bWt
	  }
	  function hasThreat(loc) {
	    let threat = others.filter(b => b[0] == loc[0] && b[1] == loc[1] && b[2] >= me.coins)
	    return (threat.length > 0)
	  }
	  function inArena(loc) {  // probably unnecessary for this bot
	    return loc[0] >= 0 && loc[1] >= 0 && loc[0] < me.arenaLength && loc[1] < me.arenaLength
	  }
	  function sortedCoins() {
	    coinsWithValues = coin.map((coords, i) => coords.concat((i == 0) ? 5 : 2))
	    coinsWithValues.sort((a, b) => distanceCompare(a, b, a[2], b[2]))
	    return coinsWithValues.map(c => c.slice(0, 2))
	  }
	  othersPrev = botNotes.getData('kata_others_pos')
	  botNotes.storeData('kata_others_pos', others)
	  if (othersPrev) {

	    for(let i = 0; i < others.length; i++) {
	      let bot = others[i]

	      let matchingBots = othersPrev.filter(function (b) {
		let diff = Math.abs(b[0] - bot[0]) + Math.abs(b[1] - bot[1])
		if (diff >= 2)
		  return false // bot can't have jumped
		return [0, 2, 5].includes(bot[2] - b[2])
	      })

	      if (matchingBots.length > 0) {
		let botPrev = matchingBots.shift()
		// remove matched bot so it doesn't get matched again later
		othersPrev = othersPrev.filter(b => b[0] != botPrev[0] || b[1] != botPrev[1])
		bot[0] = Math.min(Math.max(bot[0] + bot[0] - botPrev[0], 0), me.arenaLength-1)
		bot[1] = Math.min(Math.max(bot[1] + bot[1] - botPrev[1], 0), me.arenaLength-1)
	      }
	    }
	  }

	  let eatables = others.filter(b => b[2] < me.coins && b[2] > 0)
	  let targets
	  if (eatables.length > 0) {
	    targets = eatables.sort(distanceCompare)
	  }
	  else {
	    targets = sortedCoins()
	  }

	  let done, newLoc, dir
	  while (!done && targets.length > 0) {
	    t = targets.shift()
	    if ((xdist(t) <= ydist(t) || ydist(t) == 0) && xdist(t) != 0) {
	      let xmove = Math.sign(t[0] - me.locationX)
	      dir = xmove < 0 ? 'west' : 'east'
	      newLoc = [me.locationX + xmove, me.locationY]
	      if (!hasThreat(newLoc) && inArena(newLoc))
		done = 1
	    }

	    if (!done) {
	      let ymove = Math.sign(t[1] - me.locationY)
	      dir = ['north', 'none', 'south'][ymove + 1]
	      newLoc = [me.locationX, me.locationY + ymove]
	      if (!hasThreat(newLoc) && inArena(newLoc))
		done = 1
	    }
	  }

	  if (!done)
	    dir = 'none'


	  return dir
	}
},
{
	name: "Katamari with Values",
	color: "#fff2bf",
	run: function (me, others, coin) {
	  let xdist = t => Math.abs(t[0] - me.locationX)
	  let ydist = t => Math.abs(t[1] - me.locationY)
	  function distanceCompare(a, b, aWt = 1, bWt = 1) {
	    return (xdist(a) + ydist(a)) / aWt - (xdist(b) + ydist(b)) / bWt
	  }
	  function hasThreat(loc) {
	    let threat = others.filter(b => b[0] == loc[0] && b[1] == loc[1] && b[2] >= me.coins)
	    return (threat.length > 0)
	  }
	  function inArena(loc) {  // probably unnecessary for this bot
	    return loc[0] >= 0 && loc[1] >= 0 && loc[0] < me.arenaLength && loc[1] < me.arenaLength
	  }
	  function sortedCoins() {
	    coinsWithValues = coin.map((coords, i) => coords.concat((i == 0) ? 5 : 2))
	    coinsWithValues.sort((a, b) => distanceCompare(a, b, a[2], b[2]))
	    return coinsWithValues.map(c => c.slice(0, 2))
	  }

	  let eatables = others.filter(b => b[2] < me.coins && b[2] > 0)
	  let targets
	  if (eatables.length > 0) {
	    targets = eatables.sort(distanceCompare)
	  }
	  else {
	    targets = sortedCoins()
	  }

	  let done, newLoc, dir
	  while (!done && targets.length > 0) {
	    t = targets.shift()
	    if ((xdist(t) <= ydist(t) || ydist(t) == 0) && xdist(t) != 0) {
	      let xmove = Math.sign(t[0] - me.locationX)
	      dir = xmove < 0 ? 'west' : 'east'
	      newLoc = [me.locationX + xmove, me.locationY]
	      if (!hasThreat(newLoc) && inArena(newLoc))
		done = 1
	    }

	    if (!done) {
	      let ymove = Math.sign(t[1] - me.locationY)
	      dir = ['north', 'none', 'south'][ymove + 1]
	      newLoc = [me.locationX, me.locationY + ymove]
	      if (!hasThreat(newLoc) && inArena(newLoc))
		done = 1
	    }
	  }

	  if (!done)
	    dir = 'none'

	  return dir
	}
},
{
	name: "Goldilocks",
	color: "#b2bf00",
	run: function (me, others, coins) {
	  let target = coins[0]; // Gold
	  let x = target[0] - me.locationX;
	  let y = target[1] - me.locationY;

	  mymove = 'none'
	  if (Math.abs(x) <= Math.abs(y) && x != 0)
	    mymove = x < 0 ? 'west' : 'east'
	  else if (y != 0)
	    mymove = y < 0 ? 'north' : 'south'

	  return mymove
	} 
},
{
	name: "BEELINE",
	color: "#8a8c69",
	run: function(me, others, coins) {
		// Do nothing if there aren't any coins
		if (coins.length == 0) return 'none';
		// Sort by distance using Pythagoras' Theorem
		let c = coins.sort((a, b) => (a[0] ** 2 + a[1] ** 2) - (b[0] ** 2 + b[1] ** 2));
		// Closest coin
		let target = c[0];
		let x = target[0];
		let y = target[1];

		// Util function for movement
		function move(pos, type) {
			let moveTypes = { X: ['east', 'west'], Y: ['south', 'north'] };
			if (pos > me['location'+type]) return moveTypes[type][0];
			else return moveTypes[type][1];
		}

		// Move the shortest distance first
		if (x < y && x != me.locationX) return move(x, 'X');
		else if (y != me.locationY) return move(y, 'Y');
	}
},
{
	name: "3rd Gen Algorithm",
	color: "#62731d",
	run: function run(me) {
		options = [];
		if (me.locationX > 0) options.push('west');
		if (me.locationY > 0) options.push('north');
		if (me.locationX < (me.arenaLength-1)) options.push('east');
		if (me.locationY < (me.arenaLength-1)) options.push('south');

		return options[Math.floor(Math.random() * options.length)];
	}
},
{
	name: "Drunkard",
	color: "#304010",
	run: function (me, others, coins) {
	  let directions = ['none','east','south','west','north']
	  let drunkennessCoefficient = .2
	  let nearSightedness = me.arenaLength - others.length + 2
	  //drawCircle(me.locationX, me.locationY, nearSightedness*squareSize)

	  function randomInt(a) {
	    return Math.floor(Math.random() * a);
	  }
	  function getRandomDirection() {
	    return ['east', 'west', 'north', 'south'][randomInt(4)]
	  }

	  function distanceTo(a) {
	    return (Math.abs(a[0] - me.locationX) + Math.abs(a[1] - me.locationY))
	  }
	  function distanceBetween(a, b){
	    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]))
	  }
	  function isTargetSafe(a) {
	    for (let i = 0; i < others.length; i++) {
	      if (others[i][2] >= me.coins && distanceBetween(a, others[i]) <= distanceTo(a)) {
		return false //unnecessary loop, but I don't want to split out into a function
	      }
	    }
	    return true
	  }
	  function amISafe() {
	    for (let i = 0; i < others.length; i++) {
	      if (others[i][2] >= me.coins && distanceTo(others[i]) == 1) {
		/*let num = botNotes.getData('turnsSpentAdjacentToEnemy')
		if (!num) {
		  console.log('politeNearSightedDrunkBot: Woops!')
		  botNotes.storeData('turnsSpentAdjacentToEnemy', 1)
		} else if (num == 1) {
		  console.log('politeNearSightedDrunkBot: \'Scuse me...')
		  botNotes.storeData('turnsSpentAdjacentToEnemy', 2)
		} else if (num == 2) {
		  console.log('politeNearSightedDrunkBot: D\'ye mind?')
		  botNotes.storeData('turnsSpentAdjacentToEnemy', 3)
		} else if (num == 3) {
		  console.log('politeNearSightedDrunkBot: Bugger off!')
		}*/
		return false
	      }
	    }
	    return true
	  }
	  function getSafeDirections() {
	    let candidates = {'none': true, 'east': true, 'south': true, 'west': true, 'north': true}
	    if (me.locationY == 0) {
	      candidates['north'] = false
	    } else if (me.locationY == me.arenaLength - 1) {
	      candidates['south'] = false
	    }
	    if (me.locationX == 0) {
	      candidates['west'] = false
	    } else if (me.locationX == me.arenaLength - 1) {
	      candidates['east'] = false
	    }
	    if (!amISafe()) {
	      candidates['none'] = false
	    }/* else {
	      botNotes.storeData('turnsSpentAdjacentToEnemy', 0)
	    }*/
	    if (candidates['north'] && !isTargetSafe([me.locationX, me.locationY-1])) {
	      candidates['north'] = false
	    }
	    if (candidates['south'] && !isTargetSafe([me.locationX, me.locationY+1])) {
	      candidates['south'] = false
	    }
	    if (candidates['west'] && !isTargetSafe([me.locationX-1, me.locationY])) {
	      candidates['west'] = false
	    }
	    if (candidates['east'] && !isTargetSafe([me.locationX+1, me.locationY])) {
	      candidates['east'] = false
	    }
	    if (candidates['none']) {
	    }
	    return candidates
	  }
	  function getSafeCoins() {
	    let safestCoins = []
	    let coinSizes = [5, 2, 2, 2, 2]
	    for (let i = 0; i < coins.length; i++) {
	      let distanceToThisCoin = distanceTo(coins[i])
	      if (distanceToThisCoin < nearSightedness && isTargetSafe(coins[i])) {
		safestCoins.push([coins[i][0], coins[i][1], coinSizes[i], distanceToThisCoin])
		//alert('Coin at (' + coins[i][0] + ', ' + coins[i][1] + ') is safe!')
	      }
	    }
	    if (safestCoins.length == 0) {
	      //alert('No safe coins!')
	    }
	    return safestCoins
	  }

	  function getAdditiveBestDirectionToTargets(targets) {
	    let candidates = {'east': 0, 'south': 0, 'west': 0, 'north': 0}
	    for (let i = 0; i < targets.length; i++) {
	      if (targets[i][0] < me.locationX) { 
		candidates['west'] = candidates['west'] + targets[i][2]/targets[i][3]
	      } else if (targets[i][0] > me.locationX) {
		candidates['east'] = candidates['east'] + targets[i][2]/targets[i][3]
	      }
	      if (targets[i][1] > me.locationY) { 
		candidates['south'] = candidates['south'] + targets[i][2]/targets[i][3]
	      } else if (targets[i][1] < me.locationY) {
		candidates['north'] = candidates['north'] + targets[i][2]/targets[i][3]
	      }
	    }
	    for (let key in candidates) {
	      //alert(key + ': ' + candidates[key])
	    }
	    return candidates
	  }

	    let targetCoins = getSafeCoins()
	    let safeDirections = getSafeDirections()
	    let chosenDir = null
	    if (targetCoins.length > 0) {
	      //alert('Coins found! Exactly ' + targetCoins.length)
	      let weightedDirections = getAdditiveBestDirectionToTargets(targetCoins)
	      let bestOptionWeight = 0
	      let choices = []
	      for (let key in safeDirections) {
		if (safeDirections[key] && key != 'none') {
		  if (weightedDirections[key] == bestOptionWeight) {
		    choices.push(key)
		  } else if (weightedDirections[key] > bestOptionWeight) {
		    choices = [key]
		    bestOptionWeight = weightedDirections[key]
		  }
		}
	      }
	      if (choices.length > 0) {
		//alert('Picking from choices, ' + choices.length + ' options and best weight is ' + bestOptionWeight)
		chosenDir = choices[randomInt(choices.length)]
	      } else {
		//alert('No safe choices!')
	      }
	    } else {
	      let lastDir = botNotes.getData('direction') || 'none'
	      if (safeDirections[lastDir] && Math.random() >= drunkennessCoefficient) {
		chosenDir = lastDir
	      }
	    }

	    if (!chosenDir) {
	      //alert('indecisive!')
	      let choices = []
	      for (key in safeDirections) {
		if (safeDirections[key]) {
		  choices.push(key)
		}
	      }
	      if (choices.length > 0) {
		chosenDir = choices[randomInt(choices.length)]
	      } else {
		chosenDir = getRandomDirection()
	      }
	    }

	    botNotes.storeData('direction', chosenDir)
	    //alert('Moving ' + chosenDir)
	    return chosenDir
	}
},
{
	name: "Big King Little Hill",
	color: "#364030",
	run: function (me, enemies, coins) {

		
		// Is a move safe to execute?
		function isItSafe(x){
				let loc = [x[0] + me.locationX,x[1] + me.locationY];
				return loc[0] >= 0 && loc[0] < me.arenaLength
				&& loc[1] >= 0 && loc[1] < me.arenaLength
				&& enemies
						.filter(enemy => me.coins <= enemy[2])
						.filter(enemy => getDist(enemy,loc) == 1).length === 0;
		}

		
		// Dumb conversion of relative coord to direction string
		function coordToString(coord){
			if (coord[0] == 0 && coord[1] == 0) return 'none';
			if (Math.abs(coord[0]) > Math.abs(coord[1]))
				return coord[0] < 0 ? 'west' : 'east';
			return coord[1] < 0 ? 'north' : 'south';
		}
		
		
		// Calculate a square's zone of control
		function getZOC(x) {
			let n = 0;
			for(let i = 0; i < me.arenaLength;i++){
				for(let j = 0; j < me.arenaLength;j++){
					if (doesAControlB(x, [i,j])) n++;
				}
			}
			return n;
		}
		
		function doesAControlB(a, b) {
			return getEnemyDist(b) > getDist(a, b);
		}
	  
		// Distance to nearest enemy
		function getEnemyDist(x) {
			return enemies.map(enemy => getWeightedDist(enemy, x)).reduce((accumulator, current) => Math.min(accumulator, current));
		}
	  
		// Weights distance by whether enemy is weaker or stronger
		function getWeightedDist(enemy, pos) {
			return getDist(enemy, pos) + (enemy[2] < me.coins ? 1 : 0);
		}
	  
		function getDist(a, b){
			return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]))
		}
		
		//check whether there are coins in our Zone of Control, if yes move towards the closest one
		let loc = [me.locationX,me.locationY];
		let sortedCoins = coins.sort((a,b) => getDist(loc,a) - getDist(loc,b));
		for (let coin of sortedCoins) {
			if (doesAControlB(loc,coin)){
				return coordToString([coin[0] - loc[0],coin[1] - loc[1]]);
			}
		}
		
		//sort moves by how they increase our Zone of Control
		northZOC = [[0,-1], getZOC([loc[0],loc[1]-1])];
		southZOC = [[0,1], getZOC([loc[0],loc[1]+1])];
		westZOC = [[-1,0], getZOC([loc[0]-1,loc[1]])];
		eastZOC = [[1,0], getZOC([loc[0]+1,loc[1]])];
		noneZOC = [[0,0], getZOC([loc[0],loc[1]])];
		let moves = [northZOC,southZOC,westZOC,eastZOC,noneZOC].sort((a,b) => b[1] - a[1]);
		
		//check whether these moves are safe and make the highest priority safe move
		for (let move of moves) {
			if (isItSafe(move[0])) { 
				return coordToString(move[0]);
			}
		}
		return coordToString(moves[0][0])
	}
},
{
        name: "TBTsefoijawwhatever",
	color: "#f24100",
	run: function (me, monsters, coins) {
	    var getDistance = function (x1, y1, x2, y2) {
		return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) + 1;
	    };

	    var getScore = function (x, y) {
		var score = 0, i, chaseFactor = 0.75, coinFactor = 1, phaseSize = Math.round((me.arenaLength - 4) / 4), monstersCount = monsters.length, center = (me.arenaLength - 1) / 2;

		if (monstersCount < phaseSize) {
		    chaseFactor = 0;
		    coinFactor = 0.25;
		} else if (monstersCount < phaseSize * 2) {
		    chaseFactor = 0.5;
		    coinFactor = 0.5;
		} else if (monstersCount < phaseSize * 3) {
		    coinFactor = 0.75;
		}

		for (i = 0; i < monstersCount; i++) {
		    var monsterCoins = monsters[i][2], monsterDistance = getDistance(x, y, monsters[i][0], monsters[i][1]);

		    if (me.coins > monsterCoins && monsterDistance <= 3) {
			score += (Math.min(5, monsterCoins) * chaseFactor) / monsterDistance;
		    } else if (me.coins <= monsterCoins && monsterDistance <= 3) {
			score -= (monsterDistance === 3 ? 50 : 2000);
		    }
		}

		for (i = 0; i < coins.length; i++) {
		    var coinDistance = getDistance(x, y, coins[i][0], coins[i][1]),
			coinDistanceCenter = getDistance(center, center, coins[i][0], coins[i][1]),
			coinValue = (i === 0 ? 200 : 100),
			coinCloserMonsters = 0;

		    for (var j = 0; j < monstersCount; j++) {
			var coinMonsterDistance = getDistance(monsters[j][0], monsters[j][1], coins[i][0], coins[i][1]);
			monsterCoins = monsters[j][2];

			if (
			    (coinMonsterDistance < coinDistance && monsterCoins >= me.coins / 2) ||
			    (coinMonsterDistance <= coinDistance && monsterCoins >= me.coins)
			) {
			    coinCloserMonsters++;
			}
		    }

		    var coinMonsterFactor = (100 - ((100 / monstersCount) * coinCloserMonsters)) / 100;
		    if (coinMonsterFactor < 1) coinMonsterFactor *= coinFactor;
		    score += ((coinValue * coinMonsterFactor) / coinDistance) - (50 / coinDistanceCenter);
		}

		return score;
	    };

	    var possibleMoves = [{x: 0, y: 0, c: 'none'}];
	    if (me.locationX > 0) possibleMoves.push({x: -1, y: 0, c: 'west'});
	    if (me.locationY > 0) possibleMoves.push({x: -0, y: -1, c: 'north'});
	    if (me.locationX < me.arenaLength - 1) possibleMoves.push({x: 1, y: 0, c: 'east'});
	    if (me.locationY < me.arenaLength - 1) possibleMoves.push({x: 0, y: 1, c: 'south'});

	    var topCommand, topScore = null;
	    for (var i = 0; i < possibleMoves.length; i++) {
		var score = getScore(me.locationX + possibleMoves[i].x, me.locationY + possibleMoves[i].y);
		if (topScore === null || score > topScore) {
		    topScore = score;
		    topCommand = possibleMoves[i].c;
		}
	    }

	    return topCommand;
	}
    },
{
	name: "Livin' on the Edge",
	color: "#364030",
	run:function (myself, others, coins) {
	  x = myself.locationX;
	  y = myself.locationY;
	  xymax = myself.arenaLength - 1;
	  if (x < xymax && y == 0) {
	      return 'east';
	    } else if (y < xymax && x == xymax) {
	      return 'south';
	    } else if (x > 0 && y == xymax) {
	      return 'west';
	  } else {
	    return 'north';
	  }
	} 
},
{
	name: "Not so Blindly",
	color: "3ad900",
	run: function AI(me, others, coins){
	    var h = (a,b) => Math.abs(a[0] -b[0]) + Math.abs(a[1] -b[1])
	    var s = JSON.stringify;
	    var p = JSON.parse;
	    var walls = others.slice(0,2).map(s);
	    var start = [me.locationX, me.locationY];
	    var goal = coins.pop();
	    var is_closed = {};
	    is_closed[s(start)] = 0;
	    var open = [s(start)];
	    var came_from = {};
	    var gs = {};
	    gs[s(start)] = 0;
	    var fs = {};
	    fs[s(start)] = h(start, goal);
	    var cur;
	    while (open.length) {
		var best;
		var bestf = Infinity;
		for (var i = 0; i < open.length; ++i) {
		    if (fs[open[i]] < bestf) {
			bestf = fs[open[i]];
			best = i;
		    }
		}
		cur = p(open.splice(best, 1)[0]);
		is_closed[s(cur)] = 1;
		if (s(cur) == s(goal)) break;
		for (var d of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
		    var next = [cur[0] + d[0], cur[1] + d[1]];
		    if (next[0] < 0 || next[0] >= me.arenaLength ||
			next[1] < 0 || next[1] >= me.arenaLength) {
			continue;
		    }
		    if (is_closed[s(next)]) continue;
		    if (open.indexOf(s(next)) == -1) open.push(s(next));
		    var is_wall = walls.indexOf(s(next)) > -1;
		    var g = gs[s(cur)] + 1 + 10000 * is_wall;
		    if (gs[s(next)] != undefined && g > gs[s(next)]) continue;
		    came_from[s(next)] = cur;
		    gs[s(next)] = g;
		    fs[s(next)] = g + h(next, goal);
		}
	    }
	    var path = [cur];
	    while (came_from[s(cur)] != undefined) {
		cur = came_from[s(cur)];
		path.push(cur);
	    }
	    var c = path[path.length - 1];
	    var n = path[path.length - 2];
	    if(n){
		if (n[0] < c[0]) {
		    return "west";
		} else if (n[0] > c[0]) {
		    return "east";
		} else if (n[1] < c[1]) {
		    return "north";
		} else {
		    return "south";
		}
	    }else{
		return "none";
	    }
	}
},
{
	name: "Wild Goose Chase",
	color: "#b6f2be",
	run: function (me, others, coins){
	    x = me.locationX;
	    y = me.locationY;

	    dirs = {};
	    dirs[(x+1)+" "+y] = "east";
	    dirs[(x-1)+" "+y] = "west";
	    dirs[x+" "+(y+1)] = "south";
	    dirs[x+" "+(y-1)] = "north";

	    mov = {};
	    mov["east"] = [x+1,y];
	    mov["west"] = [x-1,y];
	    mov["north"] = [x,y-1];
	    mov["south"] = [x,y+1]; 

	    possibleDirs = ["east","west","north","south"];

	    for (i = 0; i < others.length; i++){
		if (others[i][0]+" "+others[i][1] in dirs){
		    possibleDirs.splice(possibleDirs.indexOf(dirs[others[i][0]+" "+others[i][1]]),1);
		}
	    }

	    if (possibleDirs.length == 4 || Math.floor(Math.random() * 500) == 0){
		return "none"
	    }

	    for (i = 0; i < possibleDirs.length; i++){
		if (mov[possibleDirs[i]][0] == me.arenaLength || mov[possibleDirs[i]][0] < 0 
		|| mov[possibleDirs[i]][1] == me.arenaLength || mov[possibleDirs[i]][1] < 0){
		    var index = possibleDirs.indexOf(possibleDirs[i]);
		    if (index != -1) {
			possibleDirs.splice(index, 1);
			i--;
		    }
		}
	    }

	    if (possibleDirs.length == 0){
		 return "none";
	    }

	    return possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
	} 
},
{
	name: "Coin Magnet",
	color: "#238c4d",
	run:function (myself,others,coins){
	  x=myself.locationX;
	  y=myself.locationY;
	  power=myself.coins;
	  arenaSize=myself.arenaLength;
	  dirX=0;
	  dirY=0;
	  for(i=0;i<coins.length;i++){
	    if(i==0){
	      dirX+=(coins[i][0]-x)*3
	      dirY+=(coins[i][1]-y)*3
	    }
	    dirX+=(coins[i][0]-x)*2
	    dirY+=(coins[i][1]-y)*2
	  }
	  for(i=0;i<others.length;i++){
	    dirX+=Math.ceil(0.85*others[i][2])*(others[i][0]-x)
	    dirX+=Math.ceil(0.85*others[i][2])*(others[i][1]-y)
	  }
	  if(Math.abs(dirX)>Math.abs(dirY)){
	    if(dirX>0){return "east";}
	    else{return "west";}
	  }
	  else if(dirY!=0){
	    if(dirY>0){return "south";}
	    else{return "north";}
	  }
	  return "none";
	} 
},
{
	name: "ICE Agent",
	color: "#40ffbf",
	run: function(me, others, coins) {
	    me.arenaLength = me.arenaLength - 1;
	    // Calculate the average coin value of bots
	    var avg = 2;

	    for (var i = 0; i < others.length; i++) {
		avg += others[i][2];
	    }

	    avg /= others.length;

	    // Find nearest coins
	    var min = [];
	    var min_distance = 100000
	    for (var j = 0; j < coins.length; j++) {
		var distance = Math.sqrt(Math.pow(me.locationX - coins[j][0],2) + Math.pow(me.locationY - coins[j][1],2));
		if (distance < min_distance) {
		    min_distance = distance;
		    min = coins[j];
		}
	    }

	    if (me.coins <= avg || min_distance < 5) {
		// If own coinage is lower than the average or a coin is very close, find some coins

		// Move straight to the nearest coin
		if (me.locationY != min[1]) {
		    if (me.locationY - min[1] > 0) {
			return "north";
		    } else {
			return "south";
		    }
		} else {
		    if (me.locationX - min[0] > 0) {
			return "west";
		    } else {
			return "east";
		    }
		}
	    } else {
		// You have enough money to eat most bots
		// Check if already on border
		if (me.locationX == 0 || me.locationX == me.arenaLength || me.locationY == 0 || me.locationY == me.arenaLength) {
		    // Move anticlockwise around the border
		    if (me.locationX == 0 && me.locationY != 0 && me.locationY != me.arenaLength) {
			return "south";
		    }
		    if (me.locationX == 0 && me.locationY == 0) {
			return "south";
		    }

		    if (me.locationY == me.arenaLength && me.locationX != 0 && me.locationX != me.arenaLength) {
			return "east";
		    }
		    if (me.locationX == 0 && me.locationY == me.arenaLength) {
			return "east";
		    }

		    if (me.locationX == me.arenaLength && me.locationY != 0 && me.locationY != me.arenaLength) {
			return "north";
		    }
		    if (me.locationX == me.arenaLength && me.locationY == me.arenaLength) {
			return "north";
		    }

		    if (me.locationY == 0 && me.locationX != 0 && me.locationX != me.arenaLength) {
			return "west";
		    }
		    if (me.locationX == me.arenaLength && me.locationY == 0) {
			return "west";
		    }
		} else {
		    // Find the nearest border and move to it
		    if (me.locationX <= me.arenaLength - me.locationX) {
			// Move to left border
			return "west";
		    } else {
			// Move to right border
			return "east";
		    }
		}
	    }
	}
},
{
	name: "Seeker.Armageddon",
	color: "#004d3d",
	run:function(me, others, coins) {
	    var x = me.locationX;
	    var y = me.locationY;
	    var dirs = [];
	    for (var i = 0; i < others.length; i++) {
		if (Math.abs(others[i][0] - x) <= 3 && Math.abs(others[i][0] - y) <= 3) {
		    if (others[i][3] < me.coins && others[i][3] * 0.85 > 5) {
			if (Math.abs(others[i][0] - x) > Math.abs(others[i][1] - y)) {
			    if (others[i][0] - x < 0) {
				dirs.push('west');
			    } else {
				dirs.push('east');
			    }
			} else if (Math.abs(others[i][0] - x) < Math.abs(others[i][1] - y)) {
			    if (others[i][1] - y < 0) {
				dirs.push('north');
			    } else {
				dirs.push('south');
			    }
			} else {
			    if (Math.random() < 0.5) {
				if (others[i][0] - x < 0) {
				    dirs.push('west');
				} else {
				    dirs.push('east');
				}
			    } else {
				if (others[i][1] - y < 0) {
				    dirs.push('north');
				} else {
				    dirs.push('south');
				}
			    }
			}
		    } else if (others[i][3] >= me.coins) {
			if (Math.abs(others[i][0] - x) < Math.abs(others[i][1] - y)) {
			    if (others[i][0] - x < 0) {
				dirs.push('east');
			    } else {
				dirs.push('west');
			    }
			} else if (Math.abs(others[i][0] - x) > Math.abs(others[i][1] - y)) {
			    if (others[i][1] - y < 0) {
				dirs.push('south');
			    } else {
				dirs.push('north');
			    }
			} else {
			    if (Math.random() < 0.5) {
				if (others[i][0] - x < 0) {
				    dirs.push('east');
				} else {
				    dirs.push('west');
				}
			    } else {
				if (others[i][1] - y < 0) {
				    dirs.push('south');
				} else {
				    dirs.push('north');
				}
			    }
			}
		    }
		}
	    }
	    for (i = 1; i < 5; i++) {
		if (Math.abs(coins[i][0] - x) <= 5 && Math.abs(coins[i][1] - y) <= 5) {
		    if (Math.abs(coins[i][0] - x) > Math.abs(coins[i][1] - y)) {
			if (coins[i][0] - x < 0) {
			    dirs.push('west');
			} else {
			    dirs.push('east');
			}
		    } else if (Math.abs(coins[i][0] - x) < Math.abs(coins[i][1] - y)) {
			if (coins[i][1] - y < 0) {
			    dirs.push('north');
			} else {
			    dirs.push('south');
			}
		    } else {
			if (Math.random() < 0.5) {
			    if (coins[i][0] - x < 0) {
				dirs.push('west');
			    } else {
				dirs.push('east');
			    }
			} else {
			    if (coins[i][1] - y < 0) {
				dirs.push('north');
			    } else {
				dirs.push('south');
			    }
			}
		    }
		}
	    }
	    var fin = [];
	    for (i = 0; i < dirs.length; i++) {
		if (dirs[i] == 'north' && y !== 0 && fin.indexOf('north') == -1) {
		    fin.push('north');
		} else if (dirs[i] == 'east' && x != me.arenaLength - 1 && fin.indexOf('east') == -1) {
		    fin.push('east');
		} else if (dirs[i] == 'west' && x !== 0 && fin.indexOf('west') == -1) {
		    fin.push('west');
		} else if (dirs[i] == 'south' && y != me.arenaLength && fin.indexOf('south') == -1) {
		    fin.push('south');
		}
	    }
	    if (fin.length > 1) {
		return fin[randInt(0, fin.length - 1)];
	    } else if (fin.length == 1) {
		return fin[0];
	    } else {
		return 'none';
	    }
	} 
}
];
var coinLocations = [];
var botCount = botData.length;
var arenaSize = botCount + 4;
var botPos = [];
var botNotes = {
    storeData: function(key, value) {
        var bot = botData[botNotes.storeData.caller.index];
        bot.kvpData[key] = value;
    },
    getData: function(key) {
        var bot = botData[botNotes.getData.caller.index];
        return bot.kvpData[key] || null;
    }
};

function randInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function botSetup() {
	var n, close;
    for (var b, r, i = 0; i < botCount; i++) {
        b = botData[i];
        b.coins = 0;
        b.loc = [];
        b.kvpData = {};
        b.alive = true;
        b.run.index = i;
        r = getValidPosition();
        b.loc = r;
        botPos[i] = r;
    }
    for (i = 0; i < 5; i++) {
        r = getValidPosition();
        coinLocations[i] = r;
    }
}

function runBots() {
	var ind, s, l, n, c, coins, botSet = [];
    var botsAlive = botPos.filter(function(a){return !(arrayEqual(a, [-2,-2]))});
    botsAlive.forEach(function(arr){
        for (n = 0; n < botCount; n++) {
            if (botPos[n] == arr) {
                coins = botData[n].coins;
            }
        }
        botSet.push([arr[0], arr[1], coins]);
    });
    for (var m, b, i = 0; i < botCount; i++) {
        b = botData[i];
        if (b.alive) {
            m = b.run({locationX: b.loc[0], locationY: b.loc[1], coins: b.coins, arenaLength: arenaSize}, JSON.parse(JSON.stringify(botSet.filter((a)=>(a[0]!=b.loc[0] || a[1]!=b.loc[1])))), JSON.parse(JSON.stringify(coinLocations)));
            if (m === "north") {
                b.loc[1] -= 1;
            } else if (m === "east") {
                b.loc[0] += 1;
            } else if (m === "south") {
                b.loc[1] += 1;
            } else if (m === "west") {
                b.loc[0] -= 1;
            } else {
                //Bot was lazy/indecisive/made a typo
            }
        }
    }
    var pos = [];
    var pbot = [];
    var col = [];
    var dat = [];
    for (i = 0; i < botCount; i++) {
        b = botData[i];
        if (b.alive) {
            if (arrayIndex(pos, b.loc) != -1) { //if two bots in same space
                if (arrayIndex(col, b.loc) != -1) { //if three+ bots in same space
                    for (n = 0; n < dat.length; n++) {
                        l = dat[n];
                        if (l.loc == b.loc) {
                            l.count += 1;
                            l.indexes.push(n);
                        }
                    }
                } else {
                    col.push(b.loc);
                    dat.push({loc:b.loc,count:1,indexes:[i,pbot[arrayIndex(pos, b.loc)]]});
                }
            } else {
                pos.push(b.loc);
                pbot.push(i);
            }
        }
    }
    for (i = 0; i < dat.length; i++) {
        l = dat[i];
        s = l.indexes;
        s.sort((a,b)=>(botData[b].coins - botData[a].coins));
        c = botData[s[0]];
        if (c.coins == botData[s[1]].coins) {
	    let eatenBots = [];
            for (n = 0; n < s.length; n++) {
                b = botData[s[n]];
		eatenBots.push(b.name);
                b.alive = false;
		b.mutual = b.mutual ? b.mutual+1 : 1;
            }
	    postEvent("Mutual eating of bots: " + eatenBots.join(", ") + ".", "Eating");
        } else {
	    let eatenBots = [];
	    let eatenCoins = 0;
            for (n = 1; n < s.length; n++) {
                b = botData[s[n]];
                c.coins += Math.ceil(b.coins * 0.85);
		eatenCoins += Math.ceil(b.coins * 0.85);
                b.alive = false;
		c.ate = c.ate ? c.ate+1 : 1;
		c.ateCoins = c.ateCoins ? c.ateCoins + Math.ceil(b.coins * 0.85) : Math.ceil(b.coins * 0.85);
		b.eaten = b.eaten ? b.eaten+1 : 1;
		eatenBots.push(b.name);
            }
	    if(eatenBots.length)
		    postEvent(c.name + " has eaten " + eatenBots.join(", ") + " for " + eatenCoins + " coins.", "Eating");
            while (arrayIndex(coinLocations, c.loc) !== -1) {
                ind = arrayIndex(coinLocations, c.loc);
                if (ind === 0) {
                    c.coins += 5;
		    postEvent(c.name + " picked up a gold coin.", "Gold");
                } else {
                    c.coins += 2;
		    postEvent(c.name + " picked up a silver coin.", "Silver");
                }
                coinMove(ind);
            }
        }
    }
    for (i = 0; i < botCount; i++) {
        b = botData[i];
        while (b.alive && arrayIndex(coinLocations, b.loc) !== -1) {
            ind = arrayIndex(coinLocations, b.loc);
            if (ind === 0) {
                b.coins += 5;
	        postEvent(b.name + " picked up a gold coin.", "Gold");
            } else {
                b.coins += 2;
		postEvent(b.name + " picked up a silver coin.", "Silver");
            }
            coinMove(ind);
        }
        botPos[i] = b.loc;
        if (!(b.alive)) {
            botPos[i] = [-2,-2];
        }
        if (b.loc[0] < 0 || b.loc[1] < 0 || b.loc[0] >= arenaSize || b.loc[1] >= arenaSize) {
	    if(b.alive)
	    {
		    b.flights = b.flights ? b.flights+1 : 1;
		    postEvent(b.name + " has fled shamefully.", "Flight");
	    }
            b.alive = false;
            botPos[i] = [-2,-2];
        }
    }
}

function coinMove(ind) {
    var r, x, y, n, close;
    do {
        r = [randInt(0, arenaSize - 1), randInt(0, arenaSize - 1)];
        for (n = 0; n < botPos.length; n++) {
            x = botPos[n][0];
            y = botPos[n][1];
            if (Math.abs(x - r[0]) <= 1 && Math.abs(y - r[1]) <= 1) {
                close = true;
            } else {
                close = false;
            }
        }
    } while (close);
    coinLocations[ind] = r;
}

function arrayIndex(arr, inc) {
    for (var i = 0; i < arr.length; i++) {
        if (inc instanceof Array) {
            if (arr[i] instanceof Array && arr[i].length == inc.length) {
                for (var c = 0, n = 0; n < inc.length; n++) {
                    if (arr[i][n] === inc[n]) {
                        c++;
                    }
                }
                if (c == inc.length) {
                    return i;
                }
            }
        } else if (arr[i] === inc) {
            return i;
        }
    }
    return -1;
}

function arrayEqual(arr, equ) {
    if (arr.length !== equ.length) {
        return false;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== equ[i]) {
            return false;
        }
    }
    return true;
}

//Positioning Program, made by N.P. and tested by Sundar
function getValidPosition() {
  let pos = 0;
  while (pos === 0) {
    let x = randInt(0, arenaSize-1);
    let y = randInt(0, arenaSize-1);
    let allowed = true;
    for (let i = 0; i < botPos.length; i++) {
      let thisX = botPos[i][0];
      let thisY = botPos[i][1];
      if (Math.abs(thisX-x) <= 1 && Math.abs(thisY-y) <= 1) {
       allowed = false;
      }
    }
    if (allowed) {
       pos = [x, y];
    }
  }
  return pos;
}

//Different Auto-run function, created by Ramillies, based on:
//Auto-run function, created by RedwolfPrograms

function initCanvas()
{
	botSetup();
	createLeaderboard();
	updateCanvas();
	updateLeaderboard();
	turnCanvas.turns = document.getElementById("rounds").value;
	turnCanvas.fps = document.getElementById("fps").value;

	postEvent("Game initialized (" + turnCanvas.turns + " rounds @ " + turnCanvas.fps + " fps).", "MainGame");
	document.getElementById("rounds").disabled = true;
	document.getElementById("startButton").disabled = false;
	document.getElementById("stepButton").disabled = false;
	document.getElementById("initButton").disabled = true;
}

function activateCanvas() {
	let fps = document.getElementById("fps").value;
	turnCanvas.clear = setInterval(runMoves, 1000 / fps);
}

function startGame()
{
	activateCanvas();
	document.getElementById("startButton").disabled = true;
	document.getElementById("fps").disabled = true;
	document.getElementById("stepButton").disabled = true;
	document.getElementById("pauseButton").disabled = false;
}

function runMoves()
{
	if (turnCanvas.inc >= turnCanvas.turns) {
		if(turnCanvas.clear)
			clearInterval(turnCanvas.clear);
		evaluateGame();
	}
	else
	{
		turnCanvas.inc++;
		runBots();
		if((document.getElementById("fps").value < 100) || (!(turnCanvas.inc % Math.floor(document.getElementById("fps").value/50))))
		{
			updateCanvas();
			updateLeaderboard();
		}
	}
}

function pauseGame()
{
	if(turnCanvas.clear)
		clearInterval(turnCanvas.clear);
	document.getElementById("startButton").disabled = false;
	document.getElementById("stepButton").disabled = false;
	document.getElementById("pauseButton").disabled = true;
	document.getElementById("fps").disabled = false;
}

function resumeGame()
{
	let fps = document.getElementById("fps").value;
	if(turnCanvas.clear === null)
		setInterval(runMoves, 1000 / fps);
}

function evaluateGame()
{
	let living = botData.filter(b => b.alive);
	document.getElementById("Title").innerHTML = "Display";
	if(living.length == 0)
	{
		postEvent("Game drawn.", "MainGame");
		return;
	}
	living.sort((a, b) => b.coins - a.coins);
	postEvent("Game won by " + living[0].name + " (" + living[0].coins + " coins).", "MainGame");

	if(tournament)
	{
		if((living.length == 1) || (living[0].coins > living[1].coins))
			living[0].wins = living[0].wins ? living[0].wins+1 : 1;
		if(turnCanvas.games > 1)
		{
			turnCanvas.turns = document.getElementById("rounds").value;
			turnCanvas.fps = document.getElementById("fps").value;
			turnCanvas.games = document.getElementById("games").value -1;
			turnCanvas.inc = 0;
			resetEverything();
			document.getElementById("rounds").value = turnCanvas.turns;
			document.getElementById("fps").value = turnCanvas.fps;
			document.getElementById("games").value = turnCanvas.games;
			initCanvas();
			startGame();
		}
		else
		{
			resetEverything();
			initCanvas();
		}
	}
}

function startTournament()
{
	if(!document.getElementById("games").value)
	{
		alert("Please specify a number of games for the tournament.");
		return;
	}

	tournament = true;
	turnCanvas.turns = document.getElementById("rounds").value;
	turnCanvas.fps = document.getElementById("fps").value;
	turnCanvas.games = document.getElementById("games").value;
	initCanvas();
	startGame();
	document.getElementById("games").disabled = true;
}

//Append HTML and CSS for display

//Display program by N. P., who is awesome beyond belief
// Despaghettized by most illustrious Ramillies, who also added a ranking system and an event log :--)

var squareSize = 16 
var canvas, context;
var turnCanvas = {turns: 0, inc: 0, games: 0, clear: null};

function resetEverything()
{
	document.body.innerHTML = "<h1 id='Title'>Display</h1>"+
			"<div style='float: left'> <canvas id='Canvas'></canvas>"+
			"<p>Rounds: <input id=rounds value=200 size=5> FPS: <input id=fps value=5 size=5> Games: <input id=games value='' size=5></p>"+
			"<p><input type='button' id=initButton value='Init' onclick='initCanvas()'> <input type=button id=startButton disabled value='Start' onclick='startGame()'> <input type='button' id=pauseButton disabled value='Pause' onclick='pauseGame()'> <input type=button id=stepButton disabled value=Step onclick='runMoves()'> <input type=button value=Tournament id=tournament onclick='startTournament()'></p></div>"+
			"<div style='float: left'> <table id='leaderboard'>"+
				"<tr><th>C<th>Name<th>Rank<th>Ate*<th>ME†<th>Eaten<th>Fled<th>Score<th>Wins"+
			"</table><p>*: Number of bots eaten by the bot (and coins earned from that).<br>†: Number of mutual eatings in which the bot participated.</p></div>"+
		"<div style='clear: both'>"+
			"<h1 id='EventLogCaption'>Event Log</h1>"+
			"<textarea id='EventLog' rows=10 cols=80></textarea>"+
			"<p>Annoy me with these events:</p>"+
			"<input type='checkbox' id='AddGold'><label for='AddGold'>Gold pickups</label><input type='checkbox' id='AddSilver'><label for='AddSilver'>Silver pickups</label><input type='checkbox' checked id='AddEating'><label for='AddEating'>Bot(s) being eaten</label><input type='checkbox' checked id='AddFlights'><label for='AddFlights'>Bot(s) leaving arena</label>"+
		"</div>";
	canvas = document.getElementById("Canvas");
	canvas.width = arenaSize*squareSize 
	canvas.height = arenaSize*squareSize 
	context = canvas.getContext('2d'); 
}

function drawCircle(x, y, color) { 
	var trueX = x * squareSize + squareSize/2 
	var trueY = y * squareSize + squareSize/2 
	var radius = squareSize/8*3 
	context.beginPath(); 
	context.arc(trueX, trueY, radius, 0, 2 * Math.PI, false); 
	context.fillStyle = color; 
	context.fill(); 
	context.lineWidth = '1'; 
	context.strokeStyle = '#000000'; 
	context.stroke(); 
} 

function drawBot(x, y, color) { 
	var lowX = x * squareSize 
	var lowY = y * squareSize 
	context.lineWidth = 1 
	context.strokeStyle = '#000000'; 
	context.rect(lowX+.5, lowY+.5, squareSize-1, squareSize-1); 
	context.stroke() 
	context.fillStyle = color; 
	context.fillRect(lowX+1, lowY+1, squareSize-2, squareSize-2); 
} 

function updateCanvas() { 
	context.clearRect(0, 0, canvas.width, canvas.height) 
	for (var i = 0; i < arenaSize; i++)
	{
		context.moveTo(i * squareSize, 0);
		context.lineTo(i * squareSize, arenaSize * squareSize);
		context.moveTo(0, i * squareSize);
		context.lineTo(arenaSize * squareSize, i * squareSize);
	}
	context.strokeStyle = '#dddddd';
	context.stroke();
	for (var i = 1; i < coinLocations.length; i++)
		drawCircle(coinLocations[i][0], coinLocations[i][1], '#b4b4b4') 
	drawCircle(coinLocations[0][0], coinLocations[0][1], '#ffd700') 
	for (var i = 0; i < botPos.length; i++)
		if (botPos[i][0] > -2)
			drawBot(botPos[i][0], botPos[i][1], botData[i].color ? botData[i].color : '#ff0000') 
} 

function createLeaderboard() { 
	var table = document.getElementById('leaderboard') 
	for (var i = 0; i < botData.length; i++) { 
		var newRow = document.createElement('tr') 
		var newColor = document.createElement('td') 
		var newName = document.createElement('td') 
		var newPlace = document.createElement('td') 
		var newAte = document.createElement('td') 
		var newEaten = document.createElement('td') 
		var newMutual = document.createElement('td') 
		var newFlights = document.createElement('td') 
		var newScore = document.createElement('td') 
		var newWins = document.createElement('td') 
		newRow.id = botData[i].name + 'Row' 
		newColor.id = botData[i].name + 'Color' 
		newName.id = botData[i].name + 'Name' 
		newPlace.id = botData[i].name + 'Place' 
		newAte.id = botData[i].name + 'Ate' 
		newEaten.id = botData[i].name + 'Eaten' 
		newMutual.id = botData[i].name + 'Mutual' 
		newFlights.id = botData[i].name + 'Flights' 
		newScore.id = botData[i].name + 'Score' 
		newWins.id = botData[i].name + 'Wins' 
		newName.innerHTML = botData[i]['name'] 
		newRow.appendChild(newColor) 
		newRow.appendChild(newName) 
		newRow.appendChild(newPlace) 
		newRow.appendChild(newAte) 
		newRow.appendChild(newMutual) 
		newRow.appendChild(newEaten) 
		newRow.appendChild(newFlights) 
		newRow.appendChild(newScore) 
		newRow.appendChild(newWins) 
		table.appendChild(newRow) 
	} 
} 

function updateLeaderboard() { 
	let rankIndices = [];
	for(let i = 0; i < botData.length; i++)
		if(botData[i].alive)
			rankIndices.push(i);
	rankIndices.sort((a, b) => botData[b].coins - botData[a].coins);

	for (var i = 0; i < botData.length; i++)
	{ 
		var colorDisplay = document.getElementById(botData[i].name + 'Color') 
		var nameDisplay = document.getElementById(botData[i].name + 'Name') 
		var rankDisplay = document.getElementById(botData[i].name + 'Place')
		var ateDisplay = document.getElementById(botData[i].name + 'Ate') 
		var eatenDisplay = document.getElementById(botData[i].name + 'Eaten') 
		var mutualDisplay = document.getElementById(botData[i].name + 'Mutual') 
		var flightsDisplay = document.getElementById(botData[i].name + 'Flights') 
		var scoreDisplay = document.getElementById(botData[i].name + 'Score') 
		var winsDisplay = document.getElementById(botData[i].name + 'Wins');

		if (!botData[i]['alive'])
		{ 
			rankDisplay.innerHTML = ''
			nameDisplay.style.color = 'grey' 
			scoreDisplay.style.color = 'grey' 
			ateDisplay.style.color = 'grey';
			eatenDisplay.style.color = 'grey';
			mutualDisplay.style.color = 'grey';
			flightsDisplay.style.color = 'grey';
			winsDisplay.style.color = 'grey';
			scoreDisplay.innerHTML = botData[i]['coins'] 
			ateDisplay.innerHTML = botData[i].ate ? botData[i].ate + "(" + botData[i].ateCoins + ")" : "";
			eatenDisplay.innerHTML = botData[i].eaten ? botData[i].eaten : "";
			mutualDisplay.innerHTML = botData[i].mutual ? botData[i].mutual : "";
			flightsDisplay.innerHTML = botData[i].flights ? botData[i].flights : "";
			colorDisplay.style.backgroundColor = '#f8f8ff';
		}
		else
		{ 
			colorDisplay.style.backgroundColor = botData[i].color ? botData[i].color : '#ff0000';
			ateDisplay.innerHTML = botData[i].ate ? botData[i].ate + "(" + botData[i].ateCoins + ")" : "";
			eatenDisplay.innerHTML = botData[i].eaten ? botData[i].eaten : "";
			mutualDisplay.innerHTML = botData[i].mutual ? botData[i].mutual : "";
			flightsDisplay.innerHTML = botData[i].flights ? botData[i].flights : "";
			scoreDisplay.innerHTML = botData[i]['coins'];
			winsDisplay.innerHTML = botData[i].wins ? botData[i].wins : "";
			let rank = rankIndices.findIndex(a => a == i);
			rankDisplay.innerHTML = rank != -1 ? "<b>" +(rank+1)+"</b>" : "—";
			if(rank == 0)
				rankDisplay.style.color = 'red';
			else if(rank == 1)
				rankDisplay.style.color = 'green';
			else if(rank == 2)
				rankDisplay.style.color = 'blue';
			else
				rankDisplay.style.color = 'black';

		} 
	} 

	document.getElementById("Title").innerHTML = "Display (round " + turnCanvas.inc + ")";
}

function postEvent(what, type)
{
	let permitGold = document.getElementById("AddGold").checked;
	let permitSilver = document.getElementById("AddSilver").checked;
	let permitEating = document.getElementById("AddEating").checked;
	let permitFlights = document.getElementById("AddFlights").checked;
	if(
		((type == "Gold") && permitGold) ||
		((type == "Silver") && permitSilver) ||
		((type == "Eating") && permitEating) ||
		((type == "Flight") && permitFlights) ||
		(type == "MainGame")
	)
	{
		let textarea = document.getElementById('EventLog');
		textarea.value += "[" + turnCanvas.inc + "] " + what + "\n";
		textarea.scrollTop = textarea.scrollHeight;
	}
}

resetEverything();
var tournament = false;