<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>系统崩溃了</title>
<style type="text/css">
* 				{margin:0px;padding:0px;}
body,html 		{width:100%;height:100%;overflow:hidden;background:#f6f6f6;}
#text 		   	{position:absolute;left:10%;top:10%;width:500px;height:100px;font-family: '幼圆';} 
#text img 		{position:relative;top:-2px;}
</style>
<script type="text/javascript">
window.onload = function(){

    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    document.getElementById('nowTime').innerHTML =  currentdate;
}
</script>
</head>
<body>
<div id="text">
	<p><img src="${basePath}/res/skin/images/warning.png" align="center"/><font size="5">errorCode : 500 </font></p>
	<br><br>
	<p>消息来自 :UCGS ,时间：<span id="nowTime"></span></p>
</div>
</body>
</html>
