Router.map( function() {
	this.route('report_user_month', {
		path: '/report/user/:year/:month',
		waitOn: function() {
            return Meteor.subscribe('monthly_user_report', this.params.year, this.params.month);
        },
		data: function() {
			return {
				'year': this.params.year,
				'month': this.params.month
			}
		}
	})
});

Template.report_user_month.date_pretty = function() {
    return moment.utc([this.year, this.month-1]).format('MMMM, YYYY');
}

Template.report_user_month.totals = function() {
	return UserMonthlyTotals.find()
}

Template.report_user_month.category = function() {
    return this;
}