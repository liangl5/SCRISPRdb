
const ipAddress = '10.34.229.125:8080'


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var genome_id = urlParams.get('genome_id');
var crispr_id = urlParams.get('crispr_id');
var organism_name = urlParams.get('organism_name');
var display = urlParams.get('display');
var file = urlParams.get('file');
  
// initialization
document.getElementsByClassName('tablinks')[1].click()
fillBlastTable();
document.getElementById("name").innerText = organism_name + " - CRISPR " + crispr_id;

document.getElementById("back").addEventListener("click", ()=>{
    window.location.href = "http://" + ipAddress + "/individualcrispr.html?genome_id=" + genome_id + "&crispr_id=" + crispr_id + "&organism_name=" + organism_name.split(" ").join("%20") + "&display=" + display;
}, false);





// should rewrite this, way too complicated and messy
async function fillBlastTable() {
    var tableHtml = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var lines = xhttp.responseText.split("\n");
        var printList = false;
        var printEach = false;
        var targetCounter = 1;
        for (var j = 0; j < lines.length; j++) {
           if (lines[j].startsWith("Query=")) {
                tableHtml = tableHtml + "<h3>Query for " + lines[j].substr(lines[j].search("Query=") + 6) + "</h3>";
            }
            if (printEach && lines[j]!="") {
                
                if (lines[j].startsWith("Length=") && !lines[j-2].startsWith("Query")) {
                    tableHtml = tableHtml + "<p class=\"showsLength\">" + lines[j].replace("=", ": ") + "</p><br>"; // ending the header
                    
                } else if (lines[j].startsWith(" Score")) {
                    tableHtml = tableHtml + "<table class=\"pure-table\"><tr><th>Score</th><th>Expect</th><th>Identities</th><th>Gaps</th><th>Strands</th><tr>"
                    var splitArr = lines[j].split(", ");
                    var score = splitArr[0].split(" = ");
                    var expect = splitArr[1].split(" = ");

                    tableHtml = tableHtml + "<tr><td>" + score[1] + "</td><td>" + expect[1] + "</td>";
                } else if (lines[j].startsWith("Sbjct")) {
                    var splitArr = lines[j].split(" ");
                    var tmpTable = "";
                    for (var k = 0; k < splitArr.length; k++) {
                        if (splitArr[k] != "") {
                            if (splitArr[k] == "Sbjct") {
                                splitArr[k] = "Subject";
                            }
                            if (splitArr[k][0] == 'A' || splitArr[k][0] == 'T' || splitArr[k][0] == 'G' || splitArr[k][0] == 'C') {
                                tmpTable = tmpTable + "<td class=\"specialFont\">" + splitArr[k] + "</td>";
                            } else {
                                tmpTable = tmpTable + "<td>" + splitArr[k] + "</td>";
                            }
                        }
                    }
                    tableHtml = tableHtml + "<tr>" + tmpTable + "</tr></table><br><br>";
                } else if (lines[j].startsWith("Query ") || lines[j].start) {
                    var splitArr = lines[j].split(" ");
                    var tmpTable = "";
                    for (var k = 0; k < splitArr.length; k++) {
                        if (splitArr[k] != "") {
                            if (splitArr[k][0] == 'A' || splitArr[k][0] == 'T' || splitArr[k][0] == 'G' || splitArr[k][0] == 'C') {
                                tmpTable = tmpTable + "<td class=\"specialFont\">" + splitArr[k] + "</td>";
                            } else {
                                tmpTable = tmpTable + "<td>" + splitArr[k] + "</td>";
                            }
                        }
                    }
                    tableHtml = tableHtml + "<table class=\"pure-table pure-table-horizontal\"><tr>" + tmpTable + "</tr>";
                    var tmp = lines[j+1];
                    var dataStr = "";
                    var keepWriting = false;
                    for (var f = 0; f < tmp.length; f++) {
                        if (tmp[f] == "|") {
                            dataStr = dataStr + "|";
                            keepWriting = true;
                        } else if (keepWriting) {
                            dataStr = dataStr + "&nbsp";
                        }
                    }
                    tableHtml = tableHtml + "<tr><td></td><td></td><td class=\"specialFont\">" + dataStr + "</td><td></td></tr>"
                } else if (lines[j].startsWith(" Strand")) {
                    var splitArr = lines[j].split("=");
                    tableHtml = tableHtml + "<td>" + splitArr[1] + "</td></tr></table><br>"
                } else if (lines[j].startsWith(" Identities")) {
                    var splitArr = lines[j].split(", ");
                    var identities = splitArr[0].split(" = ");
                    var gaps = splitArr[1].split(" = ");

                    tableHtml = tableHtml + "<td>" + identities[1] + "</td><td>" + gaps[1] + "</td>";
                }
            }
            if (lines[j].startsWith("Sequences producing")) {
                j++ // skip the empty space
                printList = true;
                printEach = false;
                tableHtml = tableHtml + "<table class=\"pure-table pure-table-horizontal\"><tr><th>RefSeq Accession</th><th>Description</th><th>Score (Bits)</th><th>E Value</th<</tr>"
                targetCounter = 1;
            } else if (printList) {
                if (lines[j] == "") {
                    printList = false;
                    tableHtml = tableHtml + "</table><br>"
                } else {
                    var count = 1;
                    var refSeq = ""; // 1
                    var description = ""; // 2
                    var score = ""; // 3
                    var evalue = ""; // 4
                    var myArr = lines[j].split("  ");
                    for (var i = 0; i < myArr.length; i++) {
                        if (myArr[i] != "") {
                            switch (count) {
                                case 1:
                                    refSeq = myArr[i];
                                    break;
                                case 2:
                                    description = myArr[i];
                                    break;
                                case 3:
                                    score = myArr[i];
                                    break;
                                case 4:
                                    evalue = myArr[i];
                                    break;
                            }
                            count++;
                        }
                    }
                    tableHtml = tableHtml + "<tr><td>" + refSeq + "</td><td>"  + description + "</td><td>"  + score + "</td><td>"  + evalue + "</td></tr>";
                }
            } else if (!printList && lines[j].startsWith(">")) {
                tableHtml = tableHtml + "<h4>Target " + targetCounter + " - " + lines[j].substr(1) + "</h4>";
                printEach = true;
                targetCounter++;
            } else if (lines[j] == "***** No hits found *****") {
                tableHtml = tableHtml + "<p>No Hits Found<p>";
            }
            //console.log(lines[j], printEach);
        }

        document.getElementById("tableArea").innerHTML = tableHtml;
    }
    };
    xhttp.open("GET", "http://" + ipAddress + file, true);
    xhttp.send();
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