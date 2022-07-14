

var lista = [];

function createProvinceStates(name, accumulated, population, deads){
  var province = {
    name: name,
    accumulated: accumulated,
    population: population,
    deads: deads
  };
  lista[lista.length] = province
}

// province.name = 'manuel'

createProvinceStates('manuel', '1', '2', '0');
createProvinceStates('alejandro', '3', '5', '3')

lista[0].name = 'laura';

console.log(lista)
