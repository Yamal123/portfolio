-- =====================================================
-- AI PM 后台管理系统 - 数据库初始化脚本 V1.0
-- =====================================================
-- 执行环境：MySQL 5.7+ 或 MySQL 8.0+
-- 字符集：utf8mb4
-- 引擎：InnoDB
-- 默认账号：admin / Admin@2026
-- 盐值：aipmym_salt_2026_v1
-- 加密方式：MD5(密码 + 盐值)
-- =====================================================

-- Step 1：创建数据库
CREATE DATABASE IF NOT EXISTS `aipmym_admin`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `aipmym_admin`;

-- Step 2：创建基础表（无依赖）

-- 2.1 admin_user 管理员表
CREATE TABLE IF NOT EXISTS `admin_user` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username`      VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '登录账号',
  `password`      VARCHAR(128)   NOT NULL DEFAULT '' COMMENT '密码(MD5+盐)',
  `salt`          VARCHAR(64)    NOT NULL DEFAULT '' COMMENT '加密盐值',
  `nickname`      VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar`        VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '头像URL',
  `login_ip`      VARCHAR(45)    NOT NULL DEFAULT '' COMMENT '最后登录IP',
  `login_at`      DATETIME       NULL     DEFAULT NULL COMMENT '最后登录时间',
  `fail_count`    TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '连续错误次数',
  `locked_until`  DATETIME       NULL     DEFAULT NULL COMMENT '锁定截止时间(NULL=未锁定)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='管理员表';

-- 2.2 site_config 网站配置表
CREATE TABLE IF NOT EXISTS `site_config` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key`    VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '配置键名',
  `config_value`  TEXT           NOT NULL COMMENT '配置值',
  `remark`        VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '备注说明',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='网站配置表';

-- 2.3 user_profile 个人主页信息表
CREATE TABLE IF NOT EXISTS `user_profile` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `nickname`            VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '站点昵称',
  `signature`           VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '个人签名',
  `introduction`        TEXT           NOT NULL COMMENT '富文本简介(HTML)',
  `avatar`              VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '头像URL',
  `years_of_experience` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '从业年限(年)',
  `project_count`       SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '项目数量(个)',
  `success_rate`        DECIMAL(5,1)   NOT NULL DEFAULT 0.0 COMMENT '成功率(%)',
  `efficiency_gain`     DECIMAL(5,1)   NOT NULL DEFAULT 0.0 COMMENT '效率提升(%)',
  `created_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='个人主页信息表';

-- 2.4 contact_info 联系方式表
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email`             VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '邮箱地址',
  `email_displayed`   TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '邮箱是否显示:1=显示,0=隐藏',
  `phone`             VARCHAR(20)    NOT NULL DEFAULT '' COMMENT '电话号码',
  `phone_displayed`   TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '电话是否显示:1=显示,0=隐藏',
  `wechat_id`         VARCHAR(30)    NOT NULL DEFAULT '' COMMENT '微信号',
  `wechat_qrcode`     VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '微信二维码图片URL',
  `wechat_displayed`  TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '微信是否显示:1=显示,0=隐藏',
  `created_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='联系方式表';

-- Step 3：创建标签/分类表

-- 3.1 user_tag 个人标签表
CREATE TABLE IF NOT EXISTS `user_tag` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tag_name`      VARCHAR(30)    NOT NULL DEFAULT '' COMMENT '标签名称',
  `bg_color`      VARCHAR(20)    NOT NULL DEFAULT '#fff7e6' COMMENT '背景色(hex)',
  `text_color`    VARCHAR(20)    NOT NULL DEFAULT '#d46b08' COMMENT '文字颜色(hex)',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `is_enabled`    TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否启用:1=启用,0=禁用',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_enabled` (`sort_num`, `is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='个人标签表';

-- 3.2 skill_cate 技能分类表
CREATE TABLE IF NOT EXISTS `skill_cate` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cate_name`     VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '分类名称',
  `cate_icon`     VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '分类图标标识',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=启用,0=禁用',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_status` (`sort_num`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='技能分类表';

-- 3.3 project_cate 项目分类表
CREATE TABLE IF NOT EXISTS `project_cate` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cate_name`     VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '分类名称',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=启用,0=禁用',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_status` (`sort_num`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='项目分类表';

-- Step 4：创建业务主表

-- 4.1 skill_info 技能详情表
CREATE TABLE IF NOT EXISTS `skill_info` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cate_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属分类ID',
  `name`          VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '技能名称',
  `level`         TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '熟练度(0-100)',
  `description`   VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '技能描述',
  `tags`          VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '标签(逗号分隔)',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=上架,0=下架',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_cate` (`cate_id`),
  KEY `idx_sort_status` (`sort_num`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='技能详情表';

-- 4.2 project_info 项目主表
CREATE TABLE IF NOT EXISTS `project_info` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `slug`          VARCHAR(50)    NOT NULL DEFAULT '' COMMENT 'URL标识符(唯一)',
  `cate_id`       BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属分类ID',
  `name_zh`       VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '项目名称(中文)',
  `name_en`       VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '项目名称(英文)',
  `thumbnail`     VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '封面图URL(16:9)',
  `content_zh`    TEXT           NOT NULL COMMENT '项目详情富文本(中文/Markdown)',
  `content_en`    TEXT           NOT NULL COMMENT '项目详情富文本(英文/Markdown)',
  `tags`          VARCHAR(300)   NOT NULL DEFAULT '' COMMENT '技术栈标签(逗号分隔)',
  `external_url`  VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '外部链接地址',
  `view_count`    INT UNSIGNED   NOT NULL DEFAULT 0 COMMENT '浏览量',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=上架,0=下架',
  `deleted_at`    DATETIME       NULL     DEFAULT NULL COMMENT '软删除时间(NULL=未删除)',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_cate` (`cate_id`),
  KEY `idx_status_sort` (`status`, `sort_num`),
  KEY `idx_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='项目主表';

-- 4.3 visit_stat 访问统计表
CREATE TABLE IF NOT EXISTS `visit_stat` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `visit_date`    DATE           NOT NULL COMMENT '访问日期',
  `ip_address`    VARCHAR(45)    NOT NULL DEFAULT '' COMMENT '访客IP',
  `user_agent`    VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '浏览器UA',
  `page_path`     VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '访问页面路径',
  `duration`      INT UNSIGNED   NOT NULL DEFAULT 0 COMMENT '停留时长(秒)',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_visit_date` (`visit_date`),
  KEY `idx_ip_date` (`ip_address`, `visit_date`),
  KEY `idx_page` (`page_path`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='访问统计表';

-- 4.4 admin_log 操作日志表
CREATE TABLE IF NOT EXISTS `admin_log` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id`      BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '操作管理员ID',
  `admin_name`    VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '操作人名称',
  `action_type`   VARCHAR(20)    NOT NULL DEFAULT '' COMMENT '操作类型(login/create/update/delete/backup/restore)',
  `target_module`  VARCHAR(50)   NOT NULL DEFAULT '' COMMENT '目标模块(skills/projects/settings等)',
  `target_name`   VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '操作对象名称',
  `content`       TEXT           NOT NULL COMMENT '操作内容详情(JSON格式前后数据快照)',
  `ip_address`    VARCHAR(45)    NOT NULL DEFAULT '' COMMENT '操作IP',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_action` (`action_type`),
  KEY `idx_target` (`target_module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='操作日志表';

-- Step 5：填充基础数据

-- 5.1 默认超级管理员（admin / Admin@2026）
INSERT INTO `admin_user` (`username`, `password`, `salt`, `nickname`, `status`) VALUES
('admin', '1f184d902ff94e4152f46454e7ed4095', 'aipmym_salt_2026_v1', '超级管理员', 1);

-- 5.2 默认网站配置
INSERT INTO `site_config` (`config_key`, `config_value`, `remark`) VALUES
('site_title',     'AI PM Portfolio',          '网站标题'),
('site_description','AI产品经理个人主页',         'SEO描述'),
('copyright',       '© 2026 AI PM',              '页脚版权'),
('favicon',         '/uploads/favicon.svg',       '网站图标URL'),
('icp_code',        '',                          'ICP备案号'),
('ga_tracking_id',  '',                          'Google Analytics追踪ID');

-- 5.3 默认个人主页信息
INSERT INTO `user_profile` (`nickname`, `signature`, `introduction`) VALUES
('AI PM', '热爱产品设计与技术探索，专注供应链和AI Agent领域。奔赴山海，记录烟火。', '<p>热爱<strong>产品设计</strong>与<strong>技术探索</strong>，专注供应链和 <strong>AI Agent</strong> 领域。</p><p>热爱摄影、旅行与美食，奔赴山海，记录烟火。</p>');

-- 5.4 默认联系方式
INSERT INTO `contact_info` (`email`, `email_displayed`, `phone`, `phone_displayed`, `wechat_id`, `wechat_displayed`) VALUES
('yumeng@aipmym.com', 1, '15690630301', 0, 'your_wechat_id', 1);

-- 5.5 默认技能分类
INSERT INTO `skill_cate` (`cate_name`, `cate_icon`, `sort_num`, `status`) VALUES
('AI 产品',   'robot',   1, 1),
('物流供应链', 'truck',   2, 1),
('智能客服',   'customer-service', 3, 1),
('架构设计',   'apartment', 4, 1);

-- 5.6 默认项目分类
INSERT INTO `project_cate` (`cate_name`, `sort_num`, `status`) VALUES
('AI 智能项目', 1, 1),
('企业级应用',  2, 1),
('国际化产品',  3, 1),
('社会公益',    4, 1);

-- 5.7 默认个人标签
INSERT INTO `user_tag` (`tag_name`, `bg_color`, `text_color`, `sort_num`, `is_enabled`) VALUES
('产品设计', '#fff7e6', '#d46b08', 1, 1),
('技术探索', '#e6fffb', '#13c2c2', 2, 1),
('供应链',   '#fff0f6', '#eb2f96', 3, 1),
('AI Agent', '#f9f0ff', '#722ed1', 4, 1),
('摄影',     '#fffbe6', '#d48806', 5, 1),
('旅行',     '#e6fffb', '#13c2c2', 6, 1),
('美食',     '#fff7e6', '#fa8c16', 7, 1);

-- =====================================================
-- 验证初始化结果
-- =====================================================

-- 验证表数量（应为 12 张）
SELECT COUNT(*) AS table_count FROM information_schema.tables 
WHERE table_schema = 'aipmym_admin' AND table_type = 'BASE TABLE';

-- 验证管理员账号
SELECT id, username, nickname, status FROM admin_user WHERE username = 'admin';

-- 验证密码（手动校验）
SELECT MD5(CONCAT('Admin@2026', salt)) AS computed_password, password FROM admin_user WHERE username = 'admin';
-- 预期结果：computed_password = password (1f184d902ff94e4152f46454e7ed4095)

-- 验证各表记录数
SELECT 'admin_user' AS tbl, COUNT(*) AS cnt FROM admin_user
UNION ALL SELECT 'site_config', COUNT(*) FROM site_config
UNION ALL SELECT 'user_profile', COUNT(*) FROM user_profile
UNION ALL SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL SELECT 'user_tag', COUNT(*) FROM user_tag
UNION ALL SELECT 'skill_cate', COUNT(*) FROM skill_cate
UNION ALL SELECT 'project_cate', COUNT(*) FROM project_cate;

-- =====================================================
-- 初始化完成！
-- =====================================================
-- 预期结果：
-- - 表数量：12
-- - 管理员：1 条（admin / 超级管理员 / status=1）
-- - 密码校验：✅ 通过
-- - site_config：6 条
-- - user_profile：1 条
-- - contact_info：1 条
-- - user_tag：7 条
-- - skill_cate：4 条
-- - project_cate：4 条
-- =====================================================