/**
 * system log list
 */
var OperationLogs = {
		dataArray : null,
		group : function(){
			getAjaxData(DefConfig.Root + '/main/operlog/logTypeGroup',null,function(d){
				var _type = '<option value="">---选择类型---</option>',_user = '<option value="">---请选择用户----</option>';
				$.each(d.title,function(i,u){
					_type += '<option value="'+ u +'">'+ u +'</option>';
				});
				$.each(d.user,function(i,u){
					_user += '<option value="'+ u.fmodifyerguid +'">'+ u.fmodifyer +'</option>';
				});
				$("#_logType").html(_type);
				$("#_logUser").html(_user);
			});
			
			$("#_logQuery").bind('click',function(){
				OperationLogs.query();
			});
		},
		list : function(data){
			data = data || {};
			Chasonx.Wait.Show();
			Chasonx.Ajax({
				 url:DefConfig.Root + '/main/operlog/logList',
				 PageNumber:0,
				 PageSize:10,
				 data :data,
				 before : function(op){
					 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
					 if(StringHasText(op.data.startTime)) op.data.startTime += ' 00:00:00';
					 if(StringHasText(op.data.endTime)) op.data.endTime += ' 23:59:59';
					 return op;
				 },
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ OperationLogs.drawHtml(d);});	
					 OperationLogs.drawHtml(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});
		},
		query : function(){
			this.list({'startTime':$("#startTime").val(),'endTime':$("#endTime").val(),'title':$("#_logType").val(),'userGuid':$("#_logUser").val()});
		},
		drawHtml : function(d){
			var html = '';
			OperationLogs.dataArray = d.list;
			if(d.totalRow > 0){
				$.each(d.list,function(i,u){
					html += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'logsVal\',\'\')">\
								<td><input type="checkbox" name="logsVal" value="'+ u.id +'" idx="'+ i +'"/></td>\
							  <td>'+ (d.pageSize * (d.pageNumber - 1) + i + 1) +'</td>\
							  <td>'+ u.ftitle +'</td>\
							  <td>'+ u.fmodifyer +'</td>\
							  <td>'+ u.fmodifytime +'</td>\
							  <td>'+ OperationLogs.retContent( u.fcontent ) +'</td>\
							  <td>'+ u.fmodifyresult +'</td>\
							  <td><input type="button"  class="button blue btnsmall" value="查看" onclick="OperationLogs.detail('+ i +')"/></td></tr>';
				});
			}else{
				html = '<tr class="dataGridTr"><td colspan="8">暂无数据</td></tr>';
			}
			$("#logData").html(html);
		},
		retContent : function(con){
			con = eval('(' + con + ')');
			return "method:<font color='#eaa904'>[" + con.method + "]</font>,ctrl:<font color='#eaa904'>[" + con.ctrl + "]</font>,error:\
					<font color='red'>[" + con.error + "]</font>,url:<font color='#eaa904'>[" + con.url + "]</font>,ispara:<font color='#eaa904'>[" + con.ispara+"]</font>";
		},
		detail : function(idx){
			try{
			var winSize = ChasonTools.getWindowSize();
			var _w = winSize[2]*0.7,_h = winSize[3]*0.6;
			var data = this.dataArray[idx];
			
			if(typeof(data.fextdata) == 'string') data.fextdata = JSON.parse(data.fextdata);
			
			$("#_dtitle").html(data.ftitle);
			$("#_duser").html(data.fmodifyer);
			$("#_dtime").html(data.fmodifytime);
			$("#_dresult").html(data.fmodifyresult);
			$("#_dcontent").html(this.retContent(data.fcontent));
			$("#_dreferer").html(data.fextdata.referer);
			$("#_dmethod").html(data.fextdata.method);
			$("#_dalan").html(data.fextdata['accept-language']);
			$("#_dreqtime").html(data.fextdata['request-time']);
			$("#_duri").html(data.fextdata.uri);
			$("#_dip").html(data.fextdata.ip);
			$("#_dport").html(data.fextdata.port);
			$("#_daccept").html(data.fextdata.accept);
			$("#_dctype").html(data.fextdata.contentType);
			$("#_daccencoding").html(data.fextdata['accept-encoding']);
			$("#_dclen").html(data.fextdata.contentlength);
			$("#_dagent").html(data.fextdata['user-agent']);
			$("#_dcookie").html(data.fextdata.cookie);
			
			new Chasonx({
				title:'日志详情',
				html : $("#logDetails").html(),
				width: _w,height: _h,
				modal : true
			});
		
		}catch(d){
			console.debug(d);
		}
	}
};

addLoadHandler(OperationLogs.group);
addLoadHandler(OperationLogs.list);

