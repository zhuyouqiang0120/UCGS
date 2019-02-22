
/**
 * 表格选中一行
 * @param obj
 * @param name
 * @param pid
 */
function _setTrFocus(obj,name,pid,E){
	E = E || window.event;
	var target = E.target;
	
	if(target.type == 'checkbox'){
		$(target).parent().parent().attr('class',$(target).attr('checked')?'dataGridTrFocus':'dataGridTr');
	}else{
		$(".dataGridTrFocus").removeClass().addClass('dataGridTr');
		$("input[type='checkbox'][name='"+ name +"']").attr('checked',false);
		var $cb = $(obj).find("input[type='checkbox'][name='"+ name +"']");
		$cb.attr('checked',!$cb.attr('checked'));
		$(obj).removeClass().addClass($cb.attr('checked')?'dataGridTrFocus':'dataGridTr');
	}
	if($("input[type='checkbox'][name='"+ name +"']:checked").size() == $("input[type='checkbox'][name='"+ name +"']").size()) $("#" + pid).attr('checked',true);
	else $("#" + pid).attr('checked',false);
}
/**
 * 表格全选
 * @param obj
 * @param name
 */
function _selectAll(obj,name){
	$("input[type='checkbox'][name='"+ name +"']").attr('checked',obj.checked).each(function(){$(this).parent().parent().removeClass().addClass(obj.checked?'dataGridTrFocus':'dataGridTr');});
}
/**
 * 格式字符串
 * @param S
 * @returns
 */
function getString(S){
	if(S == '' || S == 'null' || S == null || S == undefined) S = '无数据';
	return S;
}

function isBlankString(v){
	return v != null && v != undefined && v != '' && v.replace(/[ ]/ig,'').length > 0;
}
/**
 * 字符验证
 * @param
 * @time 2017-04-10
 * @method
 *   defVal(str,default) return str; 验证并获取默认值 <br>
 *   isBlank(str) return boolean; 空验证 <br>
 *   getSearchParam(name...str) return str; 获取地址栏参数
 */
var StrKit = {
		defVal : function(S,V){
			return (S == '' || S == 'null' || S == null || S == undefined)?V?V:'无数据':S;
		},
		isBlank : function(S){
			return S == null || S == undefined || S.replace(/\s+/gi,'').length == 0;
		},
		getSearchParam : function(){
			var args = arguments;
			var _search = window.location.search;
			_search = _search.substring(1,_search.length);
			_search = _search.split('&');

			var v = args.length > 1?[]: '',_s,_arg;
			for(var s in _search){
				_s = _search[s].split('=');
				for(_arg in args){
					if(_s[0] && _s[0] == args[_arg]){
						if(args.length == 1){
							v = _s[1] || '';
							break;
						}else{
							v.push(_s[1]);
						}
					}
				}
			}
			return v;
		}
};

/**
 * 检测是否为空
 * @param S
 */
function StringHasText(S){
	return S != null && S != undefined? S.replace(/\s+/gi,'').length > 0:false;
}

function fileSizeForamt(size){
	if(null == size || size == '') return "0 Bytes";
	
	var unitArr = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],idx = 0;
	size = parseFloat(size);
	var _size = size / Math.pow(1024,(idx = Math.floor(Math.log(size)/Math.log(1024)))); 
	return _size.toFixed(2) + unitArr[idx];
}

function fileNameSubstr(files){
	return files.substring(files.indexOf('/'),files.length);
}

function getAjaxData(url,data,fn,dataType,jsonpName){
	data = data || {};
	dataType = dataType || 'json';
	var option = {
			url : url,
			data : data,
			type : 'post',
			dataType : (dataType || 'json'),
			jsonp : (jsonpName || ''),
			timeout : 10000,
			success : function(d){
				fn(d);
			},
			error : function(xhr,msg,e){
				fn(e);
				Chasonx.Hint.Faild(e);
			}
		};
	$.ajax(option);
}

function RegexUrl(url){
	var strRegex = /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
	return !!url.match(strRegex);
}

function RegexNumbber(v){
	var regex = /^[\d,]*$/ig;
	return !!v.match(regex);
}

function addLoadHandler(func){
	var load = window.onload;
	if(typeof(load) != 'function'){
		window.onload = func;
	}else{
		load();
		func();
	}
}

function getRandomColor(){
	return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}

function CCopyObject(obj){
	var nb = new Object();
	__loopObj(obj,nb);
	return nb;
}
function __loopObj(obj,tarObj){
	for(var f in obj){
		if(typeof obj[f] == 'object'){
			tarObj[f] = new Object();
			__loopObj(obj[f],tarObj[f]);
		}else{
			tarObj[f] = obj[f];
		}
	}
}

function _GetSkinName(){
	var skinName = ChasonTools.getCookie("UCGS_DEF_SKIN");
	return skinName == null?"dark": skinName.substring(skinName.lastIndexOf("/") + 1,skinName.lastIndexOf("."));
}

function _GetBoxLineColor(){
	if('lightblue' == _GetSkinName()) return '#e8e8e8';
	else return '#151921';
}

function _DefSkinInit(){
	var skin = ChasonTools.getCookie("UCGS_DEF_SKIN");
	if(!isBlankString(skin)) skin = '/res/skin/css/m/dark.css';
		
	$("#ucgs_default_skin").attr('href',DefConfig.Root + skin);
}

$(document).ready(function(){
	_DefSkinInit();
	
	$(".dialog-back").live("click",function(){
		Pane.closeFade();
	});
});

/**
 * @desc  getRecord(data,fn) <br>
 * @desc  getRecordList(data,fn) <br>
 * @desc  modify(data,fn) <br>
 * @desc  updeOrDel(data,fn);
 */
var UCGS_DAO = {
		getRecord : function(data,fn){
			getAjaxData(DefConfig.Root + '/main/unifyFX/getEntity',data,function(d){
				if(typeof fn == 'function') fn(d);
			});
		},
		getRecordList : function(data,fn){
			getAjaxData(DefConfig.Root + '/main/unifyFX/getRecordList',data,function(d){
				if(typeof fn == 'function') fn(d);
			});
		},
		modify : function(data,fn){
			getAjaxData(DefConfig.Root + '/main/unifyFX/modifyData',data,function(d){
				if(d.result){
					Chasonx.Hint.Success('处理成功');
					if(typeof fn == 'function') fn(d);
				}else{
					Chasonx.Hint.Faild('处理失败：' + d.msg);
				}
			});
		},
		updeOrDel : function(data,fn){
			getAjaxData(DefConfig.Root + '/main/unifyFX/removeOrUpdate',data,function(d){
				if(d.result){
					Chasonx.Hint.Success('处理成功');
					if(typeof fn == 'function') fn(d);
				}else{
					Chasonx.Hint.Faild('处理失败：' + d.msg);
				}
			});
		}
};

var getDocAuthCode = function(fn){
		getAjaxData(DefConfig.Root + '/main/doc/getAuthCode',null,function(d){
			if(typeof fn == 'function') fn(d);
		});
};

var Pane = {
		mainId : null,
		targetId : null,
		openFade : function(mainId,targetId,fn){
			 this.mainId = mainId;
			 this.targetId = targetId;
			 $("#" + mainId).addClass("global-scale");
			 $("#" + targetId).addClass("global-fade-am");
			 if(typeof(fn) == "function") fn();
		},
		closeFade : function(fn){
			 $("#" + this.mainId).removeClass("global-scale");
			 $("#" + this.targetId).removeClass("global-fade-am");
			 if(typeof(fn) == 'function') fn();
		}
};