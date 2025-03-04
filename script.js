//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
    console.log(message);
    }
}
log(`Test!`);

//get reference to the DOM elements
let concreteClassElement = document.getElementById("concreteClass");
let volumeElement = document.getElementById("volume");
let calculateBtn = document.getElementById("calculate-btn");
let result = document.getElementById("result");


calculateBtn.addEventListener("click", calculateMaterials);

//object with concrete mix recipes for different class
const concreteRecipes = {
    "C8/10": { cement: 170, sand: 650, gravel: 1050, water: 150 },
    "C12/15": { cement: 210, sand: 600, gravel: 1100, water: 160 },
    "C16/20": { cement: 275, sand: 550, gravel: 1050, water: 160 },
    "C20/25": { cement: 325, sand: 500, gravel: 1025, water: 150 },
    "C25/30": { cement: 375, sand: 450, gravel: 1000, water: 140 },
    "C30/37": { cement: 425, sand: 400, gravel: 975, water: 130 }
};

function calculateMaterials() {
    const concreteClass = concreteClassElement.value;
    const volume = parseFloat(volumeElement.value.trim());

    //validate input
    if (!volume || volume <= 0) {
        alert("Please enter a valid volume !");
        return;
    }

    //retrieve the selected concrete recipe
    const recipe = concreteRecipes[concreteClass];


    //calculate required quantities for a given volume

    const requiredMaterials = {
        cement: recipe.cement * volume,
        sand: recipe.sand * volume,
        gravel: recipe.gravel * volume,
        water: recipe.water * volume
    };

    //display results
    result.innerHTML = `
    <h3>Required materials for ${volume} m³ of ${concreteClass} concrete:</h3>
    <p><span id="row-label">Cement: </span> ${requiredMaterials.cement} kg</p>
    <p><span id="row-label">Sand: </span> ${requiredMaterials.sand} kg</p>
    <p><span id="row-label">Gravel: </span> ${requiredMaterials.gravel} kg</p>
    <p><span id="row-label">Water: </span> ${requiredMaterials.water} liters</p>

    `

}