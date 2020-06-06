//========================================================================================
//
//    Name: sdb_crispr.js
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
var organism_name = urlParams.get('organism_name');
var display = urlParams.get('display');
console.log(genome_id, organism_name);
document.getElementById("name").innerText = organism_name;



if (isNumeric(genome_id)) {

    var table = $('#table').DataTable({
        serverSide: false,
        processing: false,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        ajax: {
            url: "/crisprdata?genome_id=" + genome_id,
            type: "POST",
        },    
        columns: [ 
            { data : "id",
                "render": function(data, type, row, meta){
          
                if(type === 'display'){
                    data = "<a href=\"/individualcrispr.html?genome_id=" + genome_id + "&crispr_id=" + row.id + "&organism_name=" + organism_name + '&display=' + display + "\">" + data + "</a>";
                }
      
                return data;
                }
            },
            { data : "name", 
                "render": function(data, type, row, meta){
          
                if(type === 'display'){
                    data = "<a href=\"/individualcrispr.html?genome_id=" + genome_id + "&crispr_id=" + row.id + "&organism_name=" + organism_name + '&display=' + display + "\">" + data + "</a>";
                }
      
                return data;
                }
            },
            { data: "repeat_length" },
            { data : "start" },        
            { data : "end" }
       ]     
    }); 
    //getCrisprData();
}

function isNumeric(num){
    return !isNaN(num)
}

document.getElementById("back").addEventListener('click', ()=>{
    window.location.href = "http://" + ipAddress + ":8080?var=" + display;
}, 'false');




// async function getCrisprData() {
//     var type = 1;
//     var genome_id = tmp
//     var data = {type, genome_id};
//     var options = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };

//     // table 1 of the details
//     const response = await fetch('/api', options);
//     const responseData = await response.json();
//     const genome_data = await responseData.genome_data;


//     var html = "";
//     for (var i = 0; i < genome_data.length; i++) {
//         var j = i + 1;

//         var tablehtml = "<table id=\"crispr_table_" + j + "\">";
//             tablehtml = tablehtml + "<tr><td>Total Length:</td><td>" + genome_data[i].total_length +"</td></tr>";
//             tablehtml = tablehtml + "<tr><td>Number Of Repeats:</td><td>" + genome_data[i].repeat_count +"</td></tr>";
//             tablehtml = tablehtml + "<tr><td>Number Of Spacers:</td><td>" + genome_data[i].spacer_count +"</td></tr>";
//             tablehtml = tablehtml + "<tr><td>Repeat Length:</td><td>" + genome_data[i].repeat_length +"</td></tr>";
//         tablehtml = tablehtml + "</table>";

//         var headerhtml = "<h4 id=\"scroll_to_" + j + "\">" + j +". CRISPR " + j + " -  Range: " + genome_data[i].range_begin + " - " + genome_data[i].range_end + "</h4>";
//         var secondaryheaderhtml = "<h5>\t1). Basic Information</h5>";


//         html = html + "<div class=\"crispr_table\">"+ headerhtml + secondaryheaderhtml + tablehtml
//     }


//     // table 4 of the spacers and crisprs
//     type = 4;
//     data = {type, genome_id};
//     options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     }
//     const response4 = await fetch('/api', options)
//     const responseData4 = await response4.json();
//     const crispr_data = responseData4.crispr_data;
//     console.log(crispr_data);





    
//     // finally add everything
//     html = html + "</div><br></br>";
//     document.getElementById("crispr_area").innerHTML = html;
// }

