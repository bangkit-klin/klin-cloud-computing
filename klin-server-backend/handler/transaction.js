// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

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

      const storage = new Storage({
        keyFilename: path.join(__dirname, "../private/googleCloud.json"),
      });

      // Handle transaction_photoStart
      const startFilename = transaction_photoStart.hapi.filename;
      const startData = transaction_photoStart._data;
      const startFilePath = `./${startFilename}`;
      const startFileExtension = startFilename.split(".").pop();
      const startDestFileName = `transaction/${transactionId}_start.${startFileExtension}`;
      const startUrl = `https://storage.googleapis.com/${bucketName}/${startDestFileName}`;

      // Handle transaction_photoEnd
      const endFilename = transaction_photoEnd.hapi.filename;
      const endData = transaction_photoEnd._data;
      const endFilePath = `./${endFilename}`;
      const endFileExtension = endFilename.split(".").pop();
      const endDestFileName = `transaction/${transactionId}_end.${endFileExtension}`;
      const endUrl = `https://storage.googleapis.com/${bucketName}/${endDestFileName}`;

      // Upload photos to Cloud Storage
      async function uploadPhoto(filename, data, destFileName) {
        const options = {
          destination: destFileName,
        };
        await storage.bucket(bucketName).upload(filename, options);
        async function makePublic() {
          await storage.bucket(bucketName).file(destFileName).makePublic();
        }
        makePublic().catch(console.error);
      }

      // Upload transaction_photoStart
      fs.writeFile(startFilePath, startData, async (err) => {
        if (!err) {
          await uploadPhoto(startFilePath, startData, startDestFileName).catch(
            console.error
          );
          fs.unlink(startFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });

      // Upload transaction_photoEnd
      fs.writeFile(endFilePath, endData, async (err) => {
        if (!err) {
          await uploadPhoto(endFilePath, endData, endDestFileName).catch(
            console.error
          );
          fs.unlink(endFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });

      // Store data in Firestore
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
        transaction_photoStart: startUrl,
        transaction_photoEnd: endUrl,
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

      const storage = new Storage({
        keyFilename: path.join(__dirname, "../private/googleCloud.json"),
      });

      // Save to Cloud Storage
      const db = firebase_admin.firestore();

      // Handle transaction_photoStart
      const oldStartFilename = (
        await db.collection("transaction").doc(id).get()
      )
        .data()
        .transaction_photoStart.split("/")
        .pop();
      console.log(oldStartFilename);
      const startFilename = transaction_photoStart.hapi.filename;
      const startData = transaction_photoStart._data;
      const startFilePath = `./${startFilename}`;
      const startFileExtension = startFilename.split(".").pop();
      const startDestFileName = `transaction/${id}_start.${startFileExtension}`;
      const startUrl = `https://storage.googleapis.com/${bucketName}/${startDestFileName}`;

      // Handle transaction_photoEnd
      const oldEndFilename = (await db.collection("transaction").doc(id).get())
        .data()
        .transaction_photoEnd.split("/")
        .pop();
      console.log(oldEndFilename);
      const endFilename = transaction_photoEnd.hapi.filename;
      const endData = transaction_photoEnd._data;
      const endFilePath = `./${endFilename}`;
      const endFileExtension = endFilename.split(".").pop();
      const endDestFileName = `transaction/${id}_end.${endFileExtension}`;
      const endUrl = `https://storage.googleapis.com/${bucketName}/${endDestFileName}`;

      // Upload photos to Cloud Storage
      async function uploadPhoto(filename, data, destFileName) {
        const options = {
          destination: destFileName,
        };
        await storage.bucket(bucketName).upload(filename, options);
        async function makePublic() {
          await storage.bucket(bucketName).file(destFileName).makePublic();
        }
        makePublic().catch(console.error);
      }

      // Delete old photos
      async function deletePhoto(oldFilename) {
        await storage
          .bucket(bucketName)
          .file(`transaction/${oldFilename}`)
          .delete();
      }

      // Upload transaction_photoStart
      fs.writeFile(startFilePath, startData, async (err) => {
        if (!err) {
          await deletePhoto(oldStartFilename).catch(console.error);
          await uploadPhoto(startFilePath, startData, startDestFileName).catch(
            console.error
          );
          fs.unlink(startFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });

      // Upload transaction_photoEnd
      fs.writeFile(endFilePath, endData, async (err) => {
        if (!err) {
          await deletePhoto(oldEndFilename).catch(console.error);
          await uploadPhoto(endFilePath, endData, endDestFileName).catch(
            console.error
          );
          fs.unlink(endFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });

      const outputDb = db.collection("transaction");
      await outputDb.doc(id).update({
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
        transaction_photoStart: startUrl,
        transaction_photoEnd: endUrl,
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

    const storage = new Storage({
      keyFilename: path.join(__dirname, "../private/googleCloud.json"),
    });

    const oldEndfilename = (await db.collection("transaction").doc(id).get())
      .data()
      .transaction_photoEnd.split("/")
      .pop();

    const oldStartfilename = (await db.collection("transaction").doc(id).get())
      .data()
      .transaction_photoStart.split("/")
      .pop();

    await storage
      .bucket(bucketName)
      .file(`transaction/${oldStartfilename}`)
      .delete();
    await storage
      .bucket(bucketName)
      .file(`transaction/${oldEndfilename}`)
      .delete();
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

module.exports = {
  getAllTransaksi,
  getTransaksi,
  makeTransaksi,
  editTransaksi,
  deleteTransaksi,
};
