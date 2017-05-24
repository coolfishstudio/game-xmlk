var board = [];//游戏数据
var score = 0;//游戏步骤
var highScore = 0;//成功次数

//入口
$(document).ready(function(){
	newGame();
});

function newGame(){
	prepareForMobile();
	init();//初始化
}

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 67;
		cellSpace = 14;
	}

	$('#grid-container').css({
		'width' : gridContainerWidth - 2 * cellSpace,
		'height' : gridContainerWidth - 2 * cellSpace,
		'padding' : cellSpace,
		'border-radius' : 0.02 * gridContainerWidth
	});

    $('.grid-cell').css({
    	'width' : cellSideLength,
    	'height' : cellSideLength,
    	'border-radius' : 0.02 * cellSideLength
	});
    score = 0;
	highScore = parseInt(getStorage() || 0);
	updateScore(score);
}

function init(){
	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 6; j++){
			var gridCell = $('#grid-cell-' + i + '-' + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	}
	//填充棋子
	for(var i = 0; i < 6; i++){
		board[i] = [];
		for(var j = 0; j < 6; j++){
			board[i][j] = 0;
		}
	}
	for (d = 0; d < 36; d++) {
		a = Math.floor(Math.random() * 6);
		b = Math.floor(Math.random() * 6);
		switchFld(a - 1, b);
		switchFld(a + 1, b);
		switchFld(a, b - 1);
		switchFld(a, b + 1);
		switchFld(a, b);
	}
	updateBoardView();
}

//根据board对前端number-cell操作
function updateBoardView(){
	$('.number-cell').remove();

	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 6; j++){
			$('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);

			theNumberCell.css({
				'width' : cellSideLength,
				'height' : cellSideLength,
				'top' : getPosTop(i, j),
				'left' : getPosLeft(i, j),
				'background-color' : getNumberBackgroundColor(board[i][j])
			});
			theNumberCell.attr('date-bgnum', board[i][j]);
		}
	}
	$('.number-cell').on('click',function(){
		var arr = $(this).attr('id').split('-');
		clicked(parseInt(arr[2]), parseInt(arr[3]));
	});
}








