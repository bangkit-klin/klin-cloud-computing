// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const api_key = require("./private/key.json").api_key;

const addUserToFirebase = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const key = request.headers["x-api-key"];
        
        // Check if the API key is correct
        if (key === api_key) {
            // Create user in Firebase Authentication using Admin SDK
            const userRecord = await firebase_admin.auth().createUser({
                email: email,
                password: password,
            });

            // Get the user UID from the userRecord
            const uid = userRecord.uid;

            // Return the UID or any other relevant information if needed
            const response = h.response({
                status: "success",
                message: "User registration successful",
                user: {
                    uid: uid,
                    email: email,
                    // Include other user information as needed
                },
            });
            response.code(201); // Created
            return response;
        } else {
            const response = h.response({
                status: "unauthorized",
            });
            response.code(401);
            return response;
        }
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error("Error creating user:", error);

        // Check if the error is due to an existing email
        if (error.code === 'auth/email-already-exists') {
            const response = h.response({
                status: "error",
                message: "Email address is already in use",
            });
            response.code(400); // Bad Request
            return response;
        }

        const response = h.response({
            status: "error",
            message: "User registration failed",
        });
        response.code(500); // Internal Server Error
        return response;
    }
};

module.exports = {
    addUserToFirebase,
};
