/*Required modules for crime statistics*/
const request = require('request-promise');
const config = require('../config');
const urls = require('../urls');
const fb = require('./facebook-service');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');

var finaldata = [];
module.exports = {
	//define all dining courts functionality here

	getMonthlyStats: function(sender){
		finaldata = [];
		return new Promise(function(resolve, reject) {
			url = "https://www.purdue.edu/ehps/police/assistance/stats/statsmonth.html";
		    request(url, function(error, response, html) {
		        
		            if(!error) {
		                var $ = cheerio.load(html);
		                
		                $('article').filter(function(){
		                    
		                    var data = $(this);
		                    var in_res = data.text();
		                    var final_result = in_res.split("\n");
		                    //console.log(final_result);
		                    for(var i = 0; i < final_result.length - 5; i++) {
		                        //console.log("TEST" + i + ": " + final_result[i] + "\n\n");
		                        if(final_result[i] != "") {
		                            finaldata.push(final_result[i]);
		                        }
		                    }
		                    finaldata = finaldata.slice(5);
		                    })
		            }
		    }).then(function(response) {
					//var data = JSON.parse(response);
					var elements =  module.exports.createMonthlyCards(finaldata);				
					resolve(elements);
			}).catch(function(error) {
					console.log("Got to error");
					reject(error);
			});
		});
	},

	getYearlyStats: function(sender){
		finaldata = [];
		return new Promise(function(resolve, reject) {
			url = "https://www.purdue.edu/ehps/police/assistance/stats/statsmonth.html";
		    request(url, function(error, response, html) {
		        
		            if(!error) {
		                var $ = cheerio.load(html);
		                
		                $('article').filter(function(){
		                    
		                    var data = $(this);
		                    var in_res = data.text();
		                    var final_result = in_res.split("\n");
		                    //console.log(final_result);
		                    for(var i = 0; i < final_result.length - 5; i++) {
		                        //console.log("TEST" + i + ": " + final_result[i] + "\n\n");
		                        if(final_result[i] != "") {
		                            finaldata.push(final_result[i]);
		                        }
		                    }
		                    finaldata = finaldata.slice(5);
		                    })
		            }
		    }).then(function(response) {
					//var data = JSON.parse(response);
					var elements =  module.exports.createYearlyCards(finaldata);				
					resolve(elements);
			}).catch(function(error) {
					console.log("Got to error");
					reject(error);
			});
		});
	},

	getWarrants: function(sender){
		finaldata = [];
		return new Promise(function(resolve, reject) {
    		url = "https://www.purdue.edu/ehps/police/assistance/stats/warrants.html";
		    request(url, function(error, response, html) {
		        
		            if(!error) {
		                var $ = cheerio.load(html);

		                $('article').filter(function(){
		                    
		                    var data = $(this);
		                    var in_res = data.text();
		                    var final_result = in_res.split("\n");
		                    //console.log(final_result);
		                    finaldata = final_result.slice(6, final_result.length - 4);
		                    //res.send(finaldata); 
		                    })
		            }
		    }).then(function(response) {
					//var data = JSON.parse(response);
					var elements =  module.exports.createWarrantsCards(finaldata);
					resolve(elements);
			}).catch(function(error) {
					console.log("Got to error");
					reject(error);
			});
		});
	},

	getDailyStats: function(sender){
		finaldata = [];
		return new Promise(function(resolve, reject) {
				url = "https://www.purdue.edu/ehps/police/assistance/stats/statsdaily.html";		    
				request(url, function(error, response, html) {
		        
		            if(!error) {
		                var $ = cheerio.load(html);
		                $('article').filter(function(){
                    
	                    var data = $(this);
	                    var in_res = data.text();
	                    var final_result = in_res.split("\n");
		                    for(var i = 0; i < final_result.length; i++) {
		                        if(final_result[i].length > 80 && final_result[i].length < 300) {
		                           
		                            /*
		                            $0 = date
		                            $1 = time
		                            $2 = description
		                            $3 = location
		                            $4 = status
		                            */

		                            var re = /.*REPORTED ([0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}), ([0-9]{2}:[0-9]{2})(\w+) (AT|FROM) (.+) ON.*/;
		                            var match = re.exec(final_result[i]);
		                            if(match != null) {
		                               finaldata.push(
		                                    {
		                                        date: match[1],
		                                        time: match[2],
		                                        description: match[3],
		                                        location: match[5]
		                                    }
		                                );
		                            }
		                        }
                    		}
		                }); // article
		            }
		    }).then(function(response) {
					//var data = JSON.parse(response);
					var elements =  module.exports.createDailyCards(finaldata);
					resolve(elements);
			}).catch(function(error) {
					console.log("Got to error");
					reject(error);
			});
		});
	},

	createMonthlyCards: function(data) {
			console.log("\n\n\n\nELEMENTS ARE:" + data);
			var elements = [];
			var i = 0;
			while(i < 15) {
				var temp_element = {
					title: data[i++],
					subtitle: data[i++],
					buttons: [
					{
						type: "web_url",
						url: 'https://www.purdue.edu/ehps/police/assistance/stats/statsmonth.html',
						title: "See more",
					}]
				};
				elements.push(temp_element);
				i++;
			}
			return elements;
	},

	createYearlyCards: function(data) {
			var elements = [];
			var i = 57;
			while(i < 69) {
				var temp_element = {
					title: data[i++],
					subtitle: data[++i],
					buttons: [
					{
						type: "web_url",
						url: 'https://www.purdue.edu/ehps/police/reports/YourCampus.pdf',
						title: "See more",
					}]
				};
				elements.push(temp_element);
				i++;
			}
			return elements;
	},

	createWarrantsCards: function(data) {
			var elements = [];
			var i = 0;
			while(i < 9) {
				var temp_element = { 
						title: data[i],
						subtitle: "Active Warrants",
						buttons: [
						{
							title: "View More",
							type: "web_url",
							url: "https://www.purdue.edu/ehps/police/assistance/stats/warrants.html",
						}]
				}
				elements.push(temp_element);
				i++;
			}
			return elements;
	},

	createDailyCards: function(data) {
			var elements = [];
			var i = 0;
			while(i < 9) {
				var temp_element = {
					title: data[i]['description'] + ", " + data[i]['time'],
					subtitle: data[i]['date'] + " | " + data[i]['location'],
					// buttons: [
					// {
					// 	type: "web_url",
					// 	url: 'https://www.purdue.edu/ehps/police/reports/YourCampus.pdf',
					// 	title: "See more",
					// }]
				};
				elements.push(temp_element);
				i++;
			}
			return elements;
	},
}