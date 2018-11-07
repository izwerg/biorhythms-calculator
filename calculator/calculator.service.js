'use strict';

myApp.factory('calculator', ['$log', function($log) {
  var calculator = {};

  calculator.getValues = function(birthday) {
    var biorhythmsData = {};
    var now = new Date();
    var thirtyDays = Date.now() + (86400000 * 30);

    if (Object.keys(biorhythmsData).length === 0) { // TODO: this is always true as biorhythmsData initialized above with empty object
      var day = 0;
      for (var x = Date.now(); x < thirtyDays; x += 86400000) {
        biorhythmsData['day' + (day += 1)] = [new Date(x), []]; // TODO: don't use array instead of object, see below
      }
    }

    // TODO: separate time lived calculation and biorhythms calculation to different functions

    var timeBetw1970AndBirthday = Date.now() - birthday;
    var daysLived = 0;
    var weeksLived = 0;

    if (timeBetw1970AndBirthday < 0) { /* if born before Jan 1 1970 */
      daysLived = Math.floor((Math.abs(timeBetw1970AndBirthday) + Date.now()) / 1000 / 86400);
      weeksLived = Math.floor(daysLived / 7);
    } else {
      daysLived = Math.floor(timeBetw1970AndBirthday / 1000 / 86400);
      weeksLived = Math.floor(daysLived / 7);
    }

    var yearsLived = now.getFullYear() - birthday.getFullYear();
    var monthsCompared = now.getMonth() - birthday.getMonth();
    var datesCompared = now.getDate() - birthday.getDate();

    if (yearsLived > 0 && monthsCompared <= 0 && datesCompared < 0) {
      yearsLived -= 1;
    }

    var days = daysLived;
    var whatDay = 1;

    for (var i = 0; i < 30; i++) {
      // prevent bulking values in the array from previous function calls
      biorhythmsData['day' + whatDay][1] = [];
      for (var y = 0; y < 3; y++) {
        // physical biorhythm lasts 23 days, emotional - 28, intellectual - 33
        var biorhythm = [23, 28, 33];
        var valOfBior = Math.sin(2 * Math.PI * (days / biorhythm[y]));
        biorhythmsData['day' + whatDay][1].push(Math.round(valOfBior * 100));
      }
      days += 1;
      whatDay += 1;
    }

    // TODO: resulting biorhythmsData should be array of objects:
    // [{ date: DATE, physical: NUMBER, emotional: NUMBER, intellectual: NUMBER }]
    // instead of object of arrays:
    // { day1: [DATE, [NUMBER, NUMBER, NUMBER]] }
    // TODO: IMPORTANT: items order is not guaranteed for objects: https://stackoverflow.com/a/5525820/4117431

    $log.log(biorhythmsData);
    return {daysLived: daysLived, weeksLived: weeksLived, yearsLived: yearsLived, biorhythmsData: biorhythmsData};
  };

  return calculator;
}]);
