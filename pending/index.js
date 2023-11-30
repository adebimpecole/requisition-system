/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.triggerApprovalRequest = functions.https.onCall(
    async (data, context) => {
        try {
            // Store request data in Firestore)
            const requestData = {
                user_id: data.user_id,
                date: data.date,
                title: data.title,
                description: data.description,
                status: data.status,
                requset_id: data.requset_id,
                company: data.company,
                department: data.department,
                is_attachment: data.is_attachment,
            }

            admin.firestore().collection('requests').add(requestData)

            // Get the FCM token for the target user using their user ID
            const targetUserId = data.user_id;
            const userSnapshot = await admin.firestore().collection('users').doc(targetUserId).get();
            const registrationToken = userSnapshot.data().fcmToken;

            // Send a notification to the target user
            const message = {
                notification: {
                    title: "Approval Request",
                    body: "You have received an approval request.",
                },
                token: registrationToken,
            };

            await admin.messaging().send(message);
        } catch (error) {
            console.error("Error triggering approval request:", error);
        }
    });

