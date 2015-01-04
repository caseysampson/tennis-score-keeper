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

  var _this = this;


  getPlayers = function() {  // WILL BE HANDLED ON INTRO PAGE
    playerOne.name = $('#playerOneName').val();
    playerTwo.name = $('#playerTwoName').val();
    $.mobile.changePage("#page3");
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
    $('#playerOneStroke').text(playerOne.name);
    $('#playerTwoStroke').text(playerTwo.name);
    $('#playerOneConduct').text(playerOne.name);
    $('#playerTwoConduct').text(playerTwo.name);
    $('#serveside').text("Select serve side for " +currentPlayer.name);
    $('#P1_score').text(playerOne.name);
    $('#P2_score').text(playerTwo.name);
  }

  //SERVE SIDE//

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

  triggerUndo = function() {
    $.mobile.changePage("#page3");
    $('#serveside').text(""); //FIX THIS!!!!!
    if (rallyNumber > 2) {
      undo();
    } else {
      resetScore();
      rallyNumber = 1;
    }
  }

  undo = function() {
    // gameHistory.pop();
    var lastGameState = gameHistory.pop();
    $('#rallyTable tr:last').remove();
    playerOne.score = lastGameState.playerOneScore;
    playerTwo.score = lastGameState.playerTwoScore;
    game.servingside = lastGameState.servingSide;
    rallyNumber = lastGameState.rally;  
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score).off('click')
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score).off('click');
  }

  handleRally = function() {
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
    var tbody = $("#rallyTable tbody");
    var row = $("<tr>").appendTo(tbody).get(0);
    $('#rallyTable tbody tr:last').attr('data-gamestate', serializeGame());
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

  //Game End Table BELOW

  handleGame = function() {
    var tbody = $("#gameTable tbody");
    var row = $("<tr>").appendTo(tbody).get(0);
    var gameCount = row.insertCell(0);
    var playerOneGameScore = row.insertCell(1);
    var playerTwoGameScore = row.insertCell(2);

    gameCount.innerHTML = (playerOne.games + playerTwo.games);
    playerOneGameScore.innerHTML = playerOne.score;
    playerTwoGameScore.innerHTML = playerTwo.score;        
  }


  //BUTTONS BELOW

  letCall = function() {
    $.mobile.changePage("#page1");
    handleRally();
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

  var checkServerPlayerTwo = function() {
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
    $.mobile.changePage("#page1");
    game.serveside = 'L';
  }

  serveRight = function() { 
    $.mobile.changePage("#page1");
    game.serveside = 'R';
  }

  //BUTTONS ABOVE
  rallyNumberIncrement = function() {
    rallyNumber = rallyNumber + 1;
  }

  conductCall = function() {
    var conduct_warning = document.getElementById('conduct_warning');
    conduct_warning.onchange = changeHandler;
    function changeHandler() {
      switch($('#conduct_warning option:selected').val()) {
        case "playerOneConduct": 
          playerOne.conductwarning = playerOne.conductwarning + 1;
          conductGameMatchP1();
          break;
        case "playerTwoConduct": 
          playerTwo.conductwarning = playerTwo.conductwarning + 1;
          conductGameMatchP2();
          break;
      }
    }
  }

  conductGameMatchP1 = function() {
    if (playerOne.conductwarning == 2) {
      playerTwo.games = playerTwo.games + 1;
      conductGame();
    } else if (playerOne.conductwarning == 3) {
      playerTwo.games = playerTwo.games + 1;
      _this.startMatch();
    } else {
      $.mobile.changePage("#page1");
    }
    $('#conduct_warning').val(0);
  }

  conductGameMatchP2 = function() {
    if (playerTwo.conductwarning == 2) {
      playerOne.games = playerOne.games + 1;
      conductGame();
    } else if (playerTwo.conductwarning == 3) {
      playerOne.games = playerOne.games + 1;
      _this.startMatch();
    } else {
      $.mobile.changePage("#page1");
    }
    $('#conduct_warning').val(0);
  }

  conductGame = function() {
    $.mobile.changePage("#page4");
    showEndGame();
    resetScore();
    rallyNumberIncrement();
  }

  function strokeResult() {
    var stroke = document.getElementById('stroke');
    stroke.onchange = changeHandler;
    function changeHandler(){
      switch($('#stroke option:selected').val()) {
      case "playerOneStroke": 
        if (playerOne.name == currentPlayer.name) {
          awardPoint();
          switchServeSide(); 
          rallyNumberIncrement();
          $.mobile.changePage("#page1");
        } else {
          handOut(); 
          rallyNumberIncrement();
        }
        break;
      case "playerTwoStroke": 
        if (playerTwo.name == currentPlayer.name) {
          awardPoint();
          switchServeSide(); 
          rallyNumberIncrement();
          $.mobile.changePage("#page1");
        } else {
          handOut();
          rallyNumberIncrement(); 
        }
        break;
      }
      $('#stroke').val(0);
    }
  }

  handOut = function() {
    $.mobile.changePage("#page3");
    switchPlayer();
    awardPoint();
    $('#serveside').text("Select serve side for " +currentPlayer.name);
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
      handleGame(); // Test HANDLEGAME
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      _this.startMatch();
    }
  }

  awardPointToPlayerTwo = function() { 
    playerTwo.score = playerTwo.score + 1;
    handleRally();
    
    if ((playerTwo.score >= 11) && (playerTwo.score - playerOne.score >= 2)) {
      playerTwo.games = playerTwo.games + 1;
      handleGame(); // Test HANDLEGAME
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      _this.startMatch();
    }
  }

  switchPlayer = function() {
    if (currentPlayer == playerOne) {
      currentPlayer = playerTwo
    } else {
      currentPlayer = playerOne
    }
  }

  showEndGame = function() {
    $('#P1games').text(playerOne.name+': '+playerOne.games)
    $('#P2games').text(playerTwo.name+': '+playerTwo.games);  
    resetTable();
    if ((playerOne.conductwarning > 0) && (playerOne.conductwarning > 0)) {
      $('#conductheading').text('CONDUCT WARNING');
      $('#P1show_conduct_warning').text(playerOne.name+': '+playerOne.conductwarning);
      $('#P2show_conduct_warning').text(playerTwo.name+': '+playerTwo.conductwarning);
    }
  }

  resetTable = function() {
    var tbody = $("#rallyTable tbody");
    tbody.find("tr").remove();
  }

  nextGame = function() {
    $('#serveside').text("Select serve side for " +currentPlayer.name);
    $.mobile.changePage("#page3");
  }

  resetScore = function() {
    playerOne.score = 0;
    playerTwo.score = 0;
    rallyNumber = 0;
    resetTable();
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
  }

  resetMatch = function() {
    playerOne = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    playerTwo = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    game = {'serveside': ''}
    currentPlayer = playerOne;
  }
  

  this.startMatch = function() {
    $.mobile.changePage("#page5");
    resetMatch();
    $('#let').text("Let");
    // $('#conduct_warning').text("Conduct Warning");
    $('#undo').text("Undo Last Rally");
    $('#serve_left').text("Serve Left");
    $('#serve_right').text("Serve Right");
    $('#nextgame').text("Start Next Game"); 
    $('#gamesheading').text('GAMES');
    $('#P1games').text(playerOne.name+': '+playerOne.games)
    $('#P2games').text(playerTwo.name+': '+playerTwo.games);
    
  }

  this._bindEvents = function() {
    $('body').on('click', '#point_P1', checkServerPlayerOne);
    $('body').on('click', '#point_P2', checkServerPlayerTwo);
    $('body').on('click', '#let', letCall);
    $('body').on('click', '#stroke', strokeResult);
    $('body').on('click', '#conduct_warning', conductCall);
    $('body').on('click', '#undo', triggerUndo);
    $('body').on('click', '#serve_left', serveLeft);
    $('body').on('click', '#serve_right', serveRight);
    $('body').on('click', '#nextgame', nextGame);
    $('body').on('click', '#startmatch', getPlayers);
  };
    
};

var myMatch = null;

$(document).ready(function(){
  myMatch = new match();
  myMatch._bindEvents();
  myMatch.startMatch();
});




/***************  SWIPING JAVA SCRIPT ENDS HERE *********************/
// $('div.ui-page').live("swipeleft", function () {
//     var nextpage = $(this).next('div[data-role="page"]');
//     if (nextpage.length > 0) {
//         $.mobile.changePage(nextpage, "slide", false, true);
//     }
// });
// $('div.ui-page').live("swiperight", function () {
//     var prevpage = $(this).prev('div[data-role="page"]');
//     if (prevpage.length > 0) {
//         $.mobile.changePage(prevpage, {
//             transition: "slide",
//             reverse: true
//         }, true, true);
//     }
// }); 
