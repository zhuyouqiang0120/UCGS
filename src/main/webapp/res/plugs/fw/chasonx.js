/*                                             
            .rrrsrssrsrrii;:.                     
           .8A&GG8898999999993S5s:                
           ;XGGGGG8889889999999999h.              
           ;XXXXXG888888889898888981              
           iXXXXXGGGG888888888889883.             
           rXXX&XXXXGGGGG88888898888;              
           1&XXX&XXGGG8G88888G898898h     ,ih3889;     天下风云出我辈，一入江湖岁月催，
           h&XXXXX&XGGG88GGGG8GG88889. ;h9X&A&&&H9     皇图霸业谈笑中，不胜人生一场醉。
  .,:;;;;:,9&AAA&X&&GGXGGGGX&GGXXGG8838&A&XXXXX&B1     提剑跨骑挥鬼雨，白骨如山鸟惊飞，
h5998888888&&AA&&&&&XXXGGXXXXXGGGGX&AA&&&X&&&&HBS      尘事如潮人如水，只叹江湖几人回。
89993933338XXXGGXGGG8898888998GXABMMMBHAAAHBBBXs    
9399333399888G888888888888GGXAM##M##MBBM#MHXS;     
9399998888G88888888888GGXXXX89GAHBBMBBA3hi,        
  9898888988899888GGXXXX&&&AG93S5S9HMH8S            
 	G8GG8GXXXXXX&AAA&88G&&&X899351s9BG95              
      33S51s8XX&&X&X33398933S55h1s3X55;           
            h8GGG8G9SS33333S5hhh1r983r            
            :39889955S533SS5h111ssGBG,            
             i39889S3333SS5h11ssi39s,             
              s999883333SS5h11si1Xs               
               h8GXXXGG8935h1srhXS1:              
                1998893S555h113XSh
                .s9999SS55hh3G855
          		 3S93S38G8S555
           		  :13;SX&XG                         
*/          						

/**
*   createTime : 2014/10/17
*   updateTime : 2015/04/28 11：10
*				 修改Chasonx.Hide(o,options) bug
*     			 修改 更改每页显示数时loading图闪多次的bug 
*     			 修改拖动时乱跳选中元素bug
*     			 修改遮罩层层级bug
*   updateTime : 2015/04/29 16：10 增加右键菜单方法
*   updateTime : 2015/05/05 13：25 修改alert文本提示
*   updateTime : 2015/05/12 12:32 更新 Chasonx.Hint提示框样式
*	updateTime : 2015/06/05 18:14 修改Dialog拖动体验问题，拖动时body不可选择
*   updateTime : 2016/10/26 ajax增加支持数组参数
*	updateTime : 2017/07/04 增加Chasonx.Hint.Footer();
*   updateTime : 2017/11/2  增加CopyObject方法
*	author	   : chason.x
*	email      : zuocheng911@163.com
*   remark     : work tools
*/

function Chasonx(options){
	if(typeof options == "undefined") return this;
    return this.Dialog(options);
}

/*
*Alert Box
*/
Chasonx.Alert = function(options){

	options = options || {};
	options.width = options.width || 330;
	options.height = options.height || 180;
	options.html = options.html || '确定执行该操作吗？';
	options.alertType = options.alertType || 'normal';
	options.icon = options.icon || null;

	if(typeof(options.alertType) == 'string'){
		var leftstyle = 'width:80px;text-align:center;font-size:40px;font-weight:bold;position: relative;top: 50%;transform: translateY(-50%);display: inline-block;',
		    rightstyle = 'width:' + (options.width - 100) + 'px;overflow:hidden;display: inline-block;position: absolute;top: 50%;transform: translateY(-50%);color : #f6f6f6;font-size : 16px;',
		    leftHtml = '',
		    rightHtml = '<div style="'+ rightstyle +'">'+ options.html +'</div>';
		if(options.alertType == 'normal') leftHtml = '<div style="'+ leftstyle + 'color:#26A2E8;' + '">'+ (options.icon || '？') +'</div>';
		else if(options.alertType == 'warning') leftHtml = '<div style="'+ leftstyle + 'color:#EF7107;' + '">'+ (options.icon || '！') +'</div>';
		else if(options.alertType == 'error') leftHtml = '<div style="'+ leftstyle + 'color:#FF3333;' + '">'+ (options.icon || '×') +'</div>';

		options.html = leftHtml + rightHtml;
	}
	return new Chasonx(options);
};

/**
*绑定dom右键菜单
*/
Chasonx.ContextMenu = {
	_this : null,
	_panel : null,
	attr : {
		css : {
			items : 'width:200px;height:auto !important;min-height:30px;background-color:#4A4242;margin-top: 50px;margin-left: 50px;padding:2px;\
					 border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;-moz-border-radius: 2px; -webkit-border-radius: 2px;font-size:10px;\
					 border-radius: 2px;position: absolute;z-index:9999;moz-user-select: -moz-none; -moz-user-select: none; -o-user-select:none;-khtml-user-select:none;\
					 -webkit-user-select:none;-ms-user-select:none;user-select:none;opacity:0;',
  			item : 'height:30px;vertical-align: middle;line-height: 30px;border:1px solid #4A4242;color:#0CBECD;cursor:default;',
  			itemhover : 'border:1px solid #14BED3;position: relative;z-index:10015;background-color:#5C5555',
  			icon : 'width:18%;height:32px;float: left;border-right:1px solid #575556;position: relative;z-index:10000;text-align:center;',
  			text : 'width:78%;height:30px;vertical-align: middle;line-height: 30px;float: left;padding-left: 2%;overflow: hidden;',
  			hr 	 : 'width:78%;border-top: 1px solid #575556;position: relative;margin-left: 18%;z-index: 9999;'		
		}
	},
 	init : function(options){
		if(!options.id) return ;
		var container = $e(options.id), E , X ,Y;	
		var _this = this,winSize = ChasonTools.getWindowSize();
		container.oncontextmenu = function(e){return false;};

		var _items = options.items || [];
		var _id = null;
		this._this = new Chasonx();
		ChasonTools.addEventHandler(container,'mouseup',function(){

			E = window.event || event;
			if(E.button == 2){
				var mouse = _this.mouseCoords(E);
				X = (mouse.x - 50);
				Y = (mouse.y - 50);
				
				if((winSize[2] - X) < 200) X -= 200;

				_id = "_chasonxContextMenuPanel_" + options.id;
				var items = $e(_id),item;
				if(items == null){
					items = ChasonTools.createEle({type:'div',css:_this.attr.css.items + 'left:' + X + 'px;top:' + Y + 'px;'});
					items.setAttribute('id','_chasonxContextMenuPanel_' + options.id);

					items.oncontextmenu = function(){return false;};
					for(var i = 0,len = _items.length;i < len;i++){
						if(_items[i].hr){
							item = ChasonTools.createEle({type:'div',css:_this.attr.css.hr});
						}else{
							item = ChasonTools.createEle({type:'div',css:_this.attr.css.item});
						 	item.innerHTML =  '<div style="'+ _this.attr.css.icon +'">'+ (_items[i].icon || '') +'</div><div style="'+ _this.attr.css.text +'">'+ _items[i].text +'</div>';
							ChasonTools.addEventHandler(item,'mouseover',function(){	
								this.setAttribute('style', _this.attr.css.item + _this.attr.css.itemhover);
							});
							ChasonTools.addEventHandler(item,'mouseout',function(){
								this.setAttribute('style', _this.attr.css.item);
							});
							ChasonTools.addEventHandler(item,'click',_items[i].todo);
						} 
						items.appendChild(item);
					}
					ChasonTools.AppendToBody(items);
				}else{
					items.style.display = 'block';
					items.style.left = X + 'px';
					items.style.top = Y + 'px';
				}
				_this._this.Show(items);
				_this._panel = items;
			}else{
				var hid = true,target = E.target;
				while(target){
					if(target.id == _id){
						hid = false;
						target = null;
					}else{
						target = target.parentNode;
					}
				}
				if(hid) _this.Hide();
			}
		});
		return _this;
	},
	Hide : function(){
		this._this.Hide(this._panel);
	},
	mouseCoords : function(ev){
		if(ev.pageX || ev.pageY){ 
			return {x:ev.pageX, y:ev.pageY}; 
		} 
		return { 
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
			y:ev.clientY + document.body.scrollTop - document.body.clientTop 
		}; 
	}
};

/**
*Hint Box 结果提示框
*options{title,text,type,timeout}
*/
Chasonx.Hint = {
	options : {width:200,height:100,modal:false,isdialog:false,hor:150,timeout:3000},
	css : {
		sucs   : 'position:fixed;z-index:1024;width:260px;height:auto !important;right:40%;opacity:0;top:0px;padding: 30px;\
			      border-radius:5px;user-select:none;',
	    sta    : 'width:60px;height:48px;color:#fff;font-size:30px;text-align:center;font-weight:bold;position: absolute;  top: 50%; transform: translateY(-50%);  display: inline-block;',
	    text   : 'width:200px;height:auto !important;font-size:18px;color:#FFF;position:relative;left : 60px;text-align:center;',
	    foot   : 'position:relative;display:inline-block;overflow:hidden; white-space: nowrap; box-shadow: 0px 0px 10px #545050;-moz-box-shadow: 0px 0px 10px #545050;-webkit-box-shadow: 0px 0px 10px #545050;padding:5px;',
	    footBox: 'position:fixed;z-index:1024;bottom:0px;right:0px;width:auto !important;height:auto !important;'	
	},
	Success : function(options){
		options = options || {};
		var height = ChasonTools.getWindowSize()[3] / 2;
		this.options.hor =  100;//options.hor || (height > 150 ? height - 200 : height);
		this.options.timeout = options.timeout || this.options.timeout;
		this.options.html = typeof(options) == "string"?options:options.text || 'success!';
		this.show(this.options,'success');
	},
	Faild : function(options){
		var height = ChasonTools.getWindowSize()[3] / 2;
		this.options.hor = 100; //options.hor || (height > 200 ? height - 200 : height);
		this.options.timeout = options.timeout || this.options.timeout;
		this.options.html = typeof(options) == "string"?options:options.text || 'faild!';
		this.show(this.options,'faild');
	},
	/**
	*@options: {width:100,height : 100,color : '',bg : '',content : '',timeout : ''}
	*/
	_FOOT_PANEL : null,
	Footer : function(_opt){
		_opt = _opt || {};
		var opt = {};
		with(this){
			opt.width = _opt.width || 245;
			opt.height = _opt.height || 135;
			opt.color = _opt.color || '#000000';
			opt.bg = _opt.bg || '#f6f6f6';
			opt.timeout = _opt.timeout || options.timeout;
			opt.content = typeof(_opt) == "string"?_opt:_opt.content || 'show content';
			var _css = [];
			_css.push(css.foot);
			_css.push('width:' + opt.width + 'px;');
			_css.push('height:' + opt.height + 'px;');
			_css.push('background-color:' + opt.bg + ';');
			_css.push('color:' + opt.color + ' !important;');

			if(_FOOT_PANEL == null){
				var _fb = ChasonTools.createEle({type:'div',css : css.footBox});
				ChasonTools.AppendToBody(_fb);
				_FOOT_PANEL = _fb;
			}

			var _f = ChasonTools.createEle({type : 'div',css : _css.join('')});
			_f.innerHTML = opt.content;
			_FOOT_PANEL.appendChild(_f);
			opt.ele = _f;

			var handler =  new footHandler(_FOOT_PANEL);
			handler.show(opt).hide(opt);
		}
	},
	show : function(_option,type){
		var statetxt  = type == 'success'?'√':'×',bg = type == "success"?'background:#2b93d2;':'background:rgb(237, 102, 102);';
		var ele = ChasonTools.createEle({type:'div',css:this.css.sucs + bg});
			ele.innerHTML = '<div style="'+ this.css.sta +'">'+ statetxt +'</div><div style="'+ this.css.text +'">'+ this.options.html +'</div>';
		ChasonTools.AppendToBody(ele);
		var _chasonx = new Chasonx();
		_chasonx.Show(ele,_option);
		_chasonx.Hide(ele,_option);
	},
	footHandler : function(_Panel) {
		return {
			T : 0, B : 0,D : 80,
		    show :  function(options){
				with(this){
					var timer,loop = function(){
						options.ele.style.width = TwBounce.base(T,B,options.width,D) + 'px';
						 T ++;
						 timer = setTimeout(function(){
						 	loop(); 
						 	if(T > D) clearTimeout(timer); 	
						 },6);
					};
					loop();
			    }
			    return this;
			},
			hide : function(_opt){
				with(this){
					var  timer,loop = function(){
						 _opt.ele.style.width = (_opt.width + TwBounce.base(T,B,-_opt.width,D)) + 'px';
						 T ++;
						 
						 timer = setTimeout(function(){
						 	loop();
						 	if(T > D){
						 		clearTimeout(timer);
						 		_Panel.removeChild(_opt.ele);
						 	} 					 	
						 },6);
					};
					setTimeout(function(){
						T = 0;
						B = 0;
						D = 80;
						loop();
					},_opt.timeout);
				}
			}
		};
	}
};



/**
*Wait Box
*/
Chasonx.Wait = {
	ele  : null,
	options:{},
	_this: null,
	waitImg : 'data:image/gif;base64,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',
	style:'width:auto !important;min-width:240px;font-size:14px;height:60px;position:absolute;z-index:1048;opacity:0;background-color:#f6f6f6;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;',
	lStyle:'width:50px;height:32px;float:left;font-size:4px;text-align:center;overflow:hidden;position:relative;top:13px;',
	rStyle:'width:auto !important;min-width:170px;height:58px;float:left;text-align:left;overflow:hidden;vertical-align:middle;line-height:60px;padding-right:5px;',
	Show : function(text){
		if(this.ele != null) return;
		
		this._this = new Chasonx(),bSize = ChasonTools.getWindowSize();
		this.ele = ChasonTools.createEle({type:'div',css:this.style});
		this.ele.style.top = (bSize[3] - 60)/2 + 'px';
		this.ele.style.left = (bSize[2] - 240)/2 + 'px';

		var left = ChasonTools.createEle({type:'div',css:this.lStyle}),
			right = ChasonTools.createEle({type:'div',css:this.rStyle});

			left.innerHTML = '<img src="'+ this.waitImg +'" />';
			right.innerHTML = text || '请稍候...';

		ChasonTools.AppendToBody(this.ele);
		this.ele.appendChild(left);
		this.ele.appendChild(right);

		this.options.modal = this._this.CreateModal();
		this._this.Show(this.ele,this.options);
	},
	Hide : function(){
		if(this._this == null) return;
		this._this.Hide(this.ele,this.options);
		this.ele = null;
		this.options = {};
	}
};

/**
*Support Tips Box
*options {id,text,close,width,height,direction,arrow}
*/
Chasonx.Tips = {
	_this : null,
	attr : {
		ele : null,
		target : null,
		contentEle : null,
		tipText : '关闭',
		dWidth  : 200,
		dHeight : 90,
		arrowLeft : 'border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:12px solid rgb(0,0,0); line-height:0px;',
		arrowRight: 'border-top:10px solid transparent;border-bottom:10px solid transparent;border-right:12px solid rgb(0,0,0); line-height:0px;',
		arrowTop : 'border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:12px solid rgb(0,0,0); line-height:0px;width:0px;',
		arrowBottom:'border-left:10px solid transparent;border-right:10px solid transparent;border-top:12px solid rgb(0,0,0); line-height:0px;width:0px;',
		style   : {
			tm : 'position:fixed;z-index:1024;opacity:0;',
			ti : 'height:15px;',
			conb: 'overflow:hidden;;background-color:#000;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;',
			con: 'font-size:14px;color:#f6f6f6;padding:0px 5px 0px 5px;word-break:break-all;word-wrap : break-word;',
			fo : 'width:100%;height:15px;position:relative;z-index:1025;overflow:hidden;',
			clo: 'cursor: pointer;text-decoration: none;top:-4px;right:1px;position:relative; color: #ffffff; display: inline-block; background: #923838; width: 15px; height: 15px; vertical-align: middle;line-height: 12px;border-radius: 8px;-moz-border-radius: 8px;-webkit-border-radius: 8px; text-align: center;'
		}
	},
	Move : function(options){
		options = options || {};
		if(!options.id) return;

		options.close = false;
		var target = $e(options.id),_this = this,_ele = null;
		if(window.addEventListener){
			target.addEventListener('mouseover',function(){ _ele = _this.Show(options); },false);
			target.addEventListener('mouseout',function(){ _this.Hide(_ele.attr.ele,target); },false);
		}else {
			 target.attachEvent('onmouseover' ,function(){ _ele = _this.Show(options);});
			 target.attachEvent('onmouseout', function(){ _this.Hide(_ele.attr.ele,target);});
		}
	},
	Show : function(options){
		options = options || {};
		if(!options.id) return;

		options.width = options.width || this.attr.dWidth;
		options.height = options.height || this.attr.dHeight;
		options.direction = options.direction || 'top';
		options.close = options.close == undefined?true:options.close;
		options.arrow = options.arrow || null;

		var _target = null;
		if(typeof(options.id) == 'string') _target = $e(options.id);
		else if(typeof(options.id) == 'object') _target = options.id;
		
		if(_target.getAttribute('tips')) return ;

		var _tSize = ChasonTools.getObjectSize(_target);
		var tip = ChasonTools.createEle({type:'div',css:this.attr.style.tm}),
			title = ChasonTools.createEle({type:'div',css:this.attr.style.ti + (options.direction == 'left'?'text-align:left;':'text-align:right;')}),
			conb  = ChasonTools.createEle({type:'div',css:this.attr.style.conb}),
			con = ChasonTools.createEle({type:'div',css:this.attr.style.con});
			foot = ChasonTools.createEle({type:'div',css:this.attr.style.fo});

			tip.style.width = options.width + 'px';
			tip.style.height = options.height + 'px';
			con.innerHTML = options.text || '提示';
			this.attr.contentEle = con;

		//check direction
		var _bSize = ChasonTools.getWindowSize(),_direction = options.direction;
		if(_tSize[2] < options.width) _direction = 'right';
		if((_bSize[2] - (_tSize[2] + _tSize[0])) < options.width) _direction = 'left';
		if(_tSize[3] < options.height) _direction = 'bottom';
		if((_bSize[3] - (_tSize[3] + _tSize[1])) < options.height) _direction = 'top';

		if(_direction == 'top' || _direction == "bottom"){
			var _leftPx = _tSize[2];
			
			if((_bSize[2] - (_tSize[2] + _tSize[0])) < options.width){
				_leftPx = _tSize[2] - (options.width - _tSize[0]);
			}
			if(options.arrow != null && options.arrow == "left")
				_leftPx = _tSize[2] - (options.width / 2);
			else if(options.arrow != null && options.arrow == "right")
				_leftPx = _tSize[2] + (_tSize[0] - (options.width/2));
			
			tip.style.left = _leftPx + 'px';
			tip.style.top = (_direction == 'top'?_tSize[3] - options.height:_tSize[3] + _tSize[1]) + 'px';
			
			conb.style.height = (options.height - 15) + 'px';
			con.style.height = (options.height - 30) + 'px';

			ChasonTools.AppendToBody(tip);
			
			var _arrowMarginLeft = _tSize[0] > 0 && _tSize[0] < options.width? _tSize[0]/3:(options.width - 20)/2; 
			if(_direction == 'top'){
				foot.style.marginTop = '-1px';
				foot.innerHTML = '<div style="'+ this.attr.arrowBottom +';margin-left:'+ _arrowMarginLeft +'px;"></div>';
				tip.appendChild(conb);
				tip.appendChild(foot);
				conb.appendChild(title);
				conb.appendChild(con);
			}else{
				conb.style.marginTop = '-4px';
				foot.innerHTML = '<div style="'+ this.attr.arrowTop +';margin-left:'+ _arrowMarginLeft +'px;"></div>';
				tip.appendChild(foot);
				tip.appendChild(conb);
				conb.appendChild(con);
				conb.appendChild(title);
			}
		}else if(_direction == 'left' || _direction == 'right'){
			tip.style.left = (_direction == 'left'?_tSize[2] - options.width:_tSize[2] + _tSize[0]) + 'px';
			tip.style.top = (_tSize[3] - Math.abs(options.height - _tSize[1])/2) + 'px';
			conb.style.float = 'left';
			conb.style.marginRight = '-1px';
			conb.style.width = (options.width - 20) + 'px';
			conb.style.height = options.height + 'px';
			con.style.width = (options.width - 20) + 'px';
			con.style.height = (options.height - 15) + 'px';
			foot.style.float = 'left';
			foot.style.width = '15px';
			foot.style.height = options.height + 'px';
			foot.style.paddingLeft = '0px';
			foot.style.paddingTop = (options.height - 20)/2 + "px";

			ChasonTools.AppendToBody(tip);
			if(_direction == 'left'){
				foot.innerHTML = '<div style="'+ this.attr.arrowLeft +'"></div>';
				tip.appendChild(conb);
				conb.appendChild(title);
				conb.appendChild(con);
				tip.appendChild(foot);

				_closeAlign = 'left';
			}else{
				foot.style.marginRight = '-1px';
				foot.innerHTML = '<div style="'+ this.attr.arrowRight +'"></div>';
				tip.appendChild(foot);
				tip.appendChild(conb);
				conb.appendChild(title);
				conb.appendChild(con);
			}
		}
		if(options.close){
			var _cBtn = ChasonTools.createEle({type:'a',css: this.attr.style.clo});
			_cBtn.innerHTML = '×';
			_cBtn.setAttribute('title','关闭');
			title.appendChild(_cBtn);
			this.BindEvent(_cBtn,tip,_target);
		}else{
			conb.removeChild(title);
			//con.style.paddingTop = (options.height/2 - 10) + 'px';
		}	

		_target.setAttribute('tips','true');
		this._this = new Chasonx();
		this._this.Show(tip);
		this.attr.target = _target;
		this.attr.ele = tip;
		
		return this;
	},
	Hide : function(o,t){
		if(!o) o = this.attr.ele;
		if(!t) t = this.attr.target;
		t.removeAttribute('tips');
		return this._this.Hide(o);
	},
	RefreshText : function(text){
		this.attr.contentEle.innerHTML = (text != ''?text:this.attr.contentEle.innerHTML);
	},
	BindEvent : function(o,ele,target){
		var _this = this;
		if(window.addEventListener){
			o.addEventListener('click',function(){ _this.Hide(ele,target); },false);
		}else {
			 o.attachEvent('onclick' ,function(){ _this.Hide(ele,target);});
		}
	}
};
/**
*Support Drag
*O : 拖动目标，T : 移动目标
*/
Chasonx.Drag = function(O,T){
    T = T || O;
	O.onmousedown = function(evt){
		/*设置body未不可选择状态*/
		Chasonx.BodySelection(false);
		var d = document;
		var wsize = ChasonTools.getWindowSize();
		var osize = ChasonTools.getObjectSize(T);
         var page = {
         	 	 event : function(e){
         	 	 	return e || window.event;
         	 	 },
	             pageX: function (e) {
	             	 e = this.event(e);
	                 return e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
	             },
	             pageY: function (e) {
	             	 e = this.event(e);
	                 return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);

	             },
	             layerX: function (e) {
	             	 e = this.event(e);
	                 return e.layerX || e.offsetX;
	             },
	             layerY: function (e) {
	             	 e = this.event(e);
	                 return e.layerY || e.offsetY;
	             }
        };
        var x = page.layerX();
        var y = page.layerY();   
         if(O.setCapture) {
              O.setCapture();
        }else if(window.captureEvents) {
              window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        d.onmousemove = function (evt) {                    
             var tx = page.pageX(evt) - x;
             var ty = page.pageY(evt) - y;
             if(tx >= 0 &&  tx <= (wsize[2] - osize[0] ))  T.style.left = tx + "px";
             else if(tx > (wsize[2] - osize[0] )) T.style.left = (wsize[2] - osize[0] ) + "px";
             else T.style.left = "0px";
             if(ty >= 0 && ty <= (wsize[3] - osize[1] ))  T.style.top = ty + "px";
             else if(ty > (wsize[3] - osize[1] )) T.style.top = (wsize[3] - osize[1] ) + "px";
             else T.style.top = "0px";
        };
        d.onmouseup = function () {
             if(O.releaseCapture) {
                 O.releaseCapture();
             }else if (window.releaseEvents){
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
             }
             d.onmousemove = null;
             d.onmouseup = null;

             /*设置body为选中状态*/
             Chasonx.BodySelection(true);
		};
	};
};
/**
*设置body可选择
*/
Chasonx.BodySelection = function(B){
	var body = document.getElementsByTagName("body")[0];
	if(!B){
		body.setAttribute('style','moz-user-select: -moz-none;	-moz-user-select: none;	-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;');
	}else{
		body.removeAttribute('style');
	}
};

/**
*Chasonx prototype
*/
Chasonx.prototype = {
	targetEle : null,
	targetOption : null,
	attr : {
		close : '关闭',
		ok    : '确定',
		cancel: '取消',
		dWidth: 350,dHeight : 150,
		alertType : {normal:'#229ffd',warning:'#DF9118',error:'#ed6666'},
		alertText : {normal:'温馨提示',warning:'警告',error:'错误'},
		baseCss : 'border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;'
	},
	/**
	* Dialog Box
	* options {title:'标题',html:'<div></div>',width:200,height:100,modal:true,success:function(){},close:true,okText:'保存',cancelText:'关闭',alertType:'warning',cancel : false}
	*/
	Dialog : function(options){
		options = options || {};
		options.width = options.width || this.attr.dWidth;
		options.height = options.height || this.attr.dHeight;
		options.alertType = options.alertType || 'normal';
		options.cancel = (options.cancel == undefined?true:options.cancel);
		//isdialog
		if(options.isdialog == undefined)	options.isdialog = true;

		var bSize = ChasonTools.getWindowSize();
		options.hor = options.hor || (bSize[3] > 100?(bSize[3] - options.height)/4:0);
		options.ver = options.ver || (bSize[2] - options.width)/2;
		
		var mb = 'position:fixed;z-index:1024;width:'+ options.width +'px;height:'+ options.height +'px;opacity:0;background-color:#3e506f;left:'+ options.ver +'px;top:0px;\
				  box-shadow:4px 4px 10px #000;-moz-box-shadow:4px 4px 10px #000;-webkit-box-shadow:4px 4px 10px #000;overflow:hidden;\
				  -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;',
		    mt = 'height:40px;background-color:#3e506f;border-bottom:1px solid #364765;color:'+ this.attr.alertType[options.alertType] +';position:relative;',
		    mx = 'vertical-align:middle;line-height:40px;width:'+ (options.width - 50) +'px;font-size:15px;font-weight:bold;padding-left:8px;overflow:hidden;',
		    mc = 'display:block;height:'+ (options.isdialog?(options.height - (options.cancel == true?98:0)):options.height - 38) +'px;width:'+ options.width +'px;overflow:auto;position:relative;';
		   
		var _ele = ChasonTools.createEle({type:'div',css:mb}),
			_title = ChasonTools.createEle({type:'div',css:mt}),
			_titext = ChasonTools.createEle({type:'div',css:mx}),
			_con = ChasonTools.createEle({type:'div',css:mc});
			
			_titext.innerHTML = options.title || this.attr.alertText[options.alertType];
			_title.appendChild(_titext);
		    _con.innerHTML = options.html || '内容';	

		//background
		if(options.modal){
			options.modal = this.CreateModal();
			_titext.style.cursor = 'move';
			Chasonx.Drag(_titext,_ele);
		}	
		
		ChasonTools.AppendToBody(_ele);
		_ele.appendChild(_title);
		_ele.appendChild(_con);
		
		//isdialog box
		if(options.isdialog){
			var	 mf = 'display:block;height:60px;background-color:#3e506f;text-align:right;vertical-align:middle;line-height:60px;padding-right:10px;position:relative;',
			     cancel = 'position:absolute;min-width:60px;width:auto !important;height:30px;right:15px;top:15px;vertical-align:middle;line-height:30px;background-color:#bbb9b9;color:#6d6d6d;border:none;cursor:pointer;' + this.attr.baseCss,
			     close = 'position:absolute;text-decoration:none;font-weight:normal;right:10px;z-index:1025;top:10px;color:#fff;';

			     _foot = ChasonTools.createEle({type:'div',css:mf});
			     _cancelBtn = ChasonTools.createEle({type:'button',css:cancel});
			     _cancelBtn.innerHTML = options.cancelText || this.attr.cancel;
			     _close = ChasonTools.createEle({type:'a',css:close});
			     _close.innerHTML = this.attr.close;
				 _close.setAttribute('href','javascript:void(0)');
				 _close.setAttribute('title',this.attr.close);		

			     if( options.cancel == true ) _ele.appendChild(_foot);
			     _title.appendChild(_close);
			     
			     //if exist success function
				if(typeof options.success == 'function'){
					var	ok   = 'position:absolute;min-width:60px;width:auto !important;height:30px;padding:0px 4px;right:80px;top:15px;vertical-align:middle;line-height:30px;background-color:'+  this.attr.alertType[options.alertType] +';color:#FFF;border:none;cursor:pointer;' + this.attr.baseCss,
					   _okBtn = ChasonTools.createEle({type:'button',css:ok});
					   _okBtn.innerHTML = options.okText || this.attr.ok;
					   _foot.appendChild(_okBtn);

					this.BindEvent(_okBtn,{success:options.success,close:options.close||false,modal:options.modal || null},_ele);
				}else{
					_cancelBtn.innerHTML = this.attr.cancel;
				}
			   if(options.cancel == true)  _foot.appendChild(_cancelBtn);

			    this.BindEvent(null,{hide:[_close,_cancelBtn],modal:options.modal || null},_ele);
		}else{
			this.Hide(_ele,options);
		}
		this.targetEle = _ele;
		this.targetOption = options;
		this.Show(_ele,options);
	},
	CreateModal : function(){
		var _modal = ChasonTools.createEle({type:'div',css:'position:fixed;background-color:#000;z-index:1024;top:0px;left:0px;right:0px;bottom:0px;opacity:0;'});
		ChasonTools.AppendToBody(_modal);
		return _modal;
	},
	Show : function(o,options){
		options = options || {};
		this.FadeIn(o,options);
	},
	Hide : function(o,options){
		if(!o) o = this.targetEle;
		if(o == null) return;
		options = options || (this.targetOption != null?this.targetOption:{});
		var _this = this;
		options.timeout = options.timeout || 20;
		
		setTimeout(function(){
			_this.FadeOut(o,options,function(){
				ChasonTools.RemoveEle(o);
				if(options.modal && typeof(options.modal) == "object") ChasonTools.RemoveEle(options.modal);
			});
		},options.timeout);
	},
	/*
	*options{ver,hor,modal}
	*/
	FadeIn : function(o,options){
		var temp = 0,t = 0,b = 0,d = 80,opcity,timer = null;
		var exec = function(){
			if(o != null && typeof(o) == "object"){
				temp = TwBounce.easeOutElastic(t,b,options.hor,d);
				opcity = TwBounce.base(t,b,100,d)/100;
				if(temp) o.style.top = temp + 'px';
				o.style.opacity = opcity ;
			}
			if(typeof(options.modal) == "object")  options.modal.style.opacity = TwBounce.base(t,b,40,d)/100;
			t ++;
			timer = setTimeout(function(){
				exec();
				if(t > d) clearTimeout(timer);
			},6);
		};
		exec();
	},
	FadeOut : function(o,options,callBack){
		var t = 0,b = 0,d = 80,timer = null,ex = false,exm = false;
		var exec = function(){
			if(o.style.opacity == 1) ex = true;
			if(ex) o.style.opacity = 1 + TwBounce.base(t,b,-100,d)/100;
			if(options.modal && typeof(options.modal) == "object"){
				if(options.modal.style.opacity == 0.4) exm = true;
				if(exm) options.modal.style.opacity = 0.4 + TwBounce.base(t,b,-40,d)/100;
			}
			t ++;
			timer = setTimeout(function(){
				exec();
				if(t > d){
					clearTimeout(timer);
					if(typeof(callBack) == 'function') callBack();
				}
			},6);
		};
		exec();
	},
	BindEvent : function(obj,options,target){
		var _Lister = this;
		if(window.addEventListener){
			if(options.hide && options.hide.length > 0){
				for(var i = 0;i < options.hide.length;i++){
					options.hide[i].addEventListener('click',function(){ _Lister.Hide(target,options);},false);	
				}
			}
			if(obj){
			 	obj.addEventListener('click',function(){
			 		var _sreturn = options.success();
					if(typeof(_sreturn) == 'boolean' && _sreturn)  _Lister.Hide(target,options);
			 		if(options.close) _Lister.Hide(target,options);
			 	},false);
			}
		}else{
			if(options.hide && options.hide.length> 0){
				for(var i = 0;i < options.hide.length;i++){
				 	options.hide[i].attachEvent('onclick',function(){_Lister.Hide(target,options);});
				}
			}
			if(obj){
				obj.attachEvent('onclick',function(){
					var _sreturn = options.success();
					if(typeof(_sreturn) == 'boolean' && _sreturn)  _Lister.Hide(target,options);
					if(options.close) _Lister.Hide(target,options);
				});
			} 
		}
	}
};
/**
*support ajax
*options : {url,type,data,PageNumber,PageSize,success:function(){},error:function(){}}
*/
Chasonx.Ajax = function(options){
	if(!options.url) return false;
	
	options.type = options.type || 'post';
	options.contentType = options.contentType || 'application/x-www-form-urlencoded';
	options.dataType = options.dataType || 'json';
	
	if(typeof(options.before) == 'function'){
		var _options = options.before(options);
		if(typeof(_options) == 'object') options = _options;
	}

	var _param ='',_i = 0,_pt;
	if(options.data){
		for(var name in options.data){
			if(options.data[name] instanceof Array){
				_pt = options.data[name];
				for(_i = 0;_i < _pt.length;_i ++){
					_param += name + '[]=' + _pt[_i] + '&'
				}
			}else{
				_param += name + '=' + options.data[name] + '&';
			}
		}
	}
	if(options.PageNumber != undefined && options.PageNumber != null) _param += 'PageNumber=' + options.PageNumber + '&';
	if(options.PageSize != undefined && options.PageSize != null) _param += 'PageSize=' + options.PageSize + '&';
	_param += '0=0';
	options.param = _param;
	
	if(options.dataType.toLowerCase() == 'jsonp'){
		
		if(options.jsonp == undefined || options.jsonp == '') options.jsonp = 'callback';
		
		var callbackName = ('ChasonxJsonp' + Math.random()*10).replace('.','');
	
		var head = document.getElementsByTagName("head")[0];
		var async = document.createElement('script');
		async.setAttribute('type','text/javascript');
		async.setAttribute('src',options.url + "?" + options.param + "&" + options.jsonp + "=" + callbackName);
		head.appendChild(async);
		
		var timeout = null;
		window[callbackName] = function(jsonpData){
			head.removeChild(async);
			window[callbackName] = null;
			options.success(jsonpData);
			
			if(timeout != null) clearTimeout(timeout);
		};
		
		timeout = setTimeout(function(){
			head.removeChild(async);
			window[callbackName] = null;
			options.error("timeout");
		},10000);
		
	}else{
		var x = null;
		try { x = new XMLHttpRequest(); }
		catch( e ) { x = new ActiveXObject( "Microsoft.XMLHTTP" ); }
		
		x.onreadystatechange = function(){
			var r = '';
			if( 4 == x.readyState ){
				if( 200 == x.status ){
					r = x.responseText;
					if(options.dataType == 'json') r = eval('(' + r + ')');
					if(options.success) options.success(r);
				}else{
					if(options.error) options.error(x.statusText,x.status);
					else alert("Ajax Error! " + x.status + ":" + x.statusText);
				}
			}
		};
		
		x.open(options.type,options.url,true);
		x.setRequestHeader( 'Content-type',options.contentType);
		x.send(_param);
	}
	return options;
	
};
/**
*goto Page
*param:
*pageBoxId : 显示分页按钮的div
*totalCount : 总数
*limit : 每页显示数
*currPage : 当前显示页码
*options : ajax 请求所有必须的参数---> url  data 等
*callBack : 伪回调方法
*example : 结合 Chasonx.Ajax 使用
*	Chasonx.Ajax({
*			url:'../artDataSource',
*			PageNumber:0,
*			PageSize:2,
*			data : {'columnFidRequest':this.queryData.columnFidRequest,'fstate':2,'fdelete':0},
*			success : function(d){		
*				Chasonx.Page.init('pagetest',d.dataCount,2,1,this.options,function(d){ goback(d);});	
*				//goback(d);
*			},
*			error:function(e){
*				console.debug(e);
*			}
*		});
*/
Chasonx.Page = {
		attr: {pagePanel : 'width:100%;height:40px;text-align: right;vertical-align: middle;line-height:40px;',
			   btnA : 'display: inline-block;cursor:pointer;width:auto !important;min-width:25px;height:25px;border:1px solid #1499e2;text-align: center;vertical-align: middle;line-height:25px;margin:0px 2px 0px 2px;font-size:14px;color:#1499e2;padding:0px 2px 0px 2px;text-decoration:none;\
				   	  border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;background:#ffffff;',
			   pageLeft :'float:left;margin-top:4px;color:#1499e2;',
			   pageRight : 'float:right;',
			   select : 'width:90px;padding:3px 0px 3px 0px;font-size:10px;height: 26px;border: 1px solid #1499e2;cursor: pointer;background: #ffffff;color:#1499e2;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;'
		},
		init : function(pageBoxId,totalCount,limit,currPage,options,callBack,bindClick){

			var pageCount = Math.ceil(totalCount / limit);
			var _e,_es,_ea,_pageBox = $e(pageBoxId),_eLeft,_eRight;

			if(typeof _pageBox != 'object'){
				alert('分页控件载体为空');
				return;
			} 
				_pageBox.innerHTML = '';

				 _eLeft = ChasonTools.createEle({type:'span',css:this.attr.pageLeft});
				_eLeft.innerHTML = '找到数据：'+ totalCount + ' 条 | 总页数：'+ pageCount +' 页 | 当前显示：'+ limit +' 条';
				 _eRight = ChasonTools.createEle({type:'span',css:this.attr.pageRight});
				_pageBox.appendChild(_eLeft);
				_pageBox.appendChild(_eRight);

			    options = options || {};		    
			if(totalCount > limit){
				var over = true;
				
				if(pageCount > 6){
					var index = 0,showSize = 6;
					if(currPage > 5){
						_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA});
						_e = ChasonTools.createEle({type:'a',css:this.attr.btnA + 'cursor:text;'});
						_ea.innerHTML = 1;
						_ea.setAttribute('title','第1页');
						_e.innerHTML = '•••';
						_eRight.appendChild(_ea);
						_eRight.appendChild(_e);
		
						this.bindEvent(pageBoxId,_ea,0,totalCount,1,options,callBack,false,bindClick);
						index = currPage - 4;
						showSize = currPage + 3;
						if(currPage > (pageCount -  5)){
							showSize = pageCount;
							over = false;
						}
					}
					if(over){
						for(var i = index; i < showSize; i++){
							if(currPage == (i + 1)) 	{
								_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA + 'background:#1499e2;color:#ffffff;cursor:text;'});
								_ea.innerHTML = (i + 1);
								_ea.setAttribute('title','第'+ (i + 1) +'页');
								_eRight.appendChild(_ea);

							}else{		
								_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA});
								_ea.innerHTML = (i + 1);
								_ea.setAttribute('title','第'+ (i + 1) +'页');
								_eRight.appendChild(_ea);
								this.bindEvent(pageBoxId,_ea,i*limit,totalCount,(i+1),options,callBack,false,bindClick);
							}
						}

						_es = ChasonTools.createEle({type:'a',css:this.attr.btnA + 'cursor:text;'});
						_es.innerHTML = '•••';
						_eRight.appendChild(_es);

						_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA});
						_ea.innerHTML = pageCount;
						_ea.setAttribute('title','第'+ pageCount +'页');
						_eRight.appendChild(_ea);
						this.bindEvent(pageBoxId,_ea,(pageCount - 1)*limit,totalCount,pageCount,options,callBack,false,bindClick);
					}else{

						for(var i = (pageCount - 6);i < pageCount; i++){
							if(currPage == (i + 1)) 	{
								_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA + 'background:#1499e2;color:#ffffff;cursor:text;'});
								_ea.innerHTML = (i+1);
								_ea.setAttribute('title','第'+ (i + 1) +'页');
								_eRight.appendChild(_ea);
							}else{		
								_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA});
								_ea.innerHTML = (i + 1);
								_ea.setAttribute('title','第'+ (i + 1) +'页');
								_eRight.appendChild(_ea);
								this.bindEvent(pageBoxId,_ea,i*limit,totalCount,(i + 1),options,callBack,false,bindClick);
							}
						}
					}
				}else{
					for(var i = 0; i < pageCount; i++){
						if(currPage == (i + 1)) 	{
							_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA + 'background:#1499e2;color:#ffffff;cursor:text;'});
							_ea.innerHTML = (i + 1);
							_ea.setAttribute('title','第'+ (i + 1) +'页');
							_eRight.appendChild(_ea);
						}else{
							_ea = ChasonTools.createEle({type:'a',css:this.attr.btnA});
							_ea.innerHTML = (i + 1);
							_ea.setAttribute('title','第'+ (i + 1) +'页');
							_eRight.appendChild(_ea);
							this.bindEvent(pageBoxId,_ea,i*limit,totalCount,(i + 1),options,callBack,false,bindClick);
						}	
					}
				}
			}	
			_ea = ChasonTools.createEle({type:'select',css:this.attr.select});
			_ea.setAttribute('title','每页显示数');
			_ea.innerHTML = '<option ' + (limit == 10?'selected="selected"':'') + ' value="10">每页10条</option>\
							<option ' + (limit == 20?'selected="selected"':'') + ' value="20">每页20条</option>\
							<option ' + (limit == 40?'selected="selected"':'') + ' value="40">每页40条</option>\
							<option ' + (limit == 60?'selected="selected"':'') + ' value="60">每页60条</option>\
							<option ' + (limit == 80?'selected="selected"':'') + ' value="80">每页80条</option>\
							<option ' + (limit == 100?'selected="selected"':'') + ' value="100">每页100条</option>';
			_eRight.appendChild(_ea);	

			this.bindEvent(pageBoxId,_ea,0,totalCount,1,options,callBack,true),bindClick;
			_ea = ChasonTools.createEle({type:'div',css:'clear:both;'});	
			_pageBox.appendChild(_ea);
		},
		go : function(pageBoxId,start,totalCount,currpage,options,callBack,relimit,bindClick){
				if(relimit) options.PageSize = relimit;
				if(typeof(bindClick) == 'function'){
					bindClick(options);
				}else{
					Chasonx.Wait.Show();
		 			Chasonx.Ajax({
						url:options.url,
						PageNumber:start,
						PageSize:options.PageSize,
						data : options.data,
						dataType:options.dataType,
						jsonp : options.jsonp,
						before : options.before,
						success : function(data){		
							Chasonx.Page.init(pageBoxId,totalCount,options.PageSize,currpage,this,callBack);	
							if(typeof callBack == 'function') callBack(data);
							Chasonx.Wait.Hide();
						},
						error:function(e){
							Chasonx.Wait.Hide();
							Chasonx.Hint.Faild(e);
						}
					});
				}
		},
		bindEvent : function(pgBox,o,start,totalCount,currpage,options,callBack,relimit,bindClick){
			var _this = this;
			if(window.addEventListener){
				if(relimit) o.addEventListener('change',function(){ _this.go(pgBox,start,totalCount,currpage,options,callBack,this.options[this.selectedIndex].value,bindClick); },false);
				else o.addEventListener('click',function(){ _this.go(pgBox,start,totalCount,currpage,options,callBack,null,bindClick);},false);
			}else {
				if(relimit) o.attachEvent('onchange',function(){ _this.go(pgBox,start,totalCount,currpage,options,callBack,this.options[this.selectedIndex].value,bindClick);});
				else  o.attachEvent('onclick',function(){ _this.go(pgBox,start,totalCount,currpage,options,callBack,null,bindClick);});
			}
		}
};

function ___DelayExcute(fn,_dtime){
	setTimeout(function(){
		if(typeof fn == 'function') fn();
	},_dtime);
}

/**
 *@M delayRun(fn,time)<br>
*@M getWindowSize()<br>
*@M getObjectSize(Obj)<br>
*@M getOffsetLeft(Obj)<br>
*@M getOffsetTop(Obj)<br>
*@M setCookie(name,val,timeout)<bR>
*@M getCookie(name)<br>
*@M delCookie(name)<br>
*@M createEle({type,etype,name,id,css})<bR>
*@M AppendToBody(Obj)<br>
*@M AppendToElement(id,ele)<br>
*@M RemoveEle(ele)<br>
*@M addEventHandler(targetObj,eventType,handler)<br>
*@M removeEventHandler(targetObj,eventType,handler)<bR>
*@M isBrowser() 
*/
var ChasonTools = {
	 delayRun : function(fn,delayTime){
		 delayTime = delayTime || 200;
		 return  new ___DelayExcute(fn,delayTime);
	 },
	 /**
	  * 取窗口大小
	  * @returns {Array}[滚动条宽，滚动条高，实际宽，实际高]
	  */
	 getWindowSize : function(){
	 	return [document.documentElement.scrollWidth,document.documentElement.scrollHeight,document.documentElement.clientWidth,document.documentElement.clientHeight];
	 },
	 /**
	  * 取dom大小
	  * @param o
	  * @returns {Array}[width,height,left,top,scrollWidth,scrollHeight]
	  */
	 getObjectSize : function(o){
	 	if(!o) return [];
	 	return [o.offsetWidth,o.offsetHeight,this.getOffsetLeft(o),this.getOffsetTop(o),o.scrollWidth,o.scrollHeight];
	 },
	 /**
	  * 取dom距左距离
	  * @param e
	  * @returns
	  */
	 getOffsetLeft : function(e){
		 var offset=e.offsetLeft; 
		 if(e.offsetParent !=null){
			 if(e.offsetParent.scrollLeft) offset -= e.offsetParent.scrollLeft;
			 offset+= this.getOffsetLeft(e.offsetParent); 
		 }
		 return offset; 
	 },
	 /**
	  * 取dom距顶距离
	  * @param e
	  * @returns
	  */
	 getOffsetTop : function(e){
		 var offset=e.offsetTop; 
		 if(e.offsetParent!=null){
			 if(e.offsetParent.scrollTop) offset -= e.offsetParent.scrollTop;
			 offset+= this.getOffsetTop(e.offsetParent); 
		 }
		 return offset; 
	 },
	 /**
	  * 设置cookie
	  * @param name
	  * @param val
	  * @param timeout
	  */
	 setCookie : function(name,val,timeout){
	 	timeout = timeout || 7*24*60*60*1000;
 	 	var date = new Date();
 	 	date.setTime(date.getTime() + timeout);
	 	document.cookie = name + "=" + escape(val) + ";expires=" + date.toGMTString();
	 },
	 /**
	  * 取cookie
	  * @param name
	  * @returns
	  */
	 getCookie : function(name){
	 	var arr = document.cookie.match( new RegExp("(^| )" + name + "=([^;]*)(;|$)" ));
		if( arr != null ) return unescape( arr[2]) ;
		return null;
	 },	
	 /**
	  * 删cookie
	  * @param name
	  */
	 delCookie : function(name){
	 	var date = new Date();
	 	date.setTime(date.getTime() - 10000);
	 	document.cookie = escape(name + "=delete;expires=" + date.toGMTString());
	 },
	 /**
	  * 创建dom
	  * @param option
	  * @returns
	  */
	 createEle : function(option){
	 	var p = option || {};
		var _newEle = null;
		try{
			if(p.type)  _newEle = document.createElement(p.type);
			if(p.etype)  _newEle.setAttribute("type",p.etype);
			if(p.name) _newEle.setAttribute("name",p.name);
			if(p.id)   _newEle.setAttribute("id",p.id);
			if(p.css) _newEle.setAttribute("style",p.css);
		}catch(e){
			alert("create Element faild!");
		}
		return _newEle;
	 },
	 /**
	  * 追加dom到body
	  * @param o
	  */
	 AppendToBody : function(o){
		if(document.body) document.body.appendChild(o);
		else if(document.getElementsByTagName('body').length > 0) document.getElementsByTagName('body')[0].appendChild(o);
		else if(document.documentElement) document.documentElement.appendChild(o);
		else alert("Body appendChild faild!");
	 },
	 AppendToElement : function(id,o){
		 	var ele = $e(id);
		 	if(typeof(ele) != 'object') return;
		 	ele.appendChild(o);
	 },
	 /**
	  * 从body中删除元素
	  * @param o
	  */
	 RemoveEle : function(o){
		if(typeof(o) == 'undefined') return; 
		try{
			document.body.removeChild(o);
		}catch(e){
			try{
				document.documentElement.removeChild(o);
			}catch(e){}
		}
	 },
	 addEventHandler : function(oTarget, sEventType, fnHandler) {
		if (oTarget.addEventListener) {
			oTarget.addEventListener(sEventType, fnHandler, false);
		} else if (oTarget.attachEvent) {
			oTarget.attachEvent("on" + sEventType, fnHandler);
		} else {
			oTarget["on" + sEventType] = fnHandler;
		}
	 },
	 removeEventHandler : function(oTarget, sEventType, fnHandler) {
	    if (oTarget.removeEventListener) {
	        oTarget.removeEventListener(sEventType, fnHandler, false);
	    } else if (oTarget.detachEvent) {
	        oTarget.detachEvent("on" + sEventType, fnHandler);
	    } else { 
	        oTarget["on" + sEventType] = null;
	    }
	 },
	 /**
	  * 判断浏览器
	  * @returns {String}
	  */
	 isBrowser : function(){
	 	var _Bw = {};
	 	var ua = navigator.userAgent.toLowerCase();
	 	if (window.ActiveXObject)  _Bw.ie = ua.match(/msie ([\d.]+)/)[1];
        else if (document.getBoxObjectFor)   _Bw.firefox = ua.match(/firefox\/([\d.]+)/)[1];
        else if (window.MessageEvent && !document.getBoxObjectFor)   _Bw.chrome = ua.match(/chrome\/([\d.]+)/)[1];
        else if (window.opera)   _Bw.opera = ua.match(/opera.([\d.]+)/)[1];
        else if (window.openDatabase)   _Bw.safari = ua.match(/version\/([\d.]+)/)[1];

    	if(_Bw.ie) return "IE";
    	if(_Bw.firefox) return "FIREFOX";
    	if(_Bw.chrome) return "CHROME";
    	if(_Bw.opera) return "OPERA";
    	if(_Bw.safari) return "SAFARI";
	 },
	 CopyObject : function(obj){
		var nb = new Object();
		var __loopObj = function(obj,tarObj){
			for(var f in obj){
				if(typeof obj[f] == 'object'){
					tarObj[f] = new Object();
					__loopObj(obj[f],tarObj[f]);
				}else{
					tarObj[f] = obj[f];
				}
			}
		};
		__loopObj(obj,nb);
		return nb;
	}
};

var TwBounce = {
	  base : function(t,b,c,d){
			 return -c*(t/=d)*(t-2) + b;
	  },
	  easeOut:function(t,b,c,d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
	  },
	  easeInBack : function(t,b,c,d,s){
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	  },
	  easeOutQuart : function ( t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
	  },
	  easeOutElastic: function ( t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	  }
};

/**
*get Element
*/
function $e(id){
	if( typeof( id ) != "string" ) return id;
	if( document.getElementById ) return document.getElementById( id );
	if( document.all ) return document.all[ id ];
	if( document.layers ) return document.layers[ id ];
	return undefined;
}