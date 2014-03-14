
if (Meteor.isClient) {
	
	Template.dailytrafficreport.date2 = function() {
		return this.date
	}
	
}


if (Meteor.isServer) {

	Meteor.publish("daily_usage_totals", function(count) {
		check(count, Number)
		return UserDailyTotals.find({}, {sort: {username:-1}, limit: count})
	})
	
	Meteor.startup(function() {
		//Code to run on startup
	})

	
}