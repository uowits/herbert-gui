
getTrafficTitles = function() {
    return Meteor.settings.communities.map( function(el) {return el.description} );
}

communityValues = function(entry, return_totals) {
    return_totals = typeof return_totals !== 'undefined' ? return_totals : false;

    var to_return = [];
    var communities = Meteor.settings.communities.map( function(el) {return el.community} );
    var totals = 0;
    for(index = 0; index < communities.length; ++index) {
        var community = communities[index]
        if(community in entry) {
            to_return.push(entry[community]);
            totals += entry[community];
        } else {
            to_return.push(0);
        }
    }
    if(return_totals) {
        to_return.push(totals);
    }
    return to_return;
}
