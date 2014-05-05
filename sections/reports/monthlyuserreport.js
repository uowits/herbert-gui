Router.map( function() {

	this.route('monthlyUserTrafficReport', {
		path: '/report/user/monthly/:date',
		
		onBeforeAction: function() {
            var start_date = moment(this.params.date + "-01T00Z").toDate();
            this.subscribe('monthly_user_report', start_date).wait();
        },
		data: function() {
            var date_formated = moment(this.params.date + "-01T00Z").format('MMMM, YYYY');
			return {
				'totals': UserMonthlyTotals.find(),
                'shortdate': date_formated
			}
		}
	})
});	


if (Meteor.isClient) {
	
    Template.monthlyUserTrafficReport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.monthlyUserTrafficReport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.monthlyUserTrafficReport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.monthlyUserTrafficReport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.monthlyUserTrafficReport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}


if (Meteor.isServer) {
    Meteor.publish("monthly_user_report", function(date) {
        if( accessCheck(this) ) return;
        return UserMonthlyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
    });
}
