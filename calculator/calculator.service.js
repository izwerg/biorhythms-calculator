'use strict';

myApp.factory('calculateBiorhythms', function() {
  return function(days) {
    var biorhythmsData = [];
    var now = new Date();
    var thirtyDays = Date.now() + (86400000 * 30);
    var biorhythm = [23, 28, 33];
    var biorName = ['physical', 'emotional', 'intellectual'];

    if (!biorhythmsData[0]) {
      for (var x = Date.now(); x < thirtyDays; x += 86400000) {
        var day = new Date(x);
        biorhythmsData.push({date: day, physical: null, emotional: null, intellectual: null});
      }
    }

    for (var n = 0; n < 30; n++) {
      for (var k = 0; k < 3; k++) {
        biorhythmsData[n][biorName[k]] = Math.round(Math.sin(2 * Math.PI * (days / biorhythm[k])) * 100);
      }
      days += 1;
    }

    return biorhythmsData;
  };
});
