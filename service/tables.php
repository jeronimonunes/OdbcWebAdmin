<?php
	$result = odbc_tables($connection);
	$first = isset($_POST['first'])?$_POST['first']:0;
	if(isset($_POST['rows'])){
		$max = $_POST['rows'];
	}
	if($result){
		echo("\"data\":[");
		$j=0;
		// For some reason odbc_fetch_array ignores the second parameter
		while($first >= 0){
			$data = odbc_fetch_array($result);
			$first--;
		}
		while($data) {
			echo(json_encode($data));
			if( !(isset($max) && ++$j >= $max) ){
				$data = odbc_fetch_array($result);
			} else {
				$data = false;
			}
			if($data) echo(",");
		}
		echo("],");
	}
	echo("\"totalRecords\":".$j.",");
	$status = "ok";
?>