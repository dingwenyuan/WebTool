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
// spriter = require('gulp-css-spriter');
var crypto = require('crypto');
var fmd5 = require('fmd5');

var ydcfo = {
    ydcfo: './',
    dev: '',
    build: 'D:/git/SimpleAC/SimpleAC/',
    webroot: '',
    build2: './test/',
    test: './test/',
    www: 'D:/秒账网站-定稿源文件+jpg-705',
    vs: 'F:/迅雷下载/',
    devjs: 'D:/workspace/SimpleAC/webroot/js/common/',
    buildjs: './SimpleAC/js/common/',
    ueditor: 'D:/test/utf8-jsp'
};
//新加坡版本
// var ydcfo = {
//     dev: 'D:/新加坡版本/SimpleAC/WebRoot/',
//     build: 'D:/新加坡版本/SimpleAC/WebRoot/SimpleAC/',
// };

// var proxyOptions = url.parse('http://localhost:8090/SimpleAC');
// proxyOptions.route = '/proxy';
gulp.task('server', function() {
    // 将你的默认的任务代码放在此处
    connect.server({
        name: 'dev v5',
        port: 8888,
        // root: ydcfo.www,
        root: ydcfo.webroot,
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
    gulp.src(ydcfo.webroot + 'page/index.html')
        //gulp.src(path.dev)
        .pipe(connect.reload());
})

gulp.task('watch', function(a, b, c) {
    //gulp.watch(ydcfo.build + 'page/**/*.html', ['reload-dev'])
    //gulp.watch(ydcfo.dev + 'page/**/*.html', ['reload-dev'])
    gulp.watch(['!node_modules/**/*.js', '!SimpleAC/**/*.js',
            ydcfo.webroot + 'js/**/*.*', ydcfo.webroot + 'styles/**/*.*',
            ydcfo.webroot + 'page/**/*.*',
        ], ['reload-dev'])
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

//合并测试
gulp.task('minjs', function() {
    gulp.src(path.dev + '/js/**/*.js')
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //删除注释
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build + '/js'));
})

gulp.task('mincss', function() {
    gulp.src(ydcfo.dev + '/styles/**/*.css')
        .pipe(mincss())
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest(ydcfo.build + '/styles'));
})

gulp.task('minhtml', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的��? <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: false, //删除所有空格作属性��? <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>��?<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(ydcfo.dev + '/page/**/*.html')
        .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest(ydcfo.build + '/page'));
})


//项目合并
gulp.task('ydcfo2', function() {
    gulp.src(ydcfo.dev + '/js/**/*.js')
        .pipe(stripDebug()) //删除console.log
        .pipe(uglify()) //删除注释
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(ydcfo.build + '/js'));
    gulp.src(ydcfo.dev + '/page/**/*.html')
        .pipe(mincss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(ydcfo.build + '/page'));
    gulp.src(ydcfo.dev + '/styles/**/*.css')
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(ydcfo.build + '/styles'));
})



gulp.task('imghb', function() {
    // gulp.src(ydcfo.dev + '/styles/**/*.css')
    //     //.pipe(mincss())
    //     .pipe(rename({ suffix: '' }))
    //     .pipe(gulp.dest(ydcfo.build + '/styles'));
    gulp.src(ydcfo.dev + '/styles/**/core.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': ydcfo.dev + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
        }))
        .pipe(gulp.dest(ydcfo.dev + '/styles')); //最后生成出来
})

gulp.task('ydcfo_copy', function() {
    gulp.src([ydcfo.dev + '*.*'])
        .pipe(gulp.dest(ydcfo.build + '/'));
    gulp.src([ydcfo.dev + 'page/**/*.*'])
        .pipe(gulp.dest(ydcfo.build + '/page'));
    gulp.src([ydcfo.dev + 'js/**/*.*'])
        .pipe(gulp.dest(ydcfo.build + '/js'));
    gulp.src([
            ydcfo.dev + 'images/**/*.*'
        ])
        .pipe(gulp.dest(ydcfo.build + '/images'));
    gulp.src([ydcfo.dev + 'styles/**/*.*'])
        .pipe(gulp.dest(ydcfo.build + '/styles'));
});

var md5name = '';
//测试rename
gulp.task('renameTest', function() {
    gulp.src([ydcfo.dev + 'git.text'])
        .pipe(fmd5(function(a, b, c) {
            md5name = a;
            console.log('md5:', md5name)
        }))
        .pipe(rename(function(a, b, c) {
            a.basename = md5name
        }))
        .pipe(gulp.dest(ydcfo.build + '/'));
})

//项目合并
gulp.task('ydcfo', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的? <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: false, //删除所有空格作属性? <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>?<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(ydcfo.dev + 'js/**/*.txt')
        .pipe(gulp.dest(ydcfo.build + '/js'));
    gulp.src(ydcfo.dev + 'template/**/*.*')
        .pipe(gulp.dest(ydcfo.build + '/template'));
    gulp.src(ydcfo.dev + 'images/**/*.*')
        .pipe(gulp.dest(ydcfo.build + '/images'));
    gulp.src(ydcfo.dev + 'page/**/*.html')
        .pipe(htmlmin(options).on('error', function(x) { console.log(x) }))
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest(ydcfo.build + '/page'));
    gulp.src(ydcfo.dev + 'styles/**/*.css')
        .pipe(mincss())
        .pipe(rename({ suffix: '' }))
        .pipe(gulp.dest(ydcfo.build + '/styles'));

    gulp.src(ydcfo.dev + 'js/jqwidgets-4.1/**/*.js')
        .pipe(gulp.dest(ydcfo.build + '/js/jqwidgets-4.1'));
    gulp.src(ydcfo.dev + 'js/dataTable/**/*.js')
        .pipe(gulp.dest(ydcfo.build + '/js/dataTable'));
    gulp.src(ydcfo.dev + 'js/jsHistory/**/*.js')
        .pipe(gulp.dest(ydcfo.build + '/js/jsHistory'));
    //压缩js html css
    gulp.src([ydcfo.dev + 'js/**/*.js', '!' + ydcfo.dev + 'js/jqwidgets-4.1/**/*.js', '!' + ydcfo.dev + 'js/dataTable/**/*.js', '!' + ydcfo.dev + 'js/jsHistory/**/*.js'])
        .pipe(stripDebug().on('error', function(x) { console.log(x) })) //删除console.log
        .pipe(uglify({
            output: {
                comments: function(param, AST_Token) {
                    return /^!/.test(AST_Token.value);
                }
            }
        }).on('error', function(x) { console.log(x) })) //删除注释
        .pipe(rename({ suffix: '' }).on('error', function(x) { console.log(x) }))
        .pipe(gulp.dest(ydcfo.build + '/js')).on('end', function(param) {
            gulp.src([
                    ydcfo.build + '/js/common/acFrame.js',
                    ydcfo.build + '/js/common/core.js',
                    ydcfo.build + '/js/common/common.js',
                    ydcfo.build + '/js/modules/main1.js',
                    ydcfo.build + '/js/common/qiyu.js',
                    ydcfo.build + '/js/common/urlReg.js',
                    ydcfo.build + '/js/common/easyGrid.js',
                    ydcfo.build + '/js/common/prodGrid.js',
                    ydcfo.build + '/js/common/address.js',
                    ydcfo.build + '/js/common/base64.js',
                    ydcfo.build + '/js/common/mindmup-editabletable.js',
                    ydcfo.build + '/js/common/power.js',
                    ydcfo.build + '/js/common/validate-custom.js',
                    ydcfo.build + '/js/common/websocket.js',
                ])
                .pipe(concat("common.min.js"))
                .pipe(gulp.dest(ydcfo.build + 'js/common'));
            gulp.src([
                    ydcfo.build + "js/common/jquery.i18n.properties.js",
                    ydcfo.dev + "js/jqwidgets-4.1/globalization/globalize.js",
                    ydcfo.dev + "js/jqwidgets-4.1/globalization/globalize.culture.zh-CN.js",
                    ydcfo.dev + "js/common/jqxgrid.pager.js",
                    ydcfo.dev + "js/jqwidgets-4.1/jqxvalidator.js"
                ])
                .pipe(concat("settings.min.js"))
                .pipe(gulp.dest(ydcfo.build + 'js/common'));
        });




    // gulp.src(ydcfo.build + '/styles/**/*.css') //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
    //     .pipe(spriter({
    //         // The path and file name of where we will save the sprite sheet
    //         'spriteSheet': ydcfo.build + '/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
    //         // Because we don't know where you will end up saving the CSS file at this point in the pipe,
    //         // we need a litle help identifying where it will be.
    //         'pathToSpriteSheetFromCSS': '/images/spritesheet.png' //这是在css引用的图片路径，很重要
    //     }))
    //     .pipe(gulp.dest(ydcfo.build + '/styles')); //最后生成出来


})


gulp.task("common", function() {
    // gulp.src(ydcfo.test + ydcfo.build +"js/**/*.js")
    gulp.src([
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/acFrame.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/core.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/common.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/modules/main1.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/qiyu.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/urlReg.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/easyGrid.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/address.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/base64.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/mindmup-editabletable.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/power.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/validate-custom.js',
        'D:/vscodeSVN/SimpleAC/WebRoot/js/common/websocket.js',
    ])

    //.pipe(gulp.dest(ydcfo.test))
    .pipe(stripDebug()) //删除console.log
        .pipe(uglify({
            output: {
                comments: function(param, AST_Token) {
                    return /^!/.test(AST_Token.value);
                }
            }
        }).on('error', function(x) { console.log(x) })) //删除注释
        .pipe(concat("common.min.js"))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(ydcfo.build + 'js/common'))
        //.pipe(function() { console.log(1) })
        //.pipe(console.log(1))
});

gulp.task("concats", function() {
    gulp.src(ydcfo.dev + 'js/common/*.js')
        .pipe(stripDebug().on('error', function(x) { console.log(x) })) //删除console.log
        .pipe(uglify({
            output: {
                comments: function(param, AST_Token) {
                    return /^!/.test(AST_Token.value);
                }
            }
        }).on('error', function(x) { console.log(x) })) //删除注释
        .pipe(rename({ suffix: '' }).on('error', function(x) { console.log(x) }))
        .pipe(gulp.dest(ydcfo.build + '/js/common'));
})

gulp.task('print1', function() {
    setTimeout(function(param) {
        console.log('print1')
    })

});

gulp.task('print2', function() {
    console.log('print2')
});

gulp.task('print', ['print1'], function() {
    console.log(1)
})



// var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            port: 8888,
            baseDir: "D:/vscodeSVN/SimpleAC/WebRoot/"
        }
    });
});

// or...

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "abc.com"
    });
});
