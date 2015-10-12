if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// dealer names
var maleFirstNames = ['Aidan', 'Alphonso', 'Anthony', 'Avon', 'Ben', 'Billy', 'Bobby', 'Bojack', 'Bret', 'Bruce', 'Cedric', 'Charles', 'Charlie', 'Chris', 'Clarence', 'Clark', 'Dave', 'David', 'Dexter', 'Drexyl', 'Eddie', 'Floyd', 'Frank', 'Freddie', 'Gerald', 'Gordon', 'Ilka', 'James', 'Jeff', 'Jethro', 'Jimmy', 'John', 'Ken', 'Kingston', 'Larry', 'Laurence', 'Leeroy', 'Lester', 'Malcolm', 'Marty', 'Maxwell', 'Michael', 'Mike', 'Paul', 'Pete', 'Randy', 'Ray', 'Reggie', 'Rick', 'Robert', 'Roland', 'Ron', 'Ronnie', 'Ross', 'Sean', 'Spencer', 'Spike', 'Steve', 'Stevie', 'Stringer', 'Stu', 'Stuart', 'Terry', 'Thomas', 'Tommy', 'Tony', 'William', 'Brian'];
var femaleFirstNames = ['Alicia', 'Amanda', 'Ashley', 'Barbara', 'Becky', 'Beverly', 'Catriona', 'Charlotte', 'Debbie', 'Eve', 'Fiona', 'Francesca', 'Geraldine', 'Harriet', 'Jacki', 'Jane', 'Jenny', 'Jessica', 'Joanne', 'Jodie', 'Josie', 'Julia', 'June', 'Kate', 'Kim', 'Kimmy', 'Laura', 'Lisa', 'Liz', 'Louisa', 'Louise', 'Margaret', 'Martina', 'Mary', 'Muriel', 'Natasha', 'Nicki', 'Pam', 'Patricia', 'Rachel', 'Rebecca', 'Rebel', 'Rhonda', 'Riley', 'Rose', 'Ruby', 'Samantha', 'Sarah', 'Scarlet', 'Shannon', 'Sharon', 'Sophie', 'Stacy', 'Stephanie', 'Susie', 'Tabitha', 'Tanya', 'Toni', 'Tracy', 'Tricia', 'Trish', 'Vera', 'Victoria', 'Yolanda', 'Michelle', 'Felicity'];
var lastNames = ['Adams', 'Barksdale', 'Baxter', 'Bell', 'Braxton', 'Bronson', 'Cray', 'Diamond', 'Edwards', 'Findus', 'Ford', 'Fox', 'Franklin', 'French', 'Gentworth', 'George', 'Gibson', 'Gittins', 'Grey', 'Grimes', 'Harrison', 'Hogan', 'Hopkins', 'Jackson', 'Jenkins', 'Jones', 'Lee', 'Lloyd', 'Long', 'Mackintosh', 'Manero', 'Marshall', 'Matrix', 'McGrath', 'McLaren', 'Mills', 'Moreno', 'Murphy', 'Page', 'Palmer', 'Perry', 'Plant', 'Potts', 'Reed', 'Rhoades', 'Rico', 'Roper', 'Savage', 'Scott', 'Smith', 'Somerville', 'Stevens', 'Stewart', 'Sulley', 'Templeton', 'Thompson', 'Tull', 'Washington', 'Willis', 'Wilson', 'Worley', 'Young', 'Merchant', 'Rodriguez', 'Gonzalez', 'King'];
var nicknames = ['Ace', 'Babyface', 'Beefsteak', 'Big dog', 'Birdy', 'Blaster', 'Boffin', 'Bones', 'Brains', 'Brandy', 'Brick', 'Bubbles', 'Bug Eye', 'Butter', 'California', 'Cheese', 'Chips', 'Coffee', 'Corky', 'Crusher', 'Doc', 'Dolamite', 'Egg', 'Fingers', 'Fletch', 'Foxy', 'Frosty', 'G', 'Ghost', 'Goat', 'Grafter', 'Hollywood', 'Ice', 'Jellybean', 'Linebacker', 'Lucky', 'Maniac', 'Muscles', 'Papa', 'Psycho', 'Scarface', 'Shooter', 'Silencer', 'Slim', 'Snoop', 'Space Cadet', 'Spud', 'The Face', 'The Hat', 'The Kid', 'The Mouth', 'Unit', 'Upgrayedd', 'Vampire', 'Wheezy', 'Wonder'];

// constants
var treeUpgradeBasePrice = 1000;
var treeUpgradePriceMulti = 1.95;
var treeUpgradeWeedMulti = 1.2;

var territoryUpgradePriceMulti = 3.1;
var territoryUpgradeBasePrice = 2000;

function DealerUpgrade(name, tooltip, price, volumeMod, priceMod, secondaryMod, synopsis) {
    this.name = name;
    this.tooltip = tooltip;
    this.price = price;
    this.volumeMod = volumeMod;
    this.priceMod = priceMod;
    this.secondaryMod = secondaryMod;
	this.synopsis = synopsis;
}

var dealerUpgrades = [
    new DealerUpgrade('Baseball bat', 'Handy in a street fight and helps to scare away the competition. Allows the dealer to sell drugs for 10% more money', 150, 1, 1.1, 0, '+10% margin'),
    new DealerUpgrade('Bicycle', 'The cheapest and most basic form of personal transportation. Allows the dealer to sell an extra 10% volume', 600, 1.1, 1, 0, '+10% volume'),
    new DealerUpgrade('iPhone 6 Plus', 'A state of the art smartphone. Allows the dealer to sell a small amount of other drugs on the side', 900, 1, 1, 0.1, '+10% secondary sales'),
    new DealerUpgrade('Superbike', 'One of the fastest ways to get around the urban jungle. Allows the dealer to sell an extra 20% volume', 25000, 1.2, 1, 0, '+20% volume'),
    new DealerUpgrade('Glock 17 9mm', 'A small but deadly firearm, nobody will mess with you if you have this. Allows the dealer to sell drugs for 20% more money', 5000, 1, 1.2, 0, '+20% margin'),
    new DealerUpgrade('Personal Assistant', 'A personal assistant to take your calls. Allows the dealer to sell even more drugs on the side', 85000, 1, 1, 0.2, '+20% secondary sales'),
    new DealerUpgrade('Armed Gang', 'A gang of tooled up homies to help eliminate the competition. Allows the dealer to sell drugs for 20% more money', 150000, 1, 1.2, 0, '+20% margin'),
    new DealerUpgrade('Ferrari 458 Italia', 'A fine Italian supercar. Allows the dealer to sell an extra 30% volume', 575000, 1.3, 1, 0, '+30% volume'),
    new DealerUpgrade('AW119 Ke Koala', 'A personal helicopter for transporting you and your homies! Allows the dealer to sell an extra 60% volume', 1890000, 1.6, 1, 0, '+60% volume')
];

var silkRoadUpgrade = {type:'SilkRoad',name:'Develop Silk Road',tooltip:'Develop the Silk Road dark web site to allow you to bulk sell drugs in units of 1kg',price:141592,glyph:'glyphicon-cloud'};
var prestigeDealerUpgrade = {type:'PrestigeDealer',name:'Dealer Captain',tooltip:'Recruit a dealer captain with perfect attributes. This will reset your progress!',price:5000000,glyph:'glyphicon-tower'};

function ProductionUpgrade(name, tooltip, price, producer, upVal, drug) {
    this.type = 'ProductionUpgrade';
    this.name = name;
    this.tooltip = tooltip;
    this.price = price;
    this.producer = producer;
    this.upVal = upVal;
    this.drug = drug;
    this.glyph = 'glyphicon-circle-arrow-up';
}
function DrugUnlock (name,tooltip,price,drug) {
    this.type = 'DrugUnlock';
    this.name = name;
    this.tooltip = tooltip;
    this.price = price;
    this.drug = drug;
    this.glyph = 'glyphicon-tint';
}

function formatMoney(input) {
	if (!input) input = 0;
	var symbol = '$';
	if (input >= 1000000000000)
		return symbol + (input / 1000000000000).toFixed(2) + 'T';
	if (input >= 1000000000)
		return symbol + (input / 1000000000).toFixed(2) + 'B';
	if (input >= 1000000)
		return symbol + (input / 1000000).toFixed(2) + 'M';
	if (input >= 1000)
		return symbol + (input / 1000).toFixed(2) + 'K';

	return symbol + input.toFixed(2);
}

var productionUpgradesMaster = [
    new ProductionUpgrade('Fertilizer', 'Nutrient rich fertilizer, increases the amount of weed produced by your cannabis plants by 30%!', 500, 'Cannabis Plant', 1.3, 'Weed'),
    new ProductionUpgrade('Hydroponics', 'High tech agriculture system, increases the amount of weed produced by your cannabis plants by 50%!', 6500, 'Cannabis Plant', 1.5, 'Weed'),

    new ProductionUpgrade('Auto Hygrometer', 'An automatically controlled humidity system, increases the amount of shrooms produced by your mushroom farms by 50%!', 5000, 'Mushroom Farm', 1.5, 'Magic Mushrooms'),
    new ProductionUpgrade('Irrigation system', 'An computer controlled irrigation system, increases the amount of shrooms produced by your mushroom farms by 50%!', 25000, 'Mushroom Farm', 1.5, 'Magic Mushrooms'),

    new ProductionUpgrade('Recreational Vehicle', 'Increases the amount of meth made by your cooks by 50%!', 40000, 'Meth Cook', 1.5, 'Meth'),
    new ProductionUpgrade('Underground Lab', 'Increases the amount of meth made by your cooks by 50%!', 130000, 'Meth Cook', 1.5, 'Meth'),

    new ProductionUpgrade('Corrupt Chemist', 'Increases the amount of speed produced by your chefs by 60%!', 75000, 'Base Chef', 1.4, 'Speed'),
    new ProductionUpgrade('Criminal Pharmacy', 'Increases the amount of speed produced by your chefs by 50%!', 190000, 'Base Chef', 1.5, 'Speed'),

    new ProductionUpgrade('College education', 'Increases the amount of acid made by your lab technicians by 50%!', 80000, 'Lab Technician', 1.5, 'Acid'),
    new ProductionUpgrade('Digital Distillation', 'Increases the amount of acid made by your lab technicians by 50%!', 120000, 'Lab Technician', 1.5, 'Acid'),

    new ProductionUpgrade('Gang protection', 'Increases the amount of crack made by your crack dens by 50%!', 145000, 'Crack Den', 1.5, 'Crack'),
    new ProductionUpgrade('Police Payoff', 'Get the feds off your back to increase the amount of crack made by your crack dens by 45%!', 280000, 'Crack Den', 1.45, 'Crack'),

    new ProductionUpgrade('Haber process research', 'Increases the amount of PCP made by your chemical labs by 50%!', 190000, 'Chemical Lab', 1.5, 'PCP'),
    new ProductionUpgrade('Mass Spectrometer', 'Increases the amount of PCP made by your chemical labs by 70%!', 550000, 'Chemical Lab', 1.7, 'PCP'),

    new ProductionUpgrade('Polytunnel complex', 'Increases the amount of heroin made by your opium farms by 50%!', 210000, 'Opium Farm', 1.5, 'Heroin'),
    new ProductionUpgrade('Cropdusting', 'Increases the amount of heroin made by your opium farms by 50%!', 750000, 'Opium Farm', 1.5, 'Heroin'),

    new ProductionUpgrade('PhD Students', 'A small army of PhD students to assist the professors in their important work. Increases the amount of MDMA made by your chemistry professors by 60%!', 250000, 'Chemistry Professor', 1.6, 'MDMA'),
    new ProductionUpgrade('Research Facility', 'Increases the amount of MDMA made by your chemistry professors by 40%!', 1000000, 'Chemistry Professor', 1.4, 'MDMA'),

    new ProductionUpgrade('Plastic surgery disguise', 'Increases the amount of cocaine smuggled by your drug mules by 30%!', 350000, 'Drug Mule', 1.3, 'Cocaine'),
    new ProductionUpgrade('Cartel deal', 'Broker a deal with a major cartel south of the border. Increases the amount of cocaine smuggled by your drug mules by 80%!', 1500000, 'Drug Mule', 1.8, 'Cocaine'),
    new ProductionUpgrade('DEA Mole', 'Install a mole within the DEA to help make your operations go more smoothly. Increases the amount of cocaine smuggled by your drug mules by 50%!', 2500000, 'Drug Mule', 1.5, 'Cocaine')];

function Drug(name, pricePerGram, costToUnlock) {
    this.name = name;
    this.pricePerGram = pricePerGram;
    this.qty = 0;
    this.total = 0;
    this.selected = true;
    this.costToUnlock = costToUnlock;
    this.totalCash = 0;
	this.drugUnlock = new DrugUnlock('Research ' + this.name, 'Spend money to research production of a new drug, ' + this.name + '. Your customers will love it!', this.costToUnlock, this.name);
}

var drugsMaster = [
    new Drug('Weed', 4.2, 0),
    new Drug('Magic Mushrooms', 6, 2000),
    new Drug('Meth', 10, 7000),
    new Drug('Speed', 15, 20000),
    new Drug('Acid', 20, 40000),
    new Drug('Crack', 30, 75000),
    new Drug('PCP', 40, 90000),
    new Drug('Heroin', 50, 120000),
    new Drug('MDMA', 60, 180000),
    new Drug('Cocaine', 70, 250000)];

function Producer(name, basePrice, drug, priceMulti, prodPerUnit) {
    this.name = name;
    this.basePrice = basePrice;
    this.qty = 0;
    this.drug = drug;
    this.priceMulti = priceMulti;
    this.prodPerUnit = prodPerUnit;
}

var productionMaster = [
    new Producer('Cannabis Plant', 15, 'Weed', 1.12, 0.2),
    new Producer('Mushroom Farm', 150, 'Magic Mushrooms', 1.15, 0.3),
    new Producer('Meth Cook', 1000, 'Meth', 1.2, 0.5),
    new Producer('Base Chef', 2500, 'Speed', 1.21, 0.4),
    new Producer('Lab Technician', 5000, 'Acid', 1.22, 0.5),
    new Producer('Crack Den', 10000, 'Crack', 1.23, 0.5),
    new Producer('Chemical Lab', 20000, 'PCP', 1.24, 0.4),
    new Producer('Opium Farm', 30000, 'Heroin', 1.25, 0.5),
    new Producer('Chemistry Professor', 40000, 'MDMA', 1.26, 0.45),
    new Producer('Drug Mule', 50000, 'Cocaine', 1.27, 0.3)];


function Dealer(seed) {
    this.seed = seed;
    Math.seedrandom(seed);
    this.volume = Math.random() + 0.5;
    this.price = Math.random() + 0.5;
	
	this.originalVolume = this.volume;
	this.originalPrice = this.price;
	
    this.sideVolume = 0;

    this.male = true;
    this.name = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
    if (Math.random() > 0.7) {
        this.male = false;
        this.name = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    }
    if (Math.random() > 0.9) {
        this.name = this.name + ' "' + nicknames[Math.floor(Math.random() * nicknames.length)] + '"';
    }
    this.name = this.name + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
    this.cashEarned = 0;
    this.selected = true;
    this.drug = "Weed";
	this.drugIndex = 0;
    this.upgrades = [];
    this.cashOneSecondAgo = 0;
    this.cashPerSecond = 0;
}

function getActualDealerPrice(dealer, drug) { return dealer.price * drug.pricePerGram; }

function getActualDealerVolume(dealer, drug) {
	if (dealer.arrested) return 0;
    if (drug == dealer.drug || drug.name == dealer.drug)
        return dealer.volume * 3;
    else
        return dealer.sideVolume * dealer.volume * 3;
}

function GameModel() {
    this.drugs = [drugsMaster[0]];
    this.upgrades = [];
    this.currencyCode = '$';
    this.cash = 100;
    this.totalCashEarned = 0;
    this.treeUpgrades = 0;
    this.dealers = [];
    this.production = [productionMaster[0]];
    this.territoryUpgrades = 0;
    this.workMode = false;
    this.lastDealerRefresh = 0;
    this.silkRoadUnlocked = false;
    this.autoSilk = false;
}