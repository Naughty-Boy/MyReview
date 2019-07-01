//窗口加载完毕后执行
window.addEventListener('load', function() {
    // 获取元素 
    var loop = document.querySelector('.focus');
    //拿到内部ul对象
    var ul = loop.children[0];
    // 获取容器的宽度
    var w = loop.offsetWidth;
    var ol = loop.children[1];
    // 默认索引为0
    var index = 0;
    //添加定时器
    var interval = setInterval(function() {
        index++;
        var translatex = -index * w;
        ul.style.transition = 'all .5s';
        ul.style.transform = 'translateX(' + translatex + 'px)';
    }, 1000);
    //过渡结束后的事件
    ul.addEventListener('transitionend', function() {
        // 如果索引到了最后，则动态改变为第一张实现无缝滚动
        if (index >= 3) {
            // 直接跳到第一张，取消过渡效果
            index = 0;
            ul.style.transition = 'none';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else if (index < 0) {
            index = 2;
            ul.style.transition = 'none';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        //让对应的小圆点进行变化（改变类样式）
        ol.querySelector('.current').classList.remove('current');
        ol.children[index].classList.add('current');
    });

    // 手指滑动轮播图时 
    // 默认坐标
    var startX = 0;
    // 移动距离
    var moveX = 0;
    //标记
    var flag = false;
    // 手指开始触碰
    ul.addEventListener('touchstart', function(e) {
        startX = e.targetTouches[0].pageX;
        //清空定时器
        clearInterval(interval);
    });
    // 手指进行滑动时
    ul.addEventListener('touchmove', function(e) {
        // 清除手指移动时的过渡效果
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translatex + 'px)';
        // 记录手指已经移动过
        flag = true;
        // 计算移动距离,保存到变量moveX
        moveX = e.targetTouches[0].pageX - startX;
        // 将移动的距离添加到盒子 
        var translatex = -index * w + moveX;
        // 防止屏幕滚动
        e.preventDefault();
    });
    // 手指离开
    ul.addEventListener('touchend', function(e) {
        //是否移动过
        if (flag) {
            //判断是否移动距离大于50，取绝对值
            if (Math.abs(moveX) > 50) {
                // 判断是左滑还是右滑
                if (moveX > 0) {
                    // 如果是右滑则跳转到上一张
                    index--;
                } else {
                    // 如果是左滑则跳到下一张
                    index++;
                }
                var translatex = -index * w;
                ul.style.transition = 'all .3s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            } else {
                //移动距离小于50则返回到之前的那张图片并且将过渡效果加上
                var translatex = -index * w;
                ul.style.transition = 'all .1s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            }
        }
        // 手指离开
        clearInterval(interval);
        //重新启动定时器
        interval = setInterval(function() {
            index++;
            var translatex = -index * w;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }, 1000);
    });


    //回到顶部
    var back = document.querySelector('.goBack');
    var nav = document.querySelector('nav');
    //添加滚动事件
    window.addEventListener('scroll', function() {
        //判断屏幕向上滑动,显示或隐藏
        if (window.pageYOffset >= nav.offsetTop) {
            back.style.display = 'block';
        } else {
            back.style.display = 'none';
        }
    });
    back.addEventListener('click', function() {
        //回到初始位置
        window.scroll(0, 0);
    })
})