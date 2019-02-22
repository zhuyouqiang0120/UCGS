/**
 * 插件管理
 */
var TSPlugins = {
		_CodeMirror : null,
		pluginData : null,
		currentIdx : null,
		tabIdx : 0,
		list : function(){
			Chasonx.Wait.Show('正在加载插件');
			UCGS_DAO.getRecordList({modelName : 'Plugins'},function(data){
				console.debug(data);
				Chasonx.Wait.Hide();
				TSPlugins.pluginData = data.reData;
				var p = '';
				$.each(data.reData,function(i,u){
					p += '<div class="tsPagePlugins"><i class="'+ u.ficon +'"></i>'+ u.ftitle +'</div>';
				});
				$("#leftPanel").html(p);
			});
		},
		drawPlugInfo : function(){
			var I = this.pluginData[this.currentIdx];
			var line = '<p class="plugInfo"><i class="icon-extension" style="font-size:60px;"></i><font>version: '+ I.fversion +'</font></p>\
						<p class="plugInfo"><label>插件标题:</label><span>'+ I.ftitle +'</span></p>\
						<p class="plugInfo"><label>插件名称:</label><span>'+ I.fpluginame +'</span></p>\
						<p class="plugInfo"><label>状态:</label><span>'+ (I.fstate == 0?'<span class="badge badge_blue">正常</span>':'<span class="badge badge_del">禁用</span>') +'</span></p>\
						<p class="plugInfo"><label>创建人:</label><span>'+ I.fdevname +'</span></p>\
						<p class="plugInfo"><label>创建时间:</label><span>'+ I.fcreatetime +'</span></p>\
						<p class="plugInfo"><label>最后修改时间:</label><span>'+ I.fmodifytime +'</span></p>\
						<p class="plugInfo"><label>大小:</label><span>'+ fileSizeForamt(I.fsize) +'</span></p>\
						<p class="plugInfo"><label>描述:</label><span>'+ StrKit.defVal( I.fremark) +'</span></p>';
			$("#pluginTab0").html(line);	
		},
		viewSource : function(){
			if(this.currentIdx == null) return;
			var pname = this.pluginData[this.currentIdx].fpluginame;
			Chasonx.Wait.Show();
			$.ajax({
				url : DefConfig.Root + '/res/plugs/mod/pdesigner/plugins/' + pname + '.js',
				dataType : 'text',
				success : function(data){
					TSPlugins._CodeMirror.setValue(data);
					Chasonx.Wait.Hide();
				},
				error : function(e){
					Chasonx.Hint.Faild('加载出错');
					Chasonx.Wait.Hide();
				}
			});
		},
		modify : function(T){
			if(this.currentIdx == null) return;
			var _plug = this.pluginData[this.currentIdx];
			Chasonx.Alert({
				alertType : 'warning',
				modal : true,
				html : '确定 ['+ (T == 0?'启用':'禁用') +' '+ _plug.ftitle +'] 插件吗？',
				success : function(){
					UCGS_DAO.modify({modelName : 'Plugins',fstate : T,id : _plug.id},function(){
						TSPlugins.pluginData[TSPlugins.currentIdx].fstate = T;
						TSPlugins.drawPlugInfo();
					});
					return true;
				}
			});
		},
		setTabIdx : function(idx){
			this.tabIdx = idx;
			this.tabClick();
		},
		tabClick : function(){
			switch(this.tabIdx){
			case 0: this.drawPlugInfo(); break;
			case 1: this.viewSource(); break;
			case 2: break;
			}
		}
};

window.onload = function(){
	
	var skinName = _GetSkinName();
	var fc,fcb,fb,fbb;
	
	if('lightblue' == skinName){
		fc = '#4a4747';
		fcb = '#525252';
		fb = '#191e27';
		fbb = '#2b3244';
	}else{
		fc = '#f1f1f1';
		fcb = '#b1b1b1';
		fb = '#2e394e';
		fbb = '#222835';
	}
	
	Chasonx.Frameset({
		  main : 'mainPanel',
	      window : {
	          top : { id : 'topPanel', height : '70px',bgColor : false,border : false},
	          left : { id : 'leftPanel',width : '20%',slide : false,bgColor : false,border : false,title : '插件列表',titleBgColor : false,color : '#b7b4b4'},
	          right:{ id:'rightPanel', width : '80%' ,bgColor : false ,border : false}
	      }
	});
	
	Chasonx.Tab({
	   	id : 'rightPanel',
	   	bHeight : 30,
	   	bWidth : 150,
	   	fontColor : fc,
	   	fontBlurColor : fcb,
	   	itemGroup :[
	   	      {  
	   	    	  position : 'top|left',
				  items :[{
				   		title : '插件信息',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId : 'pluginTab0',
				   		handler : function(){
				   			TSPlugins.setTabIdx(0);
				   		}
				   	},
				   	{	
				   		title : '源码',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId  : 'pluginTab1',
				   		handler : function(){
				   			TSPlugins.setTabIdx(1);
				   		}
				   	},
				   	{
				   		title : 'API',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId  : 'pluginTab2',
				   		handler : function(){
				   			TSPlugins.setTabIdx(2);
				   		}
				   	}]
	   	      	}
	   	    ]
	});
	
	TSPlugins._CodeMirror = CodeMirror($("#pluginTab1")[0],{
			readOnly : "nocursor",
			extraKeys: {"Ctrl-Space": "autocomplete"},
			theme : "base16-dark",
			height : '100%',
			autoMatchParens : true,
			lineNumbers : true
		});
	TSPlugins._CodeMirror.setSize('100%','100%');
	
	$(".tsPagePlugins").live('click',function(){
		$("div[class='tsPagePlugins tsPagePluginsFocus']").removeClass('tsPagePluginsFocus');
		$(this).addClass('tsPagePluginsFocus');
		TSPlugins.currentIdx = $(this).index();
		TSPlugins.tabClick();
	});
	
	TSPlugins.list();
};