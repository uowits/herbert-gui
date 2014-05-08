Router.onBeforeAction( function (pause) {
  if (_.include(['login'], this.route.name) || this.where == 'server'){
    return;
  }

  if (!Meteor.userId() || (Meteor.user() && !("settings" in Meteor && Meteor.settings.public.access.indexOf(Meteor.user().profile.name) >= 0))) {
    this.render('login');
    pause();
  }
});

Router.configure({
	layoutTemplate: 'layout',
})
