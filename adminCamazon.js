var mysql = require("mysql");
var inquirer = require("inquirer");

//make connection
var connection = mysql.createConnection ({
	host: "localhost",
	port: 8080,
//create username and password and select the database to connect to
	user: "root",
	password: "",
	database: camazonDB
});
//provide administrator with access to managing inventory 
function adminAction() {
	inquirer.prompt ([
		type: "list",
		name: "option",
		message: "Select your command: ",
		choices: ["View items for sale", "Add to Inventory", "Add New Item", "Check Low Inventory" ],
		filter: function(val) {
			if (val == "View items for sale") {
				return "onSale";
			}
			else if (val == "Add to Inventory") {
				return "restock";
			}
			else if (val == "Add New Item") {
				return "addNew";
			}
			else if (val == "Check Low Inventory") {
				return "lowInv";
			}
			else {
				console.log("Please select an option from the menu.");
			}
		}
	}

	]).then(function(input) {
		if (input.option == "onSale") {
			showInventory();
		}
		else if (input.option == "restock") {
			restockInventory();
		}
		else if (input.option == "addNew") {
			addNewItem();
		}
		else if (input.option == "lowInv") {
			showLowInventory();
		}
		else{
			console.log("Input error.");
		}
	})
}

function showInventory() {
	query_string = "SELECT * FROM reagents";

	connection.query(query_string, function(err, data){
		if (err) throw err;
		console.log("Available Inventory: ");

		
		for (var i = 0; i < data.length; i++){
			var resString = "";
			resString += "ID: " + data[i].item_id + "\n";
			resString += "Reagent Name: " + data[i].reagent_name + "\n";
			resString += "Department: " + data[i].department_name + "\n";
			resString += "Cost: " + data[i].cost;

			console.log(resString); 
		}
		connection.end();
	})
}

function restockInventory() {	
	inquirer.prompt([
		{
			type: "input",
			name: "item_id",
			message: "Select the ID of the item to restock",
			filter: Number
		},
		{
			type: "input",
			name: "quantity",
			message: "How much of the item would you like to add?",
			filter: Number
		}
	]).then(function(input){
		var item = input.item_id;
		var quantAdd = input.quantity;

		var query_string = "SELECT * FROM reagents WHERE ?";

		connection.query(query_string, {item_id: item}, function(err, data){
			if (err) throw err;

			if (data.length == 0) {
				console.log("Invalid entry. Please pick a valid item identification.");
				restockInventory(); //start from the beginning after invalid entry 
			}
			else{
				var reagentData = data[0];

				console.log("Restocking Inventory");

				var updateQueryString = "UPDATE reagents SET stock_num = " + (reagentData.stock_num + quantAdd) + "WHERE item_id= " + item;
				connection.query(updateQueryString, function(err, data){
					if (err) throw err;
					console.log("Stock units of item " + item_id + " were restocked. Total stock is " + (reagentData.stock_num + quantAdd) + " units.");
					connection.end();
				})
			}
		})
	})
}

function addNewItem(){
	inquirer.prompt([
		{
			type: "input",
			name: "reagent_name",
			message: "Enter the name of the new product."
		},
		{
			type: "input",
			name: "department_name",
			message: "Select the department for the new product"
		},
		{
			type: "input",
			name: "cost",
			message: "What is the unit price of the new product?"
		},
		{
			type: "input", 
			name: "stock_num",
			message: "What is the stock of the new item?"
		}
	]).then(function(input){
		console.log("Adding New Product:");
		console.log("Product " + input.reagent_name);
		console.log("Department " + input.department_name);
		console.log("Stock " + input.stock_num);
		console.log("Cost " + input.cost);

		var query_string = "INSERT INTO reagents SET ?";
		connection.query(query_string, input, function(error, results, fields) {
			if (error) throw error;

			console.log("New Product has been added to the Inventory" +"\n" + "The product ID is " + results.insertId);
			connection.end();
		});
	})
}

function showLowInventory(){
	//gotta make the database query string
	query_string = "SELECT * FROM reagents WHERE stock_num < 50";

	connection.query(query_string, function(err, data){
		if (err) throw err;
		console.log("Items running low in Inventory: ");

		for (var i = 0; i < data.length; i++) {
			var resString = "";
			resString += "ID: " + data[i].item_id + "\n";
			resString += "Reagent Name: " + data[i].reagent_name + "\n";
			resString += "Department: " + data[i].department_name + "\n";
			resString += "Cost: " + data[i].cost;
			resString += "Quantity: " + data[i].quantity + "\n";
			console.log(resString); 
		}
		connection.end();
	})
}

function runApp() {
	adminAction();
}

runApp();