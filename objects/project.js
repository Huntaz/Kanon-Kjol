function Project(name, lengthDays, adminEmail) {
  this.id = "";   //Master keeps track on what projects exists
  this.name = name;
  this.adminEmail = adminEmail;
  this.lengthDays = lengthDays;
  this.startDate = new Date();
  this.stopDate = new Date();
  this.categories = "";
  this.nextResourceID = -1;
  this.nextTaskID = -1;
  this.type = "Project"; //obejct must "end" with type

  //below is DB associative tables - these objects save themselves in DB and when a prject is built from db theese are populated.
  this.classes    = [];   // Unfilled resources
  this.resources  = [];  // position sparas i realtions tabelen projekt-resource
  this.tasks      = [];   // Tasks for this project

  this.stopDate.setDate(this.stopDate.getDate()+lengthDays)



}


Project.prototype.init_test = function() {
  this.resources = [
    {name:"Fredrik", type:"Tjuren", id:1},
    {type:"Bäst", name:"Robert", id:2},
    {type:"Häst", name:"Erika", id:3},
    {type:"Test", name:"Fluffy", id:4}
  ];

  this.nextResourceID = 5;

}

Project.prototype.create_task = function(startDate, endDate, resID, name, days) {
  //console.log("Projekt_createTask:", this)
  var task = new Task(startDate, endDate, [resID], this.nextTaskID, name, days);
  this.tasks.push(task);

  this.nextTaskID--;
  return task;
}

Project.prototype.get_task_by_resource = function(resID){
  var touchingTasks = [];
  $.each(cal.project.tasks, function (index,valueTask) {
// console.log();
    $.each(valueTask.resources, function (index,valueResource) {
      if (valueResource == resID) {
        // console.log("träff:",valueTask);
        touchingTasks.push(valueTask);
      }
    })
  })
  // console.log(touchingTasks);
  return touchingTasks;
}

Project.prototype.get_task_by_id = function (taskID) {

  for (var task in this.tasks) {
    // console.log(this.tasks[task].id)
    if (this.tasks[task].id == taskID) {
      return this.tasks[task];
    }
  }
}

  Project.prototype.get_task_by_element = function (element) {
    //console.log("ELEMENT: ", element)
    var id = Number(element[0].id.replace("task_", ""));
      return this.get_task_by_id(id);
    }

Project.prototype.get_resource_by_id = function (resourceID) {
  for (var resource in this.resources) {
    if (this.resources[resource].id == resourceID) {
      return this.resources[resource];
    }
  }
};

Project.prototype.get_resource_by_element = function (element) {
  var id = Number(element[0].id);
    return this.get_resource_by_id(id);
};

Project.prototype.set_resource_row = function (element,value) {
  var resourceID = Number(element.id);
  for (var resource in this.resources) {
    if (this.resources[resource].id == resourceID) {
      //console.log("nytt varde: ", value);
      this.resources[resource].row = value;
    }
  }
};

Project.prototype.update_resource_id = function (target,value) {
  this.get_resource_by_id(target).id = value;
};

Project.prototype.render_all_resources = function () {
  this.resources.sort(function(a,b){
    return a.row - b.row;
  });
  //console.log(this.resources);
  $.each(this.resources, function( key, value ) {
    //  console.log(value);
    if(value.row.charAt(0) === "U") {
      $(cal._create_resource(value)).appendTo("#availableResources");
      var padding = $("#availableResources").css("padding-bottom");
      // console.log(padding);
      if (Number(padding.substring(0,padding.length-2)) < config.rowHeight) {
      $("#availableResources").css("padding-bottom","0px")
      }
      else {
      $("#availableResources").css("padding-bottom","-="+config.rowHeight)
      }
    }
    else if (value.row.charAt(0) === "A") {
      $(cal._create_resource(value)).appendTo("#sortable");
      cal._create_empty_task_row(value.id);
    }
  });
};

Project.prototype.remove_resource_by_id = function (objectID) {
  //this funkar inte?
$.each(this.resources, function(index,value) {
  // console.log(value);
  if (value.id === objectID) {
    // console.log("träff:",index);
    cal.project.resources.splice(index,1);
    return false;
  }
})

};

Project.prototype.remove_task_by_id = function (objectID) {
  //this funkar inte?
  $.each(this.tasks, function(index,value) {
    if (value.id === objectID) {
      cal.project.tasks.splice(index,1);
      return false;
    }
  })
};
