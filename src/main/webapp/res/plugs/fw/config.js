
var SyncUrl = {
		UAMS : "http://192.168.0.51:8080",
		UAMS_IP : "http://192.168.0.51:8080"
};

var DefConfig = {
	  Root : '/UCGS',
	  previewBasePath : '/UCGS/data/preview',
	  UAMS : {
		  go : SyncUrl.UAMS + "/UAMS/login?username=public&password=public",
		  getMediaList : SyncUrl.UAMS + "/UAMS/inter/getMedias",
		  getMediaEntity : SyncUrl.UAMS + "/UAMS/inter/getMediaByGUID",
		  getImageList : SyncUrl.UAMS + "/UAMS/media/getImages",
		  uploadImage : SyncUrl.UAMS + "/UAMS/media/uploadFile"
	  } 
};