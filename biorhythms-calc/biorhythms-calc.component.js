'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope) {

  // Alias which allows copy-pasting between template and controller without changing 'this' to '$ctrl' and vice versa
  var $ctrl = this;

  $ctrl.birthdayMax = new Date();

  $ctrl.yourResult = function () { /* 2nd func is called; contains all other functions */
    var bD = document.querySelector('#birthday');
    var bDay = document.querySelector('#birthday').value;
    console.log('A user provided birthday: ' + bDay);
    var bDAsNum = bD.valueAsNumber;
    var now = document.querySelector('#birthday').getAttribute('max');
    if (bDay === '' || bDAsNum > Date.parse(now)) {
      console.log('No date or a future date provided');
      return;
    }

    var fullDaysFromBirth = function () {
      var bDayMs = Date.now() - Date.parse(bDay);
      var qOfDays = (a) => {
        return (bDayMs / 1000 / 86400).toFixed();
      };
      var days = qOfDays(bDay);
      calculateBiorhythms(days);
    };

    var rows = [null];
    var daysLived = null;
    var weeksLived = null;

    var yearsLived = function (b, n) {
      // b - birthday, n - now
      var nums = function(arr) {
        var split = arr.split('-');
        var newArr = [null];
        split.forEach(function(el){newArr.push(Number(el))});
        newArr.shift();
        return newArr;
      };
      var datesAsNums = [nums(b), nums(n)];
      var BD = datesAsNums[0]; /* birthday */
      var NW = datesAsNums[1]; /* now */
      var BDpassed = true;
      var years = NW[0]-BD[0];
      console.log('BD: ', BD);
      console.log('NW: ', NW);
      console.log('BDpassed: ' + BDpassed);
      console.log('years a person has lived: ' + years);

      compareDates: if (NW[0]-BD[0] !== 0) {
        // compare months
        if (NW[1]-BD[1] < 0) {
          BDpassed = false;
          // stop if current year's month (e.g. Apr) is less than birthday month (e.g. Oct); i.e. this year the person hasn't yet updated his age
          break compareDates;
        } else if (NW[1]-BD[1] > 0) {
          break compareDates;
        } else {
          // in case if months coincide check days, BDpassed at the moment is true
          if (NW[2]-BD[2] < 0) {
            BDpassed = false;
            console.log('BDpassed compareDays console calling: ' + BDpassed);
          }
        }
      }

      console.log('BDpassed: ' + BDpassed);

      if (BDpassed === false) {
        years = years-1;
      }

      console.log('years AFTER CORRECTION: ' + years);

      return years;
    };

    var calculateBiorhythms = function (val) {
      daysLived = val;
      console.log('daysLived: ', daysLived, ' (including current day)');
      weeksLived = (daysLived/7).toFixed(3).slice(0,-4);
      var daysNowAndTillEnd = currentMonthDaysLeft();
      console.log('daysNowAndTillEnd: ' + daysNowAndTillEnd[0] + ' and ' + daysNowAndTillEnd[1]);

      for (var i = 0; i < daysNowAndTillEnd[1]; i++) {
        function getMonthAndYear() {
          var months = ['Jan', 'Feb', 'Mar', 'Arp', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var a = new Date();
          var y = a.getFullYear();
          var m = a.getMonth();
          return ' '.concat(months[m]).concat(' ').concat(y);
        }

        rows[i] = [daysNowAndTillEnd[0].toString().concat(getMonthAndYear())];

        var phys = Number(Math.sin(2*3.14159265*(daysLived-1)/23).toFixed(4));
        insertValsInArr(phys);

        var emot = Number(Math.sin(2*3.14159265*(daysLived-1)/28).toFixed(4));
        insertValsInArr(emot);

        var intel = Number(Math.sin(2*3.14159265*(daysLived-1)/33).toFixed(4));
        insertValsInArr(intel);

        function insertValsInArr (bior) {
          bior === 0 ? rows[i].push(bior) && rows[i].push('nocolor') :
            bior > 0 ? rows[i].push(bior) && rows[i].push('green') :
              rows[i].push(bior) && rows[i].push('red');
        }

        daysLived = Number(daysLived);
        daysLived+=1;
        daysNowAndTillEnd[0]+=1;
      }

      function stringifyVals () {
        for (var y = 0; y < rows.length; y++) {
          for (var x = 1; x < 6; x+=2) {
            rows[y][x] = (rows[y][x] * 100).toFixed(1) + '%';
          }
        }
      }

      stringifyVals();
      console.log('data for table rows: ', rows);
    }; /* [END] of calculateBiorhythms */

    var currentMonthDaysLeft = function() {
      var a = new Date();
      var today = `${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`;
      var day = Number(today.slice(8));
      var keepToday = Number(today.slice(8));

      do {
        day+=1;
        today = today.slice(0,8).concat(day);
      } while (typeof Date.parse(today) === "number" && isNaN(Date.parse(today)) !== true);
      // returns today's date and days left to the end of the current month (including curr.day; gives q of rows for table)
      return [keepToday, day-keepToday];
    };

    fullDaysFromBirth();

    $ctrl.dataForDay = rows;

    $ctrl.howManyLived = {
      days: ['You have lived', daysLived-rows.length-1, 'days, '], /* if [ daysLived-rows.length ] current day is added to sum of days */
      weeks: [weeksLived, ' weeks, and '],
      years: [yearsLived(bDay, now), ' years by now.']
    };

  }; /* [END] of yourResult */

}
