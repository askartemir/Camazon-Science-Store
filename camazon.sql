-- Chemical Engineering Amazon
DROP DATABASE IF EXISTS camazonDB;
-- Create Chemical Amazon database
CREATE database camazonDB;
-- Apply the code specifically to Camazon database 
USE camazonDB;

CREATE TABLE reagents(
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	reagent_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	stock_num INTEGER(11) NOT NULL,	
	cost DECIMAL(10,4) NOT NULL,
	PRIMARY KEY(item_id)
);

SELECT * FROM reagents;

INSERT INTO reagents(reagent_name,department_name,stock_num,cost)
VALUES ("Nanoparticle Solution", "Nanotech", 1000, 500),
		("PEG Stealth Polymer", "Engineering", 2000, 200),
		("Organic Solution #1", "Chemistry", 500, 100),
		("Organic Solution #2", "Chemistry", 500, 100),
		("High Pressure Homogenizer", "Engineering", 100, 1000),
		("Filtration System", "Engineering", 200, 500),
		("Special Surfactant", "Nanotech", 100, 250);