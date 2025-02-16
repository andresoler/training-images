let model;

// Cargar el modelo desde GitHub Pages
async function loadModel() {
    model = await tf.loadLayersModel('https://andresoler.github.io/training-images/carpeta_salida/model.json');
    console.log("Modelo cargado correctamente.");
}
loadModel();

// Procesar la imagen subida
document.getElementById("imageUpload").addEventListener("change", async function(event) {
    let file = event.target.files[0];
    if (!file) return;

    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async function() {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        // Convertir la imagen a 28x28 y escala de grises
        ctx.drawImage(img, 0, 0, 28, 28);
        let imageData = ctx.getImageData(0, 0, 28, 28);
        
        // Preprocesar imagen
        let tensor = tf.browser.fromPixels(imageData, 1)
            .toFloat()
            .div(tf.scalar(255.0))
            .expandDims();

        // Hacer la predicción
        let prediction = model.predict(tensor);
        let predictedClass = prediction.argMax(1).dataSync()[0];

        document.getElementById("prediction").innerText = `El número es: ${predictedClass}`;
    };
});
