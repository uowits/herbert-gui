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

Template.report_user_month.local = function() {
    return this.communities['58698:100'];
}

Template.report_user_month.onnet = function() {
    return this.communities['58698:101'];
}

Template.report_user_month.offnet = function() {
    return this.communities['58698:102'];
}

Template.report_user_month.unknown = function() {
	return "UNKNOWN" in this.communities ? this.communities['UNKNOWN'] : 0;
}

Template.report_user_month.total = function() {
    var total = 0;
    for(var index in this.communities) {
        total += this.communities[index]
    }
    return total;
}
