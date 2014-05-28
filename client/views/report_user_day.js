Router.map( function() {
	this.route('report_user_day', {
		path: '/report/user/:year/:month/:day',
		waitOn: function() {
            return Meteor.subscribe('daily_user_report', this.params.year, this.params.month, this.params.day);
        },
		data: function() {
			return {
				'year': this.params.year,
				'month': this.params.month,
				'day': this.params.day,
			}
		}
	})
});

Template.report_user_day.date_pretty = function() {
	return moment.utc([this.year, this.month-1, this.day]).format("dddd, MMMM Do, YYYY")
}

Template.report_user_day.totals = function() {
	return UserDailyTotals.find();
}

Template.report_user_day.category = function() {
    return this;
}