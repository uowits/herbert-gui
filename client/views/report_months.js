Router.map( function() {
	this.route('report_months', {
		path: '/report-totals/:year',
		waitOn: function() {
			return Meteor.subscribe('monthly_usage_totals', this.params.year);
        },
		data: function() {
			return {
                'year': this.params.year
			}
		}
	})
});	

Template.report_months.totals = function() {
	return MonthlyTotals.find({}, {sort: {date: 1}});
}

Template.report_months.date = function() {
    return moment(this.date).format("MMMM");
}

Template.report_months.month = function() {
	return moment(this.date).format("MM");
}

Template.report_months.year = function() {
	return moment(this.date).format("YYYY");
}

Template.report_months.category = function() {
    return this;
}