// eslint-disable-next-line no-unused-vars
const MemoryGame = (function () {
    'use strict'

    const imagesAccueil = document.querySelectorAll('.imagesAccueil')
    let hasFlipperCard = false
    let lockBoard = false
    let firstCard, secondCard
    let nombreDeReussite = 0
    const nombrePairesATrouver = 8
    let tabScore = []
    let tabTime = []
    let score = 0
    let depart = false
    const pairesTrouvees = document.getElementById('pairesTrouvees')
    const imageAnimeeAside = document.getElementById('imageAnimeeAside')
    const conteneurScore = document.getElementById('conteneurScore')
    const resultat = document.getElementById('resultat')
    const tempsEcoule = document.getElementById('tempsEcoule')
    const nouvellePartie = document.getElementById('nouvellePartie')
    const quitter = document.getElementById('quitter')
    const meilleurScor = document.getElementById('meilleurScor')
    const meilleurTime = document.getElementById('meilleurTime')
    const messagePerdu = '   Vous avez perdu !!!'
    let duree = 120
    const NouvellePartie = 'Nouvelle Partie'
    const ArreterPartie = 'Arreter la Partie'
    const imageAnimeeAside1 = 'image/go.jpg'
    const imageAnimeeAside2 = 'image/congrat.gif'
    const imageAnimeeAside3 = 'image/super.jpg'
    const imageAnimeeAside4 = 'image/echec.jpg'
    const imageAnimeeAside5 = 'image/perdu.gif'
    const colorinputTempsEcoule = 'red'
    const messageVousAvezGagne = ' Vous avez gagné ! Waouh'
    const tempsEcouleMessage = 'Temps ecoule. reessayez!'
    const resultatPartiePerte = '   Vous avez perdu !!'

    function nouvelleArreterPartie () {
    // initialisation
        if (nouvellePartie.textContent === NouvellePartie) {
            nouvellePartie.textContent = ArreterPartie
            imageAnimeeAside.src = imageAnimeeAside1
            tempsEcoule.style.backgroundColor = ''
            resultat.innerHTML = ''
            pairesTrouvees.setAttribute('value', 0)
            nombreDeReussite = 0
            score = 0
            duree = 120

            conteneurScore.textContent = '0'

            setInterval(function () {
                let s = duree
                let m = 0; let h = 0
                if (s === 0) {
                    tempsEcoule.value = tempsEcouleMessage
                    resultat.innerHTML = resultatPartiePerte
                    tempsEcoule.style.backgroundColor = colorinputTempsEcoule
                    imageAnimeeAside.src = imageAnimeeAside5
                    nouvellePartie.textContent = NouvellePartie
                    for (let i = 0; i < 16; i++) {
                        imagesAccueil[i].classList.add('flip')
                    }
                } else if (nouvellePartie.textContent === ArreterPartie) {
                    if (s > 59) {
                        m = Math.floor(s / 60)
                        s = s - m * 60
                    }
                    if (m > 59) {
                        h = Math.floor(m / 60)
                        m = m - h * 60
                    }
                    if (s < 10) {
                        s = '0' + s
                    }
                    if (m < 10) {
                        m = '0' + m
                    }
                    tempsEcoule.value = h + ':' + m + ':' + s
                    duree = duree - 1
                }
            }, 2000)
            setTimeout(function () {
                for (let i = 0; i < 16; i++) {
                    imagesAccueil[i].classList.add('flip')
                }
                depart = true
            }, 0)
            setTimeout(function () {
                for (let i = 0; i < 16; i++) {
                    imagesAccueil[i].classList.remove('flip')
                }
                depart = true
            }, 4000)
            imagesAccueil.forEach(image => image.addEventListener('click', flipCard))

            imagesAccueil.forEach(card => {
                let randomPos = Math.floor(Math.random() * 16)
                card.style.order = randomPos
            })
        } else {
            for (let i = 0; i < 16; i++) {
                imagesAccueil[i].classList.add('flip')
            }
            conteneurScore.textContent = '0'
            pairesTrouvees.setAttribute('value', '0')
            tempsEcoule.value = ''
            duree = ''
            nouvellePartie.textContent = NouvellePartie
        }
    }

    function flipCard () {
        if (lockBoard) return // limiter la condition sur 2 images
        if (this === firstCard) return // annuler le double click sur une image
        this.classList.add('flip')
        if (!hasFlipperCard) {
        // first click
            hasFlipperCard = true
            firstCard = this
        } else {
        // second click
            hasFlipperCard = false
            secondCard = this
            // do card match?
            checkForMatch()
        }
    }

    function checkForMatch () {
        if (firstCard.dataset.framework === secondCard.dataset.framework) {
        // it's match
            disableCards()
        } else {
        // not a match
            unflipCards()
        }

        if (nombreDeReussite === nombrePairesATrouver && score >= 150) {
            resultat.textContent = messageVousAvezGagne
            imageAnimeeAside.src = imageAnimeeAside2
            tempsEcoule.value = ''
            nouvellePartie.innerHTML = NouvellePartie
            tabScore.push(score)
            tabTime.push(duree)
            console.log(tabTime)

            let max = tabScore.reduce(function (a, b) {
                return Math.max(a, b)
            })

            let maxtime = tabTime.reduce(function (c, d) {
                return Math.max(c, d)
            })
            meilleurScor.value = max
            meilleurTime.innerHTML = 'Meilleur temps : ' + maxtime + ' secondes'
        } else if (nombreDeReussite === nombrePairesATrouver && score < 150) {
            resultat.textContent = messagePerdu
            resultat.style.backgroundColor = 'red'
        }
    }

    function disableCards () {
        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        imageAnimeeAside.src = imageAnimeeAside3
        nombreDeReussite++
        score += 50
        pairesTrouvees.setAttribute('value', '  ' + nombreDeReussite)
        conteneurScore.textContent = score
    }
    function unflipCards () {
        lockBoard = true
        setTimeout(() => {
            firstCard.classList.remove('flip')
            secondCard.classList.remove('flip')
            lockBoard = false
        }, 1500)
        imageAnimeeAside.src = imageAnimeeAside4
        score = Math.max(0, score - 30)
        conteneurScore.textContent = score
    }
    function quitterPartie () {
        window.close()
    }
    // Event quitter la partie

    return {
        init: function () {
            nouvellePartie.addEventListener('click', nouvelleArreterPartie)
            quitter.addEventListener('click', quitterPartie)
        }
    }
})()
