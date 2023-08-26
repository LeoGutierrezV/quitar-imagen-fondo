document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const uploadedImage = document.getElementById("uploadedImage");
  const processing = document.getElementById("processing");
  const continueBtn = document.getElementById("continueBtn");
  const imagePreview = document.getElementById("imagePreview");
  const resultContainer = document.getElementById("result-container");
  const sendContainer = document.getElementById("send-container");
  const sendBtn = document.getElementById("sendBtn");
  const successMessage = document.getElementById("successMessage");

  let processedImageData = null;

  // Agregar esta función para enviar la imagen procesada al servidor
  function sendImageToServer() {
    const processedImage = document.getElementById("processedImage");

    if (
      !processedImage.src ||
      processedImage.src === "" ||
      processedImage.src.startsWith("data:image")
    ) {
      alert("Por favor, selecciona una imagen antes de enviar.");
      return;
    }

    fetch(processedImage.src)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("file", blob, "imagen_procesada.png");

        // Enviar la imagen al servidor usando fetch y el método POST
        fetch("/guardar-imagen", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Mostrar el mensaje de éxito al usuario
            showSuccessMessage();
          })
          .catch((error) => console.error("Error al enviar la imagen:", error));
      })
      .catch((error) => console.error("Error al obtener la imagen:", error));
  }

  // Función para agregar un marco a la imagen
  function processAndSendImage() {
    const frameImage = document.getElementById("frameImage");
    const fileInput = document.getElementById("fileInput");

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      fetch("/guardar-imagen", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          const processedImage = new Image();
          processedImage.src = "./Imagen/output.png";
          processedImage.onload = () => {
            const frame = new Image();
            frame.src = "./fonts/fondo.png";
            frame.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = frame.width;
              canvas.height = frame.height;

              const context = canvas.getContext("2d");
              const x = (frame.width - processedImage.width) / 2;
              const y = (frame.height - processedImage.height) / 2;
              context.drawImage(
                processedImage,
                x,
                y,
                processedImage.width,
                processedImage.height
              );

              context.drawImage(frame, 0, 0, frame.width, frame.height);
              frameImage.src = canvas.toDataURL("image/png");

              const resultContainer =
                document.getElementById("result-container");
              resultContainer.style.display = "block";
            };
          };
        })
        .catch((error) => console.error("Error al guardar la imagen:", error));
    } else {
      console.log("Por favor selecciona una imagen");
    }
  }

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
      showImagePreview();
    };

    reader.readAsDataURL(file);
  });

  continueBtn.addEventListener("click", function () {
    hideImagePreview();
    showProcessing();
    simulateProcessing();
  });

  sendBtn.addEventListener("click", function () {
    saveProcessedFile();
    showSuccessMessage();
  });

  function showImagePreview() {
    imagePreview.style.display = "block";
    continueBtn.style.display = "block";
    fileInput.style.display = "none";
  }

  function hideImagePreview() {
    imagePreview.style.display = "none";
    continueBtn.style.display = "none";
  }

  function showProcessing() {
    processing.style.display = "block";
  }

  function hideProcessing() {
    processing.style.display = "none";
  }

  function simulateProcessing() {
    setTimeout(function () {
      hideProcessing();
      processedImageData = "¡Imagen procesada!";
      showResultContainer();
    }, 3000); // 10 segundos
    processAndSendImage();
  }

  function showResultContainer() {
    resultContainer.style.display = "block";
    sendContainer.style.display = "block";
  }

  function saveProcessedFile() {
    const frameImage = document.getElementById("frameImage");
    const canvas = document.createElement("canvas");
    canvas.width = frameImage.width;
    canvas.height = frameImage.height;

    const context = canvas.getContext("2d");
    context.drawImage(frameImage, 0, 0);

    const generatedImageDataURL = canvas.toDataURL("image/png");

    const blob = dataURLtoBlob(generatedImageDataURL);

    const formData = new FormData();
    formData.append("file", blob, "imagen_generada.png");

    fetch("/guardar-imagen-generada", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Error al guardar la imagen:", error));
  }

  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  function showSuccessMessage() {
    sendContainer.style.display = "none";
    successMessage.style.display = "block";
  }
});
