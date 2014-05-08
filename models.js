DailyTotals = new Meteor.Collection('daily_totals')
MonthlyTotals = new Meteor.Collection('monthly_totals')
WeeklyTotals = new Meteor.Collection('weekly_totals')
YearlyTotals = new Meteor.Collection('yearly_totals')
UserDailyTotals = new Meteor.Collection('user_daily_totals')
UserWeeklyTotals = new Meteor.Collection('user_weekly_totals')
UserMonthlyTotals = new Meteor.Collection('user_monthly_totals')
UserYearlyTotals = new Meteor.Collection('user_yearly_totals')

DailyTotals.last30days = function() {
    var month = parseInt(moment().month());
    month += 1;
    todays_date_str = moment().year() + "-" + month + "-" + moment().date()
    
    todays_date = new Date(todays_date_str)
    start_date = moment(todays_date).subtract('month', 1).toDate()

    var to_return = DailyTotals.find( {date: {$gte: start_date}}, { sort: {date: 1} } ); 
    return to_return;
}

MonthlyTotals.yearlyTotals = function(year) {
	//The year passed in is just a normal integer
	if(typeof year === "undefined") {
			year = moment().year()
	}
	var start_date = new Date(year.toString())
	var end_date = moment(start_date).add('year', 1).toDate()

	return MonthlyTotals.find( {date: {$gte: start_date, $lt: end_date}} )
}

UserDailyTotals.last30days = function(username) {
    var month = parseInt(moment().month());
    month += 1;
    todays_date_str = moment().year() + "-" + month + "-" + moment().date()
    
    todays_date = new Date(todays_date_str)
    start_date = moment(todays_date).subtract('month', 1).toDate()

    var to_return = UserDailyTotals.find( {username: username, date: {$gte: start_date}}, { sort: {date: 1} } ); 
    return to_return;
}

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

UserMonthlyTotals.yearlyTotals = function(username, year) {
	//The year passed in is just a normal integer
	if(typeof year === "undefined") {
			year = moment().year()
	}
	var start_date = new Date(year.toString())
	var end_date = moment(start_date).add('year', 1).toDate()

	return UserMonthlyTotals.find( {username: username, date: {$gte: start_date, $lt: end_date}} )
}
