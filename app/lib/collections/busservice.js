Busservice = new Mongo.Collection('busservice');

// Validation keys and messages
SimpleSchema.messages({
  source_destination_same: "[label] cannot be same as Starting point",
  destination_source_same: "[label] cannot be same as Destination point",
  endDateTime_lessthan_startDateTime: "[label] cannot be past to start date and time",
  startDateTime_lessthan_endDateTime: "[label] cannot be past to start date and time"
});

//Schema for busservice collection
BusServiceSchema = new SimpleSchema({
    name:{
      type: String,
      label: "Name",
      max: 200
    },
    agency:{
      type: String,
      label: "Agency",
      max: 1024
    },
    seats: {
      type: Number,
      label: "Total Seats",
      min: 10,
      max: 50
    },
    source: {
      type: String,
      label: "Starting Point",
      max: 200,
      custom: function() {
        if((this.value || "").toLowerCase() == (this.field("destination").value || "").toLowerCase()) {
          return "destination_source_same";
        }
      }
    },
    destination: {
      type: String,
      label: "Destination Point",
      max: 200,
      custom: function() {
        if((this.value || "").toLowerCase() == (this.field("source").value || "").toLowerCase()) {
          return "source_destination_same";
        }
      }
    },
    startDateTime: {
      type: Date,
      label: "Departure Time",
      min: moment().add(1,'days').toDate(),
      max: moment().endOf('year').toDate(),
      custom: function() {
        if(this.value >= this.field("endDateTime").value) {
          return "startDateTime_lessthan_endDateTime";
        }
      }
    },
    endDateTime: {
      type: Date,
      label: "Arrival Time",
      min: moment().add(1,'days').toDate(),
      max: moment().endOf('year').toDate(),
      custom: function() { //custom validation
        if(this.value <= this.field("startDateTime").value) {
          //error message identifier added in SimpleSchema.messages api.
          return "endDateTime_lessthan_startDateTime";
        }
      }
    },
    fare: {
      type: Number,
      label: "Fare",
      min: 100
    },
    createdAt: {
      type: Date,
      label: "Created At",
      autoValue: function() {
        if (this.isInsert) {
          return new Date;
        }
      }
    },
    updatedAt: {
      type: Date,
      label: "Updated At",
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      denyInsert: true,
      optional: true
    },
    available_seats: {
      type: Number,
      label: "Available Seats",
      autoValue: function(doc) {
        if (this.isInsert) {
          return doc.seats;
        }
      }
    },
    createdBy: {
      type: String,
      optional: true,
      autoValue: function() {
        return this.userId
      }
    }
  });

Busservice.attachSchema(BusServiceSchema);

if (Meteor.isServer) {
  Busservice.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  Busservice.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
