
;(function(win,$){
	
	var container = [],nameContainer;
	
	function upload(option){
		this.hashCode = Math.random();
		this.targetID = option.targetID || null;
		this.name = option.name || 'file';
		this.accept = option.accept || '*.*';
		this.modal = option.modal || 'S';
		this.size = option.size || 2 * 1024 * 1024;
		this.targetInputID = option.targetInputID || null;
		this.selectCallBack = option.selectCallBack || null;
		container = [];
		nameContainer = [];
		this.init();
	}
	
	upload.prototype = {
		   fileIdx : 10000,
		   fileIDSuffix : '_chasonxUploadFile',
		   formID : '_chasonxSimpleUploadForm',
		   init : function(){
			   if(this.targetID == null) return;
			   
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
					fileO.setAttribute('name',this.name);
					fileO.setAttribute('accept',accept);
					fileO.setAttribute('id', fID);
					fileO.setAttribute("style",'display:none');
					ChasonTools.AppendToBody(fileO);
					$(fileO).bind('change',function(){
						_this.suffixCheck(this,inputID,fID);
					});
				}
				fileO.value = '';
				fileO.click();
		   },
		   suffixCheck : function(E,InputID,_fileID){
			   with(this){
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
					var _chRes = checkExist(_fileID,_fileName);
					if(_chRes == true)  return Chasonx.Hint.Faild('已经添加过该文件了');
					
					if(InputID) $("#" + InputID).val(E.value);
					if(typeof _chRes == 'number'){
						nameContainer[_chRes].value = _fileName;
					}else{
						nameContainer.push({id : _fileID,value : _fileName});
						container.push(_fileID);
					}
					console.debug(nameContainer,container);
					if(selectCallBack != null) this.selectCallBack(E);
					if(modal == "G") this.fileIdx ++;
			   }
		   },
		   checkExist : function(_id,v){
				var res = false;
				for(var i = 0;i < nameContainer.length;i ++){
					if(_id == nameContainer[i].id){
						if(nameContainer[i].value == v)	res = true;
						else res = i;
						break;
					}
				}
				return res;
			},
			startUpload : function(option){
				option.url = option.url || '';
				option.success = option.success || null;
				option.data = option.data || {};
				option.dataType  = option.dataType || 'json';
				option.forceSubmit = option.forceSubmit || false;
				
				if(!option.forceSubmit && container.length == 0) return Chasonx.Hint.Faild('请选择文件');
				if(StrKit.isBlank(option.url)) return;
				
				var uploadIdx = 0,_this = this,form = $(this.getForm());
				var formOption = {
						url : option.url,
						type : 'post',
						data : option.data,
						dataType : option.dataType,
						success : function(d){
							if(typeof option.success == 'function') option.success(uploadIdx,d);

							uploadIdx ++;
							loopUpload();
						},
						error : function(e){
							if(typeof option.error == 'function') option.success(uploadIdx,e);
							
							uploadIdx ++;
							loopUpload();
						}
					};
				if(option.jsonp) formOption.jsonp = option.jsonp;
				
				Chasonx.Wait.Show('正在上传文件，请稍后....');
				var loopUpload = function(){
					if(uploadIdx != 0 && uploadIdx > (container.length - 1)){
						Chasonx.Wait.Hide();
						Chasonx.Hint.Success("资源上传完成");
						form.empty();
						if(typeof option.complete == 'function') option.complete();
						
						container = [];
						nameContainer = [];
						return ;
					}
					
					form.empty();
					if(container.length > 0) form[0].appendChild($("#" + container[uploadIdx])[0]);
					$("#" + _this.formID).ajaxSubmit(formOption);
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