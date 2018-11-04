'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope, $filter, $log, calculator) {

  var $ctrl = this;

  var result = 0;

  $ctrl.birthdayMax = new Date();

  $ctrl.birthdayMin = new Date('Jan 1 100');

  $ctrl.birthday = null;

  $log.log('result before calling getYourResult(): ', result);

  $log.log(calculator);

  $ctrl.getYourResult = function () {

    $log.log('A user provided birthday: ', $filter('date')($ctrl.birthday));

    result = calculator.makers.getDaysWeeksYears($ctrl.birthday);

    $log.log('result [days, weeks, years, data for table]: ', result);

    $ctrl.howManyLived = {

      days: ['You are ', result[0], ' days, '],
      weeks: [result[1], ' weeks, and '],
      years: [result[2], ' years old by now.']

    };

    $ctrl.tableData = makePresentation(calculator.biorhythmsData);

    function makePresentation(arr) {

      var newArr = arr;

      var colors = {green: 'green', red: 'red', nocolor: 'nocolor'};

      for (var i = 0; i < newArr.length; i++) {

        // pos stands for position
        var pos = -2;

        for (var y = 0; y < 3; y++) {

          pos += 2;

          // stuff array with color values
          if (newArr[i][1][pos] < 0) {

            newArr[i][1].splice(pos + 1, 0, colors.red);

          } else if (newArr[i][1][pos] > 0) {

            newArr[i][1].splice(pos + 1, 0, colors.green);

          } else {

            newArr[i][1].splice(pos + 1, 0, colors.nocolor);

          }

          // make sure values have decimal number presentation, finish with '%'
          if (newArr[i][1][pos] !== 0) {

            newArr[i][1][pos] = newArr[i][1][pos].toFixed(1).concat('%');

          }

        }

      }

      return newArr;

    } // ---------- [ END ] of makePresentation ----------

  }; /* ==================== [ END ] of $ctrl.getYourResult ==================== */

}
