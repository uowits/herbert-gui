//Daily totals table.  Keeps summary of data that was generated through that day



Router.configure({
	layoutTemplate: 'layout',
})

Router.map( function() {
	
//	this.route('dashboard', {
//		path: '/',		
//	})
	
	this.route('userreport', {
		path: '/report/users',
		
		waitOn: function() {
			Meteor.subscribe('daily_user_totals', 30);
			Template.dailytrafficreport.UserDailyTotals = function() {
				return UserDailyTotals.find()
			}

		},
		
		data: function() {
			return {
				'Totals': UserDailyTotals.find()
			}
		}
	})
	
	this.route('user', {
		path: '/user/:username',
		
		waitOn: function() {
			var params = this.params;
			Meteor.subscribe('user', params.username)
		}
	})
	
});
