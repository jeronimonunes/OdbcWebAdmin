<?php
	header('Content-Type: application/json');
	header("Content-Type: application/json", true);
	date_default_timezone_set('America/Sao_Paulo');
	session_start();
	echo("{");
	set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
		exit("\"status\":".json_encode($errstr)."}");
	});
	require("database.php");
	if(isset($connection) && $connection) {
		if(isset($_POST['type']) && file_exists($_POST['type'].".php")){
			require($_POST['type'].".php");
			exit("\"status\":".json_encode($status)."}");
		} else {
			exit("\"status\":\"Unknown type\"}");
		}
	} else {
		if(isset($status)) exit("\"status\":".json_encode($status)."}");
		else exit("\"status\":\"Invalid credentials\"}");
	}
?>