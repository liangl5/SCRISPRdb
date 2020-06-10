//============================================================================
//
//    Name: shared.js
//    Purpose: Does the javascript for all the html pages (summary and drop down areas)
//
//    Author: Luke Liang
//    Date: 5/20/2020 - Present
//
//============================================================================


// necessary functions
function openSecondaryTab(evt, divId) {
  var i, tabcontent, tablinks, tmpstr;
    tabcontent = document.getElementsByClassName("tabcontent-2");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks-2");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(divId).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("SpacersBtn").addEventListener("click", ()=>{
  document.getElementsByClassName('tablinks-2')[0].click()
}, false);
document.getElementById("RepeatsBtn").addEventListener("click", ()=>{
  document.getElementsByClassName('tablinks-2')[2].click()
}, false);




// introduction
var introHtml = "<br/>"
introHtml = introHtml + "<p>SCRISPRdb is a database that allows users to explore the CRISPRs in bacterial and archaeal genomes. &nbsp;&nbsp;For the new release of NCBI RefSeq database, we will download all completedly sequenced and assembled genomes of bacteria and archaea, and scan through them using our CRISPR detection pipeline called CRF (<u><i>C</i></u>RISPR Finder by <u><i>R</i></u>andom <u><i>F</i></u>orest) to detect all putatigve CRISPR candidates. &nbsp;&nbsp;Different from other CRISPR detection tools, a machine learning approache (<i>i.e.</i>, a random forest classifier) was adopted in CRF to filter out invalid CRISPR arrays from all putative candidates and thus enhanced detection accuracy. &nbsp;&nbsp;Also, CRF can filter out those candidates that are apparently tandem repeats to reduce false positive cases.</br>"
introHtml = introHtml + '</p>'

introHtml = introHtml + '<p>Using our highly interactive web interfaces, users can easily and efficiently search, navigate, visualize, examine and validate all  CRISPRs detected in bacterial and archaeal genomes. &nbsp;&nbsp;Moreover, SCRIPRdb provides overall statistical summary information for all CRISPRs, including their occurrences, abundances, size distribtions and repeat-spacer archetectures. &nbsp;&nbsp;This will facilitate better understanding of the origins, biogenesis mechanisms and biological relevances of CRISPRs naturally occurred in bacteria and archaea, benefiting the research community with potential new tools for better DNA and RNA editing and other bioengineering applications.</br>'
introHtml = introHtml + '</p>'

introHtml = introHtml +  '<p>Current SCRISPRdb release: 1.0 (2020-06-10), which has 351 archaea and 17148 bacterias based on RefSeq Release 200 (2020-05-12). </br>'
introHtml = introHtml + '</p>'

introHtml = introHtml + '<h4>How to cite CRF</h4>'

introHtml = introHtml + '<p> Kai Wang and Chun Liang​ (2017) CRF: detection of CRISPR arrays using random forest, <a href="https://peerj.com/articles/3219/">PeerJ 5:e3219</a></p>'
introHtml = introHtml + '<h4>How to cite SCRISPRdb</h4>'


document.getElementById("Introduction").innerHTML = introHtml;


// summary

var prelimHtml = '<div id="stackedChartContainer" style="height: 400px; width: 500px"></div>'
prelimHtml = prelimHtml + '<div id="occurrenceTables"></div>'
document.getElementById("CRISPR Occurrences").innerHTML = prelimHtml;


prelimHtml = '<div id="BacteriaLengthChart"></div>'
prelimHtml = prelimHtml + '<div id="ArchaeaLengthChart"></div>';
prelimHtml = prelimHtml + '<div id="lengthTables"></div>'
document.getElementById("Genome Lengths").innerHTML = prelimHtml;

// Initialization
getSummaryTab();
resizeDropDown();
// re-edits the drop down.  Sometimes visual bug doesn't display the header properly in time for resizeDropDown and the drop down will be higher than intended
setTimeout(function(){ resizeDropDown(); }, 3000);


// drop down styling
function resizeDropDown() {
  var tmp = document.getElementsByClassName("dropdown-content")
  
  for (var i = 0; i < tmp.length; i++) {
    var x = document.getElementsByClassName("dropbtn")[i].getBoundingClientRect()
    tmp[i].style.top = x.bottom + "px";
  }
}


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
  
    // occurrences chart
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
  
  
    // largest table
    summaryHtml = '<h3>Largest Genomes</h3><table class="pure-table pure-table-horizontal" id="largestGenomeTable">';
    summaryHtml = summaryHtml + '<tr><th>Genome Id</th><th>Organism Name</th><th>Genome Length</th><th>Domain</th></tr>';
    summaryHtml = summaryHtml + '<tr><td>' + responseData.largestArchaea[0].genome_id + '</td><td>' + responseData.largestArchaea[0].organism_name + '</td><td>' + responseData.largestArchaea[0].genome_length + '</td><td>' + responseData.largestArchaea[0].domain + '</td></tr>';
    summaryHtml = summaryHtml + '<tr><td>' + responseData.largestBacteria[0].genome_id + '</td><td>' + responseData.largestBacteria[0].organism_name + '</td><td>' + responseData.largestBacteria[0].genome_length + '</td><td>' + responseData.largestBacteria[0].domain + '</td></tr></table>';
      
    // smallest table
    summaryHtml = summaryHtml + '<h3>Smallest Genomes</h3><table class="pure-table pure-table-horizontal" id="SmallestGenomeTable">';
    summaryHtml = summaryHtml + '<tr><th>Genome Id</th><th>Organism Name</th><th>Genome Length</th><th>Domain</th></tr>';
    summaryHtml = summaryHtml + '<tr><td>' + responseData.smallestArchaea[0].genome_id + '</td><td>' + responseData.smallestArchaea[0].organism_name + '</td><td>' + responseData.smallestArchaea[0].genome_length + '</td><td>' + responseData.smallestArchaea[0].domain + '</td></tr>';
    summaryHtml = summaryHtml + '<tr><td>' + responseData.smallestBacteria[0].genome_id + '</td><td>' + responseData.smallestBacteria[0].organism_name + '</td><td>' + responseData.smallestBacteria[0].genome_length + '</td><td>' + responseData.smallestBacteria[0].domain + '</td></tr></table>';
    document.getElementById("lengthTables").innerHTML = summaryHtml;


    // Length graphs
    var alreadyGotGraphs = false;
    document.getElementById("LengthBtn").addEventListener("click", ()=>{
      if (!alreadyGotGraphs) {
        renderGraphs();
        alreadyGotGraphs = true;
      }
      
    }, false);

    
    // spacers 

    type = 4;
    data = {type};
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  
    const polarOpposites = await fetch('/summarydata', options);
    const polarOppositesData = await polarOpposites.json();


    // spacers
    var spacerHtml = '<div id="ArchaeaSpacerLengthChart"></div>';
    spacerHtml = spacerHtml + '<div id="ArchaeaSpacerCountChart"></div>';
    spacerHtml = spacerHtml + '<div id="archaeaSpacerTable"><h3>Largest Average Length of Spacers in One Archaea CRISPR</h3><table class="pure-table pure-table-horizontal" id="archaeaSpacerLengthTable">'
      spacerHtml = spacerHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.A_S_avg_length.genome_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.A_S_avg_length.crispr_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.A_S_avg_length.organism_name + "</v><tr>"
      spacerHtml = spacerHtml + "<tr><th>Average Length Of Spacers</th><td>" + polarOppositesData.A_S_avg_length.size + "</td><tr>"
    spacerHtml = spacerHtml + '</table><h3>Largest Amount of Spacers in One Archaea CRISPR</h3><table class="pure-table pure-table-horizontal" id="archaeaSpacerCountTable">'
      spacerHtml = spacerHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.A_S_count.genome_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.A_S_count.crispr_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.A_S_count.organism_name + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Spacer Count</th><td>" + polarOppositesData.A_S_count.size + "</td><tr>"
      spacerHtml = spacerHtml + '</table></div>';
    document.getElementById("ArchaeaSpacers").innerHTML = spacerHtml;


    spacerHtml = '<div id="BacteriaSpacerLengthChart"></div>';
    spacerHtml = spacerHtml + '<div id="BacteriaSpacerCountChart"></div>';
    spacerHtml = spacerHtml + '<div id="bacteriaSpacerTable"><h3>Largest Average Length of Spacers in One Bacteria CRISPR</h3><table class="pure-table pure-table-horizontal" id="bacteriaSpacerLengthTable">'
      spacerHtml = spacerHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.B_S_avg_length.genome_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.B_S_avg_length.crispr_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.B_S_avg_length.organism_name + "</v><tr>"
      spacerHtml = spacerHtml + "<tr><th>Average Length Of Spacers</th><td>" + polarOppositesData.B_S_avg_length.size + "</td><tr>"
    spacerHtml = spacerHtml + '</table><h3>Largest Amount of Spacers in One Bacteria CRISPR</h3><table class="pure-table pure-table-horizontal" id="bacteriaSpacerCountTable">'
      spacerHtml = spacerHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.B_S_count.genome_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.B_S_count.crispr_id + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.B_S_count.organism_name + "</td><tr>"
      spacerHtml = spacerHtml + "<tr><th>Spacer Count</th><td>" + polarOppositesData.B_S_count.size + "</td><tr>"
    spacerHtml = spacerHtml + '</table></div>';

    document.getElementById("BacteriaSpacers").innerHTML = spacerHtml;




    // repeats 
    var repeatHtml = '<div id="ArchaeaRepeatLengthChart"></div>';
    repeatHtml = repeatHtml + '<div id="ArchaeaRepeatCountChart"></div>';
    repeatHtml = repeatHtml + '<div id="archaeaRepeatTable"><h3>Largest Average Length of Repeats in One Archaea CRISPR</h3><table class="pure-table pure-table-horizontal" id="archaeaRepeatLengthTable">'
      repeatHtml = repeatHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.A_R_avg_length.genome_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.A_R_avg_length.crispr_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.A_R_avg_length.organism_name + "</v><tr>"
      repeatHtml = repeatHtml + "<tr><th>Average Length Of Repeats</th><td>" + polarOppositesData.A_R_avg_length.size + "</td><tr>"
    repeatHtml = repeatHtml + '</table><h3>Largest Amount of Repeats in One Archaea CRISPR</h3><table class="pure-table pure-table-horizontal" id="archaeaRepeatCountTable">'
      repeatHtml = repeatHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.A_R_count.genome_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.A_R_count.crispr_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.A_R_count.organism_name + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Repeat Count</th><td>" + polarOppositesData.A_R_count.size + "</td><tr>"
      repeatHtml = repeatHtml + '</table></div>';
    document.getElementById("ArchaeaRepeats").innerHTML = repeatHtml;

    repeatHtml = '<div id="BacteriaRepeatLengthChart"></div>';
    repeatHtml = repeatHtml + '<div id="BacteriaRepeatCountChart"></div>';
    repeatHtml = repeatHtml + '<div id="bacteriaRepeatTable"><h3>Largest Average Length of Repeats in One Bacteria CRISPR</h3><table class="pure-table pure-table-horizontal" id="bacteriaRepeatLengthTable">'
      repeatHtml = repeatHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.B_R_avg_length.genome_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.B_R_avg_length.crispr_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.B_R_avg_length.organism_name + "</v><tr>"
      repeatHtml = repeatHtml + "<tr><th>Average Length Of Repeats</th><td>" + polarOppositesData.B_R_avg_length.size + "</td><tr>"
    repeatHtml = repeatHtml + '</table><h3>Largest Amount of Repeats in One Bacteria CRISPR</h3><table class="pure-table pure-table-horizontal" id="bacteriaRepeatCountTable">'
      repeatHtml = repeatHtml + "<tr><th>Genome Id</th><td>" + polarOppositesData.B_R_count.genome_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>CRISPR Id</th><td>" + polarOppositesData.B_R_count.crispr_id + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Organism Name</th><td>" + polarOppositesData.B_R_count.organism_name + "</td><tr>"
      repeatHtml = repeatHtml + "<tr><th>Repeat Count</th><td>" + polarOppositesData.B_R_count.size + "</td><tr>"
    repeatHtml = repeatHtml + '</table></div>';
    document.getElementById("BacteriaRepeats").innerHTML = repeatHtml;


    var alreadyArchaeaSpacers = false;
    document.getElementById("ArchaeaSpacersBtn").addEventListener("click", ()=>{
      if (!alreadyArchaeaSpacers) {
        renderRepeatAndSpacerGraphs("Archaea", "Spacer");
        alreadyArchaeaSpacers = true;
      } else {
        console.log("already loaded archaea spacers");
      }
    }, false);

    var alreadyBacteriaSpacers = false;
    document.getElementById("BacteriaSpacersBtn").addEventListener("click", ()=>{
      if (!alreadyBacteriaSpacers) {
        renderRepeatAndSpacerGraphs("Bacteria", "Spacer");
        alreadyBacteriaSpacers = true;
      } else {
        console.log("already loaded bacteria spacers");
      }
    }, false);

    var alreadyArchaeaRepeats = false;
    document.getElementById("ArchaeaRepeatsBtn").addEventListener("click", ()=>{
      if (!alreadyArchaeaRepeats) {
        renderRepeatAndSpacerGraphs("Archaea", "Repeat");
        alreadyArchaeaRepeats = true;
      } else {
        console.log("already loaded archaea repeats");
      }
    }, false);

    var alreadyBacteriaRepeats = false;
    document.getElementById("BacteriaRepeatsBtn").addEventListener("click", ()=>{
      if (!alreadyBacteriaRepeats) {
        renderRepeatAndSpacerGraphs("Bacteria", "Repeat");
        alreadyBacteriaRepeats = true;
      } else {
        console.log("already loaded bacteria Repeats");
      }
    }, false);
    
}



async function renderRepeatAndSpacerGraphs(reqDomain, reqType) {
  var type = 3;
  var domain = reqDomain;
  var data = {type, domain};
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  
  const summaryLast2Reponse = await fetch('/summarydata', options);
  const summaryLast2Data = await summaryLast2Reponse.json();
  

  var count = [];
  var length = [];
  count.push(["Occurrences"]);
  length.push(["Lengths"]);

  for (var i = 0; i < summaryLast2Data.length; i++) {
    if (reqType == "Spacers") {
      count.push([summaryLast2Data[i].spacer_count]);
      length.push([summaryLast2Data[i].spacer_length]);
    } else {
      count.push([summaryLast2Data[i].repeat_count]);
      length.push([summaryLast2Data[i].repeat_length]);
    }
  }
  console.log(count, length);
  // createHistogram(archaeaCreationArr, "ArchaeaLengthChart", "Archaea Genome Length Distribution", "Number of Genomes", "Genome Length");
  createHistogram(count, reqDomain + reqType + "CountChart", reqDomain + " " + reqType + " Occurrence Distribution", "Number of CRISPRs", reqType + " Occurrence Count");
  createHistogram(length, reqDomain + reqType + "LengthChart", reqDomain + " " + reqType + " Average Length Distribution", "Number of CRISPRs", reqType + " Average Length");
}

function createHistogram(creationArr, documentId, title, yTitle, xTitle) {

  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(creationArr);

    var options = {
      title: title,
      legend: { position: 'none' },
      vAxis: { title: xTitle , format: '#' },
      hAxis: { title: yTitle, format: 'short' },
      width: 1296,
      height: 200
    };

    var chart = new google.visualization.Histogram(document.getElementById(documentId));
    chart.draw(data, options);
  }
}

async function renderGraphs () {
  var type = 2;
  var domain = "Archaea"
  var data = {type, domain};
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const archaeaResponse = await fetch('/summarydata', options);
  const archaeaData = await archaeaResponse.json();

  type = 2;
  domain = "Bacteria"
  data = {type, domain};
  options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const bacteriaResponse = await fetch('/summarydata', options);
  const bacteriaData = await bacteriaResponse.json();

  var archaeaCreationArr = [];
  archaeaCreationArr.push(["Lengths"]);
  for (var i = 0; i < archaeaData.data.length; i++) {
    archaeaCreationArr.push([archaeaData.data[i].genome_length]);
  }
  var bacteriaCreationArr = [];
  bacteriaCreationArr.push(["Lengths"]);
  for (var i = 0; i < bacteriaData.data.length; i++) {
    bacteriaCreationArr.push([bacteriaData.data[i].genome_length]);
  }

  console.log(archaeaCreationArr, bacteriaCreationArr);
  createHistogram(archaeaCreationArr, "ArchaeaLengthChart", "Archaea Genome Length Distribution", "Number of Genomes", "Genome Length");
  createHistogram(bacteriaCreationArr, "BacteriaLengthChart", "Bacteria Genome Length Distribution", "", "Genome Length");
}