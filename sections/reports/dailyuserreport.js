Router.map( function() {

	this.route('dailyUserTrafficReport', {
		path: '/report/user/daily/:date',
		
		before: function() {
            var selectDate = moment(this.params.date + "T00Z").toDate();
            this.subscribe('daily_user_report', selectDate).wait();
        },
		data: function() {
			return {
				'totals': UserDailyTotals.find(),
                'date': moment(this.params.date).format("MMMM Do YYYY")
			}
		}
	})
});	


if (Meteor.isClient) {
	
    Template.dailyUserTrafficReport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.dailyUserTrafficReport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.dailyUserTrafficReport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.dailyUserTrafficReport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.dailyUserTrafficReport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}


if (Meteor.isServer) {
    Meteor.publish("daily_user_report", function(date) {
        return UserDailyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
    });
}
