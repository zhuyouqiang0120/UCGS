
var SiteList = {
	  table : null,
	  _cacheData : null,
	  modify : function(T,D){
		  D = D || {};
		  var winSize = ChasonTools.getWindowSize();
		  var _menuDialog = new Chasonx({
			 title:'新建站点信息',
			 html : '<div id="sitePanel" class="adminUserPanel global_bg_c" style="width:50%;"></div><div id="adminAreaPanel" class="adminUserPanel global_bg_c" style="width:50%;"></div>',
			 modal : true,
			 width:winSize[2] * 0.6,height:winSize[3] * 0.7,
			 success:function(){
				 if(FormData.requiredByAttr('sitePanel',['input'])){
					 var data = FormData.getFormData('sitePanel',['input','select','textarea']);
					 data['type'] = T;
					 data['fareaguid'] =  $("#siteAreaGuid").attr('data');
					 if(T == 2) data['id'] = D.id;
					 
					 if(data.fareaguid == '' || data.fareaguid == D.fareaguid){
						 SiteList.exec(data);
						 return true;
					 }else{
						 Chasonx.Alert({
							 html : '确定将区域从：<b>' + (D.areaname || '无区域') + '</b> 变更为：<b>' + $("#siteAreaGuid").val() + '</b> 吗？',
							 width: 350,height:200,
							 success : function(){
								 SiteList.exec(data);
								 _menuDialog.Hide();
								 return true;
							 },
							 modal : true
						 });
					 }
				 }
			 }
		  });
		  
		  ChasonxDom.draw({
			  id : 'sitePanel',
			  item : [
			      {text:'&nbsp;',type:'br',info:'&nbsp;'},
			      {text:'网站名称:',name:'fsitename',attr:'maxlength="20" req = "true"',type:'input',value : (D.fsitename || ''),info:'<font color="red">必填</font>'},
			      {text:'网站别名:',name:'fsitealias',type:'input',value:(D.fsitealias || ''),attr:' maxlength="50" req = "true" ',info:'<font color="red">必填</font><span style="color:red">(如：alibaba)</span>',
			       handler:{
			    	  type : 'blur',
			    	  event : function(){
			    		  if(T == 2 && D.fsitealias == this.value){
			    			  return $("#showSiteErr").html('');
			    		  }
			    		  
			    		  if(/[\u4E00-\u9FA5]/.test(this.value)) return this.value = '';
			    		  
			    		  var I = this;
			    		  if(this.value != ''){
				    		  $.ajax({
				    			 url : DefConfig.Root + '/main/site/validateAlias',
				    			 type:'post',
				    			 dataType:'json',
				    			 data:{'alias':this.value},
				    			 success : function(d){
				    				 if(~~d > 0){
				    					 $("#showSiteErr").html('<span class="badge badge_del">&nbsp;该网站别名['+ I.value +']已被使用了&nbsp;</span>');
				    					 I.value = '';
				    				 }else{
				    					 $("#showSiteErr").html('');
				    				 }
				    			 },
				    			 error : function(e){}
				    		  });
			    		  }
			    	  }
			      }},
			      {text:'标识码:',name:'fmark',type:'input',attr:' maxlength="50" ',value : (D.fmark || '')},
			      {text:'网站类型:',name:'ftype',type:'select',value : (D.ftype || ''),options:[{v:'normal',t:'常规'},{v:'public',t:'公共网站'}]},
			      {text:'发布时间:',name:'fissuestarttime',type:'time',value : (D.fissuestarttime || '')},
			      {text:'结束时间:',name:'fissueendtime',type:'time',value : (D.fissueendtime || '')},
			      {text:'选择区域:',name:'siteAreaGuid',type:'input',attr:' data="'+ (D.fareaguid || '') +'" readonly="readonly" ',value : (D.areaname || ''),info : '右侧选择区域'},
			      {text:'状态:',name:'fstate',type:'select',value : (D.fstate || ''),options : [{v:'0',t :'待发布'},{v:'1',t :'发布'}]},
			      {text:'可用设备:',name:'fusedevice',type:'select',value : (D.fusedevice || ''),options:[{v:'0',t:'PC'},{v:'1',t:'移动设备'},{v:'2',t:'平板'},{v:'3',t:'智能电视'},{v:'4',t:'机顶盒'},{v:'5',t:'通用'}]},
			      {text:'备注:',name:'fremark',type:'textarea',attr:' maxlength="150" ',value : (D.fremark || '')},
			      {text:'预览地址:',name:'fpreviewindex',type:'input',attr:' maxlength="100" ',value : (D.fpreviewindex || '')},
			      {text:'&nbsp;',type:'br',info:'<span id="showSiteErr"></span>'}
			  ]
		  });
		  
		  if(Area.areaData != null)	  Area.draw(Area.areaData,'adminAreaPanel',[],function(){
			  $("#siteAreaGuid").val(Area.currArea.fname).attr('data',Area.currArea.fguid);
		  });
		  
	  },
	  exec : function(data){
		  $.ajax({
			  url:DefConfig.Root + '/main/site/modify',
			  type:'post',
			  dataType:'json',
			  data:data,
			  success:function(d){
				  Chasonx.Hint.Success('操作成功');
				  SiteList.getList();
			  },
			  error:function(e){
				  Chasonx.Hint.Faild(e.responseText);
			  }
		  });
	  },
	  getArea : function(){
		  Area.list('areaPanel',[],function(){
			  SiteList.getList(false, Area.currArea.fguid);
		  });
	  },
	  getList : function(Q,AE){
		  var data = {'del':0,'areaguid':(AE != undefined?AE:'')};
		  if(Q == true){
			  data['queryType'] = $("#queryType").val();
			  data['queryState'] = $("#queryState").val();
			  data['siteName'] = $("#queryTitle").val();
		  }
		  
		  this.table.data = data;
		  this.table.getData(function(data){
			  SiteList._cacheData = data.list;
		  });
	  },
	  modifyState : function(T){
		  this.choose(function(S){
			  Chasonx.Alert({
				  html : '确定修改网站状态为：' + (T == 0?'待发布':'发布') + ' 吗？',
				  modal : true,
				  success : function(){
					  SiteList.exec({'id':S.val(),'fstate':T,'type':2});
					  return true;
				  }
			  });
		  });
	  },
	  edit : function(){
		this.choose(function(S){
			getAjaxData(DefConfig.Root + '/main/site/siteEntity',{'id':S.val()},function(d){
				SiteList.modify(2,d);
			});
		});
	  },
	  del : function(){
		this.choose(function(S){
			if(S.attr('state') == 1){
				Chasonx.Alert({
					alertType : 'error',
					html : '当前网站处于发布中，禁止删除。',
					modal : true
				});
			}else{
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除网站吗？',
					modal:true,
					success : function(){
						SiteList.exec({'id':S.val(),'fdelete':1,'type':2});
						return true;
					}
				});
			}
		});
	  },
	  changeTemp : function(){
		  this.choose(function(d){
			  TempDialog.show(d.attr('guid'),function(tempguid){
				 if(tempguid != undefined){
					 Chasonx.Alert({
						 html : '确定更改网站模版吗?',
						 success : function(){
							 SiteList.exec({'type':2,'id':$("input[type='checkbox'][name='site']:checked").val(),'ftempguid':tempguid});
							 return true;
						 }
					 });
				 }
			  });
		  });
	  },
	  choose : function(cb){
		  var site = $('input[type="checkbox"][name="site"]:checked');
		  if(site.size() > 0)
			   cb(site);
		  else Chasonx.Hint.Faild('请选择一项后进行操作');
	  },
	  getCurrentSiteData : function(_siteGuid){
		  if(this._cacheData == null) return null;
		  
		  var _si = null;
		  $.each(this._cacheData,function(i,u){
			  if(u.fguid == _siteGuid){
				  _si = u;
				  return false;
			  }
		  });
		  return _si;
	  }
};

function getState(s){
	var v = '';
	switch(s){
	case 0: v = '<span class="badge badge_gray">待发布</span>'; break;
	case 1: v = '<span class="badge badge_blue">发布</span>';break;
	}
	return v;
}

var CacheServerSetting = {
		choosePane : function(){
			SiteList.choose(function(_site){
				var cacheServerPane = new Chasonx({
					title : 'CacheServer 选择',
					html : '<div id="cacheServerPane" class="global_bg_c"></div>',
					width : 500,height : 380,
					modal : true,
					success : function(){
						//console.log($("#server_guid").val());
						SiteList.exec({id : _site.val(),fcache_server_guid : $("#server_guid").val(),type : 2});
						//return true;
					}
				});
				ChasonxDom.draw({
					  id : 'cacheServerPane',
					  item : [
					      {text : '',type:'br' , info : '&nbsp;'},
					      {text : '',type:'br' , info : '&nbsp;'},
					      {text:'选择服务器:',name:'server_guid',type:'select',attr : ' style="width : 90%;" '},
					      {text:'',type:'br',info : '&nbsp;'},
					      {text:'',type : 'br',info : '<i class="icon_tip"></i>不设置CacheServer将使用默认值，若没有默认值则不进行映射'},
					      {text:'',type : 'br',info : '<i class="icon_tip"></i>冻结中的CacheServer将不会被映射'}
					      ]
				});
				getAjaxData(DefConfig.Root + '/main/config/listCacheServer',null,function(d){
					var line = ['<option value="">--选择server</option>'];
					$.each(d.data,function(i,u){
						line.push('<option value="'+ u.guid +'">'+ u.server_name + ' [' + DefConfig.CacheServer.getState(u.cache_state) +']</option>');
					});
					$("#server_guid").html(line.join(''));
				});
			});
		}
};

$(function(){

	SiteList.getArea();
	
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '68px',bgColor : false,border:false},
			left : {id : 'centerPanel',width : '0%',bgColor : false,border:false},
			right: {id : 'rightPanel',bgColor : false,border:false}
			}
	});
	
	Chasonx.DragBox({
		target : 'rightPanel',
		lineColor : _GetBoxLineColor(),
		items : [
		         {id : 'dragPanelLeft',width : '15' },
		         {id : 'dragPanelRight',width : '85' }
		        ]
	});
	
	$("#queryTitle").bind('keypress',function(e){
		e = e || window.event;
		if(e.keyCode == 13){
			SiteList.getList(true);
		}
	});
	
	$("#cacheServerSetting").live('click',function(){
		CacheServerSetting.choosePane();
	});
	
    var _handler = function(v){ return getString(v);}
	SiteList.table =  Chasonx.Table({
		id : 'siteListTable',
		url : DefConfig.Root + '/main/site/sitelist',
		dataPanel : 'dragPanelRight',
		check : {name:'site',value:'id',attr:{"guid":"fguid","state":"fstate","alias":"fsitealias"}},
		tableNames : [
		      {name : 'fsitename',text : '站点名',width : '9%',handler : function(v,u){ return v + (u.ftype == 'public'?'<font color="red"> [公共] </font>':'<font color="#a3a3a3"> [常规] </font>') + 
		    	  (u.fbindsitetype == 1?'<font color="#ddb10f">[已关联]</font>':u.fbindsitetype == 2?'<font color="#ddb10f">[已绑定]</font>':''); }},
		      {name : 'fsitealias',text : '别名',width : '9%'}, 
		      {name : 'areaname',text : '区域',width : '9%',handler : _handler},
		      {name : 'fstate' ,text : '状态' ,width : '9%',handler : function(v){ return getState(v);}},
		      {name : 'fmark' ,text : '标识码' ,width : '5%',handler : _handler},
		      {name : 'fissuestarttime|fissueendtime' ,text : '发布/结束时间' ,width : '13%' ,handler : _handler},
		      {name : 'fcreatetime' ,text : '创建时间' ,width : '9%'},
		      {name : 'fadminname' ,text : '创建人' ,width : '9%'},
		      {name : 'server_name' ,text : 'CacheServer' ,width : '9%',handler:_handler},
		      {name : 'fremark' ,text : '备注' ,width : '9%',handler:_handler}
		             ]
	}).createTable();
	SiteList.getList();
	
	Chasonx.TableResizable('siteListTable');
});