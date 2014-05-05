Router.onBeforeAction( function (pause) {

  if (_.include(['login'], this.route.name) || this.where == 'server'){
    return;
  }
  console.log(this.route)

  if (!Meteor.userId() || (Meteor.user() && !(Meteor.settings.public.access.indexOf(Meteor.user().profile.name) >= 0))) {
    this.render('login');
    pause();
  }
});

UI.registerHelper('userGood', function() {
    if(!Meteor.userId()) {
        return false;
    }
    if(Meteor.user() && Meteor.settings.public.access.indexOf(Meteor.user().profile.name) >= 0) {
        return true;
    }
    return false;
})


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
