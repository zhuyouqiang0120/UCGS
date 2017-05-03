/**
 * @author Chasonx
 * 文字展示控件
 */
ChasonxTScaler.plugins("dataWidget",{
	text : '文字显示',
	classes : 'icon-text-color',
	eleType : 'div',
	css		: 'overflow:hidden;white-space:nowrap;word-break:break-all;',
	attr	: {
		borderWidth : 2,
		width : 500,
		height: 400,
		fontColor: 'ffffff'
	},
	append : function(){
		var ele = this.creatEle();
			ele.setAttribute('style',this.getStyle());
			ele.innerHTML = 'Good Luck Every Day!';
		this.appendToDraw(ele);
	}
});