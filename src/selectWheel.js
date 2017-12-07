/*
 * by F 
 * date 2015-07-02
 * version 1.0.0
 */
require('./style.css');
(function(){
	window.selectWheel = function(selecter, option){
		option = $.extend({
			page : 'body>.container',
			data : [
				{
					label : '省',
					value : require('./province.json')
				},
				{
					label : '市',
					value : require('./city.json')
				},
				{
					label : '区',
					value : require('./district.json')
				}
			],
			speed : 600,
			success : null
		}, option || {});
		
		var touchEvent = 'click';
		var o;
		var fn = {
			getData : function(index, callback){
				if(jQuery.isArray(option.data[index].value)){
					callback(option.data[index].value);
					return;
				};
				//callback(data);
				/**
				$.ajax({
					url: option.data[index].value,
					async:true,
					dataType: "json",
					cache:true,
					error: function(res){alert(option.data[index].value+"读取错误!");},
					success: function(data){
						callback(data);
					}
				});
				/**/
			},
			setData : function(index, data, pid){
				var html = '';
				for(var i=0; i<data.length; i++){
					if(data[i].pid == pid || pid == undefined){
						html += '<li data-id="' + data[i].id +'" data-pid="' + data[i].pid +'">' + data[i].name + '</li>';
					};
				};
				if(html == ''){fn.remove();return;};
				var li = $(html);
				o.ul.eq(index).html(li).nextAll().html('');
				li.on(touchEvent,function(e){
					e.preventDefault();
					o.selected[index] = $(this).text() || '';
					o.selected.splice(index+1,100);
					fn.goto(index+1, parseInt(  $(this).data('id')  ));
				});
			},
			goto : function(index, pid, back){
				index = index || 0;
				if(index == option.data.length || index < 0) {fn.remove();return;}
				o.attr('class','select-wheel select-wheel-active select-wheel-'+index);
				o.title.html(o.selected[index-1] || option.data[index].label);
				o.back.off().on(touchEvent,function(e){
					e.preventDefault();
					fn.goto(index-1, null, true);
				});
				if(!back){
					fn.getData(index, function(data){
						fn.setData(index, data, pid);
					});
				};
			},
			remove : function(){
				o.page.removeClass('select-wheel-page');
				o.window.scrollTop(o.scrollTop);
				o.attr('class','select-wheel');
				option.success && option.success(o.selected);
			},
			addCssSpeed : function (speed) {
				return {
					"-webkit-transition": "-webkit-transform " + speed + "ms",
					"-moz-transition": "-moz-transform " + speed + "ms",
					"-o-transition": "-o-transform " + speed + "ms",
					"transition": "transform " + speed + "ms"
				};
			},
			setup : function(){
				o.page.addClass('select-wheel-page');
				o.addClass('select-wheel-active');
				fn.goto();
			}
		};
		var ul = '';
		for(var i=0; i<option.data.length; i++){
			ul += '<ul class="select-wheel-ul-'+i+'"><span>加载中...</span></ul>';
		};
		o =  $('<div class="select-wheel">'+
					'<div class="select-wheel-inside">'+
						'<div class="select-wheel-header"><div class="select-wheel-back"></div><h1>'+option.data[0].label+'</h1></div>'+
						'<div class="select-wheel-body">'+ul+'</div>'+
					'</div>'+
			   '</div>').appendTo('body');
		o.window    = $(window);
		o.selecter  = $(selecter);
		o.page      = $('html');
		o.scrollTop = $(window).scrollTop();
		o.inside    = o.children();
		o.head      = o.inside.children().eq(0);
		o.back      = o.head.children().eq(0);
		o.title     = o.head.children().eq(1);
		o.body      = o.inside.children().eq(1);
		o.ul        = o.body.children();
		o.selected  = [];
		o.inside.css(fn.addCssSpeed(option.speed));
		o.body.css(fn.addCssSpeed(option.speed));
		o.selecter.on(touchEvent, fn.setup);
	};
})();