const kWInput = document.getElementById('kW');
const convertButton = document.getElementById('convert');
const resultElement = document.getElementById('result');

convertButton.addEventListener('click', () => {
  const kWValue = parseFloat(kWInput.value);
  if (!isNaN(kWValue)) {
    const hpValue = kWValue * 1.34102;
    resultElement.textContent = `${kWValue} kW is equal to ${hpValue.toFixed(2)} HP`;
  } else {
    resultElement.textContent = 'Please enter a valid number';
  }
});