/*
Navicat MySQL Data Transfer

Source Server         : nodeDB
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : heima_blog

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-07-05 04:52:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_users
-- ----------------------------
DROP TABLE IF EXISTS `blog_users`;
CREATE TABLE `blog_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `ctime` varchar(20) NOT NULL,
  `isdel` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否被删除 0表示未删除，1表示已删除',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blog_users
-- ----------------------------
INSERT INTO `blog_users` VALUES ('1', 'asd', 'asd', 'asd', '2019-07-04 04:15:00', '0');
INSERT INTO `blog_users` VALUES ('2', '00000', 'qqq', 'hldc', '2019-07-04 17:09:23', '0');
