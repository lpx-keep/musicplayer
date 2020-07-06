var root = window.player;
var dataList = [];
var len = 0;
var audio = root.audioManager;
var contolIndex = null;
var timer = null;
// 获取数据
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            // root.render(data[0]);
            dataList = data;
            len = data.length;
            contolIndex = new root.controlIndex(len);
            // audio.getAudio(data[0].audio);

            bindEvent();
            bindTouch();    //添加手指事件
            
            $('body').trigger('play:change', 0);

        },
        error: function () {
            console.log('error');
        }
    })
}
// 绑定点击事件
function bindEvent() {
    $('body').on('play:change', function (e, index) {
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        if (audio.status == 'play') {
            audio.play();
            rotated(0);
        }
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            transform: 'rotateZ(' + 0 + 'deg)',
            transition: 'none'
        });

        //渲染右侧总时间
        root.pro.renderAllTime(dataList[index].duration);
    });
    $('.prev').on('click', function (e) {
        var i = contolIndex.prev();
        $('body').trigger('play:change', i);

        // 切歌时清零
        root.pro.start(0);

        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();    //暂停时进度条也要停止
        }
    });
    $('.next').on('click', function (e) {
        var i = contolIndex.next();
        $('body').trigger('play:change', i);

         // 切歌时清零
        root.pro.start(0);

        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();    //暂停时进度条也要停止
        }
    });
    $('.play').on('click', function (e) {
        if (audio.status == 'pause') {
            audio.play();

            //播放
            root.pro.start();

            var deg = $('.img-box').attr('data-deg') || 0;
            rotated(deg);
        } else {
            audio.pause();

            //暂停时进度条也要停止
            root.pro.stop();
            clearInterval(timer);   //图片也要停止旋转
        }
        $('.play').toggleClass('playing');
    })
}
function rotated(deg) {
    // console.log(deg);
    clearInterval(timer);
    deg = parseInt(deg);
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'transform 0.2s linear'
        })
    }, 200);
}
getData('../mock/data.json');


// 信息 + 图片渲染到页面上
// ，点击按钮
// 音频的播放与暂停  切歌
//  图片旋转
// 列表切歌 --> 作业

function bindTouch(){
    var $spot=$('.spot');   //小圆点
    var offset=$('.pro-bottom').offset();   //小圆点能走的范围
    var left=offset.left;
    var width=offset.width;

    $spot.on('touchstart',function(){
        //手指按下的时候，需要让进度条停止
        root.pro.stop();
    }).on('touchmove',function(e){
        var x=e.changedTouches[0].clientX;  //手指按下时，离可视区左边的距离 
        var per=(x-left)/width;
        if(0<per && per<1){ //手指拖的时候在屏幕上可以随意拖，但是小圆点它不能超出范围
            root.pro.update(per);
        }

    }).on('touchend',function(e){
        var x=e.changedTouches[0].clientX;
        var per=(x-left)/width;
        if(0<per && per<1){
            var curTime=per*dataList[contolIndex.index].duration;   //获取当前拖拽后所到达的时间

            //更新歌曲的进度及状态 
            audio.playTo(curTime);
            audio.status='play';
            audio.play();

            $('.play').addClass('playing');
            root.pro.start(per);
        }
    });
}
