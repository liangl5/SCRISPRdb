//========================================================================================
//
//    Name: sdb_individualcrispr.js
//    Purpose: Client Sided code to access the SCRISPRdb, specifically CRISPR related
//
//    Author: Luke Liang
//    Date: 5/20/2020 - Present
//
//========================================================================================

const ipAddress = '10.34.229.125'


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var genome_id = urlParams.get('genome_id');
var crispr_id = urlParams.get('crispr_id');
var organism_name = urlParams.get('organism_name');
var display = urlParams.get('display');

document.getElementById("name").innerText = organism_name + " - CRISPR " + crispr_id;

function isNumeric(num){
    return !isNaN(num)
}

function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
// initialization
document.getElementsByClassName('tablinks')[1].click()

document.getElementById("back").addEventListener('click', ()=>{
    window.location.href = "http://" + ipAddress + ":8080/crispr.html?genome_id=" + genome_id + "&organism_name=" + organism_name + "&display=" + display;
}, 'false');

document.getElementById("downloadSpacer").addEventListener("click", () => {
    downloadFile("spacer", genome_id, crispr_id);
}, false);
document.getElementById("downloadFullCrisprNoFormat").addEventListener("click", () => {
    downloadFile("fullcrispr", genome_id, crispr_id);
}, false);
document.getElementById("downloadFullCrisprFormat").addEventListener("click", () => {
    downloadFile("fullcrisprformat", genome_id, crispr_id);
}, false);

if (isNumeric(genome_id) && isNumeric(crispr_id)) {
    getCrisprData();
}

var blastSelectIsShown = false;
document.getElementById("blastParameters").addEventListener("click", ()=>{
    if (!blastSelectIsShown) {
        document.getElementById("blastParametersContent").style.display = "inline";
    } else {
        document.getElementById("blastParametersContent").style.display = "none";
    }
    blastSelectIsShown = !blastSelectIsShown;
}, false)

document.getElementById("blast").addEventListener("click", ()=>{
    runBlast(); 
}, false);


async function runBlast() {
    if (!isNumeric(document.getElementById("evalue").value) || parseFloat(document.getElementById("evalue").value) < 0) {
        alert("Invalid E Value, Expecting Positive Numbers");
        return;
    }


    var oneIsSelected = false;
    var checkboxes = document.getElementsByClassName("spacerCheckBoxes");
    var headers = [];
    var spacerData = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            oneIsSelected = true;
            headers.push(i+1);
            spacerData.push(checkboxes[i].value)
        }
    }
    if (!oneIsSelected) {
        alert("No Checkboxes Were Checked!")
        return;
    } 
    

    var data = {genome_id, 
                crispr_id, 
                wordSize: getFormData("wordSize"),
                database: getFormData("database"),
                matchScore: getFormData("matchScore"),
                gapScore: getFormData("gapScore"),
                evalue: document.getElementById("evalue").value,
                headers,
                spacerData}
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    

    const response = await fetch('/blast', options);
    const responseData = await response.json();
    window.location.href = "http://" + ipAddress + ":8080/blastlist.html?genome_id=" + genome_id + "&crispr_id=" + crispr_id + "&organism_name=" + organism_name + "&display=" + display + "&file=" + responseData.file;
}

function getFormData(documentId) {
    var e = document.getElementById(documentId);
    return e.options[e.selectedIndex].value;
}

function download(file, filename) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

async function downloadFile(category, genome_id, crispr_id) {
    var data = {
        type: 5,
        genome_id: genome_id,
        crispr_id: crispr_id,
        category: category
    };
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/api', options);
    const responseData = await response.blob();
    download(responseData, organism_name + "_crispr_" + crispr_id + "_" + category + ".txt")
}

async function getCrisprData() {
    var type = 1;
    var data = {type, genome_id, crispr_id};
    var options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };


    // table 1 of the details
    const response = await fetch('/api', options);
    const responseData = await response.json();
    const genome_data = await responseData.genome_data;

    var repeat_length = parseInt(genome_data[0].repeat_length);

    var html = "";

    var tablehtml = "<table class=\"pure-table pure-table-horizontal\" id=\"generalInfo" + crispr_id + "\">";
        tablehtml = tablehtml + "<tr><td>Total Length:</td><td>" + genome_data[0].total_length +"</td></tr>";
        tablehtml = tablehtml + "<tr><td>Number Of Repeats:</td><td>" + genome_data[0].repeat_count +"</td></tr>";
        tablehtml = tablehtml + "<tr><td>Number Of Spacers:</td><td>" + genome_data[0].spacer_count +"</td></tr>";
        tablehtml = tablehtml + "<tr><td>Repeat Length:</td><td>" + genome_data[0].repeat_length +"</td></tr>";
    tablehtml = tablehtml + "</table>";

    var headerhtml = "<h4 id=\"crispr_name\">CRISPR " + crispr_id + " -  Range: " + genome_data[0].range_begin + " - " + genome_data[0].range_end + "</h4>";
    var secondaryheaderhtml = "<h5>\t1). Basic Information</h5>";

    html = html + "<div class=\"crispr_table\">"+ headerhtml + secondaryheaderhtml + tablehtml + "<br></br>";



    //table 4 of the spacers and crisprs & a bit of table 2
    var datavar = {
        data: []
    }


    type = 4;
    data = {type, genome_id, crispr_id};
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response4 = await fetch('/api', options)
    const responseData4 = await response4.json();
    const crispr_data = responseData4.crispr_data;
    var crisprhtml = "<table class=\"pure-table pure-table-bordered\" id=\"crisprData\"><thead><tr><th>Start</th><th>Repeat</th><th>Spacer</th><th>Spacer Length</th><th>Select to Blast</th></tr></thead>";
    var alreadyShownRepeat = false;
    var alreadyShownSpacer = false;



    for (var i = 0; i < crispr_data.length; i++) {
        var currentLocation = parseInt(crispr_data[i].start);
        // table 4
        crisprhtml = crisprhtml + "<tr>";
            crisprhtml = crisprhtml + "<td>" + crispr_data[i].start + "</td>";
            crisprhtml = crisprhtml + "<td><a href=\"http://bioinfolab.miamioh.edu/crf/str.php?var=" + crispr_data[i].repeat + "\" target=\"_blank\">" + crispr_data[i].repeat + "</a></td>";
            crisprhtml = crisprhtml + "<td><a href=\"http://bioinfolab.miamioh.edu/crf/str.php?var=" + crispr_data[i].spacer + "\" target=\"_blank\">" + crispr_data[i].spacer + "</a></td>";     
            var placeHolder = crispr_data[i].spacer_length;
            if (placeHolder != 0) {
                crisprhtml = crisprhtml + "<td>" + crispr_data[i].spacer_length + "</td>";
            }

            if (crispr_data[i].spacer != "") {
                crisprhtml = crisprhtml + "<td><input type=\"checkbox\" class=\"spacerCheckBoxes\" value=\"" + crispr_data[i].spacer + "\"></td>"
            }  
        crisprhtml = crisprhtml + "</tr>";

        
    
        // table 2 area
        // legends are very weird, had to swap them for some reason
        if (!alreadyShownRepeat) {
            datavar.data.push(
                {      
                    type: "line",
                    showInLegend: true,
                    legendText: "Spacer",
                    lineColor: "#31CE90",
                    lineThickness: 40,
                    dataPoints: [
                        {x:currentLocation, y:50, color: "#31CE90", name: "Repeat Begin", value: currentLocation},
                        {x:currentLocation + repeat_length - 1, y:50, color: "#31CE90", name: "Repeat End", value: currentLocation + repeat_length - 1}
                    ]
                }
            );
            datavar.data.push (
                {
                    type: "line",
                    markerType: "triangle",
                    dataPoints: [
                        {x: currentLocation + repeat_length / 2, y:50.3, color:"red", name:"Length", value:repeat_length}
                    ]
                }
            );
            alreadyShownRepeat = true;
        } else {
            datavar.data.push(
                {      
                    type: "line",
                    lineColor: "#31CE90",
                    lineThickness: 40,
                    dataPoints: [
                        {x:currentLocation, y:50, color: "#31CE90", name: "Repeat Begin", value: currentLocation},
                        {x:currentLocation + repeat_length - 1, y:50, color: "#31CE90", name: "Repeat End", value: currentLocation + repeat_length - 1}
                    ]
                }
            );
            datavar.data.push (
                {
                    type: "line",
                    markerType: "triangle",
                    dataPoints: [
                        {x: currentLocation + repeat_length / 2, y:50.3, color:"red", name:"Length", value:repeat_length}
                    ]
                }
            );
        }
        
        currentLocation = currentLocation + repeat_length;
        var tmp = parseInt(currentLocation) + parseInt(crispr_data[i].spacer_length);
        if (crispr_data[i].spacer_length != 0 && !alreadyShownSpacer) {
            datavar.data.push(
                {
                    type: "line",
                    lineColor: "#1A5ED2",
                    lineThickness: 10,
                    dataPoints: [
                        {x:currentLocation, y:50, color:"#1A5ED2", name: "Spacer Begin", value: currentLocation},
                        {x:tmp-1, y:50, color:"#1A5ED2", name: "Spacer End", value: tmp-1}
                    ]
                }
            );
            datavar.data.push (
                {
                    showInLegend: true,
                    legendText: "Repeat",
                    type: "line",
                    markerType: "triangle",
                    dataPoints: [
                        {x: (currentLocation + tmp) / 2, y:50.3, color:"red", name:"Length", value:crispr_data[i].spacer_length}
                    ]
                }
            );
            alreadyShownSpacer = true;
        } else if (crispr_data[i].spacer_length != 0 && alreadyShownSpacer) {
            datavar.data.push(
                {
                    type: "line",
                    lineColor: "#1A5ED2",
                    lineThickness: 10,
                    dataPoints: [
                        {x:currentLocation, y:50, color:"#1A5ED2", name: "Spacer Begin", value: currentLocation},
                        {x:tmp-1, y:50, color:"#1A5ED2", name: "Spacer End", value: tmp-1}
                    ]
                }
            );
            datavar.data.push (
                {
                    type: "line",
                    markerType: "triangle",
                    dataPoints: [
                        {x: (currentLocation + tmp) / 2, y:50.3, color:"red", name:"Length", value:crispr_data[i].spacer_length}
                    ]
                }
            );
        }
    }
    crisprhtml = crisprhtml + "</table>";
    document.getElementById("show").innerHTML = crisprhtml;

    html = html + "</div>";
    document.getElementById("basic_info").innerHTML = html;


    // table 2

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2",
        toolTip:{
            content:"{name}: {value}",
        },
        axisY:{
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            minimum: 49,
            interval: 1,
            labelFormatter: function(){
                return " ";
            }
        },
        data: datavar.data
    });
    chart.render();



    // table 3 - weblogo
    type = 3;
    data = {type, genome_id, crispr_id};
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    //const response3 = await


    fetch('/api', options)
        .then(response => response.blob())
        .then(function(myBlob) {
          var url = window.URL.createObjectURL(myBlob);
          document.getElementById("weblogo").src = url;
        });






    
    //finally add everything
    
}

