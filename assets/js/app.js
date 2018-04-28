// Initialize Firebase
var config = {
  apiKey: "AIzaSyBGwy3tNuNPkbNs-E984sLmKfqju3Do25E",
  authDomain: "train-schedule-4929b.firebaseapp.com",
  databaseURL: "https://train-schedule-4929b.firebaseio.com/",
  projectId: "train-schedule-4929b",
  storageBucket: "train-schedule-4929b.appspot.com",
  messagingSenderId: "445078344179"
};
firebase.initializeApp(config);

// Get a reference to database service
var database = firebase.database();


$('#add-user').on('click', function () {
  event.preventDefault();

  let trainName = $('#train-input').val().trim();
  let trainDestination = $('#destination-input').val().trim();
  let trainFirstTime = $('#time-input').val().trim();
  let trainFreq = $('#freq-input').val().trim();

  // clear text-boxes
  $('#train-input').val('');
  $('#destination-input').val('');
  $('#time-input').val('');
  $('#freq-input').val('');

  // Creates local "temporary" object for holding train data
  // Will push this to firebase
  database.ref().push({
    train: trainName,
    destination: trainDestination,
    time: trainFirstTime,
    freq: trainFreq,
  })


})

database.ref().on('child_added', function (childSnapshot) {

  let snapTrain = childSnapshot.val().train;
  let snapDestination = childSnapshot.val().destination;
  let snapFirstTime = childSnapshot.val().time;
  let snapFreq = childSnapshot.val().freq;

  let diffTime = moment().diff(moment.unix(snapFirstTime), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  let timeRemainder = moment().diff(moment.unix(snapFirstTime), "minutes") % snapFreq;
  console.log("TIME REMAINING: " + timeRemainder);
  let minutesAway = snapFreq - timeRemainder;
  console.log("MINUTES UNTIL NEXT TRAIN: " + minutesAway);
  let nextArrival = moment().add(minutesAway, "m").format("HH:mm a");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format('HH:mm a'));

  let newRow = $('<tr>')

  let trainCell = $('<td class="train-name">').text(snapTrain)
  let destinationCell = $('<td class="destination-role">').text(snapDestination)
  let freqCell = $('<td class="freq-role">').text(snapFreq)
  let arrivalCell = $('<td class="next-arrival">').text(nextArrival)
  let minutesAwayCell = $('<td class="minutes-away">').text(minutesAway)


  newRow.append(trainCell).append(destinationCell).append(freqCell).append(arrivalCell).append(minutesAwayCell)
  $('#current-train-time').append(newRow);


})
