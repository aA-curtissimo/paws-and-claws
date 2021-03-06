import { handleErrors, api } from "./utils.js";

const logInFormUser = document.querySelector(".user-login");
const logInFormShelter = document.querySelector(".shelter-login");

logInFormUser.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(logInFormUser);
    const email = formData.get("email");
    const password = formData.get("password");
    const body = { email, password };
    try {
        const res = await fetch(`${api}users/token`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw res;
        }
        const {
            token,
            role,
            user: { id },
            name,
        } = await res.json();
        // storage access_token in localStorage:
        localStorage.setItem("PAWS_AND_CLAWS_ACCESS_TOKEN", token);
        localStorage.setItem("PAWS_AND_CLAWS_CURRENT_USER_ID", id);
        localStorage.setItem("PAWS_AND_CLAWS_ROLE", role);
        localStorage.setItem("PAWS_AND_CLAWS_NAME", name);

        window.location.href = `/user-profile`;
    } catch (err) {
        handleErrors(err);
    }
});

logInFormShelter.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(logInFormShelter);
    const email = formData.get("email");
    const password = formData.get("password");
    const body = { email, password };
    try {
        const res = await fetch(`${api}shelters/token`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw res;
        }
        const {
            token,
            role,
            user: { id },
            name,
        } = await res.json();
        // storage access_token in localStorage:
        localStorage.setItem("PAWS_AND_CLAWS_ACCESS_TOKEN", token);
        localStorage.setItem("PAWS_AND_CLAWS_CURRENT_USER_ID", id);
        localStorage.setItem("PAWS_AND_CLAWS_ROLE", role);
        localStorage.setItem("PAWS_AND_CLAWS_NAME", name);

        window.location.href = `/shelter-profile`;
    } catch (err) {
        handleErrors(err);
    }
});
