
var TempDialog = {
		show : function(guid,func){
			getAjaxData(DefConfig.Root + '/main/template/siteTempList',{'siteguid':guid},function(d){
				new Chasonx({
					title:'模版列表',
					html : '<div id="templateListBoxDialog"></div>',
					modal:true,
					width:600,height:500,
					success : function(){
						if(typeof(func) == 'function'){
							func($("input[type='checkbox'][name='templistitem']:checked").val());
							return true;
						}
					}
				});
				var line = '';
				if(d.length > 0){
					$.each(d,function(i,u){
						line += '<span class="tempListDialogItem">'+ u.fassetname +'<br>'+ fileSizeForamt(u.fsize) +'<input type="checkbox" name="templistitem" value="'+ u.fguid +'" onclick="TempDialog.choose(this)"/></span>';
					});
				}else{
					line += '<div style="text-align: center;padding-top: 30%;font-size: 20px;color: #ccc;">未找到模板</div>';
				}
				
				$("#templateListBoxDialog").html(line);
			});
		},
		choose : function(obj){
			$("input[type='checkbox'][name='templistitem']:checked").attr('checked',false);
			obj.checked = 'checked';
		}
};