import { joueur as joueurInitial } from "./donnees-initiales.js"

// ---------- Données ----------
let joueurs = JSON.parse(localStorage.getItem('joueurs'))
if (!joueurs) {
    joueurs = [joueurInitial]
    localStorage.setItem('joueurs', JSON.stringify(joueurs))
}

const terrain = document.querySelector('.terrain')
const liste = document.querySelector('#liste-joueurs')
const aside = document.querySelector('aside')

const SLOTS = {
    GB:  { poste: 'GB',  el: document.querySelector('.GB') ?? terrain.children[36] },
    DG:  { poste: 'DF',  el: document.querySelector('.DG') },
    DC1: { poste: 'DF',  el: document.querySelector('.DC1') },
    DC2: { poste: 'DF',  el: document.querySelector('.DC2') },
    DD:  { poste: 'DF',  el: document.querySelector('.DD') },
    MG:  { poste: 'MIL', el: document.querySelector('.MG') },
    MC1: { poste: 'MIL', el: document.querySelector('.MC1') },
    MC2: { poste: 'MIL', el: document.querySelector('.MC2') },
    MD:  { poste: 'MIL', el: document.querySelector('.MD') },
    AT1: { poste: 'ATT', el: document.querySelector('.AT1') },
    AT2: { poste: 'ATT', el: document.querySelector('.AT2') },
}

const COULEURS = {
    GB:  'bg-yellow-600',
    DF:  'bg-blue-600',
    MIL: 'bg-green-600',
    ATT: 'bg-red-600',
}
const BORDURES = {
    GB:  'border-[#b07800]',
    DF:  'border-[#2f6fdc]',
    MIL: 'border-[#1f7a4d]',
    ATT: 'border-[#d64a3f]',
}

for (const [cle, slot] of Object.entries(SLOTS)) {
    slot.libelle = cle
}

// Joueur en cours de déplacement (dataTransfer n'est pas lisible pendant dragover)
let joueurEnCours = null

function sauvegarder() {
    localStorage.setItem('joueurs', JSON.stringify(joueurs))
}

// ---------- Surbrillance pendant le drag ----------
const CLASSES_OK = ['ring-4', 'ring-white']
const CLASSES_SURVOL = ['ring-4', 'ring-yellow-300', 'scale-110']

function surlignerPlacesCompatibles(j) {
    for (const slot of Object.values(SLOTS)) {
        if (slot.poste === j.poste) slot.el.classList.add(...CLASSES_OK)
    }
}

function eteindreSurbrillance() {
    for (const slot of Object.values(SLOTS)) {
        slot.el.classList.remove(...CLASSES_OK, ...CLASSES_SURVOL)
    }
    aside.classList.remove('bg-red-50')
}

function debutDrag(event, j) {
    joueurEnCours = j
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', j.id)
    surlignerPlacesCompatibles(j)
    if (j.position) aside.classList.add('bg-red-50') // on peut le lâcher ici pour le retirer
}

function finDrag() {
    joueurEnCours = null
    eteindreSurbrillance()
}

// ---------- Actions ----------
function placerDans(j, cle) {
    const slot = SLOTS[cle]
    if (j.poste !== slot.poste) return false
    if (j.statut === 'Blessé') return false

    const ancienneCle = j.position
    const occupant = joueurs.find(x => x.position === cle && x !== j)

    if (occupant) {
        // Échange si le joueur venait d'une autre place, sinon l'occupant retourne dans la liste
        occupant.position = ancienneCle ?? null
    }
    j.position = cle
    sauvegarder()
    afficher()
    return true
}

function placer(j) {
    const cle = Object.keys(SLOTS).find(k =>
        SLOTS[k].poste === j.poste &&
        !joueurs.some(x => x.position === k)
    )
    if (!cle) {
        alert("Plus de place libre pour ce poste.")
        return
    }
    placerDans(j, cle)
}

function retirer(j) {
    j.position = null
    sauvegarder()
    afficher()
}

// ---------- Affichage du terrain ----------
function afficherTerrain() {
    for (const [cle, slot] of Object.entries(SLOTS)) {
        const el = slot.el
        const j = joueurs.find(x => x.position === cle)

        el.innerHTML = ''
        el.onclick = null
        el.draggable = false
        el.ondragstart = null
        el.ondragend = null
        el.classList.add('transition-transform')
        el.classList.remove('cursor-pointer', 'cursor-grab')

        // ----- Zone de dépôt (valable pour une place vide ou occupée) -----
        el.ondragover = (event) => {
            if (joueurEnCours && joueurEnCours.poste === slot.poste) {
                event.preventDefault() // autorise le drop
                event.dataTransfer.dropEffect = 'move'
                el.classList.add(...CLASSES_SURVOL)
            }
        }
        el.ondragleave = () => el.classList.remove(...CLASSES_SURVOL)
        el.ondrop = (event) => {
            event.preventDefault()
            const joueurDepose = joueurs.find(x => x.id === event.dataTransfer.getData('text/plain'))
            eteindreSurbrillance()
            if (joueurDepose) placerDans(joueurDepose, cle)
        }

        if (!j) {
            const p = document.createElement('p')
            p.textContent = slot.libelle
            el.append(p)
            continue
        }

        el.classList.add('flex-col', 'relative', 'cursor-grab')

        const cercle = document.createElement('span')
        cercle.textContent = j.numero
        cercle.className = `flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white ${COULEURS[j.poste]}`

        const nom = document.createElement('span')
        nom.textContent = j.nom.split(' ').pop()
        nom.className = 'text-[10px] font-semibold text-white leading-none mt-0.5'

        el.append(cercle, nom)

        if (j.capitaine) {
            const badge = document.createElement('span')
            badge.textContent = 'C'
            badge.className = 'absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black ring-1 ring-white'
            el.append(badge)
        }

        // Un joueur placé peut être déplacé vers une autre place ou vers la liste
        el.draggable = true
        el.ondragstart = (event) => debutDrag(event, j)
        el.ondragend = finDrag
        el.onclick = () => retirer(j)
    }
}

// ---------- Affichage de la liste ----------
function afficherListe() {
    liste.innerHTML = ''

    joueurs.forEach(j => {
        const li = document.createElement('li')
        li.className = `flex items-center justify-between rounded-lg border-l-4 bg-white px-3 py-2 shadow ${BORDURES[j.poste] ?? ''}`

        const texte = document.createElement('span')
        texte.className = 'text-sm font-medium'
        texte.textContent = `${j.numero} · ${j.nom}`

        let action
        if (j.statut === 'Blessé') {
            action = document.createElement('span')
            action.textContent = 'Blessé · indisponible'
            action.className = 'rounded-full bg-[#fde0dc] px-2.5 py-[3px] text-xs font-semibold text-[#9b1c14]'
            li.classList.add('opacity-60')
        } else {
            // Disponible : on peut le glisser vers le terrain
            li.draggable = true
            li.classList.add('cursor-grab')
            li.addEventListener('dragstart', (event) => {
                debutDrag(event, j)
                li.classList.add('opacity-40')
            })
            li.addEventListener('dragend', () => {
                li.classList.remove('opacity-40')
                finDrag()
            })

            if (j.position) {
                action = document.createElement('button')
                action.textContent = 'Placé'
                action.title = 'Cliquer pour retirer du terrain'
                action.className = 'rounded-full bg-[#dcf2e3] px-2.5 py-[3px] text-xs font-semibold text-[#14633a]'
                action.addEventListener('click', () => retirer(j))
            } else {
                action = document.createElement('button')
                action.textContent = 'Placer'
                action.className = 'h-8 rounded-lg border border-line bg-white px-3 text-sm hover:bg-gray-50'
                action.addEventListener('click', () => placer(j))
            }
        }

        li.append(texte, action)
        liste.append(li)
    })
}

// ---------- Déposer un joueur sur la liste = le retirer du terrain ----------
aside.addEventListener('dragover', (event) => {
    if (joueurEnCours?.position) event.preventDefault()
})
aside.addEventListener('drop', (event) => {
    event.preventDefault()
    const j = joueurs.find(x => x.id === event.dataTransfer.getData('text/plain'))
    eteindreSurbrillance()
    if (j?.position) retirer(j)
})

function afficher() {
    afficherTerrain()
    afficherListe()
}

afficher()