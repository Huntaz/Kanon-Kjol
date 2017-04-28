function Task(startDate, endDate, resID, taskID) {

  this.startDate = startDate;
  this.endDate = endDate;
  this.resources = [resID];
  this.taskID = taskID;
  this.startPos;

  this.startSize = {
    height: 0,
    width: 0
  };
  //this.startSize.height = 0;
  //this.startSize.width = 0;
}

Task.prototype.render = function() {
  var html = "<div id='task_" + this.taskID +"'"+
                  "res='" + this.resources[0] +
                  "'class='task_bar task_bar_obs' "+
                  "style='width : " + (config.dateHeaderWidth * (this.endDate.getDate() - this.startDate.getDate()) - 6)+"px;"+
                        "height : " + (config.rowHeight * (Math.max(this.resources.length,1)) - 6)+"px;"+
                           "left: " + (config.dateHeaderWidth * this.startDate.getDate() + 3)+"px;"+
                           "top: " + (config.dateHeaderWidth * ($(this.resources[0]).index()) + 3)+"'>";

  html += "ID:"+this.taskID+"</br>"+
          "Date:"+dateString(this.startDate)+"-"+dateString(this.endDate)+
          "</div>";
  cal.divTaskViewBars.innerHTML += html;
  updateInnerHtml(this);
};

function updateInnerHtml(task){
  var html = "ID:"+task.taskID+"</br>"+
          "Date:"+dateString(task.startDate)+"-"+dateString(task.endDate);
  $("#task_"+task.taskID).html(html);
}
function dateString(date){
  var dateString = date.getMonthName()+"/"+date.getDate();

  return dateString;
}


$(document).on('resizestop', function(event, ui) {
  var id = Number(event.target.id.replace("task_", ""));
  var task = cal.project.get_task_by_id(id);

  var endHeight = $("#" + event.target.id).height();
  var endWidth = $("#" + event.target.id).width();

  var shiftResources = (endHeight - task.startSize.height) / config.rowHeight;
  var shiftTime = (endWidth - task.startSize.width) / config.dateHeaderWidth;

  task.endDate.setDate(task.endDate.getDate() + shiftTime);

  set_resources(task, shiftResources);
  updateInnerHtml(task);
})


$(document).on('resizestart', function(event, ui) {
  var id = Number(event.target.id.replace("task_", ""));
  //console.log("Task ID:", id)
  var task = cal.project.get_task_by_id(id);

  task.startSize.height = $("#" + event.target.id).height();
  task.startSize.width = $("#" + event.target.id).width();
})

$(document).on('dragstop', function(event, ui) {
  //$('#key').html("");

  var id = Number(event.target.id.replace("task_", ""));
  var task = cal.project.get_task_by_id(id);


  handleY("task_"+id, null,$("#"+"task_"+id).overlaps(".task_bar"));
  updateInnerHtml(task);
})

$(document).on('dragstart', function(event, ui) {
  //$('#key').html("");
  var id = Number(event.target.id.replace("task_", ""));
  var task = cal.project.get_task_by_id(id);

  task.startPos = $("#" + event.target.id).position();

  //console.log("startPos:", task.startPos)

})

function set_resources(task, shiftResources){
  var startRow = get_row_index(task);

  //console.log("column diff", shiftTime);
  //console.log("row shift", shiftResources);
  var length = (task.resources.length + shiftResources);
  task.resources = [];
  for (var i = 0; i < length; i++) {
    //console.log("startwor:", (i))
    task.resources[i] = cal.divResourceViewData.children[startRow + i].id;
  }
}

function set_dates(task){

}

function get_task_position(event) {
  var task = cal.project.get_task_by_element(event.target);
  return $("#" + event.target.id).position();
}

function get_row_index(task) {
  return $("#" + task.resources[0]).index();
}

function otherTasks(thisTaskID, parentTaskID, overlappingTasks){
  return $.grep(overlappingTasks,function(a) {
              if (a.id !== thisTaskID && a.id !== parentTaskID) {
                //console.log(a);
                return a;
              }
            });
}


function handleY(thisTaskID, parentTaskID, overlappingTasks){
  console.log("HandleY:", thisTaskID, parentTaskID, overlappingTasks);
  overlappingTasks = otherTasks(thisTaskID, parentTaskID, overlappingTasks);

  /* TODO: FIXa ändring av datum och resurser
  var endPos = $("#" + thisTaskID).position();

  var changePos = task.startPos;
  endPos.left  -= changePos.left;
  endPos.top   -= changePos.top;

  endPos.left /= config.dateHeaderWidth;
  endPos.top /= config.rowHeight;

  //console.log("Row diff", changePos.top);
  //console.log("Column shift", changePos.left);

  var startRow = get_row_index(task);
  var indexNewRes = startRow + changePos.top;
*/


  if (overlappingTasks.length <= 0) return;



  if(handleX(overlappingTasks[0].id, thisTaskID)){

  overlappingTasks.shift();
  handleY(thisTaskID, parentTaskID, overlappingTasks);
  }
}

function handleX(thisTaskID, parentTaskID){

  var currTaskID = thisTaskID;
  var movedTaskLeft = $("#"+parentTaskID).position().left;
  var width = $("#"+parentTaskID).width();
  var pos = $("#"+currTaskID).position().left;
  var posw = $("#"+currTaskID).width();

//  var movedTaskright = $("#"+task_id).position().right;
  pos = Math.round(pos)
  var diff;
  if (pos >= movedTaskLeft){
    diff = (movedTaskLeft + width) - pos;
  } else if(pos < movedTaskLeft){
    diff = movedTaskLeft - (pos + posw)
  }

  var diffDays = Math.round(diff/config.dateHeaderWidth);
  console.log("HandleX:", thisTaskID, parentTaskID, pos, movedTaskLeft, width);
  //console.log("Diff:", diff," diffdays: ", diffDays, "Left:", (config.dateHeaderWidth * diffDays));


  $("#"+currTaskID).animate({
    left: pos + (config.dateHeaderWidth * diffDays)},
    50, function (){



      var overlappingTasks = $("#"+currTaskID).overlaps(".task_bar");
      overlappingTasks = otherTasks(thisTaskID, parentTaskID, overlappingTasks);
      if(overlappingTasks.length <= 0){
        return true;
      }
      handleY(thisTaskID, parentTaskID, overlappingTasks);
    })
    return true
}

/*  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id != task_id) {
      //handleOverlaps();
    }
  }
*
};
/*
var endPos = $("#" + event.target.id).position();

var changePos = task.startPos;
changePos.left -= endPos.left;
changePos.top -= endPos.top;

changePos.left /= config.dateHeaderWidth * (-1);
changePos.top /= config.rowHeight * (-1);

//console.log("Row diff", changePos.top);
//console.log("Column shift", changePos.left);

var startRow = get_row_index(task);
var indexNewRes = startRow + changePos.top;
*/
