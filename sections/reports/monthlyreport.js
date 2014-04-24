Router.map( function() {

	this.route('monthlytrafficreport', {
		path: '/report/monthly/:year',
		
		before: function() {
            this.subscribe('monthly_usage_totals', this.params.year).wait();
        },
		data: function() {
			return {
                'year': this.params.year,
				'totals': MonthlyTotals.find({}, {sort: {date: 1}}),
			}
		}
	})
});	

if (Meteor.isClient) {
	
	Template.monthlytrafficreport.shortdate = function() {
        return moment(this.date).format("MMMM");
	}
    Template.monthlytrafficreport.dateurl = function() {
        return moment(this.date).format("YYYY-MM");
    }

    Template.monthlytrafficreport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.monthlytrafficreport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.monthlytrafficreport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.monthlytrafficreport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.monthlytrafficreport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}


if (Meteor.isServer) {
    Meteor.publish("monthly_usage_totals", function(year) {
        var date_start = moment(year + "-01-01T00Z").toDate();
        var date_finish = moment(date_start).add('years', 1).toDate();
        return MonthlyTotals.find({ date: {$lt: date_finish, $gte: date_start}}, {sort: {date: 1}});
    });
}
