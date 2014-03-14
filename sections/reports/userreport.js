function bytesToSize(bytes) {
  var sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) { return (bytes / Math.pow(1024, i)) + ' ' + sizes[i]; }
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

if (Meteor.isClient) {
	
	Template.userreport.localTraffic = function() {
		if('58698:100' in this.communities) {
			return bytesToSize(this.communities['58698:100']);
		}
		return "0"
	}
	
	Template.userreport.Onnet = function() {
		if('58698:101' in this.communities) {
			return bytesToSize(this.communities['58698:101']);
		}
		return 0
	}

	Template.userreport.Offnet = function() {
		if('58698:102' in this.communities) {
			return bytesToSize(this.communities['58698:102']);
		}
		return 0
	}
	
	Template.userreport.TotalTraffic = function() {
		totalTraffic = 0;

		for(community in this.communities) {
			totalTraffic += this.communities[community]
		}
		
		return bytesToSize(totalTraffic);
	}
	
	
	
	
}


if (Meteor.isServer) {

	Meteor.publish("daily_user_totals", function(count) {
		check(count, Number)
		return UserDailyTotals.find({}, {sort: {username:-1}, limit: count})
	})
	
	Meteor.startup(function() {
		//Code to run on startup
	})

	
}