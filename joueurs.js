import { joueur } from "./donnees-initiales.js";
const formulaire=document.querySelector('form')
const section=document.querySelector('#section')
const ajouter=document.querySelector('#ajouter')
const listjouers=[]
listjouers.push(joueur)

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




function afficher(){
    section.innerHTML=""
    
listjouers.forEach(joueur => {
    const carte=document.createElement('article')
    carte.className='rounded-xl border-l-8  bg-white py-5 pl-4 pr-4 shadow'
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
    carte.append(num,nomjoueur,age,post,div,etat)
    section.append(carte)

})};


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
            console.log(joueur.poste)
            listjouers.push(joueur)
            formulaire.reset()
            afficher()
        }
)
