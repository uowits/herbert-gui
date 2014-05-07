if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to dummy.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (!("settings" in Meteor)) {
    console.log("Could not find Settings.  You should probably look into this.");
}
