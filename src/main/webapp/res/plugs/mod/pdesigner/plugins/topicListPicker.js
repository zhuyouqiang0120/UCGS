/**
 * @author chasonx
 * 主题列表
 */
ChasonxTScaler.plugins("dataWidget",{
	text : '主题列表',
	classes : 'icon-library_books',
	eleType : 'div',
	css		: 'overflow:hidden;',
	dataType: 'Topics',
	hasData : true,
	attr	: {
		borderWidth : 1,
		width : 550,
		height : 450,
		fontAlign : 'left',
		fontColor : 'ffffff'
	},
	append : function(){
		var ele = this.creatEle();
			ele.setAttribute('style',this.getStyle());
		this.appendToDraw(ele);
	},
	data : function(data){
		var _length = this.config.itemSize,obj = this.$(this.config.id);
		var h = (1/_length).toFixed(3)*100;
		
		if(data != undefined){
			obj.innerHTML = '';
			data = this.getData(data)[this.config.dataType];
			_length = data.length;
		}
		
		var _this = this;
		for(var i = 0;i < _length;i ++){
			var item = document.createElement('a');
			item.setAttribute('style','position:relative;width:100%;height:'+ h +'%;text-align:'+ _this.config.attr.fontAlign +';vertical-align:middle;z-index:50;display:block;color: inherit;text-decoration: none;');
			item.setAttribute('idx',i);
			item.setAttribute('href','javascript:void(0)');
			item.setAttribute('ondragstart','return false');
			if(data != undefined){
				if(data[i] != undefined){ 
					item.innerHTML = data[i].Name;
					item.setAttribute('data',data[i].Id);
					item.setAttribute('previewurl',(data[i].PreviewUrl?data[i].PreviewUrl:'#'));
				}
				this.addEventHandler(item,'click',function(){_this.click(this);});
			}else{
				item.innerHTML = '节点' + (i + 1);
			}
			this.addEventHandler(item,'focus',function(){_this.focus(this);});
			obj.appendChild(item);
		}
	},
	click : function(_E){
		var _href = _E.getAttribute('previewurl');
		window.location.href = _href || '#';
	},
	focus : function(_E){
		var _TOP = _E.offsetTop;
		var _focusEle = document.getElementById(this.config.id + '_focus');
		if(_focusEle == null || _focusEle == undefined){
			_focusEle = document.createElement('div');
			_focusEle.setAttribute('id',this.config.id + '_focus');
			
			var _showf = false;
			if(this.config.attr.focuSrc != ''){
				_showf = true;
				_focusEle.style.backgroundImage = 'url('+ this.config.attr.focuSrc +')';
			}else if(this.config.attr.focusColor != ''){
				_showf = true;
				_focusEle.style.backgroundColor = '#' + this.config.attr.focusColor;
			}
			if(_showf){
				_focusEle.style.left = '0px';
				_focusEle.style.top = _TOP + 'px';
				_focusEle.style.height = this.config.attr.height/this.config.itemSize + 'px';
				_focusEle.style.width = this.config.attr.width + 'px';
				_focusEle.style.position = 'absolute';
				_focusEle.style.zIndex = '10';
				document.getElementById(this.config.id).appendChild(_focusEle);
			}
		}else{
			_focusEle.style.height = this.config.attr.height/this.config.itemSize + 'px';
			_focusEle.style.width = this.config.attr.width + 'px';
			_focusEle.style.top = _TOP + 'px';
		}
	}
});