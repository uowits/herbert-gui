UserWeeklyTotals = new Meteor.Collection('user_weekly_totals')

UserWeeklyTotals.findWeekForDate = function(date) {
    //Finds and returns a query for all the users weekly values for a given date.
    
    if(typeof date === 'undefined') {
        date = new Date()
    }

    week_start = moment(date).day(-7).zone(0).hour(0).minute(0).second(0).toDate()
    return UserWeeklyTotals.find( {date: week_start} );

}
