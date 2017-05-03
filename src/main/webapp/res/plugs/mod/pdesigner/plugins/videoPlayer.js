/**
 * @author chasonx
 * 主题列表
 */
ChasonxTScaler.plugins("mediaWidget",{
	text : '视频控件',
	classes : 'icon-ondemand_video',
	eleType : 'VIDEO',
	dataType: 'Columns',
	hasData : true,
	attr	: {
		borderWidth : 1,
		width : 450,
		height : 400,
		bgColor: '000000',
		src : '/UCGS/res/plugs/media/cs.mp4'
	},
	append : function(){
		var ele = this.creatEle();
			ele.setAttribute('style',this.getStyle());
			ele.setAttribute('src',this.config.attr.src);
			ele.setAttribute('autoplay','autoplay');
			ele.setAttribute('loop','loop');
		this.appendToDraw(ele);
	},
	data : function(){
		
	}
});