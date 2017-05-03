/**
 * 加载类
 */
;(function(window,$){
	
var Loader = {
		js : function(url,execInit,callback,para){
			new JsContrl().required(url,execInit,callback,para);
		},
		css : function(css){
			var style = $('style')[0];
			if(style != undefined && style != null){
				$(style).append(css);
			}else{
				style = document.createElement('style');
				style.type = 'text/css';
				style.styleSheet.cssText = css;
				$('head').append(style);
			}
		},
		getPage : function(url){
			return $('div[class="pagePanel"][dataurl="'+ url +'"]');
		}
};

function JsContrl(){}

JsContrl.prototype = {
	version : '1.0.0.2015',
	basePath : '/UCGS/res/plugs/',
	jscontainer : [],
	required : function(url,execInit,cb,para){
		if(url == null || url == '') return;
		var src = this.basePath + url.replace(/[.]/ig,'/') + '.js';//?v' + this.version;
		var func = url.substring(url.lastIndexOf('.') + 1,url.length);
			func = func || 'void';
		
			execInit = execInit || false;
			
		if(!this.inArray(this.jscontainer,src)){
			this.jscontainer.push(src);
			
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
				script.setAttribute('type','text/javascript');
				script.setAttribute('src',src);
				script.onreadystatechange = function(){
					if(this.readyState == 'complete' && execInit){
						window[func]['init'](para);
						
						if(cb != null && typeof(cb) == 'function') cb();
					}
				};
				script.onload = function(){
					if(execInit) window[func]['init'](para);
					
					if(cb != null && typeof(cb) == 'function') cb();
				};
				head.appendChild(script);
		}else if(execInit){
			window[func]['init'](para);
			
			if(cb != null && typeof(cb) == 'function') cb();
		}
		
	},
	inArray : function(array,ele){
		var res = false;
		for(var i = 0,len = array.length;i < len;i++){
			if(array[i] == ele){
				res = true;
				break;
			}
		}
		return res;
	}
};

window.Loader = Loader;

})(window,$);