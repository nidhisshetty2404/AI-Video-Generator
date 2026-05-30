// ==========================
// LOGIN FUNCTION
// ==========================
function loginUser() {
    const name = document.getElementById("username").value;

    if (name.trim() === "") {
        alert("Enter your name");
        return;
    }

    localStorage.setItem("userName", name);

    const loginPage = document.getElementById("loginPage");
    const welcome = document.getElementById("welcomePage");
    const appPage = document.getElementById("appPage");

    loginPage.style.display = "none";

    welcome.style.display = "flex";
    welcome.classList.add("show");

    document.getElementById("welcomeText").innerText =
        "Hey " + name + " 👋";

    const quotes = [
        "✨ Hope you create something amazing today!",
        "🚀 Ready to turn your story into a movie?",
        "🎬 Your imagination starts here!",
        "🌟 Let’s bring your ideas to life!",
        "🔥 Time to create something epic!"
    ];

    document.getElementById("quoteText").innerText =
        quotes[Math.floor(Math.random() * quotes.length)];

    setTimeout(() => {
        welcome.classList.remove("show");

        setTimeout(() => {
            welcome.style.display = "none";

            appPage.style.display = "flex";

            setTimeout(() => {
                appPage.classList.add("show");
            }, 50);

            document.getElementById("profileName").innerText = name;

        }, 400);

    }, 2500);
}


// ==========================
// GENERATE VIDEO
// ==========================
async function generateVideo() {

    console.log("Generate button clicked");

    const generateBtn = document.getElementById("generateBtn");
    generateBtn.disabled = true;

    const story = document.getElementById("storyInput").value;
    const previewBox = document.getElementById("previewBox");

    const selectedTag = document.querySelector(".tag.active");
    const style = selectedTag ? selectedTag.innerText : "Cinematic";

    if (story.trim() === "") {
        previewBox.innerHTML = "⚠️ Please enter a prompt!";
        generateBtn.disabled = false;
        return;
    }

    // ✅ LOADING UI
    previewBox.innerHTML = `
        <div class="loader"></div>
        <p style="margin-top:15px;">
            Generating ${style} AI video...
        </p>
    `;

    try {

        const response = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: story,
                style: style
            })
        });

        const data = await response.json();

        console.log(data);

        // ✅ VIDEO OUTPUT
        previewBox.innerHTML = `
            <video width="100%" controls autoplay>
                <source src="${data.videoUrl}" type="video/mp4">
            </video>

            <p style="margin-top:10px;">
                🎬 ${story}
            </p>

            <p>
                🎨 Style: ${style}
            </p>
        `;

        // ==========================
        // VOICEOVER
        // ==========================
        const voiceEnabled =
            document.getElementById("voiceToggle").checked;

        if (voiceEnabled) {

            speechSynthesis.cancel();

            const speech =
                new SpeechSynthesisUtterance(story);

            speech.rate = 1;
            speech.pitch = 1;

            speechSynthesis.speak(speech);
        }

    } catch (error) {

        console.error(error);

        previewBox.innerHTML = `
            ❌ Error connecting to backend
        `;
    }

    generateBtn.disabled = false;
}


// ==========================
// STYLE TAG CLICK
// ==========================
function setupTags() {

    const tags = document.querySelectorAll(".tag");

    tags.forEach(tag => {

        tag.addEventListener("click", () => {

            tags.forEach(t =>
                t.classList.remove("active")
            );

            tag.classList.add("active");
        });
    });
}


// ==========================
// PROFILE MENU
// ==========================
function toggleProfileMenu() {

    const menu = document.getElementById("profileMenu");

    menu.style.display =
        (menu.style.display === "block")
            ? "none"
            : "block";
}


// ==========================
// SETTINGS
// ==========================
function openSettings() {
    document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}


// ==========================
// THEME
// ==========================
function toggleTheme() {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

    } else {

        localStorage.setItem("theme", "dark");
    }
}


// ==========================
// LOGOUT
// ==========================
function logout() {

    localStorage.clear();
    location.reload();
}


// ==========================
// PAGE LOAD
// ==========================
window.onload = function () {

    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("appPage").style.display = "none";

    const savedName = localStorage.getItem("userName");

    if (savedName) {
        document.getElementById("profileName").innerText = savedName;
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    setupTags();
};


// ==========================
// SPEECH RECOGNITION
// ==========================
function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Speech recognition not supported");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = function(event) {

        const speechText =
            event.results[0][0].transcript;

        document.getElementById("storyInput").value =
            speechText;
    };

    recognition.onerror = function(event) {

        console.log(event.error);

        if (event.error === "not-allowed") {

            alert("🎤 Please allow microphone access");

        } else {

            alert("Microphone error: " + event.error);
        }
    };

    recognition.start();
}