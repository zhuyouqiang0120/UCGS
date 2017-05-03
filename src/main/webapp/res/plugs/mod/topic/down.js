/**
*download link image
*/

var ImageDown = {
		images : [],
		downing : false,
		queues : [],
		add : function(url,w,h){
			if(this.filter(url) && this.romateCheck(url)){
				this.images.push({"tar":"","sour":""+ url +"","remove":"false"});
				$("#linkImagePanel").append('<div class="item"><img src="'+ url +'" align="center" width="'+ w +'px" height="'+ h +'px"/><br><span>下载</span><b>×</b></div>');
			}
		},
		filter : function(url){
			var res = true;
			for(var i = 0,len = this.images.length;i < len;i++){
				if(this.images[i].sour == url || ( this.images[i].sour == url && this.images[i].remove == "true")){
					res = false;
					break;
				}
			}
			return res;
		},
		romateCheck : function(url){
			var root = DefConfig.Root + "/files/upload/";
			if(url.indexOf(window.location.host + root)  == -1 && url.indexOf(root) == -1) return true;
			else return false;
		},
		remove : function(url){
			for(var i = 0;i < this.images.length;i++){
				if(this.images[i].sour == url && this.images[i].tar == ""){
					this.images[i].remove = "true";
					break;
				}
			}
		},
		clear : function(){
			$("#linkImagePanel").html('');
			for(var i = 0,len = this.images.length;i < len;i++){
				this.images[i].remove = "true";
			}
		},
		downAll : function(){
			var siteGuid = $("#siteItems").val();
			if(siteGuid == '') return Chasonx.Hint.Faild('请选择网站');
			
			var array = $("#linkImagePanel > .item");
			array.each(function(){
				if(ImageDown.images[$(this).index()].tar == ''){
					$(this).find('span').html('下载中...').css('background','#fff');
					ImageDown.queues.push($(this).index());
					
					if($(this).index() == (array.size() - 1)){
						ImageDown.downing = true;
						ImageDown.queue(siteGuid);
					}
				}
			});
			
		},
		doing : function(idx){
			var siteGuid = $("#siteItems").val();
			if(siteGuid == '') return Chasonx.Hint.Faild('请选择网站');
			
			if(this.images[idx].tar != '') return;
			
			$("#linkImagePanel > .item").eq(idx).find('span').html('下载中...').css('background','#fff');
			this.queues.push(idx);
			if(!this.downing){
				this.downing = true;
				this.queue(siteGuid);
			}
		},
		queue : function(siteGuid){
			if(this.queues.length > 0){
				var idx = this.queues[0];
				if(this.images[idx].remove == "true"){
					ImageDown.queues.splice(0,1);
					ImageDown.queue();
				} 
				getAjaxData(DefConfig.Root + '/main/topic/downLinkImage',{'imgUrl':this.images[idx].sour,'siteGuid':siteGuid,'ftype':0},function(d){
					switch(~~d.result){
					case 1:
						$("#linkImagePanel > .item").eq(idx).find('span').html('下载完成').css('background','#1ABF37').css('color','#ffffff');
						ImageDown.images[idx].tar = d.local;
						break;
					case -1:
						$("#linkImagePanel > .item").eq(idx).find('span').html('文件过大').css('background','#EFD512').css('color','#FF8300');
						break;
					case 0:
						$("#linkImagePanel > .item").eq(idx).find('span').html('下载失败').css('background','#BBB9B9').css('color','#505050');
						break;
					}
					
					ImageDown.queues.splice(0,1);
					ImageDown.queue(siteGuid);
				});
			}else{
				this.downing = false;
				this.replaceSrc();
				Chasonx.Hint.Success("下载任务已结束");
			}
		},
		replaceSrc : function(){
			for(var i = 0,len = this.images.length;i < len;i++){
				if(this.images[i].tar != ''){
					if(EtopicSet.pageData.length > 0){
						for(var p = 0,plen = EtopicSet.pageData.length;p < plen;p++){
							EtopicSet.pageData[p] = EtopicSet.pageData[p].replace(new RegExp(this.images[i].sour,'gi'),DefConfig.ROOT + this.images[i].tar);
						}
					}
					
					contentEditor.html(contentEditor.html().replace(new RegExp(this.images[i].sour,'gi'),DefConfig.ROOT + this.images[i].tar));
				}
			}
		}
};
