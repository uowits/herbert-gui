DailyTotals = new Meteor.Collection('daily_totals')

DailyTotals.last30days = function() {

    var month = parseInt(moment().month());
    month += 1;
    todays_date_str = moment().year() + "-" + month + "-" + moment().date()
    

    todays_date = new Date(todays_date_str)
    start_date = moment(todays_date).subtract('month', 1).toDate()

    var to_return = DailyTotals.find( {date: {$gte: start_date}}, { sort: {date: 1} } ); 
    return to_return;


}
