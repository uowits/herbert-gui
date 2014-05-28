Router.map( function() {
	this.route('report_days', {
		path: '/report-totals/:year/:month',
		waitOn: function() {
			return Meteor.subscribe('daily_usage_totals', this.params.year, this.params.month)
        },
		data: function() {
			return {
                'year': this.params.year,
                'month': this.params.month,
			}
		}
	})
});

Template.report_days.totals = function() {
	return DailyTotals.find({}, {sort: {date: 1}});
}
	
Template.report_days.date = function() {
    return moment(this.date).format("ddd, MMM Do YYYY");
}

Template.report_days.date_pretty = function() {
	return moment(this.date).format("MMM, YYYY");
}

Template.report_days.day = function() {
	return moment(this.date).format("DD");
}

Template.report_days.month = function() {
	return moment(this.date).format("MM");
}

Template.report_days.year = function() {
	return moment(this.date).format("YYYY");
}

Template.report_days.category = function() {
    return this;
}

