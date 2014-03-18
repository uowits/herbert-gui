MonthlyTotals = new Meteor.Collection('monthly_totals')

MonthlyTotals.yearlyTotals = function() {
		//The year passed in is just a normal integer
		if(typeof year === "undefined") {
				year = moment().year()
		}
		var start_date = new Date(year.toString())
		var end_date = moment(start_date).add('year', 1).toDate()

		console.log("Start Date: " + start_date);

		return MonthlyTotals.find( {date: {$gte: start_date, $lt: end_date}} )

		return MonthlyTotals;
}
