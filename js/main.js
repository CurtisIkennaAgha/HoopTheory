import { firebaseConfig } from './config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log("Persistence set to local. User will stay logged in after closing the app.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Preloader logic and authentication check
window.addEventListener("load", function () {
  const preloaderDuration = 1000; // Set the preloader duration to 1 second (for smoother fade-out)
  const preloader = document.getElementById('preloader');
  const header = document.querySelector('header');
  const navbar = document.querySelector('footer');
  const content = document.querySelector('.content');
  const loginForm = document.querySelector('.login.form');
  const signupForm = document.querySelector('.registration.form');
  const forgotForm = document.querySelector('.forgot.form');
  const container = document.querySelector('.container');

  // Initially set opacity to 0 for header, navbar, content, and forms
  header.style.opacity = '0';
  navbar.style.opacity = '0';
  content.style.opacity = '0';
  loginForm.style.opacity = '0';
  signupForm.style.opacity = '0';
  forgotForm.style.opacity = '0';

  // Show the preloader for the specified duration
  setTimeout(function () {
    preloader.style.transition = 'opacity 1s ease'; // Add transition for smooth fade-out
    preloader.style.opacity = '0'; // Start fading out the preloader

    // After fade-out completes, hide the preloader and reveal the header, navbar, and content
    setTimeout(function () {
      preloader.style.display = 'none'; // Hide the preloader

      // Use opacity transition to fade in header, navbar, and content
      header.style.display = 'flex';   // Set to flex to match the layout
      navbar.style.display = 'flex';   // Make sure navbar is set to flex (or block if needed)
      content.style.display = 'block'; // Content is set to block or flex as needed

      // Trigger the fade-in effect by adding transition
      setTimeout(function () {
        header.style.transition = 'opacity 1s ease';
        navbar.style.transition = 'opacity 1s ease';
        content.style.transition = 'opacity 1s ease';

        header.style.opacity = '1';
        navbar.style.opacity = '1';

        // Delay the content fade-in by 0.5 seconds
        setTimeout(function () {
          content.style.opacity = '1';
        }, 500); // Delay content fade-in by half a second (500ms)
      }, 100); // Delay before applying transition

    }, preloaderDuration); // Match this time with the fade-out duration
  }, preloaderDuration); // Show the preloader for the specified duration

  // Firebase authentication check
// Firebase authentication check
auth.onAuthStateChanged((user) => {
    const loginForm = document.querySelector('.login.form');
    const signupForm = document.querySelector('.registration.form');
    const forgotForm = document.querySelector('.forgot.form');
    const container = document.querySelector('.container');
    const navbar = document.querySelector('footer'); // Make sure footer is defined
  
    if (user && user.emailVerified) {
      // User is logged in and email is verified
      loginForm.style.display = 'none';
      signupForm.style.display = 'none';
      forgotForm.style.display = 'none';
      container.style.display = 'block'; // Main content should be visible
      navbar.style.display = 'flex'; // Ensure footer is visible
    } else {
      // User is logged out
      loginForm.style.display = 'block'; // Make sure login form is visible
      signupForm.style.display = 'none';
      forgotForm.style.display = 'none';
      container.style.display = 'none'; // Hide main content
      navbar.style.display = 'none'; // Hide footer
    }
  });
  
  

  // Signup form logic
  const signupBtn = document.querySelector('.signupbtn');
  signupBtn.addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        user.sendEmailVerification()
          .then(() => {
            alert('Verification email sent. Please check your inbox and verify your email before signing in.');
          })
          .catch((error) => {
            alert('Error sending verification email: ' + error.message);
          });

        firestore.collection('users').doc(uid).set({
          name: name,
          username: username,
          email: email,
        });

        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        forgotForm.style.display = 'none';
      })
      .catch((error) => {
        alert('Error signing up: ' + error.message);
      });
  });

  // Login form logic
  const loginBtn = document.querySelector('.loginbtn');
  loginBtn.addEventListener('click', () => {
    const email = document.querySelector('#inUsr').value.trim();
    const password = document.querySelector('#inPass').value;
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          console.log('User is signed in with a verified email.');
          location.href = "home.html"; // Redirect to home
        } else {
          alert('Please verify your email before signing in.');
        }
      })
      .catch((error) => {
        alert('Error signing in: ' + error.message);
      });
  });

  // Forgot password form logic
  const forgotBtn = document.querySelector('.forgotbtn');
  forgotBtn.addEventListener('click', () => {
    const emailForReset = document.querySelector('#forgotinp').value.trim();
    if (emailForReset.length > 0) {
      auth.sendPasswordResetEmail(emailForReset)
        .then(() => {
          alert('Password reset email sent. Please check your inbox to reset your password.');
          signupForm.style.display = 'none';
          loginForm.style.display = 'block';
          forgotForm.style.display = 'none';
        })
        .catch((error) => {
          alert('Error sending password reset email: ' + error.message);
        });
    }
  });
});

window.onscroll = function() {
    shrinkHeader();
  };
  
  function shrinkHeader() {
    const header = document.querySelector('header');
    
    // Once you've scrolled past 100px, shrink the header
    if (window.scrollY > 100) {
      header.classList.add('shrink'); // Add the shrink class
    } else {
      header.classList.remove('shrink'); // Remove the shrink class
    }
  }
  