
Router.map(function() {
	this.route('report_user_year', {
		path: '/report/user/:year',
		waitOn: function() {
            return Meteor.subscribe('yearly_user_report', this.params.year);
        },
		data: function() {
			return {
                'year': this.params.year
			}
		}
	})
});

Template.report_user_year.totals = function() {
	return UserYearlyTotals.find()
}

Template.report_user_year.category = function() {
    return this;
}