<?php
header('content-type:text/html;charset=utf-8');//设置字符编码
// header('Access-Control-Allow-Origin:*');//允许任意域名进行跨域(*)
// header('Access-Control-Allow-Method:POST,GET');//允许跨域请求的方式
require "conn.php";

if(isset($_GET['phone']) && isset($_GET['pwd'])){
    $phone=$_GET['phone'];
    $pwd=$_GET['pwd'];


    $result=$conn->query("select * from user where phone='$phone' and password='$pwd' ");
    
    if($result->fetch_assoc()){
        echo true;
    }else{
        echo false;
    }
}