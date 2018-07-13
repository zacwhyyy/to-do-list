var taskName = document.getElementById('taskName');
var newTaskName;
//task information will be stored as object in this array
var taskArray = [];
var taskDiv = document.getElementById('insertTask');
var checkValue = false;

function addTask() {
    //assign input value to a variable
    newTaskName = taskName.value;

    //check if the input field is empty
    if (newTaskName === null || newTaskName === "" || newTaskName === undefined) {
       alert("Please enter the task name");
    //if the form field is not empty, run the functions: add task and save the data to local storage
    } else {
        addNewTask();
        updateStorage();
    }
}

//generate a key and attach it to a new task, the key is used to identify the task (needed when deleting the task or checking whether the checkbox is ticked)
function generateKey() {
    var key = "";
    var randKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) 
    key += randKey.charAt(Math.floor(Math.random() * randKey.length));

    return key;
}

function addNewTask() {
    //add new value to the array
    var newKey = generateKey();
    //create new object - key, taskname, checkbox status
    var newTaskObject = {key: newKey, task: newTaskName, status: checkValue};
    //add new object into the array
    taskArray.push(newTaskObject);
}

function updateStorage() {
    //check whether the browser supports local storage
    if (typeof(Storage) !== "undefined") {
        //convert array to strings and store in local storage
        localStorage.setItem("toDoList", JSON.stringify(taskArray));
        //reset/clear the form field
        taskName.value = '';
        populateTask();
        console.log("Storage updated!");
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function loadFromStorage() {
    //if local storage exist, load strings and convert them into an array
    if (localStorage.getItem("toDoList")) {
        var storedTask = JSON.parse(localStorage.getItem("toDoList"));
    taskArray = storedTask;
    } 
    populateTask();
}

function populateTask() {
    var listDivArr = [];

    //if task array is not empty, populate the tasks in list
    if(taskArray.length != 0) {
        for(i = 0; i < taskArray.length; i++) {
            if(taskArray[i].status === true) {
                var listDiv = '<li class="task-item list-group-item relative" id="' + taskArray[i].key + '"><input class="form-check-input" type="checkbox" onchange="boxCheck(this, this.parentElement.id)" checked><label class="form-check-label checked">' + taskArray[i].task + '</label><div class="remove" onclick="removeRow(this.parentElement.id)">×</div></li>';
            } else {
                var listDiv = '<li class="task-item list-group-item relative" id="' + taskArray[i].key + '"><input class="form-check-input" type="checkbox" onchange="boxCheck(this, this.parentElement.id)"><label class="form-check-label">' + taskArray[i].task + '</label><div class="remove" onclick="removeRow(this.parentElement.id)">×</div></li>';
            }
            //add the markup into an array
            listDivArr.push(listDiv);
       }
       //join the markup (list)
       var listDivJoined = listDivArr.join(" ");
       //add the mark up in the task div
       taskDiv.innerHTML = listDivJoined;
    } else {
        //if task array is empty, clear all row
        document.getElementById("insertTask").innerHTML = "";
        console.log("No outstanding task!");
    }
}

loadFromStorage();

document.getElementById("clear").addEventListener("click", clear);

//clear local storage and refresh page
function clear() {
    localStorage.clear();
    location.reload();
}

function removeRow(rowID) {
    //console.log(rowID);
    removeTask(rowID);
}

//remove task
function removeTask(key) {
    for(i = 0; i < taskArray.length; i++) {
        if (key === taskArray[i].key) {
            // console.log(key);
            // console.log(taskArray[i].key);
            // console.log(i);
            taskArray.splice(i, 1);
            updateStorage();
        }  
    }
}

function boxCheck(myCheckBox, parentID) {
    for(i = 0; i < taskArray.length; i++) {
        if (!myCheckBox.checked && taskArray[i].key === parentID) {
            //if checkbox is not checked, set the value to false
            taskArray[i].status = false;
            updateStorage();
        } else if (myCheckBox.checked && taskArray[i].key === parentID) {
            //if the checkbox is checked, set the value to true
            taskArray[i].status = true;
            updateStorage();
        }
    }
}