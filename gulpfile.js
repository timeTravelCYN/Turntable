var gulp= require('gulp');
var webserver =require('gulp-webserver');
var watch = require('gulp-watch');
var batch = require('gulp-batch');///服务的东西

var uglify = require('gulp-uglify');//合并的东西
var minifyHtml = require('gulp-minify-html');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');

var sass = require('gulp-ruby-sass');//sass与css
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');


//精灵图
var buffer = require('vinyl-buffer');//雪碧图
var csso = require('gulp-csso');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
var base64 = require('gulp-base64');

//图片压缩
var imagemin = require('gulp-imagemin'), //正常图片的压缩
    pagquant = require('imagemin-pngquant'),
    changed = require('gulp-changed');

//合并文件
var concat = require('gulp-concat');//操作文件时使用的一些工具
var rename = require('gulp-rename');

//tmodjs
var tmodjs = require("gulp-tmod");

var jshint = require('gulp-jshint'),  //js的校验
    stylish = require('jshint-stylish');

const exec = require("child_process").exec;

//css 自动加前缀
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

//md5 后缀
var useref = require('gulp-useref');
var revReplace = require('gulp-rev-replace');
var filter = require('gulp-filter');


//目录
//src:源文件
//dist:生成文件存放的目录
var directory={
    indexHtml:{ //默认目录下的index.html文件   
      src:["index.html","winAPrizeRecord.html","writeAddress.html"],
      dist:".."
    },
    html:{
      src:'./**/*.html',
      dist:'..'
    },
    js:{
      src:"js/**/*.js",
      dist:"../js",
      concatName:"index.min.js" //多个文件合并成一个文件      
    },
    sass:{
      src:["sass/*.scss"],
      dist:"css"
    },
    css:{
      src:"css/*.css",
      dist:"../css"
    },
    images:{
      src:'images/*.{png,jpg,gif}',//需要指明要压缩的文件；需要区分雪碧图，与正常的图片
      dist:"../images"
    },
    sprites:{ //雪碧图(精灵图)。即将多个小图片合并成一张图片，并生成css。在css中有雪碧图的位置
      src:"images/sprites/*.png",//要压缩的文件
      dist:"../images/spritesmith",//雪碧图存放的目录
      retinaSrcFilter: ['images/bg/*@2x.png'], //如果是retina图片的话，可以抽出合并为2倍图。以此类推，可以合并三倍图
      imgName: 'sprite.png', //雪碧图的名称。名字可以修改
      retinaImgName: 'sprite@2x.png',//2倍retina图的名称
      cssName: 'sprite.css'//合并后原来图片的位置与使用方式。方便使用
    },
    base64:{
      src:"./css/*.css",
      dist:"../css"
    }
};

/***************************************************server************/
//web服务器
gulp.task('webserver',function(){
	gulp.src('.').pipe(webserver({
		livereload:true,
		directoryListing:true,	
		port:8080,
		open:true,
		fallback:'./index.html'
	}))
});

//监听这一个文件即可
gulp.task("devWatch",function(){
    watch(['sass/*.scss'],batch(function(events,done){
      gulp.start('compress-sass',done);
    }));
});

//监听任务
gulp.task('watch', function () {
    watch('js/*.js', batch(function (events, done) {
        gulp.start('compress-js', done);
    }));

    watch(['html/*.html'],batch(function(events,done){
    	gulp.start('compress-html',done);
    }));

    watch(['*.html'],batch(function(events,done){
      gulp.start('compress-indexHtml',done);
    }));

	  watch(['sass/*.scss'],batch(function(events,done){
    	gulp.start('compress-sass',done);
    }));

    watch('images/**/*.{png,jpg,gif}',batch(function(events,done){
       gulp.start('compress-images',done);
    }));
});

/***************************************************html************/
//压缩html   
gulp.task('compress-html', function() {  
  var opts = {comments:true,spare:true};
  gulp.src([directory.html["src"]])
    .pipe(minifyHtml(opts))
    .pipe(gulp.dest(directory.html.dist));
});

  //src:["index.html","winAPrizeRecord.html","writeAddress.html"],
//压缩首页代码    单个文件压缩
gulp.task('compress-indexHtml', function() {
  return gulp.src("./index.html")
    .pipe(usemin({    
      css: [ rev() ],
      css1: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      js1: [ uglify(), rev() ],
      js2: [ uglify(), rev() ],
      js3: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinejs1: [ uglify() ],
    }))
    .pipe(gulp.dest(directory.indexHtml["dist"]));
});
gulp.task('compress-winAPrizeRecord', function() {
  return gulp.src("./winAPrizeRecord.html")
    .pipe(usemin({    
      css: [ rev() ],
      css1: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      js1: [ uglify(), rev() ],
      js2: [ uglify(), rev() ],
      js3: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinejs1: [ uglify() ],
    }))
    .pipe(gulp.dest(directory.indexHtml["dist"]));
});
gulp.task('compress-writeAddress', function() {
  return gulp.src("./writeAddress.html")
    .pipe(usemin({    
      css: [ rev() ],
      css1: [ rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      js1: [ uglify(), rev() ],
      js2: [ uglify(), rev() ],
      js3: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinejs1: [ uglify() ],
    }))
    .pipe(gulp.dest(directory.indexHtml["dist"]));
});
/***************************************************js************/
//压缩js
gulp.task('compress-js',function(){
  return gulp.src(directory.js["src"]) 
  .pipe(jshint())  
  .pipe(jshint.reporter('jshint-stylish')) /*stylish：一种更改jshint打印*****/
  .pipe(concat(directory.js["concatName"])) //合并到一个文件，可注释这行
  .pipe(uglify())
  .pipe(gulp.dest(directory.js["dist"]))
});

//合并压缩后的文件
 //将编写的js合并为一个文件
gulp.task('compress-own-js',function(){
  gulp.src(directory.js["dist"]+'/*.js')
  .pipe(concat(directory.js["concatName"]))
  .pipe(gulp.dest(directory.js["dist"]))
});
/***************************************************sass||css************/
//编译sass
gulp.task('compress-sass',function(){   
	sass("sass/*.scss",{
		  precision: 6,
          stopOnError: true,
          cacheLocation: '.sass-cache',
          style:'compressed',
          precision:2
	  })
       .on('error', sass.logError)
       .pipe(gulp.dest(directory.sass["dist"]))
    }
); 

//压缩css
gulp.task('compress-css',function(){
  return gulp.src(directory.css["src"])
         .pipe(minifycss())
         .pipe(gulp.dest(directory.css["dist"]))
});

/***************************************************images***********/
//压缩图片   
gulp.task('compress-images',function(){
  return gulp.src(directory.images["src"]) // 指明源文件路径、并进行文件匹配     
    .pipe(imagemin({use: [pagquant({quality:3,posterize:8})]}))///使用pngquant插件(imageMin的一个插件)进行深度压缩  // 无损压缩JPG图片
    .pipe(gulp.dest(directory.images["dist"]))
});

//直接生成雪碧图
gulp.task('compress-images-spritesmith',function(){
 var spriteData = gulp.src(directory.sprites["src"]).pipe(spritesmith({
    retinaSrcFilter: directory.sprites.retinaSrcFilter, 
    imgName: directory.sprites.sprite,
    retinaImgName: directory.sprites.retinaImgName,
    cssName: directory.sprites.cssName
  }));
  return spriteData.pipe(gulp.dest(directory.sprites["dist"]));
});

//参考：https://github.com/Wenqer/gulp-base64___可挑选的工具

//给css加上前缀 ms wikit
gulp.task('compress-image-base64',function(){  
   return gulp.src(directory.base64["src"])         
          .pipe(postcss([autoprefixer({browsers: ['> 0.001%']})]))   
          .pipe(base64({maxImageSize: 8*1024}))                 
          .pipe(gulp.dest(directory.base64["dist"]))
});

//添加了自动添加css前缀的功能
gulp.task('compress-autofixer',function(){
    return gulp.src(directory.base64["src"])         
          .pipe(postcss([autoprefixer({browsers: ['> 0.001%']})]))   
          .pipe(gulp.dest(directory.base64["dist"]))
})

/***编译命令**/
gulp.task("cmdJsBuild",function(){
  exec("cd tool && node r.js -o cmdConfig.js",(error,stdout,stderr) =>{
    if(error){
      console.log("cmd 编译出错");
      return;
    } 
  });  
})

/***tmod模板编译*******************/
gulp.task("buildTemplate",function(){
    var stream = gulp.src("html/template/**/*.html").
                 pipe(tmodjs({
                      "output": "../dist/js/build",
                      "charset": "utf-8",
                      "syntax": "simple",
                      "helpers": null,
                      "escape": true,
                      "compress": true,
                      "type": "default",
                      "runtime": "template.js",
                      "combo": true,
                      "minify": true,
                      "cache": false,
                      "templateBase":"./html/template"
                 })).
                 pipe(uglify()).
                 pipe(gulp.dest("../dist/js/build"));   
    return stream;
});

/*****合并cmd文件********************   tmod有时候编译不正确，没有合并代码***********/
gulp.task("concatTempJs",function(){
    gulp.src('../dist/page/build/**/*.js')
    .pipe(concat('template.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/page/build'))
});


/*******************MD5 文件替换*****************************************/
gulp.task("revreplace", function(){

  var jsFilter = filter("../dist/**/*.js", { restore: true });
  var cssFilter = filter("../dist/**/*.css", { restore: true });
  var indexHtmlFilter = filter(['../dist/**/*', '!**/index.html'], { restore: true });

  console.log(cssFilter)
  /**
   * 例子实验失败，需要再次尝试
   */
  return gulp.src("../dist/index.html")
    .pipe(useref())      // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssFilter.restore)
    .pipe(indexHtmlFilter)
    .pipe(rev())                // Rename the concatenated files (but not index.html)
    .pipe(indexHtmlFilter.restore)
    .pipe(rev.manifest())


    .pipe(gulp.dest('../dist/public'));



  // var manifest = gulp.src("../dist/rev-manifest.json");
  // return gulp.src("../dist/index.html")
  //   .pipe(revReplace({manifest: manifest}))
  //   .pipe(gulp.dest('../dist'));

});

//生成雪碧图
gulp.task('build',['compress-images-spritesmith']);


//如果不更改sass，不必使用监听命令
//开发命令——————————————更改sass文件时执行的命令
gulp.task('dev',['webserver','devWatch']);



//上线编译————————生成网站文件
//
//移除 'compress-images'
//

gulp.task('default',["buildHtml",'cmdJsBuild','compress-sass','buildCss']);

/**
 * 工具出了问题不知道怎么改，暂时使用
 */
gulp.task("buildHtml",["compress-indexHtml","compress-winAPrizeRecord","compress-writeAddress"])
//分开编译。编译default后需要再次编译buildCss 
gulp.task("buildCss",['compress-image-base64','compress-autofixer']);
