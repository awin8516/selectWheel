/**
 * by F 
 * date 2015-07-02
 * version 1.0.0
 */
require('./style.css');
const _$ = require('./fun.js');
/**/
// function require(url){
// 	var res;
// 	$.ajax({
// 		url: '../src/'+url.replace('./', ''),
// 		async:false,
// 		dataType: "json",
// 		cache:true,
// 		success: function(data){
// 			res = data;
// 		}
// 	});
// 	return res
// };
(function(){
	window.selectWheel = function(selecter, option){
		this.option = _$.extend({
			style : 'slide', //slide|gear
			datePicker : false,
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
			speed : 500,
			init : null,
			success : null
		}, option);
		var that = this;
		this.option.style = this.option.datePicker ? 'gear' : this.option.style;
		this.isgear = this.option.style == 'gear';
		this.touchEvent = 'click';
		this.setData = function(index, data, pid){
			var html = '';
			for(var i=0; i<data.length; i++){
				if(  data[i].pid == pid || (  !pid && !isNaN(pid) ) || that.option.datePicker   ){
					html += '<li '+(data[i].id? "data-id=" + data[i].id:'')+' '+(data[i].pid? "data-pid=" + data[i].pid:'')+' >' + data[i].name + '</li>';
				};
			};
			if(!that.isgear && html == ''){
				that.complete();
				return;
			};
			var space = that.isgear ? '<li class="space"></li><li class="space"></li><li class="space"></li>' : '';
			that.o.ul[index].innerHTML = space+html+space;
			that.o.ul[index].children = _$.children(that.o.ul[index]);
			that.o.ul[index].scrollTop = 0;
			that.isgear && that.gearTo(that.o.ul[index], 3);
			
		};
		this.goto = function(index, pid, back){
			if(that.isgear){
				if(index < 0 || index == that.option.data.length) return;
			}else{
				if(index < 0) {
					that.hide();
					return;
				}else if(index == that.option.data.length) {
					that.complete();
					return;
				};
			};
			that.o.element.className = that.o.elClass + ' select-wheel-show select-wheel-'+index;
			that.o.title.innerHTML = that.selected[index-1] || that.option.data[index].label;
			that.o.back.dataset.index = index-1;
			!back && that.option.data[index] && that.setData(index, that.option.data[index].value, pid);
		};
		this.addCssSpeed = function (speed) {
			return {
				"-webkit-transition": "-webkit-transform " + speed + "ms",
				"-moz-transition": "-moz-transform " + speed + "ms",
				"-o-transition": "-o-transform " + speed + "ms",
				"transition": "transform " + speed + "ms"
			};
		};
		this.triggerLi = function(_this){
			var selected = _$.children(_this.parentNode, '.selected');
			_$.removeClass('selected', selected);
			_$.addClass('selected', _this);
			var index = parseInt(_this.parentNode.dataset.index);
			that.selected[index] = _this.innerText || '';
			that.selected.splice(index+1,100);
			that.goto(index+1, parseInt(  _this.dataset.id  ));
		}
		this.getIndex = function(top){
			return Math.round(top/that.liHeight)+3;
		};
		this.gearTo = function(ul, index){
			var top = (index-3) * that.liHeight;
			top = top < 0 ? 0 : top > ul.scrollHeight-ul.clientHeight ? ul.scrollHeight-ul.clientHeight : top;
			_$.stop(ul);
			_$.animate(ul, {scrollTop : top}, 1);
			that.triggerLi(ul.children[index]);
		};
		this.show = function(){
			_$.addClass('select-wheel-active', that.o.html);
			_$.addClass('select-wheel-show', that.o.element);
			!that.liHeight && (that.liHeight = that.o.body.clientHeight/7);
			that.goto(0);
		};
		this.hide = function(){
			window.scrollTo(0,that.scrollTop);
			_$.removeClass('select-wheel-active', that.o.html);
			_$.removeClass('select-wheel-show', that.o.element);
			setTimeout(function(){
				that.o.element.className = that.o.elClass;
			}, that.option.speed);
		};
		this.complete = function(){
			that.hide();
			that.option.success && that.option.success(that.selected);
		};
		this.setDateValue = function(){
			var year = new Date().getFullYear();
			var label = ['年', '月', '日'];
			var start = [1990, 1, 1];
			var end = [year,12, 31];
			for(var i=0; i<3; i++){
				that.option.data[i].label = label[i];
				that.option.data[i].value = [];
				for(var m=start[i]; m<=end[i]; m++){
					that.option.data[i].value.push({name:m+label[i]});
				};
			};
		};
		this.init = function(){
			var html =  '<div class="select-wheel select-wheel-style-'+that.option.style+'">'+
							'<div class="select-wheel-inside">'+
								'<div class="select-wheel-header"><div class="select-wheel-back" data-index="-1"></div><div class="select-wheel-cancel"></div><h1 class="select-wheel-title">'+that.option.data[0].label+'</h1><div class="select-wheel-confirm"></div></div>'+
								'<div class="select-wheel-body">';
								for(var i=0; i<that.option.data.length; i++){
									html += '<ul class="select-wheel-ul-'+i+'" data-index="'+i+'"></ul>';
								};
								html +='</div>'+
							'</div>'+
						'</div>';
			
			that.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			that.selected  = [];
			that.o = {};
			that.o.html    = _$.getElement('html')[0];
			that.o.element = _$.elem(html)[0];
			that.o.elClass = that.o.element.className;
			that.o.selecter= _$.getElement(selecter)[0];
			that.o.inside  = _$.children(that.o.element)[0];
			that.o.header  = _$.children(that.o.inside)[0];
			that.o.back    = _$.children(that.o.header)[0];
			that.o.cancel  = _$.children(that.o.header)[1];
			that.o.title   = _$.children(that.o.header)[2];
			that.o.confirm = _$.children(that.o.header)[3];
			that.o.body    = _$.children(that.o.inside)[1];
			that.o.ul      = _$.children(that.o.body);
			_$.append(that.o.element, document.body||document.documentElement);			
			_$.css(that.o.element, {'transition-delay':that.option.speed+'ms'});
			_$.css(that.o.inside, that.addCssSpeed(that.option.speed));
			_$.css(that.o.body, that.addCssSpeed(that.option.speed));
			/**/
			_$.addEvent(that.o.selecter, that.touchEvent, that.show);
			_$.addEvent(that.o.back, that.touchEvent, function(){
				that.goto(this.dataset.index, null, true);
			});
			_$.addEvent(that.o.cancel, that.touchEvent, that.hide);
			_$.addEvent(that.o.confirm, that.touchEvent, that.complete);			
			_$.addEvent(that.o.element, that.touchEvent, function(e){
				 e.preventDefault();
				 if( _$.target(e) == this){
				 	that.hide();
				 };
			});
			_$.addEvent(that.o.ul, that.touchEvent, function(e){
				e.preventDefault();
				var _this = _$.target(e);
				if(_this.tagName == 'LI' && _this.className != 'label' && _this.className != 'space'){
					that.triggerLi(_this);
				}
			});
			
			that.isgear && _$.addEvent(that.o.ul, 'touchend', function(e){
				var _this = this;
				_$.onScrollEnd(_this, function(){					
					var index = that.getIndex(_this.scrollTop);
					that.gearTo(_this, index);
				})
			});

			this.option.datePicker && this.setDateValue();
			
			that.option.init && that.option.init();
		};
		this.init();
	};
})();