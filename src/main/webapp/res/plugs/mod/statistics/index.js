
/**
 * 统计
 */
;(function(win,$,undefined){
	
	function statisticsWeek(d){
		var ER = echarts.init($("#statisticsWeek")[0]);
		var _legend = ['站点数量','独立IP','日访问量','主题访问'];
		var option = {
			    title: {
			        text: '一周访问统计',
			        subtext : '耗时：' + d.Elapsed + 'ms'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data: _legend
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data : d.PDate || []
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:_legend[0],
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:d.PSiteSite || []
			        },
			        {
			            name: _legend[1],
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data: d.IPSize || []
			        },
			        {
			            name: _legend[2],
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data: d.PVSize || []
			        },
			        {
			            name:_legend[3],
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:d.PSize || []
			        }
			    ]
			};

		ER.setOption(option);
	}
	
	function statisticsDevice(_Data){
		var ER = echarts.init($("#statisticsDevice")[0]);
		var option = {
			    backgroundColor: '#f6f6f6',
			    title: {
			        text: '设备访问统计',
			        subtext : '近30天数据分析 ' + '耗时：' + _Data.Elapsed + 'ms',
			        left: 'center',
			        textStyle: {
			            color: '#444242'
			        }
			    },
			    legend : {
			    	 orient: 'vertical',
				     left: 'left',
				     data : _Data.Legend
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    visualMap: {
			        show: false,
			        min: 80,
			        max: 600,
			        inRange: {
			            colorLightness: [0, 1]
			        }
			    },
			    series : [
			        {
			            name:'设备类型',
			            type:'pie',
			            radius : '55%',
			            center: ['50%', '50%'],
			            data:_Data.Data.sort(function (a, b) { return a.value - b.value}),
			            roseType: 'angle',
			            label: {
			                normal: {
			                    textStyle: {
			                        color: 'rgba(0, 0, 0, 0.6)'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    lineStyle: {
			                        color: 'rgba(0, 0, 0, 0.6)'
			                    },
			                    smooth: 0.2,
			                    length: 10,
			                    length2: 20
			                }
			            },
			            itemStyle: {
			                normal: {
			                    color: '#c23531',
			                    shadowBlur: 100,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            },
			            animationType: 'scale',
			            animationEasing: 'elasticOut',
			            animationDelay: function (idx) {
			                return Math.random() * 200;
			            }
			        }
			    ]
			};
		 ER.setOption(option);
	}
	
	function statisticsOsName(_Data){
		var ER = echarts.init($("#statisticsOsName")[0]);
		var option = {
			    title : {
			        text: '操作系统统计',
			        subtext: '近30天数据分析 ' + '耗时：' + _Data.Elapsed + 'ms',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data: _Data.Legend
			    },
			    series : [
			        {
			            name: '操作系统名称',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:_Data.Data,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
		ER.setOption(option);
	}
	
	function statisticsBrowser(_Data){
		var ER = echarts.init($("#statisticsBrowser")[0]);
		var option = {
				title : {
					text : '浏览器终端统计',
					subtext : '近30天数据分析 ' + '耗时：' + _Data.Elapsed + 'ms',
					x : 'center'	
				},
			    color: ['#3398DB'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {       
			            type : 'shadow'        
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : _Data.Legend,
			            axisTick: {
			                alignWithLabel: true
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'访问量',
			            type:'bar',
			            barWidth: '60%',
			            data: _Data.Data
			        }
			    ]
			};
		ER.setOption(option);
	}
	
	function STopicDataFilter(_Data,id,title,subtitle,seriname,startVal,fn){
		var ER = echarts.init($("#" + id)[0]);
		var option = {
		        title: {
		            text: title,
		            subtext : subtitle
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
		        xAxis: {
		            data: _Data.map(function (item) {
		                return item[0];
		            })
		        },
		        yAxis: {
		            splitLine: {
		                show: false
		            }
		        },
		        toolbox: {
		            left: 'center',
		            feature: {
		                dataZoom: {
		                    yAxisIndex: 'none'
		                },
		                restore: {}
		            }
		        },
		        dataZoom: [{
		            startValue: startVal
		        }, {
		            type: 'inside'
		        }],
		        visualMap: {
		            top: 10,
		            right: 10,
		            pieces: [{
		                gt: 0,
		                lte: 50,
		                color: '#096'
		            }, {
		                gt: 50,
		                lte: 100,
		                color: '#ffde33'
		            }, {
		                gt: 100,
		                lte: 150,
		                color: '#ff9933'
		            }, {
		                gt: 150,
		                lte: 200,
		                color: '#cc0033'
		            }, {
		                gt: 200,
		                lte: 300,
		                color: '#660099'
		            }, {
		                gt: 300,
		                color: '#7e0023'
		            }],
		            outOfRange: {
		                color: '#999'
		            }
		        },
		        series: {
		            name: seriname,
		            type: 'line',
		            data: _Data.map(function (item) {
		                return item[1];
		            }),
		            markLine: {
		                silent: true,
		                data: [{
		                    yAxis: 50
		                }, {
		                    yAxis: 100
		                }, {
		                    yAxis: 150
		                }, {
		                    yAxis: 200
		                }, {
		                    yAxis: 300
		                }]
		            }
		        }
		    };
		ER.setOption(option);
		ER.on('click',function(param){
			if(typeof fn == 'function')
				fn(param.name);
		});
	}
	
	function publicPie(data,legend,id,title,seriname){
		var ER = echarts.init($("#" + id)[0]);
		var option = {
			    title : {
			        text: title,
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data: legend
			    },
			    series : [
			        {
			            name: seriname,
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:data,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
		ER.setOption(option);
	}
	
	function colPubStatis(Data,ID,Title,Subtitle,Seriname,fn){
		var ER = echarts.init($("#" + ID)[0]);
		var option = {
			    title: {
			        text: Title,
			        subtext: Subtitle
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'value',
			        boundaryGap: [0, 0.01]
			    },
			    yAxis: {
			        type: 'category',
			        data: Data.map(function(item){
			        	return item[0];
			        })
			    },
			    series: [
			        {
			            name: Seriname,
			            type: 'bar',
			            data: Data.map(function(item){
			            	return item[1];
			            })
			        }
			    ]
			};
		ER.setOption(option);
		ER.on('click',function(param){
			if(typeof fn == 'function')
				fn(param);
		});
	}
	
	win.STopic = {
		  list : function(L){
			  L = L || 10;
			  getAjaxData(DefConfig.Root + '/main/statistics/topicStatistics',{limit : L},function(d){
				  STopic.draw(d.List,'topicListPanel',d.Elapsed,L);
			  });
		  },
		  draw : function(data,id,elapsed,L){
			  var line = '<div><span>点击量</span><b>标题 Top '+ L +'</b> <font color="#949696">耗时：'+ elapsed +'ms</font></div>';
			  $.each(data,function(i,u){
				  line += '<div><span>'+ u.TopicSize +'</span><a href="javascript:void(0)" >'+ u.Title +'</a></div>';
			  });
			  $("#" + id).html(line);
		  },
		  statistics : function(){
			  getAjaxData(DefConfig.Root + '/main/statistics/allTopicDataStatistics',null,function(d){
				  new STopicDataFilter(d.List,'statisticsTopicData','主题访问统计','点击节点查看详情 耗时：'+ d.Elapsed +'ms','主题点击量',d.StartDate,function(date){
					  STopic.detail(date);
				  });
			  });
		  },
		  detail : function(date){
			  getAjaxData(DefConfig.Root + '/main/statistics/topicDetail',{date : date},function(d){
				 var line = '<div class="title">日期：'+ date +', 文章访问总数：'+ d.Attr.PSize +', 独立IP访问总数：'+ d.Attr.IPSize +', \
					 		本次检索耗时：' + d.Elapsed + ' ms </div>';
				 $("#topicAttr").html(line);
				 STopic.draw(d.TopList,'topicTopList',d.Elapsed,10);
				 new publicPie(d.Device.Data,d.Device.Legend,'statisticsTopicDevice','设备访问统计','设备访问量');
				 new publicPie(d.OSName.Data,d.OSName.Legend,'statisticsTopicOSname','操作系统统计','操作系统访问量');
				 new publicPie(d.Browser.Data,d.Browser.Legend,'statisticsTopicBrowser','设备浏览器统计','浏览器访问量');
				 
//				 STopic.dataFilter(d.Device,'statisticsTopicDevice','设备访问统计','设备访问量');
//				 STopic.dataFilter(d.OSName,'statisticsTopicOSname','操作系统统计','操作系统访问量');
//				 STopic.dataFilter(d.Browser,'statisticsTopicBrowser','设备浏览器统计','浏览器访问量');
				 
				 STopic.timeDetail(date);
			  });
		  },
		  timeDetail : function(date){
			  getAjaxData(DefConfig.Root + '/main/statistics/topicTimeDetail',{date:date},function(d){
				  new STopicDataFilter(d.List,'statisticsTopicTime','时间段主题访问统计(24H)','耗时：' + d.Elapsed + ' ms','主题点击量',d.startVal);
			  });
		  },
		  dataFilter : function(data,id,title,seriname){
			  var legend = [];
			  for(var i = 0,len = data.length;i < len;i++)
				  legend.push(data[i].name);
			  new publicPie(data,legend,id,title,seriname);
		  }
	};
	
	function _getTopicLimitData(data,id,L){
		getAjaxData(DefConfig.Root + '/main/statistics/topicLimitByParam/' + data,null,function(d){
			STopic.draw(d.List,id,d.Elapsed,L);
		});
	}
	
	win.SCol = {
		  data : null,
		  allStatistics : function(){
			  getAjaxData(DefConfig.Root + '/main/statistics/columnStatistics',null,function(d){
				  SCol.data = d.List;
				  new colPubStatis(d.List,'columnLimit','栏目数据概览','耗时：' + d.Elapsed + 'ms','栏目点击量',function(param){
					  var _data = SCol.getGuid(param.name);
					  SCol.detail(_data);
					  _getTopicLimitData(_data[0],'topicTopListForColumn',10);
				  });
			  });
		  },
		  detail : function(_data){
			  scStatisticsDetail(_data[0],_data[1],'columnDetails',0);
			  
//			  getAjaxData(DefConfig.Root + '/main/statistics/scStatisticsDetail',{guid : _data[0],type : },function(d){
//				 new STopicDataFilter(d.List,'columnDetails',_data[1] + ' 访问统计','耗时：' + d.Elapsed + ' ms','栏目点击量',d.startVal);
//			  });
		  },
		  getGuid : function(name){
			  var _guid = '';
			  for(var i = 0,len = this.data.length;i < len;i ++){
				  if(this.data[i][0] == name){
					  _guid = this.data[i][2];
					  break;
				  }
			  }
			  return [_guid,name];
		  }
	};
	win.SSite = {
		  data : null,
		  allStatistics : function(){
			  getAjaxData(DefConfig.Root + '/main/statistics/siteStatistics',null,function(d){
				 SSite.data = d.List;
				 new colPubStatis(d.List,'siteStatistics','站点数据概览','耗时：' + d.Elapsed + 'ms','站点点击量',function(param){
					 var _data = SSite.getGuid(param.name);
					 SSite.detail(_data);
					 _getTopicLimitData(_data[0],'topicTopListForSite',10);
				 });
			  });
		  },
		  detail : function(_data){
			  scStatisticsDetail(_data[0],_data[1],'siteDataDetails',1);
			  
//			  getAjaxData(DefConfig.Root + '/main/statistics/siteStatistics',{guid : _data[0]},function(d){
//				  new STopicDataFilter(d.List,'siteDataDetails',_data[1] + ' 访问统计','耗时：' + d.Elapsed + ' ms','站点点击量',d.startVal);
//			  });
		  },
		  getGuid : function(name){
			  var _guid = '';
			  for(var i = 0,len = this.data.length;i < len;i ++){
				  if(this.data[i][0] == name){
					  _guid = this.data[i][2];
					  break;
				  }
			  }
			  return [_guid,name];
		  }
	};
	win.SInter = {
			currIname : null,
			currIdate : null,
			statistics : function(){
				SInter.currIname = null;
				getAjaxData(DefConfig.Root + '/main/statistics/interStatistics',null,function(d){
					 new colPubStatis(d.List,'interStatistics','接口访问概览','耗时：' + d.Elapsed + 'ms','接口访问量',function(param){
//						 SInter.currIname = param.name;
						 SInter.detail(param.name);
						 SInter.ipCaller(param.name);
					 });
				});
			},
			detail : function(iname){
				SInter.currIdate = null;
				scStatisticsDetail(iname,iname,'interDataDetails',2);
				
//				getAjaxData(DefConfig.Root + '/main/statistics/interStatistics',{iName : iname},function(d){
//					 new STopicDataFilter(d.List,'interDataDetails',iname + ' 访问统计','耗时：' + d.Elapsed + ' ms','接口访问量',d.startVal,function(name){
//						 SInter.currIdate = name;
//						 SInter.ipCaller();
//					 });
//				});
			},
			ipCaller : function(name){
				ChasonTools.delayRun(function(){
					getAjaxData(DefConfig.Root + "/main/statistics/ipCaller/" + name,null,function(d){
						var line = '<div><span>访问次数</span>\
										 <span style="width:150px;">IP</span>\
										 <span style="width:150px;">浏览器</span>\
										 <span style="width:150px;">设备类型</span>\
										 <span style="width:150px;">操作系统</span>\
										<font color="#949696">耗时：'+ d.Elapsed +'ms</font></div>';
						
						var _data;
						$.each(d.List,function(i,u){
							line += '<div><span>'+ u.Size +'</span>\
									 <span style="width:150px;">'+ u.IP +'</span>';
							_data = JSON.parse(u.Data);
							line += '<span style="width:150px;">'+ (_data.B || '') +'</span>\
									 <span style="width:150px;">'+ (_data.D || '') +'</span>\
									 <span style="width:150px;">'+ (_data.OS || '') +'</span>\
									 </div>';
						});
						$("#callerDataDetails").html(line);
					});
				});
			}
	};

	function scStatisticsDetail(_guid,_name,_id,type,fn){
		 getAjaxData(DefConfig.Root + '/main/statistics/scStatisticsDetail',{guid : _guid,type : type},function(d){
			 new STopicDataFilter(d.List,_id,_name + ' 访问统计','耗时：' + d.Elapsed + ' ms','栏目点击量',d.startVal,fn);
		  });
	}
	
	var statistics = [ {Url : '/main/statistics/dataCheckForWeek',Fn : 'SWeek'},
	                   //{Url : '/main/statistics/dataCheckForDevice',Fn : 'SDevice'},
	                   //{Url : '/main/statistics/dataCheckForOSType',Fn : 'SOSName'},
	                   //{Url : '/main/statistics/dataCheckForBrowser',Fn : 'SBrowser'}
	                 ],
	    _idx = 0;
	var _delay = function(){
		ChasonTools.delayRun(function(){
			getAjaxData(DefConfig.Root + statistics[_idx].Url,null,function(d){
				win[statistics[_idx].Fn](d);
				_idx ++;
				if(_idx < statistics.length){
					_delay();
				}
			});
		});
	};
	
	
	win.SWeek = function(d){ 
		d.WeekData.Elapsed = d.Elapsed;
		d.Device.Elapsed = d.Elapsed;
		d.OSType.Elapsed = d.Elapsed;
		d.Browser.Elapsed = d.Elapsed;
		statisticsWeek(d.WeekData);
		statisticsDevice(d.Device);
		statisticsOsName(d.OSType);
		statisticsBrowser(d.Browser);
	};
	win.SDevice = function(d){statisticsDevice(d); };
	win.SOSName = function(d){statisticsOsName(d); }
	win.SBrowser = function(d){statisticsBrowser(d); };
	
	win.onload = function(){
		Chasonx.Frameset({
			main   : 'statisticsMain',
			window : {
				top  : {id : 'statisticsTop' ,height : '0px',bgColor : false,border:false},
				left : {id : 'statisticsLeft',width : '80px',bgColor : '#696969',border:false,slide : false},
				right: {id : 'statisticsRight',bgColor : false,border:false}
				}
		});
		
		$("#statisticsLeft > .statisticsMenuItem").live('click',function(){
			$("div[class='statisticsMenuItem statisticsItemFocus']").removeClass('statisticsItemFocus');
			$(this).addClass('statisticsItemFocus');
			$(".statisticsChartsPanel").hide();
			var _idx = $(this).index();
			$(".statisticsChartsPanel").eq(_idx).show();
			
			switch(_idx){
			case 0: _delay(); break;
			case 1:
				STopic.list();
				STopic.statistics();
				break;
			case 2:
				SCol.allStatistics();
				break;
			case 3:
				SSite.allStatistics();
				break;
			case 4:
				SInter.statistics();
				break;
			}
		});
		
		$("#statisticsLeft > .statisticsMenuItem").eq(0).click();
	};
})(window,$);