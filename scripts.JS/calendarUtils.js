var TaskViewRow = function() {};

Calendar.prototype.init = function(whereToStart) {

  this.project = new Project("default", 300,"test1");
  config.taskWidth = this.project.lengthDays * config.dateHeaderWidth;

  //this.project.init_test();
  this._init_html_area(whereToStart);

  // this._create_date_headers();
  this._create_resource_headers();
  //this._load_resources();



  //this._create_empty_task_rows();
  /*
  var childs = this.divTaskViewRows.childNodes;
  for (var i = 0; i < childs.length; i++){
    childs[i].innerHTML = this._create_empty_task_rows_cells(50);
  }
  */
};

// TODO: Setting the scroll_sizes of the hor and ver scroll
Calendar.prototype._set_scroll_size = function() {
  /*
  */
};

// TODO: Calculate the scroll_sizes for the task and resources
Calendar.prototype._get_scroll_sizes = function() {};

Calendar.prototype._get_column_width = function() {
  var rvWidth = 0;
  for (col in config.columns) {
    rvWidth += config.columns[col].width;
  };
  return rvWidth;
};

Calendar.prototype._create_resource_headers = function() {
  var html = "";
  for (col in config.columns) {
    // if (config.columns[col].label == "add") {
    //   html += "<div class='add_cell' style='width: " + config.columns[col].width + "px'>" + config.columns[col].label + "</div>";
    // } else {
      html += "<div class='head_cell' style='width: " + config.columns[col].width + "px'>" + config.columns[col].name + "</div>";
    // }
  };
  this.divResourceViewHeader.innerHTML = html;
}

Calendar.prototype._load_resources = function() {
  var html = "";
  var odd = true;
  for (res in this.project.resources) {
    if (!odd) {
      html += "<div class='resource_row_odd col_container' style= 'height: 30px'>" + this._create_resources_cells(this.project.resources[res]) + "</div>";

    } else {
      html += "<div class='resource_row col_container' style= 'height: 30px'>" + this._create_resources_cells(this.project.resources[res]) + "</div>";

    };
  };
  this.divResourceViewData.innerHTML = html;
}

Calendar.prototype._get_next_resourceID = function () {
  resourceID = this.project.nextResourceID;
  this.project.nextResourceID -= 1;
  return resourceID;
};

Calendar.prototype._get_new_default_resource = function () {
  resourceID = this.project.nextResourceID;
  name = "G.I Doe";
  groupType = "Default";
  resource = new Resource(resourceID, name, groupType);
  resource.projectID = this.project.id;
  return resource;
};

Calendar.prototype._create_resource = function(resource) {
  if (resource === undefined) {
  resource = this._get_new_default_resource();
  return this._create_resources_cells(resource)
}

  var html = "<div id=" + resource.id + " class='resource_row col_container' style= 'height: 30px; width: auto;'>" + this._create_resources_cells(resource) + "</div>";
  //  this._create_empty_task_row(resource.id);
  //$(".task_view_rows").children().last().html(this._create_empty_task_rows_cells(50));

  return html;
}

Calendar.prototype._create_resources_cells = function(resource) {
  var html = "";
// html += "<div class='remove_cell' style='width: " + config.columns[i].width + "px'>" + res[config.columns[i].label.toString().toLowerCase()] + "</div>";
  for (var i = 0; i < config.columns.length; i++) {
//     if (config.columns[i].label.toString().toLowerCase() == "add" && resource.type === "Default" ) {
//       html += "<div class='remove_cell' style='width: " + config.columns[i].width + "px'>" + resource[config.columns[i].label.toString().toLowerCase()] + "</div>";
// }
// else
//  if (config.columns[i].label.toString().toLowerCase() == "add") {
//       html += "<div class='non_removable_cell' style='width: ";
//       html += config.columns[i].width + "px'>";
//       html += resource[config.columns[i].label.toString().toLowerCase()];
//       html += "</div>";
// }

//      else {
      html += "<div class='resource_cell' style='width: " + config.columns[i].width + "px; background-color:"+resource.color+";'>" + resource[config.columns[i].label.toString()] + "</div>";
    // }
  }
  return html;
};

Calendar.prototype._create_date_headers = function() {
  var date = new Date(this.project.startDate.getTime());
  // console.log("Datumet:",date);
  var amount = this.project.lengthDays;
  var html = "";

  var weekdays = 1;
  var weekhtml = "";

  for (var i = 0; i < amount; i++) {

    html += "<div class='task_head_cell' style='width: " + config.dateHeaderWidth + "px; height: "+(config.headerHeight/2)+"px;'>" + date.getDate() + "</br>" + date.getDayAbbreviation() + "</div>";

    if (date.getDayAbbreviation() === "Sun" || (i+1) === amount){
      if ((i+1) === amount){
        date.add('d', 7 - weekdays);
      }
        // console.log("What i:", i)
        // console.log("What date:", date)
        // console.log("Date week:", date.getWeekNumber())

      weekhtml += "<div class='task_week_cell' style='width: "+(config.dateHeaderWidth*weekdays)+"px'> W:"+date.getWeekNumber()+"</div>"
      weekdays = 1;
    }else {
      weekdays++;
    }
    date.add("d", 1);
  };
  this.divTaskDays.innerHTML = html;
  this.divTaskWeeks.innerHTML = weekhtml;

  //this._create_empty_task_rows(amount);
};

Calendar.prototype._create_row_cells = function() {
  var date = new Date(this.project.startDate.getTime());
  var html = "";
  for (var i = 0; i < this.project.lengthDays; i++) {
    if (date.getDayAbbreviation() === "Sun"){
      html += "<div class='task_row_cell_sun' style='width: " + config.dateHeaderWidth + "px; height: " + config.rowHeight + "px'></div>";
    }else if(date.getDayAbbreviation() === "Sat"){
      html += "<div class='task_row_cell_sat' style='width: " + config.dateHeaderWidth + "px; height: " + config.rowHeight + "px'></div>";
    }else{
      html += "<div class='task_row_cell' style='width: " + config.dateHeaderWidth + "px; height: " + config.rowHeight + "px'></div>";
    }
    date.add("d", 1);
  };
  return html;
};

Calendar.prototype._create_empty_task_row = function(resID) {
  var html = "";
  //console.debug("Rows", this._create_empty_task_rows_cells(amount));
  //var width = this.project.lengthDays * config.taskWidth;
  // console.log(config.taskWidth);
  html += "<div id='row_" + resID + "' class='task_row col_container' style='width: " + config.taskWidth + "px; height: " + config.rowHeight + "px'></div>";

  this.divTaskViewRows.innerHTML += html;

  $("#row_" + resID).html(this._create_row_cells());
  // $("#row_" + resID).children('div:first').html(resID);
};

Calendar.prototype.create_resource = function (dropped,target,flag) {
  var droppedID = $(dropped).attr("id");
  dropped.removeClass("draggableClone");
  var newResource  = cal._get_new_default_resource();
  dropped.attr("id",cal._get_next_resourceID());
  cal.project.resources.push(newResource);
  updateResourceRows(target ,flag);
  dB_storeObject(newResource);
  dB_updateObject(cal.project);
};

Calendar.prototype.create_task_for_storage = function(name, days){
  //if (startTime === undefined) startTime = new Date(this.project.startDate.getTime());
  //if (endTime   === undefined) endTime   = new Date(this.project.startDate.getTime());
var taskToCreate = this.project.create_task(new Date(this.project.startDate.getTime()), new Date(this.project.startDate.getTime()), 0, name, days);
console.log(taskToCreate);
dB_storeObject(taskToCreate);
  return taskToCreate
}



Calendar.prototype.create_task = function(cell, resID) {
  //console.log("create task cell pos:", cell.position())
  var pos = cell.offset();
  var startDate = new Date(this.project.startDate.getTime());
  startDate.setDate(startDate.getDate() + cell.index())

  var endDate = new Date(startDate);
  endDate.setDate(endDate.getDate()+1);

  //console.debug("Task: ", $("#task_" + this.project.taskID).position())
console.log(resID);
  var newTask = this.project.create_task(startDate, endDate, resID,undefined,startDate.distanceInDays(endDate)+1);

  //console.log("Task_prerender: ", newTask)
  dB_storeObject(newTask);
  dB_updateObject(cal.project);
  newTask.render();

/*
  $("#task_" + newTask.taskID).offset({
    left: pos.left + 2,
    top: pos.top + 3
  });

  /*
  $("#task_"+this.project.taskID).draggable({
    grid: [ config.dateHeaderWidth , config.rowHeight ],
    drag: function( event, ui ) {

    // Keep the left edge of the element
    // at least 100 pixels from the container
    //ui.position.left = Math.max( 2, ui.position.left );
    ui.position.top = Math.max( 3, ui.position.top );
  },
    revert: function( event, ui ){

      if (event.item.position.left < 2 || event.item.position.top < 3){
        return true;
      }else{
        return false;
      }
    }}).resizable({ grid: [ config.dateHeaderWidth , config.rowHeight ] });
*/
};

create_cover = function() {
  var html = "";

  html = "<div id='cover' class= 'calendar_cover'></div>";
  $("body").append(html);

  $(".calendar_cover").click(function() {
    $(this).remove();
    $("#infoBox").remove();
  });

  html = "<div id='infoBox' class='col_container'>";
  html += "<div id='infobox_text' class='infobox_text'><textarea id='txt_123'></textarea></div>"

  html += "</div>";
  $("body").prepend(html);
}

Calendar.prototype.change_width = function () {
  if(this.ifSidebarOpen){
    //$("#calendar").width($("#calendar").width() + 200);
    $(".task_view").animate({
      width: "+=200"
    }, 100, function() {
    });
    $("#calendar").animate({
      width: "+=200"
    }, 100, function() {
    });


    //$(".calendar_container").width($(".calendar_container").width() + 200);
    //$(".task_view").width($(".task_view").width() + 200);
    this.ifSidebarOpen = false;
  }else{
    //$("#calendar").width($("#calendar").width() - 200);

    $("#calendar").animate({
      width: "-=200"
    }, 750, function() {
    });
    $(".task_view").animate({
      width: "-=200"
    }, 750, function() {
    });
    //$(".calendar_container").width($(".calendar_container").width() - 200);
    //$(".task_view").width($(".task_view").width() - 200);
    this.ifSidebarOpen = true;

  }
};
