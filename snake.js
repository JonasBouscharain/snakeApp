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
					eatable: false,
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
	$scope.windowStyle = {
		"width":$scope.windowSize[0]+"px",
		"height":$scope.windowSize[1]+"px"
	}

	$scope.gameBoard = GameBoard.getGameBoard();
	$scope.snake = [
		$scope.gameBoard[10].cells[5],
		$scope.gameBoard[10].cells[6],
		$scope.gameBoard[10].cells[7],
		$scope.gameBoard[10].cells[8]
	];
	$scope.speed = 100;
	$scope.move = true;
	$scope.isPlaying = true;
	$scope.mode = "hardcore";
	$scope.snakeAnim;
	
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

	$scope.moveOne = function(line, col, state, first){
		$scope.gameBoard[line].cells[col].used = state;
		$scope.gameBoard[line].cells[col].style = state?"cell-used":"cell-unused";
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
	$scope.moveAll = function(mode){
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
		if(line < 0 || line > $scope.gameBoard.length-1 || col < 0 || col > $scope.gameBoard[0].cells.length-1){
			alert ("You hit the wall !");
			$scope.isPlaying = false;
		}
		else{
			if($scope.gameBoard[line].cells[col].eatable){
				// Making the game faster if we are in hardcore mode
				if(mode == "hardcore"){
					$interval.cancel($scope.snakeAnim);
					$scope.snakeAnim = undefined;
					$scope.speed -= $scope.speed/10;
					$scope.snakeAnim = $interval(function(){
						if($scope.isPlaying){
							$scope.moveAll($scope.mode);
							$scope.move = true;
						}
					}, $scope.speed);
				}

				// Removing the eatable charac
				$scope.gameBoard[line].cells[col].eatable = false;

				// Removing the style of the old head
				$scope.snakeHead(lineHead, colHead, false);

				// Adding the new item
				$scope.moveOne(line, col, true, true);
				$scope.snake.push($scope.gameBoard[line].cells[col]);

				// Spawning of a new eatable cell
				$scope.randomSpawn();
			}
			else{
				// Removing the last item of the snake
				last = $scope.snake.shift();
				$scope.moveOne(last.line, last.col, false, false);

				if($scope.gameBoard[line].cells[col].used){
					alert("You bit yourself !");
					$scope.isPlaying = false;
				}
				else{
					// Removing the style of the old head
					$scope.snakeHead(lineHead, colHead, false);

					// Adding the new item
					$scope.moveOne(line, col, true, true);
					$scope.snake.push($scope.gameBoard[line].cells[col]);
				}
			}
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

	$scope.randomSpawn = function(){
		exec = true;
		line = Math.floor(Math.random() * ($scope.gameBoard.length-1));
		col = Math.floor(Math.random() * ($scope.gameBoard[0].cells.length-1));
		$scope.snake.forEach(function(e, i, a){
			if(e.id == $scope.gameBoard[line].cells[col].id)
				exec = false;
		})
		if(exec){
			$scope.gameBoard[line].cells[col].eatable = true;
			$scope.gameBoard[line].cells[col].style = "cell-eatable";
		}
		else{
			$scope.randomSpawn();
		}
	}

	$scope.play = function(){
		$scope.direction = "e";
		$scope.windowSize = GameBoard.windowSize();
		$scope.windowStyle = {
			"width":$scope.windowSize[0]+"px",
			"height":$scope.windowSize[1]+"px"
		}

		$scope.gameBoard = GameBoard.getGameBoard();
		$scope.snake = [
			$scope.gameBoard[10].cells[5],
			$scope.gameBoard[10].cells[6],
			$scope.gameBoard[10].cells[7],
			$scope.gameBoard[10].cells[8]
		];
		$scope.move = true;
		$scope.isPlaying = true;

		$document.on('keydown', $scope.goTo); 

		$scope.initSnake();

		$interval(function(){
			if($scope.isPlaying){
				$scope.moveAll($scope.mode);
				$scope.move = true;
			}
		}, $scope.speed);
		$scope.randomSpawn();
	};

	$scope.play();
}]);