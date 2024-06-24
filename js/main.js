function calculateEquivalentDiameter(d1, d2) {
  const area1 = Math.PI * Math.pow(d1 / 2, 2);
  const area2 = Math.PI * Math.pow(d2 / 2, 2);
  const totalArea = area1 + area2;

  const equivalentDiameter = Math.sqrt((4 * totalArea) / Math.PI);
  return equivalentDiameter.toFixed(2);
}

function calculateEquivalent() {
  const d1 = parseFloat(document.getElementById('diameter1').value);
  const d2 = parseFloat(document.getElementById('diameter2').value);

  if (isNaN(d1) || isNaN(d2)) {
    document.getElementById('result').textContent = 'Пожалуйста, введите оба диаметра.';
    return;
  }

  const equivalentDiameter = calculateEquivalentDiameter(d1, d2);
  document.getElementById('result').textContent = `Эквивалентный диаметр: ${equivalentDiameter} мм`;
}
