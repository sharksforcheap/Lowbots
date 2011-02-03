//initializing the current robot
var current_robot = 0;
// determine size of board
var size = 16;
// make a board object
var board = [];
//iterate over the elements in the row array to size
for (var row = 0; row < size; row++){
//make each row have columns (arrays)
  board[row] = [];
  //iterate over columns in each row
  for (var col = 0; col < size; col++){
    //put an object at every cell
    board[row][col] = {
		robot_color: function(){
			return robot_color_mapping[this.robot];
		},
    	row: row,
    	col: col
    };
  }
}

/**************make wall borders and target blackouts**************/
	
for (var col = 0; col < size; col++){
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
		//putting the targets in the array
		targets.push(board[dest_row][dest_col]);
		//adding walls to the new target
		if (random_below(2)){
			board[dest_row][dest_col].e_border = true;
			board[dest_row][dest_col+1].w_border = true;
		} else {
			board[dest_row][dest_col].w_border = true;
			board[dest_row][dest_col-1].e_border = true;

		}
		if (random_below(2)){
			board[dest_row][dest_col].n_border = true;
			board[dest_row-1][dest_col].s_border = true;
		} else {
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

for (var which = 0; which < robot_number; which++) {
	do {
	  var robot_row = random_below(16);
	  var robot_col = random_below(16);
	} while (board[robot_row][robot_col].is_target === true || typeof board[robot_row][robot_col].robot === 'number')
    board[robot_row][robot_col].robot = which;
	robot_list.push({
		row: robot_row,
		col: robot_col
	});
}

/**************selecting robots**************/



/**************move robots**************/

//define location

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
    }
    //update its old indicator
    board[robot_list[current_robot].row][robot_list[current_robot].col].robot = null;
    //update the robot's location
    robot_list[current_robot].row = location.row;
    robot_list[current_robot].col = location.col;
    //update its new indicator
    board[robot_list[current_robot].row][robot_list[current_robot].col].robot = current_robot;
  }
};


move.east();
move.south();
move.west();
move.north();
