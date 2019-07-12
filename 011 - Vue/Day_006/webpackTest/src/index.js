// ES6的模块化浏览器无法解析，需要记住打包工具webpack
import $ from 'jquery';
$(function() {
    $('ul li:nth-of-type(odd)').css({ backgroundColor: 'skyblue' });
    $('ul li:nth-of-type(even)').css({ backgroundColor: 'orange' });
});