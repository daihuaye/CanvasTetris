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
tetris.isEnd = { end : false };
// tetris.rowsCleared = { num : 0, completedRows: [] };
tetris.rowsCleared = { num : 0 };
tetris.gameSpeed = { num : 500 };
/**
 * @enum
 */
tetris.Tetromino = function() {
	this.pattern = 0;
	this.rotation = 0;
//	this.location = 0;
	this.x = 0;
	this.y = 0;
}

tetris.pausegame = function() {
	if (pauseMe.value == "Pause Game") {
		pauseMe.value = "Start Game";
		
		document.onkeydown = function(event) {};
		
		clearInterval(tetris.intervalInt.i);
	} else {
		pauseMe.value = "Pause Game";
		tetris.Board.isEnd();
		if (tetris.isEnd.end == false) {
			tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
		};
	};
}

tetris.restartgame = function() {
	// setup the default value
	tetris.keyCode.key = 0;
	tetris.Score.score = 0;
	tetris.Level.level = 1;
	tetris.rowsCleared.num = 0;
	tetris.gameSpeed.num = 500;
	tetris.Score.allScores = [];
	tetris.isEnd.end = false;
	// tetris.Score.allScores = [0];
	// tetris.rowsCleared.completedRows = [0];
	// console.log(tetris.Score.allScores);
	tetris.blocks = [];
	
	// retriece the data from the local storage
	tetris.localStorage.retrieve();
	
	// show the results no the list
	if (tetris.Score.allScores.length != 0) {
		tetris.localStorage.list();
	};
	
	// show the next piece
	tetris.Board.showNextPiece()
	
	// update the speed tag
	gameSpeed.innerHTML = tetris.gameSpeed.num;
	
	// update the level
	tetris.Board.updateLevel();
	
	// update the score
	tetris.Board.updateScore();
	
	// pauseMe become 
	pauseMe.value = "Pause Game";
	
	// redraw the game
	tetris.Piece.redraw(ctx, buffer, buffer_ctx);
	
	// create a new piece and start
	// var tetromino = new tetris.Tetromino();
	tetris.Piece.startTetromino(tetromino);
	
	// start the game

	// tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
	tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
	
	clearInterval(tetris.intervalInt.i);
	tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
}

