/*
                                                  
            .rrrsrssrsrrii;:.                     
           .8A&GG8898999999993S5s:                
           ;XGGGGG8889889999999999h.              
           ;XXXXXG888888889898888981              
           iXXXXXGGGG888888888889883.             
           rXXX&XXXXGGGGG88888898888;              
           1&XXX&XXGGG8G88888G898898h     ,ih3889;
           h&XXXXX&XGGG88GGGG8GG88889. ;h9X&A&&&H9  天 一 皇 不
  .,:;;;;:,9&AAA&X&&GGXGGGGX&GGXXGG8838&A&XXXXX&B1  下 入 图 胜
h5998888888&&AA&&&&&XXXGGXXXXXGGGGX&AA&&&X&&&&HBS   风 江 霸 人
89993933338XXXGGXGGG8898888998GXABMMMBHAAAHBBBXs    云 湖 业 生
9399333399888G888888888888GGXAM##M##MBBM#MHXS;      出 岁 谈 一
9399998888G88888888888GGXXXX89GAHBBMBBA3hi,         我 月 笑 场
89898888988899888GGXXXX&&&AG93S5S9HMH8S             辈 催 中 醉
G8GG8GG8GXXXXXX&AAA&88G&&&X899351s9BG95              ，； ， 。
55399933S51s8XX&&X&X33398933S55h1s3X55;           
            h8GGG8G9SS33333S5hhh1r983r            
            :39889955S533SS5h111ssGBG,            
             i39889S3333SS5h11ssi39s,             
              s999883333SS5h11si1Xs               
               h8GXXXGG8935h1srhXS1:              
                1998893S555h113XShh1ri,.          
           r5hr..s9999SS55hh3G8555h1h3hhi   .:;irs
           3Gi,;;;s83S93S38G8S555hh1hSh3s     .,;r
           3S:;;;i:13;SX&XG35SS55hh1h55s          
           89ii;;i;;s3XXG933SSS555hhSSs           
.         .XXiii;;;;iH#X989333SSSS5S3r            
.         :&Xsii;;;i:GBX899993SSSS3S;             
.         ;AAh;iii;;:XX389933SSSSS1,              
          rHH9;ii;;;:8S;;13993SS5i                
          sHH8;iii;;:3hi::;rsrii,                 
,    .  ::5HH9,:::::,91;;.                        
*/    
/**
*author : chasonx
*createTime : 161207
*updateTime : 161209  161213 170728
*desc : 自定义tab选项卡插件，组合选项卡
*
*Chasonx.Tab(options);
*
*  options : {
	 id : '',
	 bHeight : 30,按钮高
	 bWidth : 80,按钮宽
	 fontColor : '', 标题字体获取焦点颜色
	 fontBlurColor : '', 标题失去焦点颜色
	 itemGroup : [  
	     {position : 'top|right', 按钮位置
	     items : [{
	 	 title : '', 标题
		 html : '',  内容
		 pannelId : '',  domID
		 focusColor : '', 获取焦点时颜色
		 blurColor : '', 失去焦点时颜色
		 handler : function(e){  e : 当前点击的tab元素
			 点击按钮时回调方法
		 }
	 }]
	 ]
}
*/
;(function(window,undefined){
	
	function tab(options){
		this.target = options.id;
		this.fontColor = options.fontColor || '#525151';
		this.fontBlurColor = options.fontBlurColor || '#a2a2a2';
		this.height = options.bHeight || 30;
		this.width = options.bWidth || 100;
		this.itemGroup = options.itemGroup || [];
		this.init();
	}

	tab.prototype = {
		style : {
			btn : 'cursor:pointer;position:absolute;font-size:14px;text-align:center;',
			panel : 'position:absolute;overflow:auto;padding:5px;',
			panelFocus : 'z-index:100;',
			panelBlur : 'z-index:90;',
			btnFocus : 'z-index:102;font-weight:bold;',
			btnBlur : 'z-index:90;',
			btnFocusColor : '#f6f6f6',
			btnBlurColor : '#e4e4e4'
		},
		cacheBtnRandom : [],
		cachePanelRandom : [],
		init : function(){
			var tPanel = $_e(this.target);
			if(!tPanel) return ;
			if(this.itemGroup.length == 0) return;

			tPanel.style.position = 'relative';
			this.cacheBtnRandom = [];
			this.cachePanelRandom = [];
			this.group(tPanel);
		},
		group : function(tPanel){
			var _this = this,_posi;
			this.items = [];
			this.each(this.itemGroup,function(m,n){
				_posi = n.position.split('|');
				_this.posi = 'top,bottom,left,right'.indexOf(_posi[0]) == -1?'top':_posi[0];
				_this.direct = 'top,bottom,left,right'.indexOf(_posi[1]) == -1?'left':_posi[1];
				_this.append(n.items,tPanel,true,m == 0);
			});	
		},
		append : function(items,tPanel,ffocus){
			var _this = this,random,_btn,_panel,_css,_pcss,_btnId,_panelId,_append;
			this.each(items,function(i,u){
				random = (Math.random() + "").replace(".","");
				_btnId = 'ChasonxTabBtn' + random;
				_panelId = 'ChasonxTabPanel' + random;
				_append = true;
				_panel = undefined;
				_css = _this.getCss(1,i);
				_pcss = _this.getCss(2);	
				
				if(i == 0 && ffocus){
					_css += _this.style.btnFocus;
					_css += 'color:' + _this.fontColor + ';';
					_css += _this.getBG(u.focusColor || _this.style.btnFocusColor);
					_pcss += _this.style.panelFocus;
					_pcss += _this.getBG(u.focusColor || _this.style.btnFocusColor);
				}else{
					_css += _this.style.btnBlur;
					_css += 'color:' + _this.fontBlurColor + ';';
					_css += _this.getBG(u.blurColor || _this.style.btnBlurColor);
					_pcss += _this.style.panelBlur;
					_pcss += _this.getBG(u.blurColor || _this.style.btnBlurColor);
				}
				_btn = ChasonTools.createEle({type:'span',id : _btnId,css:_css});	
				if(u.panelId) _panel = $_e(u.panelId);
				if(_panel == undefined){
					_panel = ChasonTools.createEle({type:'div',id : _panelId,css : _pcss});
					_panel.innerHTML = u.html || '';
				}else{
					_panelId = u.panelId;
					_panel.setAttribute('style',_pcss);
					_append = false;
				}
				_btn.innerText = u.title || '标题' + i;
				
				tPanel.appendChild(_btn);
				if(_append) tPanel.appendChild(_panel);

				_this.handler(_btn,_btnId,_panelId,u);
				_this.cachePanelRandom.push(_panelId);
				_this.cacheBtnRandom.push(_btnId);
				_this.items.push(u);
			});
		},
		getCss : function(t,_idx){
			var css = '';
			if(t == 1){ 
				css = this.style.btn;
				var br;
				css += 'vertical-align:middle;width:' + this.width + 'px;' + 'height:' + this.height + 'px;' + 'line-height:' + this.height + 'px;';
				if(this.posi == 'bottom' || this.posi == 'top'){
					css += 'display:inline-block;';
					if(this.direct  == 'right')	css += 'right:' + (this.width * this.getOffset(_idx,'right')) + 'px;';
					else css += 'left:' + (this.width * this.getOffset(_idx,'left')) + 'px;';

				    if(this.posi == 'bottom'){
						css += 'margin-top:' + ($_e(this.target).offsetHeight - this.height - 1) + 'px;';
						br = this.direct == 'left'?'0px 0px 5px 5px':'0px 0px 5px 5px';
				    }else{
				    	br = this.direct == 'left'?'5px 5px 0px 0px':'5px 5px 0px 0px';
				    }  
				}else{
					css += 'top:' + (this.height * this.getOffset(_idx,'top')) + 'px;';
					if(this.posi == 'right') css += 'margin-left:' + ($_e(this.target).offsetWidth - this.width - 1) + 'px;';
					css += 'display:block;';
					br = this.posi == 'left'?'5px 0px 0px 5px;':'0px 5px 5px 0px;';
				}
				css += 'border-radius: '+ br +';-moz-border-radius: '+ br +';-webkit-border-radius: '+ br +';';
			}else{
				css = this.style.panel;
				css += this.getPosi(this);	
			} 
			return css;
		},
		getOffset : function(idx,_dire){
			var _posi;
			this.each(this.itemGroup,function(i,u){
				_posi = u.position.split('|')[0];
				if(_posi && _posi == _dire) idx++;		
			});
			return idx;
		},
		getPosi : function(_this){
			var  css = '',_posi;
			this.each(this.itemGroup,function(i,u){
				_posi = u.position.split('|')[0];
				if(_posi){
					if(_posi == 'top') css += 'top:' + _this.height+ 'px;';
					if(_posi == 'left') css += 'left:' + _this.width + 'px;';
					if(_posi == 'bottom') css += 'bottom:' + _this.height + 'px;';
					if(_posi == 'right') css += 'right:' + _this.width + 'px;';
				}
			});
			css += css.indexOf('top') == -1?'top:0px;':'';
			css += css.indexOf('left') == -1?'left:0px;':'';
			css += css.indexOf('bottom') == -1?'bottom:0px;':''
			css += css.indexOf('right') == -1?'right:0px;':'';
			return css;
		},
		getBG : function(c){
			return 'background:' + c + ';';
		},
		each : function(data,fn){
			for(var i = 0,len = data.length;i < len;i++){
				if(typeof fn == 'function')
					if(fn(i,data[i]) == false) break;
			}
		},
		handler : function(e,btnId,panelId,item){
			var _this = this,_panObj,_blurBg,_focusBg,_btnObj,_panelObj;
			ChasonTools.addEventHandler(e,'click',function(){

				for(var j = 0,jlen = _this.cacheBtnRandom.length;j < jlen;j++){
					if(_this.cacheBtnRandom[j] != btnId){
						_blurBg = _this.items[j].blurColor || _this.style.btnBlurColor;
						_btnObj = $_e(_this.cacheBtnRandom[j]);
						_panelObj = $_e(_this.cachePanelRandom[j]);
						_btnObj.style.background = _blurBg; 
						_btnObj.style.zIndex = 90;
						_btnObj.style.color = _this.fontBlurColor;
						_btnObj.style.fontWeight = 'normal';
						_panelObj.style.zIndex = 90;
					} 
				}
				_focusBg = item.focusColor || _this.style.btnFocusColor;
				this.style.zIndex = 102;
				this.style.color = _this.fontColor;
				this.style.fontWeight = 'bold';
				this.style.background = _focusBg;

				_panObj = $_e(panelId);
				_panObj.style.zIndex = 100;
				_panObj.style.background = _focusBg;
				if(typeof item.handler == 'function') item.handler(_panObj);
			});
		}
	};

	function $_e(id){
		if( typeof( id ) != "string" ) return id;
		if( document.getElementById ) return document.getElementById( id );
		if( document.all ) return document.all[ id ];
		if( document.layers ) return document.layers[ id ];
		return undefined;
	}

	window.Chasonx.Tab = function(options){
		return new tab(options);
	};
})(window);