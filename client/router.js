Router.onBeforeAction( function (pause) {
  // Server side routes skip all security checks for now
  if (_.include(['login'], this.route.name) || this.where == 'server'){
    return;
  }

  if (!Meteor.userId() ||
  		(Meteor.user() &&
  			!("public" in Meteor.settings &&
  				Meteor.settings.public.access.indexOf(Meteor.user().profile.name) >= 0))) {
    this.layout("layout_noaccess")
    pause();
  } else {
	this.layout("layout")
  }
});

Router.configure({
	layoutTemplate: 'layout',
})
