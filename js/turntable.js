require({
	paths: {
		'jquery': 'libs/jQuery.2.1.3.min',
		"flexible": "libs/flexible"
	},
	shim: {
		flexible: {
			deps: ['jquery']
		},
		rotate: {
			deps: ['jquery']
		}
	}
}, ['jquery', 'flexible'], function ($) {


	/**
	 * 使用css3的动画效果
	 * 参考：https://github.com/daneden/animate.css
	 * 使用方式：$('#yourElement').animateCss('bounce');
	 */
	$.fn.extend({
		animateCss: function (animationName, callback) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function () {
				if (callback) {
					callback(animationName);
				}
			});
		}
	});

	/**
	 *
	 * 方法执行中，解析出了问题
	 *
	 * @return {[type]}                       [description]
	 */
	$(function () {
		init();
	});
	/**
	 * 初始事件
	 */
	function init() {
		bindBtnEvnet();
		bindAlertBtn();
	}
	function bindAlertBtn() {
		$(".dist-alert-btn").on("click", function () {
			$("#dist-alert-wrap").hide();
		})
	}

	/**
	 * 点击按钮的事件
	 * @return {[type]} [description]
	 */
	function bindBtnEvnet() {
		$("#dist-ground-btn").on("click", function () {
				getPrizeData(function (data) {
					rotateDiskFn($("#disk-ground"), data);
				})
		})
	}
	/**
	 * 旋转转盘
	 * @param  {[type]} $obj  [转盘的外框]
	 * @param  {[type]} angle [旋转的角度]
	 *
	 * 启动转盘的旋转
	 */
	function rotateDiskFn($obj, prizeDate) {
		var angle = prizeDate[0];
		$(".dist-group-content-selected").hide();
		$obj.animateCss("rotate-animate-" + angle, function (animationName) {
			rotateAnimate($obj, angle);
			$obj.removeClass('animated ' + animationName);
			$(".dist-group-content-selected").show().animateCss("flash", function () {
				//连着使用
				$("#dist-alert-wrap").show().find("#dist-alert-content-p").text('中奖了');
				$(".dist-content-alert").animateCss("zoomIn", function () {
					$(".dist-content-alert").removeClass('animated zoomIn')
				});
				$(".dist-group-content-selected").removeClass('animated flash');
			});

		})
	}
	//旋转角度
	function rotateAnimate($obj, deg) {
		$obj.css({
			"transform": "rotate(" + deg + "deg)",
			"transform-origin": "50% 50% 0px"
		});

	}
	/**
	 * 获得商品
	 * 后台请求获得中奖的id，回调中设置对应的角度
	 */
	function getPrizeData(callback) {
		var degArr = ["0", "315", "270", "225", "180", "135", "90", "45"];
		var index = Math.ceil(Math.random() * 8)
		callback([degArr[index]]);
	}

})