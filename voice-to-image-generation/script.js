// // Mock function to generate image URL based on the prompt
// function generateImage(prompt) {
//     // In a real scenario, you would call an API to generate the image
//     console.log(`Generating image for prompt: ${prompt}`);
//     return new Promise(resolve => {
//         setTimeout(() => {
//             // Mock URL, replace with actual image generation logic
//             const mockUrl = 'https://via.placeholder.com/512.png?text=' + encodeURIComponent(prompt);
//             console.log(mockUrl)
//             resolve(mockUrl);
//         }, 2000);
//     });
// }

// // Function to clear existing image and add new generated image to AR scene
// function addImageToAR(url, lat, lon) {
//     // Remove existing image entity if it exists
//     const oldImageEntity = document.getElementById('generated-image');
//     if (oldImageEntity) {
//         oldImageEntity.parentNode.removeChild(oldImageEntity);
//     }

//     // Create new image entity
//     const newImageEntity = document.createElement('a-entity');
//     newImageEntity.setAttribute('id', 'generated-image');
//     newImageEntity.setAttribute('geometry', {
//         primitive: 'plane',
//         height: 2,
//         width: 2
//     });
//     newImageEntity.setAttribute('material', {
//         src: url
//     });
//     newImageEntity.setAttribute('position', '0 1 0');
//     newImageEntity.setAttribute('gps-entity-place', {
//         latitude: lat,
//         longitude: lon
//     });
//     newImageEntity.setAttribute('look-at', '[gps-camera]');

//     // Append new image entity to the scene
//     document.querySelector('a-scene').appendChild(newImageEntity);
// }

// // Function to start voice recognition
// function startRecognition() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = event => {
//         const speechResult = event.results[0][0].transcript;
//         console.log(`Result received: ${speechResult}`);
//         document.getElementById('recognized-text').innerText = `You said: ${speechResult}`;
//         console.log(speechResult)
//         generateImage(speechResult).then(url => {
//             // Get current location
//             navigator.geolocation.getCurrentPosition(position => {
//                 const lat = position.coords.latitude;
//                 const lon = position.coords.longitude;
//                 addImageToAR(url, lat, lon);
//             });
//         });
//     };

//     recognition.onerror = event => {
//         console.error('Speech recognition error detected: ' + event.error);
//         document.getElementById('recognized-text').innerText = 'Error: ' + event.error;
//     };

//     recognition.onend = () => {
//         console.log('Speech recognition service disconnected');
//     };

//     recognition.start();
//     console.log('Speech recognition started');
// }





const apiKey = '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';  // Replace with your actual OpenAI API key

async function generateImage(prompt) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '512x512'
        })
    });

    const data = await response.json();
    if (response.ok) {
        return data.data[0].url;
    } else {
        throw new Error(data.error.message);
    }
}

function addImageToAR(url, lat, lon) {
    const oldImageEntity = document.getElementById('generated-image');
    if (oldImageEntity) {
        oldImageEntity.parentNode.removeChild(oldImageEntity);
    }

    const newImageEntity = document.createElement('a-entity');
    newImageEntity.setAttribute('id', 'generated-image');
    newImageEntity.setAttribute('geometry', {
        primitive: 'plane',
        height: 2,
        width: 2
    });
    newImageEntity.setAttribute('material', {
        src: url
    });
    newImageEntity.setAttribute('position', '0 1 0');
    newImageEntity.setAttribute('gps-entity-place', {
        latitude: lat,
        longitude: lon
    });
    newImageEntity.setAttribute('look-at', '[gps-camera]');

    document.querySelector('a-scene').appendChild(newImageEntity);
}

function startRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = event => {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('recognized-text').innerText = `You said: ${speechResult}`;
        generateImage(speechResult).then(url => {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                addImageToAR(url, lat, lon);
            });
        }).catch(error => {
            console.error('Error generating image:', error);
            document.getElementById('recognized-text').innerText = `Error: ${error.message}`;
        });
    };

    recognition.onerror = event => {
        console.error('Speech recognition error detected:', event.error);
        document.getElementById('recognized-text').innerText = 'Error: ' + event.error;
    };

    recognition.onend = () => {
        console.log('Speech recognition service disconnected');
    };

    recognition.start();
}

