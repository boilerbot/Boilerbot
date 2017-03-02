/*Required modules for dining courts*/
const request = require('request-promise');
const config = require('../config');
const urls = require('../urls');
const fb = require('./facebook-service');

module.exports = {
	//define all dining courts functionality here

	diningcourts_location : function(sender) {

		return new Promise(function(resolve, reject) {

			var url_location = urls.courts_base + 'locations/';

			request({
				method: 'GET',
				url : url_location,
				headers: {
					//'Authorization' : config.yelp_token,
				}
			}).then(function(response) {
				var data = JSON.parse(response);
				var elements = module.exports.createLocationCards(data);
				resolve(elements);
			}).catch(function(error) {
				console.log("Got to error");
				var data = JSON.parse(error);
				reject(data);
			});
		});

	},

	createLocationCards : function(data) {

		var elements = [];
		var url_get_image = urls.courts_base + 'file/';

		var businessArray = data.Location.slice(0,5);
		businessArray.forEach(function(business) {
			var temp_element = {
				title : business.Name,
				subtitle : business.Address.Street,
				image_url : url_get_image + business.Images,
				buttons: [
				{
					type: "web_url",
					url : business.StreetViewUrl + '/',
					title: "Get Directions"
				},
				{
					type : "web_url",
					url : urls.view_menus + business.Name + '/',
					title : "See more",
				}, 
				{
					type : "phone_number",
					title : "Call",
					payload : business.PhoneNumber,
				}
				]
			};

			elements.push(temp_element);
		});

		return elements;

	},
}