/**
 * Informations personnelles stockées dans un objet.
 */
const donneesEtudiant = {
    nom: "DIALLO", 
    prenom: "Fatoumata Binta",
    matricule: "123456789",
    filiere: "Licence 3 MIAGE Groupe 2",
    objectif: "Maîtriser le développement web pour le projet final UNC.",
    email: "fatoumata.binta.diallo@univ-nongo.gn",
    photo: "assets/profil.jpeg" 
};

// RECUPERATION DES ELEMENTS DU DOM
/**
 * Le formulaire d'ajout de tâche
 */
const formulaire = document.getElementById('formulaire-tache');
/**
 * Le conteneur d'affichage des tâches
 */
const affichageListe = document.getElementById('liste-taches');

// Éléments du formulaire pour contrôler l'état du bouton Ajouter
const inputTitre = document.getElementById('titre-tache');
const selectCategorie = document.getElementById('categorie-tache');
const btnAjouter = document.getElementById('btn-ajouter');

function majEtatBouton() {
    const titreVal = inputTitre.value.trim();
    const categorieVal = selectCategorie.value;
    btnAjouter.disabled = !(titreVal && categorieVal);
}

// Écouteurs pour mettre à jour l'état du bouton en temps réel
inputTitre.addEventListener('input', majEtatBouton);
selectCategorie.addEventListener('change', majEtatBouton);

/** 
 * Fonction pour afficher les informations de mon profil étudiant
 */
function afficherProfil() {
    const conteneurProfil = document.getElementById('infos-etudiant');
    conteneurProfil.innerHTML = `
        <img src="${donneesEtudiant.photo}" alt="Avatar" class="photo-profil">
        <div>
            <h3>${donneesEtudiant.prenom} ${donneesEtudiant.nom}</h3>
            <p><strong>Matricule:</strong> ${donneesEtudiant.matricule}</p>
            <p><strong>Filière:</strong> ${donneesEtudiant.filiere}</p>
            <p><strong>Email:</strong> <em>${donneesEtudiant.email}</em></p>
            <p><em>"${donneesEtudiant.objectif}"</em></p>
        </div>
    `;
}

/** 
 * Gestion de la liste de tâches 
 */
let listeTaches = JSON.parse(localStorage.getItem('sauvegardeTaches')) || [
    { id: 1, texte: "Réviser le module Web", categorie: "Études", estTerminee: false },
    { id: 2, texte: "Préparer la présentation orale", categorie: "Projet", estTerminee: false }
];

/**
 * Fonction pour rafraîchir l'affichage de la liste des tâches
 * dépendant du filtre sélectionné.(Par défaut: on affiche toutes les tâches)
 * @param {string} filtre - Type de filtre ('toutes', 'en-cours', 'terminees')
 */
function rafraichirListe(filtre = 'toutes') {
    affichageListe.innerHTML = '';
    
    /**
     * Récupération des tâches selon le filtre sélectionné
     */
    const taches_A_Affichees = listeTaches.filter(t => {
        if (filtre === 'en-cours') return !t.estTerminee;
        if (filtre === 'terminees') return t.estTerminee;
        return true;
    });

    /**
     * Affichage des tâches filtrées
     */
    taches_A_Affichees.forEach(tache => {
        const li = document.createElement('li');
        li.className = `element-tache ${tache.estTerminee ? 'terminee' : ''}`;
        li.innerHTML = `
            <span>[${tache.categorie}] : ${tache.texte}</span>
            <div class="actions">
                <button class="btn-mark ${tache.estTerminee ? 'termine' : 'en-cours' }" onclick="basculerEtatTache(${tache.id})">✔</button>
                <button class="btn-delete" onclick="supprimerTache(${tache.id})">x</button>
            </div>
        `;
        affichageListe.appendChild(li);
    });
    
    // Sauvegarde des données
    localStorage.setItem('sauvegardeTaches', JSON.stringify(listeTaches));
}

// Ajout d'une tâche
formulaire.onsubmit = (event) => {
    event.preventDefault();
    const nouvelleTache = {
        id: Date.now(),
        texte: document.getElementById('titre-tache').value,
        categorie: document.getElementById('categorie-tache').value,
        estTerminee: false
    };
    listeTaches.push(nouvelleTache);
    rafraichirListe();
    formulaire.reset();
    // Après réinitialisation du formulaire, désactiver de nouveau le bouton
    majEtatBouton();
};

/**
 * Fonction pour Basculer l'état d'une tâche (terminée/en cours)
 * @param { number } idATraiter - L'identifiant de la tâche à modifier
 */
function basculerEtatTache (idATraiter) {
    listeTaches = listeTaches.map(t => 
        t.id === idATraiter ? {...t, estTerminee: !t.estTerminee} : t
    );
    rafraichirListe();
};

/**
 * Fonction pour Supprimer une tâche de la liste
 * @param { number } idATraiter - L'identifiant de la tâche à supprimer
 */
function supprimerTache (idATraiter) {
    listeTaches = listeTaches.filter(t => t.id !== idATraiter);
    rafraichirListe();
};

// Filtrer les tâches affichées
/**
 * Filtrer les tâches affichées selon le type de filtre sélectionné
 * @param {string} filtre - type de filtre à effectuer
 */
function filtrerTaches (filtre) {
    rafraichirListe(filtre);
    if (filtre === 'toutes') {
        document.getElementById('all').classList.add('active');
        document.getElementById('enCours').classList.remove('active');
        document.getElementById('finished').classList.remove('active');
    } else if (filtre === 'en-cours') {
        document.getElementById('all').classList.remove('active');
        document.getElementById('enCours').classList.add('active');
        document.getElementById('finished').classList.remove('active');
    } else if (filtre === 'terminees') {
        document.getElementById('all').classList.remove('active');
        document.getElementById('enCours').classList.remove('active');
        document.getElementById('finished').classList.add('active');
    }
}

// Initialisation au démarrage
afficherProfil();
rafraichirListe();
// Initialisation de l'état du bouton au chargement
majEtatBouton();