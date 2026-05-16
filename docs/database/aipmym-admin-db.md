# AI PM 个人主页后台管理系统 — 数据库设计 V1.0

**数据库引擎**：InnoDB  
**字符集**：utf8mb4  
**排序规则**：utf8mb4_general_ci  
**统一规则**：
- `sort_num` 越小越靠前
- `status` / `is_displayed` / `is_enabled`：1=启用/显示/上架，0=禁用/隐藏/下架
- 图片字段存储 URL 字符串
- 富文本字段使用 `TEXT` 类型
- 所有表主键使用 `BIGINT UNSIGNED AUTO_INCREMENT`
- 统一包含 `created_at`、`updated_at` 时间戳字段

---

## 1. admin_user（管理员表）

**用途**：存储超级管理员账号信息，支持登录锁定机制。

```sql
CREATE TABLE `admin_user` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username`    VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '登录账号',
  `password`    VARCHAR(128)   NOT NULL DEFAULT '' COMMENT '密码(MD5+盐)',
  `salt`        VARCHAR(32)    NOT NULL DEFAULT '' COMMENT '加密盐值',
  `nickname`    VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar`      VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '头像URL',
  `login_ip`    VARCHAR(45)    NOT NULL DEFAULT '' COMMENT '最后登录IP',
  `login_at`    DATETIME       NULL     DEFAULT NULL COMMENT '最后登录时间',
  `fail_count`  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '连续错误次数',
  `locked_until` DATETIME      NULL     DEFAULT NULL COMMENT '锁定截止时间(NULL=未锁定)',
  `status`      TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='管理员表';
```

**初始化数据**（默认管理员账号）：

```sql
INSERT INTO `admin_user` (`username`, `password`, `salt`, `nickname`, `avatar`, `status`) VALUES
('admin', MD5(CONCAT('Admin@123', 'aipmym2026_salt')), 'aipmym2026_salt', '超级管理员', '', 1);
```

---

## 2. site_config（网站配置表）

**用途**：全局网站配置项，采用 key-value 结构。

```sql
CREATE TABLE `site_config` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key`  VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '配置键名',
  `config_value` TEXT          NOT NULL COMMENT '配置值',
  `remark`      VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '备注说明',
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='网站配置表';
```

**初始化数据**：

```sql
INSERT INTO `site_config` (`config_key`, `config_value`, `remark`) VALUES
('site_title', 'AI PM Portfolio', '网站标题'),
('site_description', 'AI产品经理个人主页', 'SEO描述'),
('copyright', '© 2026 AI PM', '页脚版权'),
('favicon', '/uploads/favicon.svg', '网站图标URL'),
('icp_code', '', 'ICP备案号'),
('ga_tracking_id', '', 'Google Analytics追踪ID');
```

---

## 3. user_profile（个人主页信息表）

**用途**：存储个人主页展示的核心信息，单行记录。

```sql
CREATE TABLE `user_profile` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `nickname`          VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '站点昵称',
  `signature`         VARCHAR(200)   NOT NULL DEFAULT '' COMMENT '个人签名',
  `introduction`      TEXT           NOT NULL COMMENT '富文本简介(HTML)',
  `avatar`            VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '头像URL',
  `years_of_experience` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '从业年限(年)',
  `project_count`     SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '项目数量(个)',
  `success_rate`      DECIMAL(5,1)   NOT NULL DEFAULT 0.0 COMMENT '成功率(%)',
  `efficiency_gain`   DECIMAL(5,1)   NOT NULL DEFAULT 0.0 COMMENT '效率提升(%)',
  `created_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='个人主页信息表';

-- 初始化一条空记录
INSERT INTO `user_profile` (`nickname`, `signature`, `introduction`) VALUES ('AI PM', '热爱产品设计与技术探索', '');
```

---

## 4. social_link（社交链接表）

**用途**：管理社交平台链接，支持排序和显示开关。

```sql
CREATE TABLE `social_link` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `platform`      VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '平台名称(GitHub/LinkedIn/微博/Twitter/知乎等)',
  `url`           VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '链接地址',
  `icon`          VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '图标名称',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `is_displayed`  TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '是否显示:1=显示,0=隐藏',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_display` (`sort_num`, `is_displayed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社交链接表';
```

---

## 5. user_tag（个人标签表）

**用途**：管理个人展示标签，支持颜色自定义和排序。

```sql
CREATE TABLE `user_tag` (
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
```

---

## 6. skill_cate（技能分类表）

**用途**：技能的分类目录，内置4个默认分类不可删除。

```sql
CREATE TABLE `skill_cate` (
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
```

**初始化内置分类**：

```sql
INSERT INTO `skill_cate` (`cate_name`, `cate_icon`, `sort_num`, `status`) VALUES
('AI 能力', 'brain', 1, 1),
('产品能力', 'bulb', 2, 1),
('技术技能', 'code', 3, 1),
('软技能', 'team', 4, 1);
```

---

## 7. skill_info（技能详情表）

**用途**：每条具体技能的详细信息，关联分类。

```sql
CREATE TABLE `skill_info` (
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
```

---

## 8. project_cate（项目分类表）

**用途**：项目的分类目录。

```sql
CREATE TABLE `project_cate` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cate_name`     VARCHAR(50)    NOT NULL DEFAULT '' COMMENT '分类名称',
  `sort_num`      INT            NOT NULL DEFAULT 0 COMMENT '排序权重(越小越靠前)',
  `status`        TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态:1=启用,0=禁用',
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort_status` (`sort_num`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='项目分类表';
```

**初始化内置分类**：

```sql
INSERT INTO `project_cate` (`cate_name`, `sort_num`, `status`) VALUES
('个人项目', 1, 1),
('工作项目', 2, 1),
('开源项目', 3, 1),
('学习项目', 4, 1);
```

---

## 9. project_info（项目主表）

**用途**：项目案例的主数据表，含富文本详情和外链。

```sql
CREATE TABLE `project_info` (
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
```

---

## 10. contact_info（联系方式表）

**用途**：存储联系方式及各渠道的显示开关，单行记录。

```sql
CREATE TABLE `contact_info` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email`           VARCHAR(100)   NOT NULL DEFAULT '' COMMENT '邮箱地址',
  `email_displayed` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '邮箱是否显示:1=显示,0=隐藏',
  `phone`           VARCHAR(20)    NOT NULL DEFAULT '' COMMENT '电话号码',
  `phone_displayed` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '电话是否显示:1=显示,0=隐藏',
  `wechat_id`       VARCHAR(30)    NOT NULL DEFAULT '' COMMENT '微信号',
  `wechat_qrcode`   VARCHAR(500)   NOT NULL DEFAULT '' COMMENT '微信二维码图片URL',
  `wechat_displayed`TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '微信是否显示:1=显示,0=隐藏',
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='联系方式表';

-- 初始化一条空记录
INSERT INTO `contact_info` () VALUES ();
```

---

## 11. visit_stat（访问统计表）

**用途**：记录每次页面访问，用于统计分析。高并发写入场景。

```sql
CREATE TABLE `visit_stat` (
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
```

---

## 12. admin_log（操作日志表）

**用途**：记录所有管理操作，用于审计追溯。

```sql
CREATE TABLE `admin_log` (
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
```

---

## 附录：ER 关系说明

```
admin_user (1) ──────< (N) admin_log
                    管理员产生日志

user_profile (1) ────< (N) social_link
                    个人主页拥有多个社交链接

user_profile (1) ────< (N) user_tag
                    个人主页拥有多个标签

skill_cate (1) ──────< (N) skill_info
                    分类下有多个技能

project_cate (1) ────< (N) project_info
                    分类下有多个项目

site_config (独立KV表)
contact_info (独立单行)
visit_stat (独立日志表)
```
