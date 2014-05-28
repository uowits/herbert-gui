Router.map( function() {
	this.route('report_years', {
		path: '/report-totals',
		waitOn: function() {
            return Meteor.subscribe('yearly_usage_totals');
        }
	})
});	

Template.report_years.totals = function() {
	return YearlyTotals.find({}, {sort: {date: -1}});
}

Template.report_years.year = function() {
    return moment(this.date).format("YYYY");
}

Template.report_years.category = function() {
    return this;
}