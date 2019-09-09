!function ($) {
    // 引入头部
    $("header").load("header.html", function () {
        $.getScript('../src/js/header.js', '../src/js/login.js', function () {

        })
    })
    // 引入尾部
    $("footer").load("footer.html", function () { });
    // 引入侧边导航
    $("nav").load("sidebar.html", function () {
        $.getScript('../src/js/siderbar.js', function () {

        });
    });

    //top榜切换  直击现场
    let $artistsBtn = $('.topBox #artists');
    let $goodsBtn = $('.topBox #goods');
    let $artistschart = $('.topBox .artists_chart');
    let $goodschart = $('.topBox .goods_chart');

    $artistsBtn.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $artistschart.show();
        $goodschart.hide();
    });

    $goodsBtn.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $artistschart.hide();
        $goodschart.show();
    });


    // 请求数据渲染到页面
    $.ajax({
        url: 'http://localhost/musicStore/php/datalist.php',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            let $strHtml = '';
            $.each(data, function (index, value) {
                $strHtml += `
                <li>
                    <a href="detail.html?sid=${value.goodsid}" target="_blank">
                        <div class="new_goodsPic">
                            <img src="${value.url}" alt="${value.title}">
                        </div>
                        <div class="new_goodsInfo">
                            <p class="goodsName">${value.title}</p>
                            <p class="goodsPrice">${value.price}</p>
                            <p class="like">
                                <span class="J_like"></span>
                                <i class="like_num">${value.like}</i>
                            </p>
                        </div>
                    </a>
                </li>
                `
            })
            $('.goodsList_new').html($strHtml);
        }
    })

    //轮播图
    function Slider() {
        this.sliderBox = $('.sliderBox');//最外层盒子
        this.sliderUl = $('.sliderBox .slider')//移动的ul列表
        this.sliderLi = $('.sliderBox .slider li')//每一个li
        this.btns = $('.sliderBox .sliderBtn li')//每一个小圆点按钮
        this.leftBtn = $('.sliderBox #left')//左边按钮
        this.rightBtn = $('.sliderBox #right')//右边按钮
        this.index = 0;//索引
        this.flag = true;//标记  前一个移动完后下一个开始
        this.timer = null;//定时器
    }
    Slider.prototype.init = function () {
        let _this = this;
        // 克隆第一张图片和最后一张图片，追加到ul中
        let $firstpic = this.sliderLi.first().clone();
        let $lastpic = this.sliderLi.last().clone();
        this.sliderUl.append($firstpic);
        this.sliderUl.prepend($lastpic);

        this.liWidth = this.sliderLi.eq(0).width();//一个li的宽度
        // console.log(this.liWidth);
        // console.log(this.sliderUl.children().length);
        this.sliderUl.width(this.liWidth * this.sliderUl.children().length).css('left', -this.liWidth + 'px');//重新给ul宽度赋值,设置位置

        //点击小圆点按钮，给小圆点加active类
        this.btns.on('click', function () {
            _this.index = $(this).index();
            _this.change();
        });

        //自动轮播
        this.automove();

        //鼠标移入显示左右箭头，移除隐藏
        this.sliderBox.hover(function () {
            $('.sliderBox #left,.sliderBox #right').show();
            clearInterval(_this.timer);
        }, function () {
            $('#left,#right').hide();
            _this.automove();
        })

        //点击右箭头
        this.rightBtn.on('click', function () {
            if (_this.flag) {
                _this.rightmove();
                // console.log(_this.index);
                _this.flag = false;
            }
        });

        // 点击左箭头
        this.leftBtn.on('click', function () {
            if (_this.flag) {
                _this.leftmove();
                // console.log(_this.index);
                _this.flag = false;
            }

        });
    }

    // 移动过程
    Slider.prototype.change = function () {
        let _this = this;
        this.btns.eq(this.index).addClass('active').siblings().removeClass('active');
        this.sliderUl.stop(true).animate({
            left: -this.liWidth * (this.index + 1)
        }, 200, function () {
            if (_this.index === _this.btns.length) {
                _this.sliderUl.css('left', -_this.liWidth + 'px');
                _this.index = 0;
                // console.log(this.index);
            }
            if (_this.index === -1) {
                // alert(1)
                _this.sliderUl.css('left', -_this.liWidth * _this.btns.length) + 'px';
                _this.index = 3;
            }
            _this.flag = true;
        })
    }

    // 点击右箭头移动
    Slider.prototype.rightmove = function () {
        this.index++;
        if (this.index == this.btns.length) {
            this.btns.eq(0).addClass('active').siblings().removeClass('active');
        }
        this.change();
    }

    // 点击左箭头移动
    Slider.prototype.leftmove = function () {
        this.index--;
        // if (this.index <0) {
        // 	this.btns.eq(this.btns.length-1).addClass('active').siblings().removeClass('active');
        // }
        this.change();
    }

    // 自动轮播
    Slider.prototype.automove = function () {
        let _this = this;
        this.timer = setInterval(function () {
            _this.rightmove();
        }, 2000)
    }

    new Slider().init();

    // //追星必备  滑动切换
    let $slick=$('.slider_list');
    let $slickBox = $('.slider_track');//移动的盒子
    let $slickpic = $('.slider_track .slick_slider');//每一个div
    let $slickDots = $('.slick_dots li');//下面小圆点
    let $leftBtn = $('.slick .slick_prev');//往右的按钮
    let $rightBtn = $('.slick .slick_next');//往左的按钮
    let $index = 0;//索引

    let $picWidth=$slickBox.children().outerWidth();//每一个div的宽度


    $slickDots.on('click',function(){
        $index=$(this).index();
        // console.log($index)
        $(this).addClass('slick_active').siblings().removeClass('slick_active');
        $slickBox.animate({
            left:-($index+4)*$picWidth
        });
    });
    
    //右按钮
    $rightBtn.on('click',function(){
        if($index===1){
            $slickBox.animate({
                left:-9*$picWidth
            },200,function () { 
                $slickBox.css('left',-4*$picWidth);
            });
            $index=0; 
        }else if($index===0){
            $slickBox.animate({
                left:-5*$picWidth
            });
            $index=1; 
        }
        $slickDots.eq($index).addClass('slick_active').siblings().removeClass('slick_active');
    });

    // 左按钮
    $leftBtn.on('click',function () {  
        if($index===0){
            $slickBox.animate({
                left:0
            },200,function(){
                $slickBox.css('left',-9*$picWidth);
            });
            $index=1;
        }else if($index===1){
            $slickBox.animate({
                left:-8*$picWidth,
            });
            $index=0;
        }
        $slickDots.eq($index).addClass('slick_active').siblings().removeClass('slick_active');
    });

    







    // 专辑榜  切换
    function Tabalbum() {
        this.ml = $('#ml');//内地销量榜按钮
        this.im = $('#im');//进口销量榜按钮
        this.mlBox = $('.mlablumList');//内地销量榜单
        this.mlBoxLi = $('.mlablumList li')//内地销量榜单的li
        this.imBox = $('.goodsList_rank');//进口销量榜单
        this.imBoxLi = $('.goodsList_rank li');//进口销量榜单的li
    }
    Tabalbum.prototype.init = function () {
        let _this = this;
        //鼠标移入改变背景色,对应榜单出现
        $('#ml').hover(function () {
            $(this).addClass('albumActive').siblings().removeClass('albumActive');
            _this.mlBox.css('display', 'block');
            _this.imBox.css('display', 'none');
        });
        $('#im').hover(function () {
            $(this).addClass('albumActive').siblings().removeClass('albumActive');
            _this.mlBox.css('display', 'none');
            _this.imBox.css('display', 'block');
        });

        // 点击对应的li改变样式
        this.mlBoxLi.hover(function () {
            $(this).addClass('movein').siblings().removeClass('movein');
        });
        this.imBoxLi.hover(function () {
            $(this).addClass('movein').siblings().removeClass('movein');
        })
    }
    new Tabalbum().init();

}(jQuery)