
export const newRequest = async (reqId, userId) => {
    // Make an API call to the backend server
    const payload = {
        userId: userId,
        reqId: reqId
    };

    let theUser = 'TjQnE8rFM2fL6xfVqWU4IZjFU2Y2';

    fetch(`http://localhost:5000/users/${theUser}/pending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                ('Something went wrong');
            }
            return response.json();
        })
        .then(data => {
            console.log('Request sent to backend successfully:', data);
        })
        .catch(error => {
            console.error('There was a problem sending the Request:', error);
        });
};

export const generateCustomId = (prefix, length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let customId = prefix;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        customId += characters.charAt(randomIndex);
    }

    return customId;
}

export const excludeEmptyStrings = (obj) => {
    let result = {};
    for (let [key, value] of Object.entries(obj)) {
        if (value !== "") {
            result[key] = value;
        }
    }
    return result;
};

export const todaysDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const the_date = `${month}/${date}/${year}`;
    return the_date;
};

