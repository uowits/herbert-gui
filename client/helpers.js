humanBytes = function(bytes) {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(1) + " " + s[e];
} 


UI.registerHelper('displayBytes', function(bytes) {
	if(!bytes)
		return "";

	return humanBytes(bytes);
})


UI.registerHelper('displayMostImportantBytes', function(communities) {
    
    return humanBytes(communities[Meteor.settings.public.communities[0]['community']])
    
});
