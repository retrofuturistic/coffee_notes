// -------------------------------------------------- The Views ---------------------------------------------------- //
// There are several views but they are all quite simple.  There is a view that lists all our stuff and a "subview"  //
// that lists the individual model and a summary.  We also have a view to show all the attributes of a model.        //
// There are also views to add a model as well as edit a model.                                                      //
// ----------------------------------------------------------------------------------------------------------------- //

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }

    this.remove();
    this.unbind();
    
    console.log('View undelegateEvents');
    this.undelegateEvents();
};

Backbone.View.prototype.pageInitHandler = function () {
    console.log('View page init handled');
};


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
    	"change #provenance" 	: "change_provenance",
        "change"        : "change",
        "click .save"   : "save",
        "click .roastname"   : "select_roaster",
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
	
    change_roaster: function (event) {
       	console.log("view change roaster");
	   	var text = $("#add_roaster").val();
	   
	   	var len = coffee_notes.roastersList.length;
	   	var ListView = $("#roaster_autocomplete");
	   	ListView.empty();
		
		if(text == "")
			return;
	
		for(var i=0;i<len;i++)
		{
			var roaster = coffee_notes.roastersList[i];
			var found = roaster.search(new RegExp(text,"i"));
    		if(found > -1){
				
				ListView.append('<li class="roastname">'+coffee_notes.roastersList[i]+'</li>').listview('refresh');
			}
		}
    },
	
	select_roaster:function(event) {
		console.log("select roaster from autocomplete list");
		var target = event.target;
		$('#add_roaster').val(target.innerHTML);
		
	   	var ListView = $("#roaster_autocomplete");
	   	ListView.empty();
		
	},
	
	pageInitHandler: function()
	{
		console.log("page init handler for coffeeAddView");
		var self = this;
		 $("#add_roaster").on("input", function(e) {
			 self.change_roaster(e);
		 });
	},
		

    change_provenance: function (event) {
        // Remove any existing alert message
       	console.log("provenance change event");

		//let's grab the add_provenance value and specify_origin selector
		var provenanceVal = $('#provenance').val();
		var originInfo = $('.specify_origin');
		
		//by default, we hide it	
		originInfo.hide();
		
		//however if the provenance_val is single origin, 
		//show the country, region, farm and variety info
		if (provenanceVal == "Single Origin") {
			originInfo.show();
		}
		
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
    	
		$(this.el).html(this.template(this.model.toJSON()))		
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
	
	afterRender: function()
	{
			var originInfo = $('#origin_details');
			if (this.model.get("bean_composition") == "Single Origin") {
				originInfo.show();
			}

	},
	pageInitHandler: function()
	{
		console.log("page init handler in Coffee Details View");
		var provenance = $("#provenance");
		
		if(provenance)
		{
			var bean_composition = provenance.html();
			var originInfo = $(".origin_details");
			originInfo.hide();
			if(bean_composition == "Single Origin") 
			{
				originInfo.show();
			}
			
		}
		
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
    	"change #provenance" 	: "change_provenance",
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
	
    change_provenance: function (event) {
        // Remove any existing alert message
       	console.log("provenance change event");

		//let's grab the add_provenance value and specify_origin selector
		var provenanceVal = $('#provenance').val();
		var originInfo = $('.specify_origin');
		
		//by default, we hide it	
		originInfo.hide();
		
		//however if the provenance_val is single origin, 
		//show the country, region, farm and variety info
		if (provenanceVal == "Single Origin") {
			originInfo.show();
		}
		
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
