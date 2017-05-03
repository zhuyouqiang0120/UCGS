
var DbBackUpUtil = {
		list : function(){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + "/main/db/list",null,function(d){
				Chasonx.Wait.Hide();
				DbBackUpUtil.draw(d);
			});
		},
		draw : function(d){
			var html = '';
			if(d != ''){
				var u,len = d.length;
				for(var i =  len - 1;i >= 0;i --){
					u = d[i];
					html += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'dataval\',\'_selectAll\')">\
					    <td><input type="checkbox" name="dataval" value="'+ u.fileName +'"/></td>\
					    <td>'+ ( len - i) +'</td>\
					    <td><i class="icon_database"></i>&nbsp;'+ u.fileName +'</td>\
					    <td>'+ u.modifyTime +'</td>\
					    <td>'+ u.fileSizeFormat  +'</td>\
					   </tr>';
				}
			}else{
				html += '<tr class="dataGridTr"><td colspan="5" align="center">暂无数据</td></tr>';
			}
			$("#dbData").html(html);
		},
		backup : function(){
			Chasonx.Alert({
				title : '备份提示',
				html : '确定备份当前数据库吗？',
				modal : true,
				height : 180,
				success : function(){
					Chasonx.Wait.Show('正在备份数据，请稍后...');
					getAjaxData(DefConfig.Root + '/main/db/backup',null,function(d){
						if(d > 0){
							Chasonx.Hint.Success('数据已备份');
							DbBackUpUtil.list();
						}else{
							Chasonx.Hint.Faild("数据备份失败");
						}
						Chasonx.Wait.Hide();
					});
					return true;
				}
			});
		},
		recover : function(){
			this.choose(function(item){
				Chasonx.Alert({
					alertType : 'warning',
					title : '数据还原',
					html : '确定要将数据恢复吗？<br>已选择：' + item.val(),
					height: 200,width:400,
					modal : true,
					success : function(){
						Chasonx.Wait.Show('正在进行数据还原...');
						getAjaxData(DefConfig.Root + '/main/db/recover',{'dbName':item.val()},function(d){
							if(d > 0) Chasonx.Hint.Success('数据恢复已完成');
							else Chasonx.Hint.Faild('数据恢复失败');
							Chasonx.Wait.Hide();
						});
						return true;
					}
				});
			});
		},
		remove : function(){
			this.choose(function(item){
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除此条备份吗？',
					success : function(){
						getAjaxData(DefConfig.Root + '/main/db/removeDbFile',{'dbName':item.val()},function(d){
							if(~~d > 0){
								Chasonx.Hint.Success('记录已删除');
								DbBackUpUtil.list();
							}else{
								Chasonx.Hint.Faild('记录删除失败');
							}
						});
						return true;
					},
					modal : true
				});
			});
		},
		choose : function(cb){
			var item = $("input[type='checkbox'][name='dataval']:checked");
			if(item.size() > 0){
				cb(item);
			}else{
				Chasonx.Hint.Faild('请先选择一条数据');
			}
		}
};

addLoadHandler(DbBackUpUtil.list);