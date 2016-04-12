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
var Vibe = require('ui/vibe');

var station1 = 'Wissahickon';
var station2 = 'Suburban%20Station';
var requests = 3;

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var departTime = data[i].orig_departure_time;
    //title = title.charAt(0).toUpperCase() + title.substring(1);
    var arriveTime = data[i].orig_arrival_time;
    arriveTime = arriveTime.replace('PM','').replace('AM','');
    
    // Get date/time substring
    var status = data[i].orig_delay;
    if (status != 'On time'){
      status = status + ' late';
    }
    //time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

    // Add to menu items array
    items.push({
      title:departTime + ' >> ' + arriveTime,
      subtitle:status
    });
  }

  // Finally return whole array
  return items;
};

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

main.on('click', 'up', function(e){showOutboundCard(0);});
main.on('click', 'down', function(e){showInboundCard(0);});

function showInboundCard(trainNo){
  var URL = 'http://www3.septa.org/hackathon/NextToArrive/' + station1 + '/' + station2 + '/' + requests;
  ajax({url: URL, type: 'json'},
  function(data) {
    // Success!
    console.log('Successfully fetched train data!');
 
    //parseFeed(data, data.length);
    
    function showCard(trainNo){
        var delay = data[trainNo].orig_delay;
        var delayMins = delay.substr(0, delay.indexOf(' '));
        var bgColor;
        
        if (delayMins == 'On'){bgColor = 'green';}
          else if (delayMins > 0 && delayMins < 15){
            bgColor = 'yellow';
            delay = delay + ' late';}
          else if (delayMins > 0){
            bgColor = 'red';
            delay = delay + ' late';}
      
        var card = new UI.Card({ 
          backgroundColor: bgColor,
          title: station1.substr(0, 14).replace('%20',' '),
          subtitle: '>> ' + data[trainNo].orig_departure_time + '  >>',
          body: 'Arrives: ' + data[trainNo].orig_arrival_time +
            '\n  at ' + station2.substr(0, 14).replace('%20',' ') +
            '\n' + delay
        });
        card.show();
        //Vibe.vibrate('short');
      
        // Show the next card
        card.on('click', 'down', function(e){
          if (trainNo < 2){trainNo++;
          card.hide();
          showCard(trainNo);
          }
        });
        
        // Show the previous card
        card.on('click', 'up', function(e){
          if (trainNo !== 0){trainNo--;
          card.hide();
          showCard(trainNo);
          }
        });
        
        // Refresh the Outbound card
        card.on('click', 'select', function(e){
          card.hide();
          showCard(trainNo);
        });  
      }
        
      // Show to user
      console.log(trainNo);
      showCard(trainNo);
    },
  function(error) {
    // Failure!
    console.log('Failed fetching train data: ' + error);
  }
  );      
}

function showOutboundCard(trainNo){
  // Construct URL
  var URL = 'http://www3.septa.org/hackathon/NextToArrive/' + station2 + '/' + station1 + '/' + requests;
  //console.log(URL);
  
  // Make the request
  ajax({url: URL, type: 'json'},
    function(data) {
      // Success!
      console.log('Successfully fetched train data!');
      
      function showCard(trainNo){
        var delay = data[trainNo].orig_delay;
        var delayMins = delay.substr(0, delay.indexOf(' '));
        var bgColor;
        
        if (delayMins == 'On'){bgColor = 'green';}
          else if (delayMins > 0 && delayMins < 15){
            bgColor = 'yellow';
            delay = delay + ' late';}
          else if (delayMins > 0){
            bgColor = 'red';
            delay = delay + ' late';}
      
        var card = new UI.Card({ 
          backgroundColor: bgColor,
          title: station2.substr(0, 14).replace('%20',' '),
          subtitle: '>> ' + data[trainNo].orig_departure_time + '  >>',
          body: 'Arrives: ' + data[trainNo].orig_arrival_time +
            '\n  at ' + station1 +
            '\n' + delay
        });
        card.show();
        //Vibe.vibrate('short');
      
        // Show the next card
        card.on('click', 'down', function(e){
          if (trainNo < 2){trainNo++;
          card.hide();
          showCard(trainNo);
          }
        });
        
        // Show the previous card
        card.on('click', 'up', function(e){
          if (trainNo !== 0){trainNo--;
          card.hide();
          showCard(trainNo);
          }
        });
        
        // Refresh the Outbound card
        card.on('click', 'select', function(e){
          card.hide();
          showCard(trainNo);
        });  
      }
        
      // Show to user
      console.log(trainNo);
      showCard(trainNo);
    },
    function(error) {
      // Failure!
      console.log('Failed fetching train data: ' + error);
    }
  );
}         


