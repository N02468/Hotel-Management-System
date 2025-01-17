const mongoose =  require('mongoose');

var mongoURL ='mongodb+srv://luxurystayhospitality:123@test.f7cu1zb.mongodb.net/?retryWrites=true&w=majority&appName=test'

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });


var connection = mongoose.connection

connection.on('error', (err) => {
    console.log('Mongo DB Connection Failed:', err.message);
});

connection.on('connected', () => {
    console.log('Mongo DB Connection Successfull!');
});


module.exports = mongoose