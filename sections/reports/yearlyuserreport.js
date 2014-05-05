//CSV Export
Router.map( function() {
    this.route('yearlyUserTrafficReportExport', {
        where: 'server',
        path: '/download/report/user/yearly/:year',
        
        action: function() {
            //if(accessCheck(this)) return;
            var selectDate = moment(this.params.year + "-01-01T00Z").toDate();
            this.response.writeHead(200, 
                                    {
                                        'Content-Type': 'text/csv',
                                        'Content-Disposition': "attachment; filename=test.csv",
                                    });
            this.response.write("Username," + getTrafficTitles() + ",Total\n");
            var self =this;
            UserYearlyTotals.find({date: selectDate}, {sort: {'communities.58698:102': -1}}).forEach(function (row) {
                var to_add = row['username'] +"," + communityValues(row.communities, true).join() + "\n";
                self.response.write(to_add)
            });
            this.response.end();
        }
    })
})


Router.map( function() {

	this.route('yearlyUserTrafficReport', {
		path: '/report/user/yearly/:year',
		
		onBeforeAction: function() {
            var selectDate = moment(this.params.year + "-01-01T00Z").toDate();
            this.subscribe('yearly_user_report', selectDate).wait();
        },
		data: function() {
			return {
				'totals': UserYearlyTotals.find(),
                'year': this.params.year
			}
		}
	})
});	


if (Meteor.isClient) {
	
    Template.yearlyUserTrafficReport.local = function() {
        return readablizeBytes(this.communities['58698:100']);
    }


    Template.yearlyUserTrafficReport.onnet = function() {
        return readablizeBytes(this.communities['58698:101']);
    }


    Template.yearlyUserTrafficReport.offnet = function() {
        return readablizeBytes(this.communities['58698:102']);
    }


    Template.yearlyUserTrafficReport.unknown = function() {
        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
        return readablizeBytes(this.communities['UNKNOWN']);
    }


    Template.yearlyUserTrafficReport.total = function() {
        var total = 0;
        for(var index in this.communities) {
            total += this.communities[index]
        }
        return readablizeBytes(total);
    }
}

if (Meteor.isServer) {
    Meteor.publish("yearly_user_report", function(date) {
        if( accessCheck(this) ) return;
        return UserYearlyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
    });
}




