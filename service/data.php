<?php
	if(isset($_POST['table'])){
		if(isset($_POST['selection'])){
			$sql = Grammar::select($_POST['table'],$_POST['selection']);
		} else {
			$sql = Grammar::select_all($_POST['table']);
		}
		$result = odbc_exec($connection,$sql);
		$first = isset($_POST['first'])?$_POST['first']:0;
		if(isset($_POST['rows'])){
			$max = $_POST['rows'];
		}
		if($result){
			echo("\"data\":[");
			$j=0;
			$data = odbc_fetch_array($result,++$first);
			while($data) {
				echo(json_encode($data));
				$j++;
				if( !(isset($max) && $j >= $max) ){
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
	} else {
		$status = "Table required";
	}
?>