// -------------------------------------------------- The Data Access Object (DAO) ---------------------------------------------------- //
// This class functions as an access point to the database.  In the constructor, it accept a function returned from persistence.define  //
// which define a schema and how to access the table created from the schema.  In our case, it is stuff notes.  The Backbone.sync       //
// function that we override called the DAO object to create, read, update and delete record in the table associate with our            //
// Backbone.Models.                                                                                                                     //
// ------------------------------------------------------------------------------------------------------------------------------------ //

coffee_notes.coffeeDAO = function (db) {
    this.db = db;
};

_.extend(coffee_notes.coffeeDAO.prototype, {

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

	},
    //  Populate table with sample data for testing/debugging purposes only
    populate:function (callback) {

		var cNotes = new this.db({
							name: "Hair Bender",
							description: "Coffees from every major producing region provide the individual components of this complex sweet and savory blend which yields flavors of milk chocolate, caramel, jasmine, meyer lemon, apricot and pineapple.",
							preparation: "French Press",
							rating: "4",
							roaster: "Stumptown Coffee Roaster",
							roast_date: "2012-08-15",
							bean_composition: "Blended"
						});
										
		persistence.add(cNotes);

		cNotes = new this.db({
						name: "Holler Mountain Blend",
						description: "Holler Mountain is a syrupy, heavy bodied coffee with dark toned notes of blackberry, hazelnut and toffee.",
						preparation: "Cold Brewed",
						rating: "3",
						roaster: "Stumptown Coffee Roaster",
						roast_date: "2012-03-24",
						bean_composition: "Blended"
		});
					
		persistence.add(cNotes);
		
		cNotes = new this.db({
						name: "Bella Donovan",
						description: "The Bella is the wool sweater of our blends - warm, comforting, familiar. Wild and citrusy organic African paired with earthy organic Indonesian makes for a vivid and fairly complex Moka/Java blend. It seems to weather the rigors of the automatic drip machine as well. This is, perhaps, why it's our most popular blend. It is also on the darker side: nice and thick without being inelegant. Bella stands up to milk or cream well, and is easily enjoyed black.",
						preparation: "Drip",
						rating: "4",
						roaster: "Blue Bottle Coffee",
						roast_date: "2012-09-17",
						bean_composition: "Blended",
						process: "dry"
		});


		persistence.add(cNotes);
		
		cNotes = new this.db({
						name: "Three Africas",
						description: "This coffee is generally a blend of Ugandan and two different Ethiopian coffees which produce a big, chocolaty aroma, and excels in either the French press or the Moka pot. Unlike some of our fancy shmancy single origins, which tend to be nichey and polarizing, this blend has a very easy-to-like personality, good body, unthreatening complexity, and reasonably clean aftertaste. The Ethiopians – a Yirgacheffe and dry processed Sidamo – leave subtle imprints of dried blueberries and cardamom, and clean up the slightly raisin aftertaste of the PNG, which we are currently using in place of the Uganda. And, though the PNG is from New Guinea, it maintains our flavor profile and we do not discriminate- or want to change the name to Two Africans, or purchase another stamp. A fairly dark roast, this inclusive blend will take milk or cream quite well. Some say damn well.",
						preparation: "Espresso",
						rating: "3",
						roaster: "Blue Bottle Coffee",
						roast_date: "2012-07-12",
						bean_composition: "Blended"
		});


		persistence.add(cNotes);

		cNotes = new this.db({
						name: "Yirgacheffe Gelana Abaya Natural",
						description: "Yirgacheffe, a subregion within Sidamo, Ethiopia, is known (and revered) for its clean, delicate, lemon-and-jasmine-redolent, washed coffees. Rarer are dry-processed Yirgacheffes, which carry all the citrus of their washed cousins, but bring a heavier body, more sweetness and a bubble-gum pack of vibrant fruit flavors. Grown near the border with Kenya in the Bule Hora region, in the south of Sidamo, the Gelana Abaya is not in the strictest sense a Yirgacheffe. But you wouldn’t know it as the cup explodes with strawberry jam, melon, peppery spices, vanilla, jasmine, bergamot and apples. The juxtaposition of complexity, approachability and sensory reward makes you feel like you’ve stepped up to a 1,000-piece puzzle, assembled it in 3 minutes and been handed a pork roast as a reward. A further plus for this coffee is its versatility – it will shine in any preparation method you choose, from siphon to espresso to Chemex to Kyoto-style iced. We hear it even works well as a rub on pork roasts.",
						preparation: "Drip",
						rating: "4",
						roaster: "Blue Bottle Coffee",
						roast_date: "2012-05-23",
						bean_composition: "Single Origin",
						country: "Ethiopia",
						region: "Sidamo",
						variety: "Heirloom Ethiopian cultivars",
						process: "dry"
		});


		persistence.add(cNotes);

		cNotes = new this.db({
						name: "Classic Espresso BLACK CAT PROJECT",
						description: "This syrupy and sweet espresso blend has been the staple of our lineup since the very beginning. It is a product of intensive lot selection and close, direct work with the farmers who produce its components. The Black Cat Classic Espresso’s hallmark is its supreme balance and wonderful sweetness.",
						preparation: "Espresso",
						rating: "4",
						roaster: "Intelligentsia Coffee",
						roast_date: "2012-05-23",
						bean_composition: "Blended",
						process: "dry"
		});


		persistence.add(cNotes);
		
		
		
    	persistence.flush();
		callback();
		}	
});


