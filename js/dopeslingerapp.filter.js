angular
	.module('dopeslingerApp')
    .filter('weight', function () {
        return function (input) {
            if (input >= 1000)
                return (input / 1000).toFixed(2) + 'kg';

            return input.toFixed(2) + "g";
        };
    })
    .filter('money', function () {
        return formatMoney;
    });