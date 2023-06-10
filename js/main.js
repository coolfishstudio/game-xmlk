var board = [];//游戏数据
var score = 0;//游戏步骤
var highScore = 0;//成功次数

const isInMicroApp = window.__POWERED_BY_QIANKUN__;

const render = () => {
  $(document).ready(function () {
    newGame();
  });
  return Promise.resolve();
};

(global => {
  global['gamePanel'] = {
    bootstrap: () => {
      return Promise.resolve();
    },
    mount: () => {
      return render();
    },
    unmount: () => {
      return Promise.resolve();
    },
  };
})(window);

if (!isInMicroApp) {
  $(document).ready(function () {
    newGame();
  });
} else {
  var gamePanelHeader = document.getElementById('gamePanel').getElementsByTagName('header')[0];
  gamePanelHeader.style.display = 'flex';
  gamePanelHeader.style.alignItems = 'center';
  gamePanelHeader.style.padding = 0;
  gamePanelHeader.getElementsByTagName('h1')[0].style.flex = 1;
  gamePanelHeader.getElementsByTagName('a')[0].style.flex = 1;
  gamePanelHeader.getElementsByTagName('p')[0].style.flex = 1;
}

$('#newGameBtn').click(function() {
  newGame();
});

var documentWidth = isInMicroApp ? 0 : window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.123 * documentWidth;
var cellSpace = 0.026 * documentWidth;
var flag = true;

function newGame(){
	documentWidth = document.getElementById('gamePanel').clientWidth;
	gridContainerWidth = 0.92 * documentWidth;
	cellSideLength = 0.123 * documentWidth;
	cellSpace = 0.026 * documentWidth;
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


function getPosTop(i, j){
	return cellSpace + i * (cellSideLength + cellSpace);
}
function getPosLeft(i, j){
	return cellSpace + j * (cellSideLength + cellSpace);
}
function getNumberBackgroundColor(number){
	return number == 1 ? '#d55336' : '#30a7c2';
}
function switchFld(a, b) {
	if (a < 0) {
		return false;
	}
	if (a >= 6) {
		return false;
	}
	if (b < 0) {
		return false;
	}
	if (b >= 6) {
		return false;
	}
	board[a][b] = 1 - board[a][b];
	return true;
}
function clicked(a, b) {
	if(!flag){
		return;
	}
	flag = false;
	if (switchFld(a, b)) {
		refreshUpPic(a, b, function(){
			if (switchFld(a - 1, b)) {
				refreshDownPic(a - 1, b);
			}
			if (switchFld(a + 1, b)) {
				refreshDownPic(a + 1, b);
			}
			if (switchFld(a, b - 1)) {
				refreshDownPic(a, b - 1);
			}
			if (switchFld(a, b + 1)) {
				refreshDownPic(a, b + 1);
			}
			score += 1;
			updateScore(score);
			OverTest();
		});
	}
}

function refreshUpPic(a, b, fn){
	var theNumberCell = $('#number-cell-' + a + '-' + b);
	theNumberCell.attr('date-bgnum',1 - theNumberCell.attr('date-bgnum'));
	theNumberCell.css({
		'background-color' :(theNumberCell.attr('date-bgnum') == 0 ? '#30a7c2' : '#d55336')
	});
	theNumberCell.addClass(theNumberCell.attr('date-bgnum') == 0 ? 'clickUpCellRTB' : 'clickUpCellBTR');
	setTimeout(function(){
		theNumberCell.removeClass(theNumberCell.attr('date-bgnum') == 0 ? 'clickUpCellRTB' : 'clickUpCellBTR');
		flag = true;
		fn();
	}, 400);
}

function refreshDownPic(a, b){
	var theNumberCell = $('#number-cell-' + a + '-' + b);
	theNumberCell.attr('date-bgnum',1 - theNumberCell.attr('date-bgnum'));
	theNumberCell.css({
		'background-color' :(theNumberCell.attr('date-bgnum') == 0 ? '#30a7c2' : '#d55336')
	});
	theNumberCell.addClass(theNumberCell.attr('date-bgnum') == 0 ? 'clickDownCellRTB' : 'clickDownCellBTR');
	setTimeout(function(){
		theNumberCell.removeClass(theNumberCell.attr('date-bgnum') == 0 ? 'clickDownCellRTB' : 'clickDownCellBTR');
	}, 500);
}

function refreshPic(a, b){
	var theNumberCell = $('#number-cell-' + a + '-' + b);
	theNumberCell.attr('date-bgnum',1 - theNumberCell.attr('date-bgnum'));
	// theNumberCell.css({
	// 	'background-color' :(theNumberCell.attr('date-bgnum') == 0 ? '#30a7c2' : '#d55336')
	// });
	theNumberCell.addClass('clickUpCellBTR');
}

function OverTest(){
	var flag = 0;
	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 6; j++){
			flag += parseInt($('#number-cell-' + i + '-' + j).attr('date-bgnum'));
		}
	}
	if(flag != 36){
		return;
	}
	alert('游戏结束');
	highScore = highScore + 1;
	setStorage();
	newGame();
}
function updateScore(score){
	$('#score').text(score);
	$('#highScore').text(highScore);
}

//获取本地存储
function getStorage(){
	return localStorage.getItem('coolfishstudio_xmlk');
}
//添加本地存储
function setStorage(){
	localStorage.setItem('coolfishstudio_xmlk', highScore);
}
