<?php
class Grammar {
	static function select_all($table) {
		return "SELECT * FROM ".$table;
	}
	static function count($table) {
		return "SELECT count(*) FROM ".$table;
	}
	static function select($table,$columns) {
		$sql = "";
		foreach($columns as $col) {
			$sql .=$col.',';
		}
		return 'SELECT '.trim($sql,',').' FROM '.$table;
	}
}
?>