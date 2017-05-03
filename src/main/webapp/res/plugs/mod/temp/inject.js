
var InjectImage = {
		filter : null,
		attr : {
			fileSize : 0,
			fileAttr : [],
			fileType : 'image/png,image/gif,image/jpg,image/jpeg'
		},
		init : function(_filter){
			this.attr.fileSize = 0;
			this.attr.fileAttr = [];
			if(_filter)	this.filter = _filter;
			if(this.filter.width) this.filter.width = ~~(this.filter.width.replace('px',''));
			if(this.filter.height) this.filter.height = ~~(this.filter.height.replace('px',''));
		},
		browserFile : function(fileInput,panelId){
			var _this = this,
				fileO = $("#_imgFileBox_chooseFile" + this.attr.fileSize)[0];
			if(fileO != null && fileO != undefined){
				fileO.click();
			}else{
		    	fileO = document.createElement("input");
				fileO.setAttribute('type', "file");
				fileO.setAttribute('name','file');
				fileO.setAttribute('accept',this.attr.fileType);
				fileO.setAttribute('id', "_imgFileBox_chooseFile" + this.attr.fileSize);
				fileO.setAttribute("style",'display:none');
				document.body.appendChild(fileO);
				this.bind('change', fileO, function(){
					_this.chasonxCheckSuffix(fileO,_this.attr.fileSize,panelId,fileInput);
				});
				fileO.click();
			}
		},
		chasonxCheckSuffix : function(obj,fileId,panelId,fileInput){
			var file = obj.files[0];
		    if(!/image\/\w+/.test(file.type)) return Chasonx.Hint.Faild('请选择图片文件');
		    if(typeof(FileReader) == 'undefined'){
		      Chasonx.Hint.Faild('浏览器不支持图片预览');
		      return;
		    }
		    if(!this.checkExist(file.name)) return Chasonx.Hint.Faild('已经选择过相同的图片了');
		    if(this.attr.fileAttr.length == 0) $("#" + panelId).html('');
			
		    var zoom,_this = this;
		    var reader = new FileReader();
		    reader.readAsDataURL(file);
		    reader.onload = function(e){
		    	var _img = new Image();
		    	_img.src = this.result;
		    	
		    	if(_this.filter.width && _img.width > _this.filter.width) return Chasonx.Hint.Faild("图片宽度超过限制：" + _img.width + " px");
		    	if(_this.filter.height && _img.height > _this.filter.height) return Chasonx.Hint.Faild("图片高度超过限制：" + _img.height + " px");
		    	
		    	zoom = (Math.min(Math.min(100/~~_img.width,1),Math.min(80/~~_img.height,1))).toFixed(3);
		        $("#" + panelId).append('<div class="uploadImageItems'+ fileId + '"><span><img src="'+ this.result +'" width="'+ (_img.width*zoom) +'px" height="'+ (_img.height*zoom) +'px"/></span>\
		    		  				 <span>图片大小：' + fileSizeForamt(e.total) + '</span>\
		      						 <span>图片尺寸：'+ _img.width +'px * ' + _img.height + 'px</span>\
		      						 <span>状态:<font color="#af9f9f">待上传</font></span><label onclick="InjectImage.delItem('+ fileId +')">×</label></div>');
		        $("#" + fileInput).val(obj.value);
		        _this.attr.fileAttr.push({ID:fileId,NAME:file.name});
		        _this.attr.fileSize ++;
		    }
		},
		startUpload : function(idx,_position){
			if(this.attr.fileAttr.length == 0) return Chasonx.Hint.Faild("请先选择图片");
			
			var fileid = this.attr.fileAttr[idx].ID;
			var _imgFile = $("#_imgFileBox_chooseFile" + fileid);
			
			$("#UCGS_Injet_Form").empty();
			_imgFile.attr('name','file' + idx);
			$("#UCGS_Injet_Form")[0].appendChild(_imgFile[0]);
			var _loadSpan = $(".uploadImageItems" + fileid + " > span").eq(3);
			_loadSpan.html('状态:<font color="#4a9ce4">正在上传...</font>');
			
			$("#UCGS_Injet_Form").ajaxSubmit({
				url : DefConfig.UAMS.uploadImage,
				type : 'post',
				dataType : 'jsonp',
				data : {'authCode' : $("#_LOGINUSERGUID").val(),'position':_position,'deleted':'2'},
				success : function(d){
					if(idx < (InjectImage.attr.fileAttr.length - 1)) InjectImage.startUpload(idx++);
				},
				error : function(e){
					ChasonTools.delayRun(function(){
						_loadSpan.html('状态:<font color="#248c04">上传成功</font>');
						if(idx < (InjectImage.attr.fileAttr.length - 1)){
							_imgFile.remove();
							InjectImage.startUpload(idx+1,_position);
						}else{
							InjectImage.init();
						}
					});
				}
			});
		},
		delItem : function(fileId){
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定从列表中移除该图片吗？',
				modal : true,
				success : function(){
					$(".uploadImageItems" + fileId).remove();
					$("#_imgFileBox_chooseFile" + fileId).remove();
					InjectImage._delByfid(fileId);
					return true;
				}
			});
		},
		_delByfid : function(fid){
			for(var i = 0,len = this.attr.fileAttr.length;i < len;i++){
				if(this.attr.fileAttr[i].ID == fid){
					this.attr.fileAttr.splice(i,1);
					break;
				}
			}
		},
		checkExist : function(name){
			for(var i = 0,len = this.attr.fileAttr.length;i < len;i++){
				if(this.attr.fileAttr[i].NAME == name) return false;
			}
			return true;
		},
		bind : function(functype,O,callback){
			if(window.addEventListener){
				O.addEventListener(functype,function(){ callback(); },false);
			}else {
				O.attachEvent('on' + functype ,function(){ callback(); });
			}
		}
};