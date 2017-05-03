<#macro permission p func>
  <#if PagePermisstion?index_of('R') != -1 && p == 'R'>
	class="button blue" onclick="${func}"
  <#elseif PagePermisstion?index_of('E') != -1 && p == 'E'>
    class="button green" onclick="${func}"
  <#elseif PagePermisstion?index_of('D') != -1 && p == 'D'>
    class="button red" onclick="${func}"
  <#else>
	class="button btndisable"
  </#if>
</#macro>

<#macro PermisstionBtnHtml>
    <ul class="buttonTabBox" style="height:61px;">
	<#list PermisstionBtnGroup as group>
		<li ><input type="radio" id="tabBtn${group.id}" name="tabs${group.fmenuid}" <#if group_index == 0>checked</#if> /><label for="tabBtn${group.id}">${group.fmenubtngroup}</label>
		<div id="tab-content${group.id}" class="tabItems">
			<#list PermisstionBtn as btn>
			   <#if btn.fmbgid == group.id>
			   	 ${btn.fbtnhtml}
			   </#if>
			</#list>
		</div>
		</li>
	</#list>
	</ul>
</#macro>