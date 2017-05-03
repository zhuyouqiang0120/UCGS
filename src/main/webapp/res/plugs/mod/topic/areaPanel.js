var TopicLoadArea = {
		areaData : false,
		slide : false,
		load : function(obj,callback){
			if(!this.slide){
				$(".topicAreaPanel").addClass('topicAreaPanelShow');
				obj.addClass('queryAareBtnFocus');
				this.slide = true;
				if(!this.areaData){
					Area.list('topicAreaPanel',[],function(){
						if(typeof(callback) == 'function')	callback(Area.currArea.fguid);
					});
					this.areaData = true;
				}
			}else{
				$(".topicAreaPanel").removeClass('topicAreaPanelShow');
				obj.removeClass('queryAareBtnFocus');
				this.slide = false;
			}
		}
};