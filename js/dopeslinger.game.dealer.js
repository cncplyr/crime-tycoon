// dealer names
var maleFirstNames = ['Aidan', 'Alphonso', 'Anthony', 'Avon', 'Ben', 'Billy', 'Bobby', 'Bojack', 'Bret', 'Bruce', 'Cedric', 'Charles', 'Charlie', 'Chris', 'Clarence', 'Clark', 'Dave', 'David', 'Dexter', 'Drexyl', 'Eddie', 'Floyd', 'Frank', 'Freddie', 'Gerald', 'Gordon', 'Ilka', 'James', 'Jeff', 'Jethro', 'Jimmy', 'John', 'Ken', 'Kingston', 'Larry', 'Laurence', 'Leeroy', 'Lester', 'Malcolm', 'Marty', 'Maxwell', 'Michael', 'Mike', 'Paul', 'Pete', 'Randy', 'Ray', 'Reggie', 'Rick', 'Robert', 'Roland', 'Ron', 'Ronnie', 'Ross', 'Sean', 'Spencer', 'Spike', 'Steve', 'Stevie', 'Stringer', 'Stu', 'Stuart', 'Terry', 'Thomas', 'Tommy', 'Tony', 'William', 'Brian'];
var femaleFirstNames = ['Alicia', 'Amanda', 'Ashley', 'Barbara', 'Becky', 'Beverly', 'Catriona', 'Charlotte', 'Debbie', 'Eve', 'Fiona', 'Francesca', 'Geraldine', 'Harriet', 'Jacki', 'Jane', 'Jenny', 'Jessica', 'Joanne', 'Jodie', 'Josie', 'Julia', 'June', 'Kate', 'Kim', 'Kimmy', 'Laura', 'Lisa', 'Liz', 'Louisa', 'Louise', 'Margaret', 'Martina', 'Mary', 'Muriel', 'Natasha', 'Nicki', 'Pam', 'Patricia', 'Rachel', 'Rebecca', 'Rebel', 'Rhonda', 'Riley', 'Rose', 'Ruby', 'Samantha', 'Sarah', 'Scarlet', 'Shannon', 'Sharon', 'Sophie', 'Stacy', 'Stephanie', 'Susie', 'Tabitha', 'Tanya', 'Toni', 'Tracy', 'Tricia', 'Trish', 'Vera', 'Victoria', 'Yolanda', 'Michelle', 'Felicity'];
var lastNames = ['Adams', 'Barksdale', 'Baxter', 'Bell', 'Braxton', 'Bronson', 'Cray', 'Diamond', 'Edwards', 'Findus', 'Ford', 'Fox', 'Franklin', 'French', 'Gentworth', 'George', 'Gibson', 'Gittins', 'Grey', 'Grimes', 'Harrison', 'Hogan', 'Hopkins', 'Jackson', 'Jenkins', 'Jones', 'Lee', 'Lloyd', 'Long', 'Mackintosh', 'Manero', 'Marshall', 'Matrix', 'McGrath', 'McLaren', 'Mills', 'Moreno', 'Murphy', 'Page', 'Palmer', 'Perry', 'Plant', 'Potts', 'Reed', 'Rhoades', 'Rico', 'Roper', 'Savage', 'Scott', 'Smith', 'Somerville', 'Stevens', 'Stewart', 'Sulley', 'Templeton', 'Thompson', 'Tull', 'Washington', 'Willis', 'Wilson', 'Worley', 'Young', 'Merchant', 'Rodriguez', 'Gonzalez', 'King'];
var nicknames = ['Ace', 'Babyface', 'Beefsteak', 'Big dog', 'Birdy', 'Blaster', 'Boffin', 'Bones', 'Brains', 'Brandy', 'Brick', 'Bubbles', 'Bug Eye', 'Butter', 'California', 'Cheese', 'Chips', 'Coffee', 'Corky', 'Crusher', 'Doc', 'Dolamite', 'Egg', 'Fingers', 'Fletch', 'Foxy', 'Frosty', 'G', 'Ghost', 'Goat', 'Grafter', 'Hollywood', 'Ice', 'Jellybean', 'Linebacker', 'Lucky', 'Maniac', 'Muscles', 'Papa', 'Psycho', 'Scarface', 'Shooter', 'Silencer', 'Slim', 'Snoop', 'Space Cadet', 'Spud', 'The Face', 'The Hat', 'The Kid', 'The Mouth', 'Unit', 'Upgrayedd', 'Vampire', 'Wheezy', 'Wonder'];


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

    this.selected = true;

    this.cashEarned = 0;
    this.cashOneSecondAgo = 0;
    this.cashPerSecond = 0;

    this.drug = "Weed";
    this.drugIndex = 0;

    this.upgrades = [];
    this.weapon = {};
}

function getActualDealerPrice(dealer, drug) {
	 return dealer.price * drug.pricePerGram;
}
function getActualDealerVolume(dealer, drug) {
    if (dealer.arrested) {
        return 0;
    }
    if (drug == dealer.drug || drug.name == dealer.drug) {
        return dealer.volume * 3;
    } else {
        return dealer.sideVolume * dealer.volume * 3;
    }
}

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

// Weapons are used to upgrade dealer margin
function Weapon(name, tooltip, synopsis, price, priceMod) {
    this.name = name;
    this.tooltip = tooltip;
    this.synopsis = synopsis;
    this.price = price;
    this.priceMod = priceMod;
}

var weapons = [
    new Weapon(
      'Baseball Bat',
      'Handy in a street fight and helps to scare away the competition. Allows the dealer to sell drugs for 5% more money',
      '+5% margin',
      150, 1.05
    ),
    new Weapon(
      'Combat Knife',
      'A large, sharp knife, deadly in the right hands. Allows the dealer to sell drugs for 10% more money',
      '+10% margin',
      150, 1.1
    ),
    new Weapon(
      'Glock 17 9mm',
      'A small but deadly firearm, nobody will mess with you if you have this. Allows the dealer to sell drugs for 20% more money',
      '+20% margin',
      150, 1.2
    ),
    new Weapon(
      'AK-47 7.62x39m',
      'A powerful Russian assault rifle. Allows the dealer to sell drugs for 30% more money',
      '+30% margin',
      150, 1.3
    )
];
