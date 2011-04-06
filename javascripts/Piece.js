goog.provide('tetris.Piece');

// first row is stick
// second row is L
// third row is _|
// fourth row is square
// fifth row is s
// Sixth row is _|_
// Seventh row is Z
tetris.Piece.PATTERNS = [
	[[[0,20],[20,20],[40,20],[60,20]], [[20,0],[20,20],[20,40],[20,60]], [[0,20],[20,20],[40,20],[60,20]], [[20,0],[20,20],[20,40],[20,60]]],
	[[[20,0],[20,20],[40,20],[60,20]], [[20,0],[40,0],[20,20],[20,40]],  [[0,20],[20,20],[40,20],[40,40]], [[20,0],[20,20],[0,40],[20,40]]],
	[[[40,0],[0,20],[20,20],[40,20]],  [[20,0],[20,20],[20,40],[40,40]], [[0,20],[20,20],[40,20],[0,40]],  [[0,0],[20,0],[20,20],[20,40]]],
	[[[20,0],[40,0],[20,20],[40,20]],  [[20,0],[40,0],[20,20],[40,20]],  [[20,0],[40,0],[20,20],[40,20]],  [[20,0],[40,0],[20,20],[40,20]]],
	[[[20,20],[40,20],[0,40],[20,40]], [[20,20],[20,40],[40,40],[40,60]],[[20,20],[40,20],[0,40],[20,40]], [[20,20],[20,40],[40,40],[40,60]]],
	[[[20,0],[0,20],[20,20],[40,20]],  [[20,0],[20,20],[40,20],[20,40]], [[0,20],[20,20],[40,20],[20,40]], [[20,0],[0,20],[20,20],[20,40]]],
	[[[0,0],[20,0],[20,20],[40,20]],   [[40,0],[20,20],[40,20],[20,40]], [[0,0],[20,0],[20,20],[40,20]],   [[40,0],[20,20],[40,20],[20,40]]]
];

tetris.Piece.COLORS =[
	[0,0],[20,0],[40,0],[60,0],[80,0],[100,0],[120,0]
];

tetris.Piece.startTetromino = function(tetromino) {
	tetromino.pattern = Math.floor(Math.random() * 7);
	tetromino.x = Math.floor(Math.random() * 7) * 20;
	tetromino.y = 0;
	tetromino.rotation = 0;
};

tetris.Piece.drawTetromino = function(ctx, buffer, buffer_ctx, tetromino, color) {
	var pos, i;
	buffer_ctx.fillStyle=color;
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
		if(color == "black") {
			buffer_ctx.drawImage(blockImg, tetris.Piece.COLORS[tetromino.pattern][0], tetris.Piece.COLORS[tetromino.pattern][1], 20, 20, pos[0] + tetromino.x, pos[1] + tetromino.y, 20, 20);
		} else
			buffer_ctx.fillRect(pos[0] + tetromino.x, pos[1] + tetromino.y, 20, 20);
	}
	ctx.drawImage(buffer, 0, 40, 200, 400, 0, 0, 200, 400);
};

tetris.Piece.drawProjection = function(ctx, buffer, buffer_ctx, projection, color) {
	var pos, i;
	buffer_ctx.fillStyle=color;
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[projection.pattern][projection.rotation][i];
		if(color == "black") {
			buffer_ctx.drawImage(projectionImg, 0, 0, 20, 20, pos[0] + projection.x, pos[1] + projection.y, 20, 20);
		} else
			buffer_ctx.fillRect(pos[0] + projection.x, pos[1] + projection.y, 20, 20);
	}
	ctx.drawImage(buffer, 0, 40, 200, 400, 0, 0, 200, 400);
};

// tetris.Piece.clearProjection = function() {
// 	var pos, i;
// 	buffer_ctx.fillStyle="white";
// 	for(i = 0; i < 4; i++) {
// 		pos = tetris.Piece.PATTERNS[projection.pattern][projection.rotation][i];
// 		buffer_ctx.fillRect(pos[0] + projection.x, pos[1] + projection.y, 20, 20);
// 	};
// }

tetris.Piece.redraw = function(ctx, buffer, buffer_ctx) {
	var row, col;
	var blockColor;
	buffer_ctx.clearRect(0,0, 200, 440);
	ctx.clearRect(0,0,200,400);
	// buffer_ctx.fillStyle="black";
	for(row = 0; row < tetris.Board.HEIGHT; row++) {
		for(col = 0; col < tetris.Board.WIDTH; col++) {
			if(tetris.blocks[row*tetris.Board.WIDTH+col].isBlocked) {
				blockColor = tetris.Piece.COLORS[tetris.blocks[row*tetris.Board.WIDTH+col].color];
				// buffer_ctx.fillRect(col*20, row*20, 20, 20);
				buffer_ctx.drawImage(blockImg, blockColor[0], blockColor[1], 20, 20, col*20, row*20, 20, 20);				
			};
		};
	};
	
	ctx.drawImage(buffer, 0, 40, 200, 400, 0, 0, 200, 400);
	// tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
};

tetris.Piece.copy = function(tetromino, tempTetromino) {
	tempTetromino.x = tetromino.x;
	tempTetromino.y = tetromino.y;
	tempTetromino.pattern = tetromino.pattern;
	tempTetromino.rotation = tetromino.rotation;
};

tetris.Piece.rotation = function(ctx, buffer, buffer_ctx, tetromino) {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	// projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "white");
	
	tempTetromino.rotation = (tempTetromino.rotation + 1) % 4;
	
	if (tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
		// copy to the projection
		tetris.Piece.copy(tetromino, projection);
	};
	// locate the projection
	tetris.Piece.findProjection();
	
	// projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "black");	
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
};

tetris.Piece.changMove = function(ctx, buffer, buffer_ctx, tetromino, dx, dy) {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	// projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "white");
	tempTetromino.x += dx;
	tempTetromino.y += dy;
	
	if (tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
		// copy to the projection
		tetris.Piece.copy(tetromino, projection);
	};	
	// locate the projection
	tetris.Piece.findProjection();

	// projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "black");
		
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
	// tetris.Board.showNextPiece();
};

tetris.Piece.dropDown = function(ctx, buffer, buffer_ctx, tetromino) {
	tetris.cannotMove.bool = true;
	// console.log(tetris.cannotMove.bool);
	var tempTetromino = new tetris.Tetromino();
	
	tetris.Piece.copy(tetromino, tempTetromino);
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	
	tempTetromino.y += 20;
	while(tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
		tempTetromino.y += 20;
	};
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
};

tetris.Piece.findProjection = function() {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(projection, tempTetromino);
	
	tempTetromino.y += 20;
	while(tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, projection);
		tempTetromino.y += 20;
	};
};

// var testPreview = 0;
tetris.Piece.move = function(ctx, buffer, buffer_ctx, tetromino) {
	
	var col, i, pos, x, y;
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	tempTetromino.y += 20;
	
	tetris.Board.key();
	
	// show up the projection
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "white");
	tetris.Piece.copy(tetromino, projection);
	tetris.Piece.findProjection();
	tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "black");
	
	// tetris.Board.sleep(150);
	// testPreview++;
	// if(testPreview < 2) {
	// 	tetris.Board.showNextPiece();
	// } else {
	// 	testPreview = 3;
	// };
	// console.log(tetris.cannotMove.bool);
	if(tetris.Board.checkMove(tempTetromino) || tetris.cannotMove == false) {
		tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
		tetris.Piece.copy(tempTetromino, tetromino);
		tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
	} else {
		
		// delete the projection
		// tetris.Piece.drawProjection(ctx, buffer, buffer_ctx, projection, "white");
		// tetris.Piece.redraw(ctx, buffer, buffer_ctx);
		
		// draw the tetromino when it is done
		tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
		
		for(i = 0; i < 4; i++) {
			pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
			x = pos[0] / 20 + tetromino.x / 20;
			y = pos[1] / 20 + tetromino.y / 20;

			tetris.blocks[y*tetris.Board.WIDTH+x].isBlocked = true;
			tetris.blocks[y*tetris.Board.WIDTH+x].color = tetromino.pattern;
		};		
		tetris.Board.clearFilledRows(ctx, buffer, buffer_ctx, tetromino); // TODO
		if(!tetris.Board.isEnd()) {
			// next piece
			// tetris.Piece.copy = function(tetromino, tempTetromino)
			tetris.Piece.copy(nextTetromino, tetromino);
			// copy to projection
			tetris.Piece.copy(tetromino, projection);
			tetris.Board.showNextPiece();
			// tetris.Piece.startTetromino(tetromino);
			tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");			
		};
	};
	// start new block, then change cannotMove to true
	tetris.cannotMove.bool = false;
	// tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
};
