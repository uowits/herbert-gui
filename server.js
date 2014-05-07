Meteor.startup(function () {
	if(!("public" in Meteor)) {
		console.log("Meteor settings file has not been loaded")
	}
});

