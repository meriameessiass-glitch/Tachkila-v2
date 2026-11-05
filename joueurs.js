import { joueur } from "./donnees-initiales.js";
const formulaire=document.querySelector('form')
const fermer=document.querySelector('#fermer')
const annuler =document.querySelector('annuler')
const section=document.querySelector('#section')
const listjouers=[]
listjouers.push(joueur)

const POSTES = {
  GB:  { label: 'Gardien',   bordure: 'border-[#b07800]' },
  DF:  { label: 'Défenseur', bordure: 'border-[#2f6fdc]' },
  MIL: { label: 'Milieu',    bordure: 'border-[#1f7a4d]' },
  ATT: { label: 'Attaquant', bordure: 'border-[#d64a3f]' },
}




function afficher(){
    section.innerHTML=""
    
listjouers.forEach(joueur => {
    const carte=document.createElement('article')
    carte.className='rounded-xl border-l-8  bg-white py-5 pl-4 pr-4 shadow'
    for(const[pro,val]of Object.entries(POSTES)){
        if(joueur.poste==pro){
            carte.classList.add(val.bordure)
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
    capitaine.setAttribute('data-but', 'cap')
    capitaine.textContent='Capitaine'
    capitaine.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    const modifier=document.createElement('button')
    modifier.setAttribute('data-but', 'mod')
    modifier.textContent='Modifier'
    modifier.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    const supprimer=document.createElement('button')
    supprimer.setAttribute('data-but', 'sup')
    supprimer.textContent='Supprimer'
    supprimer.className='h-11 rounded-lg border border-line bg-white px-3.5 text-sm hover:bg-gray-50'
    div.append(capitaine,modifier,supprimer)
    carte.append(num,nomjoueur,age,div,etat)
    section.append(carte)

})};

formulaire.onclick=function(event){
    if(event.target.closest('button') && formulaire.contains){
        if(event.target.id=='fermer'){
            formulaire.classList.add('hidden')
        }
        else if(event.target.id=='annuler'){
            formulaire.classList.add('hidden')
            formulaire.reset()
        }

    }
}

