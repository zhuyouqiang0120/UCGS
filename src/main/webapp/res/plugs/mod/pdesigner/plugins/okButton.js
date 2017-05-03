/**
 * @author Chasonx
 * 图片控件 如 广告位图片
 */
ChasonxTScaler.plugins("buttonWidget",{
	text   : '确定按钮OK',
	classes : 'icon-check_box',
	eleType: 'img',
	attr : {
		src : '/UCGS/res/skin/css/page/imgdef.jpg',
		width : 260,
		height : 440
	},
	customAttr : {
		guid : 'guid标识',
		type : '类型'
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute("ondragstart","return false;");
		ele.setAttribute('style',this.getStyle());
		ele.src = this.config.attr.src;
		this.appendToDraw(ele);
	}
});