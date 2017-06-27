
;(function(win,$){
	
	function upload(option){
		this.targetID = option.targetID || null;
		this.accept = option.accept || '*.*';
		this.modal = option.modal || 'S';
		this.size = option.size || 2 * 1024 * 1024;
		this.targetInputID = option.targetInputID || null;
		this.selectCallBack = option.selectCallBack || null;
		this.init();
	}
	
	upload.prototype = {
		   container : [],
		   nameContainer : [],
		   fileIdx : 10000,
		   fileIDSuffix : '_chasonxUploadFile',
		   formID : '_chasonxSimpleUploadForm',
		   init : function(){
			   if(this.targetID == null || this.targetInputID == null) return;
			   
			   var _this = this;
			   ChasonTools.addEventHandler($("#" + this.targetID)[0],'click',function(){
					_this.expoler(_this.targetInputID,_this.accept);
				});
		   },
		   expoler : function(inputID,accept){
			    var fID = this.fileIDSuffix + this.fileIdx;
				var fileO = $("#" + fID)[0];
				var _this = this;
				if(fileO == undefined || fileO == null){	
					fileO = document.createElement("input");
					fileO.setAttribute('type', "file");
					fileO.setAttribute('name','file' + this.targetID);
					fileO.setAttribute('accept',accept);
					fileO.setAttribute('id', fID);
					fileO.setAttribute("style",'display:none');
					ChasonTools.AppendToBody(fileO);
					ChasonTools.addEventHandler(fileO,'change',function(){
						_this.suffixCheck(this,inputID,fID);
					});
				}
				fileO.click();
		   },
		   suffixCheck : function(E,InputID,_fileID){
				var _accept = E.getAttribute('accept');
				if(_accept.indexOf(E.value.substring(E.value.lastIndexOf("."),E.value.length).toLowerCase()) == -1){
					E.value = '';
					Chasonx.Hint.Faild('暂不支持该文件类型');
					return;
				}
				if(E.files[0].size > this.size) {
					E.value = '';
					return Chasonx.Hint.Faild('文件过大');
				}
				var _fileName = E.value.substring(E.value.lastIndexOf("\\") + 1);
				if(!this.checkExist(_fileName)){
					$("#" + InputID).val(E.value);
					this.nameContainer.push(_fileName);
					this.container.push(_fileID);
					
					if(this.selectCallBack != null) this.selectCallBack(E);
					if(this.modal == "G") this.fileIdx ++;
				}else{
					Chasonx.Hint.Faild('已经添加过该文件了');
				}
		   },
		   checkExist : function(v){
				var res = false;
				for(var i = 0;i < this.nameContainer.length;i ++){
					if(v == this.nameContainer[i]){
						res = true;
						break;
					}
				}
				return res;
			},
			startUpload : function(option){
				option.url = option.url || '';
				option.required = option.required || false;
				option.panelID = option.panelID || '';
				option.reqTypes = option.reqTypes || [];
				option.success = option.success || null;
				
				if(this.container.length == 0) return Chasonx.Hint.Faild('请选择文件');
				if(StrKit.isBlank(option.url)) return;
				var data = {};
				if(option.required == true ){
					if(!FormData.requiredByAttr(option.panelID,option.reqTypes)) return;
					data = FormData.getFormData(option.panelID,option.reqTypes);
				}
				
				var uploadIdx = 0,_this = this,form = $(this.getForm());
				
				Chasonx.Wait.Show('正在上传文件，请稍后....');
				var loopUpload = function(){
					if(uploadIdx > (_this.container.length - 1)){
						Chasonx.Wait.Hide();
						Chasonx.Hint.Success("资源上传完成");
						return ;
					}
					
					form.empty();
					form[0].appendChild($("#" + _this.container[uploadIdx])[0]);
					$("#" + _this.formID).ajaxSubmit({
						url : option.url,
						type : 'post',
						data : data,
						dataType : 'json',
						success : function(d){
							if(typeof option.success == 'function') option.success(uploadIdx);

							uploadIdx ++;
							loopUpload();
						},
						error : function(e){
							console.debug(e);
							Chasonx.Hint.Faild('上传错误');
						}
					});
				};
				loopUpload();
			},
			getForm : function(){
				var form = $("#" + this.formID)[0];
				if(form == null || form == undefined){
					form = document.createElement('form');
					form.setAttribute('enctype','multipart/form-data');
					form.setAttribute('id',this.formID);
					form.setAttribute('method','post');
					ChasonTools.AppendToBody(form);
				}
				return form;
			}
	};
	
	win.Chasonx.SimpleUpload = function(option){
		return new upload(option);
	};
})(window,$);