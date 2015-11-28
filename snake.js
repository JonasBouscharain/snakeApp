var app = angular.module("snakeApp", []);

app.service('GameBoard', function(){
	this.windowSize = function(){
		size = [window.innerWidth, window.innerHeight];
		return {
			"width":size[0]+"px",
			"height":size[1]+"px"
		};
	},
	this.getGameBoard = function(){
		width = window.innerWidth;
		height = window.innerHeight;
		size = 20;
		l = [];
		countL = 0;
		for(i = 0 ; i < height-size ; i += size){
			c = [];
			countC = 0;
			for(j = 0 ; j < width-size ; j += size){
				c[countC] = {
					id: "["+countL+","+countC+"]",
					line: countL,
					col: countC,
					used: false,
					style: this.used?"cell-used":"cell-unused"
				};
				countC++;
			}
			l[countL] = {
				cells: c,
				style: {
					"width":size+"px",
					"height":size+"px"
				}
			};
			countL++;
		}
		console.log(l);
		return l;
	},
	this.move = function(board, line, col){
		board[line].cells[col].used = true;
		console.log(board);
	}
})

app.controller('mainController', ['$scope', 'GameBoard', function($scope, GameBoard) {
	$scope.windowSize = GameBoard.windowSize();
	$scope.gameBoard = GameBoard.getGameBoard();
	GameBoard.move($scope.gameBoard, 10, 10);
}]);