// Gallerie de projets
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");

const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

let allWorks = [];

// Fonction pour afficher les projets
function works(projects) {
    const workContainer = document.getElementById("work");
    workContainer.innerHTML = ''; // Effacer le contenu existant

    projects.forEach(project => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.setAttribute("src", project.imageUrl);
        image.setAttribute("alt", project.title);

        const caption = document.createElement("figcaption");
        caption.innerText = project.title;

        figure.appendChild(image);
        figure.appendChild(caption);
        workContainer.appendChild(figure);
    });
}

// Fonction pour charger les travaux à partir de l'API
function loadWorks() {
    fetch("http://localhost:5678/api/works?Accept=application/json", requestOptions)
        .then(response => response.json())
        .then(result => {
            allWorks = result;
            works(allWorks);
        })
        .catch(error => console.log('error', error));
}

// Appel de la fonction loadWorks au chargement de la page
loadWorks();

// Fonction pour ajouter les boutons de filtrage par catégorie
function addbtn(categories) {
    const filterContainer = document.getElementById("filter");
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute("data-category-id", category.id);
        filterContainer.appendChild(button);

        button.addEventListener("click", (event) => {
            const categoryId = parseInt(event.target.getAttribute("data-category-id"));
            const filteredProjects = categoryId === 0 ? allWorks : allWorks.filter(project => project.categoryId === categoryId);
            works(filteredProjects);
        });
    });
}

// Fonction pour ajouter les catégories au menu déroulant
function addCategoriesToDropdown(categories) {
    const dropdown = document.getElementById("work-category");
    dropdown.innerHTML = '';

    // Ajouter le texte "Veuillez sélectionner une catégorie" avec une valeur spéciale (-1)
    const defaultOption = document.createElement('option');
    defaultOption.value = -1;
    defaultOption.textContent = "Veuillez sélectionner une catégorie";
    dropdown.appendChild(defaultOption);

    // Filtrer les catégories pour exclure l'option "Tous" (si elle existe)
    const filteredCategories = categories.filter(category => category.name !== "Tous");

    // Ajouter les autres catégories
    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        dropdown.appendChild(option);
    });
}

// Appel de la fonction addCategoriesToDropdown pour afficher les catégories dans le menu déroulant
fetch("http://localhost:5678/api/categories", requestOptions)
    .then(response => response.json())
    .then(result => {
        const categories = [
            { id: 0, name: "Tous" },
            ...result
        ];
        addCategoriesToDropdown(categories);

        // Appel de la fonction addbtn pour afficher les boutons de filtrage
        addbtn(categories);

        // Appel de la fonction openSecondModal après avoir ajouté les catégories
        document.querySelector('.js-modal-add-photo').addEventListener('click', openSecondModal);
    })
    .catch(error => console.log('error', error));









// Modale

// Déclaration des variables pour la modale
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;
let firstModal = document.querySelector('#modal1');
let secondModal = document.querySelector('#modal2');


// Fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    const modalId = e.target.getAttribute('href');
    modal = document.querySelector(modalId);
    if (!modal) return; //

    modal = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = null;
    focusables[0].focus();
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', true);
    modal.addEventListener('click', closeModal);
    // Créer le bouton de fermeture avec le logo de FontAwesome
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times"); // Ajoutez les classes FontAwesome pour l'icône de fermeture

    const closeButton = document.createElement("button");
    closeButton.classList.add("js-modal-close");
    closeButton.appendChild(closeIcon);
    closeButton.addEventListener('click', closeModal);

    modal.querySelector('.js-modal-close').remove(); // Supprimer l'ancien bouton de fermeture
    modal.querySelector('.modal-wrapper').prepend(closeButton); // Ajouter le bouton de fermeture au début de la modal

    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    displayWorksInModal(allWorks);
};

let backButtonAdded = false;
// Fonction pour ouvrir la deuxième modale
// Fonction pour ouvrir la deuxième modale
const openSecondModal = function (e) {
    modal = document.querySelector('#modal2');
    if (!modal) return; // Vérifier si la modal a été trouvée

    const dropdown = document.getElementById("work-category");
    dropdown.value = -1;

    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = null;
    focusables[0].focus();
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', true);
    modal.addEventListener('click', closeModal);

    const form = modal.querySelector('#add-work-form');
    form.addEventListener('submit', addWork);

    // Créer le bouton de retour avec le logo de FontAwesome
    if (!backButtonAdded) {
        const backIcon = document.createElement("i");
        backIcon.classList.add("fas", "fa-arrow-left");

        const backButton = document.createElement("button");
        backButton.classList.add("js-modal-back");
        backButton.appendChild(backIcon);
        backButton.addEventListener("click", () => {
            closeModal();
            firstModal.style.display = null;
            firstModal.removeAttribute('aria-hidden');
            firstModal.setAttribute('aria-modal', true);
            focusables = Array.from(firstModal.querySelectorAll(focusableSelector));
            previouslyFocusedElement = document.querySelector(':focus');
            focusables[0].focus();
            firstModal.addEventListener('click', closeModal);
        });
        modal.querySelector('.modal-wrapper').prepend(backButton); // Ajouter le bouton de retour au début de la modal
        backButtonAdded = true; // Marquer le bouton de retour comme déjà ajouté
    }

    // Créer le bouton de fermeture avec le logo de FontAwesome
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");

    const closeButton = document.createElement("button");
    closeButton.classList.add("js-modal-close");
    closeButton.appendChild(closeIcon);
    closeButton.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close')?.remove(); // Supprimer l'ancien bouton de fermeture s'il existe
    modal.querySelector('.modal-wrapper').prepend(closeButton); // Ajouter le bouton de fermeture au début de la modal

    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const backIcon = document.createElement("i");
backIcon.classList.add("fas", "fa-arrow-left"); // Ajoutez les classes FontAwesome pour l'icône de retour

const backButton = document.createElement("button");
backButton.classList.add("js-modal-back");
backButton.appendChild(backIcon);
backButton.addEventListener("click", openModal);

// Fonction pour fermer la modale
const closeModal = function () {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();

    if (modal.id === "modal2") {
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        modal = document.querySelector('#modal1');
    } else {
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        modal = null;
    }
};

// Fonction pour arrêter la propagation des événements dans la modale
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Fonction pour gérer la navigation au clavier dans la modale
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
};

// Ajout des écouteurs d'événements pour ouvrir la modale au clic sur les boutons "modifier"
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

// Ajout de l'écouteur d'événement pour le bouton "Ajouter une photo"
document.querySelector('.js-modal-add-photo').addEventListener('click', openSecondModal);

// Ajout de l'écouteur d'événement pour la touche "Escape" et la navigation au clavier dans la modale
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
});

// Fonction pour afficher les travaux dans la modale
function displayWorksInModal(works) {
    const modalWorkContainer = document.getElementById("modal-gallery");
    modalWorkContainer.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.classList.add("modal-work");
        const img = document.createElement("img");
        img.classList.add("modal-image");
        img.setAttribute("src", work.imageUrl);

        const caption = document.createElement("figcaption");
        caption.innerText = "Éditer";
        caption.classList.add("modal-caption");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash"); // Utilisez les classes FontAwesome pour l'icône de suppression

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("js-modal-delete");
        deleteButton.appendChild(deleteIcon);

        // Ajoutez le gestionnaire d'événements pour la suppression du travail
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const workId = work.id;
            deleteWork(workId);
        });

        figure.appendChild(img);
        figure.appendChild(caption);
        figure.appendChild(deleteButton);
        modalWorkContainer.appendChild(figure);
    });
}


function deleteWork(workId) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (response.ok) {
                loadWorks();
                closeModal();

            } else {
                console.log('Erreur lors de la suppression du travail.');
            }
        })
        .catch(error => console.log('error', error));
}


function addWork(e) {
    e.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const title = document.getElementById('work-title').value;
    const category = document.getElementById('work-category').value;
    const image = document.getElementById('work-image').files[0];


    if (!title || !category || !image) {
        alert('Veuillez remplir tous les champs requis.'); // Afficher une alerte en cas de champ vide
        return;
    }

    if (category === '-1') {
        alert('Veuillez sélectionner une catégorie.');
        return;
    }

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);

    // Effectuer une requête POST pour ajouter le travail
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(result => {
            // Le travail a été ajouté avec succès
            closeModal();
            loadWorks();
            allWorks.unshift(result);
            works(allWorks);
            closeModal();
            resetAddWorkForm();
        })
        .catch(error => console.log('error', error));
}

function resetAddWorkForm() {
    const workTitleInput = document.getElementById('work-title');
    const workCategoryInput = document.getElementById('work-category');
    const workImageInput = document.getElementById('work-image');
    const previewImage = document.getElementById('preview-image');

    workTitleInput.value = '';
    workCategoryInput.value = '';
    workImageInput.value = '';

    previewImage.src = '';
    previewImage.style.display = 'none';
}

// Modale



// Récupération du token depuis le stockage local
const token = localStorage.getItem('token');



const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const editButton = document.getElementById('edit-button');
const editButton2 = document.getElementById('edit-button2');
const adminHeader = document.getElementById('admin-header');
const filterBar = document.getElementById('filter');
const logoEdit = document.getElementById('edit-logo1');
const logoEdit2 = document.getElementById('edit-logo2');

// Fonction de déconnexion
const logout = function () {
    // Supprimer le token de stockage local
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion
    window.location.href = 'index.html';
};

// Vérification de la présence du token pour déterminer si l'utilisateur est connecté ou non
if (token) {
    // Utilisateur connecté : afficher le bouton de déconnexion et masquer le bouton de connexion
    // Afficher le bouton d'édition, l'en-tête d'admin et masquer la barre de filtrage
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    editButton.style.display = 'block';
    editButton2.style.display = 'block';
    adminHeader.style.display = 'flex';
    filterBar.style.display = 'none';
    logoEdit.style.display = 'block';
    logoEdit2.style.display = 'block';

    // Ajouter l'événement de clic au bouton de déconnexion
    logoutButton.addEventListener('click', logout);
} else {
    // Utilisateur déconnecté : afficher le bouton de connexion et masquer le bouton de déconnexion
    // Masquer le bouton d'édition, l'en-tête d'admin et afficher la barre de filtrage
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    editButton.style.display = 'none';
    editButton2.style.display = 'none';
    adminHeader.style.display = 'none';
    filterBar.style.display = 'flex';
    logoEdit.style.display = 'none';
    logoEdit2.style.display = 'none';
}



document.getElementById("work-image").addEventListener("change", function(event) {
    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();

        reader.onload = function() {
            let previewImage = document.getElementById("preview-image");
            previewImage.src = reader.result;
            previewImage.style.display = "block";

        };

        reader.readAsDataURL(file);
    }
});






