var SitePub = {
		list : function(id,areaguid,callback){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':249,'del':0,'areaguid':areaguid},function(d){
				Chasonx.Wait.Hide();
				if(typeof(callback) == 'function'){
					callback(d);
				}else{
					var op = '<p style="text-align:center;padding:5px 0px 5px 0px;" class="global_bg_c"><b>站点列表</b></p>';
					$.each(d.list,function(i,u){
						op += '<div data="'+ u.fguid +'">'+ u.fsitename +'</div>';
					});
					$("#" + id).html(op);
				}
	   		});
		},
		handler : function(id,callback){
			$("#"+ id +" > div").live('click',function(){
				$("#"+ id +" > div[class='fileSiteFocus']").removeClass('fileSiteFocus');
				$(this).addClass('fileSiteFocus');
				
				if(typeof(callback) == 'function')
					callback($(this).attr('data'));
			});
		}
};