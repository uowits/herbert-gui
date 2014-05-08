
Template.layout_navbar.events({
	'submit #user_form': function(e) {
        e.preventDefault();
        Router.go('/user/' + $(this.find("#username")).val());
	}
})

Template.layout.rendered = function() {

	$(function() {
	
	    $('#side-menu').metisMenu();
	
	});
	
	//Loads the correct sidebar on window load,
	//collapses the sidebar on window resize.
	$(function() {
	    $(window).bind("load resize", function() {
	        //console.log($(this).width())
	        if ($(this).width() < 768) {
	            $('div.sidebar-collapse').addClass('collapse')
	        } else {
	            $('div.sidebar-collapse').removeClass('collapse')
	        }
	    })
	})        

	
}