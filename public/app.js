document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const uploadedImage = document.getElementById('uploadedImage');
    const processing = document.getElementById('processing');
    const continueBtn = document.getElementById('continueBtn');
    const imagePreview = document.getElementById('imagePreview');
    const resultContainer = document.getElementById('result-container');
    const sendContainer = document.getElementById('send-container');
    const sendBtn = document.getElementById('sendBtn');
    const successMessage = document.getElementById('successMessage');

    let processedImageData = null;

    // Agregar esta función para enviar la imagen procesada al servidor
    function sendImageToServer() {
        const processedImage = document.getElementById('processedImage');

        if (!processedImage.src || processedImage.src === '' || processedImage.src.startsWith('data:image')) {
            alert('Por favor, selecciona una imagen antes de enviar.');
            return;
        }

        fetch(processedImage.src)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('file', blob, 'imagen_procesada.png');

                // Enviar la imagen al servidor usando fetch y el método POST
                fetch('/guardar-imagen', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        // Mostrar el mensaje de éxito al usuario
                        showSuccessMessage();
                    })
                    .catch(error => console.error('Error al enviar la imagen:', error));
            })
            .catch(error => console.error('Error al obtener la imagen:', error));
    }


    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            showImagePreview();
        };

        reader.readAsDataURL(file);
    });

    continueBtn.addEventListener('click', function () {
        hideImagePreview();
        showProcessing();
        simulateProcessing();
    });

    sendBtn.addEventListener('click', function () {
        saveProcessedFile();
        showSuccessMessage();
    });

    function showImagePreview() {
        imagePreview.style.display = 'block';
        continueBtn.style.display = 'block';
        fileInput.style.display = 'none';
    }

    function hideImagePreview() {
        imagePreview.style.display = 'none';
        continueBtn.style.display = 'none';
    }

    function showProcessing() {
        processing.style.display = 'block';
    }

    function hideProcessing() {
        processing.style.display = 'none';
    }

    function simulateProcessing() {
        setTimeout(function () {
            hideProcessing();
            processedImageData = "¡Imagen procesada!"; // Coloca aquí el contenido procesado de la imagen
            showResultContainer();
        }, 10000); // 10 segundos
    }

    function showResultContainer() {
        resultContainer.style.display = 'block';
        sendContainer.style.display = 'block';
    }

    function saveProcessedFile() {
        // Llamada a la API de Node.js para enviar el contenido de la imagen al servidor
        fetch('/guardar-imagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: processedImageData }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error al guardar la imagen:', error));
    }

    function showSuccessMessage() {
        sendContainer.style.display = 'none';
        successMessage.style.display = 'block';
    }
});
