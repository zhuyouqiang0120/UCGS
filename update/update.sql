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


------------------------------------- 2017-12-01 ----------------------------
CREATE TABLE `t_label` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fguid` varchar(40) NOT NULL,
  `fsiteGuid` varchar(40) DEFAULT NULL,
  `fcolumnGuid` varchar(40) DEFAULT '',
  `flabelName` varchar(40) DEFAULT NULL,
  `fparentId` varchar(40) DEFAULT '0',
  `fstate` int(2) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

ALTER TABLE t_topic  CHANGE flable flabel  varchar(400);
ALTER TABLE t_topic ADD flabelcode varchar(400);



------------------------------------- 2.4.1 ----------------------------
alter table t_config add cache tinyint(2) default 0;

-- 字段标准化
-- t_area
alter table t_area modify column fguid varchar(40) default '';
alter table t_area modify column fname varchar(200) default '';
alter table t_area modify column flevel int(2) default 0;
alter table t_area modify column fparentguid varchar(40) default '';
alter table t_area modify column fsortnumber int(2) default 0;
alter table t_area modify column fremark varchar(200) default '';
alter table t_area modify column fstate int(2) default 0;
alter table t_area modify column fadminguid varchar(40) default '';
alter table t_area modify column addtime varchar(30) default '';
alter table t_area modify column fextdata varchar(255) default '';

update t_area set fparentguid = '' where fparentguid IS NULL;
update t_area set fsortnumber = 0 where fsortnumber IS NULL;
update t_area set fremark = '' where fremark IS NULL;
update t_area set fstate = 0 where fstate IS NULL;
update t_area set fadminguid = '' where fadminguid IS NULL;
update t_area set addtime = '' where addtime IS NULL;
update t_area set fextdata = '' where fextdata IS NULL;

-- t_columen
alter table t_column modify column fguid varchar(40) default '';
alter table t_column modify column fservicename varchar(100) default '';
alter table t_column modify column ficon varchar(300) default '';
alter table t_column modify column flevel int(2) default 0;
alter table t_column modify column fparentuid varchar(40) default '';
alter table t_column modify column fsiteguid varchar(40) default '';
alter table t_column modify column fsortnumber int(2) default 0;
alter table t_column modify column fremark text default '';
alter table t_column modify column fstate int(2) default 0;
alter table t_column modify column fextdata text default '';
alter table t_column modify column fadtactics int(2) default 0;
alter table t_column modify column ftopicsize int(2) default 0;
alter table t_column modify column ftopicchecksize int(2) default 0;
alter table t_column modify column ftopicrecyclesize int(2) default 0;
alter table t_column modify column ftype varchar(20) default '';
alter table t_column modify column frelationsiteguid varchar(40) default '';
alter table t_column modify column frelationcolguid varchar(40) default '';
alter table t_column modify column frelationdefname varchar(200) default '';
alter table t_column modify column frelatitonischid int(2) default 0;

update t_column set ficon = '' where ficon IS NULL;
update t_column set fremark = '' where fremark IS NULL;
update t_column set fextdata = '' where fextdata IS NULL;
update t_column set fadtactics = 0 where fadtactics IS NULL;
update t_column set ftype = '' where ftype IS NULL;
update t_column set frelationsiteguid = '' where frelationsiteguid IS NULL;
update t_column set frelationcolguid = '' where frelationcolguid IS NULL;
update t_column set frelationdefname = '' where frelationdefname IS NULL;
update t_column set frelatitonischid = 0 where frelatitonischid IS NULL;


-- t_label
alter table t_label modify column fguid varchar(40) default '';
alter table t_label modify column fsiteGuid varchar(40) default '';
alter table t_label modify column fcolumnGuid varchar(40) default '';
alter table t_label modify column flabelName varchar(40) default '';
alter table t_label modify column fparentId varchar(40) default '';
alter table t_label modify column fstate int(2) default 0;

update t_label set fcolumnGuid = '' where fcolumnGuid IS NULL;

-- t_maps
alter table t_maps modify column ftargetguid varchar(40) default '';
alter table t_maps modify column fkey varchar(200) default '';
alter table t_maps modify column fvalue text default '';

-- t_operation_log
alter table t_operation_log modify column ftitle varchar(300) default '';
alter table t_operation_log modify column fcontent text default '';
alter table t_operation_log modify column ftitle varchar(300) default '';
alter table t_operation_log modify column fmodifyresult varchar(50) default '';
alter table t_operation_log modify column fmodifyer varchar(50) default '';
alter table t_operation_log modify column fmodifytime varchar(30) default '';
alter table t_operation_log modify column ftype varchar(30) default '';
alter table t_operation_log modify column fdelete int(2) default 0;
alter table t_operation_log modify column fdeleter varchar(50) default '';
alter table t_operation_log modify column fdeltime varchar(30) default '';
alter table t_operation_log modify column fmodifyerguid varchar(40) default '';
alter table t_operation_log modify column fuse varchar(30) default '';
alter table t_operation_log modify column fkeyword varchar(300) default '';
alter table t_operation_log modify column fextdata text default '';

update t_operation_log set ftype = '' where ftype IS NULL;
update t_operation_log set fdelete = 0 where fdelete IS NULL;
update t_operation_log set fdeleter = '' where fdeleter IS NULL;
update t_operation_log set fdeltime = '' where fdeltime IS NULL;
update t_operation_log set fkeyword = '' where fkeyword IS NULL;

-- t_pagedesigner
alter table t_pagedesigner modify column fcustomsitename varchar(100) default '';
alter table t_pagedesigner modify column fadminguid varchar(40) default '';
alter table t_pagedesigner modify column ftitle varchar(200) default '';
alter table t_pagedesigner modify column furl varchar(600) default '';
alter table t_pagedesigner modify column fhtmldata longtext default '';
alter table t_pagedesigner modify column fhtmlconf text default '';
alter table t_pagedesigner modify column fstate int(2) default 0;
alter table t_pagedesigner modify column ftype int(2) default 0;
alter table t_pagedesigner modify column flinkpageurl varchar(400) default '';
alter table t_pagedesigner modify column fmodifytime varchar(40) default '';
alter table t_pagedesigner modify column fparam varchar(500) default '';
alter table t_pagedesigner modify column fdelelte int(2) default 0;
alter table t_pagedesigner modify column fchecked int(2) default 0;
alter table t_pagedesigner modify column fwidth int(6) default 0;
alter table t_pagedesigner modify column fheight int(6) default 0;
alter table t_pagedesigner modify column fdevicetype int(2) default 0;
alter table t_pagedesigner modify column fdevicedesc varchar(100) default '';
alter table t_pagedesigner modify column fremark varchar(500) default '';

update t_pagedesigner set fcustomsitename = '' where fcustomsitename IS NULL;
update t_pagedesigner set furl = '' where furl IS NULL;
update t_pagedesigner set fhtmldata = '' where fhtmldata IS NULL;
update t_pagedesigner set fhtmlconf = '' where fhtmlconf IS NULL;
update t_pagedesigner set flinkpageurl = '' where flinkpageurl IS NULL;
update t_pagedesigner set fparam = '' where fparam IS NULL;
update t_pagedesigner set fwidth = 0 where fwidth IS NULL;
update t_pagedesigner set fheight = 0 where fheight IS NULL;
update t_pagedesigner set fdevicetype = 0 where fdevicetype IS NULL;
update t_pagedesigner set fdevicedesc = '' where fdevicedesc IS NULL;
update t_pagedesigner set fremark = '' where fremark IS NULL;

--  t_pageplugins
alter table t_pageplugins modify column fsize int(4) default 0;
alter table t_pageplugins modify column fversion varchar(20) default '';
alter table t_pageplugins modify column fremark varchar(300) default '';
alter table t_pageplugins modify column fextdata text default '';
alter table t_pageplugins modify column fplugingroup int(4) default 0;
alter table t_pageplugins modify column ficon varchar(100) default '';

update t_pageplugins set fsize = 0 where fsize IS NULL;
update t_pageplugins set fversion = '' where fversion IS NULL;
update t_pageplugins set fremark = '' where fremark IS NULL;
update t_pageplugins set fextdata = '' where fextdata IS NULL;

-- t_pageresource
alter table t_pageresource modify column fdata text default '';
alter table t_pageresource modify column fmediadata text default '';
alter table t_pageresource modify column fposition varchar(40) default '';
alter table t_pageresource modify column ftype int(2) default 0;
alter table t_pageresource modify column fresouceinit int(2) default 0;
alter table t_pageresource modify column fdelete int(2) default 0;
alter table t_pageresource modify column fprovider varchar(40) default '';
alter table t_pageresource modify column fresguidlist text default '';
alter table t_pageresource modify column funcheckedcount int(2) default 0;

update t_pageresource set fdata = '' where fdata IS NULL;
update t_pageresource set fmediadata = '' where fmediadata IS NULL;
update t_pageresource set fposition = '' where fposition IS NULL;
update t_pageresource set ftype = 0 where ftype IS NULL;
update t_pageresource set fresouceinit = 0 where fresouceinit IS NULL;
update t_pageresource set fdelete = 0 where fdelete IS NULL;
update t_pageresource set fprovider = '' where fprovider IS NULL;
update t_pageresource set fresguidlist = '' where fresguidlist IS NULL;
update t_pageresource set funcheckedcount = 0 where funcheckedcount IS NULL;

-- t_quartz
alter table t_quartz modify column fname varchar(100) default '';
alter table t_quartz modify column fcron varchar(20) default '';
alter table t_quartz modify column fstate int(2) default 0;
alter table t_quartz modify column fdata text default '';
alter table t_quartz modify column fclass varchar(200) default '';
alter table t_quartz modify column ftype varchar(20) default '';
alter table t_quartz modify column fresponsetime int(11) default 0;
alter table t_quartz modify column fmodifytime varchar(30) default '';

update t_quartz set fdata = '' where fdata IS NULL; 
update t_quartz set fresponsetime = 0 where fresponsetime IS NULL; 
update t_quartz set fmodifytime = '' where fmodifytime IS NULL; 

-- t_resource
alter table t_resource add fpublishstate int(2) default 0;
alter table t_resource modify column fextdata varchar(500) default '';
alter table t_resource modify column fremark varchar(300) default '';
alter table t_resource modify column fdeletetime varchar(30) default '';
alter table t_resource modify column fpublishstate int(2) default 0;

update t_resource set fextdata = '' where fextdata IS NULL; 
update t_resource set fremark = '' where fremark IS NULL; 
update t_resource set fdeletetime = '' where fdeletetime IS NULL; 
update t_resource set fpublishstate = 0 where fpublishstate IS NULL; 

-- t_site
alter table t_site modify column fissuestarttime varchar(30) default '';
alter table t_site modify column fissueendtime varchar(30) default '';
alter table t_site modify column fstate int(2) default 0;
alter table t_site modify column fremark varchar(300) default '';
alter table t_site modify column fpreviewindex varchar(200) default '';
alter table t_site modify column ftempguid varchar(40) default '';
alter table t_site modify column fdelete int(2) default 0;
alter table t_site modify column fusedevice int(2) default 0;
alter table t_site modify column fextdata varchar(500) default '';
alter table t_site modify column fareaguid varchar(40) default '';
alter table t_site modify column fmark varchar(100) default '';
alter table t_site modify column ftype varchar(20) default '';
alter table t_site modify column fbindsiteguid varchar(500) default '';
alter table t_site modify column fbindsitetype int(2) default 0;

update t_site set fissuestarttime = '' where fissuestarttime IS NULL; 
update t_site set fissueendtime = '' where fissueendtime IS NULL; 
update t_site set fremark = '' where fremark IS NULL; 
update t_site set fpreviewindex = '' where fpreviewindex IS NULL; 
update t_site set ftempguid = '' where ftempguid IS NULL; 
update t_site set fextdata = '' where fextdata IS NULL; 
update t_site set fareaguid = '' where fareaguid IS NULL; 
update t_site set fmark = '' where fmark IS NULL; 
update t_site set ftype = '' where ftype IS NULL; 
update t_site set fbindsiteguid = '' where fbindsiteguid IS NULL; 
update t_site set fbindsitetype = 0 where fbindsitetype IS NULL; 

-- t_template
alter table t_template modify column fsiteguid varchar(40) default '';
alter table t_template modify column fhtmldata text default '';
alter table t_template modify column frawdata text default '';
alter table t_template modify column fcreater varchar(30) default '';
alter table t_template modify column fcreateguid varchar(40) default '';
alter table t_template modify column fcreatetime varchar(30) default '';
alter table t_template modify column fdelete int(2) default 0;
alter table t_template modify column fwidth int(4) default 0;
alter table t_template modify column fheight int(4) default 0;
alter table t_template modify column fstate int(2) default 0;
alter table t_template modify column fpreviewpath varchar(400) default '';
alter table t_template modify column fpublish int(2) default 0;
alter table t_template modify column ftempsourceguid varchar(40) default '';
alter table t_template modify column fextdata varchar(500) default '';

update t_template set fhtmldata = '' where fhtmldata IS NULL; 
update t_template set frawdata = '' where frawdata IS NULL; 
update t_template set fcreater = '' where fcreater IS NULL; 
update t_template set fcreateguid = '' where fcreateguid IS NULL; 
update t_template set fcreatetime = '' where fcreatetime IS NULL; 
update t_template set fdelete = 0 where fdelete IS NULL; 
update t_template set fwidth = 0 where fwidth IS NULL; 
update t_template set fheight = 0 where fheight IS NULL; 
update t_template set fstate = 0 where fstate IS NULL; 
update t_template set fpreviewpath = '' where fpreviewpath IS NULL; 
update t_template set fpublish = 0 where fpublish IS NULL; 
update t_template set ftempsourceguid = '' where ftempsourceguid IS NULL; 
update t_template set fextdata = '' where fextdata IS NULL; 

-- t_topic
alter table t_topic modify column ftitlesec varchar(200) default '';
alter table t_topic modify column fsummary varchar(500) default '';
alter table t_topic modify column fsource varchar(100) default '';
alter table t_topic modify column fclass int(2) default 0;
alter table t_topic modify column ftype int(2) default 0;
alter table t_topic modify column freleasetime varchar(30) default '';
alter table t_topic modify column freleaseer varchar(40) default '';
alter table t_topic modify column fthumbnail varchar(400) default '';
alter table t_topic modify column flabel varchar(400) default '';
alter table t_topic modify column flabelcode varchar(400) default '';
alter table t_topic modify column fpvsize int(4) default 0;
alter table t_topic modify column ftopsize int(4) default 0;
alter table t_topic modify column fcollectsize int(4) default 0;
alter table t_topic modify column fdelete int(2) default 0;
alter table t_topic modify column fdeleteer varchar(40) default '';
alter table t_topic modify column fdeletetime varchar(30) default '';
alter table t_topic modify column fcheck int(2) default 0;
alter table t_topic modify column fextdata text default '';
alter table t_topic modify column fregion varchar(30) default '';
alter table t_topic modify column fyears varchar(20) default '';
alter table t_topic modify column fgrade float(6) default 0;
alter table t_topic modify column ftop int(2) default 0;

update t_topic set ftitlesec = '' where ftitlesec IS NULL; 
update t_topic set fsummary = '' where fsummary IS NULL; 
update t_topic set fsource = '' where fsource IS NULL; 
update t_topic set ftype = 0 where ftype IS NULL; 
update t_topic set fthumbnail = '' where fthumbnail IS NULL; 
update t_topic set flabel = '' where flabel IS NULL; 
update t_topic set flabelcode = '' where flabelcode IS NULL; 
update t_topic set fpvsize = 0 where fpvsize IS NULL; 
update t_topic set ftopsize = 0 where ftopsize IS NULL; 
update t_topic set fcollectsize = 0 where fcollectsize IS NULL; 
update t_topic set fdelete = 0 where fdelete IS NULL; 
update t_topic set fdeleteer = '' where fdeleteer IS NULL; 
update t_topic set fdeletetime = '' where fdeletetime IS NULL; 
update t_topic set fextdata = '' where fextdata IS NULL; 
update t_topic set fregion = '' where fregion IS NULL; 
update t_topic set fyears = '' where fyears IS NULL; 
update t_topic set fgrade = 0 where fgrade IS NULL; 
update t_topic set ftop = 0 where ftop IS NULL; 

-- t_topic_relate
alter table t_topic_relate modify column fcolguid varchar(40) default '';
alter table t_topic_relate modify column ftopicguid varchar(40) default '';
alter table t_topic_relate modify column fsortnum int(4) default 0;
alter table t_topic_relate modify column ftop int(4) default 0;
alter table t_topic_relate modify column fdelete int(2) default 0;
alter table t_topic_relate modify column fadminuserguid varchar(40) default '';
alter table t_topic_relate modify column ftopictype int(2) default 0;
alter table t_topic_relate modify column fsiteguid varchar(40) default '';
alter table t_topic_relate modify column ftemplateid int(4) default 0;

update t_topic_relate set fcolguid = '' where fcolguid IS NULL; 
update t_topic_relate set ftopicguid = '' where ftopicguid IS NULL;
update t_topic_relate set fsortnum = 0 where fsortnum IS NULL;
update t_topic_relate set ftop = 0 where ftop IS NULL;
update t_topic_relate set fdelete = 0 where fdelete IS NULL;
update t_topic_relate set fadminuserguid = '' where fadminuserguid IS NULL;
update t_topic_relate set ftopictype = 0 where ftopictype IS NULL;
update t_topic_relate set fsiteguid = '' where fsiteguid IS NULL;
update t_topic_relate set ftemplateid = 0 where ftemplateid IS NULL;

--------------------------2.4.2------------------------------------
INSERT INTO `t_config` VALUES ('15', '图片缓存服务器地址', null, 'http://localhost:8081', null, null, 'zftp', 'zftp', 'ImageCacheServer', '1');
update `t_config` set cache = 1 where filetype in ('TopicPreview','NewTopicMarkDate','ImageCacheServer');


-------------------------2.4.3-------------------------------------
alter table t_resource add fwidth int default 0;
alter table t_resource add fheight int default 0;
alter table t_config add remoteport int default 0;
alter table t_config add localport int default 0;
update t_resource set fheight = 0 where fheight is null;
update t_resource set fwidth = 0 where fwidth is null;


------------------------2.4.4---------------------------------------
CREATE TABLE `t_cache_server` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `guid` varchar(40) NOT NULL DEFAULT '',
  `server_name` varchar(50) NOT NULL DEFAULT '',
  `server_ip` varchar(50) NOT NULL DEFAULT '',
  `server_host` varchar(50) DEFAULT '',
  `server_ftp_name` varchar(30) DEFAULT '',
  `server_ftp_pwd` varchar(30) DEFAULT NULL,
  `server_ftp_port` int(8) DEFAULT 0,
  `cache_state` int(2) DEFAULT 1,
  `cache_path` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

alter table t_site add fcache_server_guid char(40) default '';

