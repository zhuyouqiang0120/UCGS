<!DOCTYPE html>
<!--
                                                  
            .rrrsrssrsrrii;:.                     
           .8A&GG8898999999993S5s:                
           ;XGGGGG8889889999999999h.              
           ;XXXXXG888888889898888981              
           iXXXXXGGGG888888888889883.             
           rXXX&XXXXGGGGG88888898888;              
           1&XXX&XXGGG8G88888G898898h     ,ih3889;
           h&XXXXX&XGGG88GGGG8GG88889. ;h9X&A&&&H9  天 一 皇 不
  .,:;;;;:,9&AAA&X&&GGXGGGGX&GGXXGG8838&A&XXXXX&B1  下 入 图 胜
h5998888888&&AA&&&&&XXXGGXXXXXGGGGX&AA&&&X&&&&HBS   风 江 霸 人
89993933338XXXGGXGGG8898888998GXABMMMBHAAAHBBBXs    云 湖 业 生
9399333399888G888888888888GGXAM##M##MBBM#MHXS;      出 岁 谈 一
9399998888G88888888888GGXXXX89GAHBBMBBA3hi,         我 月 笑 场
89898888988899888GGXXXX&&&AG93S5S9HMH8S             辈 催 中 醉
G8GG8GG8GXXXXXX&AAA&88G&&&X899351s9BG95              ，； ， 。
55399933S51s8XX&&X&X33398933S55h1s3X55;           
            h8GGG8G9SS33333S5hhh1r983r            
            :39889955S533SS5h111ssGBG,            
             i39889S3333SS5h11ssi39s,             
              s999883333SS5h11si1Xs               
               h8GXXXGG8935h1srhXS1:              
                1998893S555h113XShh1ri,.          
           r5hr..s9999SS55hh3G8555h1h3hhi   .:;irs
           3Gi,;;;s83S93S38G8S555hh1hSh3s     .,;r
           3S:;;;i:13;SX&XG35SS55hh1h55s          
           89ii;;i;;s3XXG933SSS555hhSSs           
.         .XXiii;;;;iH#X989333SSSS5S3r            
.         :&Xsii;;;i:GBX899993SSSS3S;             
.         ;AAh;iii;;:XX389933SSSSS1,              
          rHH9;ii;;;:8S;;13993SS5i                
          sHH8;iii;;:3hi::;rsrii,                 
,    .  ::5HH9,:::::,91;;.                        
          							
 -->
<html>
<head>
<meta charset="UTF-8">
<title>UCGS 操作日志</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<style type="text/css">
.detailTitle        {padding:5px;text-align:right;color:#8E8E8E;}
.detailCon		    {padding:5px;}
#logDetails 		{display:none;}
</style>
</head>
<body>
<div class="mainBox">
	<@PermisstionBtnHtml />		
	<table class="tableDefault" width="99%" cellpadding="0" cellspacing="0" >
		<tr class="trDefault">
			<td width="5%"></td>
			<td width="5%">编号</td>
			<td width="15%">描述</td>
			<td width="10%">操作人</td>
			<td width="10%">操作时间</td>
			<td width="40%">操作详细</td>
			<td width="10%">结果</td>
			<td width="5%">详情</td>
		</tr>
		<tbody id="logData" class="tableData">
		</tbody>
	</table>
	<div  id="pagePanel"></div>
	</div>
	<div style="clear:both;"></div>
</div>	
<div id="logDetails">
	<table class="tableDefault" border="1" width="99%" cellpadding="0" cellspacing="0" >
		<tr>
			<td width="12.5%" class="detailTitle">类型：</td>
			<td width="12.5%" id="_dtitle" class="detailCon"></td>
			<td width="12.5%" class="detailTitle">操作人：</td>
			<td width="12.5%" id="_duser" class="detailCon"></td>
			<td width="12.5%" class="detailTitle">时间：</td>
			<td width="12.5%" id="_dtime" class="detailCon"></td>
			<td width="12.5%" class="detailTitle">结果：</td>
			<td width="12.5%" id="_dresult" class="detailCon"></td>
		</tr>
		<tr>
			<td class="detailTitle">操作描述：</td>
			<td colspan="7" id="_dcontent" class="detailCon"></td>
		</tr>
		<tr><td colspan="8">&nbsp;</td></tr>
		<tr>
			<td class="detailTitle">引用(referer)：</td>
			<td colspan="7" id="_dreferer" class="detailCon"></td>
		</tr>
		<tr>
			<td class="detailTitle">请求方法(method)：</td>
			<td id="_dmethod" class="detailCon"></td>
			<td class="detailTitle">接受语言(accept-language)：</td>
			<td id="_dalan" class="detailCon"></td>
			<td class="detailTitle">请求耗时(request-time)：</td>
			<td id="_dreqtime" class="detailCon"></td>
			<td class="detailTitle">标识符(uri)：</td>
			<td id="_duri" class="detailCon"></td>
		</tr>
		<tr>
			<td class="detailTitle">请求地址(ip)：</td>
			<td id="_dip" class="detailCon"></td>
			<td class="detailTitle">端口(port)：</td>
			<td id="_dport" class="detailCon"></td>
			<td class="detailTitle">接受格式(accept)：</td>
			<td colspan="3" id="_daccept" class="detailCon"></td>
		</tr>
		<tr>
		    <td class="detailTitle">内容格式(contentType)：</td>
			<td colspan="3" id="_dctype" class="detailCon"></td>
			<td class="detailTitle">内容编码(accept-encoding)：</td>
			<td id="_daccencoding" class="detailCon"></td>
			<td class="detailTitle">内容长度(contentlength)：</td>
			<td id="_dclen" class="detailCon"></td>
		</tr>
		<tr>
			<td class="detailTitle">用户代理(user-agent)：</td>
			<td colspan="7" id="_dagent" class="detailCon"></td>
		</tr>
		<tr><td colspan="8">&nbsp;</td></tr>
		<tr>
			<td class="detailTitle">Cookie(cookie)：</td>
			<td colspan="7" id="_dcookie" class="detailCon"> </td>
		</tr>
	<table>
</div>
<script type="text/javascript" src="${basePath}/res/plugs/mod/log/index.js" ></script>
</body>
</html>