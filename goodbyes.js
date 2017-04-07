function random(array) {
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = {
	getGoodbyes : function(sender_name) {
		const answers = [
			'Bye ' + sender_name + '!',
			'Bye ' + sender_name + ', Hope you have a nice day!',
			'Let me know when you need help ' + sender_name + '!'
		]
		return random(answers);
	},
};