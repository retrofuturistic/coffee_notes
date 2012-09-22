
// Creating the application namespace
var coffee_notes= {
    models: {},
    views: {},
    utils: {},
};

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }

    this.remove();
    this.unbind();
    
    console.log('View undelegateEvents');
    this.undelegateEvents();
};

// ----------------------------------------------- The Application Router ------------------------------------------ //

coffee_notes.Router = Backbone.Router.extend({

    routes:{
        "":"list",
        "browse":"list",		
        "add":"addCoffee",
        "coffee/:id/edit":"editCoffee",
        "coffee/:id":"coffeeDetails"

    },

    initialize:function () {
        this.firstPage = true;
    },

    list:function () {
        console.log("route: list ");
        var self = this;
        this.before(function () {
           console.log("made it through the before callback");
           self.changePage(new coffee_notes.views.coffeeListView({model:self.coffeeList}));
        });
    },
    
    addCoffee:function () {
        console.log('Router add');
        var self = this;
        var coffee = new coffee_notes.models.coffee();
                                        
        self.changePage(new coffee_notes.views.coffeeAddView({model:coffee}));
    
    },
	
    coffeeDetails:function (id) {
        console.log('Router details');
        var self = this;
		
        var coffee = self.coffeeList.get(id);
        self.changePage(new coffee_notes.StuffView({model:coffee}));
    },
	
    editCoffee:function (id) {
        console.log('Router edit details');
        var self = this;
		
        var coffee = self.coffeeList.get(id);
        self.changePage(new coffee_notes.coffeeEditView({model:coffee}));
    },

    before:function (callback) {
        console.log("getting the stuff list");
        
        if (!this.coffeeList) {
            console.log("making a new stuff list");
            this.coffeeList = new coffee_notes.models.coffeeCollection();
        }
        
        //getting the data so its up to date!
        this.coffeeList.fetch({success:function () {
            callback();
            }});
                                          
    },
    changePage:function (page) {
    	//In the jqm-config.js, we took over the routing and transitions of pages from jquery mobile
    	//using backbone instead. so this function plays the role of changing pages.
    	//the page passed has your basic html but does not have the data-role and data-theme attributes
    	//that are required jquery mobile to render the page.  
    	//So first we attach those attributes
        $(page.el).attr('data-role', 'page');
        $(page.el).attr('data-theme', 'b');
       	
       	//with the correct jquery mobile attributes set, we can render the page
       	page.render();
       	
       	//now we attach it to the body tag of the DOM
        $('body').append($(page.el));
        
        //Our default transition is slide
        var transition = 'slide';
        
        //However, we don't want to slide the first page. 
        //we want it to fade.
        if (this.firstPage) {
            transition = 'fade';
            this.firstPage = false;
        }
        
        //now we are ready to change the page
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});


// ----------------------------------------------- Bootstrap App ------------------------------------------ //

$(document).ready(function() {
	$.ajaxSetup({ cache: false });
    var self = this;
    console.log('open database');

	//creating stuffDB database using the persistence websql api
	if (window.openDatabase) {
		persistence.store.websql.config(persistence, 'coffeeDB', 'coffee database', 2 * 1024 * 1024);
	}
	else {
		persistence.store.memory.config(persistence);
	}
	
	persistence.reset();
	//the persistence.define function lets you define a schema for your table
	//it returns a constructor functions that allows you to access, insert, update and delete
	//record in this table	
	var coffeenotes = persistence.define('coffeenote', {
															name: "TEXT",
															description: "TEXT",
															preparation: "TEXT",
															rating: "TEXT",
															roaster: "TEXT",
															roast_date: "TEXT",
															bean_composition: "TEXT",
															country: "TEXT",
															region: "TEXT",
															farm: "TEXT",
															variety: "TEXT",
															process: "TEXT"
										});
		
	//Setting this to the coffee_notes.db so we can access it later	
	coffee_notes.db = coffeenotes;
	
	//this sync with the database the schema we just defined			
	persistence.schemaSync();		
   	console.log('database sync');
	
	//we use the template loader to load our template and
	//set a callback that starts our backbone router and history
	coffee_notes.templateLoader.load(['coffee-list', 'coffee-details', 'coffee-list-item', 'coffee-add', 'coffee-edit'], function () {
                            self.app = new coffee_notes.Router();
                            Backbone.history.start();
                    });
});   

// ----------------------------------------------- Backbone.sync override ------------------------------------------ //
// we are overriding the Backbone.sync function to create, read, update and delete our data via our local db.        //
// ---------------------------------------------------------------------- ------------------------------------------ //
Backbone.sync = function (method, model, options) {

	//making out DAO object by passing the stuff notes constructor create in window.startApp
	//this will give us access to all the major functions needed to CRUD
    var dao = new coffee_notes.DAO(coffee_notes.db);

    switch (method) {
        case "read":
            console.log("sync read")
           if (model.id) {
				console.log("reading a single mode using the passed id");
				dao.findById(model.id, function(data) {
					options.success(data);
				});
			} else {
         		console.log("fetching our list of stuff");
                dao.findAll(function (data) {
                    options.success(data);
                });
			}
			
            break;
        case "create":
            console.log("sync create");
            dao.create(model, function (data) {
                options.success(data);
            });
            break;
        case "update":
            console.log("sync update");
            dao.update(model, function (data) {
                options.success(data);
            });
            break;
        case "delete":
            console.log("sync delete");
             dao.delete(model, function () {
                options.success();
            });
           break;
    }
};
