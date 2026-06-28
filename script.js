// --- Interactive Typing Animation Loop ---
const words = ["B.Tech CSE Student", "Web Developer", "AI Enthusiast"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const targetTextElement = document.getElementById("typing-text");

function typeEffect() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
        targetTextElement.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
    } else {
        targetTextElement.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentWord.length) {
        speed = 2000; // Pause at full word
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length; // Rotate loop
        speed = 400; // Small delay before typing next word
    }

    setTimeout(typeEffect, speed);
}

// Add this to your existing frontend script.js
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the page from refreshing automatically

    // Grab the values typed by the user in your input fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        // Shoot the data over the network to our Node server on port 5000
        const response = await fetch('https://harry-portfolio-backend.onrender.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email,subject, message })
        });

        const data = await response.json();

        if (data.success) {
            alert('Awesome! Your message has been saved to the MySQL database.');
            document.getElementById('contact-form').reset(); // Clear the form inputs
        } else {
            alert('Oops! Database error.');
        }
    } catch (error) {
        console.error('Connection error:', error);
        alert('Could not connect to backend. Is your server running?');
    }
});

// --- Dark/Light Preference System ---
const darkModeBtn = document.getElementById("darkModeBtn");
const themeIcon = darkModeBtn.querySelector("i");

// Initialize from device or last local session cache
const activeTheme = localStorage.getItem("theme");
if (activeTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
}

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    if (isDark) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});

// Kick off initialization
document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
});