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
		return l;
	},
	this.moveOne = function(board, line, col, state){
		
		board[line].cells[col].used = state;
		board[line].cells[col].style = state?"cell-used":"cell-unused";
		console.log(board[line].cells[col].style);
	},
	this.moveAll = function(board, snake, direction){
		last = snake.shift();
		this.moveOne(board, last.line, last.col, false);
		//snake.shift();

		line = snake[snake.length-1].line;
		col = snake[snake.length-1].col;
		if(direction == "n")
			line += 1;
		else if(direction == "s")
			line -= 1;
		else if(direction == "e")
			col += 1;
		else if(direction == "w")
			col -= 1;
		//console.log(line, col);
		this.moveOne(board, line, col, true);
		snake.push(board[line].cells[col]);
	},
	this.initSnake = function(board, snake){
		for(i = 0 ; i < snake.length ; i++){
			this.moveOne(board, snake[i].line, snake[i].col, true);
		}
	}
})

app.controller('mainController', ['$scope', 'GameBoard', '$interval', '$timeout', '$document', function($scope, GameBoard, $interval, $timeout, $document) {
	$scope.direction = "e";
	$scope.windowSize = GameBoard.windowSize();
	$scope.gameBoard = GameBoard.getGameBoard();
	$scope.snake = [
		$scope.gameBoard[10].cells[5],
		$scope.gameBoard[10].cells[6],
		$scope.gameBoard[10].cells[7],
		$scope.gameBoard[10].cells[8]
	];
	$scope.speed = 100;
	$scope.move = true;

	GameBoard.initSnake($scope.gameBoard, $scope.snake);

	$interval(function(){
		GameBoard.moveAll($scope.gameBoard, $scope.snake, $scope.direction);
		$scope.move = true;
	}, $scope.speed);

	
	$scope.goTo = function($event){
		if($scope.move){
			if($event.keyCode == 37){
				if($scope.direction != "e"){
					$scope.direction = "w";
					$scope.move = false;
				}
			}
			else if($event.keyCode == 38){
				if($scope.direction != "n"){
					$scope.direction = "s";
					$scope.move = false;
				}
			}
			else if($event.keyCode == 39){
				if($scope.direction != "w"){
					$scope.direction = "e";
					$scope.move = false;
				}
			}
			else if($event.keyCode == 40){
				if($scope.direction != "s"){
					$scope.direction = "n";
					$scope.move = false;
				}
			}
		}
	};

	$document.on('keyup', $scope.goTo);
}]);