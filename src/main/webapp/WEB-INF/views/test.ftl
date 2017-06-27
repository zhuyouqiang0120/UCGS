<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>测试</title>
<#include "common/head.ftl">
<style type="text/css">
body,html 		{height:100%;}
#background 	{position:absolute;width:100%;height:100%;background:#f6f6f6;text-align:center;overflow:hidden;vertical-align:middle;line-height:100%;
				moz-user-select: -moz-none;
				-moz-user-select: none;
				-o-user-select:none;
				-khtml-user-select:none;
				-webkit-user-select:none;
				-ms-user-select:none;
				user-select:none;
				font-family:"经典圆体繁", "microsoft yahei", "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;;
				  text-transform: ;
				  font-size: 80px;
				  color: #f1ebe5;
				  text-shadow: 0 8px 9px #c4b59d, 0px -2px 1px #fff;
				  font-weight: bold;
				  letter-spacing: -4px;
				  }
.testbox         {width:95%;height:auto !important;min-height:100px;position:relative;background:#178ddc;padding:10px;color:#f6f6f6;}
.testbox div	 {border:1px solid #003e67;-moz-border-radius: 5px; -webkit-border-radius: 5px;  border-radius:5px;}
.ctrl 			 {height:40px;background:#06578e;color:#f6f6f6;}
.formdata 		 {height:auto !important;min-height:50px;background:#1C7C49;}
.result   		 {height:auto !important;min-height:100px;background:#f6f6f6;color:#b51313;padding:8px;}
.cancel 		 {float:left;width:30px;height:30px;-moz-border-radius: 5px; -webkit-border-radius: 5px;  border-radius:5px;background:#C03636;border:1px solid #ccc;}
.fname			 {display:inline-block;width:30%;}
#jsonData 		 {height:200px;overflow:auto;}
#testTab 		 {height:70%;top:20%;width:70%;margin:0px auto;}

</style>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jquery.form.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/fw/chasonx.tab.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/fw/required.js"></script>
</head>
<body >
<div id="background">Test Page 测试</div>
<div id="testTab">
	<div id="testTab_1">
	  	 <div id="testbox" class="testbox">
			<div class="ctrl" style="">
				地&nbsp;&nbsp;&nbsp;&nbsp;址:<input id="reurl" type="text" class="inputText" style="width:432px;" placeholder="请求地址"/>
				请求类型:<select id="retype" class="inputText select" style="width:200px;"><option value="POST">POST</option><option value="GET">GET</option></select>
				请求方式:<select id="reDataType" class="inputText select" style="width:200px;"><option value="JSON">JSON</option><option value="JSONP">JSONP</option></select>
				<input type="text" class="inputText" style="width:188px;display:none;" id="jsonpName" placeholder="jsonp参数名" />
			</div><Br>
			<div class="ctrl">
				字段名:<input id="fieldname" type="text" class="inputText" style="width:340px;"/>
				类型:<select id="fieldtype" class="inputText select" style="width:200px;"><option value="input">text</option><option value="file">file</option></select>
				<input type="button" class="button green" onclick="addEle()" value="添加" />
			</div>
			form data:
			<div class="formdata">
			<form id="testForm" action="test" method="post" ></form>
			</div>
			<br/>
			<input type="button" class="button blue" onclick="todosubmit()" value="提交" /><input type="button" class="button red" onclick="" value="重置" />
			<br>
			result:
			<div id="_testResult" class="result"></div>
		</div>
	</div>
    <div id="testTab_2">
    	少小离家老大回，乡音无改鬓毛衰
    </div>
</div>

</body>
</html>
<script  type="text/javascript" >

var size = 0,fileSize = 0;
function addEle(){
	var fn = $("#fieldname").val(),ft = $("#fieldtype").val();
	if(fn != ''){
		if(ft == 'file') fileSize ++;
		var _ele = document.createElement('div');
		_ele.setAttribute('id','createEle'+ size);
		_ele.style.border = 'none';
		_ele.innerHTML = '<span class="fname">"'+ fn +'"</span>:<input  type="'+ ft +'" id="'+ fn +'" name="'+ fn +'" class="inputText"/><input type="button" onclick="cancel('+ size +')" class="button gray" value="取消"/>';
		$("#testForm")[0].appendChild(_ele);
		size ++;
		$("#fieldname").val('');
	}
}
function cancel(idx){
	if($("#createEle" + idx).find('input[type="file"]').size() > 0) fileSize --;
	$("#createEle" + idx).remove();
}
function todosubmit(){
	var _url = $("#reurl").val(),_post = $("#retype").val();
	if(fileSize > 0){
		$("#testForm").attr('encoding','multipart/form-data').attr('enctype','multipart/form-data');
		
		$("#testForm").ajaxSubmit({
			url:_url,
			type:_post,
			dataType:'json',
			success:function(d){
				$("#_testResult").html(JSON.stringify(d));
			},
			error:function(e){
				$("#_testResult").html(e);
			}
		});
	}else{
	    var _dataType = $("#reDataType").val();
	    var _option = {
						url : _url,
						type : _post,
						data : FormData.getFormData('testForm',['input']),
						dataType : _dataType,
						success : function(d){
							$("#_testResult").html(JSON.stringify(d));
						},
						error : function(e){
							$("#_testResult").html(JSON.stringify(e));
						}
					 }
		if(_dataType == 'JSONP') _option.jsonp = $("#jsonpName").val();
		$.ajax(_option);
	}
	
}

window.onload = function(){
	Chasonx.Tab({
			id : 'testTab',
		   	bHeight : 30,
		   	bWidth : 150,
		   	fontColor : '#f6f6f6',
		   	fontBlurColor : '#000',
		   	itemGroup :[
		   			{ position : 'top|left',
		   			  items :[{
						   		title : 'Form表单提交',
						   		html : 'are',
						   		focusColor : '#36aaf7',
						   		blurColor : '#2793db',
						   		panelId : 'testTab_1',
						   		handler : function(){
						   		}
						   	},
						   	{	
						   		title : '无Fuck说',
						   		html : 'you',
						   		focusColor : '#e440ed',
						   		blurColor : '#c829d1',
						   		panelId : 'testTab_2',
						   		handler : function(){
						   		}
						   	}]
					 }]
	});
	
	$("#reDataType").live('change',function(){
		if(this.value == 'JSONP') $("#jsonpName").show();
		else $("#jsonpName").hide();
	});

};


</script>