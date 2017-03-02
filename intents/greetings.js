function random(array) {
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = {
	getGreetings : function(sender_name) {
		const answers = [
			'Hello ' + sender_name +'!', 
			'Hi ' + sender_name +'!',
			'Hello ' + sender_name +', hope the day is going well for you!',
		]
		return random(answers);
	},
};