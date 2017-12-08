var gulp = require('gulp'),
    connect = require('gulp-connect'),
    // Proxy = require('gulp-connect-proxy'),
    url = require('url'),
    Proxy = require('proxy-middleware'),
    livereload = require('gulp-livereload'),
    runSequence = require('run-sequence'),

    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    mincss = require('gulp-mini-css'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat');
//spriter = require('gulp-css-spriter');

var ydcfo = {
    //修改为项目webroot绝对路径，例如 D:/vscodeSVN/SimpleAC/WebRoot/
    build: './SimpleAC/',
    // ydcfo: './',
    // dev: './webroot/',
    // webroot: './webroot/',
    // build2: './test/',
    // test: './test/',
    // www: 'D:/秒账网站-定稿源文件+jpg-705',
    // ueditor: 'D:/test/utf8-jsp'
};

// var proxyOptions = url.parse('http://localhost:8090/SimpleAC');
// proxyOptions.route = '/proxy';
gulp.task('server', function() {
    // 将你的默认的任务代码放在此处
    connect.server({
        name: 'dev v5',
        port: 8888,
        // root: ydcfo.www,
        root: ydcfo.build,
        livereload: true,
        //设置代理请求
        middleware: function(connect, opt) {
            // return [
            //     Proxy(proxyOptions)
            // ];
            //gulp-connect-proxy
            opt.route = '/SimpleAC';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
});

gulp.task('reload-dev', function() {
    //gulp.src(ydcfo.build + 'page/**/*.html')
    //gulp.src(ydcfo.dev + 'page/**/*.html')
    // gulp.src(ydcfo.webroot + '*/**/*.*')
    gulp.src(ydcfo.build + 'page/index.html')
        //gulp.src(path.dev)
        .pipe(connect.reload());
})

gulp.task('watch', function() {
    //gulp.watch(ydcfo.build + 'page/**/*.html', ['reload-dev'])
    //gulp.watch(ydcfo.dev + 'page/**/*.html', ['reload-dev'])
    gulp.watch(ydcfo.build + '*/**/*.*', ['reload-dev'])
        //gulp.watch(path.dev, ['reload-dev'])
})

//热更新
gulp.task('live', function(done) {
    condition = false;
    runSequence(['server'], ['watch'], done)
})

gulp.task('clean', function() {
    return gulp.src(ydcfo.build, { read: false })
        .pipe(clean())
});

// //合并测试
// gulp.task('minjs', function() {
//     gulp.src(path.dev + '/js/**/*.js')
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify()) //删除注释
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(path.build + '/js'));
// })

// gulp.task('mincss', function() {
//     gulp.src(path.dev + '/css/**/*.css')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(path.build + '/css'));
// })

// gulp.task('minhtml', function() {
//     gulp.src(path.dev + '/html/**/*.html')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(path.build + '/html'));
// })


// //项目合并
// gulp.task('ydcfo2', function() {
//     gulp.src(ydcfo.dev + '/js/**/*.js')
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify()) //删除注释
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/js'));
//     gulp.src(ydcfo.dev + '/page/**/*.html')
//         .pipe(mincss())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
//     gulp.src(ydcfo.dev + '/styles/**/*.css')
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.build + '/styles'));
// })

// gulp.task('onehtml', function() {
//     var options = {
//         removeComments: true, //清除HTML注释
//         collapseWhitespace: true, //压缩HTML
//         collapseBooleanAttributes: false, //省略布尔属性的��? <input checked="true"/> ==> <input checked />
//         removeEmptyAttributes: false, //删除所有空格作属性��? <input id="" /> ==> <input />
//         removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
//         removeStyleLinkTypeAttributes: true, //删除<style>��?<link>的type="text/css"
//         minifyJS: true, //压缩页面JS
//         minifyCSS: true //压缩页面CSS
//     };
//     gulp.src(ydcfo.dev + '/page/modules/utf8-jsp/dialogs/webapp/webapp.html')
//         .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
//         .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
// })

// gulp.task('imghb', function() {
//     // gulp.src(ydcfo.dev + '/styles/**/*.css')
//     //     //.pipe(mincss())
//     //     .pipe(rename({ suffix: '' }))
//     //     .pipe(gulp.dest(ydcfo.build + '/styles'));
//     gulp.src(ydcfo.dev + '/styles/**/*.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
//         .pipe(spriter({
//             // The path and file name of where we will save the sprite sheet
//             'spriteSheet': ydcfo.build + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
//             // Because we don't know where you will end up saving the CSS file at this point in the pipe,
//             // we need a litle help identifying where it will be.
//             'pathToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
//         }))
//         .pipe(gulp.dest(ydcfo.build + '/styles')); //最后生成出来
// })

// //项目合并
// gulp.task('ydcfo', function() {
//     var options = {
//         removeComments: true, //清除HTML注释
//         collapseWhitespace: true, //压缩HTML
//         collapseBooleanAttributes: false, //省略布尔属性的? <input checked="true"/> ==> <input checked />
//         removeEmptyAttributes: false, //删除所有空格作属性? <input id="" /> ==> <input />
//         removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
//         removeStyleLinkTypeAttributes: true, //删除<style>?<link>的type="text/css"
//         minifyJS: true, //压缩页面JS
//         minifyCSS: true //压缩页面CSS
//     };
//     gulp.src(ydcfo.dev + '/images/**/*.*')
//         //.pipe(mincss())
//         //.pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/images'));
//     gulp.src(ydcfo.dev + 'js/**/*.*')
//         //.pipe(stripDebug()) //删除console.log
//         // .pipe(uglify({ output: { comments: 'some' } }).on('error', function(x) { console.log(x) })) //删除注释
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/js'));
//     gulp.src(ydcfo.dev + '/page/**/*.*')
//         // .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/page'));
//     gulp.src(ydcfo.dev + '/styles/**/*.*')
//         //.pipe(mincss())
//         // .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(ydcfo.build + '/styles'));
//     // gulp.src(ydcfo.dev + '/styles/**/*.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
//     //     .pipe(spriter({
//     //         // The path and file name of where we will save the sprite sheet
//     //         'spriteSheet': ydcfo.build + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
//     //         // Because we don't know where you will end up saving the CSS file at this point in the pipe,
//     //         // we need a litle help identifying where it will be.
//     //         'pathToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
//     //     }))
//     //     .pipe(gulp.dest(ydcfo.build + '/styles')); //最后生成出来
// })

// gulp.task('test', function() {
//     gulp.src(test.dev + 'js/**/*.js')
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify().on('error', function(x) { console.log(x) })) //删除注释
//         .pipe(rename({ suffix: '' }))
//         .pipe(gulp.dest(test.build + '/js'));
// })


// gulp.task("scripts", function() {
//     gulp.src(ydcfo.test + "js/**/*.js")
//         //.pipe(concat("all.js"))
//         //.pipe(gulp.dest(ydcfo.test))
//         .pipe(stripDebug()) //删除console.log
//         .pipe(uglify({ output: { comments: 'some' } }).on('error', function(x) { console.log(x) })) //删除注释
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(ydcfo.test))
//         //.pipe(function() { console.log(1) })
//         //.pipe(console.log(1))
// });

// gulp.task('min', ['scripts'], function() {
//     console.log(1)
// })