//============================================================================
//
//    Name: sdb_index.js
//    Purpose: Client Sided code to access the SCRISPRdb
//
//    Author: Luke Liang
//    Date: 5/20/2020 - Present
//
//============================================================================

var tmp = window.location.href;
var click = 0
if (tmp.search("var=") != -1) {
    click = parseInt(tmp.substring(tmp.search("var=") + 4));
}


var openedArchaea = false, openedBacteria = false, openedBoth = false;
var openedCurrent = false;

function openTab(evt, cityName, displayId) {
    var i, tabcontent, tablinks, tmpstr;
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

    if (displayId == 1) {
      tmpstr = "Archaea";
      openedCurrent = openedArchaea;
      openedArchaea = true;
    } else if (displayId == 2) {
      tmpstr = "Bacteria";
      openedCurrent = openedBacteria;
      openedBacteria = true;
    } else if (displayId == 3) {
      tmpstr = "Complete";
      openedCurrent = openedBoth;
      openedBoth = true;
    }

    if (!openedCurrent) {
    var table = $('#' + tmpstr + "Table").DataTable({
      serverSide: false,
      processing: false,
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      ajax: {
          url: "/data?domain=" + tmpstr,
          type: "POST",
      },    
      "columnDefs": [
        { "width": "2%", "targets": 0 }
      ],
      columns: [ 
          { data : "genome_id"},
          //{ data : "release_num" },
          { data : "RefSeqAssembly_Accession" },
          //{ data : "GenBankAssembly_Accession" },
          { data: "RefSeq_Accession", 
            "render": function(data, type, row, meta){
            
              if(type === 'display'){
                data = '<a href="https://www.ncbi.nlm.nih.gov/nuccore/' + data + '" target="_blank">' + data + '</a>';
              }
  
              return data;
            }
          },
          //{ data : "RefSeqCategory" },        
          { data : "taxId",
            "render": function(data, type, row, meta){
            
            if(type === 'display'){
              data = '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=' + data + '" target="_blank">' + data + '</a>';
            }

            return data;
            }
          },        
          { data : "species_taxId",
            "render": function(data, type, row, meta){
            
            if(type === 'display'){
              data = '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=' + data + '" target="_blank">' + data + '</a>';
            }

            return data;
            }
          },
          { data : "organism_name" },
          //{ data : "infraspecific_name" },
          //{ data : "isolate" },
          { data : "genome_length" },
          { data: "domain" },
          //{ data : "fasta_file_name" }
          { data: "crispr_count",
            "render": function(data, type, row, meta){
              if(type === 'display' && data != 0){
                var tmp = row.organism_name;
                //tmp=tmp.replace(" ", "%20");
                data = '<a href="/crispr.html?genome_id=' + row.genome_id + '&organism_name=' + tmp + '&display=' + displayId + '">' + data + '</a>';
              }
  
              return data;
            }
          }
  
      ]     
    }); 
    }
  }
  
  













// initialization
document.getElementsByClassName('tablinks')[click].click()
if (click == 5) {
  renderGraphs();
}




//============================================================================
//
//                   Deprecated Code
//
//============================================================================

// async function getHeaders () {
//   var type = 1;
//   const data = {type};
//   const options = {
//     method: 'POST',
  
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   };

//   const response = await fetch('/api', options);
//   const responseData = await response.json();

//   var html = '<input type="checkbox" id="all" name="all" value="all" checked><label for="add">All</label>';
//   for (var i = 0; i < responseData.length; i++) {
//     html = html + '<input type="checkbox" class="category" name="' + responseData[i].name + '" value="' + responseData[i].name + '" checked><label for="category' + i + '">' + responseData[i].name + '</label>'
//   }
//   document.getElementById("test2").innerHTML = html;
//   console.log(html);
//   // add event listeners
//   document.getElementById("all").addEventListener('click', ()=>{checkAll(true)}, false);
//   var arr = document.getElementsByClassName("category");
//   for (var i = 0; i < arr.length; i++) {
//     arr[i].addEventListener('click', ()=>{checkAll(false)}, false);
//   }
// }


// function checkAll(selectAll) {
//   if (selectAll) {
//     var arr = document.getElementsByClassName("category");
//     for (var i = 0; i < arr.length; i++) {
//       if (document.getElementById("all").checked) {
//         arr[i].checked = true;
//       } else {
//         arr[i].checked = false;
//       }
//     }
//   } else {
//     var logicGate = true;
//     var arr = document.getElementsByClassName("category");
//     for (var i = 0; i < arr.length; i++) {
//       logicGate = logicGate && arr[i].checked;
//     }
//     if (logicGate) {
//       document.getElementById("all").checked = true;
//     } else {
//       document.getElementById("all").checked = false;
//     }
//   }
// }

// async function getOrganisms (domain) {
//   var type = 2;
//   const data = {type, domain};
//   const options = {
//     method: 'POST',
  
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   };

//   const response = await fetch('/api', options);
//   const responseData = await response.json();
//   console.log(responseData)
//   //document.getElementById("test").innerHTML = data.headerString;
//   // do table things here
// }


// const wait=ms=>new Promise(resolve => setTimeout(resolve, ms)); 

// var isDragging = false;
// var dblClick = false;
// var wasSecondOfLastClick = false;
// $("#table tbody")
// .on('mousedown', 'tr', function() {
//   isDragging = false;
// })
// .on('mousemove', 'tr', function() {
//   isDragging = true;
//  })
// .on ('dblclick', 'tr', ()=>{
//   dblClick = true;
// })
// .on('mouseup', 'tr', function() {
//   if (!isDragging) {
//     wait(500).then(()=>{
//       if (!dblClick && !wasSecondOfLastClick) {
//         var data = table.row( this ).data();
//         console.log(data.genome_id);
//       } else if (wasSecondOfLastClick) {
//         wasSecondOfLastClick = false;
//       } else if (dblClick) {
//         console.log("double click!");
//         wasSecondOfLastClick = true;
//       }
//       dblClick = false;
//     });
//   }
//   isDragging = false;

// });

// var element = $('#table tbody');
// let moved
// let downListener = () => {
//     moved = false
// }
// element.addEventListener('mousedown', downListener)
// let moveListener = () => {
//     moved = true
// }
// element.addEventListener('mousemove', moveListener)
// let upListener = () => {
//     if (moved) {
//         console.log('moved')
//     } else {
//         console.log('not moved')
//     }
// }
// element.addEventListener('mouseup', upListener)

// Initializing
//getHeaders();
//getOrganisms('archaea');