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


var table = $('#table').DataTable({
    serverSide: false,
    processing: false,
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
    ajax: {
        url: "/data",
        type: "POST",
    },    
    columns: [ 
        { data : "genome_id" },
        //{ data : "release_num" },
        { data : "RefSeqAssembly_Accession" },
        //{ data : "GenBankAssembly_Accession" },
        { data: "RefSeq_Accession" },
        //{ data : "RefSeqCategory" },        
        { data : "taxId" },        
        { data : "species_taxId" },
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
              data = '<a href="/crispr.html?genome_id=' + row.genome_id + '&organism_name=' + tmp + '">' + data + '</a>';
          }

          return data;
          }
        }

   ]     
}); 


async function getSummaryTab() {
  var type = 1;
  var data = {type};
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/summarydata', options);
  const responseData = await response.json();


  // archaea occurrences
  var summaryHtml = '<h3>CRISPR Occurrences - Archaea</h3><table class="pure-table pure-table-horizontal" id="archaeaOccurrences"';
  summaryHtml = summaryHtml + '<tr><td>Number of Archaea Without CRISPRs</td><td>' + responseData.occurrenceData[0].archaea + '</td></tr>';
  summaryHtml = summaryHtml + '<tr><td>Total Number Of Archaea</td><td>' + responseData.occurrenceData[0].archaeaTotal + '</td></tr>';
  var archaeaPercentage = responseData.occurrenceData[0].archaea/responseData.occurrenceData[0].archaeaTotal * 100;
  archaeaPercentage = archaeaPercentage.toFixed(3);
  summaryHtml = summaryHtml + '<tr><td>Percentage of Archaea Without CRISPRs</td><td>' + archaeaPercentage + '%</td></tr></table>';

  // bacteria occurrences 
  summaryHtml = summaryHtml + '<h3>CRISPR Occurrences - Bacteria</h3><table class="pure-table pure-table-horizontal" id="bacteriaOccurrences"';
  summaryHtml = summaryHtml + '<tr><td>Number of Bacteria Without CRISPRs</td><td>' + responseData.occurrenceData[0].bacteria + '</td></tr>';
  summaryHtml = summaryHtml + '<tr><td>Total Number Of Bacteria</td><td>' + responseData.occurrenceData[0].bacteriaTotal + '</td></tr>';
  var bacteriaPercentage = responseData.occurrenceData[0].bacteria/responseData.occurrenceData[0].bacteriaTotal * 100;
  bacteriaPercentage = bacteriaPercentage.toFixed(3);
  summaryHtml = summaryHtml + '<tr><td>Percentage of Bactera Without CRISPRs</td><td>' + bacteriaPercentage + '%</td></tr></table>';
  document.getElementById("occurrenceTables").innerHTML = summaryHtml;


  console.log(archaeaPercentage, bacteriaPercentage)
  var chart = new CanvasJS.Chart("stackedChartContainer",
    {
      title:{
      text: "CRISPR Occurrences In Genomes"
      },
      axisY: {
        suffix: "%"
      },
      data: [
      {
        type: "stackedColumn100",
        color: "#72aaff",
        showInLegend: true,
        name: "Percentage With CRISPRs",
        dataPoints: [
        {  y: 100 - archaeaPercentage, label: "Archaea"},
        {  y: 100 - bacteriaPercentage, label: "Bacteria" },
        ]
      }, {
        type: "stackedColumn100",
        color: "#ff7072",
        showInLegend: true,
        name: "Percentage Without CRISPRs",
        dataPoints: [
        {  y: 1 - - archaeaPercentage, label: "Archaea"},
        {  y: 1 - - bacteriaPercentage + 1, label: "Bacteria" }
        ]
      }

      ]
    });

    chart.render();








  // then do a table that compares lengths?  either split into 2 or 1 big one

  // largest
  summaryHtml = '<h3>Largest Genomes</h3><table class="pure-table pure-table-horizontal" id="largestGenomeTable"';
  summaryHtml = summaryHtml + '<tr><th>Genome Id</th><th>Organism Name</th><th>Genome Length</th><th>Domain</th></tr>';
  summaryHtml = summaryHtml + '<tr><td>' + responseData.largestArchaea[0].genome_id + '</td><td>' + responseData.largestArchaea[0].organism_name + '</td><td>' + responseData.largestArchaea[0].genome_length + '</td><td>' + responseData.largestArchaea[0].domain + '</td></tr>';
  summaryHtml = summaryHtml + '<tr><td>' + responseData.largestBacteria[0].genome_id + '</td><td>' + responseData.largestBacteria[0].organism_name + '</td><td>' + responseData.largestBacteria[0].genome_length + '</td><td>' + responseData.largestBacteria[0].domain + '</td></tr></table>';

  // smallest
  summaryHtml = summaryHtml + '<h3>Smallest Genomes</h3><table class="pure-table pure-table-horizontal" id="SmallestGenomeTable"';
  summaryHtml = summaryHtml + '<tr><th>Genome Id</th><th>Organism Name</th><th>Genome Length</th><th>Domain</th></tr>';
  summaryHtml = summaryHtml + '<tr><td>' + responseData.smallestArchaea[0].genome_id + '</td><td>' + responseData.smallestArchaea[0].organism_name + '</td><td>' + responseData.smallestArchaea[0].genome_length + '</td><td>' + responseData.smallestArchaea[0].domain + '</td></tr>';
  summaryHtml = summaryHtml + '<tr><td>' + responseData.smallestBacteria[0].genome_id + '</td><td>' + responseData.smallestBacteria[0].organism_name + '</td><td>' + responseData.smallestBacteria[0].genome_length + '</td><td>' + responseData.smallestBacteria[0].domain + '</td></tr></table>';
  document.getElementById("lengthTables").innerHTML = summaryHtml;
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
document.getElementsByClassName('tablinks')[click].click()
getSummaryTab();




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