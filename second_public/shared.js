// drop down styling
var tmp = document.getElementsByClassName("dropdown-content")
  
  for (var i = 0; i < tmp.length; i++) {
    var x = document.getElementsByClassName("dropbtn")[i].getBoundingClientRect()
    tmp[i].style.top = x.bottom + "px";
}


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


prelimHtml = '<div id="lengthChartContainer" style="height: 370px; width: 100%;"></div>'
prelimHtml = prelimHtml + '<div id="lengthTables"></div>'
document.getElementById("Genome Lengths").innerHTML = prelimHtml;
getSummaryTab();


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