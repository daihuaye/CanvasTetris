goog.provide('tetris.localStorage');

tetris.localStorage.store = function() {
	localStorage.setItem('scores', tetris.Score.allScores);
};

tetris.localStorage.retrieve = function() {
	var numAry, str, i;
	if (localStorage.getItem('scores') != null) {
		str = localStorage.getItem('scores');
		numAry = str.split(",");
		for(i = 0; i < numAry.length; i++) {
			tetris.Score.allScores.push(parseInt(numAry[i]));
		};
	} else {
		tetris.Score.allScores = [];
	};
};

tetris.localStorage.insertSortScores = function() {
	var temp, i, j;
	for(i = 1; i < tetris.Score.allScores.length; i++) {
		temp = tetris.Score.allScores[i];
		j = i;
		while(j > 0 && tetris.Score.allScores[j - 1] < temp) {
			tetris.Score.allScores[j] = tetris.Score.allScores[j - 1];
			j--;
		};
		tetris.Score.allScores[j] = temp;
	};		
};

tetris.localStorage.list = function () {
	tetris.localStorage.insertSortScores();
	// tetris.Score.allScores.reverse();
	var i;
	for(i = 0; i < 10; i++) {
		if (tetris.Score.allScores[i] != undefined) {
			listScores.children[i].innerHTML = tetris.Score.allScores[i];
		};
	};
};
