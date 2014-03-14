if (Meteor.isClient) {
	Template.dashboard.rendered = function() {

		$(function () { 
		    $('#dailytraffic').highcharts({
		        chart: {
		            type: 'bar'
		        },
		        title: {
		            text: 'Fruit Consumption'
		        },
		        xAxis: {
		            categories: ['Apples', 'Bananas', 'Oranges']
		        },
		        yAxis: {
		            title: {
		                text: 'Fruit eaten'
		            }
		        },
		        series: [{
		            name: 'Jane',
		            data: [1, 0, 4]
		        }, {
		            name: 'John',
		            data: [5, 7, 3]
		        }]
		    });
		});
	}
}