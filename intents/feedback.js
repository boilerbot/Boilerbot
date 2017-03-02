function random(array) {
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = {
	getFeedback : function(sender_name) {

    const answers ='Thank you for your feedback! Team BoilerBot will look into your suggestion.'
		return answers;

	},
};