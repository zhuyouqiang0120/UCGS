$(document).ready(function(){
	$(".menu > .mcomRight > input").live('click',function(){
		$(this).next('span').css('color',$(this).attr('checked')?'#fc1b0f':'#fff');
	});
});

var AdminGroup = {
	 menuData : null,
	 comperData : null,
	 currRole : null,
	 tabCurrIndex : 0,
	 dimensionGuid : null,
	 load : function(id,_guid){
		 if(this.dimensionGuid == null) return Chasonx.Hint.Faild('不能加载角色');
		 _guid = _guid || '';
		 $.ajax({
			url:DefConfig.Root + '/main/admingroup/rolelist',
			type:'post',
			dataType:'json',
			data : {'dimensionguid':this.dimensionGuid},
			success:function(d){
				var html = '';
				if(d.length > 0){
					$.each(d,function(i,u){
						html += '<div class="roleItem'+ (_guid == u.fguid?' roleItemFocus':'') +'" val="'+ u.id +'" data="'+ u.fguid +'" admin="'+ u.fisadmin +'" gname="'+ u.fgname +'" dimensionguid="'+ u.dimensionguid +'"  state="'+ u.fstate +'"><i class="roleIcon"></i>'+ u.fgname + (u.fstate == 1?'<font color="red">角色冻结</font>':'') +'</div>';
					});
				}else{
					html = '<div class="roleItem" data="" gname="" dimensionguid="" areaguid="" state="">未添加角色</div>';
				}
				$("#" + id).html(html);
			},
			error:function(e){
				Chasonx.Hint.Faild('系统出错!<br/>' + e.status + '：' + e.statusText);
			}
		 });
	 },
	 loadUser : function(id,callback){
		 if(this.dimensionGuid == null) return Chasonx.Hint.Faild('不能加载账户');
		 getAjaxData(DefConfig.Root + '/main/admin/adminUsersByDimension',{'dimensionGuid':this.dimensionGuid},function(d){
			 var html = '';
				if(d.length > 0){
					$.each(d,function(i,u){
						html += '<div class="roleItem" data="'+ u.fguid +'" ><i class="roleIcon"></i>'+ u.fadminname + '&nbsp;<font color="#716e6e">' + (u.fdimensionname || '') + ' / ' + (u.fgname || '') + '</font>' + (u.fstate == 1?'<font color="red">角色冻结</font>':'') +'</div>';
					});
				}else{
					html = '<div class="roleItem" data="" state="">未添加角色</div>';
				}
				$("#" + id).html(html);
		 });
	 },
	 comSet : {
		menu : function(D){
			MenuDialog.show('ftargetauthguid',D,function(html){
				 $("#roleMenuPanel").html(html).find('.menuComSetBox').css('height','auto');
			 });
		},
		saveMenu : function(T){
			if(AdminGroup.currRole == null) return Chasonx.Hint.Faild('请选择角色');
			var _com = MenuDialog.getCompArray();
			if(_com[0].length == 0) return Chasonx.Hint.Faild('请选择菜单');
			Chasonx.Alert({
				alertType : (T == 1?'normal':'warning'),
				html : (T == 1? '确定为该角色设置菜单权限吗？':'确定解除该角色菜单权限吗？'),
				success : function(){
					
					 AdminGroup.exec({'marr':_com[0],'comarr':_com[1],'type':4,'adminGroup.fguid':AdminGroup.currRole.attr('data') ,'exType':(T == 1?'update':'del')}
					 ,function(){
						 $(".roleItem[data='"+ AdminGroup.currRole.attr('data') +"']").click();
					 });
					 
					 return true;
				},
				modal:true
			});
			
		},
		site : function(D){
			//Area.currArea.fguid
			PublicSite.list("",function(html){
				$("#roleSitePanel").html( html);
			},D,"ftargetauthguid");
		},
		saveSite : function(T){
			if(AdminGroup.currRole == null) return Chasonx.Hint.Faild('请选择角色');
			var site = PublicSite.getCheckVal();
			if(site.length == 0) return Chasonx.Hint.Faild('请选择网站');
			
			Chasonx.Alert({
				alertType : (T == 1?'normal':'warning'),
				html : (T == 1? '确定为该角色设置网站权限吗？':'确定解除该角色网站权限吗？'),
				success : function(){
					 getAjaxData(DefConfig.Root + '/main/site/permission',{'type':T,'roleid':AdminGroup.currRole.attr('data'),'siteguid':site},function(){
						 Chasonx.Hint.Success('操作成功');
						 $(".roleItem[data='"+ AdminGroup.currRole.attr('data') +"']").click();
					 });
					 return true;
				},
				modal:true
			});
		},
		colList : function(obj){
			PublicCol.list('columnTree',{'id':obj.val(),'name':obj.find('option:selected').text(),'state':1},null,function(){
				PermissionLoad.hadColumn();
			});
		},
		saveCol : function(T){
			var colGuid = this.getChooseCol("columnTree");
			if(colGuid.length == 0) return Chasonx.Hint.Faild('请选择栏目');
			
			Chasonx.Alert({
				alertType : (T == 1?'normal':'warning'),
				html : '确定' + (T == 1?'设置':'解除') + '该角色的栏目权限吗?',
				success : function(){
					getAjaxData(DefConfig.Root + '/main/column/permission',{'type':T,'roleId':AdminGroup.currRole.attr('data'),'colGuid':colGuid,'siteGuid':$("#hasSiteList").val()},function(d){
						Chasonx.Hint.Success('操作成功');
						PermissionLoad.hadColumn();
					});
					return true;
				},
				modal : true
			});
		},
		getChooseCol : function(treeId){
			var colArray = $("#" + treeId).tree('getChecked',['checked','indeterminate']);
			var colGuid = [];
			$.each(colArray,function(i,u){
				if(u.id != 0)	colGuid.push(u.guid);
			});
			return colGuid;
		}
	 },
	 areaSet : {
		 saveArea : function(T){
			 if(AdminGroup.currRole == null) return Chasonx.Hint.Faild('请选择角色');
			 
			 var _checkName = null;
			 if(T == 2) _checkName = "hadAreaValue";
			 
			 var areas = Area.getCheckValus(_checkName);
			 if(areas.length == 0) return Chasonx.Hint.Faild('请先选择区域');
			 
			 Chasonx.Alert({
					alertType : (T == 1?'normal':'warning'),
					html : '确定' + (T == 1?'设置':'解除') + '该角色的区域权限吗?',
					success : function(){
						getAjaxData(DefConfig.Root + '/main/adminarea/permission',{'type':T,'roleId':AdminGroup.currRole.attr('data'),'areaGuid':areas},function(d){
							Chasonx.Hint.Success('操作成功');
							PermissionLoad.hadArea();
						});
						return true;
					},
					modal : true
				});
		 }
	 },
	 addGroup : function(T){
		 if(this.dimensionGuid == null) return Chasonx.Hint.Faild('请先选择组织机构');
		 if(T == 2 && AdminGroup.currRole == null) return;
		 
		 new Chasonx({
			 title:'角色信息编辑',
			 width:450,
			 height:280,
			 html:'<div id="adminrolePanel"></div>',
			 modal:true,
			 success:function(){
				 if(FormData.requiredByAttr('adminrolePanel',['input','select'])){
					 var data = FormData.getFormData('adminrolePanel',['input','select']);
					 data['type'] = T;
					 data['adminGroup.fdimensionguid'] = AdminGroup.dimensionGuid;
					 data['adminGroup.fisadmin'] =  $("input[type='checkbox'][name='roleIsAdmin']:checked").val();
					 if(T == 2) data['adminGroup.id'] = AdminGroup.currRole.attr('val');
					 AdminGroup.exec(data,function(){
						 //$("div[class='areaItems areaItemsFocus']").click();
						 AdminGroup.load('rolePanel');
					 });
					 return true;
				 }
			 }
		 });
		 
		 ChasonxDom.draw({
			  id : 'adminrolePanel',
			  item : [
			      {text:'&nbsp;',type:'br',info:'&nbsp;'},
			      {text:'角色名:',name:'adminGroup.fgname',type:'input',attr : ' req="true" ',value : (T == 2?AdminGroup.currRole.attr('gname'):'')},
			      {text:'状态:',name:'adminGroup.fstate',type:'select',value : (T == 2?AdminGroup.currRole.attr('state'):''),options : [{v:'0',t :'正常'},{v:'1',t :'冻结'}]},
			      {text:'设为管理员:',name:'roleIsAdmin',type:'checkbox',value : (T == 2?AdminGroup.currRole.attr('admin'):''),options:[{v:0,t:'否'},{v:1,t:'是'}]},
			      {text:'&nbsp;',type:'br',info:'<i class="icon_warning"></i><font size="2" color="#04a0e8">设为管理员权限后可操作该角色的所有菜单功能。</font>'}
			      ]
		 });
		 
		 $("input[type='checkbox'][name='roleIsAdmin']").bind('click',function(){
			 $("input[type='checkbox'][name='roleIsAdmin']").attr('checked',false);
			 $(this).attr('checked',true);
		 });
	 },
	 delGroup : function(){
		 if(this.currRole == null)  return Chasonx.Hint.Faild('请先选择角色');
		 
		 Chasonx.Alert({alertType:'warning',html:'确定删除该角色吗?',modal:true,success:function(){
			 AdminGroup.exec({'guid':AdminGroup.currRole.attr('data'),'type':3},function(){
				 //$("div[class='areaItems areaItemsFocus']").click();
				 AdminGroup.load('rolePanel');
			 });
			 return true;
		 }});
	 },
	 exec : function(data,callback){
		 $.ajax({
			 url:DefConfig.Root + '/main/admingroup/admingroupmodify',
			 type:'POST',
			 dataType:'json',
			 data:data,
			 success:function(d){
				 Chasonx.Hint.Success({text:'操作成功'});
				 if(typeof(callback) == 'function') callback();
			 },
			 error:function(e){
				 Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
			 }
		 });
	 },
	 getCompStr : function(type,id){
		 var _gname = $("#groupname").val();
		 if(_gname != ''){
			 var _com = MenuDialog.getCompArray();
			 var data = {'adminGroup.fgname':_gname,'marr':_com[0],'comarr':_com[1],'type':type};
			 if(type == 2) data['adminGroup.id'] = id;
			 this.exec(data);
		 }
	 },
	 slideCom : function(id,O){
		 if($("#" + id).height() == 34){
			 $("#" + id).css('height','auto');
			 $(O).removeClass('node_1').addClass('node_');
		 }else{
			 $("#" + id).css('height','34px');
			 $(O).removeClass('node_').addClass('node_1');
		 }
	 }
};

function menuSetting(){
	AdminGroup.tabCurrIndex = 0;
}

function siteSetting(){
	AdminGroup.tabCurrIndex = 1;
	//if(Area.currArea != null) 
	AdminGroup.comSet.site();
	if(AdminGroup.currRole != null) PermissionLoad.site();
}

function columnSetting(){
	AdminGroup.tabCurrIndex = 2;
	if(AdminGroup.currRole != null) PermissionLoad.column();
}

function areaSetting(){
	AdminGroup.tabCurrIndex = 3;
	if(AdminGroup.currRole != null) PermissionLoad.hadArea();
}

var PermissionLoad = {
		menu : function(){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/admingroup/admingroupgrouplist',{'guid':AdminGroup.currRole.attr('data')},function(d){
				Chasonx.Wait.Hide();
				AdminGroup.comSet.menu(d);
			});
		},
		site : function(callback){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/permissionList',{'roleid':AdminGroup.currRole.attr('data')},function(d){
				Chasonx.Wait.Hide();
				AdminGroup.comSet.site(d);
			});
		},
		column : function(){
			$("#columnTree").html('');
			$("#hasRoleColumnTree").html('');
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/adminRoleSiteList',{'roleId':AdminGroup.currRole.attr('data')},function(d){
				Chasonx.Wait.Hide();
				var op = '<option value="">--请选择--</option>';
				$.each(d,function(i,u){
					op += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				});
				$("#hasSiteList").html(op).bind('change',function(){
					AdminGroup.comSet.colList($(this));
				});
			});
		},
		hadColumn : function(){
			var site = $("#hasSiteList");
			getAjaxData(DefConfig.Root + '/main/column/permissionList',{'siteGuid':site.val(),'roleId':AdminGroup.currRole.attr('data')},function(d){
				PublicCol.genner("hasRoleColumnTree",d,{'id':site.val(),'name':site.find('option:selected').text()},null,function(){
					$.each(d,function(i,u){
						$("#columnTree").tree('check',$("#columnTree").tree('find',u.id).target);
					});
				});
			});
		},
		hadArea : function(){
			var userGuid = AdminGroup.currRole.attr('data');
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/adminarea/permissionList',{'userGuid':AdminGroup.currRole.attr('data')},function(d){
				Area.draw(d,"hadAreaListPanel",[],null,true,"hadAreaValue");
				Chasonx.Wait.Hide();
			});
		}
};

/*window.onload = function(){
	Area.list('areaPanel',[],function(){
		AdminGroup.load('rolePanel',Area.currArea.fguid,function(){
			if(AdminGroup.tabCurrIndex == 0) PermissionLoad.menu();
			else if(AdminGroup.tabCurrIndex == 1)	PermissionLoad.site();
			else if(AdminGroup.tabCurrIndex == 2) PermissionLoad.column();
		});
		
		if(AdminGroup.tabCurrIndex == 1) AdminGroup.comSet.site();
	});
	
	AdminGroup.comSet.menu();
};*/

