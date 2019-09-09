<?php
// header('Access-Control-Allow-Origin:*');//允许任意域名进行跨域(*)
// header('Access-Control-Allow-Method:POST,GET');//允许跨域请求的方式
require "conn.php";

$result=$conn->query('select * from goodinfo');

$arrdata=array();
for($i=0;$i<$result->num_rows;$i++){
    $arrdata[$i]=$result->fetch_assoc();//将数组给$arrdata的每一项
}
echo json_encode($arrdata);