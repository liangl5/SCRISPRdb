//========================================================================================
//
//    Name: sdb_crispr.js
//    Purpose: Client Sided code to access the SCRISPRdb, specifically CRISPR related
//
//    Author: Luke Liang
//    Date: 5/20/2020 - Present
//
//========================================================================================
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



var tmp2 = window.location.href;
var secondIndex = tmp2.search("#")
var tmp = "";
var organism_name = "";

if (secondIndex != -1) {
    window.location.replace(window.location.href.substring(0, secondIndex));
} else {
    var index = tmp2.search("genome_id=");
    var arr = tmp2.substr(index + 10).split("&");
    tmp = arr[0];
    index = arr[1].search("organism_name=");
    organism_name = arr[1].substr(index + 14);
    organism_name = organism_name.replace(/%20/gi, " ");
    document.getElementById("name").innerText = organism_name;
}


if (isNumeric(tmp)) {

    var table = $('#table').DataTable({
        serverSide: false,
        processing: false,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        ajax: {
            url: "/crisprdata?genome_id=" + tmp,
            type: "POST",
        },    
        columns: [ 
            { data : "id",
                "render": function(data, type, row, meta){
          
                if(type === 'display'){
                    data = "<a href=\"/individualcrispr.html?genome_id=" + tmp + "&crispr_id=" + row.id + "&organism_name=" + organism_name + "\">" + data + "</a>";
                }
      
                return data;
                }
            },
            { data : "name", 
                "render": function(data, type, row, meta){
          
                if(type === 'display'){
                    data = "<a href=\"/individualcrispr.html?genome_id=" + tmp + "&crispr_id=" + row.id + "&organism_name=" + organism_name + "\">" + data + "</a>";
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
    window.location.href = "http://bioinfolab.miamioh.edu:8080?var=1";
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

