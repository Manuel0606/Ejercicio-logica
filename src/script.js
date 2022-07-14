"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv = require("fast-csv");
function iniciar() {
    fs.createReadStream('./src/time_series_covid19_deaths_US.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', function (error) { return console.log('read finished'); })
        .on('data', function (data) { return dataCSV(data); })
        .on('end', function () { return results(); });
}
iniciar();
var country;
function createProvinceState(name, accumulatedDeads, population) {
    var province = {
        name: name,
        accumulatedDeads: accumulatedDeads,
        population: population
    };
    country[country.length] = province;
}
function dataCSV(data) {
    var dataList = Object.entries(data)[Object.entries(data).length - 1];
    var countryPosition = country[country.length - 1];
    var aux = typeof dataList[1] === 'string' ? dataList[1] : 'undefined';
    if (country.length === 0 || countryPosition.name !== data.Province_State) {
        createProvinceState(data.Province_State, parseInt(aux), parseInt(data.Population));
    }
    else if (countryPosition.name === data.Province_State) {
        countryPosition.accumulatedDeads += parseInt(aux);
        countryPosition.population += parseInt(data.Population);
    }
}
function results() {
    var largestAccumulated = {
        name: '',
        accumulate: 0
    };
    var cumulativeMinor = {
        name: '',
        accumulate: 0
    };
    var largestPercentage = {
        name: '',
        percentage: 0.0
    };
    var percentageAux = 0.0;
    for (var i = 0; i < country.length; i++) {
        var element = country[i];
        if (i === 0) {
            largestAccumulated.name = element.name;
            largestAccumulated.accumulate = element.accumulatedDeads;
        }
        else if (element.accumulatedDeads > largestAccumulated.accumulate) {
            largestAccumulated.name = element.name;
            largestAccumulated.accumulate = element.accumulatedDeads;
        }
        if (i === 0) {
            cumulativeMinor.name = element.name;
            cumulativeMinor.accumulate = element.accumulatedDeads;
        }
        else if (element.accumulatedDeads < cumulativeMinor.accumulate) {
            cumulativeMinor.name = element.name;
            cumulativeMinor.accumulate = element.accumulatedDeads;
        }
        else if (element.accumulatedDeads === cumulativeMinor.accumulate) {
            cumulativeMinor.name += ', ' + element.name;
        }
        var percentageDeads = element.accumulatedDeads === 0
            ? 0
            : (element.accumulatedDeads * 100) / element.population;
        if (i === 0) {
            percentageAux = percentageDeads;
            largestPercentage.name = element.name;
            largestPercentage.percentage = percentageDeads;
        }
        else if (percentageAux < percentageDeads &&
            percentageDeads !== Infinity) {
            percentageAux = percentageDeads;
            largestPercentage.name = element.name;
            largestPercentage.percentage = percentageDeads;
        }
        console.log('Estado: ' +
            element.name +
            ', Porcentaje de muertes: ' +
            percentageDeads +
            '%, Población: ' +
            element.population);
    }
    console.log('\nEstado con mayor acumulado a la fecha: ' + largestAccumulated.name);
    console.log('\nEstado con menor acumulado a la fecha: ' + cumulativeMinor.name);
    console.log('\nEl estado más afectado es ' +
        largestPercentage.name +
        ' ' +
        percentageAux +
        ' porque tiene el mayor porcentaje de muertes con relación a su población');
}
