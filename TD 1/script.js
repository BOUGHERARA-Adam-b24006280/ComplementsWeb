var A_tableau = new Array

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

for (let index = 0; index < 20; index++) {
    A_tableau.push(getRandomInt(-10, 40))
}

var zone = document.getElementById("valeur")
var section = zone.parentElement

var index = 0

function verifierValeur(valeur) {
    if (valeur <= 0) {
        zone.setAttribute("class", "blue-border")
    } else if (valeur <= 20) {
        zone.setAttribute("class", "green-border")
    } else if (valeur <= 30) {
        zone.setAttribute("class", "orange-border")
    } else if (valeur <= 40) {
        zone.setAttribute("class", "red-border")
    }

    if (section.childNodes.length > 1) {
        section.childNodes[0].remove()
    }

    if (valeur <= 0) {
        let p = document.createElement("p")
        let message_froid = document.createTextNode("Brrrrrrr, un peu froid ce matin, mets ta cagoule !")
        p.appendChild(message_froid)

        section.insertBefore(p, zone)
    } else {
        let p = document.createElement("p")
        let message_froid = document.createTextNode("Caliente ! Vamos a la playa, ho hoho hoho !!")
        p.appendChild(message_froid)

        section.insertBefore(p, zone)
    }

    let p = document.createElement("span")
    let br = document.createElement("br")
    let texte = document.createTextNode(`${index} : ${valeur}`)
    p.appendChild(texte)
    p.appendChild(br)
    section.appendChild(p)
}

var interval = setInterval(() => {
    let valeur = A_tableau[index]
    zone.firstChild.nodeValue = `Température : ${valeur} °C`

    index++

    verifierValeur(valeur)

    if ((index) == A_tableau.length) {
        clearInterval(interval)
    }
}, 1000)
