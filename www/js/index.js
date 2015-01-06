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


  var getPlayers = function() {
    playerOne.name = $('#playerOneName').val().toUpperCase();
    playerTwo.name = $('#playerTwoName').val().toUpperCase();
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
    $('#P1_name').text(playerOne.name);
    $('#P2_name').text(playerTwo.name);
  }

  //SERVE SIDE//
  var switchServeSide = function() {
    if (game.serveside == 'L') {
      game.serveside = 'R';
    } else {
      game.serveside = 'L';
    }
  }

  //UNDO//

  var serializeGame = function() {
    var gameState = {
      playerOneScore: playerOne.score,
      playerTwoScore: playerTwo.score,
      servingSide: game.serveside,
      rally: rallyNumber,
      playerCurrent: currentPlayer,
    };
    return gameState;
  }

  var triggerUndo = function() {
    // $('#serveside').text(""); //FIX THIS!!!!!
    if (rallyNumber > 2) {
      undo();
    } else {
      resetScore();
      rallyNumber = 1;
    }
  }

  var undo = function() {
    var lastGameState = gameHistory.pop();
    // console.log(lastGameState.playerCurrent);
    // console.log(currentPlayer);
    $('#rallyTable tr:last').remove();
    if (playerOne == lastGameState.playerCurrent) {
      currentPlayer = playerOne;
    } else {
      currentPlayer = playerTwo;
    }
    playerOne.score = lastGameState.playerOneScore;
    playerTwo.score = lastGameState.playerTwoScore;
    game.servingside = lastGameState.servingSide;
    rallyNumber = lastGameState.rally; 
    $('#serveside').text("Select serve side for " +currentPlayer.name); 
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score).off('click')
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score).off('click');
    switchServeSide();
    $.mobile.changePage("#page1");
  }

  //RALLY//
  var handleRally = function() {
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
    var tbody = $("#rallyTable tbody");
    var row = $("<tr>").appendTo(tbody).get(0);
    $('#rallyTable tbody tr:last').attr('data-gamestate', serializeGame());
    var rallyCount = row.insertCell(0);
    var playerOneScore = row.insertCell(1);
    var playerTwoScore = row.insertCell(2);

    rallyCount.innerHTML = rallyNumber;
    if (currentPlayer == playerOne) {
      playerOneScore.innerHTML = playerOne.score + game.serveside;
    } else {
      playerOneScore.innerHTML = "-";
    }
    if (currentPlayer == playerTwo) {
      playerTwoScore.innerHTML = playerTwo.score + game.serveside; 
    } else {
      playerTwoScore.innerHTML = "-";
    }    
  }

  //GAME//
  var handleGame = function() {
    var tbody = $("#gameTable tbody");
    var row = $("<tr>").appendTo(tbody).get(0);
    var gameCount = row.insertCell(0);
    var playerOneGameScore = row.insertCell(1);
    var playerTwoGameScore = row.insertCell(2);

    gameCount.innerHTML = (playerOne.games + playerTwo.games);
    playerOneGameScore.innerHTML = playerOne.score;
    playerTwoGameScore.innerHTML = playerTwo.score;        
  }


  //BUTTONS//
  var letCall = function() {
    $.mobile.changePage("#page1");
    switchServeSide();
    handleRally();
    rallyNumberIncrement();  
    switchServeSide();
  }

  var checkServerPlayerOne = function() {
    if (currentPlayer == playerOne) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      $.mobile.changePage("#page3");
      handOut();
    }
  }

  var checkServerPlayerTwo = function() {
    if (currentPlayer == playerTwo) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      $.mobile.changePage("#page3");
      handOut();
    }
  }

  var serveLeft = function() {
    $.mobile.changePage("#page1");
    game.serveside = 'L';
    handleRally();
    rallyNumberIncrement();
    switchServeSide();
  }

  var serveRight = function() { 
    $.mobile.changePage("#page1");
    game.serveside = 'R';
    handleRally();
    rallyNumberIncrement();
    switchServeSide();
  }

  //BUTTONS ABOVE
  var rallyNumberIncrement = function() {
    rallyNumber = rallyNumber + 1;
  }

  var conductCall = function() {
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

  var conductGameMatchP1 = function() {
    if (playerOne.conductwarning == 2) {
      playerTwo.games = playerTwo.games + 1;
      conductGame();
    } else if (playerOne.conductwarning == 3) {
      playerTwo.games = playerTwo.games + 1; 
      conductGame();
      checkMatchOver();
    } else {
      $.mobile.changePage("#page1");
    }
    $('#conduct_warning').val(0);
  }

  var conductGameMatchP2 = function() {
    if (playerTwo.conductwarning == 2) {
      playerOne.games = playerOne.games + 1;
      conductGame();
    } else if (playerTwo.conductwarning == 3) {
      playerOne.games = playerOne.games + 1; 
      conductGame();
      checkMatchOver();
    } else {
      $.mobile.changePage("#page1");
    }
    $('#conduct_warning').val(0);
  }

  var conductGame = function() {
    $.mobile.changePage("#page4");
    handleGame(); 
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
          $.mobile.changePage("#page3");
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
          $.mobile.changePage("#page3");
          handOut();
          rallyNumberIncrement(); 
        }
        break;
      }
      $('#stroke').val(0);
    }
  }

  var handOut = function() {
    switchPlayer();
    awardPointHandout();
    $('#serveside').text("Select serve side for " +currentPlayer.name);
  }

  //FIX THIS DUPLICATE BELOW THREE FUNCTIONS// (without handeRal
  var awardPointHandout = function() {
    if (currentPlayer == playerOne) {
      awardPointToPlayerOneHandout();
    } else {
      awardPointToPlayerTwoHandout();
    }
  }

  var awardPointToPlayerOneHandout= function() {
    playerOne.score = playerOne.score + 1;
    
    if ((playerOne.score >= 11) && (playerOne.score - playerTwo.score >= 2)) {
      playerOne.games = playerOne.games + 1;
      handleGame(); 
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      checkMatchOver();
    }
  }

  var awardPointToPlayerTwoHandout = function() { 
    playerTwo.score = playerTwo.score + 1;
    
    if ((playerTwo.score >= 11) && (playerTwo.score - playerOne.score >= 2)) {
      playerTwo.games = playerTwo.games + 1;
      handleGame(); 
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      checkMatchOver();
    }
  }
  //FIX THIS DUPLICATE ABOVE THREE FUNCTIONS// (without handeRally)

  var awardPoint = function() {
    gameHistory.push(serializeGame());
    if (currentPlayer == playerOne) {
      awardPointToPlayerOne();
    } else {
      awardPointToPlayerTwo();
    }
  }

  var awardPointToPlayerOne = function() {
    playerOne.score = playerOne.score + 1;
    handleRally();
    
    if ((playerOne.score >= 11) && (playerOne.score - playerTwo.score >= 2)) {
      playerOne.games = playerOne.games + 1;
      handleGame(); 
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      checkMatchOver();
    }
  }

  var awardPointToPlayerTwo = function() { 
    playerTwo.score = playerTwo.score + 1;
    handleRally();
    
    if ((playerTwo.score >= 11) && (playerTwo.score - playerOne.score >= 2)) {
      playerTwo.games = playerTwo.games + 1;
      handleGame(); 
      resetScore();
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if ((playerOne.games >= 3) || (playerTwo.games >= 3)) {
      checkMatchOver();
    }
  }

  var checkMatchOver = function() {
    $("#nextgame").hide();
    $("#nextmatch").show();
    $.mobile.changePage("#page4"); 
    $('body').on('click', '#nextmatch', _this.startMatch);
  }

  var switchPlayer = function() {
    if (currentPlayer == playerOne) {
      currentPlayer = playerTwo
    } else {
      currentPlayer = playerOne
    }
  }

  var showEndGame = function() {
    $('#games').text(playerOne.name+': '+playerOne.games+ ' vs ' +playerTwo.name+': '+playerTwo.games) 
    resetRallyTable();
    if ((playerOne.conductwarning > 0) || (playerTwo.conductwarning > 0)) {
      $('#conductheading').text('CONDUCT WARNING');
      $('#show_conduct_warning').text(playerOne.name+': '+playerOne.conductwarning+ ' vs ' +playerTwo.name+': '+playerTwo.conductwarning);
    }
  }

  var resetRallyTable = function() {
    var tbody = $("#rallyTable tbody");
    tbody.find("tr").remove();
  }

  var resetGameTable = function() {
    var tbody = $("#gameTable tbody");
    tbody.find("tr").remove();
  }

  var nextGame = function() {
    $('#serveside').text("Select serve side for " +currentPlayer.name);
    $.mobile.changePage("#page3");
  }

  var resetScore = function() {
    playerOne.score = 0;
    playerTwo.score = 0;
    rallyNumber = 0;
    resetRallyTable();
    $('#point_P1').text(playerOne.name+ " score: " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ " score: " +playerTwo.score);
  }

  var resetMatch = function() {
    playerOne = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    playerTwo = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0};
    game = {'serveside': ''}
    currentPlayer = playerOne;
    $("#nextmatch").hide();
    $("#nextgame").show();
  }
  
  this.startMatch = function() {
    $.mobile.changePage("#page5");
    resetMatch();
    resetGameTable();
    $('#let').text("Let");
    $('#undo').text("Undo Last Rally");
    $('#serve_left').text("Serve Left");
    $('#serve_right').text("Serve Right");
    $('#nextgame').text("Start Next Game"); 
    $('#gamesheading').text('GAMES');    
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
    $('body').on('click', '#startmatch', getPlayers);
    $('body').on('click', '#nextgame', nextGame);
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
