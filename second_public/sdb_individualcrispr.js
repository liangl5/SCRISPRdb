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

document.getElementById("back").addEventListener('click', ()=>{
    window.location.href = "http://" + ipAddress + ":8080/crispr.html?genome_id=" + genome_id + "&organism_name=" + organism_name + "&display=" + display;
}, 'false');

if (isNumeric(genome_id) && isNumeric(crispr_id)) {
    getCrisprData();
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
    var crisprhtml = "<table class=\"pure-table pure-table-bordered\" id=\"crisprData\"><thead><tr><th>Start</th><th>Repeat</th><th>Spacer</th><th>Spacer Length</th><th>Select</th></tr></thead>";
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
    var outside


    fetch('/api', options)
        .then(response => response.blob())
        .then(function(myBlob) {
          var url = window.URL.createObjectURL(myBlob);
          document.getElementById("weblogo").src = url;
        });






    
    //finally add everything
    
}
