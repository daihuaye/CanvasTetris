goog.provide('tetris');

goog.require('tetris.Board');
goog.require('tetris.Piece');
goog.require('tetris.localStorage');

var COLOR_RED = [255,0,0];
var COLOR_BLUE = [0,0,255];
var COLOR_BLACK = [0,0,0];
var COLOR_WHITE = [255,255,255];

tetris.intervalInt = { i: 0 };
tetris.keyCode = { key: 0 };
tetris.Score = { score: 0, allScores: [] };
tetris.Level = { level : 1 };
tetris.blocks = [];
tetris.blockInfo = function() { this.isBlocked = false; this.color=0 };
tetris.isEnd = { end : false };
// tetris.rowsCleared = { num : 0, completedRows: [] };
tetris.rowsCleared = { num : 0 };
tetris.gameSpeed = { num : 800 };
tetris.cannotMove = { bool: false };
/**
 * @enum
 */
tetris.Tetromino = function() {
	this.pattern = 0;
	this.rotation = 0;
//	this.location = 0;
	this.x = 0;
	this.y = 0;
};

tetris.resetblocks = function() {
	var row, col;
	// for(row = 0; row <= tetris.Board.HEIGHT; row++) {
	for(row = 0; row <= tetris.Board.HEIGHT; row++) {
		for(col = 0; col <= tetris.Board.WIDTH; col++) {
			if(tetris.blocks[row*tetris.Board.WIDTH+col] == undefined)
				// buffer_ctx.fillRect(col*20, row*20, 20, 20);
				var blockInfo = new tetris.blockInfo();
				tetris.blocks[row*tetris.Board.WIDTH+col] = blockInfo;
		};
	};
};

tetris.pausegame = function() {
	if (pauseMe.value == "Pause Game") {
		pauseMe.value = "Start Game";
		pauseScene.innerHTML = "Pause";
		document.onkeydown = function(event) {
			var keyCode; 

		  if(event == null)
		  {
		    keyCode = window.event.keyCode; 
		  } else {
		    keyCode = event.keyCode; 
		  };
			// console.log(keyCode);
		  if(keyCode == 80) {
				pauseMe.value = "Pause Game";
				tetris.Board.isEnd();
				if (tetris.isEnd.end == false) {
					tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
				};
				pauseScene.innerHTML = "";
			} else if(keyCode == 82) {
				tetris.restartgame();
			};
		};
		
		clearInterval(tetris.intervalInt.i);
	} else {
		pauseMe.value = "Pause Game";
		tetris.Board.isEnd();
		if (tetris.isEnd.end == false) {
			tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
		};
		pauseScene.innerHTML = "";
	};
};

tetris.restartgame = function() {
	// setup the default value
	tetris.keyCode.key = 0;
	tetris.Score.score = 0;
	tetris.Level.level = 1;
	tetris.rowsCleared.num = 0;
	tetris.gameSpeed.num = 800;
	tetris.Score.allScores = [];
	tetris.isEnd.end = false;
	tetris.cannotMove.bool = false;
	gameOver.innerHTML = "";
	pauseScene.innerHTML = "";
	// tetris.Score.allScores = [0];
	// tetris.rowsCleared.completedRows = [0];
	// console.log(tetris.Score.allScores);
	tetris.blocks = [];
	
	// reset the blocks
	tetris.resetblocks();
	
	// retriece the data from the local storage
	tetris.localStorage.retrieve();
	
	// show the results no the list
	if (tetris.Score.allScores.length != 0) {
		tetris.localStorage.list();
	};
	
	// tetris.Board.showNextPiece();
	
	// update the speed tag
	gameSpeed.innerHTML = tetris.gameSpeed.num;
	
	// update the level
	tetris.Board.updateLevel();
	
	// update the score
	tetris.Board.updateScore();
	
	// pauseMe become 
	pauseMe.value = "Pause Game";
	
	// clear the projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "white");

	// redraw the game
	tetris.Piece.redraw(ctx, buffer, buffer_ctx);
	
	// create a new piece and start
	// var tetromino = new tetris.Tetromino();
	tetris.Piece.startTetromino(tetromino);
	
	// copy the tetromino to projection
	tetris.Piece.copy(tetromino, projection);
	// start the game

	// tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
	// tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
	
	// show the next piece
	tetris.Board.showNextPiece();
	
	clearInterval(tetris.intervalInt.i);
	tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
};

