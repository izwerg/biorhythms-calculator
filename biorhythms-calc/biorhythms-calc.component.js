'use strict';

angular.module('myApp').component('biorhythmsCalc', {
  templateUrl: 'biorhythms-calc/biorhythms-calc.template.html',
  controller: BiorhythmsCalcController
});

function BiorhythmsCalcController($scope, $filter, $log, calculator) {
  var $ctrl = this;
  var result = 0;
  $ctrl.birthdayMax = new Date();
  $ctrl.birthdayMin = new Date('Jan 1 1900');
  $ctrl.birthday = null;
  $log.log(calculator);

  $ctrl.setColor = function(num) {
    if (num > 0) {
      return 'positive';
    } else if (num < 0) {
      return 'negative';
    } else {
      return 'nocolor';
    }
  };

  $ctrl.getYourResult = function () {
    $log.log('A user submitted birthday: ', $filter('date')($ctrl.birthday));
    result = calculator.getValues($ctrl.birthday);
    $log.log('result: ', result);
    $ctrl.howManyLived = 'You are ' + result.daysLived + ' days, ' + result.weeksLived + ' weeks, and ' + result.yearsLived + ' years old by now.';
    $ctrl.calculated = true;
    $ctrl.tableData = result.biorhythmsData;
  };
}
