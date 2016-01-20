/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  createBusService: function(busService) {
      busService.createdAt = new Date();
    busService.available_seats = parseInt(busService.seats, 10);
    check(busService, BusServiceSchema); //validates the form data against the schema in the server side
    Busservice.insert(busService);
  }
});
