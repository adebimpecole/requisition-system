
export const newRequest = async (reqId, userId) => {
    // Make an API call to the backend server
    const payload = {
        userId: userId,
        reqId: reqId
    };

    let theUser = 'lP12ZOBUbCTYVNtdKfdRkuAwpwg1';

    fetch(`/users/${theUser}/pending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('FCM Token sent to backend successfully:', data);
    })
    .catch(error => {
        console.error('There was a problem sending the FCM Token:', error);
    });
};


export const fetchData = async (userId) => {
    // fetch(`/users/${userId}/pending`)
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         // Handle the data retrieved (pending requests) for the logged-in user
    //         console.log('Pending requests:', data);
    //         // Update state or perform actions based on the retrieved data
    //     })
    //     .catch((error) => {
    //         console.error('There was a problem fetching pending requests:', error);
    //     });

}