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
  var rallyNumber = 0;
  var gameHistory = [];
  var _this = this;
  var buttonServeside = '';


  var getPlayers = function() {
    playerOne.name = $('#playerOneName').val().toUpperCase();
    playerTwo.name = $('#playerTwoName').val().toUpperCase();
    $.mobile.changePage("#page3");
    loadPlayers();
  }

  var loadPlayers = function() {
    $('#serverPlayerOne').text(playerOne.name);
    $('#serverPlayerTwo').text(playerTwo.name);
    $('#point_P1').text(playerOne.name+ ": " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score);
    $('#P1_score').text(playerOne.name);
    $('#P2_score').text(playerTwo.name);
    $('#P1_score2').text(playerOne.name);
    $('#P2_score2').text(playerTwo.name);
    $('#P1_score3').text(playerOne.name);
    $('#P2_score3').text(playerTwo.name);
    $('#P1_game').text(playerOne.name);
    $('#P2_game').text(playerTwo.name);
    $('#P1_name').text(playerOne.name);
    $('#P2_name').text(playerTwo.name);  
    displayButton(); 
  }

  var setTally = function() {
    $.mobile.changePage("#page4");
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
      buttonSide: buttonServeside
    };
    return gameState;
  }

  var triggerUndo = function() {
    if (rallyNumber > 1) {
      undo();
    } else {
      resetScore();
      rallyNumber = 0;
      $.mobile.changePage("#page1", { transition: "flip"} ); 
    }
  }

  var undo = function() {
    lastGameState = gameHistory.pop();
    var lastrally = gameHistory[gameHistory.length-1];
    playerOne.score = lastrally.playerOneScore;
    playerTwo.score = lastrally.playerTwoScore;
    game.serveside = lastrally.servingSide;
    buttonServeside = lastrally.buttonSide
    rallyNumber = lastrally.rally;
    displayButton();
    $('#rallyTable tr:eq(1)').remove();
    $.mobile.changePage("#page1", { transition: "flip"} ); 
  }

  var displayButton = function() {
    if (game.serveside == "R") {
      buttonServeside = "L";
    } else {
      buttonServeside = "R";
    }

    if (currentPlayer == playerOne) {
      $('#point_P1').text(playerOne.name+ "("+buttonServeside+")");
      $('#point_P2').text(playerTwo.name); 
    } else {
      $('#point_P1').text(playerOne.name);
      $('#point_P2').text(playerTwo.name+ "("+buttonServeside+")"); 
    }
  }
 
  //RALLY//
  var handleRally = function() {
    handleRallyTable();
  }

  var handleRallyTable = function() {
    displayButton();
    
    var tbody = $("#rallyTable tbody");
    var row = $("<tr>").prependTo(tbody).get(0);
    // $('#rallyTable tbody tr:last').attr('data-gamestate', serializeGame());
    var rallyCount = row.insertCell(0);
    var playerOneScore = row.insertCell(1);
    var playerTwoScore = row.insertCell(2);

    rallyCount.innerHTML = rallyNumber+" ("+game.serveside+")";

    if ((playerOne.score >= 40) && (playerTwo.score >= 40)) {
      if (playerOne.score > playerTwo.score) {
        playerOneScore.innerHTML = "Advantage";
        playerTwoScore.innerHTML = "-";
      } else if (playerOne.score < playerTwo.score) {
        playerTwoScore.innerHTML = "Advantage";
        playerOneScore.innerHTML = "-";
      } else {
        playerTwoScore.innerHTML = "Deuce";
        playerOneScore.innerHTML = "Deuce";
      }
    } else {
      playerOneScore.innerHTML = playerOne.score
      playerTwoScore.innerHTML = playerTwo.score
    }
    gameHistory.push(serializeGame());  
  }

  var rallyNumberIncrement = function() {
    rallyNumber = rallyNumber + 1;
  }

  //GAME//
  var handleGame = function() {
    if (playerOne.set + playerTwo.set + 1 == 1) {
      var tbody = $("#gameTable tbody");
    } else if (playerOne.set + playerTwo.set + 1 == 2) {
      $("#gameTable2").show();
      var tbody = $("#gameTable2 tbody");
    } else if (playerOne.set + playerTwo.set + 1 == 3) {
      $("#gameTable3").show();
      var tbody = $("#gameTable3 tbody");
    }

    var row = $("<tr>").appendTo(tbody).get(0);
    var gameCount = row.insertCell(0);
    var playerOneGameScore = row.insertCell(1);
    var playerTwoGameScore = row.insertCell(2);

    gameCount.innerHTML = (playerOne.games + playerTwo.games);

    if ((playerOne.score >= 40) && (playerTwo.score >= 40)) {
      if (playerOne.score > playerTwo.score) {
        playerOneGameScore.innerHTML = "45";
        playerTwoGameScore.innerHTML = "40";
      } else if (playerOne.score < playerTwo.score) {
        playerTwoGameScore.innerHTML = "45";
        playerOneGameScore.innerHTML = "40";
      } 
    } else {
      playerOneGameScore.innerHTML = playerOne.score;
      playerTwoGameScore.innerHTML = playerTwo.score;
    }         
  }

  //SET//
  var showEndGame= function() {
    if ( ( ((playerOne.games == 1) && (playerTwo.games == 0)) || ((playerOne.games == 0) && (playerTwo.games == 1)) ) || ( ((playerOne.games > 3) || (playerTwo.games > 3)) && ((playerOne.games - playerTwo.games >= 0) || (playerTwo.games - playerOne.games >= 0)) ) ){      
      var tbody = $("#setTable tbody");
      var row = $("<tr>").appendTo(tbody).get(0);
      var setCount = row.insertCell(0);
      var playerOneSet = row.insertCell(1);
      var playerTwoSet = row.insertCell(2);
      setCount.innerHTML = playerOne.set + playerTwo.set + 1;
      if (playerOne.set + playerTwo.set + 1 == 1) {
        playerOneSet.id = "playerOneSetter";
        playerTwoSet.id = "playerTwoSetter";
      } else if (playerOne.set + playerTwo.set + 1 == 2) {
        playerOneSet.id = "playerOneSetter2";
        playerTwoSet.id = "playerTwoSetter2";
      } else if (playerOne.set + playerTwo.set + 1 == 3) {
        playerOneSet.id = "playerOneSetter3";
        playerTwoSet.id = "playerTwoSetter3";
      }
      playerOneSet.innerHTML = playerOne.games;
      playerTwoSet.innerHTML = playerTwo.games;
    } else {
      if (playerOne.set + playerTwo.set + 1 == 1) {
        $('#playerOneSetter').text(playerOne.games);
        $('#playerTwoSetter').text(playerTwo.games);
      } else if (playerOne.set + playerTwo.set + 1 == 2) {
        $('#playerOneSetter2').text(playerOne.games);
        $('#playerTwoSetter2').text(playerTwo.games);
      } else if (playerOne.set + playerTwo.set + 1 == 3) {
        $('#playerOneSetter3').text(playerOne.games);
        $('#playerTwoSetter3').text(playerTwo.games);
      }
    }
    resetRallyTable();        
  }

  //CALLS//

  var letCall = function() {  
    $.mobile.changePage("#page1", { transition: "flip"} );
  }

  var faultCall = function() {
    if (currentPlayer == playerOne) {
      if (playerOne.fault == 0) {
        playerOne.fault = 1
        $.mobile.changePage("#page1", { transition: "flip"} );
      } else {
        awardPointToPlayerTwo();
        playerOne.fault = 0;
        $.mobile.changePage("#page1", { transition: "flip"} ); 
      }
    } else {
      if (playerTwo.fault == 0) {
        playerTwo.fault = 1;
        $.mobile.changePage("#page1", { transition: "flip"} );
      } else {
        awardPointToPlayerOne();
        playerTwo.fault = 0;
        $.mobile.changePage("#page1", { transition: "flip"} ); 
      }
    }
  }

  //POINTS//
  var handOut = function() {
    switchPlayer();
  }

  var awardPointToPlayerOne = function() {
    if (playerOne.score < 30) {
      playerOne.score = playerOne.score + 15;
    } else if (playerOne.score == 30){
      playerOne.score = playerOne.score + 10;
    } else if (playerOne.score >= 40){
      playerOne.score = playerOne.score + 5;
    }
    switchServeSide();
    rallyNumberIncrement();
    handleRally();
    handleAwardPointToPlayerOne();
    playerOne.fault = 0;
    playerTwo.fault = 0;
  }
  
  var handleAwardPointToPlayerOne = function() {
    if ((playerOne.score >= 45) && (playerOne.score - playerTwo.score > 5)) {
      playerOne.games = playerOne.games + 1;
      handleGame(); 
      resetScore();
      setPointPlayerOne();
    }
  }

  var awardPointToPlayerTwo = function() { 
    if (playerTwo.score < 30) {
      playerTwo.score = playerTwo.score + 15;
    } else if (playerTwo.score == 30){
      playerTwo.score = playerTwo.score + 10;
    } else if (playerTwo.score >= 40){
      playerTwo.score = playerTwo.score + 5;
    }
    switchServeSide();
    rallyNumberIncrement();
    handleRally();
    handleAwardPointToPlayerTwo();
    playerOne.fault = 0;
    playerTwo.fault = 0;
  }
  
  var handleAwardPointToPlayerTwo = function() { 
    if ((playerTwo.score >= 45) && (playerTwo.score - playerOne.score > 5)) {
      playerTwo.games = playerTwo.games + 1;
      handleGame(); 
      resetScore();
      setPointPlayerTwo();
    }
  }

  var setPointPlayerOne = function() {
    if ( (playerOne.games >= 3) && (playerOne.games - playerTwo.games >= 0) ) {      
      $.mobile.changePage("#page4");
      showEndGame();
      playerOne.set = playerOne.set + 1;
      playerOne.games = 0;
      playerTwo.games = 0;
    } else {
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if (playerOne.set >= 2) {
      checkMatchOver();
    } 
  }

  var setPointPlayerTwo = function() {
    if ( (playerTwo.games >= 3) && (playerTwo.games - playerOne.games >= 0) ) {    
      $.mobile.changePage("#page4");
      showEndGame();
      playerTwo.set = playerTwo.set + 1;
      playerOne.games = 0;
      playerTwo.games = 0;
    } else {
      $.mobile.changePage("#page4");
      showEndGame();
    }
    if (playerOne.set >= 2) {
      checkMatchOver();
    }
  }

  //SWITCH CURRENT PLAYER//
  var switchPlayer = function() {
    if (currentPlayer == playerOne) {
      currentPlayer = playerTwo
    } else {
      currentPlayer = playerOne
    }
  }

  //(GAME & MATCH RESET) & SHOW END GAME//
  var checkMatchOver = function() {
    $("#nextgame").hide();
    $("#nextmatch").show();
    $.mobile.changePage("#page4"); 
    $('body').on('click', '#nextmatch', _this.startMatch);
  }

  var resetRallyTable = function() {
    var tbody = $("#rallyTable tbody");
    tbody.find("tr").remove();
  }

  var resetGameTable = function() {
    var tbody = $("#gameTable tbody");
    tbody.find("tr").remove();
  }

  var resetSetTable = function() {
    var tbody = $("#setTable tbody");
    tbody.find("tr").remove();
  }

  var nextGame = function() {
    switchPlayer();
    game.serveside = 'L';
    displayButton();
    $.mobile.changePage("#page1", { transition: "flip"} );
  }

  var resetScore = function() {
    playerOne.score = 0;
    playerTwo.score = 0;
    rallyNumber = 0;
    game.serveside = 'L'
    resetRallyTable();
    displayButton();
  }

  function selectServer() {   
    var selectserver = document.getElementById('selectserver');
    selectserver.onchange = changeHandler;
    function changeHandler(){
      switch($('#selectserver').val()) {
      case "serverPlayerOne":
        currentPlayer = playerOne;
        break;
      case "serverPlayerTwo":
        currentPlayer = playerTwo;
        break;
    }
    $("#selectserver").click(function() {   
      $('#selectserver').val(0); 
    });

    var default_serveside = $('#selectserver');    
    default_serveside.val('serverdefault').attr('selected', true).siblings('option').removeAttr('selected');
    default_serveside.selectmenu("refresh", true);
    $("#hide_selectserver").hide();

    $.mobile.changePage("#page1", { transition: "flip"} );
    }
  }

  var resetGame = function() {
    resetScore();
    $.mobile.changePage("#page3", { transition: "flip"} );
    $("#hide_selectserver").show();
  }

  var matchReset = function() {
    resetRallyTable();
    rallyNumber = 0;
    resetMatch();
    _this.startMatch();
  }

  var resetMatch = function() {
    playerOne = {'name': '', 'games': 0, 'score': 0, 'fault': 0, 'set': 0};
    playerTwo = {'name': '', 'games': 0, 'score': 0, 'fault': 0, 'set': 0};
    game = {'serveside': 'L'};
    
    $("#nextmatch").hide();
    $("#nextgame").show();
    $("#headerdisguise").hide();
    $("#hide_selectserver").show();
    $("#gameTable2").hide();
    $("#gameTable3").hide();
  }
  
  this.startMatch = function() {
    $.mobile.changePage("#page5");
    resetMatch();
    resetGameTable();
    resetSetTable();
    $('#let').text("Let");
    $('#undo').text("Undo Last Rally");
    $('#nextgame').text("Start Next Game"); 
    $('#resetgame').text("Reset Game");
    $('#resetmatch').text("Reset Match");
  }

  this._bindEvents = function() {
    $('body').on('click', '#point_P1', awardPointToPlayerOne);
    $('body').on('click', '#point_P2', awardPointToPlayerTwo);
    $('body').on('click', '#let', letCall);
    $('body').on('click', '#fault', faultCall);
    $('body').on('click', '#selectserver', selectServer);
    $('body').on('click', '#undo', triggerUndo);
    $('body').on('click', '#startmatch', getPlayers);
    $('body').on('click', '#nextgame', nextGame);
    $('body').on('click', '#resetmatch', matchReset);
    $('body').on('click', '#resetgame', resetGame);
    $('body').on('click', '#match_score', setTally);   
  };
    
};

var myMatch = null;

$(document).ready(function(){
  myMatch = new match();
  myMatch._bindEvents();
  myMatch.startMatch();
});


