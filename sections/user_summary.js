//user_summary.js


Router.map(function() {
    this.route('user_summary', {
        path: '/user/:username',

        onBeforeAction: function() {
            var username = this.params.username;
            this.subscribe('user_monthly_totals_for_year', username).wait();
            this.subscribe('user_this_weeks_usage', username).wait();
            this.subscribe('user_30day_usage', username).wait();
            this.subscribe('user_all_daily_traffic', username).wait();
        },

        data: function() {
            //            debugger;
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


if (Meteor.isServer) {

    Meteor.publish("user_monthly_totals_for_year", function(username) {
        if( accessCheck(this) ) return;
        return UserMonthlyTotals.yearlyTotals(username, 2014);
    });

    Meteor.publish("user_this_weeks_usage", function(username) {
        if( accessCheck(this) ) return;
        return UserWeeklyTotals.find({username: username}, { sort: {date: -1}, limit: 1 })
    });

    Meteor.publish('user_30day_usage', function(username) {
        if( accessCheck(this) ) return;
        return UserDailyTotals.last30days(username);
    });

    Meteor.publish('user_all_daily_traffic', function(username) {
        if( accessCheck(this) ) return;
        return UserDailyTotals.find({username: username});
    })
//
//    Meteor.publish('user_weekly_top_users', function() {
//        week_start = moment().zone(0).day(0).hour(0).minute(0).second(0).millisecond(0).toDate();
//        return UserWeeklyTotals.find( {'date': week_start}, {sort: {'communities.58698:102': -1}, limit: 20} )
//    })

}

if (Meteor.isClient) {
    Template.user_traffic_graph.rendered = function() {

        data = []


        if(! $('#user_traffic_graph').highcharts()) {

            //The chart does not yet exist.  We need to create it
            $('#user_traffic_graph').highcharts('StockChart', {
                rangeSelector : {
                    selected: 1
                },
                tooltip: {
                    valueDecimals: 2,
                    formatter: function() {
                        date_str = moment(this.points[0].x).format('dddd MMMM Do YYYY');
                        to_return = "<strong><h4>" + date_str + "</h4></strong><br />";
                        this.points.forEach(function(entry) {
                            to_return += entry.series.name + ": " + readablizeBytes(entry.y) + "<br />";
                        });
                        return to_return;

                        to_return += this.point.day + "<br />"
                        to_return += this.x + "<br />"
                        to_return += readablizeBytes(this.y) + "<br />";
                        return to_return;
                    }
                },
                title: {
                    text: 'Users usage',
                },

                series: [{
                    name: 'On-Net',
                    type: 'column',

                    data: [
                    ],
                    tooltip: {
                        valueDecimals: 2
                    },
                }, {
                    name: 'Off-Net',
                    type: 'column',

                    data: [
                    ],
                }],
                legend: {
                    enabled: true
                },

            });
        }

        Deps.autorun(function() {
            //The chart is already displayed. Time to update it with some data
            on_net = [];
            off_net = [];
                UserDailyTotals.find({}, {sort: {date: 1}}).forEach(function(total) {
                time = total.date.getTime(); 
                on_net.push(
                    [time, total.communities['58698:101']]
                );
                off_net.push(
                    [time, total.communities['58698:102']]
                );
            });

            var chart = $('#user_traffic_graph').highcharts();

            chart.series[0].update({
                data: on_net,
            });
            chart.series[1].update({
                data: off_net
            });
        });
    }
}

//
//
//
//if (Meteor.isClient) {
//    //Some helpers for formatting the values
//    Template.totalValues.community = function() {
//        //debugger;
//        switch(this.community) {
//            case "58698:100":
//                return "Local";
//            case "58698:101":
//                return "ON-NET"
//            case "58698:102":
//                return "OFF-NET"
//        }
//        return this.community
//    }
//    Template.totalValues.traffic = function() {
////        return this.bytes;
//        return readablizeBytes(this.bytes)
//    }
//    Template.weeklyTopUser.OffNetUsage = function() {
//        return readablizeBytes(this.communities['58698:102']);
//    }
//
//    //Attach the rendering of the 30 day chart
//    Template.dashboard_30days.rendered = function() {
//        if(! $('#dailytraffic').highcharts() ) {
//            $('#dailytraffic').highcharts({
//                chart: {
//                    type: 'area'
//                },
//                title: {
//                    text: '30 day traffic consumption'
//                },
//                xAxis: {
//                    labels: {
//                        formatter: function() {
//                            return this.value; //Returns the data consumed for this day
//                        },
//                        rotation: -45,
//                        align: 'right',
//                        step: 2,
//                        style: {
//                            fontSize: '13px',
//                            fontFamily: 'Verdana, sans-serif'
//                        }
//                    }
//                },
//                yAxis: {
//                    title: {
//                        text: 'Data Consumed'
//                    },
//               },
//                series: [{
//                    name: 'On-Net',
//                    data: []
//                }, {
//                    name: 'Off-Net',
//                    data: []
//                }],
//                tooltip: {
//                    formatter: function() {
//                        to_return = "<strong><h4>" + this.series.name + "</h4></strong><br />"
//                        to_return += this.point.day + "<br />"
//                        to_return += this.x + "<br />"
//                        to_return += readablizeBytes(this.y) + "<br />";
//                        return to_return;
//                    }
//                },
//                credits: {
//                    enabled: false,
//                }
//            });
//        }
//        //The chart is already displayed. Time to update it with some data
//        on_net = [];
//        off_net = [];
//        categories = []
//
//        this.data.months_daily_totals.forEach(function(total) {
//            categories.push(moment(total.date).format("MMM Do YYYY"));
//            var day_of_week = moment(total.date).format('dddd');
//            on_net.push( {
//                'y':  total.communities['58698:101'],
//                day: day_of_week,
//                
//            });
//            off_net.push( {
//                'y':  total.communities['58698:102'],
//                day: day_of_week,
//            })
//
//        })
//
//        var chart = $('#dailytraffic').highcharts();
//
//        chart.xAxis[0].setCategories(categories);
//        chart.series[0].update({
//            data: on_net,
//        });
//        chart.series[1].update({
//            data: off_net
//        });
//
//   }
//}
//
