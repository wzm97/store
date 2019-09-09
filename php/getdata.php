<?php  
	// header('Access-Control-Allow-Origin:*');//允许任意域名进行跨域(*)
    // header('Access-Control-Allow-Method:POST,GET');//允许跨域请求的方式
	require("conn.php");
	
	if(isset($_GET['sid'])){

		$id=$_GET['sid'];
	
		$result=$conn->query("select * from goodinfo where goodsid=$id ");
		
		echo json_encode($result->fetch_assoc());
	}
	// echo $id;
	

?>