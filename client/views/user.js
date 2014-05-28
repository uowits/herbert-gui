
Router.map(function() {
    this.route('user', {
        path: '/user/:username',

        onBeforeAction: function() {
            var username = this.params.username;
            this.subscribe('user_monthly_totals_for_year', username).wait();
            this.subscribe('user_this_weeks_usage', username).wait();
            this.subscribe('user_30day_usage', username).wait();
            this.subscribe('user_all_daily_traffic', username).wait();
        },

        data: function() {
            var username = this.params.username;

            //Perform an aggregate for year to date by adding up all the months

            var monthly_totals = UserMonthlyTotals.find();
            var monthly_comm_totals = {}
            monthly_totals.forEach(function(monthly_total) {
                for(community in monthly_total.communities) {
                    if (!(community in monthly_comm_totals)) {
                        monthly_comm_totals[community] = 0;
                    }
                    monthly_comm_totals[community] += monthly_total.communities[community]
                }
            });

            var months_daily_totals = UserDailyTotals.find();
            var todays_daily_totals_obj = UserDailyTotals.findOne({username: username}, {sort: {date: -1}});
            var todays_daily_totals = (todays_daily_totals_obj) ? todays_daily_totals_obj.communities : []
            var todays_weekly_totals_obj = UserWeeklyTotals.findOne({}, {sort: {date: -1}});
            var todays_weekly_totals = todays_weekly_totals_obj ? todays_weekly_totals_obj.communities : []
            var todays_monthly_totals_obj = UserMonthlyTotals.findOne({}, {sort: {date: -1}});
            var todays_monthly_totals = todays_monthly_totals_obj ? todays_monthly_totals_obj.communities : []
            
            if(!todays_monthly_totals_obj)
            	return;
            
            var data ={
                username: username,
                yearlyTotal: _.map(monthly_comm_totals, function(val,key){return {community: key, bytes: val}}),
                weeklyTotal: _.map(todays_weekly_totals, function(val,key){return {community: key, bytes: val}}),
                todaysTotals: _.map(todays_daily_totals, function(val,key){return {community: key, bytes: val}}),
                monthsTotals: _.map(todays_monthly_totals, function(val,key){return {community: key, bytes: val}}),
                userTraffic: UserDailyTotals.find({}, {sort: {date: 1}}),
                                //                months_daily_totals: months_daily_totals,
                //                weekly_top_user: weekly_top_users,
            }
            return data;
        }	
    })
})

//Some helpers for formatting the values
Template.user_value.community = function() {
    var to_return = this.community
    var community = this.community
    Meteor.settings.public.communities.forEach(function(entry) {
        if(entry['community'] == community)
            to_return = entry['description']
    });
    return to_return;
}

Template.user_throttling_controls.throttleMethods = function() {
    return _.map(Meteor.settings.public.throttle_methods, function(val, key) { return {item: key, description: val} })
}

var toHTMLWithData = function (kind, data) {
  return UI.toHTML(kind.extend({data: function () { return data; }}));
};

Template.user_chart_formatter.date_str = function() {
	return moment(this.points[0].x).format('dddd MMMM Do YYYY');
}

var chartRenderHandle;
Template.user_chart.rendered = function() {
    var data = []
    var $chart = $(this.find('.chart'))

    if(! $chart.highcharts()) {
        
        //Builds a list of communities/categories to be shown in this chart
        var series = [];
        Meteor.settings.public.communities.forEach(function(entry) {
            var to_push = {
                name: entry['description'],
                type: 'column',
                data: [],
            };
            if(entry['chart-order'] != undefined) {
                to_push['zIndex'] = entry['chart-order']
            }
            series.push(to_push)
        })

        //The chart does not yet exist.  We need to create it
        $chart.highcharts('StockChart', {
            rangeSelector : {
                selected: 1
            },
            tooltip: {
                valueDecimals: 2,
                formatter: function() {
                	return toHTMLWithData(Template.user_chart_formatter, this);
                }
            },
            title: {
                text: 'Users usage',
            },

            series: series,
            legend: {
                enabled: true
            },

        });
    }

    chartRenderHandle = Deps.autorun(function() {
        //The chart is already displayed. Time to update it with some data
        
        var user_daily_totals = UserDailyTotals.find({}, {sort: {date: 1}});
        
        //Build a dictionary of data usages based on the communities defined in the settings
        var data_usage = {}
        Meteor.settings.public.communities.forEach(function(entry) {
            data_usage[entry['community']] = [];
        });
        
        //Walk through the data usage over the past 30 days.  Build our data_usage dicationary with the 'y' value
        // on the chart being the data consumed for this category
        dates = [];
        user_daily_totals.forEach(function(total) {
            time = total.date.getTime();
            
            Meteor.settings.public.communities.forEach(function(entry) {
                entry = entry['community'];
                var to_push = [time]
                if(total.communities[entry] == undefined) {
                    to_push.push(0);
                } else {
                    to_push.push(total.communities[entry])
                }
                data_usage[entry].push(to_push)
            });
        });
        
        //Place the data dictionary elements we've collected and plot them on a chart
        var chart = $chart.highcharts();
        var i = 0;
        for(var entry in data_usage) {
            chart.series[i].update({
                data: data_usage[entry]
            })
            i += 1;
        }            
    });
}

Template.user_chart.destroyed = function() {
	if(chartRenderHandle)
		chartRenderHandle.stop()
}
