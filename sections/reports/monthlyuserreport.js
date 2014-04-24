//Router.map( function() {
//
//	this.route('monthlyUserTrafficReport', {
//		path: '/report/user/yearly/:date',
//		
//		before: function() {
//            var start_date = moment(this.params.year + "01T00Z").toDate();
//            this.subscribe('yearly_user_report', start_date).wait();
//        },
//		data: function() {
//			return {
//				'totals': UserYearlyTotals.find(),
//                'year': this.params.year
//			}
//		}
//	})
//});	
//
//
//if (Meteor.isClient) {
//	
//    Template.yearlyUserTrafficReport.local = function() {
//        return readablizeBytes(this.communities['58698:100']);
//    }
//
//
//    Template.yearlyUserTrafficReport.onnet = function() {
//        return readablizeBytes(this.communities['58698:101']);
//    }
//
//
//    Template.yearlyUserTrafficReport.offnet = function() {
//        return readablizeBytes(this.communities['58698:102']);
//    }
//
//
//    Template.yearlyUserTrafficReport.unknown = function() {
//        if (typeof this.communities['UNKNOWN'] == 'undefined') {return ""}
//        return readablizeBytes(this.communities['UNKNOWN']);
//    }
//
//
//    Template.yearlyUserTrafficReport.total = function() {
//        var total = 0;
//        for(var index in this.communities) {
//            total += this.communities[index]
//        }
//        return readablizeBytes(total);
//    }
//}
//
//
//if (Meteor.isServer) {
//    Meteor.publish("yearly_user_report", function(date) {
//        return UserYearlyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
//    });
//}
