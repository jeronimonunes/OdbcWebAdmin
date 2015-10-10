<?php
	if(isset($_POST['table'])){
		$sql = Grammar::select_all($_POST['table']);
		$result = odbc_exec($connection,$sql);
		if($result){
			$nCols = odbc_num_fields($result);
			odbc_fetch_row($result,0);
		} else {
			$nCols = 0;
			$status = odbc_errormsg($connection);
		}
		echo("\"metadata\":[");
	 	for($i=1; $i <= $nCols; $i++){
	 		echo("{\"type\":");
			echo(json_encode(odbc_field_type($result,$i)));
			echo(",\"name\":");
			echo(json_encode(odbc_field_name($result,$i)));
			echo(",\"len\":");
			echo(json_encode(odbc_field_len($result,$i)));
			echo(",\"precision\":");
			echo(json_encode(odbc_field_precision($result,$i)));
			echo(",\"scale\":");
			echo(json_encode(odbc_field_scale($result,$i)));
			if($i < $nCols) echo("},");
			else echo("}");
		}
		echo("],");
		echo("\"totalRecords\":".odbc_num_rows($result).",");
		$status = "ok";
	} else {
		$status = "Table required";
	}
?>