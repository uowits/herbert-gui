UserMonthlyTotals = new Meteor.Collection('user_monthly_totals')

UserMonthlyTotals.yearlyTotals = function(username, year) {
		//The year passed in is just a normal integer
		if(typeof year === "undefined") {
				year = moment().year()
		}
		var start_date = new Date(year.toString())
		var end_date = moment(start_date).add('year', 1).toDate()

		return UserMonthlyTotals.find( {username: username, date: {$gte: start_date, $lt: end_date}} )
}
