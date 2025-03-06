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
let generateSummaryBtn = document.getElementById("generate-summary-btn");

generateSummaryBtn.classList.add("isHidden");


// Initialize i18next for translations
i18next.init({
    lng: localStorage.getItem('language') || 'ro',  // Get saved language or default to Romanian
    debug: true,
    resources: {
        en: {
            translation: {
                "app-title": "concreteMetrics",
                "volume": "Volume",
                "volume-label": "Enter required volume (m³)",
                "concrete-class": "Concrete Class",
                "concreteClass-label": "Please choose concrete class",
                "calculate-btn": "Calculate",
                "result-title": "Materials required to obtain a quantity of : ",
                "result-title2": "of concrete, according to the chosen concrete class : ",
                "result-title3": ", are : ",
                "cement": "Cement",
                "sand": "Sand",
                "gravel": "Gravel",
                "water": "Water",
                "generate-summary-btn": "Generate summary",
                "session-title": "Session summary :",
                "summary-result-title": "Result no  "
            }
        },
        ro: {
            translation: {
                "app-title": "concreteMetrics",
                "volume": "Volum",
                "volume-label": "Introduceți volumul necesar (m³)",
                "concrete-class": "Clasa Beton",
                "concreteClass-label": "Vă rugăm să alegeți clasa de beton",
                "calculate-btn": "Calculează",
                "result-title": "Materialele necesare pentru obtinerea unei cantitati de : ",
                "result-title2": "de beton, conform clasei de beton alese : ",
                "result-title3": ", sunt: ",
                "cement": "Ciment",
                "sand": "Nisip",
                "gravel": "Pietriș",
                "water": "Apă",
                "generate-summary-btn": "Genereaza un sumar",
                "session-title": "Rezumatul sesiunii :",
                "summary-result-title": "Rezultatul nr "
            }
        }
    }
}, function(err, t) {
    updateUIWithTranslations();
});

// Function to update UI text based on selected language
function updateUIWithTranslations() {
    let appTitle = document.getElementById("app-title");
    let volumeInput = document.getElementById("volume");
    let volumeLabel = document.getElementById("volume-label");
    let concreteClassInput = document.getElementById("concreteClass");
    let concreteClassLabel = document.getElementById("concreteClass-label");
    let calculateBtn = document.getElementById("calculate-btn");
    let generateSummaryBtn = document.getElementById("generate-summary-btn");
    let sessionSummary = document.getElementById("session-summary");

    if (appTitle) appTitle.textContent = i18next.t("app-title");
    if (volumeInput) volumeInput.placeholder = i18next.t("volume");
    if (volumeLabel) volumeLabel.textContent = i18next.t("volume-label");
    if (concreteClassInput) concreteClassInput.placeholder = i18next.t("concrete-class");
    if (concreteClassLabel) concreteClassLabel.textContent = i18next.t("concreteClass-label");
    if (calculateBtn) calculateBtn.textContent = i18next.t("calculate-btn");
    if (generateSummaryBtn) generateSummaryBtn.textContent = i18next.t("generate-summary-btn");
    if(sessionSummary) sessionSummary.textContent=i18next.t("session-title")
}

// Change language and store preference in localStorage
document.getElementById("lang-ro").addEventListener("click", () => {
    i18next.changeLanguage("ro", updateUIWithTranslations);
    localStorage.setItem("language", "ro");
});

document.getElementById("lang-en").addEventListener("click", () => {
    i18next.changeLanguage("en", updateUIWithTranslations);
    localStorage.setItem("language", "en");
});

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

    //Calculate required material quantities
    const requiredMaterials = {
        cement: recipe.cement * currentCalculation.volume,
        sand: recipe.sand * currentCalculation.volume,
        gravel: recipe.gravel * currentCalculation.volume,
        water: recipe.water * currentCalculation.volume
    };

    finalResult.push(requiredMaterials);
    volumeElement.value = "";
    document.body.classList.remove("body-img-background");
    
    generateSummaryBtn.classList.remove("isHidden");

    updateUI();
}

function unitConversion() {
    finalResult.forEach((item) => {
        
    })
}

function updateUI() {
    let result = document.getElementById("result");
    result.innerHTML = "";

    finalResult.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.setAttribute("id", "result-container");

        // Display title with dynamic volume and class
        resultDiv.innerHTML = `<h4>${i18next.t("result-title")} ${currentCalculation.volume} m³, ${i18next.t("result-title2")} (${currentCalculation.concreteClass})${i18next.t("result-title3")}</h4>`;

        // Display calculated material amounts
        const resultCement = document.createElement("p");
        resultCement.innerHTML = `<span>${i18next.t("cement")}: </span> ${item.cement} kg`;

        const resultSand = document.createElement("p");
        resultSand.innerHTML = `<span>${i18next.t("sand")}: </span> ${item.sand} kg`;

        const resultGravel = document.createElement("p");
        resultGravel.innerHTML = `<span>${i18next.t("gravel")}: </span> ${item.gravel} kg`;

        const resultWater = document.createElement("p");
        resultWater.innerHTML = `<span>${i18next.t("water")}: </span> ${item.water} liters`;

        // Append all result elements to the container
        resultDiv.appendChild(resultCement);
        resultDiv.appendChild(resultSand);
        resultDiv.appendChild(resultGravel);
        resultDiv.appendChild(resultWater);
        result.appendChild(resultDiv);
    });
    log(`Current result list is: ${JSON.stringify(finalResult)}`);

}    

// summary modal

// let generateSummaryBtn = document.getElementById("generate-summary-btn");

generateSummaryBtn.addEventListener("click", () => {
    //check if there are data available
    if (finalResult.length === 0) {
        alert("No result to generate summary !");
        return
    }

    let summaryContent = document.getElementById("summary-content");
    //create a list of results
    let summaryList = document.createElement("ul");
    
finalResult.forEach((result, index) => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `
        <strong id="result-title">${i18next.t("summary-result-title")} ${index + 1} :</strong>
        <p>${i18next.t("cement")}: ${result.cement} kg</p>
        <p>${i18next.t("sand")}: ${result.sand} kg</p>
        <p>${i18next.t("gravel")}: ${result.gravel} kg</p>
        <p>${i18next.t("water")}: ${result.water} liters</p>
    `;
    summaryList.appendChild(listItem);
});

// Add list at modal container
summaryContent.innerHTML = `<h4>${i18next.t("result-title")} ${currentCalculation.volume} m³, ${i18next.t("result-title2")} (${currentCalculation.concreteClass})${i18next.t("result-title3")}</h4>`;
    summaryContent.appendChild(summaryList);
    
 //show modal
document.getElementById("summary-modal").style.display = "block";
   
});


// Event listener for closing the modal
let closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
    closeBtn.addEventListener("click", function() {
        document.getElementById("summary-modal").style.display = "none";
    });
}
// Event listener for printing the summary
document.getElementById("print-summary-btn").addEventListener("click", function() {
    window.print();
});


