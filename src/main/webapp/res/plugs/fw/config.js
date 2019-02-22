
var SyncUrl = {
		UAMS : "http://192.168.0.51:8080",
		UAMS_IP : "http://192.168.0.51:8080",
		DOCFactory : 'http://localhost:8080/ZDocFactory',
		UserData : "http://10.211.55.3:8081/UCGS/data/user/list"
};

var DefConfig = {
	  Root : '/UCGS',
	  JSONP : 'zfnName',
	  previewBasePath : '/UCGS/data/preview',
	  UAMS : {
		  go : SyncUrl.UAMS + "/UAMS/login?username=public&password=public",
		  getMediaList : SyncUrl.UAMS + "/UAMS/inter/getMedias",
		  getMediaEntity : SyncUrl.UAMS + "/UAMS/inter/getMediaByGUID",
		  getImageList : SyncUrl.UAMS + "/UAMS/media/getImages",
		  uploadImage : SyncUrl.UAMS + "/UAMS/media/uploadFile"
	  },
	  Doc : {
		  DocList : SyncUrl.DOCFactory + '/api/convert/getDocLlist',
		  DocUpload : SyncUrl.DOCFactory + "/api/convert/upload",
		  GetFolder : SyncUrl.DOCFactory + '/api/doc/list',
		  ModifyFolder : SyncUrl.DOCFactory + '/api/doc/modify',
		  DeleteFolder : SyncUrl.DOCFactory + '/api/doc/delete',
		  DeleteDoc : SyncUrl.DOCFactory + '/api/doc/deleteDoc',
		  AddFolder : SyncUrl.DOCFactory + '/api/doc/add',
		  GetDocList : SyncUrl.DOCFactory + '/api/doc/docList',
		  UpdateDoc : SyncUrl.DOCFactory + '/api/doc/updateDoc',
		  DocDetail : SyncUrl.DOCFactory + '/api/doc/convertData',
		  UpdateDocImage : SyncUrl.DOCFactory + '/api/doc/updateDocImage',
		  GetDocAssets : SyncUrl.DOCFactory + "/api/doc/getBGFileList",
		  UploadAssets : SyncUrl.DOCFactory + "/api/doc/uploadBGFile",
	  },
	  CacheServer : {
		  freeze : 0,
		  unfreeze : 1,
		  getState : function(s){
			  with(this){
				  if(s == freeze) return '<span class="badge badge_gray">冻结中</span>';
				  else if(s == unfreeze) return '<span class="badge badge_blue">正常</span>';
			  }
		  }
	  },
	  TopicCheckState : {
		  text : ['未审核','审核通过','审核不通过']
	  },
	  WorkflowState : {
		  text : ['未审核','审核不过过', '审核通过']
	  }
};