// REGISTER DOM ELEMENTS

var uid = '';
var imgclass = '';
var divdir = '';
var messageField = $('#emoji-txt');
var messageList = $('#example-messages');
var lastfid = '1';
var lastdir = 'L';
var newdir = 'L';
var authUserName = '';


//************************* Emojis ********************************
//*****************************************************************
var $wysiwyg = $('.emojis-wysiwyg').emojiarea({
	wysiwyg: true
});
var $wysiwyg_value = $('#emojis-wysiwyg-value');

$wysiwyg.on('change', function () {
	$wysiwyg_value.text($(this).val());
});
$wysiwyg.trigger('change');
//****************************************************************


// CREATE A REFERENCE TO FIREBASE (Messages)
var refMessages = firebase.database().ref("Messages");
//        var refMessages = new Firebase("https://nyslmobile-beringar.firebaseio.com/Messages");
// CREATE A REFERENCE TO FIREBASE (Users)
var refUsers = firebase.database().ref("Users");
//		var refUsers = new Firebase("https://nyslmobile-beringar.firebaseio.com/Users");



function updateScroll() {
	var element = document.getElementById("messages_container");
	element.scrollTop = element.scrollHeight;
}


function newChat() {
	//	$("#firechat-wrapper").show();

	refMessages.limitToLast(10).on('child_added', function (snapshot) {

		//GET DATA
		var data = snapshot.val();
		var uid_d = data.uid;
		var username_d = data.name;
		var message_d = data.text;
		var dir_d = data.dir;
		var date_d = data.currentdate;
		var bgcolor_d = data.bgcolor;
		var strProfilePic = "img/Soccer%20Ball-128x128.png";

		if (dir_d) {
			imgclass = dir_d == "R" ? "pull-right" : "pull-left";
			divdir = dir_d == "R" ? "divTxtR" : "divTxtL";
		}
		//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
		var messageElement = $("<li class='media' f='" + uid_d + "'>");
		var divmediabody = $("<div class='media-body'>");
		var divmedia = $("<div class='media'>");
		var a = $("<a class='" + imgclass + "' href='#'><img class='media-object img-circle' src='" + strProfilePic + "' /></a>");
		var divmediabody2 = $("<div class='media-body " + divdir + "'>");
		divmediabody2.css('background', bgcolor_d);
		messageElement.append(divmediabody);
		divmediabody.append(divmedia);
		divmedia.append(a);
		divmedia.append(divmediabody2);

		var usernamediv = $("<div class='text-muted'>");
		divmediabody2.html(usernamediv);
		usernamediv.html(username_d + " " + date_d);
		divmediabody2.append("<div class='chat_message'>" + message_d + "</div>");


		//ADD MESSAGE
		messageList.append(messageElement);
		console.log("1 message appended!");
		updateScroll();
		//		*************************************************
		//		Get the bg color of last submitted text message based on fabebook id in firebase.
		//		*************************************************

		//*************************************************
		//Get the last submitted text message direction in firebase.
		//*************************************************

		//		*************************************************
		//		 Add a callback that is triggered for each chat message.
	});

	getLastDirection();
	//*************************************************
	//Save the user's profile into Firebase so we can list users,
	//Use them in Security and Firebase Rules, and show profiles
	//ref.child('users').child(authData.uid).set(authData);

	//				refUsers.child(chatUser.uid).set({
	//				name: username,
	//				text: message,
	//				uid: uid,
	//				bgcolor: bgcolor,
	//				currentdate: cdate.toLocaleString(),
	//				dir: newdir
	//			});

	//				var bgcolorRef = firebase.database().ref('Users/' + LoggedUser.uid + '/bgcolor');
	//bgcolorRef.on('value', function(snapshot) {
	//  newcolor = snapshot.val();
	//});
	//ƒ (snapshot) {
	//  newcolor = snapshot.val();
	//}
	//newcolor
	//"#eee"
}


// LISTEN FOR KEYPRESS EVENT

$(".emoji-wysiwyg-editor").on("keydown", function (e) {
	if (e.which == 13) {
		// your code       
		pushData();
		return false;
	}
});


$("#btnSend").click(function () {
	pushData();
});


function pushData() {

	//FIELD VALUES
	var username = authUserName;
	var message = $(".emoji-wysiwyg-editor").html();
	//Clientside Datetime
	if (message === "") {
		return;
	}
	var cdate = new Date();

	//***********************************************************
	//Set current text message direction to push it to firebase.
	//***********************************************************

	//	getLastDirection();
	lastdir = $('#hf_lastdir').val();
	lastfid = $('#hf_lastfid').val();

	if (lastfid != uid) {
		newdir = lastdir == "L" ? "R" : "L";
	} else {
		newdir = lastdir;
	}
	//***********************************************************
	var bgcolor = $('#hf_bgcolor').val();
	if (!bgcolor) {
		//Generate random color to set the background color of the text body.
		var back = ["#ffccff", "#7fffd4", "#fac08f", "#00ffff", "#ffd700"];
		bgcolor = back[Math.floor(Math.random() * back.length)];
	}

	//			//***********************************************************
	//			// Google search functionality
	//			//***********************************************************
	//			var keyword = '';
	//			var bSearchImg = false;
	//			var _url = 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=';
	//			if (message.toLowerCase().match('^s ')) {
	//				keyword = message.substring(2, message.length);
	//				_url = _url + keyword
	//			}
	//			if (message.toLowerCase().match('^s img ')) {
	//				keyword = message.substring(6, message.length);
	//				_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + keyword;
	//				bSearchImg = true;
	//			}
	//
	//			if (keyword.length > 0) {
	//				$.ajax({
	//					url: _url,
	//					type: "GET",
	//					dataType: 'jsonp',
	//					async: 'true',
	//					success: function(data) {
	//						var strResult = '';
	//						if (!bSearchImg) {
	//							$.each(data.results, function(i, rows) {
	//								strResult = strResult + rows.title + "<br/>" + "<a href='" + rows.url + "' target='_blank'>" + rows.url + "</a>" + "<br/><br/>";
	//							});
	//						} else {
	//							$.each(data.responseData.results, function(i, rows) {
	//								strResult = strResult + rows.title + "<br/>" + "<a href='" + rows.url + "' target='_blank'><img src='" + rows.url + "' height='100' width='100'></img></a>" + "<br/><br/>";
	//							});
	//						}
	//
	//						message = message + "<br/>" + strResult;
	//						//SAVE DATA TO FIREBASE.
	//						refMessages.push({
	//							name: username,
	//							text: message,
	//							uid: uid,
	//							bgcolor: bgcolor,
	//							currentdate: cdate.toLocaleString(),
	//							dir: newdir
	//						});
	//					}
	//				});


	//SAVE DATA TO FIREBASE.
	refMessages.push({
		name: username,
		text: message,
		uid: uid,
		bgcolor: bgcolor,
		currentdate: cdate.toLocaleString(),
		dir: newdir
	});
	$(".emoji-wysiwyg-editor").html('');

}

//**********************************************************************************
//Get the bg color of last submitted text message based on uid in firebase.
//**********************************************************************************
function getUserData(uid) {

	firebase.database().ref("Users/" + uid).once('value').then(function (snapshot) {
		var data = snapshot.val();
		$('#hf_bgcolor').val(data.bgcolor);
		authUserName = data.name;
		console.log("color for " + data.name + " is " + data.bgcolor);
	});
}


//***********************************************************
//Get the last submitted text message direction in firebase.
//***********************************************************
function getLastDirection() {
	refMessages.limitToLast(1).on('child_added', function (snapshot) {
		var data = snapshot.val();
		$('#hf_lastfid').val(data.uid);
		$('#hf_lastdir').val(data.dir);
		console.log("last message direction is :" + data.dir);
	});
}









////      // Initialize Firebase SDK
////      var config = {
////        apiKey: "AIzaSyDFlsisAa2yeDhRjSPdoC6Ez0UjOrSf9sc",
////        authDomain: "firechat-demo-app.firebaseapp.com",
////        databaseURL: "https://firechat-demo-app.firebaseio.com"
////      };
////      firebase.initializeApp(config);
//// Get a reference to the Firebase Realtime Database
//
//
//function showChat (){
//var chatRef = firebase.database().ref();
//var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
//var userChat = firebase.auth().currentUser;
//	chat.setUser(userChat.uid, userChat.displayName);
//
//
//// Create an instance of Firechat
//
//// Listen for authentication state changes
//firebase.auth().onAuthStateChanged(function (user) {
//	if (user) {
//		// If the user is logged in, set them as the Firechat user
//		
//	} else {
//
//	}
//
//	//		  else {
//	//          // If the user is not logged in, sign them in anonymously
//	//          
//	//        }
//});
//}


