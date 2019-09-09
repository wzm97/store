!function ($) {
    // 引入头部
    $("header").load("header.html", function () { 
        $.getScript('../src/js/header.js', function () {

        });
    })
    // 引入尾部
    $("footer").load("footer.html", function () { })
    //引入侧边导航
    $("nav").load("sidebar.html", function () { 
        $.getScript('../src/js/siderbar.js', function () {

        });
    })

    //1.获取首页商品列表传入的sid
    let $sid = location.search.substring(1).split('=')[1];
    // console.log($sid);

    //2.将当前的id传给后端获取对应的数据
    $.ajax({
        url: 'http://localhost/musicStore/php/getdata.php',
        data: {
            sid: $sid
        },
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            let $smallpic = data.urls.split(',');
            // console.log($smallpic);
            $('#spic img').attr('src', data.url);
            $('#bpic').attr('src', data.url);
            $('#spic img').attr('sid', data.goodsid); //添加自定义属性sid
            $('.goodsTitle').html(data.title);
            $('.price_cur').html(data.price);
            $('.pre').html(data.preprice);
            $('.detail_title span').html(data.title);

            //拼接小图片
            let $strHtml = '';
            $.each($smallpic, function (index, value) {
                $strHtml += `
                <li>
                    <img src="${value}">
                </li>
                `
            })
            $('#picList ul').html($strHtml);

            //将详细描述下的标题栏改为固定定位

            //将标题栏的top值保存下来
            let $boxTop=$('.descBox_title').offset().top;

            $(window).on('scroll',function(){
                let $top=$(window).scrollTop();
                // console.log('top'+$top)
                // console.log('box'+$('.descBox_title').offset().top)
                if($top>$boxTop){
                    $('.descBox_title').addClass('fixed');
                    $('.descBox_title .fixedBtn').css('display','block');
                    $('.descBox_title span').css('display','block');
                    //将价钱重新赋值
                    $('.descBox_title .db_prize').html(data.price);
                }else{
                    $('.descBox_title').removeClass('fixed');
                    $('.descBox_title .fixedBtn').css('display','none');
                    $('.descBox_title span').css('display','none');
                }
            })
        }
    });

    //3.放大镜效果
    function Fangda() {
        this.sf = $('#sf');//小放
        this.spic = $('#spic');//小图
        this.bf = $('#bf');//大放
        this.bpic = $('#bpic');//大图
        this.ulList = $('#picList ul');//移动的ul
        this.list = $('#picList ul li');//每一个li
        this.preBtn = $('.pic_pre');//左键
        this.nextBtn = $('.pic_next');//右键
    }

    Fangda.prototype.init = function () {
        let _this = this;
        this.sf.width(this.spic.width() * this.bf.width() / this.bpic.width());//小放的宽度
        this.sf.height(this.spic.height() * this.bf.height() / this.bpic.height());//小放的高度

        //求比例
        this.bili = this.bf.width() / this.sf.width();
        // console.log(this.bili);

        // 鼠标移入 移出
        this.spic.hover(function () {
            _this.sf.css('visibility', 'visible');
            _this.bf.css('visibility', 'visible');

            // 鼠标移动
            _this.spic.on('mousemove', function (ev) {
                _this.move(ev);
            })
        }, function () {
            _this.sf.css('visibility', 'hidden');
            _this.bf.css('visibility', 'hidden');
        })

        //鼠标移入小图进行切换  事件委托
        this.ulList.on('mouseover', 'li', function () {
            // console.log($(this))
            let $imgurl = $(this).find('img').attr('src');
            $('#smallpic').attr('src', $imgurl);
            $(this).find('img').addClass('active');
            $(this).siblings().find('img').removeClass('active');
            $('#bpic').attr('src', $imgurl);

        });

        //运动列表
        this.num = 4;
        this.liWidth = this.list.eq(0).width();//1个li的宽度

        // 右键
        this.nextBtn.on('click', function () {
            // console.log(_this.liWidth);
            _this.rightmove();
        })

        // 左键
        this.preBtn.on('click',function(){
            _this.leftmove();
        });


    }
    //鼠标移动时  小放跟随鼠标移动
    Fangda.prototype.move = function (ev) {
        let $left = ev.pageX - $('.goodsPic').offset().left - this.sf.width() / 2;
        let $top = ev.pageY - $('.goodsPic').offset().top - this.sf.height() / 2;
        if ($left < 0) {
            $left = 0;
        } else if ($left >= this.spic.width() - this.sf.width()) {
            $left = this.spic.width() - this.sf.width();
        }
        if ($top < 0) {
            $top = 0;
        } else if ($top >= this.spic.height() - this.sf.height()) {
            $top = this.spic.height() - this.sf.height();
        }
        this.sf.css({
            left: $left,
            top: $top,
        });

        this.bpic.css({
            left: -$left * this.bili,
            top: -$top * this.bili,
        })
    }

    // 右键移动
    Fangda.prototype.rightmove = function () {
        if (this.ulList.children().length > this.num) {
            this.num++;
            // console.log(this.num);
            this.ulList.animate({
                left: -this.liWidth * (this.num - 4)
            })
        }
    }

    // 左键移动
    Fangda.prototype.leftmove=function(){
        if(this.num>4){
            this.num--;
            this.ulList.animate({
                left:-this.liWidth*(this.num-4)
            });
        }
    }

    new Fangda().init();

    //4.加入购物车
    let sidarr = []; //存放商品的编号数组
    let numarr = []; //存放商品的数量数组

    //取cookie(假设是第二次点击，获取第一次的cookie),提前约定cookie的key值
    //将cookie取出转换成数组，利用数组进行判断是否是第一次。
    function cookieToArray() {
        if (getcookie('cookiesid') && getcookie('cookienum')) {
            sidarr = getcookie('cookiesid').split(',') //cookie存放商品编号的key值
            numarr = getcookie('cookienum').split(',') //cookie存放商品数量的key值
        }
    }

    $('.addToCart').on('click',function(){
        let $sid=$(this).parents('.goodsBox_info').prev().find('#spic').find('img').attr('sid');
        // console.log($sid);
        cookieToArray();//获取已经存在的cookie值。
        if($.inArray($sid,sidarr)!==-1){//商品存在，数量叠加 
            var num = parseInt(numarr[$.inArray($sid, sidarr)]) + parseInt($('.count input').val());
			numarr[$.inArray($sid, sidarr)] = num;
            addcookie('cookienum', numarr.toString(), 10); //数组存入cookie
        }else{//不存在，第一次添加。将商品的id和数量存入数组，再存入cookie.
            sidarr.push($sid);//将当前的id存入数组
            addcookie('cookiesid',sidarr.toString(),10);//数组存入cookie
            numarr.push($('.count input').val());
            addcookie('cookienum', numarr.toString(), 10); //数组存入cookie
        }
        alert('加入购物车成功！');
    });

    //5.加减商品数量
    //减
    $('.count .c_sub').on('click',function(){
        if($(this).next().val()>1){
            $(this).next().val($(this).next().val()-1);
        }else{
            alert('商品数量不能小于1');
        }
    });
    //加
    $('.count .c_add').on('click',function(){
        if($(this).prev().val()<20){
            $(this).prev().val(parseInt($(this).prev().val())+1);
        }else{
            alert('商品数量达到上限');
        }
    })
    // 判断商品的数量是否大于20
    $('.count input').on('blur',function(){
        if($('.count input').val()>20){
            alert('商品数量达到上限,请重新选择');
            $('.count input').val(1);
        }
    })
}(jQuery)