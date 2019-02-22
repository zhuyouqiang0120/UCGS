
/**
*  Html Frameset
*  CreateTime : 2016-01-18
*  UpdateTime : 2016-05-03 细节优化
*  			  : 2016-09-19 属性添加
*  			  : 161220
*/
;(function(window){
	/**
	*类似于frameset的页面框架
	* window ： {
					top: { id : '设置的ID' ,title : '显示标题', height : '显示高度', html : '显示内容',bgColor : '',titleBgColor : '',color : '',border:false},
					bottom: { id : '设置的ID' ,title : '显示标题', height : '显示高度', html : '显示内容'},
					left: { id : '设置的ID' ,title : '显示标题', width : '显示高度', html : '显示内容',slide : true 显示控制按钮},
					right: { id : '设置的ID' ,title : '显示标题', width : '显示高度', html : '显示内容'}
				},
	  target : '模板的载体，默认为body'，
	  main   ： '四个块的主块，不传会默认创建一个'
	*
	*/
	function ChasonxFrameset(option){
		this.window = option.window || {};
		this.targetPanel = option.target || 'body';
		this.mainPanel = option.main || null;
		this.init();
	}

	ChasonxFrameset.prototype = {
		targetPanel : null,
		mainPanel : null,
		window : null,
		style  :  {
			defBgColor : '#F5F5F5',
			defBorderColor : '#cccccc',
			defTitleBgColor : '#DCDBDB',
			defTtitleColor : '#848080',
			top     : 'width:100%;position:absolute;transition: all 0.3s ease;  -webkit-transition: all 0.3s ease;  -moz-transition: all 0.3s ease;',
			bottom  : 'width:100%;position:absolute;transition: all 0.3s ease;  -webkit-transition: all 0.3s ease;  -moz-transition: all 0.3s ease;',
			left 	: 'position:absolute;left:0px;display:inline-block;transition: all 0.3s ease;  -webkit-transition: all 0.3s ease;  -moz-transition: all 0.3s ease;',
			right   : 'position:absolute;right:0px;display:inline-block;transition: all 0.3s ease;  -webkit-transition: all 0.3s ease;  -moz-transition: all 0.3s ease;',
			main	: 'width:100%;height:100%;position:relative;margin:auto;overflow:hidden;',
			title   : 'height:25px;vertical-align:middle;line-height:25px;font-size:13px;overflow:hidden;',
			contentB: 'position:absolute;overflow:hidden;left:0px;right:0px;bottom:0px;white-space:nowrap;word-break:keep-all;',
			content : 'width:100%;height:100%;overflow:auto;position:relative;',
			open 	: 'position:absolute;top:48%;right:0px;cursor:pointer;z-index:22;',
			dBorder  : 'border-width:1px;border-style: solid;'
		},
		res    :  {
			open : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAeCAYAAAAVdY8wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVBMjlCNDkzQkRCRjExRTU5MUI0RjcxRDhDMTM3NjA1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVBMjlCNDk0QkRCRjExRTU5MUI0RjcxRDhDMTM3NjA1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUEyOUI0OTFCREJGMTFFNTkxQjRGNzFEOEMxMzc2MDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUEyOUI0OTJCREJGMTFFNTkxQjRGNzFEOEMxMzc2MDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5A7XVhAAABr0lEQVR42rRUu1LCUBDdMCGxwZKWdH6LXyF+gJVfoc5YOLYO2tlBaasNQ2sDdgHjkAgyIQN5kOD1bG5IYMYHhVxmyb2bs3v2lUu3jcYhRBFC0G+itJpN4bruCxFdQe6O6vU5fbOUbrcnlklMtm2TZVkudDeQaxiYG8AegJquUblcpiAIyHq1aDDoL/GuxSwweJLAXldomp4C4zimRRSRD4PxaESTyYTCMLwE+LSEMBmf+ZfPEp6V/QpVq1U+HkvdeiCc4Som/IQ8lPhPNU2Ttlkl2nKphlEjHcmoWTIRkkECqQS+XwBNs//f1DWDdJ2pVVAnKXUUBSh+SP4GdX8XWRctZGqZcRQGaGXIGD3zuNZC9IW7qMgd9ql+b1edQXlW85gk3JkFYpTliWSMuypPzeDOgFpFeRKe8AUFPBSYci5T7lHh6RR5dUikhRFUKHPqYsZlDZV8xkM/4I2bUpNSWKa+wDCbzendccjzPJ7BEwnMrHl9jMf0ZlmEC+EZxwvIPb7AJAWyF8exaTgckjedPkJ3BnkAYCNItdNuf2Yf+zledn6sDy6og78uKJYvAQYAw/8WXiFnCPIAAAAASUVORK5CYII=',
			close: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAeCAYAAAAVdY8wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4MjhEMEMzQkRDMDExRTU5OTcyQzkyMjQ0NjEwQjEzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY4MjhEMEM0QkRDMDExRTU5OTcyQzkyMjQ0NjEwQjEzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjgyOEQwQzFCREMwMTFFNTk5NzJDOTIyNDQ2MTBCMTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjgyOEQwQzJCREMwMTFFNTk5NzJDOTIyNDQ2MTBCMTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7E8/BmAAABkklEQVR42rRUPU/DMBA9p0nsBNSGCtoUJYUJNlY2WGFjZAIJVsSC4FfwH1p+GktRmUhFlcSpFO7ifNGWwlAcPZ0dPd/zvZPN0jSFVeNlOGQYzvQVhE0M14h7x3EO9CWEfQx3iFvP9x2360LDaIBeI5zQbsRFf6/f8D0fhGVBkiQQx7EiIulZCPHQbrdhu7MDlrBA1ysxxliZ8aZDBHsDNPxJp6+XSAVr+Vz7qXiWocoIyWwGQRBkWDY0+OMoM5qGAbZtAxcCq0VwjgUZqJSAjGRFlGiDJNm1SRuZtAUCPSQfTW5m/5R0XKsapYOAMFmPdFOYXFWbV23iWkfpWd7rIiNLGbWKWsfy/kI++97rbBchmKzLHo6doPORNRRLe+iMUi6RDv5DmqM93FTSZE8Uy8WMKUtLW9RaWVUQP8IwrBlaZ6plQbx6H49f30YjmE4/iV2ZTR92ghUvBd5EOu8l4hEv/JHnedB13eyKyCiqiHNPyDniqdlqne72etBythaJc5uOaQM9Ctmd/Q3DweDwS4ABAEP1u052gtFlAAAAAElFTkSuQmCC'
		},
		init : function(){
			var mBox = null;
			if(this.mainPanel){
				mBox = $e(this.mainPanel);
				mBox.setAttribute('style',this.style.main);
			} else{
				mBox = ChasonTools.createEle({type:'div',css:this.style.main});
			}  
			var top = null,bottom = null,right = null,left = null;
			var _openRes = this.res.open,_closeRes = this.res.close;
			var _lwidth = null,_csss = null,_html = null;
			
			if(this.window.top){
				this.window.top.height = this.window.top.height || '10%';
				top = $e(this.window.top.id);
				_csss = this.style.top + 'height:' + this.window.top.height + ";";
				if(this.window.top.bgColor != false) _csss += "background-color:" + (this.window.top.bgColor || this.style.defBgColor) + ";";
				_csss += (this.window.top.border == false?"":"border-color:" + (this.window.top.border || this.style.defBorderColor) + ";" + this.style.dBorder);
				if(top){
					top.setAttribute('style',_csss);
					top.setAttribute('id',this.window.top.id + '_box');

					_html = top.innerHTML;
					top.innerHTML = '';
				}else{
					top = ChasonTools.createEle({
						type:'div',
						css:_csss
					});	
					_html = this.window.top.html || '';
				}
				var _css = this.style.title;
				if(this.window.top.titleBgColor != false)
					_css += "background-color:" + (this.window.top.titleBgColor || this.style.defTitleBgColor) + ";";
				
				_css += "color:" + (this.window.top.color || this.style.defTtitleColor) + ";";
				this.addTitle(top,this.window.top.title,this.window.top.id,_html,_css);
				mBox.appendChild(top);
			}
			if(this.window.bottom){
				this.window.bottom.height = this.window.bottom.height || '0px';
				bottom = $e(this.window.bottom.id);
				_csss = this.style.bottom + "height:" + this.window.bottom.height + ';bottom:0px;';
				if(this.window.bottom.bgColor != false) _csss += "background-color:" +  (this.window.bottom.bgColor || this.style.defBgColor)  + ";";
				_csss += (this.window.bottom.border == false?"":"border-color:" + (this.window.bottom.border || this.style.defBorderColor) + ";" + this.style.dBorder);
				if(bottom){
					bottom.setAttribute('style',_csss);
					bottom.setAttribute('id',this.window.bottom.id + '_box')

					_html = bottom.innerHTML;
					bottom.innerHTML = '';
				}else{
					bottom = ChasonTools.createEle({
						type : 'div',
						css  : _csss
					});
					_html = this.window.bottom.html || '';
				}
				var _css = this.style.title;
				if(this.window.bottom.titleBgColor != false)
				   _css += "background-color:" + (this.window.bottom.titleBgColor || this.style.defTitleBgColor) + ";";
				_css += "color:" + (this.window.bottom.color || this.style.defTtitleColor) + ";";
				this.addTitle(bottom,this.window.bottom.title,this.window.bottom.id,_html,_css);
				mBox.appendChild(bottom);
			}	
			if(this.window.left){
				if(this.window.left.slide == undefined) this.window.left.slide = true;
				this.window.left.width = this.window.left.width || '15%';
				_lwidth = this.window.left.width;
				_csss = this.style.left + ('top:' + (this.window.top?this.window.top.height:'0%') + ';width:' + this.window.left.width + ';bottom:' + (this.window.bottom?this.window.bottom.height:'0px') + ';');
				if(this.window.left.bgColor != false) _csss += "background-color:" +  (this.window.left.bgColor || this.style.defBgColor)  + ";";
				_csss += (this.window.left.border == false?"":"border-color:" + (this.window.left.border || this.style.defBorderColor) + ";" + this.style.dBorder); 
				
				left = $e(this.window.left.id);
				if(left){
					left.setAttribute('style',_csss);
					left.setAttribute('id',this.window.left.id + '_box');

					_html = left.innerHTML;
					left.innerHTML = '';
				}else{
					left = ChasonTools.createEle({
						type : 'div',
						css  : _csss
					});
					_html = this.window.left.html || '';
				}
				var _css = this.style.title;
				if(this.window.left.titleBgColor != false)
					_css +=  "background-color:" + (this.window.left.titleBgColor || this.style.defTitleBgColor) + ";" ;
				_css += "color:" + (this.window.left.color || this.style.defTtitleColor) + ";";
				this.addTitle(left,this.window.left.title,this.window.left.id,_html,_css);
				if(this.window.left.slide){
					var  open = ChasonTools.createEle({type:'img',css : this.style.open});
						 open.setAttribute('src',_closeRes);
						 open.setAttribute('open','yes');
					left.appendChild(open);
					/*slide click*/
					ChasonTools.addEventHandler(open,'click',function(){
							 var sta = this.getAttribute('open');
							 if(sta == 'yes'){
							 	  left.style.width = '0px';
							 	  this.style.right = '-10px';
							 	  this.src = _openRes;
							 	  this.setAttribute('open','no');
	
							 	  if(right != null) right.style.left = '0px';
							 }else{
							 	  left.style.width = _lwidth;
							 	  this.style.right = '0px';
							 	  this.src = _closeRes;
							 	  this.setAttribute('open','yes');
	
							 	  if(right != null) right.style.left = _lwidth;
							 }
					});
				}
				mBox.appendChild(left);	
			}	
			if(this.window.right){
				right = $e(this.window.right.id);
				_csss = this.style.right + ('top:' + (this.window.top?this.window.top.height:'0%') + ";left:" + (this.window.left?this.window.left.width:'0%') + ';bottom:' + (this.window.bottom?this.window.bottom.height:'0px') + ';');
				if(this.window.right.bgColor != false) _csss += "background-color:" +  (this.window.right.bgColor || this.style.defBgColor)  + ";";
				_csss += (this.window.right.border == false?"":"border-color:" + (this.window.right.border || this.style.defBorderColor) + ";" + this.style.dBorder);
				if(right){
					right.setAttribute('style',_csss);
					right.setAttribute('id',this.window.right.id + '_box');

					_html = right.innerHTML;
					right.innerHTML = '';
				}else{
					right = ChasonTools.createEle({
						type : 'div',
						css  : _csss
					});
					_html = this.window.right.html || '';
				}
				var _css = this.style.title;
				if(this.window.right.titleBgColor != false)
					_css += "background-color:" + (this.window.right.titleBgColor || this.style.defTitleBgColor) + ";";
				_css += "color:" + (this.window.right.color || this.style.defTtitleColor) + ";";
				this.addTitle(right,this.window.right.title,this.window.right.id,_html,_css);
				mBox.appendChild(right);
			}	

			if(this.targetPanel == 'body')
				ChasonTools.AppendToBody(mBox);
			else
				ChasonTools.AppendToElement(this.targetPanel,mBox);
		},
		addTitle : function(tar,title,id,html,_css){
			if(!title) return this.addContent(tar,id,html,false);
			var _title = ChasonTools.createEle({
				type : 'div',
				css  : _css
			});
		    _title.innerHTML = title;
			tar.appendChild(_title);
			return this.addContent(tar,id,html,true);
		},
		addContent: function(tar,id,html,f){
			var _con = ChasonTools.createEle({
				type : 'div',
				css  : this.style.contentB + 'top:' + (f?'25px;':'0px;')
			});
			_con.innerHTML = '<div id="'+ id +'" style="'+ this.style.content +'">'+ (html ? html : '') +'</div>';
			tar.appendChild(_con);
			return this;
		},
		slideOpen : function(){

		},
		slideClose: function(){

		}
	};

/**
*盒子模型拖动
*
*Chasonx.DragBox({
			target : 'rightPanel',
			lineColor : '#ADADAD',
			drag : true,//default: true
			height : 100%,
			items : [
			         {id : 'draglistLeft',width : '10' },
			         {id : 'dragListCenter',width : '15'},
			         {id : 'dragListRight',width : '75' }
			        ]
		});
*/
	function ChasonxDragBox(option){
		this.items = option.items || [];
		this.target = option.target || null;
		this.height = option.height || '100%';
		this.lineColor = option.lineColor || this.lineColor;
		this.drag = option.drag == undefined?true:option.drag;
		this.init();
	}

	ChasonxDragBox.prototype = {
		items    	: null,
		target 		: null,
		height 		: null,
		lineColor	: '#635D5D',
		eleContainer: [],
		style     	: {
			  main  :  'position:relative;width:100%;',
			  td 	: 'position:absolute;top:0px;bottom:0px;overflow:auto;',
			  line  : 'cursor:col-resize;display:inline-block;height:100%;position:absolute;right:0px;width:2px;top:0px;bottom:0px;'
		},
		init : function(){
			if(this.items.length == 0) return;

			var _boxWidth = (100/this.items.length).toFixed(2);
			var _tdWidth = 0,_leftWidth = 0;	

			var main = $e(this.target),_style,_gennerid,_line;
			if(!main) return ;
			main.setAttribute('style',this.style.main + 'height:' + this.height + ';');

			var oFragment = document.createDocumentFragment();
			for(var i = 0,len = this.items.length;i < len;i++){
				if(i > 0) _leftWidth += ~~this.items[i - 1].width;

				_tdWidth = this.items[i].width || _boxWidth;
				_style = this.style.td + 'width:' + _tdWidth + '%;left:' + _leftWidth + '%;';
				if(i > 0) _style += 'border-left:none;';

				_gennerid = '_chasonxDragbox_' + (eval(Math.random()*1)+"").replace('.','');
				var _td = $e(this.items[i].id || '');
				if(_td){
					_td.setAttribute("style",_style + (this.items[i].css || ''));
					_gennerid = this.items[i].id;
				}else{
					ChasonTools.createEle({type:'div',css : _style + (this.items[i].css || '')});
					_td.setAttribute("id", _gennerid);
				}		

				_line = null;
				if(i < (len - 1)){
					_line  = ChasonTools.createEle({type : 'i' ,css : this.style.line + 'background:'+ this.lineColor +';' });
					_line.setAttribute('pid',_gennerid);
					_line.setAttribute('parentPanel',this.target);
					if(this.drag == true)
						_line.setAttribute('title','拖动更改宽度');
					_td.appendChild(_line);
				}
				oFragment.appendChild(_td);
				this.eleContainer.push({ Td : _td , Line : _line });
			}
			this.bindHandler();
			ChasonTools.AppendToElement(main,oFragment);
		},
		bindHandler : function(){
			var _this = this;
			for(var i = 0,len = this.eleContainer.length;i < len; i++){
				if(this.drag == true){ 
				    this.bind(this.eleContainer[i].Line,(i < (len - 1)?this.eleContainer[i + 1].Td:null),function(_lineObj,_nextTd){
				    	_this._handler(_lineObj,_nextTd);
				    },'mousedown');
				}
			    this.bind(this.eleContainer[i].Td,this.eleContainer[i].Line,function(_scrollObj,_lineObj){
			    	if(_lineObj == null) return;
			    	_lineObj.style.right = (0 - _scrollObj.scrollLeft) + 'px';
			    	if(_scrollObj.scrollHeight == _lineObj.offsetHeight) return;
			    	_lineObj.style.height = _scrollObj.scrollHeight + 'px';
			    },'scroll');
			}
		},
		bind : function(O,handlerObj,fn,handlerType){
			if(O == null ) return;
			if(window.addEventListener){
			    O.addEventListener(handlerType,function(){
			    	fn(O,handlerObj);
			    },false);
			}else {
			    O.attachEvent('on' + handlerType,function(){
			    	fn(O,handlerObj);
			    });
			}
		},
		_handler : function(_this,nextTd){
				Chasonx.BodySelection(false);
				var d = document;
		        var ppele = $e(_this.getAttribute('pid'));
		        var mainSize = ChasonTools.getObjectSize($e(_this.getAttribute('parentPanel')));
		        var _targetSize = ChasonTools.getObjectSize(ppele),_nextTdSize = ChasonTools.getObjectSize(nextTd);
				if(_this.setCapture) {
		              _this.setCapture();
		        }else if(window.captureEvents) {
		              window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		        }
		        d.onmouseup = function(){
		        	if(_this.releaseCapture) {
		                 _this.releaseCapture();
		             }else if (window.releaseEvents){
		                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		             }
		             d.onmousemove = null;
		             d.onmouseup = null;

		             Chasonx.BodySelection(true);
				};
				var  tx,_w,tagetSize,nextTdSize,tempWidth = 10;
				d.onmousemove = function(e){
					e = e || window.event;
					tx = e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
					tagetSize =  ChasonTools.getObjectSize(ppele);
					nextTdSize = ChasonTools.getObjectSize(nextTd);
					_w = nextTdSize[2] - tx;
					if((tagetSize[0] - _w) > tempWidth ){
						if((tagetSize[0] - _w) <= _targetSize[0]){ // drag left
							ppele.style.width = ((tagetSize[0] - _w )/mainSize[0])*100 + '%';
							nextTd.style.width = ((nextTdSize[0] + _w)/mainSize[0])*100 + '%';
							nextTd.style.left = ((nextTdSize[2] - _w - mainSize[2])/mainSize[0])*100 + '%';
						}else if((tagetSize[0] - _w) >= _targetSize[0] && (tagetSize[0] - _w) <= (_nextTdSize[0] + _targetSize[0] - tempWidth)){  //drag right
							ppele.style.width = ((tagetSize[0] - _w )/mainSize[0])*100 + '%';
							nextTd.style.width = ((nextTdSize[0] + _w)/mainSize[0])*100 + '%';
							nextTd.style.left = ((nextTdSize[2] - _w - mainSize[2])/mainSize[0])*100 + '%';
						}else if((tagetSize[0] - _w) > _targetSize[0] && (tagetSize[0] - _w) > (_nextTdSize[0] + _targetSize[0] - tempWidth)){  //right
							ppele.style.width = ((tagetSize[0] + nextTdSize[0] - tempWidth)/mainSize[0])*100 + '%';
							nextTd.style.width = (tempWidth/mainSize[0])*100 + '%';
							nextTd.style.left = ((_nextTdSize[2] + _nextTdSize[0] - nextTdSize[0] - mainSize[2])/mainSize[0])*100 + '%';
						}
					}else{  //left
						ppele.style.width = (tempWidth/mainSize[0])*100 + '%';
						nextTd.style.width = ((nextTdSize[0] + tagetSize[0] - tempWidth)/mainSize[0])*100 + '%';
						nextTd.style.left = ((tagetSize[2] + tempWidth - mainSize[2])/mainSize[0])*100 + '%';
					}
				};
		}
	};

	window.Chasonx.Frameset = function(option){
		return new ChasonxFrameset(option);
	};
	window.Chasonx.DragBox = function(option){
		return new ChasonxDragBox(option);
	}
})(window);