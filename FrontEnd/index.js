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