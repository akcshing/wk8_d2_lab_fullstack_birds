const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');

const Sightings = function (url) {
  this.url = url;
  this.request = new RequestHelper(this.url);
};

Sightings.prototype.bindEvents = function () {
  PubSub.subscribe('SightingView:sighting-delete-clicked', (evt) => {
    this.deleteSighting(evt.detail);
  });

  // subscribe to submit event from form view
  //  calls post function
  PubSub.subscribe("SightingFormView:submit-bird", (evt) =>{
    this.postBird(evt.detail)
  });

};

// create post request function
// new up a request object with helper url
// call the post request function
// then publish the returned data

Sightings.prototype.postBird = function(bird) {
  this.request.post(bird)
    .then((birds) => {
      PubSub.publish('Sightings:data-loaded', birds)
      console.log(birds);
    })
    .catch(console.error);
}

Sightings.prototype.getData = function () {
  this.request.get()
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

Sightings.prototype.deleteSighting = function (sightingId) {
  this.request.delete(sightingId)
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

module.exports = Sightings;
