import { joueur } from "./donnees-initiales.js";
const formulaire=document.querySelector('form')
const section=document.querySelector('#section')
const ajouter=document.querySelector('#ajouter')
const ajouter1=document.querySelector('#ajouter1')
const nomejoueur=document.querySelector("#nom")
const numjoueur=document.querySelector('#numero')
const agejoueur=document.querySelector('#age')
const titre=document.querySelector('#titre')
const filtrer=document.querySelector('#filtrer')
const recherche=document.querySelector('#Rechercher')

const listjoueurs=JSON.parse(localStorage.getItem('joueurs')) 
if (listjoueurs === null) {
    listjoueurs = [joueur]
    localStorage.setItem('joueurs', JSON.stringify(listjoueurs))
}
let indexmod=null
let indexcap=null

const POSTES = {
  GB:  { label: 'Gardien',   bordure: 'border-[#b07800]',color:'text-yellow-500' },
  DF:  { label: 'Défenseur', bordure: 'border-[#2f6fdc]',color:'text-blue-500' },
  MIL: { label: 'Milieu',    bordure: 'border-[#1f7a4d]',color:'text-green-500'},
  ATT: { label: 'Attaquant', bordure: 'border-[#d64a3f]' ,color:'text-red-500'},
}
const REGEX = {
  nom: /^\p{L}{2,}(?:[ '’-]\p{L}+)*$/u,
  numero: /^(?:[1-9]|[1-9][0-9])$/,
  age: /^(?:1[5-9]|[2-4][0-9]|50)$/,
}




function afficher(B=listjoueurs){
    section.innerHTML= ''
    
B.forEach((joueur,index) => {
    const carte=document.createElement('article')
    carte.id='carte'
    carte.className='relative rounded-xl border-l-8  bg-white py-5 pl-4 pr-4 shadow'
    const post=document.createElement('p')
    post.textContent=joueur.poste
    post.className='font-bold'
    for(const[pro,val]of Object.entries(POSTES)){
        if(joueur.poste==pro){
            carte.classList.add(val.bordure)
            post.textContent=val.label
            post.classList.add(val.color)

        }
    }
    const num=document.createElement('div')
    num.className='flex min-h-9 items-center justify-between'
    const span=document.createElement('span')
    span.className='font-display text-4xl font-bold leading-none'
    span.textContent=joueur.numero
    num.append(span)
    const nomjoueur=document.createElement('h2')
    nomjoueur.textContent=joueur.nom
    nomjoueur.className='mb-1.5 mt-2 text-lg font-bold'
    const age=document.createElement('p')
    age.textContent=joueur.age
    age.className='mb-2 text-sm text-muted'
    const etat=document.createElement('span')
    etat.textContent=joueur.statut
    etat.className='inline-block rounded-full bg-[#fde0dc] px-2.5 py-[3px] text-[12.5px] font-semibold text-[#9b1c14]'
    const div=document.createElement('div')
    div.className='mt-3 flex flex-wrap gap-2'
    const capitaine=document.createElement('button')
    capitaine.addEventListener('click', ()=>{
        listjoueurs.forEach(j => {
        j.capitaine = false
        })
        joueur.capitaine=true
        indexcap=true
         document.querySelectorAll('.badge-capitaine').forEach(badge => {
        badge.remove()
        })
        const badge = document.createElement("span");
        badge.textContent = "C"
        badge.className ="badge-capitaine absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-black text-sm font-bold flex items-center justify-center shadow-md ring-2 ring-white";
        carte.appendChild(badge)
        localStorage.setItem('joueurs', JSON.stringify(listjoueurs))

    })
    capitaine.setAttribute('data-but', 'cap')
    capitaine.textContent='Capitaine'
    capitaine.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    const modifier=document.createElement('button')
    modifier.addEventListener('click',()=>{
        nomejoueur.value=joueur.nom
        numjoueur.value=joueur.numero
        agejoueur.value=joueur.age
        formulaire.hidden=false 
        ajouter1.textContent='Modifier'
        titre.textContent="Modification d'un joueur"
        console.log(ajouter1.textContent)
        indexmod=joueur.id
        console.log(indexmod)
    })
    modifier.setAttribute('data-but', 'mod')
    modifier.textContent='Modifier'
    modifier.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    const supprimer=document.createElement('button')
    supprimer.addEventListener('click',()=>{
        listjoueurs.splice(index,1)
        localStorage.setItem('joueurs', JSON.stringify(listjoueurs))
        carte.remove()
    })
    supprimer.setAttribute('data-but', 'sup')
    supprimer.textContent='Supprimer'
    supprimer.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    div.append(capitaine,modifier,supprimer)
    carte.append(num,nomjoueur,age,post,div,etat)
    if (joueur.capitaine) {
    const badge = document.createElement("span")
    badge.textContent = "C"
    badge.className = "badge-capitaine absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-black text-sm font-bold flex items-center justify-center shadow-md ring-2 ring-white"

    carte.appendChild(badge)
    }
    section.append(carte)

})};
afficher()
if(indexmod===null){
        ajouter1.textContent='Ajouter '
        titre.textContent="Ajouter un joueur"
}



ajouter.addEventListener('click',()=>{
    formulaire.hidden=false
})

formulaire.onclick=function(event){
    const bouton=event.target.closest('button')
    if(bouton){

         if(bouton.id=='fermer'){
            formulaire.hidden=true
        }
        else if(bouton.id=='annuler'){
            formulaire.hidden=true
            console.log(formulaire.classList)
            formulaire.reset()
        }
    }
}
formulaire.addEventListener('submit',(event)=>{
    event.preventDefault()
    const d = new FormData(formulaire);

            const nom = d.get('nom').trim().replace(/\s+/g, ' ');   
            const numero = String(d.get('numero'));
            const age = String(d.get('age'));

            const nomV = REGEX.nom.test(nom);
            const numeroV = REGEX.numero.test(numero);
            const ageV = REGEX.age.test(age);

            document.querySelector('#erreur-nom').classList.toggle('hidden', nomV);
            document.querySelector('#erreur-numero').classList.toggle('hidden', numeroV);
            document.querySelector('#erreur-age').classList.toggle('hidden', ageV);

            if(!nomV || !numeroV || !ageV) return;
            if(indexmod!==null){
                const modjoueur=listjoueurs.find(e=>e.id===indexmod)
                modjoueur.nom=nomejoueur.value
                modjoueur.numero=Number(numero)
                modjoueur.poste=d.get('poste')
                modjoueur.statut=d.get('etat')
                modjoueur.age=d.get(age)
                localStorage.setItem('joueurs', JSON.stringify(listjoueurs))
                indexmod=null
            }else{
            const joueur ={
                id: String(Date.now()),
                nom:d.get('nom'),
                numero: Number(numero),
                poste: d.get('poste'),
                age: Number(age),
                statut: d.get('etat'),
                capitaine: false,
                position: null
            }
            console.log(listjoueurs)
            console.log(joueur.poste)
            listjoueurs.push(joueur)
            localStorage.setItem('joueurs', JSON.stringify(listjoueurs))
        }
            formulaire.reset()
            afficher()
    }
)

function recherchejoueur(n){
        const joueursFiltres = listjoueurs.filter(element =>
        element.nom.toLowerCase().includes(n.toLowerCase().trim())
    )
    afficher(joueursFiltres)
}
recherche.addEventListener('input',()=>{
    recherchejoueur(recherche.value)
})
