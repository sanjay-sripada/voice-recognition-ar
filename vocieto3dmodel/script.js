window.onload = function () {
    const model = document.getElementById('dynamic-model');
    const modelBasePath = '/voice-recognition-ar/assets/'; // Path to the folder containing 3D models
    const startRecognitionButton = document.getElementById('start-recognition');
    const transcriptDisplay = document.getElementById('transcript');
    const scene = document.querySelector('a-scene');
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
            create3DText(transcript);
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
        const modelPath = `${modelBasePath}${modelName}.glb`; // Assuming models are in GLTF format
        console.log(modelPath)
        model.setAttribute('gltf-model', modelPath);
        console.log(`Loading model: ${modelPath}`);
    }
    function create3DText(text) {
        // Remove existing model if any
        const existingModel = document.getElementById('generated-text');
        if (existingModel) {
            existingModel.parentNode.removeChild(existingModel);
        }

        // Create new 3D text
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            const entity = document.createElement('a-entity');
            entity.setObject3D('mesh', textMesh);
            entity.setAttribute('position', '-0.9 -0.9 -4'); // Adjust position as needed
            entity.setAttribute('scale', '0.05 0.05 0.05');
            entity.setAttribute('id', 'generated-text');

            scene.appendChild(entity);
        });
    }
};