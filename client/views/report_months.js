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

Template.report_months.shortdate = function() {
    return moment(this.date).format("MMMM");
}

Template.report_months.dateurl = function() {
    return moment(this.date).format("YYYY-MM");
}

Template.report_months.local = function() {
    return this.communities['58698:100'];
}

Template.report_months.onnet = function() {
    return this.communities['58698:101'];
}

Template.report_months.offnet = function() {
    return this.communities['58698:102'];
}

Template.report_months.unknown = function() {
	return "UNKNOWN" in this.communities ? this.communities['UNKNOWN'] : 0;
}

Template.report_months.total = function() {
    var total = 0;
    for(var index in this.communities) {
        total += this.communities[index]
    }
    return total;
}
