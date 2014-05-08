UI.registerHelper('userGood', function() {
    if(!Meteor.userId()) {
        return false;
    }
    if(Meteor.user() && Meteor.settings.public.access.indexOf(Meteor.user().profile.name) >= 0) {
        return true;
    }
    return false;
})

UI.registerHelper('bytes', function(bytes) {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
})
