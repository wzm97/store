$(document).ready(function () {
    class yz {
        constructor() {
            this.regerror = $('#register-area .login-error-tips');//注册的错误提示
            this.regphone = $('#register-area .inter-content .login-text-long');//注册的手机号
            this.regpwd = $('#register-area #dialog-password');//注册的密码
            this.regyzm = $('#register-area .login-text-short');//注册的验证码
            this.changeyzm = $('#register-area .login-get-code em');//更换验证码按钮
            this.yzmnum = $('#register-area .login-get-code i');//随机验证码
            this.subBtn = $('#register-area .login-submit');//注册按钮
            this.formBtn = $('#register-area #register-form');//注册的表单
            this.areaBox = $('#register-area .country-name');//地区
            this.subarea = $('#register-area .code-list');//地区下拉框
            this.subarealist = $('#register-area .code-list li');//下拉列表项
            this.agreeBtn=$('#register-area .login-fun-wrap input');//同意条款

            this.phoneflag = true;
            this.pwdflag = true;
            this.yzmflag = true;

            this.logerror=$('#login-area .login-error-tips');//登录的错误提示
            this.logphone=$('#login-area .inter-content .login-text-long');//登录的手机号
            this.logpwd=$('#login-area #login-password');//登录的密码
            this.autoBtn=$('#login-area .login-auto input');//自动登录
            this.loginBtn=$('#login-area .login-submit');//登录按钮

            this.unloginBox=$('.bar_bg .userbox .shop_login');//登录
            this.succBox=$('.bar_bg .userbox .userInfo');//登录成功后的显示框
            this.subshow=$('.userInfo .user_hover');//移动到上面显示下拉框
            this.loginName=$('.userInfo .user_hover p');//登录后的用户名
            this.subinfoBox=$('.userInfo .info_box');//登录的下拉框
            this.exitBtn=$('.userInfo .info_box .exit');//退出按钮
        }
        init() {
            let _this = this;
            // 搜索框获得焦点时改变背景色，出现下拉框
            // let $value=$('.shop_search input').val();
            $('.shop_search input').on('focus', function () {
                $('.shop_search').addClass('input_active');
                $('#search').addClass('a_active');
                $('.shop_search .shop_recommend').show();
            });
            $('.shop_search input').on('blur', function () {
                $('.shop_search').removeClass('input_active');
                $('#search').removeClass('a_active');
                $('.shop_search .shop_recommend').hide();
            });

            // $('.shop_search input').on('input',function(){
            //     let cScript=document.createElement('script');
            //     cScript.src='http://shop.yinyuetai.com/search/keyword/relatedHot.json?hotsize=8&callback='+$value+'&latsize=6&hotsize=6&_=1567751340457';
            //     document.body.appendChild(cScript);
            // });
            // //获取数据
            // function $value(data){
            //     console.log(data);
            // }
        

            // 点击登录按钮，出现登录框,显示遮罩层
            $('.userbox .shop_login').on('click', function () {
                $('.userbox .dialog').css('display', 'block');
                $('.userbox .mark').css('display', 'block');
            });

            //点击登录切换到登录框
            $('.login-tab #log').on('click', function () {
                $('#login-area').css('display', 'block');
                $('#register-area').css('display', 'none');
                $(this).addClass('login-active').siblings().removeClass('login-active');
            });

            //点击注册切换到注册框
            $('.login-tab #reg').on('click', function () {
                $('#login-area').css('display', 'none');
                $('#register-area').css('display', 'block');
                $(this).addClass('login-active').siblings().removeClass('login-active');
            });

            //点击右上角按钮，关闭登录注册框和遮罩层
            $('.dialog .ico_close').on('click', function () {
                $('.userbox .dialog').css('display', 'none');
                $('.userbox .mark').css('display', 'none');
            });

            //表单验证
            //手机号验证
            this.regphone.on('blur', function () {
                _this.phonecheck($(this));
            });

            //开始时随机获取验证码
            this.yzmnum.html(this.yzm());

            // 点击更换验证码
            this.changeyzm.on('click', function () {
                _this.yzmnum.html(_this.yzm());
            });

            //验证码验证
            this.regyzm.on('blur', function () {
                _this.yzmcheck($(this));
            });

            //密码验证
            this.regpwd.on('blur', function () {
                // alert(1);
                _this.pwdcheck($(this));
            });


            //点击地区出现下拉框
            this.areaBox.on('click', function () {
                _this.subarea.show();
                $.each(_this.subarealist, function (index, value) {
                    $(this).on('click', function () {
                        // _this.areaBox.html() = $(this).html();
                        _this.areaBox.val($(this).html());
                        _this.subarea.hide();
                    })
                });
            });


            //注册验证
            this.subBtn.on('click',function(){
                if (_this.regpwd.val() === '') {
                    _this.regerror.html('密码不能为空');
                    _this.pwdflag = false;
                }
                if (_this.regyzm.val() === '') {
                    _this.regerror.html('验证码不能为空');
                    _this.yzmflag = false;
                }
                if (_this.regphone.val() === '') {
                    _this.regerror.html('手机号不能为空');
                    _this.phoneflag = false;
                }

                if(!_this.agreeBtn.prop("checked")){
                    alert('请选择条款!');
                }

                
                if(_this.pwdflag && _this.yzmflag &&_this.phoneflag&& _this.agreeBtn.prop("checked")){
                    $.ajax({
                        type:'post',
                        url:'http://localhost/musicStore/php/register.php',
                        data:{
                            phone:_this.regphone.val(),
                            pwd:_this.regpwd.val(),
                            area:_this.areaBox.val(),
                        },
                        success:function () {  
                            alert('注册成功');
                            location.href='http://localhost/musicStore/src/index.html';
                        }
                    });
                }
                
            });

            //判断手机号是否存在
            this.regphone.on('blur', function () {
                $.ajax({
                    url: 'http://localhost/musicStore/php/register.php',
                    data: {
                        phone: _this.regphone.val(),
                    },
                    success: function (data) {
                        if(!data){
                            _this.regerror.html('');
                        }else{
                            _this.regerror.html('手机号已存在,请重新输入');
                            _this.regphone.val('');
                            _this.phoneflag=false;
                        }
                    }
                });
            });

            //登录验证
            this.loginBtn.on('click',function () {  
                $.ajax({
                    url:'http://localhost/musicStore/php/login.php',
                    data:{
                        phone:_this.logphone.val(),
                        pwd:_this.logpwd.val(),
                    },
                    success:function(data){
                        if(data){
                            alert('登录成功！');
                            location.href='http://localhost/musicStore/src/index.html';
                            addcookie('customer',_this.logphone.val(),7);
                        }else{
                            alert('用户名和密码不匹配');
                        }
                    }
                });
                // alert('登录成功');
            });

            //登录成功后更改登录名称
            if(getcookie('customer')){
                // this.usernameBox.html(getcookie('customer').split(','));
                this.unloginBox.hide();
                this.succBox.show();
                this.loginName.html(getcookie('customer').split(','));
                //登录成功后显示下拉框
                this.subshow.hover(function(){
                    _this.subinfoBox.show();
                },function(){
                    _this.subinfoBox.hide();
                });
            }

            // 退出登录
            this.exitBtn.on('click',function(){
                _this.unloginBox.show();
                _this.succBox.hide();
                delcookie('customer');
            });





        }

        //手机号验证
        phonecheck(obj) {
            if (obj.val() !== '') {
                let phone = /^1[34578]\d{9}$/;
                if (phone.test(obj.val())) {
                    this.regerror.html('');
                    this.phoneflag = true;
                    console.log(this.phoneflag);
                } else {
                    this.regerror.html('手机号码有误,请重新输入');
                    this.phoneflag = false;
                    console.log(this.phoneflag);
                    // obj.val('');
                }
            } else {
                this.regerror.html('手机号不能为空');
                this.phoneflag = false;
                console.log(this.phoneflag);
            }
        };

        //随机生成验证码
        yzm() {
            let arr = [];
            let str = '';
            for (var i = 48; i <= 57; i++) {
                arr.push(String.fromCharCode(i));
            }
            for (var i = 97; i <= 122; i++) {
                arr.push(String.fromCharCode(i));
            }
            for (var i = 0; i < 4; i++) {
                var index = parseInt(Math.random() * arr.length);
                if (arr[index] <= 9) {
                    str += arr[index];
                } else {
                    if (Math.random() > 0.5) {
                        str += arr[index].toUpperCase();
                    }
                    else {
                        str += arr[index];
                    }
                }
            }
            return str;
        };

        //验证码验证
        yzmcheck(obj) {
            if (obj.val() !== '') {
                let inputValue = obj.val().toLowerCase();
                let oValue = this.yzmnum.html().toLowerCase();
                if (inputValue == oValue) {
                    this.regerror.html('');
                    this.yzmflag = true;
                } else {
                    this.regerror.html('验证码输入有误');
                    this.yzmnum.html(this.yzm());
                    this.yzmflag = false;
                }
            } else {
                this.regerror.html('验证码不能为空');
                this.yzmflag = false;
            }
        };

        //密码验证
        pwdcheck(obj) {
            if (obj.val() !== '') {
                let pwd = /^\w{6,20}$/;
                if (obj.val().length >= 6 && obj.val().length <= 20) {
                    if (pwd.test(obj.val())) {
                        this.regerror.html('');
                        this.pwdflag = true;
                    } else {
                        this.regerror.html('密码不能包含非法字符');
                        this.pwdflag = false;
                    }
                } else {
                    this.regerror.html('密码长度有误');
                    this.pwdflag = false;
                }
            } else {
                this.regerror.html('密码不能为空');
                this.pwdflag = false;
            }
        };

    }
    new yz().init();


});
