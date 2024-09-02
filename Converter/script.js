function convert() {
    const kwInput = document.getElementById('kwInput').value;
    const kwToHp = 1.34102;  // Conversion factor from KW to HP
    const hp = kwInput * kwToHp;

    if (!isNaN(hp) && kwInput.trim() !== "") {
        document.getElementById('result').textContent = `${kwInput} KW is equal to ${hp.toFixed(2)} HP`;
    } else {
        document.getElementById('result').textContent = "Please enter a valid number!";
    }
}