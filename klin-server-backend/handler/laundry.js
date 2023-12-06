// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../private/key.json").api_key;
const bucketName = require("../private/key.json").storage_bucket;

// laundry - Ambil Seluruh Data Laundry
const getAllLaundry = async (request, h) => {
  // Mengambil Kunci API dari Request Header
  const key = request.headers["x-api-key"];
  // Jika Kunci API Benar
  if (key === api_key) {
    const db = firebase_admin.firestore();
    const responseData = {};
    responseData["laundry"] = [];
    const outputDb = await db.collection("laundry");
    const snapshot = await outputDb.get();

    snapshot.forEach((doc) => {
      const dataObject = doc.data();
      responseData["laundry"].push(dataObject);
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

// laundry - Ambil Data Laundry Tertentu
const getLaundry = async (request, h) => {
  // Mengambil Kunci API dari Request Header
  const key = request.headers["x-api-key"];
  // Jika Kunci API Benar
  if (key === api_key) {
    // Mengambil ID Users dari Request Params
    const { laundryId } = request.params;

    const db = firebase_admin.firestore();
    const responseData = (
      await db.collection("laundry").doc(laundryId).get()
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

// laundry - Buat Data Laundry Baru
const makeLaundry = async (request, h) => {
  // Mengambil Kunci API dari Request Header
  const key = request.headers["x-api-key"];
  // Jika Kunci API Benar
  if (key === api_key) {
    // Try (jika request payload valid)
    try {
      const {
        laundry_owner,
        laundry_name,
        laundry_address,
        laundry_coordinate,
        laundry_picture,
      } = request.payload;

      const laundryId = "l" + Date.now().toString(); // Generate a unique owner ID

      const storage = new Storage({
        keyFilename: path.join(__dirname, "../private/googleCloud.json"),
      });

      // Save to Cloud Storage
      const filename = laundry_picture.hapi.filename;
      const data = laundry_picture._data;
      const filePath = `./${filename}`;
      const fileExtension = filename.split(".").pop();
      const destFileName = `laundry/${laundryId}.${fileExtension}`;
      const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

      async function uploadFile() {
        const options = {
          destination: destFileName,
        };
        await storage.bucket(bucketName).upload(filePath, options);
        async function makePublic() {
          await storage.bucket(bucketName).file(destFileName).makePublic();
        }
        makePublic().catch(console.error);
      }

      fs.writeFile(filename, data, async (err) => {
        if (!err) {
          await uploadFile().catch(console.error);
          fs.unlink(filename, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
            }
          });
          // Delete the file after successful uploa
        }
      });

      const db = firebase_admin.firestore();
      const outputDb = db.collection("laundry");
      await outputDb.doc(laundryId).set({
        laundry_id: laundryId,
        laundry_owner: laundry_owner,
        laundry_name: laundry_name,
        laundry_address: laundry_address,
        laundry_coordinate: laundry_coordinate,
        laundry_picture: url,
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

// laundry - Edit Data Laundry Tertentu
const editLaundry = async (request, h) => {
  // Mengambil Kunci API dari Request Header
  const key = request.headers["x-api-key"];
  // Jika Kunci API Benar
  if (key === api_key) {
    // Try (jika request payload valid)
    const { id } = request.params;
    try {
      const {
        laundry_owner,
        laundry_name,
        laundry_address,
        laundry_coordinate,
        laundry_picture,
      } = request.payload;

      const storage = new Storage({
        keyFilename: path.join(__dirname, "../private/googleCloud.json"),
      });

      // Save to Cloud Storage
      const db = firebase_admin.firestore();
      const oldfilename = (await db.collection("laundry").doc(id).get())
        .data()
        .laundry_picture.split("/")
        .pop();
      console.log(oldfilename);
      const filename = laundry_picture.hapi.filename;
      const data = laundry_picture._data;
      const filePath = `./${filename}`;
      const fileExtension = filename.split(".").pop();
      const destFileName = `laundry/${id}.${fileExtension}`;
      const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

      async function uploadFile() {
        const options = {
          destination: destFileName,
        };
        await storage.bucket(bucketName).upload(filePath, options);
        async function makePublic() {
          await storage.bucket(bucketName).file(destFileName).makePublic();
        }
        makePublic().catch(console.error);
      }

      async function deleteFile() {
        await storage
          .bucket(bucketName)
          .file(`laundry/${oldfilename}`)
          .delete();
      }

      fs.writeFile(filename, data, async (err) => {
        if (!err) {
          await deleteFile().catch(console.error);
          await uploadFile().catch(console.error);
          fs.unlink(filename, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
            }
          });
          // Delete the file after successful uploa
        }
      });

      const outputDb = db.collection("laundry");
      await outputDb.doc(id).update({
        laundry_owner: laundry_owner,
        laundry_name: laundry_name,
        laundry_address: laundry_address,
        laundry_coordinate: laundry_coordinate,
        laundry_picture: url,
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

// laundry - Hapus Data Laundry Tertentu
const deleteLaundry = async (request, h) => {
  // Mengambil Kunci API dari Request Header
  const key = request.headers["x-api-key"];
  // Jika Kunci API Benar
  if (key === api_key) {
    const { id } = request.params;

    const db = firebase_admin.firestore();

    const oldfilename = (await db.collection("laundry").doc(id).get())
      .data()
      .laundry_picture.split("/")
      .pop();

    const storage = new Storage({
      keyFilename: path.join(__dirname, "../private/googleCloud.json"),
    });

    await storage.bucket(bucketName).file(`laundry/${oldfilename}`).delete();

    const outputDb = db.collection("laundry");
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
  getAllLaundry,
  getLaundry,
  makeLaundry,
  editLaundry,
  deleteLaundry,
};
