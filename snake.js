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
					style: "cell-unused"
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
	}
})

app.controller('mainController', ['$scope', 'GameBoard', '$interval', '$timeout', '$document', function($scope, GameBoard, $interval, $timeout, $document) {
	$scope.direction = "n";
	$scope.windowSize = GameBoard.windowSize();
	$scope.gameBoard = GameBoard.getGameBoard();
	$scope.snake = [
		$scope.gameBoard[10].cells[5],
		$scope.gameBoard[10].cells[6],
		$scope.gameBoard[10].cells[7],
		$scope.gameBoard[10].cells[8]
	];
	$scope.speed = 1000;
	$scope.move = true;
	$scope.isPlaying = true;
	
	$scope.goTo = function($event){
		if($scope.move){
			if($event.keyCode == 37){
				if($scope.direction != "e"){
					$scope.direction = "w";
					$scope.move = false;
				}
			}
			else if($event.keyCode == 38){
				if($scope.direction != "s"){
					$scope.direction = "n";
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
				if($scope.direction != "n"){
					$scope.direction = "s";
					$scope.move = false;
				}
			}
		}
	};

	$document.on('keyup', $scope.goTo);

	$scope.moveOne = function(line, col, state, first){
		$scope.gameBoard[line].cells[col].used = state;
		$scope.gameBoard[line].cells[col].style = state?"cell-used":"cell-unused";
		console.log($scope.direction, first);
		if(first){
			$scope.snakeHead(line, col, true);
		}
		else{
			$scope.gameBoard[line].cells[col].head1 = "";
			$scope.gameBoard[line].cells[col].head2 = "";
		}
	};

	/**
	* Function that move all the snake (remove the last item and add an other)
	*
	* @return void
	*/
	$scope.moveAll = function(){
		// Get the actual head of the snake
		line = $scope.snake[$scope.snake.length-1].line;
		col = $scope.snake[$scope.snake.length-1].col;

		// Save into tmp var to remove the style
		lineHead = line;
		colHead = col;
			
		// Move the line/col with the actual direction
		if($scope.direction == "n")
			line -= 1;
		else if($scope.direction == "s")
			line += 1;
		else if($scope.direction == "e")
			col += 1;
		else if($scope.direction == "w")
			col -= 1;

		// Inboard verification
		if(line < 0 || line > $scope.gameBoard.length || col < 0 || col > $scope.gameBoard[0].cells.length){
			alert ("nop");
			$scope.isPlaying = false;
		}
		else{
			// Removing the last item of the snake
			last = $scope.snake.shift();
			$scope.moveOne(last.line, last.col, false, false);

			// Removing the style of the old head
			$scope.snakeHead(lineHead, colHead, false);

			// Adding the new item
			$scope.moveOne(line, col, true, true);
			$scope.snake.push($scope.gameBoard[line].cells[col]);
		}
	};

	$scope.initSnake = function(){
		for(i = 0 ; i < $scope.snake.length ; i++){
			if(i == $scope.snake.length-1)
				$scope.moveOne($scope.snake[i].line, $scope.snake[i].col, true, true);
			else
				$scope.moveOne($scope.snake[i].line, $scope.snake[i].col, true, false);
		}
	};
	$scope.snakeHead = function(line, col, print){
		if(print){
			switch($scope.direction){
				case 'n':
					$scope.gameBoard[line].cells[col].head1 = "cell-head-eye-nw";
					$scope.gameBoard[line].cells[col].head2 = "cell-head-eye-ne";
					console.log('oui');
					break;
				case 'e':
					$scope.gameBoard[line].cells[col].head1 = "cell-head-eye-se";
					$scope.gameBoard[line].cells[col].head2 = "cell-head-eye-ne";
					break;
				case 's':
					$scope.gameBoard[line].cells[col].head1 = "cell-head-eye-se";
					$scope.gameBoard[line].cells[col].head2 = "cell-head-eye-sw";
					break;
				case 'w':
					$scope.gameBoard[line].cells[col].head1 = "cell-head-eye-nw";
					$scope.gameBoard[line].cells[col].head2 = "cell-head-eye-sw";
					break;
			}
		}
		else{
			$scope.gameBoard[line].cells[col].head1 = "";
			$scope.gameBoard[line].cells[col].head2 = "";
		}
	};

	$scope.initSnake();

	$interval(function(){
		if($scope.isPlaying){
			$scope.moveAll();
			console.log($scope.isPlaying);
			$scope.move = true;
		}
	}, $scope.speed);
}]);