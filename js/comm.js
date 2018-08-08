// loading...
function load() {
	var imgPath = "images/";
	var sourceArr = ['bg_activity.jpg', 'bg_index.jpg', 'bg_other.jpg', 'activity_task_btn01.png', 'activity_task_btn02.png', 'activity_task_btn03.png', 'activity_task_btn04.png', 'bg_pop01.png', 'bg_pop02.png', 'bg_pop03.png', 'bg_pop04.png', 'center_top.jpg', 'error_bg.png', 'flower.png', 'flower_state01.png', 'flower_state02.png', 'flower_state03.png', 'flower_state04.png', 'flower_state05.png', 'flowerpot.png', 'gain_flower.png', 'icon_arrows.png', 'icon_sprite.png', 'load_bg.jpg', 'share_prompt.png', 'theme_index.png'];
	for (var i = 0; i < sourceArr.length; i++) {
		sourceArr[i] = (imgPath + sourceArr[i]);
	}
	function loadImage(path, callback){
		var img = new Image();
		img.onload = function(){
			img.onload = null;
			callback(path);
		};
		img.src = path;
	};
	function imgLoader(imgs, callback){
		var len = imgs.length, i = 0;
		while(imgs.length){
			loadImage(imgs.shift(), function(path){
				callback(path, ++i, len);
			});
		}
	};
	imgLoader(sourceArr, function(path, curNum, total){
		var percent = curNum/total;
		var proBar = $('.loaded-info');
		var proNum = $('.loaded-num');
		proNum.text(Math.floor(percent * 100) + '%');
		proBar.css('width', Math.floor(percent * 100) + '%');
		if(percent == 1) {
			setTimeout(function(){
				$('.loaded-box').addClass('dn').siblings('.index-btn').removeClass('dn');
				pageInit();
			}, 500);
		}
	});
};


function pageInit() {
	var bodyObj = $(document.body);
	var pageObj = $('.page-info');
	var bodyH = bodyObj.outerHeight();
	var pageH = pageObj.outerHeight();
	if(pageH > bodyH) {
		var zoom = bodyH / pageH;
		pageObj.css({'transform': 'scale('+ zoom +')', '-webkit-transform': 'scale('+ zoom +')'})
	}


	/*$(".prize-start").bind('click', drawPrize);*/
	/*$("#bigDraw").bind('click', draw);*/
	

	// 关闭弹窗
	$('.close-btn').on('click', function() {
		var _this = $(this);
		_this.parents('.pop-box').addClass("dn");
	});
}

// 自制滚动条
function scrollInit(json) {
	var scrollObj = json.object;
	var parentObj = scrollObj.parent();
	var planObj = parentObj.find('.scroll-plan');
	var planItemObj = planObj.find('i');
	var scrollH = scrollObj.outerHeight();
	var parentH = parentObj.outerHeight();
	var planH = planObj.outerHeight();
	var planItemH = 0;
	var movePar = 1;

	// if(scrollObj.attr('data-scroll')) return;
	// scrollObj.attr('data-scroll', 1);

	if(scrollH <= parentH) return;

	scrollObj.css({'padding-right': '45px', 'top': 0}).attr('data-top', 0);
	planObj.show();
	scrollH = scrollObj.outerHeight();
	
	planItemH = parentH / scrollH * planH;
	planItemObj.css({'height': planItemH, top: 0}).attr('data-top', 0);

	var startTop = 0, endTop = 0;
	var scrollTop;
	scrollObj.unbind().on('touchstart', function() {
		event.preventDefault();
		var touch = event.touches[0];
		startTop = touch.pageY;
		scrollTop = $(this).attr('data-top') ? parseInt($(this).attr('data-top')) : 0;
		movePar = 1;
	});
	scrollObj.on('touchmove', function() {
		event.preventDefault();
		var touch = event.touches[0];
		var _this = $(this);
		endTop = touch.pageY;

		scrollTop += (endTop - startTop) * movePar;
		if(scrollTop >= 0) {
			scrollTop = 0;
		}
		if(scrollTop <= parentH - scrollH) {
			
			if(json.moveEvent && typeof json.moveEvent == 'function' && !_this.attr('data-move')) {
				movePar = .05;
				if((parentH - scrollH) - scrollTop >= 5) {
					json.moveEvent();

					_this.attr('data-move', 1);
					scrollH = scrollObj.outerHeight();
					parentH = parentObj.outerHeight();
					planH = planObj.outerHeight();
					planItemH = parentH / scrollH * planH;
					planItemObj.css({'height': planItemH});

					movePar = 1;
				}

				
			} else {
				scrollTop = parentH - scrollH
			}
		} else {
			movePar = 1;
		}
		
		$(this).css({'top': scrollTop}).attr('data-top', scrollTop);
		planItemObj.css({'top': -scrollTop / scrollH * planH}).attr('data-top', -scrollTop / scrollH * planH)

		startTop = endTop;
	});
	scrollObj.on('touchend', function() {
		event.preventDefault();
		var _this = $(this);
		if(movePar != 1) {
			movePar = 1;
			scrollTop = parentH - scrollH;
			$(this).css({'top': scrollTop}).attr('data-top', scrollTop);
		}
	});

	planItemObj.unbind().on('touchstart', function() {
		event.preventDefault();
		var touch = event.touches[0];
		startTop = touch.pageY;
		scrollTop = $(this).attr('data-top') ? parseInt($(this).attr('data-top')) : 0;
	});

	planItemObj.on('touchmove', function() {
		event.preventDefault();
		var touch = event.touches[0];
		endTop = touch.pageY;

		scrollTop += endTop - startTop;
		if(scrollTop <= 0) {
			scrollTop = 0;
		}
		if(scrollTop >= planH - planItemH) {
			scrollTop = planH - planItemH
		}
		planItemObj.css({'top': scrollTop}).attr('data-top', scrollTop);
		scrollObj.css({'top': -scrollTop / planH * scrollH}).attr('data-top', -scrollTop / planH * scrollH)

		startTop = endTop;
	});
}

// 活动页倒计时事件
var t;
function startTime(obj, time, fun) {
	var timeArr = time.split(':');
	var timeH = parseInt(timeArr[0]);
	var timeM = parseInt(timeArr[1]);
	var timeS = parseInt(timeArr[2]);
	obj.html(time);
	if(t) {
		clearInterval(t);
	}
	t = setInterval(function() {
		timeS --;
		if(timeH == 0 && timeM == 0 && timeS == 0) {
			clearInterval(t);
			if(fun) {
				fun();
			}
		} else {
			if(timeS < 0) {
				timeM --;
				timeS = 59;
				if(timeM < 0) {
					timeH --;
					timeM = 59;
				}
			}
		}
		obj.html(numShow(timeH) + ':' + numShow(timeM) + ':' + numShow(timeS));
	}, 1000);
}
function numShow(n) {
	var num = parseInt(n);
	if(num < 10) {
		num = '0' + num;
	}
	return num;
}