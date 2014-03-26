Router.map( function() {

	this.route('dailytrafficreport', {
		path: '/report/daily/',
		
		before: function() {
            this.subscribe('daily_usage_totals').wait();
        },
		data: function() {
			return {
				'totals': DailyTotals.find(),
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
    Meteor.publish("daily_usage_totals", function() {
        return DailyTotals.find({}, {sort: {date: -1}});
    });
}
