function toggleSignIn() {
	if (firebase.auth().currentUser) {
		// [START signout]
		firebase.auth().signOut();
		// [END signout]
	} else {
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
		if (email.length < 4) {
			alert('Please enter an email address.');
			return;
		}
		if (password.length < 4) {
			alert('Please enter a password.');
			return;
		}
		// Sign in with email and pass.
		// [START authwithemail]
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			document.getElementById('quickstart-sign-in').disabled = false;
			// [END_EXCLUDE]
		});
		// [END authwithemail]
	}
	document.getElementById('quickstart-sign-in').disabled = true;
}

function sendPasswordReset() {
	var email = document.getElementById('email').value;
	// [START sendpasswordemail]
	firebase.auth().sendPasswordResetEmail(email).then(function () {
		// Password Reset Email Sent!
		// [START_EXCLUDE]
		alert('Password Reset Email Sent!');
		// [END_EXCLUDE]
	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/invalid-email') {
			alert(errorMessage);
		} else if (errorCode == 'auth/user-not-found') {
			alert(errorMessage);
		}
		console.log(error);
		// [END_EXCLUDE]
	});
	// [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
	// Listening for auth state changes.
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function (user) {
		// [START_EXCLUDE silent]
		//		document.getElementById('quickstart-verify-email').disabled = true;
		// [END_EXCLUDE]
		if (user) {
			// User is signed in.

			// [START_EXCLUDE]
			document.getElementById('quickstart-sign-in-status').innerHTML = "Signed in" + "<br><p>" + user.email + "</p>";
			document.getElementById('quickstart-sign-in').textContent = 'Sign out';
			$('#signinfields').hide();
			$('.panel-footer').show();
		$('.panel-footer-not-logged').hide();
		


			// An error happened.

			// [END_EXCLUDE]

		} else {
			// User is signed out.
			$('.panel-footer').hide();
		$('.panel-footer-not-logged').show();
			$('#signinfields').show();
			// [START_EXCLUDE]
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
			document.getElementById('quickstart-sign-in').textContent = 'Sign in';

			// [END_EXCLUDE]
		}
		// [START_EXCLUDE silent]
		document.getElementById('quickstart-sign-in').disabled = false;
		// [END_EXCLUDE]
	});
	// [END authstatelistener]
	document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
	document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);


}
