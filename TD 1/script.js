var A_tableau = new Array

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

for (let index = 0; index < 20; index++) {
    A_tableau.push(getRandomInt(-10, 40))
}

class Capteur {
    constructor(zoneId, sectionId, historiqueId) {
        this.zone = document.getElementById(zoneId)
        this.section = document.getElementById(sectionId)
        this.historique = document.getElementById(historiqueId)
        this.index = 0
    }

    afficherValeur(valeur) {
        if (this.zone.firstChild) {
            this.zone.firstChild.nodeValue = `Température : ${valeur} °C`
        } else {
            var texte = document.createTextNode(`Température : ${valeur} °C`)
            this.zone.appendChild(texte)
        }
    }

    changerCouleur(valeur) {
        if (valeur <= 0) {
            this.zone.setAttribute("class", "blue-border")
        } else if (valeur <= 20) {
            this.zone.setAttribute("class", "green-border")
        } else if (valeur <= 30) {
            this.zone.setAttribute("class", "orange-border")
        } else if (valeur <= 40) {
            this.zone.setAttribute("class", "red-border")
        }
    }

    afficherAlerte(valeur) {
        if (this.section.childNodes.length > 1) {
            this.section.childNodes[0].remove()
        }

        if (valeur <= 0) {
            let p = document.createElement("p")
            p.setAttribute("role", "alert")
            let message = document.createTextNode("Brrrrrrr, un peu froid ce matin, mets ta cagoule !")
            p.appendChild(message)
            this.section.insertBefore(p, this.zone)
        } else {
            let p = document.createElement("p")
            p.setAttribute("role", "alert")
            let message = document.createTextNode("Caliente ! Vamos a la playa, ho hoho hoho !!")
            p.appendChild(message)
            this.section.insertBefore(p, this.zone)
        }
    }

    ajouterAHistorique(valeur) {
        var tr = document.createElement("tr")

        var tdIndex = document.createElement("td")
        tdIndex.appendChild(document.createTextNode(this.index))

        var tdTemp = document.createElement("td")
        tdTemp.appendChild(document.createTextNode(`${valeur} °C`))

        tr.appendChild(tdIndex)
        tr.appendChild(tdTemp)
        this.historique.appendChild(tr)
    }

    evaluer(valeur) {
        this.afficherValeur(valeur)
        this.changerCouleur(valeur)
        this.afficherAlerte(valeur)
        this.ajouterAHistorique(valeur)
    }
}

var capteur = new Capteur("valeur", "panel-capteur", "historique-body")

var tabCapteur = document.getElementById("tab-capteur")
var tabHistorique = document.getElementById("tab-historique")
var panelCapteur = document.getElementById("panel-capteur")
var panelHistorique = document.getElementById("panel-historique")

tabCapteur.addEventListener("click", () => {
    tabCapteur.setAttribute("aria-selected", "true")
    tabHistorique.setAttribute("aria-selected", "false")
    panelCapteur.style.display = "block"
    panelHistorique.style.display = "none"
}, false)

tabHistorique.addEventListener("click", () => {
    tabHistorique.setAttribute("aria-selected", "true")
    tabCapteur.setAttribute("aria-selected", "false")
    panelHistorique.style.display = "block"
    panelCapteur.style.display = "none"
}, false)

// Fonction pour récupérer les données du capteur via Fetch
function recupererDonneesCapteur() {
    fetch("http://localhost:8000/api.php")
        .then((response) => {
            return response.json()
        })
        .then((O_json) => {
            let valeur = parseInt(O_json.capteurs[0].Valeur)
            capteur.evaluer(valeur)
            capteur.index++
        })
        .catch(() => {
            console.log("Erreur lors de la récupération des données")
        })
}

// Fonction pour charger l'historique depuis le JSON
function chargerHistorique() {
    fetch("historique.json")
        .then((response) => {
            return response.json()
        })
        .then((O_json) => {
            O_json.historique.forEach((donnee) => {
                var tr = document.createElement("tr")

                var tdIndex = document.createElement("td")
                tdIndex.appendChild(document.createTextNode(donnee.index))

                var tdTemp = document.createElement("td")
                tdTemp.appendChild(document.createTextNode(`${donnee.temperature} °C`))

                tr.appendChild(tdIndex)
                tr.appendChild(tdTemp)
                capteur.historique.appendChild(tr)
            })
        })
        .catch(() => {
            console.log("Erreur lors du chargement de l'historique")
        })
}

// Charger l'historique au démarrage
chargerHistorique()

// Rafraîchir les données du capteur toutes les 2 secondes
var interval = setInterval(() => {
    recupererDonneesCapteur()
}, 2000)

// Première récupération immédiate
recupererDonneesCapteur()