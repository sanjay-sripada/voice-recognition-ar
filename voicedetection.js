
window.onload = function () {
    const model = document.getElementById('dynamic-model');
    const modelBasePath = '/voice-detection-ar/assets/'; // Path to the folder containing 3D models
    const startRecognitionButton = document.getElementById('start-recognition');
    const transcriptDisplay = document.getElementById('transcript');
    let recognition;

    // Check for browser support for Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log(`Recognized: ${transcript}`);
            transcriptDisplay.innerText = transcript;
            loadModel(transcript);
        };

        recognition.onend = function () {
            startRecognitionButton.disabled = false;
        };

        recognition.onerror = function (event) {
            console.error(`Recognition error: ${event.error}`);
            startRecognitionButton.disabled = false;
        };
    } else {
        alert('Your browser does not support Web Speech API');
    }

    startRecognitionButton.onclick = function () {
        if (recognition) {
            startRecognitionButton.disabled = true;
            recognition.start();
            transcriptDisplay.innerText = 'Listening...';
        }
    };

    function loadModel(modelName) {
        // Clear existing model
        model.removeAttribute('gltf-model');

        const modelPath = `${modelBasePath}${modelName}.glb`; // Assuming models are in GLB format
        console.log(modelBasePath)
        model.setAttribute('gltf-model', modelPath);
        console.log(`Loading model: ${modelPath}`);
    }
};
