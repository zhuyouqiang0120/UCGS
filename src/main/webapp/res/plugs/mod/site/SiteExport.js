/**
 * 数据导出
 */
var SiteExport = {
	  init : function(){
		  SiteList.choose(function(obj){
			  var _siteEntity = SiteList._cacheData[obj.attr('idx')];
			  var winSize = ChasonTools.getWindowSize();
			  new Chasonx({
				  title : '站点数据导出',
				  html : '<div id="exportInfoPanel"></div><div id="exportColumnPanel"><ul id="exportColumnTree" class="easyui-tree" data-options="animate:true,checkbox:true"></ul></div>',
				  width : winSize[2]*0.5,height : winSize[3]*0.5,
				  success : function(){
					  var colArray = $("#exportColumnTree").tree('getChecked',['checked','indeterminate']);
					  var topic = $("#exportTopicCk")[0].checked;
					  var res = $("#exportResCk")[0].checked;
					  var col = $("#exportColumnCk")[0].checked;
					  var cidArray = [];
					  $.each(colArray,function(i,u){
							if(u.id != 0)	cidArray.push(u.guid);
					  });
					  Chasonx.Wait.Show("正在准备导出的数据，请稍候...");
					  getAjaxData(DefConfig.Root + '/main/site/siteExport',{'siteGuid':_siteEntity.fguid,'topic':topic,'column':col,'res':res,'cidArray' :cidArray },
							  function(d){
						  if(~~d.result > 0){
							  Chasonx.Hint.Success('数据已导出');
							  SiteExport.download(_siteEntity.fguid,d.sn);
						  }else{
							  Chasonx.Hint.Faild('导出失败');
						  }
						  
						  Chasonx.Wait.Hide();
					  });
					  return true;
				  },
				  modal : true
			  });
			  getAjaxData(DefConfig.Root + "/main/site/siteExportInfo",{'siteGuid':_siteEntity.fguid},function(d){
				  var html = '&nbsp;&nbsp;' + _siteEntity.fsitename + '<span><input type="checkbox" id="exportColumnCk" checked="checked"/><label for="exportColumnCk">全部栏目('+ d.colCount +')</label>->\
				  									   <input type="checkbox" id="exportTopicCk" checked="checked"/><label for="exportTopicCk">全部主题('+ d.topicCount +')</label>->\
				  									   <input type="checkbox" id="exportResCk" checked="checked"/><label for="exportResCk">全部资源('+ d.resCount +')</label></span>';
				  $("#exportInfoPanel").html(html);
				  PublicCol.list("exportColumnTree",{'id':_siteEntity.fguid,'name':_siteEntity.fsitename,'state':1});
			  });
		  });
	  },
	  download : function(sid,fname){
		  window.open(DefConfig.Root + "/main/site/downloadExportFile?siteGuid=" + sid + "&filename=" + fname);
	  },
	  history : function(){
		  SiteList.choose(function(obj){
			  var _siteEntity = SiteList._cacheData[obj.attr('idx')];
			  getAjaxData(DefConfig.Root + "/main/site/historyDataList",{"siteGuid":obj.attr("guid")},function(d){
				  var winSize = ChasonTools.getWindowSize();
				  new Chasonx({
					 title : _siteEntity.fsitename +  '_历史数据列表',
					 html : '<div id="exportHistoryData"></div>',
					 width : winSize[2] * 0.7,height : winSize[3] * 0.5,
					 modal : true
				  });
				  var line = '',_len = d.length;
				  $.each(d,function(i,u){
					 u = d[_len - i - 1];
					 line += '<div><span title="'+ u.fileName +'">'+ u.fileName +'</span><span>'+ u.modifyTime +'</span><span>'+ u.fileSizeFormat +'</span><span>\
					 		  <input type="button" class="button red btnsmall" value="删除" onclick="SiteExport.exec(\''+ _siteEntity.fguid +'\',\''+ u.fileName +'\',this)"/>\
					 		  <input type="button" class="button green btnsmall" value="导出" onclick="SiteExport.download(\''+ _siteEntity.fguid +'\',\''+ u.fileName +'\')"/></span></div>'; 
				  });
				  $("#exportHistoryData").html(line);
			  });
		  });
	  },
	  exec : function(sid,fname,obj){
		  Chasonx.Alert({
			 html : '确定删除吗？',
			 alertType : 'warning',
			 modal : true,
			 success : function(){
				 getAjaxData(DefConfig.Root + "/main/site/removeSiteData",{"siteGuid":sid,"filename":fname},function(d){
					 if(~~d > 0){
						 Chasonx.Hint.Success('删除成功');
						 $(obj).parent().parent().remove();
					 }else{
						 Chasonx.Hint.Faild("删除失败");
					 }
				 });
				 return true;
			 }
		  });
	  }
};
/*
 * 数据导入
 */
var SiteImport = {
	 init : function(){
		 var winSize = ChasonTools.getWindowSize();
		 new Chasonx({
			 title : '站点数据导入',
			 html : '<div class="importSiteData"><form id="SiteData_Import_Form" method="post" encoding="multipart/form-data" enctype="multipart/form-data">\
					<input type="file" class="inputText" name="ucgsDataFile" accept=".ucgs" value="浏览" id="ucgsDataFile" onchange="SiteImport.ckFileSuffix(this)"/></form></div>\
					<div class="importSiteData_center">注：请选择从本系统导出的数据文件，否则上传不成功，<font color="red">上传将覆盖现有站点数据，请谨慎操作</font>.<br>\
				    </div>',
			 width : winSize[2]*0.5,height : winSize[3] * 0.5,
			 success : function(){
				 if($("#ucgsDataFile").val() == '') return Chasonx.Hint.Faild('请选择数据文件');
					Chasonx.Wait.Show('正在导入站点数据，请稍候...');
					$("#SiteData_Import_Form").ajaxSubmit({
						url : DefConfig.Root + "/main/site/importExportData",
						type : 'post',
						dataType : 'json',
						success : function(d){
							if(~~d > 0){
								Chasonx.Hint.Success('数据已导入');
								SiteList.getList();
							}else{
								Chasonx.Hint.Faild('数据导入失败');
							} 
							Chasonx.Wait.Hide();
						},
						error : function(e){
							Chasonx.Wait.Hide();
						}
					});
					return true;
			 },
			 modal : true
		 });
	 },
	 ckFileSuffix : function(O){
			var suffix = O.value.substring(O.value.lastIndexOf('.') + 1,O.value.length);
			if(suffix.toUpperCase() != 'UCGS'){
				Chasonx.Hint.Faild('文件格式错误');
				O.value = '';
				return;
			}
	}
};