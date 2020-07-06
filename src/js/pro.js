(function ($, root) {
    var dur;        //存储歌曲的总时间
    var frameId;    //定时器的标识
    var startTime=0;    //开始播放的时间 
    var lastPer=0;      //这个变量主要记录用户按下暂停时候歌曲播放所占的百分比


    function renderAllTime(time){
        dur=time;
        //253s  4:13
        time=formatTime(time);
        $('.all-time').html(time);
    };

    function formatTime(time){
        time=Math.round(time);  //这个函数并不是只在取到数据后调用，在别的地方也会被调用，所以就有可能出现小数，那就要在这里处理一下

        var m=Math.floor(time/60);  //分钟，拿秒数除以60就是几点几分（2.3）。此时一定要向下取整，像2分零3秒。你只能变成2分，不能变成3分
        var s=time%60;  //秒钟，拿总时间模上60，它的余数就是秒数

        //前面补0
        m=m<10?'0'+m:m;
        s=s<10?'0'+s:s;

        return m+':'+s;
    }

    //进度条开始功能
    function start(p){
         /*
            1、调用start的时候有两种情况，一种传参，一种不传参
            2、不传参的话，还取原来的值
            3、传参的话，取传的值。传参的话表示切歌了（切歌的话，就不考虑上次播放，直接清0） 
         */
        lastPer=p===undefined?lastPer:p;
        cancelAnimationFrame(frameId);
        startTime=new Date().getTime(); //记录一个开始时间

        //这个方法是使用定时器不断的去调用update（渲染进度条）
        function frame(){
            /*
                计算当前歌曲走的时间
                    1、先记录一个当前的时间（curTime），这个时间一直在更新
                    2、拿当前时间-开始的时间=歌曲播放的时间；拿歌曲播放的时间/总时间=播放时间占的百分比
            */
           var curTime=new Date().getTime();
           
           var per=lastPer+(curTime-startTime)/(dur*1000);  //时间的百分比

           if(per<=1){
               //这个条件成立说明，当前歌曲还没有播放完
                update(per);    //渲染进度条
           }else{
                cancelAnimationFrame(frameId);
           }

           frameId=requestAnimationFrame(frame);
        }

        frame();
    }
    //进度条渲染功能
    function update(per){
        //更新左侧时间
        var time=formatTime(per*dur);
        $('.cur-time').html(time);

       // console.log(per);0-1

        //-100 -> 0
        //更新进度条位置
        var perX=(per-1)*100+'%';   //进度条走的百分比。因为是负值，所以-1
        $('.pro-top').css({
            transform:'translateX('+perX+')',
        });
    }

    //进度条结束功能
    function stop(){
        var stopTime=new Date().getTime();
        cancelAnimationFrame(frameId);

        //暂停两次后，再点击，也是需要加上上次播放的进度
        lastPer=lastPer+(stopTime-startTime)/(dur*1000);  //计算方式与start里的是一模一样
    }

    //console.log(formatTime(253))

    root.pro = {
        renderAllTime:renderAllTime, 
        start:start,
        update:update,
        stop:stop,
    };

})(window.Zepto, window.player || (window.player = {}))