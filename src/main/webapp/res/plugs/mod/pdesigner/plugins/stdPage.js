/***
 * @author Chasonx
 * 电视页面控件
 */
ChasonxTScaler.plugins("pageWidget",{
	text   : '电视页面',
	classes: 'icon-display',
	type   : 'Panel',
	eleType: 'div',
	clear  : true,
	attr   : {
		bgImg : '/UCGS/res/skin/css/page/pagedef.jpg',
		width : 1280,
		height: 720
	},
	customAttr : {
		guid : '',
		state : '',
		status : ''
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
		this.appendToDraw(ele);
	}
});