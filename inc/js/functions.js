	var sql = '';
	var meal = '';
	var sweet_savory = "";
	var hot_cold = "";
	var spicy_mild = "";
	var eat_drink = "";

	var specificFood = '';
	var place = 'San+Francisco';
	var the_possibilities = '';

	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1LGbQp8WRndSL5j1uuIF6PXvxpb7wv1PuPgFGqexjvi4/pubhtml';
	var nameArray = [];
	var mealArray = [];
	var hot_coldArray = [];
	var eat_drinkArray = [];
	var sweet_savoryArray = [];
	var imageArray = [];
	
	function init() {

        Tabletop.init( { key: public_spreadsheet_url,

                         callback: getInfo,

                         simpleSheet: true } );

	};
	
    function getInfo(data) {
        // data comes through as a simple array since simpleSheet is turned on
       console.log(data);
	   
	   for(var i = 0; i < data.length; i++){
		   nameArray[i] = data[i].name;
		   mealArray[i] = data[i].meal;		   
		   hot_coldArray[i] = data[i].hot_cold;
		   sweet_savoryArray[i] = data[i].sweet_savory;
		   eat_drinkArray[i] = data[i].eat_drink;	
		   imageArray[i] = data[i].image;
	   }
	   
    };
	
$(window).load(function() { 
    init();
	console.log("load");
	//google.load("gdata", "2");
});

	function startOver() {	
		specificFood = '';
		place = 'San+Francisco';
		the_possibilities = '';
		meal = '';
		hot_cold = '';
		sweet_savory = '';
		eat_drink = '';
		spicy_mild = '';
		$("#possibilities").empty();
		$("#result").empty();
		console.log("In start over  ");
		window.location.href = "#page1";
				
	};


function chooseFood(ele){
       // console.log('img element id = ' + ele.id);
	   // console.log('image alt is = ' + ele.alt);
		
	/*	
		if(sql == '') {
			sql += "WHERE "+ele.alt+" = " + ele.id;
		     
		}
		else {
			sql += " AND "+ele.alt+" = " + ele.id;
			
		}
		
		*/
		if(ele.alt == 'meal') { meal = ele.id;}
		if(ele.alt== 'hot_cold') { hot_cold = ele.id;}
		if(ele.alt == 'sweet_savory') { sweet_savory = ele.id;}
		if(ele.alt == 'eat_drink') { eat_drink = ele.id;}
		if(ele.alt  == "sweet_savory") {			
			//console.log("finished and will call getPossibilities  "+sql);		
			getPossibilities();			
		}
	
};

function getPossibilities() {
	console.log("here are the choices   "+meal+"  hot_cold is "+hot_cold+"  eat_drink is  "+eat_drink+" sweet savory is  "+sweet_savory);
	//set default for food
	//specificFood = 'pizza';
    the_possibilities = "<h2>Here are some ideas, click on an image to get Yelp results</h2>";	
    for(var i = 0; i < nameArray.length; i++){
		if(mealArray[i] == meal && hot_coldArray[i] == hot_cold && sweet_savoryArray[i] == sweet_savory  && eat_drinkArray[i] == eat_drink) {			
			food = nameArray[i];
			pic = imageArray[i];
			console.log("the food found in getPossibilities is  "+food);
        	if(i%2 == 0) {
				 the_possibilities += '<div id="food1"><h3>'+food+'</h3> <br><a href="page#7"   ><img src="inc/images/'+pic+'"  onclick="getInfo2(this)"  alt="'+food+'" width="200" ></a></div>';
			}
			else {
				the_possibilities += '<div id="food2"><h3>'+food+'</h3> <br><a href="page#7"   ><img src="inc/images/'+pic+'"  onclick="getInfo2(this)"  alt="'+food+'" width="200" ></a></div>';
		
			}
		}

	}
		
	$("#possibilities").append(the_possibilities);

};




function getInfo2(ele) {
	console.log('in getInfo2  image alt is = ' + ele.alt);
	specificFood = ele.alt;
	getYelp();	
};



function changePicture(){
			//alert($('#options').val());
			$("#picHolder").attr('src', $('#options').val() + '.png');
}
		
		
function getYelp() {
            window.location.href = "#page7";
		    var auth = {
                //
                // Update with your auth tokens.
                //
                consumerKey : "D-rV2sKPKd0gtplYtVsy7A",
                consumerSecret : "XcMCVBK_a3oZlVztiEiwc-jY4ac",
                accessToken : "99OZcXkBx8FFi7sGMfOScFkMD-92lObK",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
                accessTokenSecret : "-5dDLWyf34gF1aU95YPuQCOG1oc",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };
            
			console.log("in yelp the food is  "+specificFood);
			
            var terms = 'food+'+specificFood.toLowerCase();
            var near = place;  //encodeURI(place);
			var num_listings = 6;

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
			parameters.push(['limit', num_listings]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            console.log(parameterMap);

            $.ajax({
                'url' : message.action,
				'cache': true,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {
                    console.log(data);
					console.log(data.businesses[0].name);
					var output = "<h2>"+ specificFood+"! </h2>";
					output += "<h3>For "+specificFood+" in "+ place +" try these locations</h3> <br><br>";
					for(var i=0; i < data.businesses.length-1; i += 2) {
						
						output += "<div id = 'resultCol1'><a href = '"+ data.businesses[i].url+"'><img src='"+ data.businesses[i].image_url+"'></a></div>";

						output += "<div id = 'resultCol2'><a href = '"+ data.businesses[i+1].url+"'><img src='"+ data.businesses[i+1].image_url+"'></a></div><br>";
						output += "<div id = 'resultCol1'>"+data.businesses[i].name+"</div>";
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						output += "<div id = 'resultCol2'>"+data.businesses[i+1].name+"</div><br>";
						output += "<div id = 'resultCol1'>"+ data.businesses[i].location.address+"</div>";
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						output += "<div id = 'resultCol2'>"+ data.businesses[i+1].location.address+"</div><br>";
						output += "<div id = 'resultCol1'>"+ data.businesses[i].location.city+"</div>";
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						output += "<div id = 'resultCol2'>"+ data.businesses[i+1].location.city+"</div><br>";
						output += "<div id = 'resultCol1'>"+ data.businesses[i].display_phone+"</div>";
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						//output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						output += "<div id = 'resultCol2'>"+ data.businesses[i+1].display_phone+"</div><br>";
						output += "";
					}
                    $("#result").append(output);
                }
            });
 };
 
 