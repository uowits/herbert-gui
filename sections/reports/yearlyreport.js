Router.map( function() {

	this.route('yearlytrafficreport', {
		path: '/report/',
		
		onBeforeAction: function() {
            this.subscribe('yearly_usage_totals').wait();
        },
		data: function() {
			return {
				'totals': YearlyTotals.find({}, {sort: {date: -1}}),
			}
		}
	})
});	

if (Meteor.isClient) {
	
	Template.yearlytrafficreport.year = function() {
        return moment(this.date).format("YYYY");
	}
    Template.yearlytrafficreport.dateurl = function() {
        return moment(this.date).format("YYYY-MM-DD");
    }

    Template.yearlytrafficreport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.yearlytrafficreport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.yearlytrafficreport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.yearlytrafficreport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.yearlytrafficreport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}


if (Meteor.isServer) {
    Meteor.publish("yearly_usage_totals", function() {
        if( accessCheck(this) ) return;
        return YearlyTotals.find({}, {sort: {date: -1}});
    });
}
