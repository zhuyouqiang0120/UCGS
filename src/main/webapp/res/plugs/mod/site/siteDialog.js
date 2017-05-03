
var PublicSite = {
		list : function(areaguid,callback,D,compareField){
			$.ajax({
				url : DefConfig.Root + '/main/site/sitelist',
				type: 'post',
				dataType : 'json',
				data: {'areaguid':areaguid,'PageNumber':1,'PageSize':200,'del':0},
				success : function(d){
					PublicSite.draw(d, callback,D,compareField);
				},
				error:function(e){
					Chasonx.Hint.Faild(e.responseText);
				}
			});
		},
		draw : function(data,callback,D,compareField){
			var html = '',exist ;
			if(data.list.length > 0){
				$.each(data.list,function(i,u){
					exist = 0;
					if(D)	exist = PublicSite.checkExist(D, compareField, u.fguid);
					
					html += '<div onclick="PublicSite.click(this)" class="siteTabItems'+ (exist > 0?' siteTabItemsFocus':'') +'" data="'+ u.id +'" guid="'+ u.fguid +'" >\
							 <span><input type="checkbox" name="siteDialog" value="'+ u.fguid +'" '+ (exist > 0?'checked="checked"':'') +'/>'+ u.fsitename +'</span>\
							 <span>'+ u.fsitealias +'</span>\
							 <span>'+ getString(u.areaname) +'</span>\
							 <span>'+ u.fcreatetime +'</span>\
							 <span>'+ getString(u.fremark) +'</span>\
							 </div>';
				});
			}else{
				html = '<div style="height: 30px;line-height: 30px;text-align: center;background: #f6f6f6;">未找到可操作的网站</div>';
			}
			
			if(typeof(callback) == 'function') 	callback(html);
		},
		click : function(obj,E){
			E = E || window.event;
			if(E.target.type == 'checkbox'){
				$(E.target).parent().parent().removeClass().addClass(E.target.checked == true?'siteTabItems siteTabItemsFocus':'siteTabItems');
			}else{
				$("div[class='siteTabItems siteTabItemsFocus']").removeClass('siteTabItemsFocus').find('input').attr('checked',false);
				$(obj).addClass('siteTabItemsFocus').find('input').attr('checked',true);
			}
		},
		getCheckVal : function(){
			var site = [];
			$("input[type='checkbox'][name='siteDialog']:checked").each(function(){
				site.push($(this).val());
			});
			return site;
		},
		checkExist : function(data,compareField,guid){
			var res = 0;
			$.each(data,function(i,u){
				if(u[compareField] == guid){
					res = 1;
					return false;
				}
			});
			return res;
		}
};