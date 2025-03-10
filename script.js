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
                "liters": "liters",
                "bags":"bags of 40 ",
                "generate-summary-btn": "Generate summary",
                "session-title": "Session summary :",
                "summary-result-title": "Result no  ",
                "print-summary-btn": "Print summary",
                "invalid-alert-message-txt": "Error: The input provided is not valid. Please enter a correct volume value to proceed !"

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
                "result-title": "Materialele necesare pentru obtinerea unei cantitati de = ",
                "result-title2": "de beton, conform clasei de beton aleasă - ",
                "result-title3": ",  sunt  : ",
                "cement": "Ciment",
                "sand": "Nisip",
                "gravel": "Pietriș",
                "water": "Apă",
                "liters": "litri",
                "bags":"saci de 40 ",
                "generate-summary-btn": "Genereaza un sumar",
                "session-title": "Rezumatul sesiunii :",
                "summary-result-title": "Rezultatul nr ",
                "print-summary-btn": "Tipareste sumar",
                "invalid-alert-message-txt": "Eroare: Datele introduse nu sunt valide. Vă rugăm să introduceți o valoare corectă pentru volum pentru a continua !"

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
    let printSummaryBtn =document.getElementById("print-summary-btn")

    if (appTitle) appTitle.textContent = i18next.t("app-title");
    if (volumeInput) volumeInput.placeholder = i18next.t("volume");
    if (volumeLabel) volumeLabel.textContent = i18next.t("volume-label");
    if (concreteClassInput) concreteClassInput.placeholder = i18next.t("concrete-class");
    if (concreteClassLabel) concreteClassLabel.textContent = i18next.t("concreteClass-label");
    if (calculateBtn) calculateBtn.textContent = i18next.t("calculate-btn");
    if (generateSummaryBtn) generateSummaryBtn.textContent = i18next.t("generate-summary-btn");
    if (sessionSummary) sessionSummary.textContent = i18next.t("session-title");
    if (printSummaryBtn) printSummaryBtn.textContent = i18next.t("print-summary-btn");
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
    "C8/10 (B100)": { cement: 190, sand: 900, gravel: 1050, water: 180 },
    "C12/15 (B150)": { cement: 240, sand: 800, gravel: 1100, water: 180 },
    "C16/20 (B200)": { cement: 290, sand: 800, gravel: 1150, water: 180 },
    "C20/25 (B250)": { cement: 340, sand: 700, gravel: 1200, water: 175 },
    "C25/30 (B300)": { cement: 390, sand: 700, gravel: 1250, water: 170 },
    "C30/37 (B350)": { cement: 450, sand: 650, gravel: 1300, water: 160 }
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
        alert(i18next.t("invalid-alert-message-txt"));
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


function updateUI() {
    let result = document.getElementById("result");
    result.innerHTML = "";

    finalResult.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.setAttribute("id", "result-container");

        // Display title with dynamic volume and class
        resultDiv.innerHTML = `<h4>${i18next.t("result-title")} ${currentCalculation.volume} m³, ${i18next.t("result-title2")} "${currentCalculation.concreteClass}" ${i18next.t("result-title3")}</h4>`;

        // Display calculated material amounts
        const resultCement = document.createElement("p");
        resultCement.innerHTML = `<span>${i18next.t("cement")}: </span> ${item.cement} kg, (\u2248 ${Math.round(item.cement/40)} <span>${i18next.t("bags")} kg)`;

        const resultSand = document.createElement("p");
        resultSand.innerHTML = `<span>${i18next.t("sand")}: </span> ${item.sand} kg`;

        const resultGravel = document.createElement("p");
        resultGravel.innerHTML = `<span>${i18next.t("gravel")}: </span> ${item.gravel} kg, ( ${i18next.t("sand")} + ${i18next.t("gravel")} : \u2248 ${((item.sand+item.gravel)/1500).toFixed(2)} m³)`;

        const resultWater = document.createElement("p");
        resultWater.innerHTML = `<span>${i18next.t("water")}: </span> ${item.water} ${i18next.t("liters")}`;

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
        <p>${i18next.t("cement")}: ${result.cement} kg, (\u2248 ${Math.round(result.cement/40)} <span>${i18next.t("bags")} kg)</p>
        <p>${i18next.t("sand")}: ${result.sand} kg</p>
        <p>${i18next.t("gravel")}: ${result.gravel} kg , ( ${i18next.t("sand")} + ${i18next.t("gravel")} : \u2248 ${((result.sand+result.gravel)/1500).toFixed(2)} m³)</p>
        <p>${i18next.t("water")}: ${result.water} ${i18next.t("liters")}</p>
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


// info-modal
// Object with concrete information in both languages ro/eng
const betonData = {
    ro: {
        title: "Cantități de materiale pentru prepararea betonului",
        description: "Cantitățile de materiale necesare pentru prepararea betonului depind de clasa betonului, tipul cimentului utilizat, rețeta de amestec și alți factori precum umiditatea agregatelor și raportul apă/ciment. Mai jos sunt prezentate rețete orientative pentru diverse clase de beton, exprimate în kg/m³",
        tableTitle: "Tabel cantități de materiale pentru 1 m³ de beton, valorile sunt aproximative și pot varia în funcție de sursa materialelor și metoda de preparare.",
        obsHead:"Observații : ",
        obs: [
            "  Ciment: Se utilizează de obicei ciment de tip CEM I 42.5R sau CEM II A/M 42.5R.",
            "  Raport apă/ciment (A/C): Valoarea trebuie să fie cât mai mică pentru o rezistență mai mare.",
            "  Agregate: Nisip (0-4 mm), pietriș (4-8 mm, 8-16 mm sau 16-32 mm).",
            "  Aditivi (opțional): Plastifianți, superplastifianți pentru reducerea apei și îmbunătățirea lucrabilității."
        ],
        columns: ["Clasa beton", "Ciment (kg)", "Nisip (kg)", "Pietriș (kg)", "Apă (litri)", "Raport A/C"],
        data: [
            ["C8/10 (B100)", "180-200", "850-900", "1000-1050", "180-200", "1,0-1,2"],
            ["C12/15 (B150)", "220-250", "750-850", "1050-1100", "170-190", "0,8-1,0"],
            ["C16/20 (B200)", "270-300", "700-800", "1100-1150", "170-190", "0,6-0,8"],
            ["C20/25 (B250)", "300-350", "650-750", "1150-1200", "160-180", "0,5-0,7"],
            ["C25/30 (B300)", "350-400", "600-700", "1200-1250", "150-170", "0,45-0,6"],
            ["C30/37 (B350)", "400-450", "550-650", "1250-1300", "140-160", "0,4-0,5"]
        ]
    },
    en: {
        title: "Material quantities for concrete preparation",
        description: "The material quantities required for concrete preparation depend on the concrete class, the type of cement used, the mixing recipe, and other factors such as aggregate moisture and water/cement ratio. Below are indicative recipes for various concrete classes, expressed in kg/m³.",
        tableTitle: "Material quantities table for 1 m³ of concrete, values are approximate and may vary depending on the source of materials and method of preparation.",
        obsHead:"Notes:",
        obs: [
            "Cement: Usually, CEM I 42.5R or CEM II A/M 42.5R cement is used.", 
            "Water/Cement Ratio (W/C): The value should be as low as possible for higher strength.", 
            "Aggregates: Sand (0-4 mm), gravel (4-8 mm, 8-16 mm, or 16-32 mm).", 
            "Additives (optional): Plasticizers, superplasticizers for reducing water and improving workability."
        ],
        columns: ["Concrete Class", "Cement (kg)", "Sand (kg)", "Gravel (kg)", "Water (liters)", "W/C Ratio"],
        data: [
            ["C8/10 (B100)", "180-200", "850-900", "1000-1050", "180-200", "1.0-1.2"],
            ["C12/15 (B150)", "220-250", "750-850", "1050-1100", "170-190", "0.8-1.0"],
            ["C16/20 (B200)", "270-300", "700-800", "1100-1150", "170-190", "0.6-0.8"],
            ["C20/25 (B250)", "300-350", "650-750", "1150-1200", "160-180", "0.5-0.7"],
            ["C25/30 (B300)", "350-400", "600-700", "1200-1250", "150-170", "0.45-0.6"],
            ["C30/37 (B350)", "400-450", "550-650", "1250-1300", "140-160", "0.4-0.5"]
        ]
    }
};

// Variable for the current language (default is Romanian)
let currentLang = "ro";

// Function to update the content of the info modal
function updateInfoModal() {
    const data = betonData[currentLang];

    let modalContent = `
        <h4 id="info-modal-title">${data.title}</h4>
        <h5 id="info-modal-description">${data.description}</h5>
        <h6 id="info-modal-table-title">${data.tableTitle}</h6>
        <table border="1" style="font-size: 0.7rem; border-collapse: collapse;">
            <thead>
                <tr>${data.columns.map(col => `<th>${col}</th>`).join("")}</tr>
            </thead>
            <tbody>
                ${data.data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
        </table>
        <h6 id="obs-head-note">${(data.obsHead)}</h6>
        <h6 id="obs-note">${(data.obs).join('')}</h6>`;

    document.getElementById("info-modal-content").innerHTML = modalContent;
}

// Event listener for opening the info modal
document.getElementById("info-modal-btn").addEventListener("click", () => {
    updateInfoModal();
    document.getElementById("info-modal").style.display = "flex";
});

// Event listener for closing the info modal
document.getElementById("close-info-modal-btn").addEventListener("click", () => {
    document.getElementById("info-modal").style.display = "none";
});

// Event listener for closing the modal when clicking outside of it
window.addEventListener("click", (event) => {
    let modal = document.getElementById("info-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Event listener for changing the language
document.getElementById("lang-ro").addEventListener("click", () => {
    currentLang = "ro";
    updateInfoModal();
});

document.getElementById("lang-en").addEventListener("click", () => {
    currentLang = "en";
    updateInfoModal();
});
