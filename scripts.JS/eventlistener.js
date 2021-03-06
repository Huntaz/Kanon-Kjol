task_func = function(){
  $(".task_view_rows").on('dblclick', '.task_row_cell', function(){
    var resID = Number($(this).parent().attr("id").replace('row_', ''));
    //console.log("this", $(this).index(), resID);
    cal.create_task($(this), resID);
  });
}

$(document).ready(function() {
  $(".add_cell").click(function() {
    cal._create_resource();
  });
  /*
  var isDragging = false;

  $(".resource_view_data").on({
    mousedown: function(){
      isDragging = true;
    },
    mousemove: function(){
      if (isDragging)
        $("#row_"+$(this).parent().attr("id")).remove();
    },
    mouseup: function(){
      var wasDragging = isDragging;
      isDragging = false;
      if (!wasDragging) {
          $("#throbble").toggle();
      }
    }
  }, '.resource_cell');
*/
  //console.log("Eventlistener: Ready")
  $(".task_view_rows").on('dblclick', '.task_row_cell', function() {
    var resID = Number($(this).parent().attr("id").replace('row_', ''));
    //console.log("Create task", $(this).index(), resID);
    cal.create_task($(this), resID);
  });


  /* $(".resource_view_data").on('dblclick', '.resource_cell', function(){
    create_cover();
  });
*/

  $(document).on("sortchange", function(ui, e) {
    //console.log("Dragging");
    var id = e.item.attr('id');
  });

  $(".resource_view_data").on('click', '.remove_cell', function() {
    var resID = $(this).parent().attr("id");
    $("[res=" + resID + "]").remove();
    var tasks = cal.project.get_task_by_resource(resID);
    for (var t in tasks) {
      $("#task_" + tasks[t].taskID).remove();
    }
    $("#row_" + resID).remove();
    $(this).parent().remove();
  });


  $('.task_view').on('scroll', function() {
    //console.log($(this).scrollTop())
    $('.resource_view').scrollTop($(this).scrollTop());
  });

  $('.task_view_bars').mouseleave(function(event) {
    if (mouseEngaged == 0) {
      if (!$(event.target).hasClass("ui-resizable-handle") && $(event.target).hasClass("task_bar_resize")) {
        removeDragRez(event.target.id);
        // console.log("lämngar1:",event.target.id);
      } else {
        //  console.log("lämngar2:",$(event.target).parent()[0].id);
        // console.log("remove:",$(event.target).parent()[0].id);
        removeDragRez($(event.target).parent()[0].id);
      }
    }
  });

  $('.task_view_bars').mouseenter(function(event) {

    if (!$(event.target).hasClass("ui-resizable-handle")) {
      // console.log("över:",event.target.id );
      if ($(event.target).hasClass("task_bar_resize")) {
        removeDragRez(event.target.id);
      }
      addDragRez(event.target.id);
    }
  });

  $('.task_view_bars').on('drag', '.task_bar', function() {
    //console.log($(this).scrollTop())
    //alert("mouseover");
    //$(this).draggable("disable");
    //$(this).draggable({ grid: [ config.dateHeaderWidth , config.rowHeight ] }).resizable({ grid: [ config.dateHeaderWidth , config.rowHeight ] });
  });

  $(document).on("collision", function(event, ui) {
    $("#key").html("COLIISION");
  })


  $(document).keypress(function(e) {
    var key = String.fromCharCode(e.which);
    $('#key').html(key);
  });



  var taskDialog = $("#taskDialog");
  taskDialog.dialog({
    closeOnEscape: true,
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
      "Delete": function() {
        deleteDialogType = "Task"
        deleteDialogID = taskDialogID;
        deleteDialog.dialog("open");
      },
      "Save Changes": function() {
        change_taskinfo();
      },
      "Cancel": function() {
        taskDialog.dialog("close");
      }
    },
    create: function() {
      $(this).closest(".ui-dialog")
        .find(".ui-button:nth-child(1)")
        .addClass("deleteButton");
    },
    open: function() {
      $("#taskDialog").keypress(function(e) {
        if (e.which == 13) {
          change_taskinfo();
        }
      })
    }
  });

  var taskDialogID = 0;


  //$( ".task_view_bars").on("draggable")

  //-----------------Change info about resources--------------------------------

  var resourceDialog = $("#resourceDialog");
  resourceDialog.dialog({
    closeOnEscape: true,
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
      "Delete": function() {
        deleteDialogType = "Resource"
        deleteDialogID = resourceDialogID;
        deleteDialog.dialog("open");
      },
      "Save Changes": function() {
        change_resourceinfo();
      },
      "Cancel": function() {
        resourceDialog.dialog("close");
      }
    },
    create: function() {
      $(this).closest(".ui-dialog")
        .find(".ui-button:nth-child(1)")
        .addClass("deleteButton");
    },
    open: function() {
      $("#resourceDialog").keypress(function(e) {
        if (e.which == 13) {
          change_resourceinfo();
        }
      })
    }
  });

  var resourceDialogID = 0;

  //-----------------Delete Stuff--------------------------------

  var deleteDialog = $("#deleteDialog");
  deleteDialog.dialog({
    closeOnEscape: true,
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
      "Yes": function() {
        deleteTarget(deleteDialogID, deleteDialogType);
        deleteDialog.dialog("close");
        resourceDialog.dialog("close");
        taskDialog.dialog("close");
      },
      "No": function() {
        deleteDialog.dialog("close");
      }
    },
    open: function() {
      $("#deleteDialog").keypress(function(e) {
        if (e.which == 13) {
          deleteTarget(resourceDialogID, deleteDialogType);
          deleteDialog.dialog("close");
        }
      })
    }
  });
  var deleteDialogType = "";
  var deleteDialogID = 0;

  //--------------Change info about project-------------------------
  var projectDialog = $("#projectDialog");
  projectDialog.dialog({
    closeOnEscape: true,
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Delete": function() {
        deleteDialog.dialog("open");
      },
      "Save Changes": function() {
        change_projectinfo();
      },
      "Cancel": function() {
        projectDialog.dialog("close");
      }
    },
    create: function() {
      $(this).closest(".ui-dialog")
        .find(".ui-button:nth-child(1)")
        .addClass("deleteButton");
    },
    open: function() {
      $("#projectDialog").keypress(function(e) {
        if (e.which == 13) {
          change_projectinfo();
        }
      })
    }
  });

  var projectDialogID = 0;

  function change_resourceinfo() {
    var resource = cal.project.get_resource_by_id(resourceDialogID);
    resource.name = $("#resource_dialog_name").val();
    resource.groupType = $("#resource_dialog_type").val();
    resource.color = $("#resource_dialog_color").val();
    //updateInnerHtml(resource);
    $("#" + resource.id).children().eq(1).html(resource.name)
    $("#" + resource.id).children().eq(0).html(resource.groupType)
    // $("#" + resource.id).children().eq(0).css("background-color",resource.color)
    $("#" + resource.id).children().css("background-color",resource.color)

    resourceDialog.dialog("close");
    dB_updateObject(resource);
  }

  function change_taskinfo() {
    var task = cal.project.get_task_by_id(taskDialogID);
    task.name = $("#task_dialog_name").val();
    task.color = $("#task_color").val();
    var newDayCount = new Date($("#task_startDate").val()).distanceInDays(new Date($("#task_endDate").val()));
    newDayCount++;
    // console.log(newDayCount);

    if ( (newDayCount <= 0)) {
      taskDialog.dialog("close");
      return;
    }

    if (task.startDate != $("#task_startDate").val() ||
        task.endDate != $("#task_endDate").val()) {
          task.lengthInDays = newDayCount
          task.startDate = new Date($("#task_startDate").val());
          task.endDate = new Date($("#task_endDate").val());

          $("#task_"+task.id).remove();
          if(task.resources[0] === 0) {
            task.render_toStorage();
          }
          else {
          task.render();
          }

    }
    var borderColor = tinycolor(task.color).darken(20).desaturate(60)
    $("#task_" + taskDialogID).css("background-color", $("#task_color").val());
    $("#task_" + taskDialogID).css("border", "1px solid "+borderColor);
    

    updateInnerHtml(task);

    taskDialog.dialog("close");
    dB_updateObject(task);
  };

  function change_projectinfo (){
  cal.project.name = $("#project_dialog_name").val();
  $("#proj").html($("#project_dialog_name").val())
  // console.log(cal.project.startDate);
  // console.log($("#project_startDate").val());
  if (  cal.project.startDate != $("#project_startDate").val() ||
        cal.project.stopDate != $("#project_endDate").val())
        {
          cal.project.startDate = $("#project_startDate").val();
          cal.project.stopDate = $("#project_endDate").val();
          projectDialog.dialog( "close" );
          dB_updateObjectAndReload(cal.project);
          return;
  }
  projectDialog.dialog( "close" );
  dB_updateObject(cal.project);

}

  $(document).on("dblclick", ".resource_row", function(event, ui) {
    resourceDialogID = Number($(event.target).parent().attr("id"));
    var resourceObject = cal.project.get_resource_by_id(resourceDialogID);
var bgColor = $("#"+resourceDialogID).children().eq(0).css("background-color");
    // console.log("resorceID", cal.project.get_resource_by_id(resourceDialogID));
    $("#resource_dialog_name").val(resourceObject.name);
    $("#resource_dialog_type").val(resourceObject.groupType);
    $("#resource_dialog_color").val(resourceObject.color);
    // console.log(resourceDialogID);
    // console.log($("#"+resourceDialogID).children().eq(0).css("background-color"));
    $("#resource_dialog_color").css("background-color", bgColor);
    resourceDialog.dialog("open");
  })

  $(document).on("dblclick", ".task_bar", function(event, ui) {
    taskDialogID = Number(event.target.id.replace("task_", ""));
    // console.log(taskDialogID);
    var taskObject = cal.project.get_task_by_id(taskDialogID);
    $("#task_dialog_name").val(taskObject.name);
    $("#task_startDate").val(taskObject.startDate);
    $("#task_endDate").val(taskObject.endDate);
    $("#task_color").val(taskObject.color);
    // console.log(taskObject.color);
    $("#task_color").css("background-color", ($("#" + event.target.id).css("background-color")));
    //console.log(taskDialogID);
    taskDialog.dialog("open");
  })

  $("#proj").on("dblclick", function() {

    projectDialogID = cal.project.id;

    $("#project_dialog_name").val(cal.project.name);

    $("#project_startDate").val(cal.project.startDate);

    $("#project_endDate").val(cal.project.stopDate);

    projectDialog.dialog("open");

  });


  /* $(".resource_view_data").on('dblclick', '.resource_cell', function(){
    create_cover();
  });
  */

  $(function() {
    $("#project_startDate, #project_endDate, #task_startDate, #task_endDate, #taskStorage_startDate, #taskStorage_endDate").datepicker({
      showWeek: true,
      firstDay: 1
    });
  });


  // var elem = $('.set-bg-elem')[0];
  // var elem2 = $('.set-bg-elem')[0];
  //
  // var hueb2 = new Huebee(elem2, {
  //   setBGColor: true
  // });
  // var hueb = new Huebee(elem, {
  //
  // });
// '#FAA', '#FDA', '#FFA', '#DFA', '#AFA', '#AFD', '#AFF', '#ADF', '#AAF', '#DAF', '#FAF', '#FAD',
// '#F55', '#FA5', '#FF5', '#AF5', '#5F5', '#5FA', '#5FF', '#5AF', '#55F', '#A5F', '#F5F', '#F5A',
// '#FBB', '#FDB', '#FFB', '#DFB', '#BFB', '#BFD', '#BFF', '#BDF', '#BBF', '#DBF', '#FBF', '#FBD',
// '#E77', '#EA7', '#EE7', '#AE7', '#7E7', '#7EA', '#7EE', '#7AE', '#77E', '#A7E', '#E7E', '#E7A'
  $('.set-bg-elem').each( function( i, elem ) {
    var hueb = new Huebee( elem, {
      saturations: 0,
      shades:0,
      customColors: [
        '#FAA', '#FDA', '#FFA', '#DFA', '#AFA', '#AFD', '#AFF', '#ADF', '#AAF', '#DAF', '#FAF', '#FAD',
        '#F55', '#FA5', '#FF5', '#AF5', '#5F5', '#5FA', '#5FF', '#5AF', '#55F', '#A5F', '#F5F', '#F5A',
        '#FBB', '#FDB', '#FFB', '#DFB', '#BFB', '#BFD', '#BFF', '#BDF', '#BBF', '#DBF', '#FBF', '#FBD',
        '#E77', '#EA7', '#EE7', '#AE7', '#7E7', '#7EA', '#7EE', '#7AE', '#77E', '#A7E', '#E7E', '#E7A'
      ],
      setBGColor: true
    });
  });


});
