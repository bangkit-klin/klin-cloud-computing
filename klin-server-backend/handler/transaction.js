// Dependencies
const firebase_admin = require("firebase-admin");
const api_key = require("../private/key.json").api_key;

// transaksi - Ambil Seluruh Data Transaksi
const getAllTransaksi = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const db = firebase_admin.firestore();
        const responseData = {};
        responseData["transaction"] = [];
        const outputDb = await db.collection("transaction");
        const snapshot = await outputDb.get();

        snapshot.forEach((doc) => {
            const dataObject = doc.data();
            responseData["transaction"].push(dataObject);
        });

        const response = h.response(responseData);
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// transaksi - Ambil Data Transaksi Tertentu
const getTransaksi = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const responseData = (
            await db.collection("transaction").doc(id).get()
        ).data();

        const response = h.response(responseData);
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// transaksi - Buat Data Transaksi Baru
const makeTransaksi = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const {
                transaction_user,
                transaction_laundry,
                transaction_delivery,
                transaction_laundryType,
                transaction_detail,
                transaction_progress,
                transaction_dateStart,
                transaction_dateEnd,
                transaction_payMethod,
                transaction_priceDelivery,
                transaction_priceDiscount,
                transaction_priceTotal,
                transaction_photoStart,
                transaction_photoEnd,
            } = request.payload;

            const transactionId = "t" + Date.now().toString(); // Generate a unique transaction ID

            const db = firebase_admin.firestore();
            const outputDb = db.collection("transaction");
            await outputDb.doc(transactionId).set({
                transaction_id: transactionId,
                transaction_user: transaction_user,
                transaction_laundry: transaction_laundry,
                transaction_delivery: transaction_delivery,
                transaction_laundryType: transaction_laundryType,
                transaction_detail: transaction_detail,
                transaction_progress: transaction_progress,
                transaction_dateStart: transaction_dateStart,
                transaction_dateEnd: transaction_dateEnd,
                transaction_payMethod: transaction_payMethod,
                transaction_priceDelivery: transaction_priceDelivery,
                transaction_priceDiscount: transaction_priceDiscount,
                transaction_priceTotal: transaction_priceTotal,
                transaction_photoStart: transaction_photoStart,
                transaction_photoEnd: transaction_photoEnd,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid)
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// transaksi - Edit Data Transaksi Tertentu
const editTransaksi = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        const { id } = request.params;
        try {
            const {
                transaction_user,
                transaction_laundry,
                transaction_delivery,
                transaction_laundryType,
                transaction_detail,
                transaction_progress,
                transaction_dateStart,
                transaction_dateEnd,
                transaction_payMethod,
                transaction_priceDelivery,
                transaction_priceDiscount,
                transaction_priceTotal,
                transaction_photoStart,
                transaction_photoEnd,
            } = request.payload;

            const db = firebase_admin.firestore();
            const outputDb = db.collection("transaction");
            await outputDb.doc(id).set({
                transaction_user: transaction_user,
                transaction_laundry: transaction_laundry,
                transaction_delivery: transaction_delivery,
                transaction_laundryType: transaction_laundryType,
                transaction_detail: transaction_detail,
                transaction_progress: transaction_progress,
                transaction_dateStart: transaction_dateStart,
                transaction_dateEnd: transaction_dateEnd,
                transaction_payMethod: transaction_payMethod,
                transaction_priceDelivery: transaction_priceDelivery,
                transaction_priceDiscount: transaction_priceDiscount,
                transaction_priceTotal: transaction_priceTotal,
                transaction_photoStart: transaction_photoStart,
                transaction_photoEnd: transaction_photoEnd,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid)
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// transaksi - Hapus Data Transaksi Tertentu
const deleteTransaksi = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const outputDb = db.collection("transaction");
        await outputDb.doc(id).delete();

        const response = h.response({
            status: "success",
        });
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

module.exports = {getAllTransaksi, getTransaksi, makeTransaksi, editTransaksi, deleteTransaksi}