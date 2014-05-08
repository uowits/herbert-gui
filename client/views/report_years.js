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

Template.report_years.local = function() {
    return this.communities['58698:100'];
}

Template.report_years.onnet = function() {
    return this.communities['58698:101'];
}

Template.report_years.offnet = function() {
    return this.communities['58698:102'];
}

Template.report_years.unknown = function() {
	return "UNKNOWN" in this.communities ? this.communities['UNKNOWN'] : 0;
}

Template.report_years.total = function() {
    var total = 0;
    for(var index in this.communities) {
        total += this.communities[index]
    }
    return total;
}
