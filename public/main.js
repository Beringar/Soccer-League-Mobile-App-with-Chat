//--------------------	GLOBAL VARIABLES

var teamsArray = mainData.teams;
var locationsArray = mainData.locations;
var matchesArray = mainData.matches;
var markers = [];
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

//---------------------	EXECUTIONS



//----------------------PAGE INIT EVENT and PAGE LOAD EVENTS



$(document).ready(function () {
	sortMatchesGetDates();
	matchesList();
	teamsList();
	locationsList();
	scoresList();
	getUpcomingMatchesHome();
	initApp();
	newChat();
	console.log("Home Init!");
});

//$(document).one("pagecreate", function (event) {
//	getUpcomingMatchesHome();
//	teamsList();
//	matchesList();
//	locationsList();
//	scoresList();
//	newChat(updateScroll);
//	console.log("Home Init");
//});



//$(document).on('pagecontainerload', '#home', function () {
//	getUpcomingMatchesHome();
//	teamsList();
//	matchesList();
//	locationsList();
//	scoresList();
//	newChat(updateScroll);
//	console.log("Home Init");
//});

$(document).on('pagebeforeshow', '#teams', function () {

	$(".team_item").off("click", "a").on("click", "a", function () {
		var team_id = $(this).attr('data_team_id');
		teamPage(team_id);
		console.log("team from TEAMS page");
	});
});

$(document).on('pagebeforeshow', '#locations', function () {

	$(".location_item").off("click", "a").on("click", "a", function () {
		var location_id = $(this).attr('data_location_id');
		locationPage(location_id);
		console.log("location from locations");
	});
});

//$(document).on('pagebeforeshow', '#games', function () {
//
//});

$(document).on('pagebeforeshow', '#lastscores', function () {

});

$(document).on('pagebeforeshow', '#gamepage', function () {
	$(".team_item").off("click", "a").on("click", "a", function () {
		var team_id = $(this).attr('data_team_id');
		teamPage(team_id);
		console.log("team from game page");
	});
	$(".location_item").off("click", "a").on("click", "a", function () {
		var location_id = $(this).attr('data_location_id');
		locationPage(location_id);
		console.log("location from game page");
	});
});

$(document).on('pagebeforeshow', '#teampage', function () {

	$("#team_schedule_button").off("click", "a").on("click", "a", function () {
		var team_id = $(this).attr('data_team_id');
		getTeamSchedule(team_id);
		console.log("schedule from team page");
	});
});

$(document).on('pagebeforeshow', '#signup', function () {
	initApp();
});

$(document).on('pagebeforeshow', '#chat', function () {
//	initApp();
	if (firebase.auth().currentUser === null) {
		$('.panel-footer').hide();
		$('.panel-footer-not-logged').show();
	} else {
		var chatUser = firebase.auth().currentUser;
		//		authUserName = chatUser.displayName;
		uid = chatUser.uid;
		getUserData(uid);
		$('.panel-footer').show();
		$('.panel-footer-not-logged').hide();
	}
	updateScroll();
	console.log("chat page");
});

//---------------------FUNCTIONS

function sortMatchesGetDates() {
	for (var i = 0; i < matchesArray.length; i++) {
		matchesArray[i].date = new Date(matchesArray[i].date);
	}
	matchesArray.sort(function (a, b) {
		return a.date - b.date;
	});
}

function teamsList() {
	var team_item_Html;
	for (var i = 0; i < teamsArray.length; i++) {
		team_item_Html = "<div class='team_item'><a href = '#teampage' class='ui-btn ui-corner-all ui-shadow font500' data_team_id='" + teamsArray[i].team_id + "'><img src='" + teamsArray[i].team_logo + "'><br>" + teamsArray[i].team_name + "</a></div>";
		$('.team_list').append(team_item_Html);
	}
}

function locationsList() {
	var location_item_Html;
	for (var i = 0; i < locationsArray.length; i++) {
		location_item_Html = "<div class='location_item'><a href = '#locationpage' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500' data_location_id='" + locationsArray[i].location_id + "'>" + locationsArray[i].location_name + "</a></div>";
		$('.locations_list').append(location_item_Html);
	}
}

function matchesList() {
	var match_item_Html;
	var today = new Date();
	for (var i = 0; i < matchesArray.length; i++) {
		var match_datetime = matchesArray[i].date;

		var month = match_datetime.getMonth() + 1;
		var day = match_datetime.getDate();
		var hours = match_datetime.getHours();
		var minutes = match_datetime.getMinutes();
		var dayName = weekday[match_datetime.getDay()];

		var output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

		var output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

		if (matchesArray[i].date > today) {

			match_item_Html = "<div class='game_list_item'><a href = '#gamepage' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500 game_list_item_back' data_game_id='" + matchesArray[i].match_id + "' onclick='return gamePage(" + matchesArray[i].match_id + ");'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].local_team_id].team_logo + "'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].visitor_team_id].team_logo + "'><br>" + teamsArray[matchesArray[i].local_team_id].team_name + "<span class='dateTimeSmall'> vs. </span>" + teamsArray[matchesArray[i].visitor_team_id].team_name + "<br><span class='dateTimeSmall'>" + dayName + " " + output_date + " Time: " + output_time + "</span></a></div>";
			$('.games_list').append(match_item_Html);
		}
	}
}

function scoresList() {
	$('#last_scores_home').empty();
	matchesArray.sort(function (a, b) {
		return b.date - a.date;
	});
	var match_score_item_Html;
	var today = new Date();
	var scoresCount = 0;

	for (var i = 0; i < matchesArray.length; i++) {
		var match_datetime = matchesArray[i].date;

		var month = match_datetime.getMonth() + 1;
		var day = match_datetime.getDate();
		var hours = match_datetime.getHours();
		var minutes = match_datetime.getMinutes();
		var dayName = weekday[match_datetime.getDay()];

		var output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

		var output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

		if (match_datetime < today) {

			match_score_item_Html = "<div class='score_item centered_text' id='" + matchesArray[i].match_id + "'><p class='score_team_name'>" + teamsArray[matchesArray[i].local_team_id].team_name + " <span class='smallScore'>" + matchesArray[i].local_team_score + " - " + matchesArray[i].visitor_team_score + " </span> " + teamsArray[matchesArray[i].visitor_team_id].team_name + "</p><p class='score_date'>Date: " + output_date + "</p></div><hr class='hr_scores'>";
			$('.scores_list').append(match_score_item_Html);
			scoresCount++;
			if (scoresCount <= 2) {
				$('#last_scores_home').append(match_score_item_Html);
			}
		}
	}
}

function getLastScores(data_teamId) {
	$('#team_last_scores').empty();
	matchesArray.sort(function (a, b) {
		return b.date - a.date;
	});
	var match_score_item_Html = "";
	var today = new Date();
	var scoresCount = 0;

	for (var i = 0; i < matchesArray.length; i++) {
		var match_datetime = matchesArray[i].date;

		var month = match_datetime.getMonth() + 1;
		var day = match_datetime.getDate();
		var hours = match_datetime.getHours();
		var minutes = match_datetime.getMinutes();
		var dayName = weekday[match_datetime.getDay()];

		var output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

		var output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

		if (((data_teamId == matchesArray[i].local_team_id) || (data_teamId == matchesArray[i].visitor_team_id)) && (match_datetime < today)) {
			
			match_score_item_Html = "<div class='score_item centered_text' id='" + matchesArray[i].match_id + "'><p class='score_team_name'>" + teamsArray[matchesArray[i].local_team_id].team_name + " <span class='smallScore'>" + matchesArray[i].local_team_score + " - " + matchesArray[i].visitor_team_score + " </span> " + teamsArray[matchesArray[i].visitor_team_id].team_name + "</p><p class='score_date'>Date: " + output_date + "</p></div><hr class='hr_scores'>";
			$('.scores_list').append(match_score_item_Html);

			/*match_score_item_Html = "<div class='score_item centered_text' id='" + matchesArray[i].match_id + "'><p class='score_team_name'>" + teamsArray[matchesArray[i].local_team_id].team_name + "</p><p  class='score_result'>" + matchesArray[i].local_team_score + " - " + matchesArray[i].visitor_team_score + "</p><p class='score_team_name'>" + teamsArray[matchesArray[i].visitor_team_id].team_name + "</p><p class='score_date'>Date: " + output_date + "</p></div><hr class='hr_scores'>";*/
			scoresCount++;
			if (scoresCount <= 2) {
				$('#team_last_scores').append(match_score_item_Html);
			}
		}
	}
	if (match_score_item_Html === "") {
		$('#team_last_scores').html("No matches played yet!");
	}
}

function teamPage(data_teamId) {

	$(".team_name_top").html(teamsArray[data_teamId].team_name);
	$(".team_logo").attr("src", teamsArray[data_teamId].team_logo);
	$("#team_description").html(teamsArray[data_teamId].team_description);
	getLastScores(data_teamId);
	getNextMatch(data_teamId);
	$("#team_schedule_button").html("<a href = '#teamschedule' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500' data_team_id='" + data_teamId + "' data-transition='pop'>" + teamsArray[data_teamId].team_name + " Full Game Schedule</a>");
}

function locationPage(data_locationId) {

	$("#location_name_top").html(locationsArray[data_locationId].location_name);
	$(".location_adress").html(locationsArray[data_locationId].location_adress);
	$("#location_map").html("<iframe width='100%' height='320' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyAXS3IDaIsNR6azlVz8eA8K2Os8eU9-gr0&q=" + locationsArray[data_locationId].marker_data[1] + "," + locationsArray[data_locationId].marker_data[2] + "' allowfullscreen></iframe>");
	$("#location_get_directions_button").html("<a href='https://www.google.com/maps/dir/?api=1&destination=" + locationsArray[data_locationId].marker_data[1] + "," + locationsArray[data_locationId].marker_data[2] + "&travelmode=driving' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-navigation font500'>Get directions on Google Maps</a>");
}

function getGameData(matchesArray, data_gameId) {

	for (var i = 0; i < matchesArray.length; i++) {
		if (matchesArray[i].match_id == data_gameId) return matchesArray[i];
	}
}

function gamePage(data_gameId) {

	var matchData = getGameData(matchesArray, data_gameId);

	var match_datetime = matchData.date;
	var month = match_datetime.getMonth() + 1;
	var day = match_datetime.getDate();
	var hours = match_datetime.getHours();
	var minutes = match_datetime.getMinutes();
	var dayName = weekday[match_datetime.getDay()];

	var output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

	var output_time = (hours < 10 ? '0' : '') + hours + ':' +
		(minutes < 10 ? '0' : '') + minutes;

	var game_info_html = "<div class='ui-body ui-body-a'><div class='team_item'><a href='#teampage' class='ui-btn ui-corner-all ui-shadow font500' data_team_id='" + teamsArray[matchData.local_team_id].team_id + "'><img src='" + teamsArray[matchData.local_team_id].team_logo + "'><br>" + teamsArray[matchData.local_team_id].team_name + "</a></div><p class='vs centered_text'>vs.</p><div class='team_item'><a href='#teampage' class='ui-btn ui-corner-all ui-shadow font500' data_team_id='" + teamsArray[matchData.visitor_team_id].team_id + "'><img src='" + teamsArray[matchData.visitor_team_id].team_logo + "'><br>" + teamsArray[matchData.visitor_team_id].team_name + "</a></div><p>Location:</p><div class='location_item'><a href='#locationpage' class='ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-location font500' data_location_id='" + locationsArray[matchData.match_location_id].location_id + "' data-transition='pop'>" + locationsArray[matchData.match_location_id].location_name + "</a></div><p>Date:<br><span id='game_date'>" + dayName + " " + output_date + "</span></p><p>Time:<br><span id ='game_time'>" + output_time + "</span></p></div>";

	$("#game_info").html(game_info_html);
}

function getUpcomingMatchesHome() {
	$('#upcoming_matches').empty();
	var match_item_Html = "";
	var upcomingCounter = 0;
	var today = new Date();

	for (var i = 0; i < matchesArray.length; i++) {
		var match_datetime = matchesArray[i].date;
		var month = match_datetime.getMonth() + 1;
		var day = match_datetime.getDate();
		var hours = match_datetime.getHours();
		var minutes = match_datetime.getMinutes();
		var dayName = weekday[match_datetime.getDay()];

		var output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

		var output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
		if (matchesArray[i].date > today) {

			match_item_Html = "<div class='game_list_item'><a href = '#gamepage' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500 game_list_item_back' data_game_id='" + matchesArray[i].match_id + "' onclick='return gamePage(" + matchesArray[i].match_id + ");'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].local_team_id].team_logo + "'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].visitor_team_id].team_logo + "'><br>" + teamsArray[matchesArray[i].local_team_id].team_name + "<span class='dateTimeSmall'> vs. </span>" + teamsArray[matchesArray[i].visitor_team_id].team_name + "<br><span class='dateTimeSmall'>" + dayName + " " + output_date + " Time: " + output_time + "</span></a></div>";
			$('#upcoming_matches').append(match_item_Html);
			upcomingCounter++;
		}
		if (upcomingCounter === 2) {
			break;
		}
	}
	if (match_item_Html === "") {
		$('#upcoming_matches').html("No upcoming matches!");
	}
	//	$(".game_list_item").off("click", "a").on("click", "a", function () {
	//		var game_id = $(this).attr('data_game_id');
	//		gamePage(game_id);
	//	});
}

function getNextMatch(data_teamId) {
	$('#team_next_match').empty();
	var match_item_Html = "";
	var today = new Date();
	var match_datetime, month, day, hours, minutes, output_date, output_time, dayName;
	var next_match_count = 0;

	for (var i = 0; i < matchesArray.length; i++) {
		if (next_match_count === 1) {
			break;
		}
		match_datetime = matchesArray[i].date;
		month = match_datetime.getMonth() + 1;
		day = match_datetime.getDate();
		hours = match_datetime.getHours();
		minutes = match_datetime.getMinutes();
		dayName = weekday[match_datetime.getDay()];
		output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
		output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

		if (((data_teamId == matchesArray[i].local_team_id) || (data_teamId == matchesArray[i].visitor_team_id)) && (matchesArray[i].date > today)) {
			next_match_count++;
			match_item_Html = "<div class='game_list_item'><a href = '#gamepage' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500 game_list_item_back' data_game_id='" + matchesArray[i].match_id + "' onclick='return gamePage(" + matchesArray[i].match_id + ");'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].local_team_id].team_logo + "'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].visitor_team_id].team_logo + "'><br>" + teamsArray[matchesArray[i].local_team_id].team_name + "<span class='dateTimeSmall'> vs. </span>" + teamsArray[matchesArray[i].visitor_team_id].team_name + "<br><span class='dateTimeSmall'>" + dayName + " " + output_date + " Time: " + output_time + "</span></a></div>";
		}
	}
	if (match_item_Html === "") {
		$('#team_next_match').html("No upcoming matches!");
	} else {
		$('#team_next_match').html(match_item_Html);
	}

}

function getTeamSchedule(data_teamId) {
	$('#team_schedule').empty();
	var match_item_Html = "";
	var today = new Date();
	var match_datetime, month, day, hours, minutes, output_date, output_time, dayName;
	var teamScheduleHtml = "";

	for (var i = 0; i < matchesArray.length; i++) {

		match_datetime = matchesArray[i].date;
		month = match_datetime.getMonth() + 1;
		day = match_datetime.getDate();
		hours = match_datetime.getHours();
		minutes = match_datetime.getMinutes();
		dayName = weekday[match_datetime.getDay()];
		output_date = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
		output_time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

		if (((data_teamId == matchesArray[i].local_team_id) || (data_teamId == matchesArray[i].visitor_team_id)) && (matchesArray[i].date > today)) {

			match_item_Html = "<div class='game_list_item'><a href = '#gamepage' class='ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-info font500 game_list_item_back' data_game_id='" + matchesArray[i].match_id + "' onclick='return gamePage(" + matchesArray[i].match_id + ");'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].local_team_id].team_logo + "'><img class='logoTeamSmall' src='" + teamsArray[matchesArray[i].visitor_team_id].team_logo + "'><br>" + teamsArray[matchesArray[i].local_team_id].team_name + "<span class='dateTimeSmall'> vs. </span>" + teamsArray[matchesArray[i].visitor_team_id].team_name + "<br><span class='dateTimeSmall'>" + dayName + " " + output_date + " Time: " + output_time + "</span></a></div>";
			teamScheduleHtml = teamScheduleHtml + match_item_Html;
		}
	}
	if (teamScheduleHtml === "") {
		$('#team_schedule').html("No upcoming matches!");
	} else {
		$('#team_schedule').html(teamScheduleHtml);
	}
	//	$(".game_list_item").off("click", "a").on("click", "a", function () {
	//		var game_id = $(this).attr('data_game_id');
	//		gamePage(game_id);
	//	});
}


//CODE TO DELETE USERS IN FIREBASE FROM DEVELOPERS CONSOLE
//var intervalId;
//
//var clearFunction = function() {
//  if ($('[aria-label="Eliminar cuenta"]').size() == 0) {
//    console.log("interval cleared")
//    clearInterval(intervalId)
//    return
//  }
//  $('[aria-label="Eliminar cuenta"]')[0].click();
//  setTimeout(function () {
//     $(".md-raised:contains(Eliminar)").click()
//  }, 1000);
//};
//
//intervalId = setInterval(clearFunction, 3000)
