//news.org API Key
const API_KEY = "8964681ad1ef4182a69474e2ab385697";


/**
 * @desc build the news category overview
 * @param string country - country for the categories
 * @param array categories - contains categories which should be displayed
 * @param object uiModule - uiModule functions
 */
var buildCategoryUI = function (country, categories, uiModule) {
    $("#categoriesTab").empty(); // clear category overview area

    //create a category card for each element in categories.
    //If the number of categories is odd, two cards with 100% width will be created.
    for (let index = 0; index < categories.length; index++) {
        if (index == 0 || (index == 1 && categories.length % 2 == 0)) {
            //create 100% width category card
            var firstCard = `
              <div class="card-4" id="` + categories[index] + `">
              <div class="display-container text-white">
              <img id="categoryImage0" src="img/categories/` + categories[index] + `.jpg" alt="Lights" style="width:100%">
              <div id="categoryText0" class="xlarge display-bottomleft padding">` + categories[index] + `</div>
              </div>
              </div>`;

            $('#categoriesTab').append(firstCard); // add card template to category Area

            $("#" + categories[index]).click(function () { // add event listener to category card
                changeToCategory(country, $(this).attr('id'), uiModule);
            });
        } else {
            //create two 50% width category cards
            var card = `
              <div class="cell-row">
              <div class=" cell">
              <div class="card-4 " id="` + categories[index] + `">
              <div class="display-container text-white">
              <img src="img/categories/` + categories[index] + `.jpg" alt="Lights" style="width:100%">
              <div class="large display-bottomleft padding">` + categories[index] + `</div>
              </div>
              </div>
              </div>
              <div class=" cell">
              <div class="card-4 " id="` + categories[index + 1] + `">
              <div class="display-container text-white">
              <img src="img/categories/` + categories[index + 1] + `.jpg" alt="Lights" style="width:100%">
              <div class="large display-bottomleft padding">` + categories[index + 1] + `</div>
              </div>
              </div>
              </div>
              </div>`

            $('#categoriesTab').append(card); // add card template to category Area

            $("#" + categories[index]).click(function () { // add event listener to first category card
                changeToCategory(country, $(this).attr('id'), uiModule);
            });

            $("#" + categories[index + 1]).click(function () { // add event listener to second category card
                changeToCategory(country, $(this).attr('id'), uiModule);
            });
            index++;
        }
    }
}


/**
 * @desc change view from category overview to specific category
 * @param string country - country which should used for api request
 * @param string category - category which should be displayed
 * @param object uiModule - uiModule functions
 */
function changeToCategory(country, category, uiModule) {
    uiModule.hideSettingsButton(); // hide settings button and make back button visible
    $("#categoriesTab").empty(); // remove category cards from category area
    loadCategoryHeadlines(country, category); // fetch the headlines of the specified category and country
}


/**
 * @desc build Timelinen and add news headline cards
 * @param string data - news data from API
 * @param string category - category which should be displayed
 */
var buildtimeline = function (data, category) {
    $("#timeline").empty(); // remove all news headline cards

    //define month format 
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    //create news headline cards
    $.each(data.articles, function (index, element) {

        //get date from news data
        let publischDate = new Date(element.publishedAt);

        //create formated date
        let formatted_date = publischDate.getDate() + "-" + months[publischDate.getMonth()] + "-" + publischDate.getFullYear();

        //create card
        var itemDiv = $("<div />", {
            "class": "card-4 margin animate-bottom",
            onClick: "cordova.InAppBrowser.open('" + element.url + "', '_blank', 'location=yes zoom=no');"
        });

        //create div for imageTag
        var imageDiv = $("<div />", {
            "style": "width:100%",
            "class": ""
        });

        //create imageTag
        var imageTag = $("<img />", {
            "style": "width:100%",
            src: element.urlToImage
        });


        imageDiv.append(imageTag); // add imgTag to imageDiv

        itemDiv.append(imageDiv); // add imageDiv to card


        //create contentDiv for publisher,header and publishDate
        var contentDiv = $("<div />", {
            "class": "container"
        });

        //create news Headline
        var newsHeader = $("<a />", {
            "class": "cardTitle",
            text: element.title
        });

        //create publisher
        var sourceDiv = $("<div />", {
            "class": "",
            text: element.source.name
        });

        //create publish date
        var publishDateDiv = $("<div />", {
            "class": "",
            text: formatted_date
        });

        contentDiv.append(sourceDiv); // add publisher to contentDiv
        contentDiv.append(newsHeader); // add headline to contentDiv
        contentDiv.append(publishDateDiv); // add publishDate to contentDiv
        itemDiv.append(contentDiv); //add contentDiv to card

        //show headline for selected headline
        if (category === null) { // show default text if category is not specified
            $('#topHeadlines').text("Top Headlines");
        } else { //show specified category
            $('#topHeadlines').text("Top " + category + " Headlines");
        }
        $('#timeline').append(itemDiv); // add card to Timeline

    });
}

/**
 * @desc fetch headlines for specified country from news.org api
 * @param string country - country for which news headlines should be displayed
 */
var loadHeadLines = function (country) {

    $.ajax({
        type: 'GET',
        url: 'http://newsapi.org/v2/top-headlines?country=' + country + '&apiKey=' + API_KEY,
        data: {
            get_param: 'value'
        },
        dataType: 'json',
        crossDomain: true,
        success: function (data) {
            buildtimeline(data, null); // build Timeline
        }
    });
}

/**
 * @desc fetch headlines for specified searchtext
 * @param string searchText - searchtext for which news headlines should be displayed
 * @param string country - country for which news headlines should be displayed
 */
var searchRequest = function (searchText,country) {

    // check if searchtext is empty
    if (searchText !== "" || searchText) { //  if searchtext is not empty load headlines which contains the given searchtext
        $.ajax({
            type: 'GET',
            url: 'http://newsapi.org/v2/everything?q=' + searchText + '&language=de&apiKey=' + API_KEY,
            data: {
                get_param: 'value'
            },
            dataType: 'json',
            crossDomain: true,
            success: function (data) {

                buildtimeline(data); //b uild Timeline
            }
        });
    } else { // if searchtext is empty load headlines
        loadHeadLines(country);
    }
}

/**
 * @desc fetch headlines for specified category
 * @param string country - country for which news headlines should be displayed
 * @param string category - category for which news headlines should be displayed
 */
var loadCategoryHeadlines = function (country, category) {
    $.ajax({
        type: 'GET',
        url: 'http://newsapi.org/v2/top-headlines?country=' + country + '&category=' + category + '&apiKey=' + API_KEY,
        data: {
            get_param: 'value'
        },
        dataType: 'json',
        crossDomain: true,
        success: function (data) {

            buildtimeline(data, category); // build Timeline
        }
    });
}

/**
 *all module exported functions
 */
module.exports = {
    buildCategoryUI,
    loadCategoryHeadlines,
    loadHeadLines,
    searchRequest
}