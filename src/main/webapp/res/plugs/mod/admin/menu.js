/**
 * 
 */
var _BTN_GROUP_ID = null;
$(document).ready(function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '65px'},
			left : {id : 'leftPanel',width : '25%'},
			right: {id : 'rightPanel'}
			}
	});
	
	$(".menuPanel > .menuItem").live('click',function(){
		$("div[class='menuItem menuItemFocus']").removeClass('menuItemFocus');
		$(this).addClass('menuItemFocus');
		CtrlTools.list(); 
	});
	
	$("#iconBrowser").live('click',function(){
		AdminMenu.showIcon(this);
	});
	
	$("#btnItem > .btnItems").live('click',function(){
		$("div[class='btnItems btnItemFocus']").removeClass('btnItemFocus');
		$(this).addClass('btnItemFocus');
	});
	
	$(".centerPanel > ul > li").live('click',function(){
		_BTN_GROUP_ID = $(this).attr('data');
	});
});

var iconPanel = null,_menuIdx = 0;
var AdminMenu = {
		currPID : 0,
		currData : null,
		menuItemHtml : '',
		tipsPanel : null,
		tipsPanelHtml : null,
		load : function(){
			AdminMenu.menuItemHtml = '';
			$.ajax({
				url:DefConfig.Root + '/main/menu/menulist',
				type:'post',
				dataType:'json',
				success:function(d){
					AdminMenu.currData = d;
					$.each(d.menuList,function(i,u){
						if(u.fparentid == 0){
							AdminMenu.menuItemHtml += '<div mark="menu_0" class="menuItem" pid="0" sort="'+ u.fsort +'" pname="" url="'+ u.fmenurl +'" mid="'+ u.id +'" lv="1" icon="'+ u.ficon +'"><span style="margin-left:18px;"></span>'+ (u.fstate == 1?'<b style="color:green;">√</b>':'<b style="color:red;">×</b>') + '<em class="'+ (u.ficon || '') +'"></em><font>' + u.fmenuname + "</font>" + '['+ u.fmenurl +']' +'</div>';
							AdminMenu.checkChildMenu(d.menuList,u.id,u.fmenuname);
						}
					});
					$(".menuPanel").html(AdminMenu.menuItemHtml);
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			});
		},
		checkChildMenu : function(d,pid,pname){
			var size = 0;
			$.each(d,function(i,u){
				if(u.fparentid == pid){
					AdminMenu.menuItemHtml += '<div mark="menu_'+ pid +'" class="menuItem" pid="'+ pid +'" sort="'+ u.fsort +'" url="'+ u.fmenurl +'" pname="'+ pname +'" lv="'+ u.flevel +'" mid="'+ u.id +'" icon="'+ u.ficon +'"><span style="margin-left:'+ (18*u.flevel) +'px;"></span>' + (u.fstate == 1?'<b style="color:green;">√</b>':'<b style="color:red;">×</b>') + '<em class="'+ (u.ficon || '') +'"></em><font>' + u.fmenuname + '</font>' + '['+ u.fmenurl +']' +'</div>';
					AdminMenu.checkChildMenu(d,u.id,u.fmenuname);
				}
			});
		},
		moveMenu : function(T){
			var _menu = $("div[class='menuItem menuItemFocus']");
			if(_menu.size() > 0){
				var mgroup = $("div[mark='menu_"+ _menu.attr('pid') +"']");
				var msize = mgroup.size();
				var _menu2 = null;
				var idx = _menu.index("div[mark='menu_"+ _menu.attr('pid') +"']");
				if(T == 1 && idx > 0){
					_menu2 = mgroup.eq(idx - 1);
				}else if(T == 0 && idx < (msize - 1)){
					_menu2 = mgroup.eq(idx + 1);
				}
				if(_menu2 == null) return;
				var data = {};
				data['mid'] = _menu.attr('mid');
				data['msort'] = _menu2.attr('sort');
				data['m2id'] = _menu2.attr('mid');
				data['m2sort'] = _menu.attr('sort');
				
				getAjaxData(DefConfig.Root + '/main/menu/moveMenu',data,function(d){
					Chasonx.Hint.Success('菜单已移动');
					AdminMenu.load();
				});
			}
		},
		menuAbel : function(S){
			var _menu = $("div[class='menuItem menuItemFocus']");
			if(_menu.size() > 0){
				AdminMenu.exec({'type':2,'id':_menu.attr('mid'),'fstate':S});
			}
		},
		addGroup : function(T){
			var D = {};
			var _menu = $("div[class='menuItem menuItemFocus']");
			if(_menu.size() > 0 ){
				if(T == 1){
					D.flevel = ~~_menu.attr('lv') + 1;
					D.fparentid = _menu.attr('mid');
					
					if(D.flevel > 3) return Chasonx.Hint.Faild('系统暂不支持第4级菜单');
				}else if(T == 2){
					D.flevel = ~~_menu.attr('lv')
					D.fparentid = _menu.attr('pid');
					D.fmenuname = _menu.find('font').html();
					D.fmenurl = _menu.attr('url');
					D.ficon = _menu.attr('icon');
				}
			} 
			
			new Chasonx({
				title : '新增主菜单',
				html : '<div id="menuBox"></div>',
				width:500,height:400,
				success:function(){
					if(FormData.requiredByAttr('menuBox',['input'])){
						var data = FormData.getFormData('menuBox',['input']);
						data['type'] = T;
						if(T == 2) data['id'] = _menu.attr('mid');
						AdminMenu.exec(data);
						
						if(AdminMenu.tipsPanel != null) AdminMenu.tipsPanel.Hide();
						return true;
					}
				},
				modal : true
			});
			
			
			ChasonxDom.draw({
				id : 'menuBox',
				item : [
						{text:'&nbsp;',type:'br',info:'&nbsp;'},
						{text:'菜单名称:',name:'fmenuname',attr:'maxlength="20" req = "true"',type:'input',value : (D.fmenuname || '')},
						{text:'级别:',name:'flevel',type:'input',value:(~~D.flevel || '1'),attr:' readonly="readonly" req = "true" '},
						{text:'URL:',name:'fmenurl',type:'input',value:(D.fmenurl || ''),attr:' maxlength="100" '},
						{text:'父ID:',name:'fparentid',type:'input',value:(D.fparentid || '0'),attr:'  req = "true" readonly="readonly"'},
						{text:'图标:',name:'ficon',type:'input',value:(D.ficon || ''),attr:' ',info : '<input type="button" id="iconBrowser" class="button blue" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;"  value="浏览"/>',
							handler : {
								type : 'change',
								event : function(){
									$("#menuIcon").attr('class',this.value);
								}
							}},
						{text:'&nbsp;',info:' <span id="menuIcon" class="'+ (D.ficon || '') +'" style="font-size:40px;"></span>'}
				       ]
			});
		},
		showIcon : function(O){
			if(this.tipsPanelHtml == null){
				var html = '<div class="menuIconBox">';
				$.each(UCGS_ICON,function(i,u){
					html += '<span class="'+ u +'" onclick="AdminMenu.setIcon(\''+ u +'\')"></span>';
				});
				html += '</div>';
				this.tipsPanelHtml = html;
			}
			this.tipsPanel = Chasonx.Tips.Show({id:O,text:this.tipsPanelHtml,width:340,height:250});
		},
		setIcon : function(_src){
			$("#menuIcon").attr('class',_src);
			$("#ficon").val(_src);
		},
		saveGroup : function(){
			var _gname = $("#fgropname").val(),_icon = $("#fgroupico").val(),type =  $("#saveGroup").attr('data');
			if(_gname != ''){
				var data = {'type':type,'adminMenu.fmenuname':_gname,'adminMenu.fparentid':0,'adminMenu.ficon':_icon};
				if(type == 2){
					data['adminMenu.id'] = $("input[type='checkbox'][name='mn']:checked").val();
				}
				this.exec(data);
			}
		},
		del : function(){
			var menu = $("div[class='menuItem menuItemFocus']");
			if(menu.size() > 0){
				this.exec({'type':3,'fkey':menu.attr('mid')});
			}
		},
		delChild : function(id){
			Chasonx.Alert({alertType:'warning',success:function(){
				AdminMenu.exec({'fkey':id,'type':3});
				return true;
			},modal:true});
		},
		exec : function(data){
			$.ajax({
				url:DefConfig.Root + '/main/menu/adminmenumodify',
				type:'post',
				data:data,
				dataType:'json',
				success:function(d){
					var stext = '菜单添加成功！';
					if(data.type == 2) stext = "菜单修改成功!";
					if(data.type == 3) stext = "菜单已删除!";
					Chasonx.Hint.Success({text:stext});
					AdminMenu.load();
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			});
		}
}; 

var CtrlTools = {
		addTab : function(){
			var _tabname = $("#_addTabName").val();
			var mo = $("div[class='menuItem menuItemFocus']");
			if(mo.size() == 0) return Chasonx.Hint.Faild('请选择菜单');
			if(_tabname == '') return Chasonx.Hint.Faild('请输入选项卡名称');
			
			this.execTab({'type':1,'fmenubtngroup':_tabname,'fmenuid':mo.attr('mid')});
			$("#_addTabName").val('');
		},
		execTab : function(data){
			getAjaxData(DefConfig.Root + '/main/menu/btnGroupModify',data,function(d){
				if(d > 0){
					Chasonx.Hint.Success('添加成功');
					CtrlTools.list(); 
				}
			});
		},
		execBtn : function(data){
			getAjaxData(DefConfig.Root + '/main/menu/btnModify',data,function(d){
				if(d > 0){
					Chasonx.Hint.Success('添加成功');
					CtrlTools.list(); 
				}
			});
		},
		del : function(T){
			if(T == 1){ //del group
				if(_BTN_GROUP_ID == null) return Chasonx.Hint.Faild('组未选择');
				this.execTab({'type':3,'id':_BTN_GROUP_ID});
			}else{
				var mb = $("input[type='checkbox'][name='menubtn']:checked");
				if(mb.size() == 0) return Chasonx.Hint.Faild('按钮未选择');
				
				this.execBtn({'type':3,'id':mb.val()});
			}
		},
		update : function(T){
			if(T == 1){ //del group
				if(_BTN_GROUP_ID == null) return Chasonx.Hint.Faild('组未选择');
				Chasonx.Alert({
					title : '更新组名称',
					html : '<input type="text" class="inputText" id="_updgroupname" />',
					height:200,
					success : function(){
						var gname = $("#_updgroupname").val();
						if(gname == '') return Chasonx.Hint.Faild('输入组名称');
						
						CtrlTools.execTab({'type':2,'id':_BTN_GROUP_ID,'fmenubtngroup':gname});
						return true;
					},
					modal : true
				});
			}else{
				var mb = $("input[type='checkbox'][name='menubtn']:checked");
				if(mb.size() == 0) return Chasonx.Hint.Faild('按钮未选择');
				
				var btnObj = mb.next('input[type="button"]');
				var method = btnObj.attr('onclick');
				new Chasonx({
					title : '更新按钮名称',
					html : '<br><br><p style="text-align:center;">名称：<input type="text" class="inputText" id="_updbtnpname" value="'+ btnObj.val() + '"/><br>\
							方法：<input type="text" class="inputText" id="_updbtnmethod" value="'+ (method || '') +'" /></p>',
					width:350,height : 200,
					success : function(){
						var gname = $("#_updbtnpname").val();
						if(gname == '') return Chasonx.Hint.Faild('输入按钮名称');
						
						var btnStr = btnObj.prop('outerHTML').replace(btnObj.val(),gname);
						if($("#_updbtnmethod").val() != ''){
							btnStr = btnStr.replace(method,$("#_updbtnmethod").val());
						}
						CtrlTools.execBtn({'type':2,'id':mb.val(),'fbtnhtml':btnStr});
						return true;
					},
					modal : true
				});
			}
		},
		state : function(S){
			var mb = $("input[type='checkbox'][name='menubtn']:checked");
			if(mb.size() == 0) return Chasonx.Hint.Faild('按钮未选择');
			this.execBtn({'type':2,'id':mb.val(),'fbtnstate':S});
		},
		addBtn : function(){
			if(_BTN_GROUP_ID == null) return Chasonx.Hint.Faild('未添加Tab选项卡');
			var bn = $("#_btnName").val();
			var btnIdx = $("div[class='btnItems btnItemFocus']");
			var btnMethod = $("#_btnMethod").val();
			var btnId = $("#_btnId").val();
			
			if(btnIdx.size() == 0) return Chasonx.Hint.Faild('选择按钮样式');
			if(bn == '') return Chasonx.Hint.Faild('输入按钮名称');
			var _btnStr = '<input type="button" value="'+ bn + '" onclick="';
			_btnStr += btnMethod != ''?btnMethod:"void(0)";
				_btnStr += '"';
			if(btnId != '') _btnStr += ' id="'+ btnId +'"';
				
			switch(btnIdx.index()){
			case 0: _btnStr += ' class="button blue" '; break;
			case 1: _btnStr += ' class="button green" '; break;
			case 2: _btnStr += ' class="button red" '; break;
			case 3: _btnStr += ' class="button gray" '; break;
			default : break;
			}
			_btnStr += " />";
			
			this.execBtn({'type':1,'fmbgid':_BTN_GROUP_ID,'fbtnhtml':_btnStr});
			$("#_btnName").val('');
			$("#_btnMethod").val('');
			 $("#_btnId").val('');
		},
		addHtml : function(){
			if(_BTN_GROUP_ID == null) return Chasonx.Hint.Faild('未添加Tab选项卡');
			var html = $("#_btnHtml").val();
			if(html != ''){
				this.execBtn({'type':1,'fmbgid':_BTN_GROUP_ID,'fbtnhtml':html});
				$("#_btnHtml").val('');
			}
		},
		list : function(){
			var mo =  $("div[class='menuItem menuItemFocus']");
			if(mo.size() > 0){
				getAjaxData(DefConfig.Root + '/main/menu/btnList',{'mid':mo.attr('mid')},function(d){
					var gHtml = '<ul class="buttonTabBox" style="height:61px;">';
					$.each(d.BtnGroupList,function(i,u){
						if(i == 0) _BTN_GROUP_ID = u.id;
						gHtml += '<li data="'+ u.id +'"><input type="radio" id="tabBtn'+ i +'" name="tabs" '+ (i == 0?'checked':'') +'/><label for="tabBtn'+ i +'">'+ u.fmenubtngroup +'</label>\
									<div id="tab-content'+ i +'" class="tabItems">';
							$.each(d.BtnList,function(j,k){
								if(k.fmbgid == u.id) gHtml += '&nbsp;&nbsp;<input type="checkbox" name="menubtn" value="'+ k.id +'" />' +  k.fbtnhtml + '['+ (k.fbtnstate == 1?'<font color="green">使用中</font>':'<font color="red">禁用</font>') +']';
							});
						gHtml += '</div></li>';
					});
					gHtml += '</ul>';
					$(".centerPanel").html(gHtml);
				});
			}
		}
};

AdminMenu.load();