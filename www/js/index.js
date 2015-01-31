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
    loadPlayers();
  }

  var loadPlayers = function() {
    $('#serverPlayerOne').text(playerOne.name);
    $('#serverPlayerTwo').text(playerTwo.name);
    $('#point_P1').text(playerOne.name+ ": " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score);
    $('#playerOneStroke').text(playerOne.name);
    $('#playerTwoStroke').text(playerTwo.name);
    $('#playerOneConduct').text(playerOne.name);
    $('#playerTwoConduct').text(playerTwo.name);
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

  var serveLeft = function() { 
    $("#headerdisguise").hide();
    $.mobile.changePage("#page1", { transition: "flip"} );
    game.serveside = 'L';
    handleRally();
    rallyNumberIncrement();
    switchServeSide();
  }

  var serveRight = function() { 
    $("#headerdisguise").hide();
    $.mobile.changePage("#page1", { transition: "flip"} );
    game.serveside = 'R';
    handleRally();
    rallyNumberIncrement();
    switchServeSide(); 
  }

  //UNDO//
  var serializeGame = function() {
    var gameState = {
      playerOneScore: playerOne.score,
      playerTwoScore: playerTwo.score,
      servingSide: game.serveside,
      rally: rallyNumber,
      playerCurrent: currentPlayer,
      letCheck: currentPlayer.letcalled,
    };
    return gameState;
  }

  var triggerUndo = function() {
    if (rallyNumber > 3) {
      undo();
    } else {
      resetScore();
      $.mobile.changePage("#page3", { transition: "flip"} ); 
      rallyNumber = 1;
    }
  }

   var undo = function() {
    lastGameState = gameHistory.pop();
    var lastrally = gameHistory[gameHistory.length-1];
    var keys = Object.keys(lastrally);
    var values = keys.map(function(v) { return lastrally[v]; });  
    var lastplayer = values[4];    
    var lastserveside = values[2];

    if (lastGameState.letCheck == 1){
      lastrally = gameHistory[gameHistory.length-2];
      keys = Object.keys(lastrally);
      values = keys.map(function(v) { return lastrally[v]; });  
      lastplayerlet = values[4];
      if (lastplayerlet != lastplayer) {
        $('#rallyTable tr:eq(1)').remove();
        rallyNumber = rallyNumber - 1;
        game.servingside = lastserveside;
        $.mobile.changePage("#page1", { transition: "flip"} );
      } else {  
        $('#rallyTable tr:eq(1)').remove();
        rallyNumber = rallyNumber - 1;
        $.mobile.changePage("#page1", { transition: "flip"} );
      }
    } else if (lastplayer == lastGameState.playerCurrent) {
      $('#rallyTable tr:eq(1)').remove();
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
      $('#point_P1').text(playerOne.name+ ": " +playerOne.score).off('click')
      $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score).off('click');
      switchServeSide();
      $.mobile.changePage("#page1", { transition: "flip"} );
    } else {
      $('#rallyTable tr:eq(1)').remove();
      if (playerOne == lastplayer) {
        currentPlayer = playerOne;
      } else {
        currentPlayer = playerTwo;
      }               
      playerOne.score = lastGameState.playerOneScore;
      playerTwo.score = lastGameState.playerTwoScore;
      if (game.serveside != lastserveside) {
        game.servingside = lastserveside;
      } else {
        game.servingside = lastserveside;
        switchServeSide();
      }
      rallyNumber = lastGameState.rally; 
      $('#serveside').text("Select serve side for " +currentPlayer.name); 
      $('#point_P1').text(playerOne.name+ ": " +playerOne.score).off('click')
      $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score).off('click');
      $.mobile.changePage("#page1", { transition: "flip"} );
    }
  }
 
  //RALLY//
  var handleRally = function() {
    handleRallyTable();
  }

  var handleRallyTable = function() {
    $('#point_P1').text(playerOne.name+ ": " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score); 
    
    var tbody = $("#rallyTable tbody");
    var row = $("<tr>").prependTo(tbody).get(0);
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

  var rallyNumberIncrement = function() {
    rallyNumber = rallyNumber + 1;
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

  //CALLS//
  var letCall = function() {
    currentPlayer.letcalled = currentPlayer.letcalled + 1;
    $.mobile.changePage("#page1", { transition: "flip"} );
    gameHistory.push(serializeGame());
    switchServeSide();
    handleRally();
    rallyNumberIncrement();  
    switchServeSide(); 
    currentPlayer.letcalled = currentPlayer.letcalled - 1;
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
      $("#conduct_warning").click(function() {   
        $('#conduct_warning').val(0); 
      });
      var default_conduct = $('#conduct_warning');    
      default_conduct.val('conductdefault').attr('selected', true).siblings('option').removeAttr('selected');
      default_conduct.selectmenu("refresh", true);
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
      $.mobile.changePage("#page1", { transition: "flip"} );
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
      $.mobile.changePage("#page1", { transition: "flip"} );
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
    $('#stroke').val(0);
    
    var stroke = document.getElementById('stroke');
    stroke.onchange = changeHandler;
    function changeHandler(){
      switch($('#stroke').val()) {
      case "playerOneStroke": 
        if (playerOne.name == currentPlayer.name) {
          awardPoint();
          switchServeSide(); 
          rallyNumberIncrement();
          $.mobile.changePage("#page1", { transition: "flip"} );
        } else {
          $("#headerdisguise").show();
          $.mobile.changePage("#page3", { transition: "flip"} );
          handOut(); 
          rallyNumberIncrement();
        }
        break;
      case "playerTwoStroke": 
        if (playerTwo.name == currentPlayer.name) {
          awardPoint();
          switchServeSide(); 
          rallyNumberIncrement();
          $.mobile.changePage("#page1", { transition: "flip"} );
        } else {
          $("#headerdisguise").show();
          $.mobile.changePage("#page3", { transition: "flip"} ); 
          handOut();
          rallyNumberIncrement(); 
        }
        break;
      }  
      var default_stroke = $('#stroke');    
      default_stroke.val('strokedefault').attr('selected', true).siblings('option').removeAttr('selected');
      default_stroke.selectmenu("refresh", true);
    }
  }

  //POINTS//
  var checkServerPlayerOne = function() {
    if (currentPlayer == playerOne) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      $("#headerdisguise").show();
      $("#serve_left").show();
      $("#serve_right").show();
      $.mobile.changePage("#page3", { transition: "flip"} );
      handOut();
    }
  }

  var checkServerPlayerTwo = function() {
    if (currentPlayer == playerTwo) {
      awardPoint();
      switchServeSide();
      rallyNumberIncrement();
    } else {
      $("#headerdisguise").show();
      $("#serve_left").show();
      $("#serve_right").show(); 
      $.mobile.changePage("#page3", { transition: "flip"} );
      handOut();
    }
  }

  var handOut = function() {
    switchPlayer();
    awardPointHandout();
    $('#serveside').text("Select serve side for " +currentPlayer.name);
  }

  var awardPointHandout = function() {
    gameHistory.push(serializeGame()); 
    if (currentPlayer == playerOne) {
      awardPointToPlayerOneHandout();
    } else {
      awardPointToPlayerTwoHandout();
    }
  }

  var awardPointToPlayerOneHandout= function() {
    playerOne.score = playerOne.score + 1;
    handleAwardPointToPlayerOne();
  }

  var awardPointToPlayerTwoHandout = function() { 
    playerTwo.score = playerTwo.score + 1;
    handleAwardPointToPlayerTwo();
  }

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
    handleAwardPointToPlayerOne();
  }
  
  var handleAwardPointToPlayerOne = function() {
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
    handleAwardPointToPlayerTwo();
  }
  
  var handleAwardPointToPlayerTwo = function() { 
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

  var showEndGame = function() {
    $('#games').text(playerOne.name+': '+playerOne.games+ ' vs ' +playerTwo.name+': '+playerTwo.games) 
    resetRallyTable();
    if ((playerOne.conductwarning > 0) && (playerTwo.conductwarning > 0)) {
      $('#conductheading').text('CONDUCT ');
      $('#show_conduct_warning').text(playerOne.name+': '+playerOne.conductwarning+ ' & ' +playerTwo.name+': '+playerTwo.conductwarning);
    } else if (playerOne.conductwarning > 0) {
      $('#conductheading').text('CONDUCT ');
      $('#show_conduct_warning').text(playerOne.name+': '+playerOne.conductwarning);
    } else if (playerTwo.conductwarning > 0) {
      $('#conductheading').text('CONDUCT ');
      $('#show_conduct_warning').text(playerTwo.name+': '+playerTwo.conductwarning);
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
    $.mobile.changePage("#page3", { transition: "flip"} );
  }

  var resetScore = function() {
    playerOne.score = 0;
    playerTwo.score = 0;
    rallyNumber = 0;
    resetRallyTable();
    $('#point_P1').text(playerOne.name+ ": " +playerOne.score);
    $('#point_P2').text(playerTwo.name+ ": " +playerTwo.score);
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
    $('#serveside').text("Select serve side for " +currentPlayer.name);
    }
  }

  var resetGame = function() {
    resetScore();
    rallyNumberIncrement();
    $.mobile.changePage("#page3", { transition: "flip"} );
    $("#hide_selectserver").show();
    $('#serveside').text("");
  }

  var matchReset = function() {
    resetRallyTable();
    rallyNumber = 1;
    resetMatch();
    _this.startMatch();
  }

  var resetMatch = function() {
    playerOne = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0, 'letcalled': 0};
    playerTwo = {'name': '', 'games': 0, 'score': 0, 'conductwarning': 0, 'letcalled': 0};
    game = {'serveside': ''};
    
    $("#nextmatch").hide();
    $("#nextgame").show();
    $("#headerdisguise").hide();
    $("#serve_left").show();
    $("#serve_right").show();
    $("#hide_selectserver").show();
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
    $('#resetgame').text("Reset Game");
    $('#resetmatch').text("Reset Match");
    $('#gamesheading').text('GAMES');
    $('#conductheading').text('');
    $('#show_conduct_warning').text(''); 
    $('#serveside').text(""); 
  }

  this._bindEvents = function() {
    $('body').on('click', '#point_P1', checkServerPlayerOne);
    $('body').on('click', '#point_P2', checkServerPlayerTwo);
    $('body').on('click', '#let', letCall);
    $('#stroke').off('click').on('click', strokeResult);
    $('body').on('click', '#conduct_warning', conductCall);
    $('body').on('click', '#selectserver', selectServer);
    $('body').on('click', '#undo', triggerUndo);
    $('body').on('click', '#serve_left', serveLeft);
    $('body').on('click', '#serve_right', serveRight);
    $('body').on('click', '#startmatch', getPlayers);
    $('body').on('click', '#nextgame', nextGame);
    $('body').on('click', '#resetmatch', matchReset);
    $('body').on('click', '#resetgame', resetGame);   
  };
    
};

var myMatch = null;

$(document).ready(function(){
  myMatch = new match();
  myMatch._bindEvents();
  myMatch.startMatch();
});


