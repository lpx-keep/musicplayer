var gulp = require("gulp");
var imagemin = require("gulp-imagemin")
var htmlclean = require("gulp-htmlclean");
var uglify = require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");
var concat = require("gulp-concat");
var deporder = require("gulp-deporder");
var less = require("gulp-less");

var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var connect = require("gulp-connect");


var folder = {
    src : "src/",
    dist : "dist/"
}

var devMode = process.env.NODE_ENV !== "production";

/*
    如果你的nodejs使用的是12的版本，那你原来的代码就无法运行了，会报错的。因为它们不兼容
        1、把gulp升级到4.0。卸载了再安装（先uninstall再install）
        2、再把gulp-imagemin插件，卸载了再安装一下，版本更新到6点几
        3、这个文件需要修改三个地方
            1、需要给每一个task任务添加一个回调函数，用于结束此次任务
            2、watch方法监听的任务名，需要放到gulp.series()中，做为参数
            3、default任务后面的任务名，也需要放到gulp.series()中，做为参数
 */

//流操作 task running
gulp.task("html",function(cb){
    var page =  gulp.src(folder.src + "html/index.html")
                    .pipe(connect.reload());
    if(!devMode){
        page.pipe(htmlclean());
    }
    page.pipe(gulp.dest(folder.dist + "html/"));

    cb();
})

gulp.task("images",function(cb){
    gulp.src(folder.src + "images/*")
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist+"images/"));
    
    cb();
})
gulp.task("js",function(cb){
    var js = gulp.src(folder.src+"js/*")
            .pipe(connect.reload());
    if(!devMode){
        js.pipe(uglify())
        .pipe(stripDebug())
    }   
    js.pipe(gulp.dest(folder.dist+"js/"));

    cb();
})
gulp.task("css",function(cb){
    var css = gulp.src(folder.src+"css/*")
                .pipe(connect.reload())
                .pipe(less());
    var options = [autoprefixer()];
    if(!devMode){
        options.push(cssnano())
    }
        
    css.pipe(postcss(options))
    .pipe(gulp.dest(folder.dist + "css/"));

    cb();
})
gulp.task("watch",function(cb){
    gulp.watch(folder.src + "html/*",gulp.series(["html"]));
    gulp.watch(folder.src + "images/*",gulp.series(["images"]));
    gulp.watch(folder.src + "js/*",gulp.series(["js"]));
    gulp.watch(folder.src + "css/*",gulp.series(["css"]));

    cb();
})
gulp.task("server",function(cb){
    connect.server({
        port : "1573",
        livereload : true,
        // root:'./dist'
    });

    cb();
})

gulp.task("default",gulp.series(["html","images","js","css","watch","server"]));