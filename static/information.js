$(function (){

  var informationViewModel = function() {
    var self = this;

    self.information = ko.observableArray([ ]);

    self.information(imagesData);

      
  }

  var informationVM = new informationViewModel();

  ko.applyBindings(informationVM);

});