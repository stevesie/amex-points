var AVAILABLE_POINTS_SELECTOR = '#pointsRemainingDiv',
    DOLLAR_AMOUNT_SELECTOR = '.RocAmountDiv',
    POINTS_NEEDED_SELECTOR = '.pointsdiv';

function elementToInt(el) {
  return parseInt($(el).text().replace(/\D/g,''), 10);
}

var availablePoints = elementToInt($(AVAILABLE_POINTS_SELECTOR)),
    values = $.map($(DOLLAR_AMOUNT_SELECTOR), elementToInt),
    weights = $.map($(POINTS_NEEDED_SELECTOR), elementToInt),
    optimalValue = 0,
    optimalSolution,
    m = [[]],
    d = [[]];

if (values.length != weights.length) {
  throw Error('Data extraction error, check selectors.');
}

// solve as a 0/1 knapsack problem
// https://en.wikipedia.org/wiki/Knapsack_problem

for (var i = 0; i < weights.length; i++) {
  if (weights[i] > availablePoints) {
    weights.splice(i, 1);
    values.splice(i, 1);
  }
}

for (var j = 0; j <= availablePoints; j++) {
  m[0][j] = 0;
  d[0][j] = [];
}

for (var i = 1; i <= values.length; i++) {
  for (var j = 0; j <= availablePoints; j++) {
    m[i] = m[i] || [];
    d[i] = d[i] || [];
    d[i][j] = d[i - 1][j];

    if (weights[i - 1] <= j) {
      m[i][j] = Math.max(m[i - 1][j], m[i - 1][j - weights[i - 1]] + values[i - 1]);
      if (m[i - 1][j - weights[i - 1]] + values[i - 1] > m[i - 1][j]) {
        var augmentSet = d[i - 1][j - weights[i - 1]].slice(0);
        augmentSet.push(weights[i - 1]);
        d[i][j] = augmentSet;
      }
    } else {
      m[i][j] = m[i - 1][j];
    }
  }
}

m.map(function(solution, i) {
  var localMaxValue = solution[availablePoints];
  if (localMaxValue > optimalValue) {
    optimalValue = localMaxValue;
    optimalSolution = i;
  }
});

console.log('Optimal value is: $' + optimalValue / 100);

if (optimalSolution) {
  console.log('Select these required point items for the maximum credit:');
  console.log(d[optimalSolution][availablePoints]);
} else {
  console.log('Could not find a solution.');
}
