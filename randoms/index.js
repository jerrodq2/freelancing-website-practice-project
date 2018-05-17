'use strict';


const random = new (require('chance'));

// Loads all of the mixins we created and adds them to random/chance, this has to happen first
random.mixin(require('./mixins'));

// This is where i'll add the mixins to create multiple records, ex: 10 clients, 20 skills, etc.
// random.mixing({
//
// });


module.exports = random;
