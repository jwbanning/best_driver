$(document).ready(function() {

  function Task(data) {
    this.location = ko.observable(data);
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    
    // Operations
    $.getJSON("/assets/best-driver.json", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Task(item) });
        self.tasks(mappedTasks);
        console.log(self.tasks()[0].location());
    });   

   
}

ko.applyBindings(new TaskListViewModel());

});



