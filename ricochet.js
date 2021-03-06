
var makeSquare = function(row, col){
  return {
    robot_color: function(){
      return robot_color_mapping[this.robot];
    },
    row: row,
    col: col
  };
};

var makeBoard = function(){
  var resultBoard = [];
  //iterate over the elements in the row array to size
  for (var row = 0; row < size; row++){
    //make each row have columns (arrays)
    resultBoard[row] = [];
    //iterate over columns in each row
    for (var col = 0; col < size; col++){
      //put an object at every cell
      // todo: make a square class
      resultBoard[row][col] = makeSquare(row, col);
    }
  }
  return resultBoard;
}

// todo: fix camel case and snake case to be the same
// todo: build test suite

//initializing the current robot
var current_robot = 0;
// determine size of board
var size = 16;
// make a board object
var board = makeBoard();

/**************make wall borders and target blackouts**************/

for (var col = 0; col < size; col++){
  // todo: use consistent tabbing
  //make northern border
  board[0][col].n_border = true;
  board[0][col].no_target = true;
  //make southern border
  board[size - 1][col].s_border = true;
  board[size - 1][col].no_target = true;
}

for (var row = 0; row < size; row++){
  //make eastern border
  board[row][size - 1].e_border = true;
  board[row][size - 1].no_target = true;

  //make western border
  board[row][0].w_border = true;
  board[row][0].no_target = true;
}

//middle target blackouts and middle wall borders
for (var row = 6; row < 10; row++){
  for (var col = 6; col < 10; col++){
    var is_vertical_limit = row === 6 || row === 9;
    var is_horizontal_limit = col === 6 || col === 9;
    var is_corner = is_vertical_limit && is_horizontal_limit;
    if (!is_corner){
      if (is_vertical_limit && row === 6){
        board[row][col].s_border = true;
      }else if (is_vertical_limit && row === 9){
        board[row][col].n_border = true;
      }else if (is_horizontal_limit && col === 6){
        board[row][col].e_border = true;
      }else if (is_horizontal_limit && col === 9){
        board[row][col].w_border = true;
      }
      else {
        board[row][col].blackout = true;
      }
    }  
    board[row][col].no_target = true;
  }
}


/**************make targets**************/
//random number generator
var random_below = function (maximum) {
  return Math.floor( Math.random() * ( maximum ) );
}

var targets = [];

//function to put targets in array
var placeQuadrantTargets = function(verticalSide, horizontalSide){
  //defining the rules that can be applied to all quadrants equally
  var verticalOffset = verticalSide * 8;
  var horizontalOffset = horizontalSide * 8;
  //iterate over four targets to put four in each quadrant
  for (var which = 0; which < 4; which++) {
    do {	
      var dest_row = (random_below(8) + verticalOffset);
	  var dest_col = (random_below(8) + horizontalOffset);
	} while (board[dest_row][dest_col].no_target === true || board[dest_row][dest_col].is_target === true)
	board[dest_row][dest_col].is_target = true;
    //marc's no touching code
    for(var whichHNeighbor = dest_row-1; whichHNeighbor <= dest_row+1; whichHNeighbor++){
	  for(var whichVNeighbor = dest_col-1; whichVNeighbor <= dest_col+1; whichVNeighbor++){
	  if(whichHNeighbor === dest_row && whichVNeighbor === dest_col){
	    continue;
	  }
	  //add the no target property to each new target
	  board[whichHNeighbor][whichVNeighbor].no_target = true;
	}
  }
for (which_peer = 0; which_peer < 8; which_peer++){
  if (verticalOffset + which_peer !== dest_row){
	board[verticalOffset + which_peer][dest_col].no_target = true;
  }
  if (horizontalOffset + which_peer !== dest_col){
    board[dest_row][horizontalOffset + which_peer].no_target = true;
  }
}
//putting the target in the array
targets.push(board[dest_row][dest_col]);
		
		//adding walls to the new target
		if (which === 0) {
		    board[dest_row][dest_col].e_border = true;
			board[dest_row][dest_col+1].w_border = true;
		    board[dest_row][dest_col].n_border = true;
			board[dest_row-1][dest_col].s_border = true;
		} else if (which === 1) {
		    board[dest_row][dest_col].e_border = true;
			board[dest_row][dest_col+1].w_border = true;
			board[dest_row][dest_col].s_border = true;
			board[dest_row+1][dest_col].n_border = true;
		} else if (which === 2) {
			board[dest_row][dest_col].w_border = true;
			board[dest_row][dest_col-1].e_border = true;
			board[dest_row][dest_col].n_border = true;
			board[dest_row-1][dest_col].s_border = true;
		} else if (which === 3) {
			board[dest_row][dest_col].w_border = true;
			board[dest_row][dest_col-1].e_border = true;
			board[dest_row][dest_col].s_border = true;
			board[dest_row+1][dest_col].n_border = true;
		}
		//adding walls to adjacent cells
	}
};


placeQuadrantTargets(false, false);
placeQuadrantTargets(false, true);
placeQuadrantTargets(true, false);
placeQuadrantTargets(true, true);

//choosing one target to be the active target
var active_target = {};
var target_number = random_below(15);
active_target.row = targets[target_number].row;
active_target.col = targets[target_number].col;
//selecting which robot needs to go there
var whichRobot = random_below(4);
if (whichRobot === 0) {
  board[active_target.row][active_target.col].redTarget = true;
} else if (whichRobot === 1) {
  board[active_target.row][active_target.col].greenTarget = true;
} else if (whichRobot === 2) {
  board[active_target.row][active_target.col].blueTarget = true;
} else if (whichRobot === 3) {
  board[active_target.row][active_target.col].yellowTarget = true;
}





//make random side border walls
var place_quadrant_bucket_walls = function (vertical_index, horizontal_index){
  var bucket_dest_row = Math.abs(15 * vertical_index - (random_below(4) + 3));
  var bucket_dest_col = Math.abs(15 * horizontal_index - (random_below(4) + 3));
  
	board[bucket_dest_row][(15 * horizontal_index)].s_border = true;
	board[bucket_dest_row+1][(15 * horizontal_index)].n_border = true;
	board[(15 * vertical_index)][bucket_dest_col].e_border = true;
	board[(15 * vertical_index)][bucket_dest_col+1].w_border = true;
  
}

place_quadrant_bucket_walls(false, false);
place_quadrant_bucket_walls(false, true);
place_quadrant_bucket_walls(true, false);
place_quadrant_bucket_walls(true, true);


/**************make the robots and place them randomly**************/

//make blue robot and say where it is
var robot_number = 4;
var robot_list = [];
var robot_color_mapping = {
  0: 'red',
  1: 'green',
  2: 'blue',
  3: 'yellow'
};
var color_robot_mapping = {
  'red': 0,
  'green': 1,
  'blue': 2,
  'yellow': 3
};

for (var which = 0; which < robot_number; which++) {
	do {
	  var robot_row = random_below(16);
	  var robot_col = random_below(16);
	} while (board[robot_row][robot_col].is_target || 
	  typeof board[robot_row][robot_col].robot === 'number' || 
	  (
	    (board[robot_row][robot_col].row === 7 || board[robot_row][robot_col].row === 8) &&
	    (board[robot_row][robot_col].col === 7 || board[robot_row][robot_col].col === 8) 
	  )   
	)
    board[robot_row][robot_col].robot = which;
	robot_list.push({
		row: robot_row,
		col: robot_col,
		home_row: robot_row,
		home_col: robot_col
	});
}

//setting original robot locations

/**************selecting robots and resetting**************/
var select_robot = function (number) {
  current_robot = number;
};

var reset = function () {
  for (var which_robot = 0; which_robot < 4; which_robot++) {
    delete board[robot_list[which_robot].row][robot_list[which_robot].col].robot;
    robot_list[which_robot].row = robot_list[which_robot].home_row;
    robot_list[which_robot].col = robot_list[which_robot].home_col;
    board[robot_list[which_robot].row][robot_list[which_robot].col].robot = which_robot;
    board.victorious = false;
  }
board.move_count = 0;
};

/**************move robots**************/

//define location
board.bestRoute = null;
board.move_count = 0;
var move = {
  north: function () { return move.somewhere('row', -1, 'n_border'); },
  south: function () { return move.somewhere('row',  1, 's_border'); },
  east:  function () { return move.somewhere('col',  1, 'e_border'); },
  west:  function () { return move.somewhere('col', -1, 'w_border'); },
  
  somewhere: function(axis, change, wallProperty){
    var location = {
      row: robot_list[current_robot].row,
      col: robot_list[current_robot].col
    };
    while(!board[location.row][location.col][wallProperty]){
      location[axis] = location[axis] + change;
      if (typeof board[location.row][location.col].robot === "number"){
        location[axis] = location[axis] - change;
        break;
      }
    }
    //adding to the counter
    board.move_count++;
    react.changed(board, 'move_count');
    //update its old indicator
    var squareToLeave = board[robot_list[current_robot].row][robot_list[current_robot].col];
    squareToLeave.robot = null;
    react.changed(squareToLeave, 'robot_color');
    //update the robot's location
    robot_list[current_robot].row = location.row;
    robot_list[current_robot].col = location.col;
    //update its new indicator
    var squareToEnter = board[robot_list[current_robot].row][robot_list[current_robot].col];
    squareToEnter.robot = current_robot;
    react.changed(squareToEnter, 'robot_color');
    if (robot_list[current_robot].row === active_target.row && robot_list[current_robot].col === active_target.col) {
      if (current_robot === whichRobot) {
        board.victorious = true;
        react.changed(board, 'victorious');
      }
      if (board.bestRoute != null) {
        if (board.move_count < board.bestRoute) {
          board.bestRoute = board.move_count;
        }
      } else {
        board.bestRoute = board.move_count;
      }
      react.changed(board, 'bestRoute');
    }
  }
};
var timerIsOn = 0;
var currentTime;
function doTimer() {
  if (!timerIsOn) {
    timerIsOn=1;
    currentTime = 60;
    counter();
  }
};
function counter() {
  document.getElementById('txt').value = currentTime;
  currentTime = currentTime - 1;
  if (currentTime === -1) {
    alertMsg();
  } else {    
    setTimeout(counter,1000);
  }
};
function alertMsg() {
  alert("One minute is up!");
};
