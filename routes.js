/*
	Server side routes for data export/download etc.
*/

Router.map(function() {

	// CSV export of yearly user traffic report
    this.route('yearlyUserTrafficReportExport', {
        where: 'server',
        path: '/download/report/user/yearly/:year',
        
        action: function() {
            //if(accessCheck(this)) return;
            var selectDate = moment(this.params.year + "-01-01T00Z").toDate();
            this.response.writeHead(200, 
                                    {
                                        'Content-Type': 'text/csv',
                                        'Content-Disposition': "attachment; filename=test.csv",
                                    });
            this.response.write("Username," + getTrafficTitles() + ",Total\n");
            var self =this;
            UserYearlyTotals.find({date: selectDate}, {sort: {'communities.58698:102': -1}}).forEach(function (row) {
                var to_add = row['username'] +"," + communityValues(row.communities, true).join() + "\n";
                self.response.write(to_add)
            });
            this.response.end();
        }
    });
});