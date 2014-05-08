var accessCheck = function(handle) {
    var user = Meteor.users.findOne({_id: handle.userId});
    if(!user || !(Meteor.settings.public.access.indexOf(user.profile.name) >= 0)) {
        handle.stop();
        return true;
    }
    return false;
}

/*
	Totals
*/

Meteor.publish("monthly_totals_for_year", function() {
    if( accessCheck(this) ) return;
    return MonthlyTotals.yearlyTotals(2014);
});

Meteor.publish("this_weeks_usage", function() {
    if( accessCheck(this) ) return;
    return WeeklyTotals.find({}, { sort: {date: -1}, limit: 1 })
});

Meteor.publish('30day_usage', function() {
    if( accessCheck(this) ) return;
    return DailyTotals.last30days();
});

Meteor.publish("yearly_usage_totals", function() {
    if( accessCheck(this) ) return;
    return YearlyTotals.find({}, {sort: {date: -1}});
});

Meteor.publish("monthly_usage_totals", function(year) {
    if( accessCheck(this) ) return;
	console.log("monthly_usage_totals: "+year);
    var date_start = moment(year + "-01-01T00Z");
    var date_end = date_start.add('years', 1)
    return MonthlyTotals.find({ date: {$lt: date_end.toDate(), $gte: date_start.toDate()}}, {sort: {date: 1}});
});

Meteor.publish("daily_usage_totals", function(year, month) {
    if( accessCheck(this) ) return;
	console.log("daily_usage_totals: "+year+"-"+month);
    var date_start = moment(year + "-" + month + "-01T00Z")
    var date_end = start_date.add('month', 1);
    var test = DailyTotals.find({ date: {$lt: date_end.toDate(), $gte: date_start.toDate()}}, {sort: {date: 1}});
    console.log("count: "+test.count())
    return test;
});

/*
	Per-user Totals
*/

Meteor.publish('weekly_top_users', function() {
    if( accessCheck(this) ) return;
    var week_start = moment().zone(0).day(0).hour(0).minute(0).second(0).millisecond(0).toDate();
    return UserWeeklyTotals.find( {'date': week_start}, {sort: {'communities.58698:102': -1}, limit: 20} )
})

Meteor.publish("user_monthly_totals_for_year", function(username) {
    if( accessCheck(this) ) return;
    return UserMonthlyTotals.yearlyTotals(username, 2014);
});

Meteor.publish("user_this_weeks_usage", function(username) {
    if( accessCheck(this) ) return;
    return UserWeeklyTotals.find({username: username}, { sort: {date: -1}, limit: 1 })
});

/*
Meteor.publish('user_weekly_top_users', function() {
    week_start = moment().zone(0).day(0).hour(0).minute(0).second(0).millisecond(0).toDate();
    return UserWeeklyTotals.find( {'date': week_start}, {sort: {'communities.58698:102': -1}, limit: 20} )
})
*/

Meteor.publish('user_30day_usage', function(username) {
    if( accessCheck(this) ) return;
    return UserDailyTotals.last30days(username);
});

Meteor.publish('user_all_daily_traffic', function(username) {
    if( accessCheck(this) ) return;
    return UserDailyTotals.find({username: username});
})

Meteor.publish("yearly_user_report", function(year) {
    if( accessCheck(this) ) return;
	console.log("yearly_user_report: "+year);
    var date = moment(year + "-01-01T00Z").toDate();
    return UserYearlyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
});

Meteor.publish("monthly_user_report", function(year, month) {
    if( accessCheck(this) ) return;
	console.log("monthly_user_report: "+year+"-"+month);
    var date = moment(year + "-" + month + "-01T00Z").toDate();
    return UserMonthlyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
});

Meteor.publish("daily_user_report", function(year, month, day) {
    if( accessCheck(this) ) return;
	console.log("daily_user_report: "+year+"-"+month+"-"+day);
    var date = moment(year + "-" + month + "-" + day + "T00Z").toDate();
    return UserDailyTotals.find({date: date}, {sort: {'communities.58698:102': -1}, limit: 100});
});

