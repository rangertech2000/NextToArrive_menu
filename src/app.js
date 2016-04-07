/**
 * SEPTA - Next To Arrive
 * 
 * This watchapp tells you the time that the next train will arrive.
 *
 * v1.2
 *
 */

var UI = require('ui');
var ajax = require('ajax');
//var Vibe = require('ui/vibe');

var station1 = 'Wissahickon';
var station2 = 'Suburban%20Station';
var requests = 3;

var main = new UI.Card({
  title: ' SEPTA R6',
  icon: 'images/septa.png',
  subtitle: 'Next Train',
  body: '\n' +
        'UP: Outbound trains\n' +
        'DOWN: Inbound trains\n' +
        'SELECT: Refresh data',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
main.show();

main.on('click', 'up', showOutboundCard);
main.on('click', 'down', showInboundCard);

function showInboundCard(){
  var URL = 'http://www3.septa.org/hackathon/NextToArrive/' + station1 + '/' + station2 + '/' + requests;
  ajax({url: URL, type: 'json'},
  function(data) {
    // Success!
    console.log('Successfully fetched train data!');
    
    // Extract data
    var cardBody = "";
    for (var i=0; i < data.length; i++){
      cardBody += data[i].orig_departure_time + '  ' + data[i].orig_delay + '\n'; 
    }

    // Show to user
    var card = new UI.Card({
      title: 'Inbound R6',
      subtitle: station1.substr(0,14).replace('%20',' '),
      body: String(cardBody) 
    });
    card.show();
    //Vibe.vibrate('short');

    //Show the Outbound card
    card.on('click', 'up', function(e){
      card.hide();
      showOutboundCard();
    });  
    // Refresh the Outbound card
    card.on('click', 'select', function(e){
      card.hide();
      showOutboundCard();
    }); 
  },
  function(error) {
    // Failure!
    console.log('Failed fetching train data: ' + error);
  }
  );      
}

function showOutboundCard(){
  // Construct URL
  var URL = 'http://www3.septa.org/hackathon/NextToArrive/' + station2 + '/' + station1 + '/' + requests;
  //console.log(URL);
  
  // Make the request
  ajax({url: URL, type: 'json'},
    function(data) {
      // Success!
      console.log('Successfully fetched train data!');
      
      // Extract data
      var cardBody = "";
      for (var i=0; i < data.length; i++){
          cardBody += data[i].orig_departure_time + '  ' + data[i].orig_delay + '\n'; 
      }
      
      // Show to user
      var card = new UI.Card({
        title: 'Outbound R6',
        subtitle: station2.substr(0,14).replace('%20',' '),
        body: String(cardBody) });
        card.show();
        //Vibe.vibrate('short');
      
      // Show the Inbound card
      card.on('click', 'down', function(e){
        card.hide();
        showInboundCard();
      });
      // Refresh the Outbound card
      card.on('click', 'select', function(e){
        card.hide();
        showOutboundCard();
      });
    },
    function(error) {
      // Failure!
      console.log('Failed fetching train data: ' + error);
    }
  );
}         


