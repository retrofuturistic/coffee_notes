// -------------------------------------------------- The Models ---------------------------------------------------- //
// These are our models.  As you can see, they only contain the DAO.  No data is stored specifically here.  The DAO   //
// and in turn the database's schema describes our attributes.														  //
// ------------------------------------------------------------------------------------------------------------------ //
coffee_notes.models.coffee = Backbone.Model.extend({
    dao: coffee_notes.coffeeDAO,
     defaults: {
    	name: ""
     }
        
});

coffee_notes.models.coffeeCollection = Backbone.Collection.extend({
	model: coffee_notes.coffee,
    dao: coffee_notes.coffeeDAO
});


