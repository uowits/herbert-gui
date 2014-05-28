UI.registerHelper('categoriesWithTotals', function(totals) {
    //Lists all the categories in the order they appear in the settings file in
    var to_return = [];
    Meteor.settings.public.communities.forEach(function(setting) {
        to_return.push(setting['description']);
    })   
    if(totals)
        to_return.push('Total');
    return to_return;
})

UI.registerHelper('communitySummary', function(communities, totals) {
    //Breaks down a summary of communities in a dictionary in the order they are defined in the settings file
    var to_return = [];
    var total = 0;
    Meteor.settings.public.communities.forEach(function(setting) {
        if(communities[setting['community']] == undefined )
            to_return.push("");
        else {
            total += communities[setting['community']];
            to_return.push(communities[setting['community']]);
        }
    })
    
    if(totals) {
        to_return.push(total);
    }
    
    return to_return;
});

UI.registerHelper('communitySummaryBytes', function() {
    return this;
});