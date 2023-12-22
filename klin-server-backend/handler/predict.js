const axios = require("axios");
const FormData = require("form-data");
const api_key = require("../private/key.json").api_key;
const ml_backend = require("../private/key.json").klin_ml_backend;
const fs = require("fs");

async function postImageWithAuthorization(filename) {
    // Path file gambar
    const imagePath = `${filename}`;
    // Baca gambar sebagai buffer
    const imageBuffer = fs.readFileSync(imagePath);
    // Buat objek FormData dan tambahkan file gambar
    const formData = new FormData();
    formData.append("image", imageBuffer, { filename: `${filename}` });
    // Pengaturan header, termasuk authorization dengan x-api-key
    const headers = {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        "x-api-key": `${api_key}`,
    };
    try {
        // Lakukan permintaan POST menggunakan Axios
        const response = await axios.post(
            `${ml_backend}`,
            formData,
            { headers }
        );
        // Tampilkan hasil respons
        console.log(response.data);
        return response.data;
    } catch (error) {
        // Tangani kesalahan jika terjadi
    }
}

// predict - Memprediksi Objek Laundry
const predict = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const { image } = request.payload;

            // Save to Cloud Storage
            const filename = image.hapi.filename;
            const data = image._data;

            let data_response = await new Promise((resolve, reject) => {
                fs.writeFile(filename, data, async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            let postResponse = await postImageWithAuthorization(filename);
                            fs.unlink(filename, (err) => {
                                if (err) {
                                    console.error("Error deleting file:", err);
                                }
                            });
                            resolve(postResponse);
                        } catch (error) {
                            reject(error);
                        }
                    }
                });
            });

            const response = h.response({
                status: "success",
                data: data_response
            });
            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: "bad request",
            });
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

module.exports = { predict };
