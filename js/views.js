// -------------------------------------------------- The Views ---------------------------------------------------- //
// There are several views but they are all quite simple.  There is a view that lists all our stuff and a "subview"  //
// that lists the individual model and a summary.  We also have a view to show all the attributes of a model.        //
// There are also views to add a model as well as edit a model.                                                      //
// ----------------------------------------------------------------------------------------------------------------- //


coffee_notes.views.coffeeAddView = Backbone.View.extend({
	
	renderedOnce: false,
                                            
    initialize: function() {
			var tpl = coffee_notes.templateLoader;
			this.template = _.template(tpl.get('coffee-add'));
			this.model.bind("change", this.render, this);
    },
                                            
    render: function(eventName) {
			console.log('AddView render');
			if(this.renderedOnce == false) {
				$(this.el).html(this.template(this.model.toJSON()));
				this.renderedOnce=true;
			}
			return this;
    },  
	
    events: {
        "change"        : "change",
        "click .save"   : "save",
    },

    change: function (event) {
        // Remove any existing alert message
       console.log("view change event");

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
	
    save: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
				console.log("view called model save");
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    }	                                          
});

coffee_notes.views.coffeeListView = Backbone.View.extend({

    initialize: function() {
        var tpl = coffee_notes.templateLoader;
        this.template = _.template(tpl.get('coffee-list'));
        this.model.bind("reset", this.render, this);
    },

    render: function(eventName) {
    
    	//to render this page, we only have the html for the outer shell formatting
    	//like the header and the ul. To render each individual model in the collection
    	//we iterate through the collection and create a new StuffListItemView that will
    	//render the name and description of each model
        console.log('list render');
        $(this.el).html(this.template());
        var ul = $('ul', $(this.el));
        console.log(ul);
		_.each(this.model.models, function(coffee) {
           ul.append(new coffee_notes.views.coffeeListItemView({model: coffee}).render().el);
		}, this);
		return this;
    }
});

coffee_notes.views.coffeeListItemView = Backbone.View.extend({

	tagName: "li",

    initialize: function() {
        var tpl = coffee_notes.templateLoader;
        this.template = _.template(tpl.get('coffee-list-item'));
		this.model.bind("destroy", this.close, this);
    },

    render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    }

});

coffee_notes.views.coffeeView = Backbone.View.extend({

    initialize: function() {
        var tpl = coffee_notes.templateLoader;
        this.template = _.template(tpl.get('coffee-details'));
		this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
        console.log('render');
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    },

    events: {
        "click .delete"   : "delete"
    },

    delete: function () {
        var self = this;
        this.model.destroy({
            success: function () {
                alert('coffee deleted successfully');
                window.history.back();
            }
        });
        return false;
    }	                                          


});


coffee_notes.views.coffeeEditView = Backbone.View.extend({
	renderedOnce: false,

    initialize: function() {
        var tpl = coffee_notes.templateLoader;
        this.template = _.template(tpl.get('coffee-edit'));
		this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
        console.log('render');
			if(this.renderedOnce == false) {
				$(this.el).html(this.template(this.model.toJSON()));
				this.renderedOnce=true;
			}
			return this;
    },

    events: {
        "change"        : "change",
        "click .commit"   : "commit"
    },

    change: function (event) {
        // Remove any existing alert message
       console.log("view change event");

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
	
    commit: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
				console.log("view called model save");
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });

    }	                                          


});
