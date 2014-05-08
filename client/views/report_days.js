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
	
Template.report_days.smalldate = function() {
    return moment(this.date).format("ddd, MMM Do YYYY");
}

Template.report_days.dateurl = function() {
    return moment(this.date).format("YYYY-MM-DD");
}

Template.report_days.local = function() {
    return this.communities['58698:100'];
}

Template.report_days.onnet = function() {
    return this.communities['58698:101'];
}

Template.report_days.offnet = function() {
    return this.communities['58698:102'];
}

Template.report_days.unknown = function() {
	return "UNKNOWN" in this.communities ? this.communities['UNKNOWN'] : 0;
}

Template.report_days.total = function() {
    var total = 0;
    for(var index in this.communities) {
        total += this.communities[index]
    }
    return total;
}
