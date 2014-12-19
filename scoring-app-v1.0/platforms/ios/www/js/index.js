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
// $(".div.ui-content").live( 'pageinit', function(event){

// }):
//     $("div.ui-content").swiperight(function(event){
//     $.mobile.changePage("#page2");
//     // $(this).hide();
// });

//       $("div.ui-content").swipeleft(function(event){
//     $.mobile.changePage("#page1");
//     // $(this).hide();
// });

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
