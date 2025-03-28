// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAqDVmtDc31ONWzORVTY6BZQBOOCFlrtNk",
    authDomain: "presenty-7a139.firebaseapp.com",
    projectId: "presenty-7a139",
    storageBucket: "presenty-7a139.appspot.com",
    messagingSenderId: "917953928211",
    appId: "1:917953928211:web:52de43f23522ab881c73e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register function
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent page from reloading

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;
    const errorMessage = document.getElementById("register-error-message");

    // Clear previous error message
    errorMessage.innerText = "";

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully registered
            alert("Registration successful! Welcome, " + username);
            console.log("User registered:", userCredential.user);

            // You can store additional info (e.g., username, phone) in your database if needed
            window.location.href = "main.html";  // Redirect to another page after success
        })
        .catch((error) => {
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);

            // Handle and display appropriate error messages
            if (error.code === "auth/email-already-in-use") {
                errorMessage.innerText = "This email is already in use.";
            } else if (error.code === "auth/weak-password") {
                errorMessage.innerText = "Password should be at least 6 characters.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage.innerText = "Invalid email format.";
            } else {
                errorMessage.innerText = "Registration failed. Please try again.";
            }
        });
});
