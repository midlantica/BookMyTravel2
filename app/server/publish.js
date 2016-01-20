


Meteor.publish('createTravel', function () {
  return CreateTravel.find();
});