//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
    console.log(message);
    }
}
log(`Test!`);
document.body.classList.add("body-img-background");

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

//element to store result
let finalResult = []
log(`Start result list is: ${JSON.stringify(finalResult)}`);


//global object for main work value
let currentCalculation = {
    volume: null,
    concreteClass: null
};

function calculateMaterials() {
    currentCalculation.volume = parseFloat(volumeElement.value.trim());
    currentCalculation.concreteClass = concreteClassElement.value;

    if (!currentCalculation.volume || currentCalculation.volume <= 0) {
        alert("Please enter a valid volume!");
        return;
    }

    const recipe = concreteRecipes[currentCalculation.concreteClass];
    if (!recipe) {
        alert("Invalid concrete class selected!");
        return;
    }

    //reset store element
    finalResult = [];

    const requiredMaterials = {
        cement: recipe.cement * currentCalculation.volume,
        sand: recipe.sand * currentCalculation.volume,
        gravel: recipe.gravel * currentCalculation.volume,
        water: recipe.water * currentCalculation.volume
    };

    finalResult.push(requiredMaterials);
    volumeElement.value = "";
        document.body.classList.remove("body-img-background");

    updateUI();
}

function unitConversion() {
    finalResult.forEach((item) => {
        
    })
}

function updateUI() {
    result.innerHTML = "";

    finalResult.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.setAttribute("id", "result-container");
        resultDiv.innerHTML = `<h4>The quantities of materials needed for:  ${currentCalculation.volume} m³ of concrete, according to the chosen recipe " ${currentCalculation.concreteClass} ",  are :</h4>`;    
        
        const resultCement = document.createElement("p");
        resultCement.setAttribute("class", "item-value");
        resultCement.innerHTML = `<span class="row-label">- Cement: </span> <span class="row-value">${item.cement} kg.</span> ( <span class="row-value">${(item.cement)/40} bags of 40 kg )`
    
        const resultSand = document.createElement("p")
        resultSand.setAttribute("class", "item-value");
        resultSand.innerHTML = `<span class="row-label">- Sand: </span> <span class="row-value">${item.sand} kg.</span> ( <span class="row-value">${((item.sand)/1550).toFixed(2)} m³) `
    
        const resultGravel = document.createElement("p")
        resultGravel.setAttribute("class", "item-value");
        resultGravel.innerHTML = `<span class="row-label">- Gravel: </span> <span class="row-value">${item.gravel} kg.</span> ( <span class="row-value">${((item.gravel)/1550).toFixed(2)} m³)`
    
        const resultWater = document.createElement("p")
        resultWater.setAttribute("class", "item-value");
        resultWater.innerHTML = `<span class="row-label">- Water: </span> <span class="row-value">${item.water} liter.</span> ( <span class="row-value">${((item.water)/10).toFixed(2)} buckets at 10 liter)`

        resultDiv.appendChild(resultCement);
        resultDiv.appendChild(resultSand);
        resultDiv.appendChild(resultGravel);
        resultDiv.appendChild(resultWater);

        result.appendChild(resultDiv);

    })
    
log(`Current result list is: ${JSON.stringify(finalResult)}`);

}