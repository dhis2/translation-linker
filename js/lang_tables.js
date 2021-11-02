
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
    
    var divContainer = document.getElementById("langpicker");
    divContainer.innerHTML = "";
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
    
    var divContainer = document.getElementById("versionpicker");
    divContainer.innerHTML = "";
    divContainer.appendChild(selv);


    updateLangTable();
    updateLeaderboard();
}

function updateLangTable() {

//   var resources = {}


  var l = document.getElementById("lang").value;
  var b = document.getElementById("branch").value;

  var res = transifex["details"][b];

  console.log(res);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  var tr = table.insertRow(-1); // TABLE ROW.

  var current = "";
  var last = "";
  for (const [proj, files] of Object.entries(res)) {
    current = proj;
    for (const [file, lang] of Object.entries(files)) {
      tr = table.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      console.log(current, last);
      if (current == last) {
        tabCell.innerHTML = "";
      } else {
        tabCell.innerHTML = proj;
      }
      var tabCell = tr.insertCell(-1);
      var perc = files[file][l];
      tabCell.innerHTML =
        '<div class="progress" style="width:' + perc + ';">' + perc + "</div>";
      var tabCell = tr.insertCell(-1);
      var mylink =
        '<a href="https://www.transifex.com/hisp-uio/' +
        proj +
        "/translate/#" +
        l +
        "/" +
        file +
        '">' +
        file +
        "</a>";
      console.log(mylink);
      tabCell.innerHTML = mylink;
      last = proj;
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("translationLinks");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

function updateLeaderboard() {

    var res = transifex["overview"]; 
    var langs = transifex["languages"];
    var versions = transifex["versions"];

    var table = document.createElement("table");
    var tr = table.insertRow(-1); // TABLE ROW.

    for(var l in langs){
        tr = table.insertRow(-1);
        var tabCellH = tr.insertCell(-1);
        tabCellH.innerHTML = langs[l];

        for (var v = versions.length - 1; v >= 0; v--) {
            var tabCell = tr.insertCell(-1);
            console.log(v,l);
            var perc = 100*res[versions[v]][l]/res[versions[v]]['en'];
            tabCell.innerHTML =  '<div class="progress" style="width:' + perc + '%;">' + perc.toFixed(1) + "%</div>";
        }
    }

  
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("leaderBoard");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);


}