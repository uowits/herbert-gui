Router.map( function() {

	this.route('dailytrafficreport', {
		path: '/report/daily/:month',
	
		onBeforeAction: function() {
            var start_date = moment(this.params.month + "-01T00Z").toDate();
            this.subscribe('daily_usage_totals', start_date).wait();
        },
		data: function() {
            var str_date = moment(this.params.month + "-01T00Z").format('MMMM, YYYY');
			return {
                'period': str_date,
				'totals': DailyTotals.find({}, {sort: {date: 1}}),
			}
		}
	})
});	




if (Meteor.isClient) {
	
	Template.dailytrafficreport.smalldate = function() {
        return moment(this.date).format("ddd, MMM Do YYYY");
	}
    Template.dailytrafficreport.dateurl = function() {
        return moment(this.date).format("YYYY-MM-DD");
    }

    Template.dailytrafficreport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.dailytrafficreport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.dailytrafficreport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.dailytrafficreport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.dailytrafficreport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}


if (Meteor.isServer) {
    Meteor.publish("daily_usage_totals", function(start_date) {
        end_date = moment(start_date).add('month', 1).toDate();
        return DailyTotals.find({ date: {$lt: end_date, $gte: start_date} }, {sort: {date: 1}});
    });
}
