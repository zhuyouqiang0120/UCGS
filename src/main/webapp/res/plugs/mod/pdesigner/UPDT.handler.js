var UPDT = {
	   baseData : null,
	   container : [],
	   baseUrl : null,
	   colGuid : null,
	   init : function(){
		    this.colGuid = this.getParam('colGuid');
		    if(this.colGuid != null && this.colGuid != '') _UPDT_BASE_URL += '&colGuid=' + this.colGuid;
		    this.baseUrl = _UPDT_BASE_URL;
		    this.container = _UPDT_CONTAINER;
		    if(this.baseUrl == null) return;
		    this.ajax({
		    	url : this.baseUrl,
		    	type : 'post',
		    	dataType : 'json',
		    	success : function(d){
		    		UPDT.baseData = d;
		    		UPDT.recoverHandler();
		    		
		    		for(var i = 0;i < _UPDT_CONTAINER.length;i++){
		    			if(_UPDT_CONTAINER[i].config.attr.mainDraw == true){
		    				_UPDT_CONTAINER[i].config.dataSourceKey = UPDT.baseData.Node[0];
		    				
		    				var _config = _UPDT_CONTAINER[i],_target;
		    				while(_config.config.linkTarget){
		    					_target = _config.getConfigByKey(_config.config.linkTargetKey);
		    					_target.config.dataSourceKey = _config.getData(_config.config.dataSourceKey)[_config.config.dataType][0].Id;
		    					
		    					_config = _target;
		    				}
		    				break;
		    			}
		    		}
		    		
		    		for(var i = 0;i < _UPDT_CONTAINER.length;i ++){
						if(typeof _UPDT_CONTAINER[i].append == 'function')
							_UPDT_CONTAINER[i].append();
						if(typeof _UPDT_CONTAINER[i].data == 'function')
							_UPDT_CONTAINER[i].data(_UPDT_CONTAINER[i].config.dataSourceKey == ''?undefined:_UPDT_CONTAINER[i].config.dataSourceKey);
						
					}
		    	},
		    	error : function(e){
		    		
		    	}
		    });
	   },
	   recoverHandler : function(){
		   if(_UPDT_CONTAINER.length == 0) return;
		   
		   for(var i = 0;i < _UPDT_CONTAINER.length;i ++){
			   for(var fn in _UPDT_CONTAINER[i]){
				   if(fn == 'data' || fn == 'click' || fn == 'focus' || fn == 'append' || fn == '$' || fn == 'getData' || fn == 'getStyle' || fn == 'creatEle' || fn == 'appendToDraw' || fn == 'addEventHandler' || fn == 'getConfigByKey'){ 
					   _UPDT_CONTAINER[i][fn] = eval('(' + _UPDT_CONTAINER[i][fn] + ')');
				   }
			   }
		   }
	   },
	   getParam : function(name){
			var param = window.location.search;
			param = param.replace('?','').split('&');
			name = name || '';
			var temp;
			for(var i = 0;i < param.length;i++){
				temp = param[i].split('=');
				if(temp[0] == name) return temp[1];
			}
			return "";
	   },
	   ajax : function(options){
		   if(!options.url) return false;
			
			options.type = options.type || 'post';
			options.contentType = options.contentType || 'application/x-www-form-urlencoded';
			options.dataType = options.dataType || 'json';
			
			if(typeof(options.before) == 'function'){
				var _options = options.before(options);
				if(typeof(_options) == 'object') options = _options;
			}

			var _param ='';
			if(options.data){
				for(var name in options.data){
					_param += name + '=' + options.data[name] + '&';
				}
			}
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
	   }
};