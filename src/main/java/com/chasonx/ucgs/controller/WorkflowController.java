/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-10-30 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.api.Ret;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.IWorkflowDao;
import com.chasonx.ucgs.dao.TopicDao;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.Topic;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;
import com.zens.xworkflow.entity.TaskExecuteResult;
import com.zens.xworkflow.entity.TaskPage;
import com.zens.xworkflow.entity.TaskSize;
import com.zens.xworkflow.entity.TaskWork;

/**工作流 
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-10-30下午3:05:57
 * @remark
 */
public class WorkflowController extends Controller{
	
	IWorkflowDao workflowDao = new IWorkflowDao();

	public void index(){
		TConfig config = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.Config.WorkFlowServer.toString());
		if(null != config){
			setAttr("WORK_FLOW", config.getStr("remotehost"));
		}
		render(PageUtil.WORKFLOW_MAIN);
	}
	
	public void edit(){
		render(PageUtil.WORKFLOW_EDIT);
	}
	
	public void create(){
		Ret ret = new Ret();
		try{
			String name = getPara("workfName");
			String key = getPara("workfType");
			String secondKey = getPara("workSite");
			String remark = getPara("workfDesc");
			
			//ret.setResult( WorkflowDao.craeteModel(name, key, secondKey, remark)? 1 : 0);
			ret.setResult(workflowDao.createWorkflow(name, key, secondKey, remark, Constant.UCGS_ClientGuid) ? 1 : 0);
		}catch(Exception e){
			
		}
		renderJson(ret);
	}
	
	public void list(){
		Ret ret = new Ret();
		try {
			ret.setData(workflowDao.listTaskEntityByClientGuid(Constant.UCGS_ClientGuid));
		} catch (MalformedURLException e) {
			e.printStackTrace();
			ret.setMsg(e.getMessage());
		}
		
		if(ret.getData() != null){
			ret.setResult(1);
		}
		renderJson(ret);
	}
	
	public void getTaskSize(){
		String userGuid = DHttpUtils.getLoginUser(getRequest()).getStr("fguid");
		Ret ret = new Ret();
		TaskSize size = null;
		long uncheckSize = 0;
		try {
			 size = workflowDao.getTaskSizeByPersonGuid(userGuid);
			 uncheckSize = TopicDao.getTopicSizeByCreaterGuid(0, userGuid);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			ret.setMsg(e.getMessage());
		}
		Record data = new Record();
		data.set("workflow", size);
		data.set("selfPendingSize", uncheckSize);
		ret.setData(data);
		ret.setResult(1);
		
		renderJson(ret);
	}
	
	public void listTask(){
		String userGuid = DHttpUtils.getLoginUser(getRequest()).getStr("fguid");
		int pageSize = getParaToInt("pageSize");
		int pageNumber = getParaToInt("pageNumber");
		
		List<Topic> topics = null;
		TaskPage taskPage = null;
		List<Record> topicData = new ArrayList<Record>();
		Ret ret = new Ret();
		try {
			taskPage = workflowDao.listTaskByPersonGuid(userGuid, pageSize, pageNumber);
			List<TaskWork> works = taskPage.getList();
			List<String> topicGuids = new ArrayList<String>();
			if(!works.isEmpty()){
				for(int i = 0,len = works.size();i < len;i ++){
					topicGuids.add(works.get(i).getBusinessId());
				}
				topics = TopicDao.getCheckTopicListByGuids(topicGuids);
				
				TaskWork work;
				Topic topic;
				for(int i = 0,len = works.size();i < len;i ++){
					work = works.get(i);
					topic = topics.get(i);
					Record r = new Record();
					r.set("taskId", work.getTaskId());
					r.set("topicGuid", work.getBusinessId());
					r.set("checkState", work.getCheckState());
					r.set("personState", work.getPersonState());
					r.set("personGuid", work.getPersonId());
					r.set("modifyTime", work.getModifyTime());
					r.set("remark", work.getRemark());
					r.set("title", topic.getStr("ftitle"));
					r.set("classes", topic.getInt("fclass"));
					r.set("source", topic.getStr("fsource"));
					r.set("releaseer", topic.getStr("freleaseer"));
					r.set("releasetime", topic.getStr("freleasetime"));
					r.set("label", topic.getStr("flabel"));
					
					topicData.add(r);
				}
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
			ret.setMsg(e.getMessage());
		}
		
		ret.setData(topicData);
		
		if(topicData != null){
			ret.setResult(1);
		}
		
		renderJson(ret);
	}
	
	public void modifyNodeState(){
		int check = getParaToInt("check");
		String remark = getPara("remark");
		String taskId = getPara("taskId");
		String topicGuid = getPara("topicGuid");
		
		Ret ret = new Ret();
		try{
			TaskExecuteResult data = workflowDao.execute(taskId, check == Constant.TOPIC_CHECK_SUCCESS, remark) ;  // WorkflowDao.updateTaskState(taskId, check + "", processInstanceId, remark);
			
			ret.setData(data);
			if(data != null){
				ret.setResult(data.isResult() ? 1 : 0);
				
				if(data.isFinished()){
					String[] topicGuids = new String[]{topicGuid};
					TopicDao.updateTopicCheck(topicGuids, Constant.TOPIC_CHECK_SUCCESS);
					TopicDao.modifyTopicForColumnAttrReSet(StringUtils.join(topicGuids, ","), check == 2?"nocheck":"check",false);
				}
			}
		}catch(Exception e){
			ret.setMsg(e.getMessage());
		}
		renderJson(ret);
	}
	
	public void getDetail(){
		String topicGuid = getPara("topicGuid");
		Ret ret = new Ret();
		try {
			ret.setData( workflowDao.getNodesByBusinessGuid(topicGuid));
		} catch (MalformedURLException e) {
			e.printStackTrace();
			ret.setMsg(e.getMessage());
		}
		if(ret.getData() != null){
			ret.setResult(1);
		}
		renderJson(ret);
	}
}
