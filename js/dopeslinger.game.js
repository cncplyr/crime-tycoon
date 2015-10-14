if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// constants
var treeUpgradeBasePrice = 1000;
var treeUpgradePriceMulti = 1.95;
var treeUpgradeWeedMulti = 1.2;

var territoryUpgradePriceMulti = 3.1;
var territoryUpgradeBasePrice = 2000;

var silkRoadUpgrade = {type:'SilkRoad',name:'Develop Silk Road',tooltip:'Develop the Silk Road dark web site to allow you to bulk sell drugs in units of 1kg',price:141592,glyph:'glyphicon-cloud'};
var prestigeDealerUpgrade = {type:'PrestigeDealer',name:'Dealer Captain',tooltip:'Recruit a dealer captain with perfect attributes. This will reset your progress!',price:5000000,glyph:'glyphicon-tower'};

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
    this.workMode = true;
    this.lastDealerRefresh = 0;
    this.silkRoadUnlocked = false;
    this.autoSilk = false;
}
