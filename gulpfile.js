const gulp=require('gulp');//引入gulp模块  gulp对象
const html=require('gulp-minify-html');//引入gulp-minify-html模块。
const css=require('gulp-minify-css');
const uglifyjs=require('gulp-uglify');
const watch=require('gulp-watch');
const imagemin=require('gulp-imagemin');
const babel = require('gulp-babel'); //es6转es5主要模块
const bablecore = require('babel-core'); //es6转es5主要模块
const es2015 = require('babel-preset-es2015'); //es6转es5主要模块

// gulp.task('default',function(){
//     console.log('hehe');
// });

//html文件的压缩。
gulp.task('uglifyhtml',function(){
    return gulp.src('src/*.html')
    .pipe(html())//执行html压缩
    .pipe(gulp.dest('dist/'))//输出,没有自动创建
});

//css文件压缩
gulp.task('uglifycss',function(){
    return gulp.src('src/css/*.css')
    .pipe(css())
    .pipe(gulp.dest('dist/css/'))
});

//js文件压缩
//转码，压缩的合并实现
gulp.task('babel', function () {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglifyjs())
        .pipe(gulp.dest('dist/js/'));
});

//png图片的压缩
//图片压缩的插件：gulp-imagemin
gulp.task('runimg', function () {
    return gulp.src('src/imgs/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/imgs/'));
});

//监听
gulp.task('default',function(){
    watch(['src/*.html','src/css/*.css','src/js/*.js','src/imgs/*.png'],gulp.parallel('uglifyhtml','uglifycss','babel','runimg'));
    //watch的第一个参数监听的文件的路径，第二个参数是监听运行的任务名
	//gulp.parallel() –并行运行任务 
});


