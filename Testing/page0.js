import { firebaseConfig } from './config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const signupForm = document.querySelector('.registration.form');
const loginForm = document.querySelector('.login.form');
const forgotForm = document.querySelector('.forgot.form');
const container = document.querySelector('.container');
const signupBtn = document.querySelector('.signupbtn');
const loginBtn = document.querySelector('.loginbtn');
const forgotBtn = document.querySelector('.forgotbtn');

// Function to handle form switching logic
function setActiveForm(formToDisplay) {
  signupForm.style.display = 'none';
  loginForm.style.display = 'none';
  forgotForm.style.display = 'none';

  // Show the selected form
  formToDisplay.style.display = 'block';
}

const anchors = document.querySelectorAll('a');
anchors.forEach(anchor => {
  anchor.addEventListener('click', () => {
    const id = anchor.id;
    switch (id) {
      case 'loginLabel':
        setActiveForm(loginForm);
        break;
      case 'signupLabel':
        setActiveForm(signupForm);
        break;
      case 'forgotLabel':
        setActiveForm(forgotForm);
        break;
    }
  });
});

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
      
      console.log('User data saved to Firestore');
      firestore.collection('users').doc(uid).set({
        name: name,
        username: username,
        email: email,
        type: 0,
      });

      // Switch to login form after successful signup
      setActiveForm(loginForm);
    })
    .catch((error) => {
      alert('Error signing up: ' + error.message);
    });
});

loginBtn.addEventListener('click', () => {
  const email = document.querySelector('#inUsr').value.trim();
  const password = document.querySelector('#inPass').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log('User is signed in with a verified email.');
        location.href = "home.html";
      } else {
        alert('Please verify your email before signing in.');
      }
    })
    .catch((error) => {
      alert('Error signing in: ' + error.message);
    });
});

forgotBtn.addEventListener('click', () => {
  const emailForReset = document.querySelector('#forgotinp').value.trim();
  if (emailForReset.length > 0) {
    auth.sendPasswordResetEmail(emailForReset)
      .then(() => {
        alert('Password reset email sent. Please check your inbox to reset your password.');
        // Switch back to the login form after sending reset email
        setActiveForm(loginForm);
      })
      .catch((error) => {
        alert('Error sending password reset email: ' + error.message);
      });
  }
});
