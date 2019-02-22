
var  Ghtml = {
		str : '',
		jsload : null,
		headStart : '\n<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\
				\n<html>\
				\n<head>\
				\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\
				\n<meta name="author" content="TScaler">\
				\n<meta name="version" content="'+ TScalterVersion +'">\
				\n<meta name="keywords" content="${keywords}">\
				\n<meta name="description" content="${description}">',
		headEnd : '\n</head>',
		title : '\n<title>${title}</title>',
		pageSize : '',
		style : '\n<style type="text/css">\
			     \n body {margin:0px;padding:0px;overflow:hidden;font-family: "微软雅黑","幼圆","宋体","黑体",Arial}\
				 \n ${css}\
			     \n</style>',
		script : '\n<script type="text/javascript">${javascript}</script>',	  
		simpleHtml : function(callback,_title,_css,_javascript){
			with(this){
				var Items = ChasonxTScaler.liveCtrlContainer();
				if(Items.length == 0) return Chasonx.Hint.Faild('先设计一下吧');
				var pageW = 1280,pageH = 720;
				for(var i = 0,len = Items.length;i < len;i++){
					if(Items[i].config.type == 'Panel'){
						pageW = Items[i].config.attr.width ;
						pageH = Items[i].config.attr.height;
						break;
					}
				}
				
				var sss = [];
				sss.push(headStart);
				sss.push('\n<meta name="page-view-size" content="'+ pageW +'*'+ pageH +'"/>');
				sss.push(title.replace('${title}',(_title || '标题')));
				sss.push(style.replace('${css}',(_css || '')));
				sss.push(script.replace('${javascript}',(_javascript || '')));
				sss.push(headEnd);
				sss.push('\n<body scroll="no" onload="CMS_PageLoad()">\n' + HTMLFormat($("#PD_Designer").html()) + '\n</body>');
				sss.push('\n</html>');
				if(typeof callback == 'function') callback(sss.join(''));
			}
		},
		html : function(callback,_title,_css,_javascript){
			if(!this.putConfigToContainer()) return;
		 	
			this.str = '';
			this.pageSize = '';
			this.str = this.headStart + this.pageSize + (_title?this.title.replace('${title}',_title):'<title>模板页面</title>') + this.style.replace('${css}',(_css || ''))
					 + this.script.replace('${javascript}',(_javascript || ''))
					 + this.headEnd +  '\n<body onload="UPDT.init();">' + this.str + '\n</body></html>';
			
			this.getJs();
			var _jsload = setInterval(function(){
				if(Ghtml.jsload != null) clearInterval(_jsload);
				if(Ghtml.jsload == true){
					if(typeof callback == 'function') callback(Ghtml.str);
					else Ghtml.previewHtml();
				}
			},200);
			
		},
		putConfigToContainer : function(){
			var Items = ChasonxTScaler.liveCtrlContainer();
			if(Items.length == 0){
				Chasonx.Hint.Faild('先设计一下吧');
				return false;
			}
			
			UPDT.container = [];
			UPDT.baseUrl = PDesigner.baseDataUrl + '?' + PDesigner.showPara();
			
			var _Ctrl;
			for(var i = 0,len = Items.length;i < len;i++){
					_Ctrl = new Object();
					_Ctrl.config = CCopyObject(Items[i].config);
					_Ctrl.drawPanelId = Items[i].drawPanelId;
					if(_Ctrl.config.attr.left >= 10) _Ctrl.config.attr.left -= 10;
					if(_Ctrl.config.attr.top >= 10) _Ctrl.config.attr.top -= 10;
					
					if(typeof Items[i].data == 'function') _Ctrl.data = Items[i].data;
					if(typeof Items[i].append == 'function') _Ctrl.append = Items[i].append;
					_Ctrl.creatEle = UPDT.creatEle;
					_Ctrl.appendToDraw = UPDT.appendToDraw;
					_Ctrl.$ = Items[i].$;
					_Ctrl.getStyle = Items[i].getStyle;
					
					if(Items[i].config.type != 'Panel'){
						if(typeof Items[i].click == 'function') _Ctrl.click = Items[i].click;
						if(typeof Items[i].focus == 'function') _Ctrl.focus = Items[i].focus;
						_Ctrl.addEventHandler = Items[i].addEventHandler;
						_Ctrl.getConfigByKey = UPDT.getConfigByKey;
						_Ctrl.getData = UPDT.getData;
					}else{
						_Ctrl.config.attr.left = 0;
						_Ctrl.config.attr.top = 0;
						this.pageSize = '\n<meta name="page-view-size" content="'+ Items[i].config.attr.width +'*'+ Items[i].config.attr.height +'"/>';
					}
					UPDT.container.push(_Ctrl);
			}
			return true;
		},
		previewHtml : function(){
			$.ajax({
				url : DefConfig.Root + '/main/pdesigner/previewHtml',
				type : 'post',
				dataType : 'json',
				data : {'htmlData':this.str},
				success : function(d){
					window.open(DefConfig.Root + '/data/preview/pdesignerPreview');
				},
				error : function(e){
					Chasonx.Hint.Faild('预览失败了');
				}
			});
		},
		getHtml : function(item,flag){
			if(item.objt == 'div'){
				this.str += '\n<div id="'+ item.config.id +'" style="'+ item.getStyle(item.config.attr) + (item.config.css?item.config.css:'') +'"></div>';
			}else if(item.objt == 'img'){
				this.str += '\n<img src="'+ item.config.attr.src +'" style="'+ item.getStyle(item.config.attr) + (item.config.css?item.config.css:'') +'"/>';
			}
		},
		getJs : function(){
			this.str += '\n<script type="text/javascript">';
			$.ajax({
				url : DefConfig.Root + '/res/plugs/mod/pdesigner/UPDT.handler.js',
				type : 'get',
				dataType : 'text',
				success : function(d){
					var _jsHandler = '';
//					for(var i = 0;i < UPDT.container.length;i ++){
//						if(typeof UPDT.container[i].data == 'function')
//							_jsHandler += '_UPDT_CONTAINER['+ i +'].append();\n_UPDT_CONTAINER['+ i +'].data('+ (UPDT.container[i].config.dataSourceKey != ''?"'"+ UPDT.container[i].config.dataSourceKey + "'":undefined) +');\n';
//					}
//					
//					Ghtml.str += '\nvar _UPDT_HANDLER_RUN = function(){ '+_jsHandler +' }';
					Ghtml.str += '\nvar _UPDT_BASE_URL = "'+ UPDT.baseUrl +'";';
					Ghtml.str += '\nvar _UPDT_CONTAINER = ' + Ghtml.getArrayToString() + ';\n';
					Ghtml.str += d;
					Ghtml.str += '\n</script>';
					Ghtml.jsload = true;
				},
				error : function(e){
					Chasonx.Hint.Faild('Ctrl Js Can not be load');
					Ghtml.jsload = false;
				}
			});
		},
		getArrayToString : function(){
			var _array = UPDT.container;
			if(_array.length == 0){
				if(!this.putConfigToContainer()) return;
				_array =  UPDT.container;
			}
			
			for(var i = 0,len = _array.length;i < len;i ++){
				for(var c in _array[i]){
					if(typeof _array[i][c] == 'function') _array[i][c] =  _array[i][c].toString();
				}
			}
			return JSON.stringify(_array);
		}
};

var UPDT = {
		   baseData : null,
		   container : [],
		   baseUrl : null,
		   getData : function(_key){
			   return UPDT.baseData == null?null:_key == undefined?UPDT.baseData:UPDT.baseData[_key];
		   },
		   creatEle : function(){
				var _e = document.createElement(this.config.eleType);
				    _e.setAttribute('id',this.config.id);
				return _e;
		   },
		   appendToDraw : function(o){
			   if(document.body) document.body.appendChild(o);
				else if(document.getElementsByTagName('body').length > 0) document.getElementsByTagName('body')[0].appendChild(o);
				else if(document.documentElement) document.documentElement.appendChild(o);
		   },
		   getConfigByKey : function(key){
			   if(_UPDT_CONTAINER.length == 0) return;
			   
			   for(var i = 0;i < _UPDT_CONTAINER.length;i++){
				   if(_UPDT_CONTAINER[i].config.id == key)
					   return _UPDT_CONTAINER[i];
			   }
			   return null;
		   }
	};
