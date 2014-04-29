if (Meteor.isClient) {
    Template.navbar.rendered = function() {
       $("#user_form").submit(function (e) {
            e.preventDefault();
            //alert("testing");
            Router.go('/user/' + $("#username").val());
        });
    }
}


