import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = uploadData
            ? fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadData)
            })
            : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getParameters = function () {
    return window.location.search
        .substr(1)
        .split('&')
        .filter(par => par !== '')
        .map(par => par.split('='))
        .reduce((acc, par) => {
            acc[par[0]] = par[1];
            return acc;
        }, {});
}

export const getIngredientsObject = function (newRecipe) {
    return Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && (entry[1] !== '' || entry[0] === "ingredient-1[description]" ))
        .reduce((acc, ing) => {
            const name = ing[0].split('[')[0];
            const quantity =
                acc[name]?.quantity ?? (ing[0].includes('[quantity]') ? ing[1] : null);
            const unit =
                !acc[name]?.unit ? (ing[0].includes('[unit]') ? ing[1] : '') : acc[name].unit;
            const description =
                !acc[name]?.description ? (ing[0].includes('[description]') ? ing[1] : '') : acc[name].description;
            acc[name] = {
                quantity, unit, description
            }
            return acc;
        }, {});
}

// export const getJson = async function (url) {
//     try {
//         const fetchPro = fetch(url);
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data
//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// }

// export const sendJson = async function (url, uploadData) {
//     try {
//         const fetchPro = fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(uploadData)
//         });
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data
//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// }