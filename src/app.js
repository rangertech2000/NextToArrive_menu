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

var main = new UI.Card({
  title: ' SEPTA R6',
  icon: 'images/septa.png',
  subtitle: 'Next Train',
  body: '\n' +
        'UP: Northbound\n' +
        'DOWN: Southbound\n' +
        'SELECT: Refresh data',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
main.show();

main.on('click', 'up', function(e){showTrainInfo(1);});
main.on('click', 'down', function(e){showTrainInfo(0);});

function showTrainInfo(direction){
  // Determine the train direction
  var staStart, staEnd;
  if (direction === 0){
    staStart = station1; staEnd = station2;}
  else {
    staStart = station2; staEnd = station1;}
  console.log(direction +' ' + staStart + ' ' + staEnd);
  
  // Fetch data from SEPTA
  var URL = 'http://www3.septa.org/hackathon/NextToArrive/' + staStart + '/' + staEnd + '/' + requests;
  ajax({url: URL, type: 'json'},
  function(data) {
    // Success!
    console.log('Successfully fetched train data!');
    console.log('data length: ' + data.length);
    
    staStart = staStart.substr(0, 14).replace('%20',' ');
    staEnd = staEnd.substr(0, 14).replace('%20',' ');
    
    // Show to user
    if (data.length === 0){
      var card = new UI.Card({subtitle: 'No trains are available at this time'});
      card.show();
    }
    else{
      showCard(0);
    }
    
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
          title: staStart,
          subtitle: '>> ' + data[trainNo].orig_departure_time + '  >>',
          body: 'Arrives: ' + data[trainNo].orig_arrival_time +
            '\n  at ' + staEnd +
            '\n' + delay
        });
        card.show();
        
      
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
        
        // Refresh the data
        card.on('click', 'select', function(e){
          card.hide();
          Vibe.vibrate('short');
          showTrainInfo(direction);
        });  
      }
    },
  function(error) {
    // Failure!
    console.log('Failed fetching train data: ' + error);
  }
  );      
}
       


