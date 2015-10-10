$(document).ready(function(){
	$('#mb').puimenubar();
});

function getColumns(metadata){
	var columns = [];
	metadata.forEach(function (data){
		columns[columns.length] = {field:data.name,headerText:data.name,sortable:true};
	});
	return columns;
}

function getMetadataColumns(metadata){
	var columns = [];
	columns[0] = {field:"selected",headerText:"Selected",sortable:false};
	columns[1] = {field:"type",headerText:"Type",sortable:true};
	columns[2] = {field:"name",headerText:"Name",sortable:true};
	columns[3] = {field:"len",headerText:"Length",sortable:true};
	columns[4] = {field:"precision",headerText:"Precision",sortable:true};
	columns[5] = {field:"scale",headerText:"Scale",sortable:true};
	return columns;
}

function getMetadataData(metadata){
	return metadata;
}

function getData(callback,ui){
	$.ajax({
		type: 'post',
		url: 'service/',
		dataType: 'json',
		context: this,
		data: {
			type: 'data',
			table: this.options.dbtable,
			first: ui.first,
			rows: this.options.paginator.rows,
			dsn:'dsn',
			user:'',
			password:''
		},
		success: function(response) {
			callback.call(this, response.data);
		}
	});
}

function data(){
	var t = $(this).text();
	var r = $("#rightPanel");
	r.children().remove();
	var m = $("<div id='metadata'>").appendTo(r);
	var d = $("<div id='data'>").appendTo(r);
	$.ajax({
		type: 'POST',
		url: 'service/',
		dataType: 'json',
		data: {
			dsn:'dsn',
			type: 'metadata',
			table: t,
			user:'',
			password:''
		},
		success: function(response) {
			d.puidatatable({
				dbtable: t,
				lazy: true,
				caption: 'Dados da tabela',
				paginator: {
					rows: 5,
					totalRecords: response.totalRecords
				},
				columns: getColumns(response.metadata),
				datasource: getData
			});
			m.puidatatable({
				dbtable: t,
				caption: 'Metadados da tabela',
				paginator: {
					rows: 5,
				},
				columns: getMetadataColumns(response.metadata),
				datasource: getMetadataData(response.metadata)
			});
		}
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
			dsn:'dsn',
			type: 'tables',
			user:'',
			password:''
		},
		success: function(response) {
			var t = $("<ul id='tables'>");
			response.data.forEach(function(i){
				$("<a data-icon='fa-download'>").text(i.TABLENAME).on("click",data).appendTo($("<li>").appendTo(t));
			});	
			t.appendTo(l);
			t.puimenu();
		}
	});
}