
function initialiseSelector() {

    // langpicker

    var sel = document.createElement('select');
    sel.name = 'langlist';
    sel.id = 'lang';
    sel.setAttribute("onchange", "updateLangTable();");

    var langs = transifex["languages"];

    var options_str = "";

    for(var l in langs){
        options_str += '<option value="' + l + '">' + langs[l] + '</option>';
    }
    sel.innerHTML = options_str;
    
    var divContainer = document.getElementById("locale-select");
    divContainer.innerHTML = '<label for="locale-select">Choose a locale:</label>';
    divContainer.appendChild(sel);



    // versionpicker
    var selv = document.createElement('select');
    selv.name = 'branchlist';
    selv.id = 'branch';
    selv.setAttribute("onchange", "updateLangTable();");

    var versions = transifex["versions"];

    var options_str = "";

     
    for (var v = versions.length - 1; v >= 0; v--) {
        options_str += '<option value="' + versions[v] + '">' + versions[v] + '</option>';
    }
    selv.innerHTML = options_str;
    
    var divContainer = document.getElementById("version-select");
    divContainer.innerHTML = '<label for="version-select">DHIS2 version</label>';
    divContainer.appendChild(selv);


    updateLangTable();
    updateLeaderboard();
}

function updateLangTable() {

//   var resources = {}


  var l = document.getElementById("lang").value;
  var b = document.getElementById("branch").value;

  var res = transifex["details"][b];
  var projmap = transifex["projects"];


  // CREATE DYNAMIC TABLE.
  var table = document.getElementById("locale-resources"); //document.createElement("table");
  table.innerHTML = ""

  // header
  // var tr = table.insertRow(-1);                   // TABLE ROW.
  // var header = ['Project', '% Completed', 'Resources']
  // for (var i = 0; i < header.length; i++) {
  //     var th = document.createElement("th");      // TABLE HEADER.
  //     th.innerHTML = header[i];
  //     tr.appendChild(th);
  // }

  var tr = table.insertRow(-1); // TABLE ROW.

  var current = "";
  var last = "";
  for (const [proj, files] of Object.entries(res).sort()) {
    current = proj;
    for (const [file, lang] of Object.entries(files)) {


      // var tabCell = tr.insertCell(-1);
      // console.log(current, last);
      // if (current == last) {
      //   tabCell.innerHTML = "";
      // } else {
      //   tabCell.innerHTML = proj;
      // }


      if (current != last) {
        tr = table.insertRow(-1);
        tr.className = "tl-heading";
        var tabCell = tr.insertCell(-1);
        tabCell.colSpan = "2";
        tabCell.innerHTML = proj;
      }

      tr = table.insertRow(-1);
      tr.className = "tl-item";
      var tabCell = tr.insertCell(-1);
      tabCell.className = "resource";
      var mylink =
        '<a href="https://www.transifex.com/hisp-uio/' +
        projmap[proj] +
        "/translate/#" +
        l +
        "/" +
        file +
        '">' +
        file +
        "</a>";
      console.log(mylink);
      tabCell.innerHTML = mylink;



      var tabCell = tr.insertCell(-1);
      tabCell.className = "completion";
      var perc = files[file][l];
      p = parseFloat(perc);
      var pbg = "percentage-upto-100";
      if (p < 25.0){
        pbg = "percentage-upto-25";
      }
      else if (p < 50.0){
        pbg = "percentage-upto-50";
      }
      else if (p < 75.0){
        pbg = "percentage-upto-75";
      }
      else if (p === 100.0){
        pbg = "percentage-100"
      }

      tabCell.innerHTML =
        '<div class="percentage-track"><div class="percentage '+pbg+'" style="width:' + perc + ';">' + perc + "</div></div>";



      last = proj;
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  // var divContainer = document.getElementById("translationLinks");
  // divContainer.innerHTML = "";
  // divContainer.appendChild(table);
}

function updateLeaderboard() {

    var res = transifex["overview"]; 
    var langs = transifex["languages"];
    var versions = transifex["versions"];

    var table = document.createElement("table");
    table.className = "lb";

    // header
    var tr = table.insertRow(-1);                   // TABLE ROW.
    identity = (x) => x;
    var leaderH = versions.map(identity);
    leaderH.push("Language");
    console.log(leaderH);
    for(var i = leaderH.length - 1; i >= 2; i--) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = leaderH[i];
        tr.appendChild(th);
    }


    for(var l in langs){
        if (l != "en" & l != "uz") {
        var tr = table.insertRow(-1);
        var tabCellH = tr.insertCell(-1);
        tabCellH.innerHTML = langs[l];
        tabCellH.className = "resource";

        for (var v = versions.length - 1; v >= 2; v--) {
            var tabCell = tr.insertCell(-1);
            tabCell.className = "completion";
            // tabCell.addEventListener("click", covPerLanguage());
            tabCell.setAttribute("onclick", "covPerLanguageSelect('"+l+"','"+leaderH[v]+"');");
            console.log(v,l);
            var perc = 100*res[versions[v]][l]/res[versions[v]]['en'];
            p = parseFloat(perc);
            var pbg = "percentage-upto-100";
            if (p < 25.0){
              pbg = "percentage-upto-25";
            }
            else if (p < 50.0){
              pbg = "percentage-upto-50";
            }
            else if (p < 75.0){
              pbg = "percentage-upto-75";
            }
            else if (p === 100.0){
              pbg = "percentage-100"
            }
            tabCell.innerHTML =  '<div class="percentage-track"><div class="percentage '+pbg+'" style="width:' + perc.toFixed(1) + '%;">' + perc.toFixed(2) + "%</div></div>";
            //'<div class="progress" style="width:' + perc + '%;">' + perc.toFixed(1) + "%</div>";
        }
      }
    }

  
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("leaderBoard");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);


}

function langOverview() {
  var LO = document.getElementById("LO");
  var CPL = document.getElementById("CPL");

  LO.className = "mode mode-selected";
  CPL.className = "mode";

  var cplTable = document.getElementById("cplTable");
  var leaderBoard = document.getElementById("leaderBoard");
  cplTable.style.display = "none";
  leaderBoard.style.display = "block";

}

function covPerLanguageSelect(lang,ver) {
  console.log("hellophil")
  var l = document.getElementById("lang");
  var b = document.getElementById("branch");

  l.value = lang;
  b.value = ver;
  covPerLanguage();
}

function covPerLanguage() {
  var LO = document.getElementById("LO");
  var CPL = document.getElementById("CPL");

  LO.className = "mode";
  CPL.className = "mode mode-selected";

  var cplTable = document.getElementById("cplTable");
  var leaderBoard = document.getElementById("leaderBoard");
  cplTable.style.display = "block";
  leaderBoard.style.display = "none";

}