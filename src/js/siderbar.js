$(document).ready(function () {
    let numBox = $('.shopMenu #cartNum');

    // location.reload();
    if (getcookie('cookiesid')) {
        setInterval(function () {
            let arr = getcookie('cookiesid').split(',');
            let sum = arr.length;
            if (getcookie('customer')) {
                numBox.html(sum);
            } else {
                numBox.html(0);
            }

        }, 1000);
    }

    $(window).on('scroll',function(){
        if($(window).scrollTop()>1000){
            $('.return_top').show();
        }else{
            $('.return_top').hide();
        }
    });

    $('.return_top').on('click',function(){
        $('html,body').animate({
            scrollTop:0,
        });
    });


});