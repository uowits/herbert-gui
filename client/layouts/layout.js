
Template.layout.events({
	'submit form.user-search': function(event, template) {
        event.preventDefault();
        Router.go('user', {username: $(template.find("input")).val()});
	}
})

Template.layout.helpers({
  "active": function(name) {
    if(Router.current() && Router.current().route.name.split('_')[0] == name) {
      return "active";
    }
  }
});
