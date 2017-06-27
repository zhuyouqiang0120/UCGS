------------------  edit time   2015/12/01-----------------
------	t_admingroup
alter table t_admingroup add fareaguid varchar(40);
alter table t_admingroup add fstate int(2);

----- t_admingroup_column
CREATE TABLE `t_admingroup_column` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fcolguid` varchar(40) DEFAULT NULL,
  `fadmingroupid` bigint(20) DEFAULT '0',
  `fsiteguid` varchar(40) DEFAULT NULL,
  `ftype` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

----- t_admingroup_site
CREATE TABLE `t_admingroup_site` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fsiteguid` varchar(40) DEFAULT NULL,
  `fadmingroupid` bigint(20) DEFAULT NULL,
  `ftype` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

---- t_adminuser 
alter table t_adminuser add fsysroletype int(2);

---- t_area 
CREATE TABLE `t_area` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fguid` varchar(40) DEFAULT NULL,
  `fname` varchar(200) DEFAULT NULL,
  `flevel` int(11) DEFAULT NULL,
  `fparentguid` varchar(40) DEFAULT NULL,
  `fsortnumber` int(11) DEFAULT NULL,
  `fremark` varchar(200) DEFAULT NULL,
  `fstate` int(11) DEFAULT NULL,
  `fadminguid` varchar(40) DEFAULT NULL,
  `addtime` varchar(30) DEFAULT NULL,
  `fextdata` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

---- t_badword
CREATE TABLE `t_badword` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fword` varchar(30) DEFAULT NULL,
  `fstate` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8;

---- t_column
alter table t_column drop fhref;
alter table t_column add ftype varchar(20);
alter table t_column add frelationsiteguid varchar(40);
alter table t_column add frelationcolguid varchar(40);
alter table t_column add frelationdefname varchar(200);

---- t_resource
alter table t_resource add fremark varchar(300);
alter table t_resource add fdeletetime varchar(30);

---- t_site 
alter table t_site add fareaguid varchar(40);
alter table t_site add fmark varchar(100);
alter table t_site add ftype varchar(20);

---- t_topic
alter table t_topic add ftop int(2);

---- t_topic_relate
alter table t_topic_relate add fdelete int(2);

---- t_workflow
CREATE TABLE `t_workflow` (
  `id` bigint(20) NOT NULL,
  `fguid` varchar(0) DEFAULT NULL,
  `fname` varchar(0) DEFAULT NULL,
  `fsortnum` int(11) DEFAULT NULL,
  `fdesc` varchar(0) DEFAULT NULL,
  `feventype` int(11) DEFAULT NULL,
  `ftime` varchar(0) DEFAULT NULL,
  `fcheckerguid` varchar(0) DEFAULT NULL,
  `fnoticenext` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


---- t_workflow_ckstate
CREATE TABLE `t_workflow_ckstate` (
  `id` bigint(20) NOT NULL,
  `fckerguid` varchar(0) DEFAULT NULL,
  `fckname` varchar(0) DEFAULT NULL,
  `fckstate` int(11) DEFAULT NULL,
  `ftime` varchar(0) DEFAULT NULL,
  `fremark` varchar(0) DEFAULT NULL,
  `fwfstateguid` varchar(0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


------ t_workflow_list
CREATE TABLE `t_workflow_list` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fguid` varchar(40) DEFAULT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `fworkflowtype` int(11) DEFAULT NULL,
  `fadminguid` varchar(40) DEFAULT NULL,
  `faddtime` varchar(30) DEFAULT NULL,
  `fremark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

---- t_workflow_state
CREATE TABLE `t_workflow_state` (
  `id` bigint(20) NOT NULL,
  `fwfguid` varchar(40) DEFAULT NULL,
  `fckstate` int(11) DEFAULT NULL,
  `ftime` varchar(0) DEFAULT NULL,
  `fremark` varchar(0) DEFAULT NULL,
  `ftargetguid` varchar(40) DEFAULT NULL,
  `ftargetype` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

---- t_workflow_type
CREATE TABLE `t_workflow_type` (
  `id` bigint(20) NOT NULL,
  `fname` varchar(0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-------------------------------------  2015/12/02  ---------------------------------------

----  t_quartz
create table t_quartz
(
   id                   bigint not null,
   fname                varchar(0),
   fcron                varchar(0),
   fstate               int,
   fdata                text,
   primary key (id)
);


-------------------------------------  2015/12/03  ---------------------------------------
ALTER TABLE t_topic_relate ADD fadminuserguid varchar(40);
ALTER TABLE t_topic_relate ADD ftopictype int(2);

ALTER TABLE t_admingroup   ADD fisadmin int(2);


------------------------------------- 2015/12/04   ---------------------------------------
ALTER TABLE t_column ADD frelatitonischid int(2);
ALTER TABLE t_topic_relate ADD fsiteguid varchar(40);

------------------------------------- 2015/12/24   ---------------------------------------
ALTER TABLE t_topic_relate ADD ftemplateid int(11);

------------------------------------- 2016/01/10   ---------------------------------------
CREATE TABLE `t_operation_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ftitle` varchar(300) DEFAULT NULL,
  `fcontent` text,
  `fmodifyresult` varchar(50) DEFAULT NULL,
  `fmodifyer` varchar(50) DEFAULT NULL,
  `fmodifytime` varchar(30) DEFAULT NULL,
  `ftype` varchar(30) DEFAULT NULL,
  `fdelete` int(11) DEFAULT NULL,
  `fdeleter` varchar(50) DEFAULT NULL,
  `fdeltime` varchar(30) DEFAULT NULL,
  `fmodifyerguid` varchar(40) DEFAULT NULL,
  `fuse` varchar(30) DEFAULT NULL,
  `fkeyword` varchar(300) DEFAULT NULL,
  `fextdata` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

CREATE TABLE `t_operation_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fcurrversion` int(11) DEFAULT NULL,
  `fpreversion` int(11) DEFAULT NULL,
  `ftag` varchar(50) DEFAULT NULL,
  `fresponsetime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

---------------------------------------- 2016/01/14 ---------------------------------------
alter table t_column modify fremark text;

---------------------------------------- 2016/01/20 ---------------------------------------
alter table t_adminuser add floginSessionId varchar(50);

---------------------------------------- 2016/03/14 ---------------------------------------
alter table t_adminmenu add fsort int(2);
alter table t_adminmenu add flevel int(2);
alter table t_adminmenu add fstate int(2);

CREATE TABLE `t_menu_btn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fmbgid` int(11) DEFAULT NULL,
  `fbtnhtml` text,
  `fbtnstate` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `t_menu_btn_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fmenubtngroup` varchar(30) DEFAULT NULL,
  `fmenuid` bigint(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

---------------------------------------- 2016/03/17 ---------------------------------------
alter table t_template_status add fcodec varchar(20);
alter table t_template_status add fbigrate varchar(30);
---------------------------------------- 2016/03/21 ---------------------------------------
alter table t_template_status add fupload int(2);


---------------------------------------- 2016/03/22 ---------------------------------------
CREATE TABLE `t_site_publish` (
  `id` bigint(20) NOT NULL,
  `fsiteGuid` varchar(40) DEFAULT NULL,
  `fpublishGuid` varchar(40) DEFAULT NULL,
  `fpublishTime` varchar(40) DEFAULT NULL,
  `fpublishType` int(11) DEFAULT NULL,
  `fdelete` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


---------------------------------------- 2016/06/30 ---------------------------------------
alter table t_site_publish add ftarget text;

CREATE TABLE `t_maps` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ftargetguid` varchar(40) DEFAULT NULL,
  `fkey` varchar(200) DEFAULT NULL,
  `fvalue` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

---------------------------------------- 2016/07/12 ---------------------------------------
alter table t_resource add fpublishstate int(2);


---------------------------------------- 2016/07/13 ---------------------------------------

CREATE TABLE `t_pagedesigner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fguid` varchar(40) NOT NULL,
  `fsiteguid` varchar(40) NOT NULL,
  `fadminguid` varchar(40) NOT NULL,
  `ftitle` varchar(200) DEFAULT NULL,
  `furl` varchar(400) DEFAULT NULL,
  `fhtmldata` longtext,
  `fhtmlconf` text,
  `fstate` int(11) DEFAULT NULL,
  `ftype` int(11) DEFAULT NULL,
  `flinkpageurl` varchar(400) DEFAULT NULL,
  `fmodifytime` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


------------------------------------------ 2016/10/24 -------------------------------------
alter table t_adminuser add fdimensionGuid varchar(40);
alter table t_adminuser add fdimensionname varchar(400);
alter table t_adminuser add fdimensionState int(11);
alter table t_adminuser add froleguid varchar(40);
alter table t_admingroup add fguid varchar(40);
alter table t_admingroup add fdimensionguid varchar(40);
alter table t_resource modify column fextdata varchar(1000);

CREATE TABLE `t_admin_auth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ftargetauthguid` varchar(40) DEFAULT NULL,
  `fuserguid` varchar(40) DEFAULT NULL,
  `fsiteguid` varchar(40) DEFAULT NULL,
  `fauth` varchar(40) DEFAULT NULL,
  `ftype` varchar(40) DEFAULT NULL,
  `fext` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

------------------------------------------ 2016/11/16 -------------------------------------
alter table t_template_status modify column fmarkname varchar(200);

------------------------------------------ 2016/11/23 -------------------------------------
CREATE TABLE `t_devices` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `areacode` varchar(40) DEFAULT NULL,
  `groupId` varchar(40) DEFAULT NULL,
  `channelId` varchar(40) DEFAULT NULL,
  `channelName` varchar(100) DEFAULT NULL,
  `deviceId` varchar(50) DEFAULT NULL,
  `deviceName` varchar(100) DEFAULT NULL,
  `groupNames` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `county` varchar(50) DEFAULT NULL,
  `mac` varchar(40) DEFAULT NULL,
  `ssid` varchar(40) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `dgNames` varchar(40) DEFAULT NULL,
  `dgGuid` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_admin_device` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fadminguid` varchar(40) DEFAULT NULL,
  `fdeviceid` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;



------------------------------------------ 2016/11/25 -------------------------------------
CREATE TABLE `t_publish_todo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fpublishTitle` varchar(200) DEFAULT NULL,
  `fpublishMode` varchar(20) DEFAULT NULL,
  `fpublishType` varchar(20) DEFAULT NULL,
  `fpublishDevice` text,
  `fpublishDeviceMac` text,
  `fadminGuid` varchar(40) DEFAULT NULL,
  `fcheckerGuid` varchar(40) DEFAULT NULL,
  `fstatus` int(11) DEFAULT NULL,
  `fpanPublishTime` varchar(40) DEFAULT NULL,
  `fcreateTime` varchar(40) DEFAULT NULL,
  `fmodifyTime` varchar(255) DEFAULT NULL,
  `fremark` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


------------------------------------------ 2017/1/10-------------------------------------
alter table t_template_status add fitems varchar(500);

------------------------------------------ 2017/2/20-------------------------------------
alter table t_site add fbindsiteguid varchar(40);
alter table t_site add fbindsitetype int(2);

------------------------------------------ 2017/2/27-------------------------------------
CREATE TABLE `t_page_statistics` (
  `id` bigint(20) NOT NULL,
  `ftopicguid` varchar(40) DEFAULT NULL,
  `fip` varchar(40) DEFAULT NULL,
  `farea` varchar(40) DEFAULT NULL,
  `fsiteguid` varchar(40) DEFAULT NULL,
  `fcolumnguid` varchar(40) DEFAULT NULL,
  `fdate` varchar(40) DEFAULT NULL,
  `ftime` varchar(40) DEFAULT NULL,
  `fbrowser` varchar(40) DEFAULT NULL,
  `furl` varchar(300) DEFAULT NULL,
  `fstatus` varchar(20) DEFAULT NULL,
  `felapsed` int(11) DEFAULT NULL,
  `fdata` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-------------------------------------------- 2017/5/5 -------------------------------------
CREATE TABLE `t_pageresource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fguid` varchar(40) DEFAULT NULL,
  `fdata` text DEFAULT NULL,
  `fmediadata` text DEFAULT NULL,
  `ftype` int(2) DEFAULT NULL,
  `fresouceinit` int(2) DEFAULT NULL,
  `fdelete` int(2) DEFAULT NULL,
  `fprovider` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_pageresource_relate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ftemplateguid` varchar(40) DEFAULT NULL,
  `ftemplateresguid` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_pageplugingroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) DEFAULT NULL,
  `ftitle` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

CREATE TABLE `t_pageplugins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ftitle` varchar(20) DEFAULT NULL,
  `fpluginame` varchar(20) DEFAULT NULL,
  `fstate` int(2) DEFAULT '0',
  `fdevname` varchar(20) DEFAULT NULL,
  `fdevguid` varchar(40) DEFAULT NULL,
  `fcreatetime` varchar(40) DEFAULT NULL,
  `fmodifytime` varchar(40) DEFAULT NULL,
  `fsize` int(11) DEFAULT NULL,
  `fversion` varchar(20) DEFAULT NULL,
  `fremark` varchar(300) DEFAULT NULL,
  `fextdata` text,
  `fplugingroup` int(11) DEFAULT NULL,
  `ficon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;






