
var AdminUser = {
		group : null,
		dimensionNode : null,
		roleGuid : null,
		childRoleArray : [],
		_table : null,
		getGroup : function(){
			$.ajax({
				url:DefConfig.Root + '/main/admingroup/admingroupentitylist',
				type:'POST',
				dataType:'json',
				success:function(d){
					AdminUser.group = d;
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			});
		},
		drawGroup : function(id,T){
			var h = '';
			$.each(this.group,function(i,u){
				if(T === 1){
					h += '<option value="'+ u.id +'" ' + (id == u.id?'selected="selected"':'') + '>'+ u.fgname +'</option>';
				}else{
					if(id == u.id)	h = u.fgname;
				}
			});
			return h;
		},
		compSet : function(){
			var _ad = $("input[type='checkbox'][name='admin']:checked"),T = 1;
			if(_ad.size() > 0){
				$.ajax({
					url:DefConfig.Root + 'main/admin/adminuserhascomlist',
					type:'POST',
					dataType:'json',
					data:{'adminid':_ad.val()},
					success:function(d){
						if(d.length != 0){
							T = 2;
						}
						MenuDialog.show('fmenuid',d,function(html){
							 new Chasonx({title:'权限设置',width:650,height:510,html:html,modal:true,success:function(){
								var com = MenuDialog.getCompArray();
								AdminUser.execComp({'type':T,'adminId':_ad.val(),'marr':com[0],'comarr':com[1]});
								 return true;
						     }});
						 });
					},
					error:function(e){
						Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
					}
				});
			}else{
				Chasonx.Hint.Faild({text:'选择用户后进行设置'});
			}
		},
		add : function(data,type){
			if(type == 1 && this.dimensionNode == null) return Chasonx.Hint.Faild('请先选择机构');
			data = data || {};
			if(type == 2){
				this.dimensionNode = {};
				this.dimensionNode.value = data.fdimensionname;
				this.dimensionNode.guid = data.fdimensionGuid;
			}
			
			var winSize = ChasonTools.getWindowSize();
			var _w = winSize[2]*0.6,_h = winSize[3]*0.4;
			 new Chasonx({title:(type == 1?'新增':'编辑') + '系统用户',width:_w,height:_h,
				 html:'<div id="adminUserPanel" class="adminUserPanel global_bg_c"></div>\
					   <div class="adminUserPanel global_bg_c" style="width:60%;"><b>'+ (this.dimensionNode.value || '未设置机构') +'</b> 角色：\
					   <div id="userRolePanel"></div></div>',
				 modal:true,
				 success:function(){
					 if(FormData.requiredByAttr('adminUserPanel',['input'])){
						 var formData = FormData.getFormData('adminUserPanel',['input','select','textarea']);
						 	 formData['otype'] = type;
						 	 formData['fdimensionGuid'] = AdminUser.dimensionNode.guid;
						 	 formData['froleguid'] = AdminUser.roleGuid;
						 	 formData['fdimensionname'] = AdminUser.dimensionNode.value;
						 if(type == 2) formData['id'] = data.id;
						 AdminUser.exec(formData);
						 return true;
					 }
				 }
			 });
			 
			 ChasonxDom.draw({
				  id : 'adminUserPanel',
				  item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'昵称:',name:'fadminname',type:'input',attr : ' maxlength="12" req="true"',value : (data.fadminname || '')},
				      {text:'登录名:',name:'fadminuser',attr:' maxlength="16" req = "true" ' + (type == 2?'readonly="readyonly"':''),type:'input',value : (data.fadminuser || ''),
				       handler : {
				    	   type : 'blur',
				    	   event : function(){
				    		   if(type == 2) return;
				    		   AdminUser.validateLoginName(this);
				    	   }
				       },info : '(5-16位字符)<font color="red" id="add_adminuser_error"></font>'},
				      {text:'密码:',name:'fadminpwd',type:'input',atype : 'password',value : '',attr : ' maxlength="40" '},
				      {text:'邮箱:',name:'femail',type:'input',value : (data.femail || ''),attr : ' maxlength="50" '},
				      {text:'状态:',name:'fstate',type:'select',value : (data.fstate || ''),options:[{v:'0',t:'正常'},{v:'1',t:'冻结'}]},
				      {text:'备注:',name:'fremark',type:'textarea',value : (data.fremark || ''),attr : ' maxlength="150" '},
				      {text:'&nbsp;',type:'br',info:'<span ></span>'}
				  ]
			  });
			 
			 AdminGroup.dimensionGuid = data.fdimensionGuid || this.dimensionNode.guid;
			 AdminGroup.load('userRolePanel',data.froleguid || null);
			 this.roleGuid = data.froleguid || null;
		},
		validateLoginName : function(obj){
			var patrn = /^([a-zA-Z0-9]|[._]){5,20}$/ig;
			$("#add_adminuser_error").html('');
			if(!patrn.exec(obj.value)){
				obj.value = '';
			}else{
				$.ajax({
					url:DefConfig.Root + '/main/admin/validateUserName',
					type:'post',
					data:{'username':obj.value},
					success:function(d){
						if(~~d > 0){
							$("#add_adminuser_error").html('<span class="badge badge_del">该登录名已被使用了</span>');
							obj.value = '';
						}else{
							$("#add_adminuser_error").html('');
						}
					},
					error:function(e){
						Chasonx.Hint.Faild('验证失败');
					}
				});
			}
		},
		update : function(){
			var _ad = $("input[type='checkbox'][name='admin']:checked");
			if(_ad.size() > 0){
				$.ajax({
					url:'admin/adminEntity',
					type:'post',
					dataType:'json',
					data:{'userkey':_ad.val()},
					success:function(d){
						AdminUser.add(d,2);
					},
					error:function(e){
						Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
					}
				});
			}else{
				Chasonx.Hint.Faild({text:'请选择选项后编辑'});
			}
		},
		updPwd : function(){
			var _ad = $("input[type='checkbox'][name='admin']:checked");
			if(_ad.size() > 0){
				var html = '<table id="upwdEditer" class="global_bg_c" border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">\
					<tr><td width="25%" align="right">密		码：</td><td><input id="fpassword"  maxlength="20" type="password" onblur="AdminUser.validate(this,1)" class="inputText" />(5-20位字母开头密码)</td></tr>\
					<tr><td width="25%" align="right" style="vertical-align:top">确认密码：</td><td  style="vertical-align:top"><input id="fpassword2"  maxlength="20" type="password" class="inputText" onblur="AdminUser.checkpwd()"/></td></tr>\
					</table>';
				var upwd = new Chasonx({
					 width:500,height:260,
					 html:html,title:'修改密码',
					 success:function(){
						 if(FormData.required('upwdEditer',["input"])){
							 AdminUser.exec({'otype':2,'id':_ad.val(),'fadminpwd':$("#fpassword").val()});
							 upwd.Hide();
						 }
					 },
					 modal:true
				});
			}else{
				Chasonx.Hint.Faild({text:'请选择选项后编辑'});
			}
		},
		del : function(){
			var _ad = $("input[type='checkbox'][name='admin']:checked");
			if(_ad.size() > 0){
				Chasonx.Alert({alertType:'warning',modal:true,success:function(){
					var ukey = '';
					_ad.each(function(){
						ukey += ';' + $(this).val();
					});
					AdminUser.exec({'otype':3,'ukeyStr':ukey});
					return true;
				}});
			}else{
				Chasonx.Hint.Faild({text:'请选择选项后执行删除'});
			}
		},
		load : function(){
			this._table.data['dimensionGuids'] = this.childRoleArray;
			this._table.getData();
			/*Chasonx.Ajax({
				 url:DefConfig.Root + '/main/admin/adminuserlist',
				 PageNumber:0,
				 PageSize:10,
				 data : {'adminUser.fstate':0},
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ AdminUser.drawHtml(d);});	
					 AdminUser.drawHtml(d);
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 }
			});*/
			return this;
		},
		execComp : function(data){
			$.ajax({
				url:DefConfig.Root + '/main/admin/adminiusercompmodify',
				type:'POST',
				dataType:'json',
				data:data, 
				success:function(d){
					Chasonx.Hint.Success({text:'权限设置' + (d>0?'成功':'失败')});
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			});
		},
		exec : function(data){
			$.ajax({
				url:DefConfig.Root + '/main/admin/adminusermodify',
				type:'post',
				dataType:'json',
				data:data,
				success:function(e){
					if(!e) return Chasonx.Hint.Faild('操作失败');
					
					var stxt = '系统用户已添加';
					if(data.otype == 2) stxt = '用户信息已更改';
					if(data.otype == 3) stxt = '用户已删除';
					Chasonx.Hint.Success({text:stxt});
					AdminUser.load();
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			});
		},
		validate : function(obj,t){
			 var patrn = /^([a-zA-Z0-9]|[._]){5,20}$/ig;
			 var pemail = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/ig;
			 if(t == 1 && !patrn.exec(obj.value)){
				 obj.value = "";
			 }else if(t == 2 && !pemail.exec(obj.value)){
				 obj.value = "";
			 }
		},
		checkpwd : function(){
			if($("#fpassword2").val() != $("#fpassword").val()) $("#fpassword2").val('');
		},
		drawHtml : function(d){
			var html = '',mark = d.pageNumber;
			if(d.list.length != 0){
				$.each(d.list,function(i,u){
					html += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'admin\',\'_selectAll\')"><td><input  type="checkbox" name="admin" value="'+ u.id +'"/></td>\
						    <td>'+( mark++)+'</td>\
						    <td>'+ u.fadminname +'</td>\
						    <td>'+ u.fadminuser +'</td>\
						    <td>'+ u.femail +'</td>\
						    <td>'+ getString(u.areaname) + '-' + getString(u.rolename)  +'</td>\
						    <td>'+ getString(u.flogincount) +'</td>\
						    <td>'+ getString(u.flastlogintime) +'</td>\
						    <td>'+ getString(u.fremark) +'</td></tr>';
				});
			}else{
				html += '<tr class="dataGridTr"><td colspan="10" align="center">暂无数据</td></tr>';
			}
			$("#siteData").html(html);
		}
};

window.onload = function(){
	Chasonx.Frameset({
		window : {
			top  : {id : 'topPanel' ,height : '68px',bgColor : false,border : false},
			right : {id : 'centerPanel',width : '100%',bgColor : false,border:false},
			}
	});
	Chasonx.DragBox({
		target : 'centerPanel',
		lineColor : _GetBoxLineColor(),
		items : [
		         {id : 'centerDragLeft',width : '15' },
		         {id : 'centerDragRight',width : '85' }
		        ]
	});
	
	PubDimension.list('udimensionTree',function(node){
		AdminUser.dimensionNode = node;
		
		var childNodes = null;
		AdminUser.childRoleArray = [];
		AdminUser.childRoleArray.push(node.guid);
		try{
			childNodes = $("#udimensionTree").tree('getChildren',node.target);
		}catch(e){
			console.debug(e);
		}
		if(childNodes != null){
			$.each(childNodes,function(i,u){
				AdminUser.childRoleArray.push(u.guid);
			});
		}
		
		AdminUser.load();
	});
	
	$("#userRolePanel").find('.roleItem').live('click',function(){
		$("div[class='roleItem roleItemFocus']").removeClass('roleItemFocus');
		$(this).addClass('roleItemFocus');
		AdminUser.roleGuid = $(this).attr('data');
	});
	
	var _h = function(v){ return getString(v);};
	AdminUser._table = Chasonx.Table({
		url : DefConfig.Root + '/main/admin/adminuserlist',
		data :  {},
		dataPanel :'userDataGrid',
		check : {name : 'admin',value : 'id'},
		tableNames : [
		      {name:"fadminname",text : "姓名",width : '10%'},
		      {name:"fadminuser",text : "登录名",width : '10%'},
		      {name:"femail",text : "邮箱",width : '8%',handler : _h},
		      {name: "fstate",text : "状态",width : '7%',handler : function(v){ return v == 0?'<span class="badge badge_blue">正常</span>':'<span class="badge badge_gray">冻结</span>'; }},
		      {name:"fdimensionname|rolename",text : "机构/角色",width : '10%',handler : _h},
		      {name:"flogincount",text : "登录次数",width : '10%',handler : _h},
		      {name:"flastlogintime",text : "最后登录时间",width : '10%',handler : _h},
		      {name:"fremark",text : "备注",width : '20%',handler : _h}
		              ]
	}).createTable();
	AdminUser.load();
};


