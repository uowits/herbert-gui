
UI.registerHelper('displayBytes', function(bytes) {
	if(!bytes)
		return "";
	
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(1) + " " + s[e];
})
