'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope, $filter) {
  var $ctrl = this;
  $ctrl.birthdayMax = new Date();
  $ctrl.birthday = null;

  function countDaysBetweenDates(date1, date2) {
    return Math.ceil(Math.abs(date2 - date1) / 1000 / 86400); // with current day
  }

  $ctrl.yourResult = function () {
    var bDay = $filter('date')($ctrl.birthday);
    console.log('A user provided birthday: ', bDay);
    var now = new Date();
    console.log('now: ', now);

    // TODO: you have similar names for variables and functions: daysLived vs yearsLived. When you need to use one of them,
    // TODO: how do you know should you call function or use variable? Function name should contain verb in name.
    function yearsLived (b, n) {
      // b - birthday, n - now
      function nums(arr) {
        var split = arr.split('-');
        var newArr = [null];
        split.forEach(function(el){ newArr.push(Number(el)) });
        newArr.shift();
        return newArr;
      }
      var datesAsNums = [nums(b), nums(n)];
      var BD = datesAsNums[0]; /* birthday */
      var NW = datesAsNums[1]; /* now */
      var isBirthdayPassedThisYear = true;
      var years = NW[0] - BD[0];
      console.log('isBirthdayPassedThisYear: ' + isBirthdayPassedThisYear);
      console.log('years a person has lived: ' + years);

      compareDates: if (NW[0] - BD[0] !== 0) {
        // compare months
        if (NW[1] - BD[1] < 0) {
          isBirthdayPassedThisYear = false;
          // stop if current year's month (e.g. Apr) is less than birthday month (e.g. Oct);
          // i.e. this year the person hasn't yet updated his age
          break compareDates;
        } else if (NW[1] - BD[1] > 0) {
          break compareDates;
        } else {
          // in case if months coincide check days, isBirthdayPassedThisYear is true at the moment
          if (NW[2] - BD[2] < 0) {
            isBirthdayPassedThisYear = false;
            console.log('at the moment compareDays console calling: ' + isBirthdayPassedThisYear);
          }
        }
      }

      console.log('isBirthdayPassedThisYear: ' + isBirthdayPassedThisYear);

      if (isBirthdayPassedThisYear === false) {
        years = years - 1;
      }

      console.log('years AFTER CORRECTION: ' + years);

      return years;
    }

    function calculateBiorhythms (daysLived) {
      var rows = [];

      var daysNowAndTillEnd = currentMonthDaysLeft();
      console.log('daysNowAndTillEnd: ' + daysNowAndTillEnd[0] + ' and ' + daysNowAndTillEnd[1]);

      function getMonthAndYear() {
        var a = $filter('date')($ctrl.birthdayMax, 'MMM-yyyy');
        return ' ' + a.replace(/-/g, ' ');
      }

      function stringifyVals () {
        for (var y = 0; y < rows.length; y++) {
          for (var x = 1; x < 6; x += 2) {
            rows[y][x] = (rows[y][x] * 100).toFixed(1) + '%';
            //make zero be a single digit (and colourless in insertValsInArr)
            if (rows[y][x] === '0.0%' || rows[y][x] === '-0.0%') {
              rows[y][x] = 0;
            }
          }
        }
      }

      function insertValsInArr (bior, num) {
        if(bior === 0) {
           rows[num].push(bior);
           rows[num].push('nocolor');
        } else if(bior > 0) {
           rows[num].push(bior);
           rows[num].push('green');
        } else {
           rows[num].push(bior);
           rows[num].push('red');
        }
      }

      for (var i = 0; i < daysNowAndTillEnd[1]; i++) {

        rows[i] = [daysNowAndTillEnd[0].toString().concat(getMonthAndYear())];

        var phys = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 23).toFixed(4));
        insertValsInArr(phys, i);

        var emot = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 28).toFixed(4));
        insertValsInArr(emot, i);

        var intel = Number(Math.sin(2 * Math.PI * (daysLived - 1) / 33).toFixed(4));
        insertValsInArr(intel, i);

        daysLived = Number(daysLived);
        daysLived += 1;
        daysNowAndTillEnd[0] += 1;
      }

      stringifyVals();
      console.log('data for table rows: ', rows);

      return rows;
    } /* [END] of calculateBiorhythms */

    function currentMonthDaysLeft() {
      var a = new Date();
      var today = '' + a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate();
      var day = Number(today.slice(8));
      var keepToday = Number(today.slice(8));

      do {
        day += 1;
        today = today.slice(0, 8).concat(day);
      } while (typeof Date.parse(today) === "number" && isNaN(Date.parse(today)) !== true);
      // returns today's date and days left to the end of the current month (including curr.day; gives q of rows for table)
      return [keepToday, day - keepToday];
    }

    var daysLived = countDaysBetweenDates(new Date(), $ctrl.birthday);
    var weeksLived = Math.floor(daysLived / 7);

    $ctrl.dataForDay = calculateBiorhythms(daysLived);

    $ctrl.howManyLived = {
      days: ['You are', daysLived - 1, 'days, '], /* current day is added to sum of days */
      weeks: [weeksLived, ' weeks, and '],
      years: [yearsLived(bDay, now), ' years old by now.']
    };

  }; /* [END] of yourResult */

}
