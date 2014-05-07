Meteor.startup(function () {
	if(!("settings" in Meteor)) {
		console.log("Meteor settings file has not been loaded")
	}
});

