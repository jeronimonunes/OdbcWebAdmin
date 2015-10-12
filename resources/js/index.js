var odbc = {dsn:'',user:'',password:'',table:{selection:new Set()}};

$(document).ready(function(){
	$('#mb').puimenubar();
});

function getColumns(){
	var columns = [];
	odbc.table.selection.forEach(function (s){
		columns[columns.length] = {field:s,headerText:s,sortable:true};
	});
	return columns;
}

function getMetadataColumns(metadata){
	return [
		{field:"type",headerText:"Type",sortable:true},
		{field:"name",headerText:"Name",sortable:true},
		{field:"len",headerText:"Length",sortable:true},
		{field:"precision",headerText:"Precision",sortable:true},
		{field:"scale",headerText:"Scale",sortable:true}
	];
}

function getMetadataData(callback){
	odbc.metadata = this;
	callback.call(this,odbc.table.metadata);
	this.tbody.find('tr').each(function(i,r){
		odbc.metadata.selectRow($(r),false);
	});
}

function getData(callback,ui){
	odbc.data = this;
	$.ajax({
		type: 'post',
		url: 'service/',
		dataType: 'json',
		context: this,
		data: {
			type: 'data',
			table: odbc.table.name,
			selection: Array.from(odbc.table.selection),
			first: ui.first,
			rows: this.options.paginator.rows,
			dsn:odbc.dsn,
			user:odbc.user,
			password:odbc.password
		},
		success: function(response) {
			callback.call(this, response.data);
		}
	});
}

function onTableSelect(){
	odbc.table.name = $(this).text();
	odbc.table.selection = new Set();
	var r = $("#rightPanel");
	r.children().remove();
	var m = $("<div id='metadata'>").appendTo(r);
	var d = $("<div id='data'>").appendTo(r);
	$.ajax({
		type: 'POST',
		url: 'service/',
		dataType: 'json',
		data: {
			dsn:odbc.dsn,
			type: 'metadata',
			table: odbc.table.name,
			user:odbc.user,
			password:odbc.password
		},
		success: function(response) {
			odbc.table.metadata = response.metadata;
			odbc.table.totalRecords = response.totalRecords;
			m.puidatatable({
				caption: 'Metadados da tabela',
				paginator: {
					rows: 5,
				},
				columns: getMetadataColumns(odbc.table.metadata),
				datasource: getMetadataData,
				selectionMode: 'multiple',
				keepSelectionInLazyMode: true,
				rowSelect: function(event,data){
					if(typeof(data.name)=='string'&&data.name.length>0) odbc.table.selection.add(data.name);
					createDataTable();
				},
				rowUnselect: function(event,data){
					odbc.table.selection.delete(data.name);
					createDataTable();
				}
			});
		}
	});
}

function createDataTable(){
	$('#data').remove();
	var d = $("<div id='data'>").appendTo($("#rightPanel"));
	d.puidatatable({
		caption: 'Dados da tabela',
		lazy: true,
		paginator: {
			rows: 5,
			totalRecords: odbc.table.totalRecords
		},
		columns: getColumns(),
		datasource: getData
	});
}

function tables(){
	var l = $("#leftPanel");
	l.children().remove();
	$.ajax({
		type: 'POST',
		url: 'service/',
		dataType: 'json',
		data: {
			dsn:odbc.dsn,
			type: 'tables',
			user:odbc.user,
			password:odbc.password
		},
		success: function(response) {
			var t = $("<ul id='tables'>");
			response.data.forEach(function(i){
				if(i.TYPENAME=="TABLE"||i.TABLE_TYPE=="TABLE"){
					if(typeof(i.TABLE_NAME)=='string'&&i.TABLE_NAME!=""){
						$("<a data-icon='fa-table'>").text(i.TABLE_NAME).on("click",onTableSelect).appendTo($("<li>").appendTo(t));
					} else if(typeof(i.TABLENAME)=='string'&&i.TABLENAME!=""){
						$("<a data-icon='fa-table'>").text(i.TABLENAME).on("click",onTableSelect).appendTo($("<li>").appendTo(t));
					}
				}
			});	
			t.appendTo(l);
			t.puimenu();
		}
	});
}

function _export(){
	//TODO
}