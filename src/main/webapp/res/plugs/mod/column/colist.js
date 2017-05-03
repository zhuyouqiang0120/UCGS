
var PublicCol = {
		list : function(treeId,siteData,callback,loadSuccessCallback){
			Chasonx.Wait.Show("正在加载业务列表...");
			$.ajax({
				url:DefConfig.Root + '/main/column/columnall',
				type:'get',
				dataType:'json',
				data : {'siteGuid':siteData.id,'state':(siteData.state || null)},
				success:function(d){
					PublicCol.genner(treeId,d,siteData,callback,loadSuccessCallback);
					Chasonx.Wait.Hide();
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'栏目加载失败'});
					Chasonx.Wait.Hide();
				}
			});
		},
		genner : function(id,data,siteData,callback,loadSuccessCallback){
			$("#" + id).tree({
				data:FormatColumnData.format(data,siteData),
				onClick : function(node){
					if(typeof(callback) == 'function') callback(node);
				},
				onLoadSuccess : function(node, data){
					if(typeof(loadSuccessCallback) == 'function') loadSuccessCallback();
				}
			});
		}
};