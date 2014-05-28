
getTrafficTitles = function() {
    return Meteor.settings.public.communities.map( function(el) {return el.description} );
}

getTopSortedCommunity = function() {
    //Returns the Community that everything should be sorted by (ie. the top one on the list)
    return Meteor.settings.public.communities[0]['community'];
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
