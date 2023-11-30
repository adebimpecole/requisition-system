const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.triggerApprovalRequest = functions.https.onCall(async (data, context) => {
    try {
        // Perform necessary actions (e.g., store request data in Firestore)
        const requestsCollectionRef = collection(db, 'requests');
        await addDoc(requestsCollectionRef, {
            user_id: id,
            date: the_date,
            title: titleRef.current,
            description: descRef.current,
            status: "pending",
            requset_id: customId,
            company: company,
            department: dept,
            is_attachment: attachment,
        });


        // Send a notification to the target user
        const registrationToken = 'the-target-user-token';
        const message = {
            notification: {
                title: 'Approval Request',
                body: 'You have received an approval request.',
            },
            token: registrationToken,
        };

        await admin.messaging().send(message);
    } catch (error) {
        console.error('Error triggering approval request:', error);
    }
});
