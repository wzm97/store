<?php
header('content-type:text/html;charset=utf-8');//设置字符编码
// header('Access-Control-Allow-Origin:*');//允许任意域名进行跨域(*)
// header('Access-Control-Allow-Method:POST,GET');//允许跨域请求的方式

require 'conn.php';

if(isset($_GET['phone'])){
    $userphone=$_GET['phone'];
    $result=$conn->query("select * from user where phone='$userphone'");
    // echo $userphone;

    if($result->fetch_assoc()){
        echo true;
    }else{
        echo false;
    }
}

if(isset($_POST['phone'])&&isset($_POST['pwd'])&&isset($_POST['area'])){
    $phone=$_POST['phone'];
    $pwd=$_POST['pwd'];
    $area=$_POST['area'];

    $conn->query("insert into user values(null,'$phone','$pwd','$area')");
    
    
}
