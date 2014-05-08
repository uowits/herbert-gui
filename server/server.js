Meteor.startup(function () {
	if(!("public" in Meteor.settings)) {
		console.log("WARNING: Meteor settings file has not been loaded")
	}
});
