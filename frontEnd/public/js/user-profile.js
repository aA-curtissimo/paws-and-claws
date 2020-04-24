import { convertAge, matchPets } from './utils.js';

const masthead = document.querySelector('.masthead');
const errorContainer = document.getElementById('errorContainer');
const profileContainer = document.querySelector('.profile-left');
const petPrefContainer = document.querySelector('.pet-pref-container');
const matchLink = document.getElementById('matches');
const requestsLink = document.getElementById('requests');
const editPetPref = document.getElementById('editPetPref');

const userId = localStorage.getItem('PAWS_AND_CLAWS_CURRENT_USER_ID');

window.addEventListener('DOMContentLoaded', async (e) => {
    // Add authorization functionality
    // We should be able to only access the 
    profileContainer.innerHTML = `<div class="pet-card-container"></div>`;
    let response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
                "PAWS_AND_CLAWS_ACCESS_TOKEN"
            )}`,
        }
    });
    const { user } = await response.json();

    const userFullName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPhone = document.getElementById('user-phoneNum');

    userFullName.innerHTML = `${user.firstName} ${user.lastName}`;
    userEmail.innerHTML = `${user.email}`;

    if (user.phoneNum) {
        userPhone.innerHTML = `${user.phoneNum}`
    }

    // Default to Matches
    try {
        const res = await fetch(`http://localhost:8080/pets`);
        const { pets } = await res.json();

        const res2 = await fetch(`http://localhost:8080/preferredPets/${userId}`);
        const { petPref } = await res2.json();

        const matches = matchPets(pets, petPref);

        let petsContainer = document.querySelector('.pet-card-container');
        let petsHtml = [];

        matches.forEach((match, i) => {
            const { id, petName, age, breedId, photo } = match;
            const petHtml = `
                <div class='card' id='pet-${id}'>
                    <div class='card-image'>
                        <img src=${photo}>
                    </div>
                    <div class='card-info'>
                        <p class='pet-name'>${petName}</p>
                        <div class='pet-age'>
                            <p>Age</p>
                            <p> ${convertAge(age)} </p>
                        </div>
                        <div class='pet-breed'>
                            <p>Breed</p>
                            <p>${match.Breed.breedName}</p>
                        </div>
                    </div>
                </div>
            `
            petsHtml.push(petHtml);
        })
        petsContainer.innerHTML = petsHtml.join('');
        matchLink.classList.add('selected');
        requestsLink.classList.remove('selected');
        editPetPref.classList.remove('selected');
    } catch (err) {
        console.error(err);
    }

    const petCards = document.querySelectorAll('.card');

    petCards.forEach(petCard => petCard.addEventListener('click', async (e) => {
        let clickTarget = e.target.parentNode;

        while (!clickTarget.id) {
            clickTarget = clickTarget.parentNode;
        }

        const petNum = parseInt(clickTarget.id.split('-')[1], 10);

        window.location.href = `/pets/${petNum}`;
    }));
});
// Matches
matchLink.addEventListener('click', async (event) => {
    profileContainer.innerHTML = `<div class="pet-card-container"></div>`;
    try {
        const res = await fetch(`http://localhost:8080/pets`);
        const { pets } = await res.json();

        const res2 = await fetch(`http://localhost:8080/preferredPets/${userId}`);
        const { petPref } = await res2.json();

        const matches = matchPets(pets, petPref);

        const petsContainer = document.querySelector('.pet-card-container');
        let petsHtml = [];

        matches.forEach((match, i) => {
            const { id, petName, age, breedId, photo } = match;
            const petHtml = `
                <div class='card' id='pet-${id}'>
                    <div class='card-image'>
                        <img src=${photo}>
                    </div>
                    <div class='card-info'>
                        <p class='pet-name'>${petName}</p>
                        <div class='pet-age'>
                            <p>Age</p>
                            <p> ${convertAge(age)} </p>
                        </div>
                        <div class='pet-breed'>
                            <p>Breed</p>
                            <p>${match.Breed.breedName}</p>
                        </div>
                    </div>
                </div>
            `
            petsHtml.push(petHtml);
        })
        petsContainer.innerHTML = petsHtml.join('');
        matchLink.classList.add('selected');
        requestsLink.classList.remove('selected');
        editPetPref.classList.remove('selected');
    } catch (err) {
        console.error(err);
    }

    const petCards = document.querySelectorAll('.card');

    petCards.forEach(petCard => petCard.addEventListener('click', async (e) => {
        let clickTarget = e.target.parentNode;

        while (!clickTarget.id) {
            clickTarget = clickTarget.parentNode;
        }

        const petNum = parseInt(clickTarget.id.split('-')[1], 10);

        window.location.href = `/pets/${petNum}`;
    }));
});

// Adoption Requests
requestsLink.addEventListener('click', async (event) => {
    profileContainer.innerHTML = `<div class="adoption-requests-container"></div>`;
    const adoptReqContainer = document.querySelector('.adoption-requests-container');
    try {
        const res = await fetch(`http://localhost:8080/adoptionRequests/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(
                    "PAWS_AND_CLAWS_ACCESS_TOKEN"
                )}`,
            }
        });

        const { adoptionRequests } = await res.json();

        let adoptReqHTMLArr = [];
        adoptionRequests.forEach(adoptReq => {
            const adoptReqHTML = `
                    <tr>
                        <td>${adoptReq.Pet.petName}</td>
                        <td>${adoptReq.ShelterUser.shelterName}</td>
                        <td class="message">${adoptReq.message}</td>
                        <td class="date">${adoptReq.createdAt}</td>
                    </tr>
                `
            adoptReqHTMLArr.push(adoptReqHTML);
        })
        let adoptReqs = adoptReqHTMLArr.join('')
        adoptReqContainer.innerHTML = `
            <div class="adoption-requests-container">
                <table class="requests-table">
                    <thead>
                        <tr>
                            <th>Pet</th>
                            <th>Shelter</th>
                            <th>Message</th>
                            <th>Date Sent</th>
                        </tr>
                        ${adoptReqs}
                </table>
            </div>
        `;
        matchLink.classList.remove('selected');
        requestsLink.classList.add('selected');
        editPetPref.classList.remove('selected');
    } catch (e) {
        console.log(e);
    }
});

// Pet Preferences
editPetPref.addEventListener('click', async (event) => {
    profileContainer.innerHTML = `<div class="pet-pref-container"></div>`
    const petPrefContainer = document.querySelector('.pet-pref-container');

    try {
        const resBreeds = await fetch("http://localhost:8080/breeds", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(
                    "PAWS_AND_CLAWS_ACCESS_TOKEN"
                )}`,
            }
        });
        const { breeds } = await resBreeds.json();

        let breedHTMLArr = [];
        breeds.forEach(breed => {
            const breedHTML = `
                <option class="breed">${breed.breedName}</option>
            `
            breedHTMLArr.push(breedHTML);
        });
        let breedOptions = breedHTMLArr.join('');
        petPrefContainer.innerHTML = `
            <form class="pet-pref-form">
                <div class="pet-pref-form-header">
                    <h1>Edit your dream pet</h1>
                    <p>Sometimes your dreams are elusive or ephemeral. Feel free to change your preferences to better align with your dream pet.</p>
                </div>
                <div class="age-sex">
                    <select class="dropdown" name="age" id="age" placeholder="Age">
                        <option value="1"> Puppy (0-1) </option>
                        <option value="2"> Young (1-3) </option>
                        <option value="3"> Middle Aged (3-7) </option>
                        <option value="4"> Adult (7-10) </option>
                        <option value="5"> Mature (10+) </option>
                    </select>
                    <select class="dropdown" name="sex" id="sex" placeholder="Sex">
                        <option value="1"> Male </option>
                        <option value="2"> Female </option>
                    </select>
                </div>
                <div class="size-breed">
                    <select class="dropdown" name="size" id="size" placeholder="Size">
                        <option value="1"> Toy </option>
                        <option value="2"> Small </option>
                        <option value="3"> Medium (3-7) </option>
                        <option value="4"> Large </option>
                        <option value="5"> X-Large </option>
                    </select>
                    <select class="dropdown" name="breed" id="breed" placeholder="Breed">
                        ${breedOptions}
                    </select>
                </div>
                <div class="checkdiv">
                    <label for="isOkayKids">  Is the pet okay with children? </label>
                    <input class="checkbox" type="checkbox" name="isOkayKids" id="isOkayKids"></input>
                </div>
                <div class="checkdiv">
                    <label for="isOkayPets"> Is the pet ok with other pets?</label>
                    <input class="checkbox" type="checkbox" name="isOkayPets" id="isOkayPets"></input>
                </div>
                <div class="buttondiv">
                    <button type="submit" id="save-button"> Save </button>
                </div>
            </form>
        `
        matchLink.classList.remove('selected');
        requestsLink.classList.remove('selected');
        editPetPref.classList.add('selected');
    } catch (e) {
        console.log(e);

    }
    const form = document.querySelector('.pet-pref-form')
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        alert('eureka');
    });
});

