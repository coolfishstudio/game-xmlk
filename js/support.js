var documentWidth = window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.123 * documentWidth;
var cellSpace = 0.026 * documentWidth;
var flag = true;


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