
var MenuDialog = {
	   menuData : null,
	   comperData : null,
	   btnGroup : null,
	   btn : null,
	   show : function(F,CD,callBack){
		CD = CD || null;
	    if(this.menuData == null){
		 $.ajax({
				url:DefConfig.Root + '/main/menu/menulist',
				type:'post',
				dataType:'json',
				data : {'state':1},
				success:function(d){
					MenuDialog.menuData = d.menuList;
					MenuDialog.btnGroup = d.bgroupList;
					MenuDialog.btn = d.btnList;
					MenuDialog.groupShow(d.menuList,F,CD,callBack);
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错!<br/>' + e.status + '：' + e.statusText});
				}
			 });
		 }else{
			 this.groupShow(this.menuData,F,CD,callBack);
		 }
	   },
	   groupShow : function(d,F,CD,callBack){
		     var html = '<div class="menuDialog">&nbsp;&nbsp;设置菜单权限&nbsp;<input type="checkbox" onclick="MenuDialog.chooseMenuAll(this)" style="position:relative;top:2px;" title="全选">全选</div>';
			 html += '<div class="menuComSetBox">';
			 var comMenu,cm,temp,line,cline;
			 
			 $.each(d,function(i,u){
				 if(u.fparentid == 0){
					 temp = 0;
					 line = '';
					 $.each(d,function(j,k){
						 if(k.fparentid == u.id){
							 comMenu = MenuDialog.chooseArray(k.id, F,CD);
							
							 if(MenuDialog.checkHasChild(d,k.id) > 0){//3级
								 line += '<div class="__menu"><input type="checkbox" '+ (comMenu>0?'checked="checked"':'') +'  id="menuChild'+ k.id +'" name="menuChild'+ u.id +'" class="menuChild" onclick="MenuDialog.chooseMenu('+ k.id +',this,true)" value="'+ k.id +'"><b>'+ k.fmenuname +'</b></div>';
								 $.each(d,function(o,b){
									 if(b.fparentid == k.id){
										 line += '<div class="__menu" style="padding-left:54px;"><input type="checkbox" '+ (comMenu>0?'checked="checked"':'') +'  onclick="MenuDialog.thinkChoose(this)" class="menuChild" name="menuChild'+ k.id +'"  value="'+ b.id +'"><b>'+ b.fmenuname + '</b></div>';
										 line += MenuDialog.getBtnGroup(b.id,CD || []);
									 }
								 });
							 }else{
								 line += '<div class="__menu" ><input type="checkbox" '+ (comMenu>0?'checked="checked"':'') +' onclick="MenuDialog.thinkChoose(this)" class="menuChild" name="menuChild'+ u.id +'"  value="'+ k.id +'"><b>'+ k.fmenuname + '</b></div>';
								 line +=  MenuDialog.getBtnGroup(k.id,CD || []);
							 }
							 if(comMenu > 0) temp++;
						 }
					 });
					 html += '<div class="title"><input type="checkbox" '+ (temp > 0?'checked="checked"':'') +' id="menuChild'+ u.id +'" name="menuParent" class="menuChild" onclick="MenuDialog.chooseMenu('+ u.id +',this)" value="'+ u.id +'"><b>'+ u.fmenuname +'</b></div>';
					 html += line;
				 }
			 });
			 html += '</div>';
			 callBack(html);
	   },
	   checkHasChild : function(d,pid){
		   var size = 0;
		   $.each(d,function(i,u){
			  if(u.fparentid == pid){
				  size = 1;
				  return false;
			  } 
		   });
		   return size;
	   },
	   getBtnGroup : function(mid,data){
		   var comStr = '';
		   $.each(data,function(i,u){
			  if(u.ftargetauthguid == mid){
				  comStr = u.fauth;
				  return false;
			  } 
		   });
		   
		   var gHtml = '<div class="_MeBtnGroupTest" ><ul class="buttonTabBox" style="height:61px;">';
		   var liHtml = '',flag = 0;
			$.each(MenuDialog.btnGroup,function(i,u){
				if(u.fmenuid == mid){
					liHtml += '<li data="'+ u.id +'"><input type="radio" id="tabBtn'+ u.id +'" name="tabs'+ mid +'" '+ (flag == 0?'checked':'') +'/><label for="tabBtn'+ u.id +'">'+ u.fmenubtngroup +'</label>\
								<div id="tab-content'+ u.id +'" class="tabItems">';
						$.each(MenuDialog.btn,function(j,k){
							if(k.fmbgid == u.id){
								liHtml += '&nbsp;&nbsp;<input type="checkbox" '+ (comStr.indexOf(k.id) != -1?'checked="checked"':'') +'  name="menuUseBtn'+ mid +'" value="'+ k.id +'" />' +  k.fbtnhtml;
							}
						});
						liHtml += '</div></li>';
					flag++;	
				}
			});
			if(liHtml == '') return '';
			
			gHtml += liHtml + '</ul></div>';
			return gHtml;
	   },
	   getCompArray : function(){
		   var $_com = $("input[type='checkbox'][class='menuChild']:checked"),mArr = new Array(),btnIdArr = new Array(),btnIdStr;
			 $_com.each(function(){
				 if($(this).attr('name') != 'menuParent'){
					 mArr.push($(this).val());
					 btnIdStr = '';
					 $('input[type="checkbox"][name="menuUseBtn'+ $(this).val() +'"]:checked').each(function(){
						 btnIdStr += $(this).val() + ',';
					  });
					  btnIdArr.push(btnIdStr.substring(0,btnIdStr.length-1));
				 }
			 });
			 return [mArr,btnIdArr];
	   },
	   chooseArray : function(id,field,data){
			 if(data == null) return 0;
			 var _size = 0;
			 $.each(data,function(i,u){
				 if(u[field] == id) _size ++;
			 });
			 return _size;
		 },
		 ckCom : function(id,data){
			 if(data == null) return "";
			 
			 var S = '';
			 $.each(data,function(i,u){
				 if(u.fmenuid == id) S = u.fcompstr; 
			 });
			 return S;
		 },
		 chooseCom : function(name,id){
			 var _b = $("input[type='checkbox'][name='"+ name + id +"']").eq(0).attr('checked');
			 $("input[type='checkbox'][name='"+ name + id +"']").attr('checked',!_b);
			 $("." + name + id).css('color',!_b?'#fc1b0f':'#ccc');
		 },
		 chooseMenu : function(id,O,T){
			 $("input[type='checkbox'][name='menuChild" + id +"']").attr('checked',O.checked).each(function(){
				 $("input[type='checkbox'][name='menuChild"+ this.value +"']").attr('checked',this.checked);
			 });
			 if(T == true) this.thinkChoose(O);
		 },
		 chooseComAll : function(cls){
			 $("." + cls).click();
		 },
		 chooseMenuAll : function(O){
			 $(".menuComSetBox").find('input[type="checkbox"]').attr('checked',O.checked);
		 },
		 thinkChoose : function(O){
			 var _n = $(O).attr('name');
			 if($("input[type='checkbox'][name='"+ _n +"']:checked").size() == 0)
				 $("#" + _n).attr('checked',false);
			 else
				 $("#" + _n).attr('checked',true);
			 
			 if($("#" + _n)[0] != undefined)
				 this.thinkChoose($("#" + _n)[0]);
		 },
		 showOrhide : function(id,O){
			 if($("#" + id).css('display') == 'none'){
				 $("#" + id).slideDown();
				 $(O).removeClass('node_1').addClass('node_');
			 }else{
				 $("#" + id).slideUp();
				 $(O).removeClass('node_').addClass('node_1');
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