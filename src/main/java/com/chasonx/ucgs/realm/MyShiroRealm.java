/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-1-8 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.realm;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

import com.chasonx.ucgs.dao.AdminUserDao;
import com.jfinal.plugin.activerecord.Record;


/**
 * shiro realm 权限验证
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-1-8下午2:21:22
 * @remark
 */
public class MyShiroRealm  extends AuthorizingRealm {

	/**
	 * 登录验证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken auToken) throws AuthenticationException {
		if(null == auToken) return null;
		UsernamePasswordToken uPasswordToken = (UsernamePasswordToken) auToken;
		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(uPasswordToken.getUsername(),uPasswordToken.getPassword(),getName());
		
		/*Record user = AdminUserDao.getUserEntity(uPasswordToken.getUsername());
		Session userSession = SecurityUtils.getSubject().getSession();
		userSession.setAttribute("LOGINUSERS", user);*/
		return info; 
	}
	
	/**
	 * 授权查询 缓存中用户鉴权信息调用
	 * @param collection
	 * @return
	 *AuthenticationInfo
	 */
	protected AuthorizationInfo  doGetAuthorizationInfo(
			PrincipalCollection collection){
		
		if(collection == null)
			return null;
		String logName = (String) collection.fromRealm(getName()).iterator().next();
		
		Record user = AdminUserDao.getUserEntity(logName);
		if(null != user){
			SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
			//AdminRoles roles = AdminRoles.rolesDao.findById(user.get("frolesid"));
			info.addRole("user");
			return info;
		}
		return null;
	}
	
	/***
	 * 更新缓存
	 * @param principal
	 * void
	 */
	public void clearCachedAuthorizationInfo(String principals){
		SimplePrincipalCollection principal = new SimplePrincipalCollection(principals, getName());
		clearCachedAuthenticationInfo(principal);
	}

	/**
	 * 清除授权用户信息 
	 * void
	 */
	public void clearAllCachedAuthorizationInfo(){
		Cache<Object, AuthenticationInfo> cache = getAuthenticationCache();
		if(cache != null){
			for(Object key:cache.keys()){
				cache.remove(key);
			}
		}
	}
}
