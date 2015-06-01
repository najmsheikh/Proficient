var firebase = require('firebase');
var fb = new firebase('https://proficient.firebaseio.com/Mathematics');

fb.on('value', function(datasnap) {
    datasnap.forEach(function(snapshot) {
    	var name = snapshot.child('name').val();
        console.log(name);
    })
})
