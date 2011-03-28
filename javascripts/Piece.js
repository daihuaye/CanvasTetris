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
]

tetris.Piece.COLORS = [
	[0,0],[20,0],[40,0],[60,0],[80,0],[100,0],[120,0]
]

tetris.Piece.startTetromino = function(tetromino) {
	tetromino.pattern = Math.floor(Math.random() * 7);
	tetromino.x = Math.floor(Math.random() * 7) * 20;
	tetromino.y = 0
	tetromino.rotation = 0;
}

tetris.Piece.drawTetromino = function(ctx, buffer, buffer_ctx, tetromino, color) {
	var pos, i;
	// var imgDraw = [20, 20];
	// var notDraw = [0, 0];
	// var drawArea = 0;
	buffer_ctx.fillStyle=color;
	// console.log(color == "black");
	// if (color == "black") {
	// 	drawArea = 0;
	// } else if(color == "white") {
	// 	drawArea = 20;
	// };
	// console.log(drawArea);
	
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
		if (color == "black") {
			buffer_ctx.drawImage(blockImg, tetris.Piece.COLORS[tetromino.pattern][0], tetris.Piece.COLORS[tetromino.pattern][1], 20, 20, pos[0] + tetromino.x, pos[1] + tetromino.y, 20, 20);
		} else if (color == "white") {
			buffer_ctx.fillRect(pos[0] + tetromino.x, pos[1] + tetromino.y, 20, 20);
		};
	}
	ctx.drawImage(buffer, 0, 0);
}

tetris.Piece.redraw = function(ctx, buffer, buffer_ctx) {
	var row, col;
	buffer_ctx.clearRect(0,0, 200, 400);
	ctx.clearRect(0,0,200,400);
	buffer_ctx.fillStyle="black";
	for(row = 0; row < tetris.Board.HEIGHT; row++) {
		for(col = 0; col < tetris.Board.WIDTH; col++) {
			// if(tetris.blocks[row*tetris.Board.WIDTH+col])
			if(tetris.blocks[row*tetris.Board.WIDTH+col])
				if(tetris.blocks[row*tetris.Board.WIDTH+col].isBlock)
					buffer_ctx.fillRect(col*20, row*20, 20, 20);
		};
	};
	
	ctx.drawImage(buffer, 0, 0);
	tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
}

// tetris.Piece.drawPreviewTetromino = function(ctx, buffer, buffer_ctx, previewTetromino, color) {
// 	var pos, i;
// 	buffer_ctx.fill
// }

tetris.Piece.copy = function(tetromino, tempTetromino) {
	tempTetromino.x = tetromino.x;
	tempTetromino.y = tetromino.y;
	tempTetromino.pattern = tetromino.pattern;
	tempTetromino.rotation = tetromino.rotation;
}

tetris.Piece.rotation = function(ctx, buffer, buffer_ctx, tetromino) {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	
	tempTetromino.rotation = (tempTetromino.rotation + 1) % 4;
	
	if (tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
	};
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
}

tetris.Piece.changMove = function(ctx, buffer, buffer_ctx, tetromino, dx, dy) {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	
	tempTetromino.x += dx;
	tempTetromino.y += dy;

	if (tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
	};		
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
}

tetris.Piece.dropDown = function(ctx, buffer, buffer_ctx, tetromino) {
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);

	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
	tempTetromino.y += 20;
	while(tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.copy(tempTetromino, tetromino);
		tempTetromino.y += 20;
	};
	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
}

// tetris.Piece.preview = function(ctx, buffer, buffer_ctx, previewTetromino) {
// 	var tempTetromino = new tetris.Tetromino();
// 	var color = "rgba(0,0,0, 0.2)";
// 	tetris.Piece.copy(previewTetromino, tempTetromino);
// 	
// 	tempTetromino.y += 20;
// 	while(tetris.Board.checkMove(tempTetromino)){
// 		tetris.Piece.copy(tempTetromino, previewTetromino);
// 	};
// 	tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, previewTetromino, color);
// }


tetris.Piece.move = function(ctx, buffer, buffer_ctx, tetromino) {
	
	var col, i, pos, x, y;
	var tempTetromino = new tetris.Tetromino();
	tetris.Piece.copy(tetromino, tempTetromino);
	tempTetromino.y += 20;
	
	tetris.Board.key();
	
	if(tetris.Board.checkMove(tempTetromino)) {
		tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "white");
		tetris.Piece.copy(tempTetromino, tetromino);
		tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");
	} else {
		for(i = 0; i < 4; i++) {
			pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
			x = pos[0] / 20 + tetromino.x / 20;
			y = pos[1] / 20 + tetromino.y / 20;
			var blockInfo = new tetris.blockInfo();
			blockInfo.isBlock = true;
			blockInfo.color = tetromino.pattern;
			// tetris.blocks[y*tetris.Board.WIDTH+x] = true;
			tetris.blocks[y*tetris.Board.WIDTH+x] = blockInfo;
		};		
		tetris.Board.clearFilledRows(ctx, buffer, buffer_ctx, tetromino); // TODO
		if(!tetris.Board.isEnd()) {
			// next piece
			// tetris.Piece.copy = function(tetromino, tempTetromino)
			tetris.Piece.copy(nextTetromino, tetromino);
			tetris.Board.showNextPiece();
			// tetris.Piece.startTetromino(tetromino);
			tetris.Piece.drawTetromino(ctx, buffer, buffer_ctx, tetromino, "black");			
		};
	};
	tetris.Board.drawBoard(ctx, buffer, buffer_ctx);
}
