goog.provide('tetris.Board');

tetris.Board.WIDTH = 10;
tetris.Board.HEIGHT = 22; // add 

tetris.Board.isBlocked = function(x, y) {
	if(x < 0  || x >= tetris.Board.WIDTH || y < 0 || y >= tetris.Board.HEIGHT || tetris.blocks[y*tetris.Board.WIDTH+x].isBlocked) {
		return true;
	} else {
		return false;
	};
};

tetris.Board.checkMove = function(tetromino) {
	var pos, i, isValid, x, y;
	
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
		x = pos[0] / 20 + tetromino.x / 20; // check
		y = pos[1] / 20 + tetromino.y / 20;
		if (tetris.Board.isBlocked(x, y)) {
			return 0;
		};
	};
	return 1;
};

// tetris.Board.drawBoard = function(ctx, buffer, buffer_ctx) {
// 	buffer_ctx.beginPath();
// 	buffer_ctx.strokeStyle="red";
// 	buffer_ctx.strokeRect(0,0,200,400);
// 	buffer_ctx.closePath();
// 	ctx.drawImage(buffer, 0, 0);
// }

tetris.Board.clearFilledRows = function(ctx, buffer, buffer_ctx, tetromino) {
	var row, col, row2, nextLevel;
	nextLevel = 1;
	var fillRows = 0;
	for(row = 22; row >=0; ) {
		for(col = 0; col < 10; ++col) {
			if(!(tetris.blocks[row*tetris.Board.WIDTH+col].isBlocked)) {
				break;
			};
		};
		if(col == 10) {
			tetris.Score.score += tetris.Level.level * [40,100,300,1200][fillRows];
			fillRows++;
			for(row2 = row - 1; row2 >= 0; row2--) {
				for(col = 0; col < 10; ++col) {
					// console.log("copy from the new low");
					tetris.blocks[(row2+1)*tetris.Board.WIDTH+col].isBlocked = tetris.blocks[row2*tetris.Board.WIDTH+col].isBlocked;
					tetris.blocks[(row2+1)*tetris.Board.WIDTH+col].color = tetris.blocks[row2*tetris.Board.WIDTH+col].color;
				};
			};
			// reset the top row
			// lastRow = 0;
			for(col = 0; col <= tetris.Board.WIDTH; col++) {
				tetris.blocks[col].isBlocked = false;
			};
			
			tetris.Piece.redraw(ctx, buffer, buffer_ctx);
			tetris.Board.updateScore();
		} else {
			row--;
		};
	};
	tetris.rowsCleared.num = tetris.rowsCleared.num + fillRows;
	nextLevel = 1 + Math.floor(tetris.rowsCleared.num/4);
	tetris.Level.level = nextLevel;
	tetris.Board.updateLevel();
	tetris.Board.updateSpeed();
};

tetris.Board.showNextPiece = function() {
	var x, y;
	var pos, i;
	var aryColor = [];
	preview_ctx.clearRect(0,0,80,80);
	
	tetris.Piece.startTetromino(nextTetromino);
	// console.log(nextTetromino);
	x = nextTetromino.x;
	y = nextTetromino.y;
	nextTetromino.x = 0;
	nextTetromino.y = 0;
	// blockImg.src = "images/blocks.png";
	preview_ctx.fillStyle="black";
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[nextTetromino.pattern][nextTetromino.rotation][i];
		preview_ctx.fillRect(pos[0] + nextTetromino.x, pos[1] + nextTetromino.y, 20, 20);
		// if(color == "black") {
		// console.log(pos[0] + nextTetromino.x);
		// aryColor = tetris.Piece.COLORS[nextTetromino.pattern];
		// console.log(aryColor);
		// console.log(tetris.Piece.COLORS[nextTetromino.pattern][0]);
		// console.log(tetris.Piece.COLORS[nextTetromino.pattern][1]);
		// console.log(pos[0] + nextTetromino.x);
		// console.log(pos[1] + nextTetromino.y);
		preview_ctx.drawImage(blockImg, tetris.Piece.COLORS[nextTetromino.pattern][0], tetris.Piece.COLORS[nextTetromino.pattern][1], 20, 20, pos[0] + nextTetromino.x, pos[1] + nextTetromino.y, 20, 20);
		// preview_ctx.drawImage(blockImg, tetris.Piece.COLORS[nextTetromino.pattern][0], tetris.Piece.COLORS[nextTetromino.pattern][1], 20, 20);
	};
	// preview_ctx.drawImage(previewTemp, 0, 0);
	nextTetromino.x = x;
	nextTetromino.y = y;
};

tetris.Board.isEnd = function() {
	var col;
	for(col = 0; col < 10 && tetris.isEnd.end == false; col++) {
		if(tetris.Board.isBlocked(col, 0)) {
			clearInterval(tetris.intervalInt.i);
			// storage the scores and rows completed in the local storage
			tetris.Score.allScores.push(tetris.Score.score);
			// tetris.rowsCleared.completedRows.push(tetris.rowsCleared.num);
			tetris.localStorage.store(); // store the score
			tetris.localStorage.list(); // list the scroes in the aside

			gameOver.innerHTML = "Game Over";
			document.onkeydown = function(event) {
				var keyCode; 

			  if(event == null)
			  {
			    keyCode = window.event.keyCode; 
			  } else {
			    keyCode = event.keyCode; 
			  };
				if(keyCode == 82) {
					tetris.restartgame();
				};
			};
			tetris.isEnd.end = true;
		};
	};
};

tetris.Board.updateScore = function() {
		gameScore.innerHTML = tetris.Score.score;
};

tetris.Board.updateLevel = function() {
	gameLevel.innerHTML = tetris.Level.level;
};

tetris.Board.updateSpeed = function() {
	var speedup = 100;
	var temp = 0;
	if(tetris.Level.level >= 5) {
		speedup = 10;
		tetris.gameSpeed.num = 200 - (tetris.Level.level - 4) * speedup;
	} else {
		tetris.gameSpeed.num = 800 - (tetris.Level.level - 1) * speedup;
	};
	gameSpeed.innerHTML = tetris.gameSpeed.num;
	clearInterval(tetris.intervalInt.i);
	tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
};

tetris.Board.sleep = function(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while(new Date().getTime() < dt.getTime()) {tetris.Board.key();};
};

tetris.Board.key = function() {
	document.onkeydown = function(event) {
	  var keyCode; 
		
	  if(event == null)
	  {
	    keyCode = window.event.keyCode; 
	  } else {
	    keyCode = event.keyCode; 
	  };
		// console.log(keyCode);
	  switch(keyCode)
	  {
	    // left 
	    case 37:
	      // action when pressing left key
				// tetris.Piece.changMove = function(ctx, buffer, buffer_ctx, tetromino, dx, dy);
				if(!tetris.cannotMove.bool)
					tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, -20, 0);
	      break;
	    // up 
	    case 38:
	    // action when pressing up key
				if(!tetris.cannotMove.bool)
					tetris.Piece.rotation(ctx, buffer, buffer_ctx, tetromino);
	      break; 

	    // right 
	    case 39:
	    // action when pressing right key
				if(!tetris.cannotMove.bool)
					tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, 20, 0);
	      break; 

	    // down
	    case 40:
	    // action when pressing down key
				if(!tetris.cannotMove.bool)
					tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, 0, 20);
	      break; 

			// space
			case 32:
				// drop down when pressing space bar
				// setTimeout("tetris.Piece.dropDown(ctx, buffer, buffer_ctx, tetromino)", 10);
				tetris.Piece.dropDown(ctx, buffer, buffer_ctx, tetromino);
				break;
			case 80:
				tetris.pausegame();
				break;
			case 82:
				tetris.restartgame();
				break;
	    default: 
	      break; 
	  }; 
	};
};