/*
    1、这节课我们要讲的还是QQ音乐的项目，录播课里的项目还留了一些内容，留的是一个进度条的模块，我们放在这节课给大家去讲。
    2、这个项目我们还是依托于gulp，我已经把录播课里最后一次的项目代码都拿了过来了，打开命令提示符，进入到文件目录，执行一下gulp命令。
    3、在写之前需要先解决一个问题，就是gulp版本与node版本的问题
        1、打开guplfile.js
    4、然后我需要开启两个gulp监听，一个是写好的版本，另一个是没写好的。为了看到最终的功能
    5、整体项目回顾
        1、audioControl.js模块是音频模块，它用来创建音频，控制音频播放、暂停
        2、gaussBlur.js高斯模糊模块，它用来把背景图片变模糊
        3、index.js模块，用来处理数据以及添加事件以及让图片旋转
        4、indexControl.js模块，用来处理上一首下一首歌曲的切换
        5、render.js模块，用于渲染歌曲、渲染图片等
        6、zepto.js，是移动端的一个库
    6、介绍进度条功能
        1、进度条左侧是当前播放的时间
        2、进度条右侧是这首歌曲的总时间
        3、进度条是可以拖拽的（播放后再拖拽），拖拽改变歌曲当前播放的时间
        4、
    7、创建pro.js文件
 */
(function ($, root) {
    var dur;
    var frameId;
    var startTime;
    var lastPer = 0;
    function renderAlltime(time) {
        dur = time;
        time = formatTime(time);
        $('.all-time').html(time);
    }
    function formatTime(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        // console.log(lastPer, p);
        startTime = new Date().getTime();
        cancelAnimationFrame(frameId);
        function frame() {
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (dur * 1000);
            if (per <= 1) {
                update(per);
            } else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    function update(per) {
        // console.log(per);
        var time = per * dur;
        time = formatTime(time);
        $('.cur-time').html(time);
        var perX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    }

    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);
        // console.log(lastPer);
    }

    root.pro = {
        renderAlltime: renderAlltime,
        start: start,
        stop: stop,
        update:update
    }

})(window.Zepto, window.player || (window.player = {}));