from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np

kelas_label = ['celana_panjang', 'celana_pendek', 'kemeja', 'sepatu', 'skirt', 'sweater_and_jacket', 't-shirt']

def predict_class(image_path):
    img = image.load_img(image_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    model = load_model('model/model_coba.h5')
    prediksi = model.predict(img_array)
    predicted_class = np.argmax(prediksi)
    prediksi_label = kelas_label[predicted_class]

    return prediksi_label
