'use strict';

myApp.factory('calculator', ['$log', function($log) {

  var calculator = {};

  // will contain all data for the table
  calculator.biorhythmsData = [];

  calculator.makers = {

    getDateObj: function() {

      return new Date();

    },

    stuffBiorhythmsDataWithDates: function(today) {

      if (calculator.biorhythmsData.length > 0) {

        return;

      }

      var thirtyDays = Date.parse(today) + (86400000 * 30);

      for (var i = Date.parse(today); i < thirtyDays; i += 86400000) {

        calculator.biorhythmsData.push( [new Date(i), []] );

      }

    },

    getDaysWeeksYears: function (birthday) {

      if (!birthday) {

        return;

      }

      var now = calculator.makers.getDateObj();

      // make set of arrays [ Date, [] ] to be later filled in with corresponding data for table
      calculator.makers.stuffBiorhythmsDataWithDates(now);

      var timeBetw1970AndBirthday = Date.parse(now) - Date.parse(birthday);

      var daysLived = 0;

      var monthsLived = 0;

      if (timeBetw1970AndBirthday < 0) { /* if born before Jan 1 1970 */

        daysLived = Math.trunc( ( Math.abs(timeBetw1970AndBirthday) + Date.parse(now) ) / 1000 / 86400 );

        monthsLived = Math.floor( daysLived / 7 );

      } else {

        daysLived = Math.trunc(timeBetw1970AndBirthday / 1000 / 86400);

        monthsLived = Math.floor( daysLived / 7 );

      }

      function getHowManyYearsLived(birthday, now) {

        var yearsLived = now.getFullYear() - birthday.getFullYear();

        var monthsCompared = now.getMonth() - birthday.getMonth();

        var datesCompared = now.getDate() - birthday.getDate();

        if (yearsLived < 0) {
          // just in case if no-future date validation crashed (in input tag)
          console.warn('Birthday is future compared to the current day.');

        } else if (yearsLived === 0) {

          return yearsLived;

        } else {
          // if current year > birthday year
          if (monthsCompared > 0) {

            return yearsLived;

          } else if (monthsCompared < 0) {

            return yearsLived - 1;

          } else {
            // if months are equal
            if (datesCompared >= 0) {

              return yearsLived;

            } else {

              return yearsLived - 1;

            }
          }
        }

      } // [ END ] of getHowManyYearsLived (inner func of calculator.makers.getDaysWeeksYears)

      calculator.makers.calcBiorhythmsData(daysLived);

      $log.log('biorhythmsData: ', calculator.biorhythmsData);

      return [daysLived, monthsLived, getHowManyYearsLived(birthday, now), calculator.biorhythmsData];

    }, // ---------- [ END ] of calculator.makers.getDaysWeeksYears ----------

    calcBiorhythmsData: function(days) {

      var biorsArr = calculator.biorhythmsData;

      for (var i = 0; i < 30; i ++) {

        // prevent bulking values in the array from previous function calls
        biorsArr[i][1] = [];

        for (var y = 0; y < 3; y ++) {

          // physical biorhythm lasts 23 days, emotional - 28, intellectual - 33
          var biorhythm = [23, 28, 33];

          var valOfBior = Math.sin( 2 * Math.PI * (days / biorhythm[y]) );

          valOfBior = (valOfBior * 100).toFixed(1);

          if (valOfBior === '0.0' || valOfBior === '-0.0') {

            valOfBior = 0;

          }

          biorsArr[i][1].push(Number(valOfBior));

        }

        days += 1;

      }

    } // ---------- [ END ] of calculator.makers.calcBiorhythmsData ----------

  }; // ==================== [ END ] of calculator.makers ====================

  return calculator;

}]);
