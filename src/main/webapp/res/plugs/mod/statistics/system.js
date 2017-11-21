///
;(function(win,$){
	
	var _Option,_ER;
	function system(){
		_ER = echarts.init($("#serverOverview")[0]);
		_Option = {
			    tooltip : {
			        formatter: "{a} <br/>{c} %"
			    },
			    toolbox: {
			        show: true,
			        feature: {
			            restore: {show: true},
			        }
			    },
			    series : [
			        {
			            name: 'CPU使用',
			            type: 'gauge',
			            z: 3,
			            min: 0,
			            max: 100,
			            splitNumber: 10,
			            radius: '70%',
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 10
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			                length: 15,        // 属性length控制线长
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    color: 'auto'
			                }
			            },
			            splitLine: {           // 分隔线
			                length: 20,         // 属性length控制线长
			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
			                    color: 'auto'
			                }
			            },
			            title : {
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder',
			                    fontSize: 20,
			                    fontStyle: 'italic'
			                }
			            },
			            detail : {
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder'
			                }
			            },
			            data:[{value: 0, name: 'CPU'}]
			        },
			        {
			            name: '内存',
			            type: 'gauge',
			            center: ['20%', '55%'],    // 默认全局居中
			            radius: '50%',
			            min:0,
			            max:100,
			            endAngle:10,
			            splitNumber:10,
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 8
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			                length:12,        // 属性length控制线长
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    color: 'auto'
			                }
			            },
			            splitLine: {           // 分隔线
			                length:20,         // 属性length控制线长
			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
			                    color: 'auto'
			                }
			            },
			            pointer: {
			                width:5
			            },
			            title: {
			                offsetCenter: [0, '-30%'],       // x, y，单位px
			                textStyle : {
			                	fontWeight: 'bolder',
			                    fontSize: 20,
			                    fontStyle: 'italic'
			                }
			            },
			            detail: {
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder'
			                }
			            },
			            data:[{value: 0, name: '内存'}]
			        },
			        {
			            name: '交换区用量',
			            type: 'gauge',
			            center: ['80%', '55%'],    // 默认全局居中
			            radius: '50%',
			            startAngle: 170,
			            endAngle : -30,
			            min:0,
			            max:100,
			            splitNumber:10,
			            axisLine: {            // 坐标轴线
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    width: 8
			                }
			            },
			            axisTick: {            // 坐标轴小标记
			                length:12,        // 属性length控制线长
			                lineStyle: {       // 属性lineStyle控制线条样式
			                    color: 'auto'
			                }
			            },
			            splitLine: {           // 分隔线
			                length:20,         // 属性length控制线长
			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
			                    color: 'auto'
			                }
			            },
			            pointer: {
			                width:5
			            },
			            title: {
			                offsetCenter: [0, '-30%'],       // x, y，单位px
			                textStyle : {
			                	fontWeight: 'bolder',
			                    fontSize: 20,
			                    fontStyle: 'italic'
			                }
			            },
			            detail: {
			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
			                    fontWeight: 'bolder'
			                }
			            },
			            data:[{value: 0, name: '交换区'}]
			        }
			    ]
			};
		_ER.setOption(_Option);
	}
	
	function publicLine(opt){
		this.opt = opt || {};
		this.data = opt.data || [];
		this.init();
	}
	publicLine.prototype = {
		init : function(){
			var _data = this.data;
			this.option = {
				    title: {
				        text: this.opt.title
				    },
				    tooltip: {
				        trigger: 'axis',
				        formatter: '{a} {b} <br/> {c} %',
				        axisPointer: {
				            animation: false
				        }
				    },
				    xAxis: [{
				    	type : 'category',
			            boundaryGap : false,
				        data : _data.map(function(item){
				        	return item[0];
				        })
				    }],
				    yAxis: [{
				    	type : 'value',
				    	min : 0,
				    	max : 100
				    }],
				    series: [{
				        name: this.opt.seriName,
				        type: 'line',
				        data: _data.map(function(item){
				        	 return item[1];
				        })
				    }]
				};
			this.ER = echarts.init($("#" + this.opt.id)[0]);
			this.ER.setOption(this.option);
		},
		refresh : function(_data){
			var data = this.data;
			data.push(_data);
			if(data.length > 30) data.shift();
			var option = this.ER.getOption();
			option.series[0].data = data.map(function(item){
				return item[1];
			});
			option.xAxis[0].data = data.map(function(item){
				return item[0];
			});
			this.ER.setOption(option);
		}
	};
	
	win.SSystem = {
		data : null,
		cpuChart : null,
		memChart : null,
		swapChart : null,
		getData : function(){
			getAjaxData(DefConfig.Root + '/main/statistics/systemStatistics',null,function(d){
				SSystem.data = d;
				SSystem.dataFilter();
				SSystem.cpu();
				SSystem.mem();
				SSystem.task();
				SSystem.swap();
			});
		},
		dataFilter : function(){
			var mmTotal = this.data.List.Mem.total.replace('k',''),
				mmUsed = this.data.List.Mem.used.replace('k',''),
				mmPercent = ((mmUsed*1)/(mmTotal*1)*100).toFixed(1);
			var swapTotal = this.data.List.Swap.total.replace('k',''),
				swapUsed = this.data.List.Swap.used.replace('k',''),
				swatPercent = ((swapUsed*1)/(swapTotal*1)*100).toFixed(1);
			
			_Option.series[0].data[0].value = this.data.List['Cpu(s)'].us;
			_Option.series[1].data[0].value = mmPercent;
			_Option.series[2].data[0].value = swatPercent;
			_ER.setOption(_Option,true);
		},
		cpu : function(){
			var _cpu = this.data.List['Cpu(s)'];
			var line = '<span>用户空间：<b>'+ _cpu.us +' % </b></span>\
						<span>内核空间：<b>'+ _cpu.sy +'%</b></span>\
						<span>空闲：<b>'+ _cpu.id +'%</b></span>\
						<span>硬件CPU中断：<b>'+ _cpu.hi +'%</b></span>\
						<span>软件CPU中断：<b>'+ _cpu.si +'%</b></span>\
						<span>虚拟机：<b>'+ _cpu.st +'%</b></span>\
						<span>进程空间优先级变更：<b>'+ _cpu.ni +'%</b></span>\
						<span>等待输入输出：<b>'+ _cpu.wa +'%</b></span>';
			$("#cpuDetail").html(line);
			if(this.cpuChart == null){
				this.cpuChart = new publicLine({
					id : 'cpuStatisitcs',
					title : this.data.Date + ' - CPU使用情况',
					seriName : 'CPU百分比',
					data : [ [this.data.Time,_cpu.us*1] ]
				});
			}else{
				this.cpuChart.refresh([this.data.Time,_cpu.us*1]);
			}
		},
		mem : function(){
			var mem = this.data.List.Mem,
				total = mem.total.replace('k',''),
				used = mem.used.replace('k',''),
				percent = ((used*1)/(total*1)*100).toFixed(1);
			var line = '<span>物理内存总量：<b>'+ fileSizeForamt(total * 1024) +'</b></span>\
					  <span>已使用内存总量：<b>'+ fileSizeForamt(used * 1024) +'</b></span>\
					  <span>空闲内存总量：<b>'+ fileSizeForamt((mem.free.replace('k','')) * 1024) +'</b></span>\
					  <span>内核缓存内存总量：<b>'+ fileSizeForamt((mem.buffers.replace('k','')) * 1024) +'</b></span>';
			$("#memDetail").html(line);
			if(this.memChart == null){
				this.memChart = new publicLine({
					id : 'memStatisitcs',
					title : this.data.Date + ' - 内存使用情况',
					seriName : '内存百分比',
					data : [ [this.data.Time, percent] ]
				});
			}else{
				this.memChart.refresh([ this.data.Time, percent ]);
			}
		},
		task : function(){
			var task = this.data.List.Tasks;
			var line = '<span>进程总数：<b>'+ task.total +'</b></span>\
						<span>正在运行进程数：<b>'+ task.running +'</b></span>\
						<span>睡眠进程数：<b>'+ task.sleeping +'</b></span>\
						<span>已停止进程数：<b>'+ task.stopped +'</b></span>\
						<span>僵尸进程数：<b>'+ task.zombie +'</b></span>';
			$("#taskDetail").html(line);
		},
		swap : function(){
			var swap = this.data.List.Swap,
				total = swap.total.replace('k',''),
				used = swap.used.replace('k',''),
				percent = ((used*1)/(total*1)*100).toFixed(1);
			var line = '<span>交换区总量：<b>'+ fileSizeForamt(total * 1024) +'</b></span>\
						<span>已使用交换总量：<b>'+ fileSizeForamt(used * 1024) +'</b></span>\
						<span>交换区空闲总量：<b>'+ fileSizeForamt( (swap.free.replace('k','')) * 1024 ) +'</b></span>\
						<span>缓冲的交换区总量：<b>'+ fileSizeForamt( (swap.cached.replace('k','') * 1024) ) +'</b></span>';
			$("#swapDetail").html(line);
			if(this.swapChart == null){
				this.swapChart = new publicLine({
					id : 'swapStatisitcs',
					title : this.data.Date + ' - 交换区使用情况',
					seriName : '交换区使用百分比',
					data : [ [this.data.Time, percent ] ]
				});
			}else{
				this.swapChart.refresh([this.data.Time, percent]);
			}
		}
	};
	
	$(function(){
		$("#statisticsLeft > .statisticsMenuItem").live('click',function(){
			$("div[class='statisticsMenuItem statisticsItemFocus']").removeClass('statisticsItemFocus');
			$(this).addClass('statisticsItemFocus');
			var _idx = $(this).index(); 
			$("div[class='items sysStatisticsFocus']").removeClass('sysStatisticsFocus');
			$(".statisticsShadowPanel").removeClass('statisticsShadowShow');
			if(_idx != 0){
				$(".statisticsChartsPanel > .items").eq(_idx).addClass('sysStatisticsFocus');
				$(".statisticsShadowPanel").addClass('statisticsShadowShow');
			}
		});
		
		Chasonx.Frameset({
			main   : 'statisticsMain',
			window : {
				left : {id : 'statisticsLeft',width : '80px',bgColor : '#696969',border:false,slide : false},
				right: {id : 'statisticsRight',bgColor : false,border:false}
				}
		});
		
		system();
		SSystem.getData();
		
		var _autoRefreshTime = null;
		$("#autoRefresh").live('click',function(){
			if($(this)[0].checked == true){
				_autoRefreshTime = setInterval(function(){
					SSystem.getData();
				},1000);
			}else if(_autoRefreshTime != null){
				clearInterval(_autoRefreshTime);
			}
		});	
		
		$("#statisticsLeft > .statisticsMenuItem").eq(0).click();
	});
})(window,$);
