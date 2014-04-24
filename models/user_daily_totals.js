UserDailyTotals = new Meteor.Collection('user_daily_totals')

UserDailyTotals.last30days = function(username) {

    var month = parseInt(moment().month());
    month += 1;
    todays_date_str = moment().year() + "-" + month + "-" + moment().date()
    

    todays_date = new Date(todays_date_str)
    start_date = moment(todays_date).subtract('month', 1).toDate()

    var to_return = UserDailyTotals.find( {username: username, date: {$gte: start_date}}, { sort: {date: 1} } ); 
    return to_return;


}
