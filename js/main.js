let holeCount = 2;

function calculateEquivalentDiameter(diameters) {
  let totalArea = 0;

  for (const diameter of diameters) {
    const area = Math.PI * Math.pow(diameter / 2, 2);
    totalArea += area;
  }

  const equivalentDiameter = Math.sqrt((4 * totalArea) / Math.PI);
  return equivalentDiameter.toFixed(2);
}

function calculateEquivalent() {
  const inputs = document.querySelectorAll('.diameter-input');
  const diameters = [];
  let hasEmptyInputs = false;
  let invalidInputs = false;

  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      hasEmptyInputs = true;
      input.classList.add('error');
    } else if (value <= 0) {
      invalidInputs = true;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
      diameters.push(value);
    }
  });

  const resultEl = document.getElementById('result');

  if (hasEmptyInputs) {
    resultEl.textContent = 'Пожалуйста, заполните все поля диаметров';
    resultEl.classList.add('error-message');
    return;
  }

  if (invalidInputs) {
    resultEl.textContent = 'Все диаметры должны быть положительными числами';
    resultEl.classList.add('error-message');
    return;
  }

  const equivalentDiameter = calculateEquivalentDiameter(diameters);
  resultEl.textContent = `Эквивалентный диаметр: ${equivalentDiameter} мм`;
  resultEl.classList.remove('error-message');

  // Add animation effect
  resultEl.classList.add('highlight');
  setTimeout(() => {
    resultEl.classList.remove('highlight');
  }, 1000);
}

function addHole() {
  holeCount++;
  const inputsContainer = document.getElementById('inputs-container');

  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';

  const label = document.createElement('label');
  label.setAttribute('for', `diameter${holeCount}`);
  label.textContent = `Диаметр отверстия ${holeCount} (мм):`;

  const input = document.createElement('input');
  input.type = 'number';
  input.id = `diameter${holeCount}`;
  input.className = 'diameter-input';
  input.step = '0.01';
  input.placeholder = 'Введите диаметр';

  // Add event listener for validation
  input.addEventListener('input', function () {
    if (this.value === '' || parseFloat(this.value) <= 0) {
      this.classList.add('error');
    } else {
      this.classList.remove('error');
    }
  });

  inputGroup.appendChild(label);
  inputGroup.appendChild(input);

  // Add with animation
  inputGroup.style.opacity = '0';
  inputsContainer.appendChild(inputGroup);

  setTimeout(() => {
    inputGroup.style.opacity = '1';
    input.focus();
  }, 10);
}

function removeHole() {
  if (holeCount <= 2) {
    alert('Минимальное количество отверстий: 2');
    return;
  }

  const inputsContainer = document.getElementById('inputs-container');
  const lastInput = inputsContainer.lastChild;

  // Remove with animation
  lastInput.style.opacity = '0';

  setTimeout(() => {
    inputsContainer.removeChild(lastInput);
    holeCount--;
  }, 300);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add hole button
  document.getElementById('add-hole').addEventListener('click', addHole);

  // Remove hole button
  document.getElementById('remove-hole').addEventListener('click', removeHole);

  // Calculate button
  document
    .getElementById('calculate-btn')
    .addEventListener('click', calculateEquivalent);

  // Add validation to initial inputs
  document.querySelectorAll('.diameter-input').forEach(input => {
    input.addEventListener('input', function () {
      if (this.value === '' || parseFloat(this.value) <= 0) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
  });

  // Add Enter key support
  document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      calculateEquivalent();
    }
  });
});
