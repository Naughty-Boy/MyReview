/*
Navicat MySQL Data Transfer

Source Server         : nodeDB
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : heima_blog

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-07-05 23:03:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_articles
-- ----------------------------
DROP TABLE IF EXISTS `blog_articles`;
CREATE TABLE `blog_articles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `content` text,
  `ctime` varchar(255) NOT NULL,
  `authorId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blog_articles
-- ----------------------------
INSERT INTO `blog_articles` VALUES ('1', 'aaaa', 'aaaa', '2019-07-05 15:26:31', '1');
INSERT INTO `blog_articles` VALUES ('2', 'asdasdfadfadfafadfas', 'asdfasfd', '2019-07-05 15:30:15', '1');
INSERT INTO `blog_articles` VALUES ('3', 'bbb', 'bb', '2019-07-05 15:40:40', '1');
INSERT INTO `blog_articles` VALUES ('4', 'Hello World', '###每一门编程语言的开始\r\n####都会输出一句 ***HelloWorld***\r\n* console.log(\'Hello World\');\r\n* alert(\'hello World\');\r\n* prompt(\'Hello World\');', '2019-07-05 16:28:32', '1');
INSERT INTO `blog_articles` VALUES ('5', '1111111', '1111111', '2019-07-05 21:28:48', '1');
INSERT INTO `blog_articles` VALUES ('6', '22222222', '2222222222', '2019-07-05 21:29:02', '1');
INSERT INTO `blog_articles` VALUES ('7', '33333333333', '333333333333', '2019-07-05 21:29:09', '1');
INSERT INTO `blog_articles` VALUES ('8', '444444444444', '4444444444444', '2019-07-05 21:29:16', '1');
INSERT INTO `blog_articles` VALUES ('9', '555555555555', '5555555555555', '2019-07-05 21:29:22', '1');

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of blog_users
-- ----------------------------
INSERT INTO `blog_users` VALUES ('1', 'asd', 'asd', 'asd', '2019-07-04 04:15:00', '0');
INSERT INTO `blog_users` VALUES ('2', '00000', 'qqq', 'hldc', '2019-07-04 17:09:23', '0');
INSERT INTO `blog_users` VALUES ('3', 'qqq', 'qqq', 'qqq', '2019-07-05 16:59:59', '0');
