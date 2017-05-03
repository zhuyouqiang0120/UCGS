
var UPLOADFILEARRAY = [],
	ASSETREMARK = [],
	UPLOADPAUSE = false,
	UPLOADIDX = 0;

function swfUploadLoaded() {
}
   
function swfUploadLoadFailed() {
	
}
   
function fileQueued(file) {
	if(UPLOADFILEARRAY == 0) $("#filePanel").html('');
	
	if(checkFileExist(file.name)){
		var item = '<div id="'+ file.id +'" class="item"><span>'+ file.name +'</span><span>'+ fileSizeForamt(file.size) +'</span>';
			item += '<span>'+ file.modificationdate.format('yyyy/MM/dd hh:mm:ss') +'</span><span>'+ $("#fremark").val() +'</span><span><div class="progress"><div class="status"></div><font>0%</font></div></span><div title="取消" class="cancel" onclick="removeFileItem(\''+ file.id +'\')">×</div></div>';
		$("#filePanel").append(item);
		
		UPLOADFILEARRAY.push(file.name);
		ASSETREMARK.push($("#fremark").val());
		modifyFileStats(this.getStats());
	}else{
		this.cancelUpload(file.id);
	}
}

function modifyFileStats(obj){
	var f_arr = $(".fileStats > font");
	f_arr.eq(0).html(obj.files_queued);
	f_arr.eq(1).html(obj.successful_uploads);
	f_arr.eq(2).html(obj.upload_errors);
}

function removeFileItem(fileid){
	UPLOADFILEARRAY.splice($('#' + fileid).index(),1);
	ASSETREMARK.splice($('#' + fileid).index(),1);
	Upload.swfObj.cancelUpload(fileid);
	$('#' + fileid).remove();
	modifyFileStats(Upload.swfObj.getStats());
}

function checkFileExist(filename){
	if(UPLOADFILEARRAY.length == 0) return true;
	var res = true;
	for(var i = 0,len = UPLOADFILEARRAY.length;i < len;i++){
		if(UPLOADFILEARRAY[i] == filename){
			res = false;
			break;
		}
	}
	return res;
}

function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			Chasonx.Alert({
				alertType:'error',
				html : '文件数量已超出限制了',
				modal:true
			}); 
			return;
		}
		
		var _s = '';
		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			_s = "错误码: File too big, 文件名: " + file.name + ", 大小: " + fileSizeForamt(file.size) + ", 信息: " + message;
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			_s = "错误码: Zero byte file, 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			_s = "错误码: Invalid File Type, 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		default:
			_s = "错误码: " + errorCode + ", 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		}
		$("#uploadErrMsg").html('[' + _s + ']');
	} catch (ex) {
        this.debug(ex);
    }
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
}

function stopSwfUpload(){
	Upload.swfObj.stopUpload();
	UPLOADPAUSE = true;
	Upload.swfObj.setButtonDisabled(false);
	
	Chasonx.Wait.Hide();
}


var _DeviceData = null;

function startSwfUpload(){
	if(UPLOADFILEARRAY.length > 0){
		DevSelector.show("升级包发布",function(data){
		    _DeviceData = data;
		    Chasonx.Wait.Show();
			Upload.swfObj.startUpload();
			$("#uploadErrMsg").html('');
			UPLOADPAUSE = false;
			Upload.swfObj.setButtonDisabled(true);
			return true;
		});
	}else{
		Chasonx.Hint.Faild('请先选择文件');
	}
}

function uploadStart(file) {
	try {
		this.addPostParam('fileSize',file.size);
		this.addPostParam('fileName',encodeURIComponent(file.name));
		this.addPostParam('fileType',file.type);
		this.addPostParam('upgradeType',$("#upgradeType").val());
		this.addPostParam('upgradeRcType',$("#upgradeRcType").val());
		this.addPostParam('upgradeMode',_DeviceData.pmode);
		this.addPostParam('pubType',_DeviceData.ptype);
		this.addPostParam('pubValue',encodeURIComponent(_DeviceData.pname));
		this.addPostParam('pubDevice',_DeviceData.device);
		this.addPostParam('pubDevmac',_DeviceData.devmac);
		this.addPostParam('pubDeviceNames',encodeURIComponent(_DeviceData.deviceNames));
		if(ASSETREMARK.length > 0)	this.addPostParam('remark',encodeURIComponent(ASSETREMARK[UPLOADIDX]?ASSETREMARK[UPLOADIDX]:''));
	}catch (ex) {}
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
		var _progress = $("#" + file.id).find('.progress');
		_progress.find('.status').css('width',percent + '%');
		_progress.find('font').html(percent + '%');
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		serverData = JSON.parse(serverData);
	    var _s = '';
	    switch(~~serverData.data){
		    case 0: _s = "上传失败";break;
		    case 1: _s = "上传成功"; break;
		    case 2: _s = "文件已存在"; break;
		    case 3: _s = "文件损坏"; break;
		    case 4: _s = "文件超过大小"; break;
		    default: break;
	    }
	    var res = '申请发送失败';
			switch(~~serverData.result){
				case 1: res = '升级文件发布已申请'; break;
				default: res = '系统错误'; break;
			}
		DevSelector.checkDevice = null;
		Chasonx.Hint.Success(res);
		
	    $("#" + file.id).find('.progress > font').html(_s);
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadError(file, errorCode, message) {
	try {
		var _s = '';
		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			_s = "错误码: HTTP Error, 文件名: " + file.name + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			_s = "错误码: Upload Failed, 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			_s = "错误码: IO Error, 文件名: " + file.name + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			_s = "错误码: Security Error, 文件名: " + file.name + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			_s = "错误码: Upload Limit Exceeded, 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			_s = "错误码: File Validation Failed, 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			_s = "错误码: File Cancelled, 文件名:" + file.name;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			_s = "文件名: " + file.name + ",信息: " + message;
			break;
		default:
			_s = "错误码: " + errorCode + ", 文件名: " + file.name + ", 大小: " + file.size + ", 信息: " + message;
			break;
		}
		$("#uploadErrMsg").html('[' + _s + ']');
	} catch (ex) {
        this.debug(ex);
    }
}

function uploadComplete(file) {
	modifyFileStats(this.getStats());
	if (this.getStats().files_queued === 0) {
		UPLOADFILEARRAY = [];
		ASSETREMARK = [];
		UPLOADIDX = 0;
		Upload.swfObj.setButtonDisabled(false);
		this.setStats({successful_uploads:0,upload_errors:0,upload_cancelled:0,queue_errors:0});
		
		Chasonx.Wait.Hide();
	}else if(!UPLOADPAUSE){
		UPLOADIDX ++;
		this.startUpload(); 
	}
}

function queueComplete(numFilesUploaded) {
//	var status = document.getElementById("divStatus");
//	status.innerHTML = numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
}


Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(), 
		"h+" : this.getHours(), 
		"m+" : this.getMinutes(), 
		"s+" : this.getSeconds(), 
		"q+" : Math.floor((this.getMonth()+3)/3), 
		"S" : this.getMilliseconds() 
	};

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
};

