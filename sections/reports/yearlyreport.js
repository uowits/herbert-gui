Router.map( function() {

	this.route('yearlytrafficreport', {
        //Yearly traffic report
		path: '/report/',
		
		before: function() {
            this.subscribe('yearly_totals').wait();
        },
		data: function() {
            //Perform an aggregate for year to date by adding up all the months
            console.log("Doing stuff");

            var yearly_totals = {};
            var monthly_totals = MonthlyTotals.find();
            monthly_totals.forEach(function(monthly_total) {
                var year = moment(monthly_total.date).year()
                console.log(year)
//                if (!(year in yearly_totals)) {
//                    yearly_totals[year] = {};
//                }
//
//                for(community in monthly_total.communities) {
//                    if (!(community in monthly_comm_totals)) {
//                        yearly_totals[year][community] = 0;
//                    }
//                    yearly_totals[year][community] += monthly_total.communities[community]
//                }
            });
//
//
//			return {
//				'totals': yearly_totals
//			}
		}
	})
});	


//
//
//if (Meteor.isClient) {
//	
//	Template.dailytrafficreport.smalldate = function() {
//        return moment(this.date).format("ddd, MMM Do YYYY");
//	}
//    Template.dailytrafficreport.dateurl = function() {
//        return moment(this.date).format("YYYY-MM-DD");
//    }
//
//    Template.dailytrafficreport.local = function() {
//        return readablizeBytes(this.communities['58698:100']);
//    }
//
//
//    Template.dailytrafficreport.onnet = function() {
//        return readablizeBytes(this.communities['58698:101']);
//    }
//
//
//    Template.dailytrafficreport.offnet = function() {
//        return readablizeBytes(this.communities['58698:102']);
//    }
//
//
//    Template.dailytrafficreport.unknown = function() {
//        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
//        return readablizeBytes(this.communities['UNKNOWN']);
//    }
//
//
//    Template.dailytrafficreport.total = function() {
//        var total = 0;
//        for(var index in this.communities) {
//            total += this.communities[index]
//        }
//        return readablizeBytes(total);
//    }
//}
//
//

if (Meteor.isServer) {
    Meteor.publish("yearly_totals", function() {
        return MonthlyTotals.find({}, {sort: {date: -1}});
    });
}

