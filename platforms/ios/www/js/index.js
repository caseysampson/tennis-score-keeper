/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/***************  SWIPING JAVASCRPI HERE ****************************/
var match = function() {
  var currentPlayer = '';
  var rallyNumber = 1;
  var gameHistory = [];


  getPlayers = function() {  // WILL BE HANDLED ON INTRO PAGE
    playerOne.name = prompt('Enter player one name:');
    playerTwo.name = prompt('Enter: enter player two name:');
  }

  setInitialServer = function() {  // WILL BE HANDLED ON INTRO PAGE
    if (currentPlayer === playerOne) {
      alert(currentPlayer.name+' serves first');
    } else {
      alert(playerTwo.name+' serves first');
    } 
  }

  //SERVE SIDE//

  setInitialServingSide = function() { //DROP DOWN MENU
    $('#dialog').text('Is ' +currentPlayer.name+ ' serving from LEFT or RIGHT?');
  }

  switchServeSide = function() {
    if (game.serveside == 'L') {
      game.serveside = 'R';
    } else {
      game.serveside = 'L';
    }
  }

  //PLAY RALLY//

  var serializeGame = function() {

    var gameState = {
      playerOneScore: playerOne.score,
      playerTwoScore: playerTwo.score,
      servingSide: game.serveside,
      rally: rallyNumber,
    };

    return gameState;
  }

  undo = function() {
    // gameHistory.pop();
    var lastGameState = gameHistory.pop();
    $('#rallyTable tr:last').remove();

    playerOne.score = lastGameState.playerOneScore;
    playerTwo.score = lastGameState.playerTwoScore;
    game.servingside = lastGameState.servingSide;
    rallyNumber = lastGameState.rally;
    setInitialServingSide();
  }

  handleRally = function() {
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
    var tbody = $("#rallyTable tbody");
    var row = $("<tr>").appendTo(tbody).get(0);

    $('#rallyTable tbody tr:last').attr('data-gamestate', serializeGame());
    // $('#rallyTable tbody tr:last').attr('gameState', serializeGame());

    var rallyCount = row.insertCell(0);
    var playerOneScore = row.insertCell(1);
    var gameServeside = row.insertCell(2);
    var playerTwoScore = row.insertCell(3);

    rallyCount.innerHTML = rallyNumber;
    if (currentPlayer == playerOne) {
      playerOneScore.innerHTML = playerOne.score;
    } else {
      playerOneScore.innerHTML = "-";
    }
    gameServeside.innerHTML = game.serveside;
    if (currentPlayer == playerTwo) {
      playerTwoScore.innerHTML = playerTwo.score; 
    } else {
      playerTwoScore.innerHTML = "-";
    }
    
  }

  //BUTTONS BELOW

  letCall = function() {
    handleRally();
    rallyNumberIncrement();  
  }

  strokeCall = function() {
    strokeResult();
    rallyNumberIncrement();
  }

  conductWarn = function() {
    conductCall();
    rallyNumberIncrement();
  }

  checkServerPlayerOne = function() {
    if (currentPlayer == playerOne) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      handOut();
      rallyNumberIncrement();
    }
  }

  checkServerPlayerTwo = function() {
    if (currentPlayer == playerTwo) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      handOut();
      rallyNumberIncrement();
    }
  }

  serveLeft = function() {
    game.serveside = 'L';
    $('#dialog').text('');
  }

  serveRight = function() { 
    game.serveside = 'R';
    $('#dialog').text('');
  }

  //BUTTONS ABOVE
  rallyNumberIncrement = function() {
    rallyNumber = rallyNumber + 1;
  }

  conductCall = function() {
    //PROMPT HANDLED IN DROPDOWN MENU
    var refConduct = prompt('Is the conduct warning for ' +playerOne.name+ ' or ' +playerTwo.name);
    if (refConduct == playerOne.name) {
      playerOne.conductwarning = playerOne.conductwarning + 1;
      conductGameMatch();
    } else {
      playerTwo.conductwarning = playerTwo.conductwarning + 1;
      conductGameMatch();
    }
  }

  conductGameMatch = function() {
    //COMMENT OUT ALERT - figure out how to show conduct warning another way
    alert('Conduct Warning: '+ playerOne.name+': '+playerOne.conductwarning+ ' - ' +playerTwo.name+': '+playerTwo.conductwarning);
    if (playerOne.conductwarning == 2) {
      playerTwo.games = playerTwo.games + 1;
      resetScore();
      $('#games').text('Games: '+ playerOne.name+': '+playerOne.games+ ' - ' +playerTwo.name+': '+playerTwo.games);
    } else if (playerOne.conductwarning == 3) {
      playerTwo.games = playerTwo.games + 1;
      $('#games').text('');
      startMatch();
    } else if (playerTwo.conductwarning == 2) {
      playerOne.games = playerTwo.games + 1;
      resetScore();
      $('#games').text('Games: '+ playerOne.name+': '+playerOne.games+ ' - ' +playerTwo.name+': '+playerTwo.games);
    } else if (playerTwo.conductwarning == 3) {
      playerOne.games = playerTwo.games + 1;
      $('#games').text('');
      startMatch();
    }
  }

  strokeResult = function() {
    //PROMPT HANDLED IN DROPDOWN
    var refStroke = prompt('Is the stroke in favor of ' +playerOne.name+ ' or ' +playerTwo.name);
    if (refStroke === currentPlayer.name) {
      awardPoint();
      switchServeSide(); 
    } else {
      handOut(); 
    }
  }

  handOut = function() {
    switchPlayer();
    awardPoint();
    setInitialServingSide();
  }

  awardPoint = function() {
    gameHistory.push(serializeGame());
    if (currentPlayer == playerOne) {
      awardPointToPlayerOne();
    } else {
      awardPointToPlayerTwo();
    }
  }

  awardPointToPlayerOne = function() {
  
    playerOne.score = playerOne.score + 1;
    handleRally();
    
    if ((playerOne.score >= 11) && (playerOne.score - playerTwo.score >= 2)) {
      playerOne.games = playerOne.games + 1;
      resetScore();
      $('#games').text('Games: '+playerOne.name+': '+playerOne.games+ ' - ' +playerTwo.name+': '+playerTwo.games);
      resetTable();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      startMatch();
    }
  }

  awardPointToPlayerTwo = function() { 
    playerTwo.score = playerTwo.score + 1;
    handleRally();
    
    if ((playerTwo.score >= 11) && (playerTwo.score - playerOne.score >= 2)) {
      playerTwo.games = playerTwo.games + 1;
      resetScore();
      $('#games').text('Games: '+ playerOne.name+': '+playerOne.games+ ' - ' +playerTwo.name+': '+playerTwo.games);  
      resetTable();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      startMatch();
    }
  }

  switchPlayer = function() {
    if (currentPlayer == playerOne) {
      currentPlayer = playerTwo
    } else {
      currentPlayer = playerOne
    }
  }

  resetTable = function() {
    var tbody = $("#rallyTable tbody");
    tbody.find("tr").remove();
  }

  resetScore = function() {
    playerOne.score = 0;
    playerTwo.score = 0;
    rallyNumber = 0;
    resetTable();
    $('#games').text('');
    $('#point_P1').text('Player 1 score');
    $('#point_P2').text('Player 2 score');
    $('#dialog').text('Is ' +currentPlayer.name+ ' serving from LEFT or RIGHT?');
  }

  resetMatch = function() {
    playerOne = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    playerTwo = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    game = {'serveside': ''}
    currentPlayer = playerOne;
  }
  
  //clean up below by using .call (duplicate)
  startMatch = function() {
    resetMatch();
    resetScore();
    getPlayers(); // WILL BE HANDLED ON INTRO PAGE
    setInitialServer(); // WILL BE HANDLED ON INTRO PAGE
    setInitialServingSide(); 
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score).off('click').on('click', checkServerPlayerOne);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score).off('click').on('click', checkServerPlayerTwo);
    $('#let').text("Let").off('click').on('click', letCall);
    $('#stroke').text("Stroke").off('click').on('click', strokeCall);
    $('#conduct_warning').text("Conduct Warning").off('click').on('click', conductWarn);
    $('#serve_left').text("Serve Left").off('click').on('click', serveLeft);
    $('#serve_right').text("Serve Right").off('click').on('click', serveRight);
  }

  this.startMatch = function() {
    resetMatch();
    getPlayers(); // WILL BE HANDLED ON INTRO PAGE
    setInitialServer(); // WILL BE HANDLED ON INTRO PAGE
    setInitialServingSide(); 
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score).off('click').on('click', checkServerPlayerOne);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score).off('click').on('click', checkServerPlayerTwo);
    $('#let').text("Let").off('click').on('click', letCall);
    $('#stroke').text("Stroke").off('click').on('click', strokeCall);
    $('#conduct_warning').text("Conduct Warning").off('click').on('click', conductWarn);
    $('#undo').text("Undo Last Rally").off('click').on('click', undo);
    $('#serve_left').text("Serve Left").off('click').on('click', serveLeft);
    $('#serve_right').text("Serve Right").off('click').on('click', serveRight);
  }
    
};

var myMatch = null;

$(document).ready(function(){
  myMatch = new match();
  myMatch.startMatch();
});




/***************  SWIPING JAVA SCRIPT ENDS HERE *********************/
$('div.ui-page').live("swipeleft", function () {
    var nextpage = $(this).next('div[data-role="page"]');
    if (nextpage.length > 0) {
        $.mobile.changePage(nextpage, "slide", false, true);
    }
});
$('div.ui-page').live("swiperight", function () {
    var prevpage = $(this).prev('div[data-role="page"]');
    if (prevpage.length > 0) {
        $.mobile.changePage(prevpage, {
            transition: "slide",
            reverse: true
        }, true, true);
    }
}); 
