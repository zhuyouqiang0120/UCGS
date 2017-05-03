	/**
	 * 文件上传
	 */
;(function(window,$){
	var Upload = {
			swfObj : null,
			init : function(para){
					Loader.js('swfupload.swfupload',false,function(){
						Loader.js('swfupload.handlers',false,function(){
							var setting = {
									flash_url : DefConfig.Root + "/res/plugs/swfupload/swfupload.swf",
									upload_url: para.url,
									use_query_string:true,
									file_size_limit : "20 MB",
									file_types : para.fileType,
									file_types_description : "All Files",
									file_upload_limit : para.limit || 20,
									file_queue_limit : para.limit || 20,
									button_placeholder_id : "swfUploadButton",
									button_width: 84,
									button_height: 30,
									button_image_url : DefConfig.Root + '/res/plugs/swfupload/swfuploadbg.png',
							        button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES,
							        button_disabled : false,
							        button_cursor : SWFUpload.CURSOR.HAND,
							        button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
									
									swfupload_loaded_handler : swfUploadLoaded,
									file_queued_handler : fileQueued,
									file_queue_error_handler : fileQueueError,
									file_dialog_complete_handler : fileDialogComplete,
									upload_start_handler : uploadStart,
									upload_progress_handler : uploadProgress,
									upload_error_handler : uploadError,
									upload_success_handler : uploadSuccess,
									upload_complete_handler : uploadComplete,
									queue_complete_handler : queueComplete,	
								};
								Upload.swfObj = new SWFUpload(setting);
						});
					});
			}
	};
	
	window.Upload = Upload;
})(window,$);