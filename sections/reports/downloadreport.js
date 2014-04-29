if(Meteor.isClient) {
    Template.downloadReport.url = function() {
        return "/download" + Router.current().path;
    }
}

