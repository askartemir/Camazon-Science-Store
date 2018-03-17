//prepare all dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");
//create connection to SQL server
var connection = mysql.createConnection({
	host:"localhost",
	port: 8080,
	//create username
	user: "root",
	//create password
	password: "",
	database: "camazonDB"
});
//be able to detect errors if there are any
connection.connect(function(err){
	if(err) throw err;
	runQuery();
});


function customerAction(){
	inquirer.prompt([
	{
		type: "input",
		name: "item_id",
		message: "Select the ID of the item to purchase",
		filter: Number
	},
	{
		type: "input",
		name: "quantity",
		message: "Choose the desired quantity",
		filter: Number
	}
	]).then(function(input){
		var item = input.item_id;
		var quantity = input.quantity;

		var query_string = "SELECT * FROM reagents WHERE ?";

		connection.query(query_string, {item_id: item}, function(err, data){
			if(err) throw err;

			if (data.length === 0){
				console.log("Invalid Item ID. Please enter a valid Item ID.");
				showInventory();
			}
			else{
				var reagentData = data[0];

				if (quantity <= reagentData.stock_num){
					console.log("The selected item is in stock. Your order has been processed.");
					var updateQueryString = "UPDATE reagents SET stock_num = " + (reagentData.stock_num - quantity) + "WHERE item_id= " + item;
					connection.query(updateQueryString, function(err, data){

						if (err) throw err;

						console.log("Order has been processed. Total payment is " + reagentData.cost*quantity + "dollars");
						console.log("Thank you for shopping with Camazon.");

						connection.end();

					})
				}
				else {
					console.log("Item not in stock, order cannot be processed");
					console.log("Select available items for your order");

					showInventory();
				}
			}

		})
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

		customerAction();
	})
}
function runApp(){

	showInventory();
}
runApp();	