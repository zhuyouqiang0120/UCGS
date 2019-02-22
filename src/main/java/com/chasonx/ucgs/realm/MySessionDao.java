/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月19日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.realm;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.session.mgt.eis.AbstractSessionDAO;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月19日 下午6:04:06
 * @remark  自定义Shiro  SessionDao 管理
 */
public class MySessionDao extends AbstractSessionDAO {
	
	public static Map<Serializable, Session> sessionMap = new HashMap<Serializable, Session>();
	
	private  String activeSessionsCacheName;

	/**
	 * @return the activeSessionsCacheName
	 */
	public String getActiveSessionsCacheName() {
		return activeSessionsCacheName;
	}

	/**
	 * @param activeSessionsCacheName the activeSessionsCacheName to set
	 */
	public void setActiveSessionsCacheName(String activeSessionsCacheName) {
		this.activeSessionsCacheName = activeSessionsCacheName;
	}

	/* (non-Javadoc)
	 * @see org.apache.shiro.session.mgt.eis.SessionDAO#delete(org.apache.shiro.session.Session)
	 */
	@Override
	public void delete(Session session) {
		sessionMap.remove(session.getId());
	}

	/* (non-Javadoc)
	 * @see org.apache.shiro.session.mgt.eis.SessionDAO#getActiveSessions()
	 */
	@Override
	public Collection<Session> getActiveSessions() {
		return sessionMap.values();
	}

	/* (non-Javadoc)
	 * @see org.apache.shiro.session.mgt.eis.SessionDAO#update(org.apache.shiro.session.Session)
	 */
	@Override
	public void update(Session session) throws UnknownSessionException {
		sessionMap.put(session.getId(), session);
	}

	/* (non-Javadoc)
	 * @see org.apache.shiro.session.mgt.eis.AbstractSessionDAO#doCreate(org.apache.shiro.session.Session)
	 */
	@Override
	protected Serializable doCreate(Session session) {
		Serializable sessionId = generateSessionId(session);
		assignSessionId(session, sessionId);
		sessionMap.put(sessionId, session);
		
		return sessionId;
	}

	/* (non-Javadoc)
	 * @see org.apache.shiro.session.mgt.eis.AbstractSessionDAO#doReadSession(java.io.Serializable)
	 */
	@Override
	protected Session doReadSession(Serializable sessionId) {
		return sessionMap.get(sessionId);
	}

	public static void deleteSessionId(String sessionId){
		try{
			if(sessionId != null && sessionMap.containsKey(sessionId))
				sessionMap.remove(sessionId);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
