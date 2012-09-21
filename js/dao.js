// -------------------------------------------------- The Data Access Object (DAO) ---------------------------------------------------- //
// This class functions as an access point to the database.  In the constructor, it accept a function returned from persistence.define  //
// which define a schema and how to access the table created from the schema.  In our case, it is stuff notes.  The Backbone.sync       //
// function that we override called the DAO object to create, read, update and delete record in the table associate with our            //
// Backbone.Models.                                                                                                                     //
// ------------------------------------------------------------------------------------------------------------------------------------ //

coffee_notes.DAO = function (db) {
    this.db = db;
};

_.extend(coffee_notes.DAO.prototype, {

	//Fetches all the record in our table and returns the results to the callback function
    findAll:function (callback) {
         console.log("made it to find all");

		var coffees = [];
		this.db.all().order("name", true).list(null, function(results){	
			var len = results.length;					
            for (var i = 0; i < len; i++) {
				coffees[i] = results[i];
			}
			callback(coffees);
			
		});	
    },
	
	//Gets a record based on the id, returns the results to the callback function
    findById: function(id, callback) {
    	console.log("getting a model information by the id passed");
		if (id != 0) 
		{
			this.db.load(id, callback(results));
		} else {
		  	alert("Transaction Error: " + error);
        }
    },
	
	//Creates a new record in the table based on the passed Model
    create:function (model, callback) {
		console.log("dao create model");
		
		var coffeeNotes = new this.db(model.toJSON());			
		persistence.add(coffeeNotes);
				
		persistence.flush();
		
		callback(model);
    },
	
	//Update a record in the table identified by the model's id
    update:function (model, callback) {
		console.log("dao update model");
		var id = model.id;
		this.db.load(id, function(results)
					{	
						results.name = model.get('name');
						results.description = model.get('description');
						persistence.add(results);
					});
									
		persistence.flush();
		
		callback(model);
    },
	
	//Removes a record from the table identified by the model's id
	delete:function (model, callback)
	{
		console.log("dao delete model");
		var id = model.id;
		this.db.load(id, function(results)
				{	
					persistence.remove(results);
					persistence.flush();
                });
		callback();

	}
	
    //  Populate table with sample data for testing/debugging purposes only
    //populate:function (callback) {
    //     callback();
         
    //}
         

});
