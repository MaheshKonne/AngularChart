angular.module("angularChart", [])

.controller('chartController', function($scope) {
	
	var fileInput = document.getElementById('fileInput'), fileContent;				

	$scope.rendreChart = function() {
		var file = fileInput.files[0];
		var requiredFileType = "text/csv";
		if (file.type === requiredFileType) {
			var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e) {
                fileContent = reader.result;
				formatData(fileContent);
            }
		} else {
			alert("Choose CSV files only.")
		}
	}

	function formatData(fileContent) {
		var seriesNames = [], data = [];
		fileContent.split("\n").forEach(function(eachRow, i) {
			var eachRowData = eachRow.split(",");
			seriesNames.push(eachRowData[0]);
			eachRowData.shift();
			data.push(eachRowData.sort().map(function(val) {
				return {
					x : parseInt(val.split("|")[0]),
					y : parseInt(val.split("|")[1])
				};
			}));
		});
		drawChart(seriesNames, data);
	}

	function drawChart(seriesNames, data) {
		var chartOptions = {
			title:{
				text: "Multi Series Line Chart"
			},
			data: [],
			legend: {
				cursor: "pointer",
				itemclick: function (e) {
					if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					chart.render();
				}
			}
		}
		data.forEach(function(dataSet, index) {
			chartOptions.data[index] = {};
			chartOptions.data[index].type = "line";
			chartOptions.data[index].showInLegend = true;
			chartOptions.data[index].dataPoints = dataSet;
			chartOptions.data[index].name = seriesNames[index];
		})

		var chart = new CanvasJS.Chart("chartContainer", chartOptions);

		chart.render();

	}
})