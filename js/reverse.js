document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const targetDiameterInput = document.getElementById('target-diameter');
  const holesCountSlider = document.getElementById('holes-count');
  const holesValueText = document.getElementById('holes-value');
  const calcTypeRadios = document.querySelectorAll(
    'input[name="calculation-type"]'
  );
  const ratioContainer = document.getElementById('ratio-container');
  const ratioInput = document.getElementById('ratio');
  const calculateBtn = document.getElementById('calculate-reverse-btn');
  const solutionsContainer = document.getElementById('solutions');

  // Update holes count text when slider changes
  holesCountSlider.addEventListener('input', () => {
    const count = holesCountSlider.value;
    const text =
      count === '1'
        ? 'отверстие'
        : count >= '2' && count <= '4'
        ? 'отверстия'
        : 'отверстий';
    holesValueText.textContent = `${count} ${text}`;
  });

  // Show/hide ratio input based on calculation type
  calcTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      ratioContainer.style.display =
        radio.value === 'custom' ? 'block' : 'none';
    });
  });

  // Function to round to nearest step
  function roundToStep(value, step) {
    return Math.round(value / step) * step;
  }

  // Function to calculate equivalent diameter from array of diameters
  function getEquivalentDiameter(diameters) {
    let totalArea = 0;
    diameters.forEach(d => {
      const diameter = parseFloat(d);
      totalArea += Math.PI * Math.pow(diameter / 2, 2);
    });

    const equivalentDiameter = Math.sqrt((4 * totalArea) / Math.PI);
    return equivalentDiameter.toFixed(2);
  }

  // Function to round array of diameters while maintaining total area
  function roundDiametersToTen(diameters) {
    // Calculate original total area
    let totalArea = 0;
    diameters.forEach(d => {
      const diameter = parseFloat(d);
      totalArea += Math.PI * Math.pow(diameter / 2, 2);
    });

    // Round all diameters except the last one
    const roundedDiameters = diameters.map((d, i) => {
      if (i < diameters.length - 1) {
        return roundToStep(parseFloat(d), 0.1).toFixed(1);
      }
      return d;
    });

    // Calculate area of rounded diameters (except last)
    let roundedArea = 0;
    for (let i = 0; i < roundedDiameters.length - 1; i++) {
      const diameter = parseFloat(roundedDiameters[i]);
      roundedArea += Math.PI * Math.pow(diameter / 2, 2);
    }

    // Calculate remaining area for the last diameter
    const remainingArea = totalArea - roundedArea;

    // Calculate the last diameter based on remaining area
    const lastDiameter = Math.sqrt((4 * remainingArea) / Math.PI);

    // Update the last diameter in the array
    roundedDiameters[roundedDiameters.length - 1] = roundToStep(
      lastDiameter,
      0.1
    ).toFixed(1);

    return roundedDiameters;
  }

  // Calculate equal diameters
  function calculateEqualDiameters(targetDiameter, holesCount) {
    // Calculate area from target diameter
    const totalArea = Math.PI * Math.pow(targetDiameter / 2, 2);

    // Calculate individual hole area (equal areas)
    const individualArea = totalArea / holesCount;

    // Calculate individual diameter
    const individualDiameter = Math.sqrt((4 * individualArea) / Math.PI);

    return Array(holesCount).fill(individualDiameter.toFixed(2));
  }

  // Calculate custom ratio diameters
  function calculateCustomRatioDiameters(
    targetDiameter,
    holesCount,
    ratioString
  ) {
    // Parse ratio
    const ratios = ratioString.split(':').map(r => parseFloat(r.trim()));

    if (ratios.length !== holesCount || ratios.some(isNaN)) {
      throw new Error(
        `Пожалуйста, укажите ${holesCount} числа через двоеточие`
      );
    }

    // Calculate total area from target diameter
    const totalArea = Math.PI * Math.pow(targetDiameter / 2, 2);

    // Calculate sum of ratio values
    const ratioSum = ratios.reduce((sum, ratio) => sum + ratio, 0);

    // Calculate diameters based on ratios
    const diameters = ratios.map(ratio => {
      const areaRatio = ratio / ratioSum;
      const area = totalArea * areaRatio;
      return Math.sqrt((4 * area) / Math.PI).toFixed(2);
    });

    return diameters;
  }

  // Generate HTML for solutions
  function displaySolutions(diameters, type) {
    const title =
      type === 'equal'
        ? 'Отверстия с одинаковым диаметром'
        : 'Отверстия с указанным соотношением';

    const solutionHTML = `
      <div class="solution-card">
        <div class="solution-title">${title}</div>
        <div class="solution-values">
          ${diameters
            .map(
              (d, i) => `
            <div class="solution-value">Д${i + 1}: ${d} мм</div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    solutionsContainer.innerHTML = solutionHTML;
  }

  // Generate alternative solutions
  function generateAlternativeSolutions(targetDiameter, holesCount) {
    let solutions = [];

    if (holesCount === 2) {
      // Generate some common ratios for 2 holes
      const ratio21 = calculateCustomRatioDiameters(targetDiameter, 2, '2:1');
      const roundedRatio21 = roundDiametersToTen(ratio21);
      const actualDiameter21 = getEquivalentDiameter(roundedRatio21);

      solutions.push({
        title: `Вариант 1: Соотношение 2:1 (экв. диаметр: ${actualDiameter21} мм)`,
        diameters: roundedRatio21,
      });

      const ratio32 = calculateCustomRatioDiameters(targetDiameter, 2, '3:2');
      const roundedRatio32 = roundDiametersToTen(ratio32);
      const actualDiameter32 = getEquivalentDiameter(roundedRatio32);

      solutions.push({
        title: `Вариант 2: Соотношение 3:2 (экв. диаметр: ${actualDiameter32} мм)`,
        diameters: roundedRatio32,
      });
    } else if (holesCount === 3) {
      // Generate some common ratios for 3 holes
      const ratio211 = calculateCustomRatioDiameters(
        targetDiameter,
        3,
        '2:1:1'
      );
      const roundedRatio211 = roundDiametersToTen(ratio211);
      const actualDiameter211 = getEquivalentDiameter(roundedRatio211);

      solutions.push({
        title: `Вариант 1: Соотношение 2:1:1 (экв. диаметр: ${actualDiameter211} мм)`,
        diameters: roundedRatio211,
      });

      const ratio121 = calculateCustomRatioDiameters(
        targetDiameter,
        3,
        '1:2:1'
      );
      const roundedRatio121 = roundDiametersToTen(ratio121);
      const actualDiameter121 = getEquivalentDiameter(roundedRatio121);

      solutions.push({
        title: `Вариант 2: Соотношение 1:2:1 (экв. диаметр: ${actualDiameter121} мм)`,
        diameters: roundedRatio121,
      });
    } else if (holesCount === 4) {
      // Generate some common ratios for 4 holes
      const ratio1122 = calculateCustomRatioDiameters(
        targetDiameter,
        4,
        '1:1:2:2'
      );
      const roundedRatio1122 = roundDiametersToTen(ratio1122);
      const actualDiameter1122 = getEquivalentDiameter(roundedRatio1122);

      solutions.push({
        title: `Вариант 1: Соотношение 1:1:2:2 (экв. диаметр: ${actualDiameter1122} мм)`,
        diameters: roundedRatio1122,
      });

      const ratio2112 = calculateCustomRatioDiameters(
        targetDiameter,
        4,
        '2:1:1:2'
      );
      const roundedRatio2112 = roundDiametersToTen(ratio2112);
      const actualDiameter2112 = getEquivalentDiameter(roundedRatio2112);

      solutions.push({
        title: `Вариант 2: Соотношение 2:1:1:2 (экв. диаметр: ${actualDiameter2112} мм)`,
        diameters: roundedRatio2112,
      });
    }

    let solutionsHTML = '';
    solutions.forEach(solution => {
      solutionsHTML += `
        <div class="solution-card">
          <div class="solution-title">${solution.title}</div>
          <div class="solution-values">
            ${solution.diameters
              .map(
                (d, i) => `
              <div class="solution-value">Д${i + 1}: ${d} мм</div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    });

    return solutionsHTML;
  }

  // Handle calculate button click
  calculateBtn.addEventListener('click', () => {
    // Get values
    const targetDiameter = parseFloat(targetDiameterInput.value);
    const holesCount = parseInt(holesCountSlider.value);
    const calculationType = document.querySelector(
      'input[name="calculation-type"]:checked'
    ).value;

    // Clear previous solutions
    solutionsContainer.innerHTML = '';

    // Validate input
    if (isNaN(targetDiameter) || targetDiameter <= 0) {
      solutionsContainer.innerHTML = `<div class="error-message">Пожалуйста, введите положительное значение диаметра</div>`;
      return;
    }

    try {
      let diameters;
      let solutionsHTML = '';

      // Calculate based on type
      if (calculationType === 'equal') {
        diameters = calculateEqualDiameters(targetDiameter, holesCount);
        const roundedDiameters = roundDiametersToTen(diameters);
        const actualDiameter = getEquivalentDiameter(roundedDiameters);

        solutionsHTML = `
          <div class="solution-card">
            <div class="solution-title">Отверстия с одинаковым диаметром (экв. диаметр: ${actualDiameter} мм)</div>
            <div class="solution-values">
              ${roundedDiameters
                .map(
                  (d, i) => `
                <div class="solution-value">Д${i + 1}: ${d} мм</div>
              `
                )
                .join('')}
            </div>
          </div>
        `;

        // Add alternative solutions
        solutionsHTML += generateAlternativeSolutions(
          targetDiameter,
          holesCount
        );
      } else {
        // Custom ratio calculation
        const ratioString = ratioInput.value.trim();

        if (!ratioString) {
          solutionsContainer.innerHTML = `<div class="error-message">Пожалуйста, укажите соотношение</div>`;
          return;
        }

        diameters = calculateCustomRatioDiameters(
          targetDiameter,
          holesCount,
          ratioString
        );

        const roundedDiameters = roundDiametersToTen(diameters);
        const actualDiameter = getEquivalentDiameter(roundedDiameters);

        solutionsHTML = `
          <div class="solution-card">
            <div class="solution-title">Отверстия с соотношением ${ratioString} (экв. диаметр: ${actualDiameter} мм)</div>
            <div class="solution-values">
              ${roundedDiameters
                .map(
                  (d, i) => `
                <div class="solution-value">Д${i + 1}: ${d} мм</div>
              `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      // Display solutions
      solutionsContainer.innerHTML = solutionsHTML;

      // Add highlight animation
      document.querySelectorAll('.solution-card').forEach(card => {
        card.classList.add('highlight');
        setTimeout(() => {
          card.classList.remove('highlight');
        }, 1000);
      });
    } catch (error) {
      solutionsContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
    }
  });

  // Add Enter key support
  targetDiameterInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      calculateBtn.click();
    }
  });

  ratioInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      calculateBtn.click();
    }
  });
});
