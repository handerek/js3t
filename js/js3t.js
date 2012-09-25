/*
 * Date: 2010-09-20 00:14:10 +0200
 */

var js3t = {};

js3t.TicTacToe = function(){	
	var level = 2;
	var opponent = 0;	// 0 = computer, 1 = human
	var cur_player = 0;
	var field = [0x0, 0x0];
	var solutions = [0x007, 0x038, 0x1c0, 0x049, 0x092, 0x124, 0x111, 0x054];
	
	
	this.init = function(){				
		var _this = this;
		this.msgCurPlayer();
		
		$('#js3tOpponent').change(function(){ 
			opponent = $(this).val(); 
			$('#js3tLevel').attr('disabled', opponent == 1 ? true : false);				
			_this.clear();
		});
		$('#js3tLevel').change(function(){ 
			level = $(this).val();
			_this.clear();
		});
		$('#js3tPlay').click(function(){
			_this.clear();
		});
		$('#js3tField .js3tCell').click($.proxy(this, 'onClick'));
	};
	
	this.onClick = function(e){
		if(opponent == 1 && cur_player >= 0 || opponent == 0 && cur_player == 0){
			var id = $(e.target).attr('id');
			var cell_id = parseInt(id.slice(id.length-1, id.length));
			this.setCell(cell_id);
		}
		if(opponent == 0 && cur_player == 1)
			this.computer();
	};
	
	this.cellIsFree = function(cell_id){
		var bit = 0x1 << cell_id;
		if((field[0] & bit) == 0 && (field[1] & bit) == 0)
			return true;
		return false;
	};
	
	this.getFreeCells = function(){
		return (field[0] | field[1]) ^ 0x1ff;
	};
	
	this.setCell = function(cell_id){
		if(this.cellIsFree(cell_id)){
			$('#js3tCell-'+cell_id).addClass('js3tP'+cur_player);
			field[cur_player] |= 0x1 << cell_id;
			this.checkScore();
			return true;
		}
		return false;
	};
	
	this.checkScore = function(){
		var score = null;
		for(var i=0; i<solutions.length; i++){
			if((solutions[i] & field[cur_player]) == solutions[i]){
				this.highlightSolution(solutions[i]);
				score = 1;
			}
		}
		if(!score && this.getFreeCells() == 0)
			score = -1;
		if(!score)
			score = 0;
		
		switch(score){
			case -1:
				$('#js3tMsg').text('Tie!');
				cur_player = -1;
				break;
				
			case 0:
				cur_player = ++cur_player % 2;
				this.msgCurPlayer();
				break;
				
			case 1:
				var msg = '';
				if(opponent == 0)
					msg = cur_player == 1 ? 'Computer' : 'You';
				else
					msg = 'Player ' +(cur_player+1);
				msg += ' win!';
				$('#js3tMsg').text(msg);
				cur_player = -1;
				break;
				
			default:
				break;
		}
		
	};
	
	this.highlightSolution = function(solution){
		for(var i=0; i<9; i++)
			if((solution & (0x1 << i)) != 0)
				$('#js3tCell-'+i).addClass('hilight');
	};
	
	this.msgCurPlayer = function(){
		var msg = '';
		if(opponent == 0)
			msg = 'It\'s your turn.';
		else
			msg = 'Player ' +(cur_player+1) +' it\'s your turn';
		$('#js3tMsg').text(msg);
	};
	
	this.clear = function(){
		field = [0x0, 0x0];
		cur_player = 0;
		$('#js3tField .js3tCell')
		 .removeClass('js3tP0')
		 .removeClass('js3tP1')
		 .removeClass('hilight');
		this.msgCurPlayer();
	};
	
	this.computer = function(){
		var free_cells = this.getFreeCells();
		
		if(level > 0){
			for(var i=1; i>=0; i--){
				for(var j=0; j<solutions.length; j++){
					var a = ((field[i] ^ solutions[j]) & solutions[j]);
					if(a > 0){
						var bit = Math.log(a)/ Math.log(2);
						if(bit % 1 == 0 && this.cellIsFree(bit)){
							this.setCell(bit);
							return;
						}
					}
				}
			}
				
			if(level > 1){
				// Set center if free
				if(this.cellIsFree(4)){
					this.setCell(4);
					return;
					
				// Else set corner
				}else if((field[0] & (0x1 << 4)) > 0){
					var a = [0, 2, 6, 8];
					var i = Math.floor(Math.random()*a.length);
					if(this.cellIsFree(a[i])){
						this.setCell(a[i]);
						return;
					}
				}
				
				if(this.cellIsFree(0)){
					if( ((field[0] & (0x1 << 3)) > 0 && (field[0] & (0x1 << 1)) > 0) ||
						((field[0] & (0x1 << 3)) > 0 && (field[0] & (0x1 << 2)) > 0) ||
						((field[0] & (0x1 << 1)) > 0 && (field[0] & (0x1 << 6)) > 0) ){
						this.setCell(0);
						return;
					}
				}
				if(this.cellIsFree(2)){
					if( ((field[0] & (0x1 << 1)) > 0 && (field[0] & (0x1 << 5)) > 0) ||
						((field[0] & (0x1 << 1)) > 0 && (field[0] & (0x1 << 8)) > 0) ||
						((field[0] & (0x1 << 5)) > 0 && (field[0] & (0x1 << 0)) > 0) ){
						this.setCell(2);
						return;
					}
				}
				if(this.cellIsFree(8)){
					if( ((field[0] & (0x1 << 5)) > 0 && (field[0] & (0x1 << 7)) > 0) ||
						((field[0] & (0x1 << 5)) > 0 && (field[0] & (0x1 << 6)) > 0) ||
						((field[0] & (0x1 << 7)) > 0 && (field[0] & (0x1 << 2)) > 0) ){
						this.setCell(8);
						return;
					}
				}
				if(this.cellIsFree(6)){
					if( ((field[0] & (0x1 << 3)) > 0 && (field[0] & (0x1 << 7)) > 0) ||
						((field[0] & (0x1 << 3)) > 0 && (field[0] & (0x1 << 8)) > 0) ||
						((field[0] & (0x1 << 0)) > 0 && (field[0] & (0x1 << 7)) > 0) ){
						this.setCell(6);
						return;
					}
				}
				
				if( ((field[0] & (0x1 << 0)) > 0 && (field[0] & (0x1 << 8)) > 0) ||
					((field[0] & (0x1 << 2)) > 0 && (field[0] & (0x1 << 6)) > 0) ){
					var a = [1, 3, 5, 7];
					// delete non free cells
					for(var i=0; i<a.length; i++){
						if(!this.cellIsFree(a[i]))
							a.slice(i, 1);
					}
					this.setCell(a[Math.floor(Math.random()*a.length)]);
					return;
				}
			}
		}
		
		do{
			var cell_id = Math.floor(Math.random()*8);
		}while(!this.cellIsFree(cell_id));
		this.setCell(cell_id);
	};
	
	
	return this.init();
};
