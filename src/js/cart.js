!function ($) {
    // 引入头部
    $("header").load("header.html", function () {
        $.getScript('../src/js/header.js', function () {

        });
    })
    // 引入尾部
    $("footer").load("footer.html", function () { })
    // 引入侧边导航
    $("nav").load("sidebar.html", function () {
        $.getScript('../src/js/siderbar.js', function () {

        });
    })
    //1.渲染商品列表, 传入两个参数，一个id和数量，根据id和数量渲染整个可见的列表.
    class Shopopera {
        constructor() {
            this.arrsid = [];//商品的id
            this.arrsum = [];//商品的数量
        }
        init() {
            let _this = this;


            //判断用户名的cookie是否存在
            if (getcookie('customer')) {
                $('.no-login').hide();//未登陆的购物车页面显示
                //获取cookie,进行商品列表的渲染。
                if (getcookie('cookiesid') && getcookie('cookienum')) {
                    let csid = getcookie('cookiesid').split(','); //数组
                    let cnum = getcookie('cookienum').split(',');
                    $.each(csid, function (index, value) {
                        _this.showgoodslist(csid[index], cnum[index]);
                    });

                    //如果购物车为空,隐藏cart-empty
                    $('.cart-empty').hide();
                    $('.pay_order_list').show();
                } else {
                    $('.cart-empty').show();
                    $('.pay_order_list').hide();
                }
            } else {
                $('.no-login').show();//未登陆的购物车页面显示
                $('.cart-empty').hide();
                $('.pay_order_list').hide();

                //点击立即登陆按钮调到登陆框
                $('.no-login .J_login').on('click', function () {
                    $('.userbox .mark').show();
                    $('.userbox .dialog').show();
                });
            }

            //改变商品数量++
            $('.J_add').on('click', function () {
                _this.addnum($(this));
                _this.setcookie($(this));
            });

            //改变商品数量--
            $('.J_delete').on('click', function () {
                _this.deletenum($(this));
                _this.setcookie($(this));
            });


            // 输入改变商品数量
            $('.opera .input_text').on('blur', function () {
                _this.changenum($(this));
                _this.setcookie($(this));
            });

            // 删除单个商品
            $('.items_list').on('click', '.pos .ico_close', function () {
                // console.log($(this));
                _this.delgoodslist($(this));
            });

        }

        //商品列表渲染
        showgoodslist(sid, num) {
            let _this = this;
            $.ajax({
                url: 'http://localhost/musicStore/php/datalist.php',
                dataType: 'json',
                success: function (data) {
                    // console.log(data);
                    // console.log(sid)
                    let $strHtml = '';
                    $.each(data, function (index, value) {
                        if (value.goodsid == sid) {
                            //对隐藏的元素进行克隆
                            let $clonebox = $('.cart_goods:hidden').clone(true, true);
                            $clonebox.find('.pos img').attr('src', value.url);
                            $clonebox.find('.pos img').attr('sid', value.goodsid);
                            $clonebox.find('.pos ico_close').html(value.title);
                            $clonebox.find('.opera .input_text').val(num);
                            $clonebox.find('.price p').html(value.price);
                            //小计
                            let subTotal = (value.price * num).toFixed(2);
                            $clonebox.find('.subTotal').html(subTotal);
                            $clonebox.css('display', 'table-row');
                            $('.pay_order_list .items_list').append($clonebox);
                        }
                    });
                    _this.calc();
                }
            });
        }

        //计算总和
        calc() {
            let allprice = 0;//总价
            $('.cart_goods:visible').each(function (index, element) {
                // console.log(parseInt($(element).find('.subTotal').html()));
                allprice += parseFloat($(element).find('.subTotal').html());
            });
            $('.pay_cart_total .num .totalMoney').html(allprice.toFixed(2));
        }

        // 改变商品数量++
        addnum(obj) {
            let _this = this;
            let $count = parseInt(obj.prev().val());
            // console.log($count);
            $count++;
            // console.log($count);
            if ($count > 20) {
                $count = 20;
                alert('商品数量达到上限！');
            }
            obj.prev().val($count);
            obj.parents().next().next().find('.subTotal').html(_this.singleprice(obj, $count));
            _this.calc();
            // setcookie(obj);
        }
        // 改变商品数量--
        deletenum(obj) {
            let _this = this;
            let $count = parseInt(obj.next().val());
            // console.log($count);
            $count--;
            // console.log($count);
            if ($count < 1) {
                $count = 1;
                alert('商品数量不能小于1！');
            }
            obj.next().val($count);
            obj.parents().next().next().find('.subTotal').html(_this.singleprice(obj, $count));
            _this.calc();
        }

        // 输入改变商品数量
        changenum(obj) {
            // alert(1);
            // let _this=this;
            let $reg = /^\d+$/g;//只能输入数字
            let $value = parseInt(obj.val());
            if ($reg.test($value)) {
                if ($value > 20) {
                    alert('商品数量最多为20!');
                    obj.val(20);
                } else if ($value < 1) {
                    alert('商品数量最少为1件!');
                    obj.val(1);
                } else {
                    obj.val($value);
                }
            } else {
                alert('只能输入数字');
                obj.val(1);
            };
            obj.parents().next().next().find('.subTotal').html(this.singleprice(obj, obj.val()));
            this.calc();
        }

        //计算数量改变后单个商品的小计
        singleprice(obj, count) {
            let $dj = parseFloat(obj.parents().next().find('p').html());//单个价格
            return ($dj * count).toFixed(2);
        }

        //提前获取cookie里面id和num，转为数组
        cookietoarray() {
            if (getcookie('cookiesid') && getcookie('cookienum')) {
                this.arrsid = getcookie('cookiesid').split(',');//cookie商品的sid  
                this.arrnum = getcookie('cookienum').split(',');//cookie商品的num
            }
        }

        //将改变后的数值放在cookie中
        setcookie(obj) { //obj:当前操作的对象
            this.cookietoarray();//得到数组
            let $index = obj.parents('.opera').prev().find('img').attr('sid');//通过id找数量的位置
            this.arrnum[$.inArray($index, this.arrsid)] = obj.parents('.opera').find('input').val();
            addcookie('cookienum', this.arrnum.toString(), 7);
        }

        //删除cookie
        delgoodscookie(sid) {
            let $index = -1;
            $.each(this.arrsid, function (index, value) {
                if (sid == value) {
                    $index = index;
                }
            });
            this.arrsid.splice($index, 1);
            this.arrnum.splice($index, 1);
            addcookie('cookiesid', this.arrsid.toString(), 7);
            addcookie('cookienum', this.arrnum.toString(), 7);
        }

        //删除单个商品
        delgoodslist(obj) {
            this.cookietoarray();
            if (confirm('你确定要删除吗？')) {
                obj.parents('.cart_goods').remove();
            }
            // console.log(obj.prev().prev().find('img').attr('sid'));
            this.delgoodscookie(obj.prev().prev().find('img').attr('sid'));
            this.calc();
        }


    }
    new Shopopera().init();
}(jQuery)