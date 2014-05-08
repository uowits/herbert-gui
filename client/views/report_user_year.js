
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

Template.report_user_year.local = function() {
    return this.communities['58698:100'];
}

Template.report_user_year.onnet = function() {
    return this.communities['58698:101'];
}

Template.report_user_year.offnet = function() {
    return this.communities['58698:102'];
}

Template.report_user_year.unknown = function() {
	return "UNKNOWN" in this.communities ? this.communities['UNKNOWN'] : 0;
}

Template.report_user_year.total = function() {
    var total = 0;
    for(var index in this.communities) {
        total += this.communities[index]
    }
    return total;
}
