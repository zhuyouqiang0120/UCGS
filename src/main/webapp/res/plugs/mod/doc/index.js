$(function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '80px',border:false,bgColor : false},
			left : {id : 'leftPanel',width : '20%',border:'#000000',bgColor : false,slide : false,title : '<div style="text-align:center;">目录列表</div>',titleBgColor : false},
			right: {id : 'rightPanel',bgColor : false,border:'#000000',title : '<div style="text-align:center;">文档列表(Ctrl + Q 搜索)</div>',titleBgColor : false}
			}
	});
	
	$("#createFolder").live('click',function(){
		Doc.add();
	});
	
	$("#updateFolder").live('click',function(){
		Doc.add(2);
	});
	
	$("#uploadDoc").live('click',function(){
		Doc.upload();
	});
	
	$("#updateDocMess").live('click',function(){
		Doc.updateDocMess();
	});
	
	$("#setPreviews").live('click',function(){
		Doc.updatePreview(1);
	});
	
	$("#docDetail").live('click',function(){
		Doc.docDetail();
	});
	
	$("#deleteDoc").live('click',function(){
		
		if(Doc.currentDocData != null){
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定删除文档：' + Doc.currentDocData.FTitle,
				modal : true,
				success : function(){
					getDocAuthCode(function(param){
						param.FGuid = Doc.currentDocData.FGuid;
						
						getAjaxData(DefConfig.Doc.DeleteDoc,{param : JSON.stringify(param)},function(d){
							if(d.result > 0){
								Chasonx.Hint.Success('文档已删除');
								Doc.getDocList();
							}else{
								Chasonx.Hint.Faild(d.msg);
							}
						},'jsonp',DefConfig.JSONP);
					});
					return true;
				}
			});
		}
	});
	
	$("#deleteFolder").live('click',function(){
		if(Doc.currentFolder != null){
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定删除图册吗?',
				modal : true,
				success : function(){
					getDocAuthCode(function(param){
						param.FGuid = Doc.currentFolder;
						getAjaxData(DefConfig.Doc.DeleteFolder,{param : JSON.stringify(param)},function(d){
							if(d.result > 0){ 
								Chasonx.Hint.Success('图册已删除');
								Doc.getFolder();
							}else{
								Chasonx.Hint.Faild(d.msg);
							}
						},'jsonp',DefConfig.JSONP);
					});
					return true;
				}
			});
		}
	});
	
	Doc.init('leftPanel','docListPanel').appendSearch().getFolder().getDocList();
});