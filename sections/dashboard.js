//Dashboard.js


Router.map(function() {
    this.route('dashboard', {
        path: '/',

        before: function() {
            this.subscribe('monthly_totals_for_year').wait();
            this.subscribe('this_weeks_usage').wait();
        },

        data: function() {
            var monthly_totals = MonthlyTotals.find();
            if (WeeklyTotals.find().count() > 0)
                var weekly_usage = WeeklyTotals.findOne().communities;
            else
                var weekly_usage = []
            //debugger;
            var to_return = {}
            monthly_totals.forEach(function(monthly_total) {
                for(community in monthly_total.communities) {
                    if (!(community in to_return)) {
                        to_return[community] = 0;
                    }
                    to_return[community] += monthly_total.communities[community]
                }
            });
            //for(monthly_total in monthly_totals) {
            //}
            var data ={
                yearlyTotal: _.map(to_return, function(val,key){return {community: key, bytes: val}}),
                weeklyTotal: _.map(weekly_usage, function(val,key){return {community: key, bytes: val}}),
                 
            }
            return data;
        }	
    })
})



if (Meteor.isServer) {
    Meteor.publish("monthly_totals_for_year", function() {
        return MonthlyTotals.yearlyTotals(2014);
    });

    Meteor.publish("this_weeks_usage", function() {
        return WeeklyTotals.find({}, { sort: {date: -1}, limit: 1 })
    });
}

if (Meteor.isClient) {

    //Some helpers for formatting the values
    Template.totalValues.community = function() {
        //debugger;
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
    Template.totalValues.traffic = function() {
        return readablizeBytes(this.bytes)
    }

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
