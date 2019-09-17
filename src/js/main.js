

"use strict";
let selectedProgressBarID = ''
let endPointResult = '';
httpRequest();
console.log(endPointResult);






// Create bar function
function createBar(id,limit,appendToId,current){
    let percent = Math.floor(current/limit *100);
    const ppBar = document.createElement("div")
    ppBar.className = "progressBar";
    ppBar.innerHTML = `<div class="bar" id=${id}>${percent}%</div>`;
    document.getElementById(appendToId).appendChild(ppBar);
    const element = document.getElementById(id);
    element.style.width = percent + "%";
    barClickEventListener(id.toString());
}
function createBtn(id,appendToId,value,limit){
    const btn = document.createElement("button")
    btn.id = id.toString();
    btn.value = value;
    btn.innerHTML = value;
    document.getElementById(appendToId).appendChild(btn);
    btnClickEventListener(id.toString(), limit);

}

function moveProgress(progressBarId,value,limit) {
    if(progressBarId){
        const element = document.getElementById(progressBarId);
        let currentValue = element.style.width;
        if(currentValue){
            currentValue = parseInt(currentValue)/100*limit;
            currentValue = (currentValue+parseInt(value))/limit*100;
        }else{
            value = value/limit*100;
            currentValue = currentValue+value;
        }
        if(currentValue < 0){
            currentValue = 0
        }
        element.style.width = Math.floor(currentValue) + "%";
        element.innerHTML = Math.floor(currentValue) + "%";
        if(currentValue > 100){
            element.style.backgroundColor = "red";
        }else{
            element.style.backgroundColor = "#333039";
        }
    }else{
        window.alert("Please select a bar!");
    }

}

function barClickEventListener(ppBarId) {
    document.getElementById(ppBarId).addEventListener("click",function(event){
        selectedProgressBarID = this.id;
    });
    document.getElementById(ppBarId).parentElement.addEventListener("click",function(event){
        selectedProgressBarID = this.firstElementChild.id;
    });
}

function btnClickEventListener(btnId,limit) {
    document.getElementById(btnId).addEventListener("click",function(event){
        const value = this.value;
        moveProgress(selectedProgressBarID,value,limit);
    });
}


// Set up our HTTP request
function httpRequest(){
    // API URL = http://pb-api.herokuapp.com/bars
    // GET Method
    let restRequest = new XMLHttpRequest();
    const apiUrl = "http://pb-api.herokuapp.com/bars";
    restRequest.open('GET', apiUrl);
    restRequest.send();
    restRequest.onload = function () {
        if (restRequest.status >= 200 && restRequest.status < 300) {
            // What do when the request is successful
            console.log('success!', restRequest);
            document.getElementById("end_point_value").append(restRequest.responseText);
            endPointResult = restRequest.responseText;
            endPointResult = JSON.parse(endPointResult);
            for (let i = 0; i < endPointResult.buttons.length; i++) {
                createBtn(i,"btn_section",endPointResult.buttons[i],endPointResult.limit);
            }
            for (let k = 0; k < endPointResult.bars.length; k++) {
                createBar("ppBar"+k,endPointResult.limit,"progress_bar",endPointResult.bars[k]);
            }
        } else {

            console.log('The request failed!');
            document.getElementById("end_point_value").append(restRequest.status);
            return restRequest.status;
        }

    };
}