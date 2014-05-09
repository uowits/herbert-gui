
Router.map(function() {
    this.route('dashboard', {
        path: '/',
        onBeforeAction: function() {
            this.subscribe('monthly_totals_for_year').wait();
            this.subscribe('this_weeks_usage').wait();
            this.subscribe('30day_usage').wait();
            this.subscribe('today_usage_totals').wait();
            this.subscribe('weekly_top_users').wait();
        },
        data: function() {
            var data;
            var router = this.router;
            Deps.autorun(function() {

                //Perform an aggregate for year to date by adding up all the months
                var monthly_totals = MonthlyTotals.find();
                var monthly_comm_totals = {}
                monthly_totals.forEach(function(monthly_total) {
                    for(community in monthly_total.communities) {
                        if (!(community in monthly_comm_totals)) {
                            monthly_comm_totals[community] = 0;
                        }
                        monthly_comm_totals[community] += monthly_total.communities[community]
                    }
                });

                var months_daily_totals = DailyTotals.find({}, {sort: {date: 1}});
                var todays_daily_totals_obj = DailyTotals.findOne({}, {sort: {date: -1}});
                var todays_daily_totals = (todays_daily_totals_obj) ? todays_daily_totals_obj.communities : []
                var todays_weekly_totals_obj = WeeklyTotals.findOne({}, {sort: {date: -1}});
                var todays_weekly_totals = todays_weekly_totals_obj ? todays_weekly_totals_obj.communities : []
                var todays_monthly_totals_obj = MonthlyTotals.findOne({}, {sort: {date: -1}});
                var todays_monthly_totals = todays_monthly_totals_obj ? todays_monthly_totals_obj.communities : []

                var weekly_top_users = UserWeeklyTotals.find();

                data ={
                    yearlyTotal: _.map(monthly_comm_totals, function(val,key){return {community: key, bytes: val}}),
                    weeklyTotal: _.map(todays_weekly_totals, function(val,key){return {community: key, bytes: val}}),
                    todaysTotals: _.map(todays_daily_totals, function(val,key){return {community: key, bytes: val}}),
                    monthsTotals: _.map(todays_monthly_totals, function(val,key){return {community: key, bytes: val}}),
                    months_daily_totals: months_daily_totals,
                    weekly_top_user: weekly_top_users,
                }
                router.setData(data);
            });   
            
            return data;
        }	
    })
})

//Some helpers for formatting the values
Template.dashboard_value.community = function() {
    switch(this.community) {
        case "58698:100":
            return "Local";
        case "58698:101":
            return "ON-NET"
        case "58698:102":
            return "OFF-NET"
    }
    return this.community
}

var toHTMLWithData = function (kind, data) {
  return UI.toHTML(kind.extend({data: function () { return data; }}));
};

//Attach the rendering of the 30 day chart
var chartRenderHandle;
Template.dashboard_chart.rendered = function() {
	var $chart = $(this.find('.chart'));
	
    if(! $chart.highcharts() ) {
        $chart.highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: '30 day traffic consumption'
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value; //Returns the data consumed for this day
                    },
                    rotation: -45,
                    align: 'right',
                    step: 2,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Data Consumed'
                },
           },
            series: [{
                name: 'On-Net',
                data: []
            }, {
                name: 'Off-Net',
                data: []
            }],
            tooltip: {
                formatter: function() {
                	return toHTMLWithData(Template.dashboard_chart_formatter, this);
                }
            },
            credits: {
                enabled: false,
            }
        });
    }
    //The chart is already displayed. Time to update it with some data
    chartRenderHandle = Deps.autorun(function() {
        var months_daily_totals = DailyTotals.find({}, {sort: {date: 1}});
        on_net = [];
        off_net = [];
        categories = []

        months_daily_totals.forEach(function(total) {

            categories.push(moment(total.date).format("MMM Do YYYY"));
            var day_of_week = moment(total.date).format('dddd');
            on_net.push( {
                'y':  total.communities['58698:101'],
                day: day_of_week,

            });
            off_net.push( {
                'y':  total.communities['58698:102'],
                day: day_of_week,
            })

        })

        var chart = $chart.highcharts();

        chart.xAxis[0].setCategories(categories);
        chart.series[0].update({
            data: on_net,
        });
        chart.series[1].update({
            data: off_net
        });
    });
}

// make sure we stop the Deps.autorun() from running after we've torn down the graph
Template.dashboard_chart.destroyed = function() {
	if(chartRenderHandle)
		chartRenderHandle.stop();
}
