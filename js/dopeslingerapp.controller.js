(function() {
	'use strict';
	
	angular
		.module('dopeslingerApp')
		.controller('DopeController', ['$scope', '$document', '$window', '$sce', '$interval', '$timeout', '$animate', function ($scope, $document, $window, $sce, $interval, $timeout, $animate) {

			var lastUpdate = 0;
			var lastSaved = 0;
			var interval;
			var cashOneSecond = 0;
			var timeOneSecond = 0;

			$scope.log = [];

			$scope.gameModel = new GameModel();
			$scope.prestigeDealers = [];
			$scope.cashPerSecond = 0;
			$scope.hireDealers = [];
			$scope.toggleWorkMode = function () { $scope.gameModel.workMode = !$scope.gameModel.workMode;};
			$scope.priceOfTerritory = function () { return territoryUpgradeBasePrice * Math.pow(territoryUpgradePriceMulti, $scope.gameModel.territoryUpgrades); };
			$scope.cashPercentage = function (value) { return Math.min(100, $scope.gameModel.cash / value * 100); };
			$scope.productionPrice = function (production) { return production.basePrice * Math.pow(production.priceMulti, production.qty); };
			$scope.availableUpgrades = [];
			$scope.dealerSort = 'none';

			$scope.getDrugByName = function (name) {
				for (var i = 0; i < $scope.gameModel.drugs.length; i++) {
					if ($scope.gameModel.drugs[i].name == name)
						return $scope.gameModel.drugs[i];
				}
				return null;
			};

			$scope.sellOnSilkRoad = function (drug) {
				if (drug.qty > 1000) {
					drug.qty -= 1000;
					var cashEarned = $scope.drugStreetPrice(drug) * 900;
					$scope.gameModel.cash += cashEarned;
					$scope.gameModel.totalCashEarned += cashEarned;
				}
			};

			$scope.actualDealerVolume = function (dealer, drug) {
				return getActualDealerVolume(dealer, drug); 
			};

			$scope.actualDealerPrice = function (dealer, drug) {
				if (drug === undefined) {
					drug = $scope.getDrugByName(dealer.drug);
				}
				
				return dealer.price * $scope.drugStreetPrice(drug);
			};

			$scope.drugStreetPrice = function (drug) {
				if ($scope.gameModel.buff && $scope.gameModel.buff.drugname == drug.name)
					return drug.pricePerGram * $scope.gameModel.buff.modifier;

				return drug.pricePerGram;
			};

			$scope.updateDealerDrugIndex = function(){
				for (var i=0; i< $scope.gameModel.drugs.length; i++) {
					for (var j=0; j < $scope.gameModel.dealers.length; j++) {
						if ($scope.gameModel.dealers[j].drug == $scope.gameModel.drugs[i].name) {
							$scope.gameModel.dealers[j].drugIndex = i;
						}
					}
				}
			};

			$scope.upgradeUnlocked = function (upgrade) {
				var upgradeUnlocked = false;
				for (var j = 0; j < $scope.gameModel.upgrades.length; j++) {
					if ($scope.gameModel.upgrades[j].name == upgrade.name)
						upgradeUnlocked = true;
				}
				return upgradeUnlocked;
			};

			$scope.otherUpgradesForThisDrugUnlocked = function (upgrade) {

				for (var i = 0; i < productionUpgradesMaster.length; i++) {
					if (productionUpgradesMaster[i].drug == upgrade.drug) {
						if (productionUpgradesMaster[i].name == upgrade.name)
							return true;

						if (!$scope.upgradeUnlocked(productionUpgradesMaster[i]))
							return false;
					}
				}
				return true;
			};

			$scope.toggleAutoSilk = function () {
				if ($scope.gameModel.autoSilk)
					$scope.gameModel.autoSilk = false;
				else
					$scope.gameModel.autoSilk = true;
			};

			$scope.getUpgradesForDrug = function(drug) {
				var upgradesForDrug = [];
				for (var i=0; i<$scope.availableUpgrades.length;i++){
					if ($scope.availableUpgrades[i].drug == drug.name)
						upgradesForDrug.push($scope.availableUpgrades[i]);
				}
				return upgradesForDrug;
			};

			$scope.calculateAvailableUpgrades = function () {
				$scope.availableUpgrades = [];
				$scope.drugResearch = [];
				$scope.dealerResearch = [];
				
				for (var i = 0; i < drugsMaster.length; i++) {
					var drugUnlocked = false;

					if ($scope.getDrugByName(drugsMaster[i].name) !== null)
						drugUnlocked = true;

					if (!drugUnlocked && (i > 0 && $scope.getDrugByName(drugsMaster[i - 1].name) !== null) && $scope.gameModel.totalCashEarned > (drugsMaster[i].costToUnlock * 1.5)) {
						$scope.drugResearch.push(drugsMaster[i].drugUnlock);
					}
				}
				for (i = 0; i < productionUpgradesMaster.length; i++) {

					if (!$scope.upgradeUnlocked(productionUpgradesMaster[i]) && $scope.getDrugByName(productionUpgradesMaster[i].drug) !== null && $scope.gameModel.totalCashEarned > (productionUpgradesMaster[i].price * 1.5) && $scope.otherUpgradesForThisDrugUnlocked(productionUpgradesMaster[i])) {
						$scope.availableUpgrades.push(productionUpgradesMaster[i]);
					}
				}
				if ($scope.gameModel.totalCashEarned > (silkRoadUpgrade.price * 1.5) && !$scope.gameModel.silkRoadUnlocked)
					$scope.dealerResearch.push(silkRoadUpgrade);
				
				if ($scope.gameModel.totalCashEarned > (prestigeDealerUpgrade.price * 1.5))
					$scope.dealerResearch.push(prestigeDealerUpgrade);
				
				$timeout(function(){$(window).trigger('resize');},0);
			};

			$scope.purchaseUpgrade = function (upgrade) {
				if ($scope.gameModel.cash < upgrade.price)
					return;

				var i = 0;
				switch (upgrade.type) {
					case 'PrestigeDealer':
						$scope.prestigeDealerPrice = prestigeDealerUpgrade.price;
						$('#prestigeDealerModal').modal('show');
						return;
					case 'SilkRoad':
						$scope.gameModel.silkRoadUnlocked = true;
						break;
					case 'DrugUnlock':
						for (i = 0; i < drugsMaster.length; i++) {
							if (drugsMaster[i].name == upgrade.drug) {
								$scope.gameModel.drugs.push(drugsMaster[i]);
							}
						}
						for (i = 0; i < productionMaster.length; i++) {
							if (productionMaster[i].drug == upgrade.drug) {
								$scope.gameModel.production.push(productionMaster[i]);
							}
						}
						break;
					case 'ProductionUpgrade':
						for (i = 0; i < $scope.gameModel.production.length; i++) {
							if ($scope.gameModel.production[i].name == upgrade.producer) {
								$scope.gameModel.production[i].prodPerUnit *= upgrade.upVal;
								$scope.gameModel.upgrades.push(upgrade);
							}
						}
						break;
				}
				$scope.gameModel.cash -= upgrade.price;
				$scope.calculateAvailableUpgrades();
				writeToCookie();
			};

			$scope.increaseProduction = function (production) {
				if ($scope.gameModel.cash > $scope.productionPrice(production)) {
					$scope.gameModel.cash = $scope.gameModel.cash - $scope.productionPrice(production);
					production.qty++;
					writeToCookie();
				}
			};

			$scope.producersForDrug = function (drug) {
				var producers = [];
				for (var i = 0; i < $scope.gameModel.production.length; i++) {
					if ($scope.gameModel.production[i].drug == drug.name)
						producers.push($scope.gameModel.production[i]);
				}
				return producers;
			};

			function readFromCookie() {
				if (typeof (Storage) == "undefined") {
					return;
				}
				if (localStorage.getItem("gameModel") !== null) $scope.gameModel = JSON.parse(localStorage.getItem("gameModel"));
				if (localStorage.getItem("prestigeDealers") !== null) $scope.prestigeDealers = JSON.parse(localStorage.getItem("prestigeDealers"));
			}

			function writeToCookie() {
				if (typeof (Storage) == "undefined") {
					return;
				}
				localStorage.setItem("gameModel", JSON.stringify($scope.gameModel));
				localStorage.setItem("prestigeDealers", JSON.stringify($scope.prestigeDealers));
			}

			$scope.drugMadePerSecond = function(drug) {
				var producers = $scope.producersForDrug(drug);
				var qty = 0;
				for (var j = 0; j < producers.length; j++) {
					qty += producers[j].qty * producers[j].prodPerUnit;
				}
				return qty;
			};

			$scope.drugSoldPerSecond = function (drug) {
				var qty = 0;
				for (var j = 0; j < $scope.gameModel.dealers.length; j++) {
					qty += getActualDealerVolume($scope.gameModel.dealers[j], drug);
				}
				return qty;
			};

			$scope.resetGame = function () {
				localStorage.removeItem('gameModel');
				window.location.reload();
			};

			$scope.selectDrug = function (drug) {
				drug.selected = !drug.selected;                
			};

			$scope.selectDealer = function (dealer) {
				dealer.selected = !dealer.selected;
			};

			$scope.getStars = function (number, max) {
				var stars = "<span class='glyphicon glyphicon-star'></span>";
				for (var i = 0; i < Math.round((number - 0.5) * (max - 1)) ; i++) {
					stars = stars + "<span class='glyphicon glyphicon-star'></span>";
				}
				return stars;
			};

			$scope.dealerHired = function (dealerId) {
				for (var i = 0; i < $scope.gameModel.dealers.length; i++) {
					if ($scope.gameModel.dealers[i].seed == dealerId)
						return true;
				}
				return false;
			};

			$scope.availableDealerUpgrades = [];
			$scope.avaliableDealerWeapons =[];
			var upgradeDealer;

			$scope.dealerUpgradeModal = function (dealer) {
				
				$scope.calculateAvailableDealerUpgrades(dealer);
				$scope.calculateAvailableDealerWeapons(dealer);
				
				$('#upgradeDealerModal').on('shown.bs.modal', function (e) {
					var height = 0;

					$('#upgradeDealerModal .height-match').each(function(){

						if ($(this).height() > height)
							height = $(this).height();
					});
					
					$('#upgradeDealerModal .height-match').each(function(){
						if (height > $(this).height())
							$(this).find('button').css('margin-top',(height - $(this).height()) + 'px');
					});
				});
				$('#upgradeDealerModal').modal('show');
			};

			$scope.upgradeDealer = function(){return upgradeDealer;};

			$scope.calculateAvailableDealerUpgrades = function(dealer) {
				upgradeDealer = dealer;
				$scope.availableDealerUpgrades = [];

				for (var i = 0; i < dealerUpgrades.length; i++) {
					var alreadyBought = false;
					for (var j = 0; j < dealer.upgrades.length; j++) {
						if (dealer.upgrades[j].name == dealerUpgrades[i].name)
							alreadyBought = true;
					}
					dealerUpgrades[i].realPrice = dealerUpgrades[i].price;
					
					if (dealer.type == 'Prestige') dealerUpgrades[i].realPrice = dealerUpgrades[i].price * 6;
					
					if (!alreadyBought && $scope.gameModel.totalCashEarned > dealerUpgrades[i].price - 2000)
						$scope.availableDealerUpgrades.push(dealerUpgrades[i]);
				}
			};
			
			$scope.calculateAvailableDealerWeapons = function(dealer) {
				$scope.availableDealerWeapons = [].concat(weapons);
			};

			$scope.purchaseDealerUpgrade = function (upgrade) {
				if ($scope.gameModel.cash < upgrade.realPrice)
					return;
				
				$scope.gameModel.cash -= upgrade.realPrice;
				upgradeDealer.upgrades.push(upgrade);
				upgradeDealer.volume *= upgrade.volumeMod;
				upgradeDealer.price *= upgrade.priceMod;
				upgradeDealer.sideVolume += upgrade.secondaryMod;
				$scope.calculateAvailableDealerUpgrades(upgradeDealer);
				writeToCookie();
			};

			var dealerRefreshRate = 60000;
			$scope.secondsToDealerRefresh = 0;

			$scope.refreshDealers = function () {
				if (!$scope.gameModel.lastDealerRefresh)
					$scope.gameModel.lastDealerRefresh = 0;

				var currentTime = new Date().getTime();
				if (currentTime > $scope.gameModel.lastDealerRefresh + dealerRefreshRate) {
					$scope.gameModel.lastDealerRefresh = currentTime;
				}
				$scope.hireDealers = [new Dealer($scope.gameModel.lastDealerRefresh), new Dealer($scope.gameModel.lastDealerRefresh - 25000), new Dealer($scope.gameModel.lastDealerRefresh - 45000)];

				$scope.hireDealers.push.apply($scope.hireDealers, $scope.prestigeDealers);
				writeToCookie();
			};

			$scope.hireDealerModal = function () {
				if ($scope.hireDealers.length === 0) {
					$scope.refreshDealers();
					$animate.enabled(false);
					$timeout(function(){$animate.enabled(true);},1000);
				}

				$('#hireDealerModal').modal('show');
			};

			$scope.hireDealer = function (dealer) {
				$('#hireDealerModal').modal('hide');
				if ($scope.gameModel.dealers.length < 1 + $scope.gameModel.territoryUpgrades && !$scope.dealerHired(dealer.seed)) {
					dealer.drug='Weed';
					$scope.gameModel.dealers.push(dealer);
					writeToCookie();
				} else {
					$timeout(function () {
						$window.alert('You already have the maximum number of dealers working for you. Either fire a dealer or expand your territory to hire another.');
					});
				}
			};

			$scope.fireDealerModal = function (dealer) {
				$scope.dealerToFire = dealer;
				$scope.dealerToFire.kids = (2 + Math.random() * 6).toFixed();
				$('#fireDealerModal').modal('show');
			};

			$scope.payBail = function(dealer) {
				if ($scope.gameModel.cash >= dealer.bail) {
					$scope.gameModel.cash -= dealer.bail;
					dealer.arrested = false;
					dealer.bail = 0;
					dealer.arrestMessage = false;
				}
			};

			$scope.fireDealerConfirm = function () {
				for (var i = 0; i < $scope.gameModel.dealers.length; i++) {
					if ($scope.gameModel.dealers[i].seed == $scope.dealerToFire.seed) {
						$scope.gameModel.dealers.splice(i,1);
						writeToCookie();
						$('#fireDealerModal').modal('hide');
						return;
					}
				}
			};

			$scope.fireDealerCancel = function () {
				$('#fireDealerModal').modal('hide');
			};

			$scope.expandTerritory = function () {
				var upgradeCost = territoryUpgradeBasePrice * Math.pow(territoryUpgradePriceMulti, $scope.gameModel.territoryUpgrades);
				if ($scope.gameModel.cash > upgradeCost) {
					$scope.gameModel.cash = $scope.gameModel.cash - upgradeCost;
					$scope.gameModel.territoryUpgrades++;
					writeToCookie();
				}
			};

			function update() {
				var updateTime = new Date().getTime();
				var timeDiff = (Math.min(1000, Math.max(updateTime - lastUpdate,0))) / 1000;

				var cashEarned = 0;
				
				var dealers = $scope.gameModel.dealers.concat().sort(function(a,b){return b.price - a.price;});

				if ($scope.gameModel.buff && $scope.gameModel.buff.expires <= updateTime) {
					$scope.gameModel.buff = undefined;
					$scope.buffMsg = undefined;
				}

				if ($scope.gameModel.lastDealerRefresh)
					$scope.secondsToDealerRefresh = (($scope.gameModel.lastDealerRefresh + dealerRefreshRate - updateTime) / 1000).toFixed();

				if ($scope.gameModel.buff)
					$scope.buffMsg = $scope.gameModel.buff.msg.format((($scope.gameModel.buff.expires - updateTime) / 1000).toFixed());
							
				for (var i = 0; i < $scope.gameModel.drugs.length; i++) {
					var drug = $scope.gameModel.drugs[i];

					if ($scope.gameModel.autoSilk && drug.qty > 1000) {
						drug.qty -= 1000;
						cashEarned += $scope.drugStreetPrice(drug) * 900;
					}
					
					var j = 0;

					var producers = $scope.producersForDrug(drug);
					for (j = 0; j < producers.length; j++) {
						drug.qty += producers[j].qty * producers[j].prodPerUnit * timeDiff;
						drug.total += producers[j].qty * producers[j].prodPerUnit * timeDiff;
					}

					for (j = 0; j < dealers.length; j++) {
						if (dealers[j].drug == drug.name && drug.qty >= getActualDealerVolume(dealers[j], drug) * timeDiff) {
							cashEarned += $scope.actualDealerPrice(dealers[j], drug) * getActualDealerVolume(dealers[j], drug) * timeDiff;
							drug.qty -= getActualDealerVolume(dealers[j], drug) * timeDiff;
							dealers[j].cashEarned += $scope.actualDealerPrice(dealers[j], drug) * getActualDealerVolume(dealers[j], drug) * timeDiff;
						}
					}

					for (j = 0; j < dealers.length; j++) {
						if (dealers[j].drug != drug.name && drug.qty >= getActualDealerVolume(dealers[j], drug) * timeDiff) {
							cashEarned += $scope.actualDealerPrice(dealers[j], drug) * getActualDealerVolume(dealers[j], drug) * timeDiff;
							drug.qty -= getActualDealerVolume(dealers[j], drug) * timeDiff;
							dealers[j].cashEarned += $scope.actualDealerPrice(dealers[j], drug) * getActualDealerVolume(dealers[j], drug) * timeDiff;
						}
					}
				}

				$scope.gameModel.cash += cashEarned;
				$scope.gameModel.totalCashEarned += cashEarned;

				lastUpdate = updateTime;
				if (updateTime - timeOneSecond >= 1000) {
					timeOneSecond = updateTime;
					$scope.cashPerSecond = $scope.gameModel.cash - cashOneSecond;
					cashOneSecond = $scope.gameModel.cash;

					for (i = 0; i < dealers.length; i++) {
						dealers[i].cashPerSecond = dealers[i].cashEarned - dealers[i].cashOneSecondAgo;
						dealers[i].cashOneSecondAgo = dealers[i].cashEarned;
					}
				}

				if (lastSaved < updateTime - 30000) {
					if (Math.random() > 0.96 && $scope.gameModel.totalCashEarned > 30000) {
						var dealerToArrest = $scope.gameModel.dealers[Math.floor(Math.random() * $scope.gameModel.dealers.length)];
						if (!dealerToArrest.arrested) {
							var bailValue = dealerToArrest.cashPerSecond * 95;
							dealerToArrest.arrested = true;
							dealerToArrest.bail = bailValue;
							dealerToArrest.arrestMessage = dealerToArrest.name + ' has been arrested by the cops! Bail has been set at ' + formatMoney(bailValue) + '.';
						}
					}
					if (Math.random() > 0.9 && !$scope.gameModel.buff) {
						var buffDrug = $scope.gameModel.drugs[Math.floor(Math.random() * $scope.gameModel.drugs.length)];
						var percentage = 2 + (Math.random() * 3);
						var time = 60 + (Math.random() * 100);
						$scope.gameModel.buff = {
							drugname: buffDrug.name, 
							modifier: percentage, 
							expires: new Date().getTime() + (time * 1000), 
							msg: "One of your rivals has been busted by the cops. The lack of competition is causing " + buffDrug.name + " to sell for " + (percentage * 100).toFixed() + "% of the normal street price for the next {0} seconds!" };						
					}
					writeToCookie();
					lastSaved = updateTime;
					$scope.calculateAvailableUpgrades();
					
				}
			}

			$document.ready(function () {
				scrollMenu();
				readFromCookie();
				
				for (var i=0; i < $scope.prestigeDealers.length; i++) {
					for (var j=0; j < $scope.gameModel.dealers.length; j++) {
						if ($scope.prestigeDealers[i].seed == $scope.gameModel.dealers[j].seed) {
							$scope.prestigeDealers[i] = $scope.gameModel.dealers[j];
						}
					}
				}
				
				$scope.calculateAvailableUpgrades();
				$scope.updateDealerDrugIndex();
				prestigeDealerUpgrade.price = 5000000 * Math.pow(1.4, $scope.prestigeDealers.length);
				$interval(update, 200);
			});

			$scope.prestigeDealerConfirm = function() {
				if ($scope.gameModel.cash >= prestigeDealerUpgrade.price) {
					var prestigeDealer = new Dealer($scope.prestigeDealers.length + 1);
					prestigeDealer.name = $scope.prestigeDealerName;
					prestigeDealer.price = 1.5;
					prestigeDealer.originalPrice = 1.5;
					prestigeDealer.volume = 1.5;
					prestigeDealer.originalVolume = 1.5;
					prestigeDealer.type= 'Prestige';
					$scope.prestigeDealers.push(prestigeDealer);
					localStorage.removeItem('gameModel');
					localStorage.setItem("prestigeDealers", JSON.stringify($scope.prestigeDealers));
					window.location.reload();
				}
				$('#prestigeDealerModal').modal('hide');
			};

			$scope.prestigeDealerCancel = function(){
				$('#prestigeDealerModal').modal('hide');
			};
			}]);
})();
