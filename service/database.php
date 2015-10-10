<?php
	if(isset($_POST['dsn'])){
		if(isset($_POST['user'])){
			if(isset($_POST['password'])){
				$dsn = $_POST['dsn'];
				$user = $_POST['user'];
				$password = $_POST['password'];
				if(isset($_POST['grammar'])){
					if(file_exists('grammar_'.$_POST['grammar'].'.php')){
						require('grammar_'.$_POST['grammar'].'.php');
						$connection = odbc_pconnect($dsn,$user,$password);
					} else {
						$status = "Invalid grammar";
					}
				} else {
					require('grammar_default.php');
					$connection = odbc_pconnect($dsn,$user,$password);
				}
			} else {
				$status = "password required";
			}
		} else {
			$status = "user required";
		}
	} else {
		$status = "dsn required";
	}
?>