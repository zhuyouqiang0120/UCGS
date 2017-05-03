/***
 * @author Chasonx
 * 手机页面控件
 */
ChasonxTScaler.plugins("pageWidget",{
	text   : '手机页面',
	classes: 'icon-mobile',
	type   : 'Panel',
	eleType: 'div',
	clear  : true,
	attr   : {
		bgColor : 'f6f6f6',
		width : 640,
		height: 960
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
		ele.style.left = '10px';
		ele.style.top = '10px';
		this.appendToDraw(ele);
	}
});