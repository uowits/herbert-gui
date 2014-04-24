UserWeeklyTotals = new Meteor.Collection('user_weekly_totals')

UserWeeklyTotals.findWeekForDate = function(date, username) {
    //Finds and returns a query for all the users weekly values for a given date.
    
    if(typeof date === 'undefined') {
        date = new Date()
    }

    var searchDict = {date: week_start}

    if(typeof username !== 'undefined') {
        searchDict['username'] = username
    }

    week_start = moment(date).day(-7).zone(0).hour(0).minute(0).second(0).toDate()
    return UserWeeklyTotals.find( searchDict );

}
