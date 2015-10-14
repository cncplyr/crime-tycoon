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

function DrugUnlock (name,tooltip,price,drug) {
    this.type = 'DrugUnlock';
    this.name = name;
    this.tooltip = tooltip;
    this.price = price;
    this.drug = drug;
    this.glyph = 'glyphicon-tint';
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
    new Drug('Cocaine', 70, 250000)
];

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
    new Producer('Drug Mule', 50000, 'Cocaine', 1.27, 0.3)
];

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
    new ProductionUpgrade('DEA Mole', 'Install a mole within the DEA to help make your operations go more smoothly. Increases the amount of cocaine smuggled by your drug mules by 50%!', 2500000, 'Drug Mule', 1.5, 'Cocaine')
];
