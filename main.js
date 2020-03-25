var questions = {
    question: "What is 2*5?",
    choices: [1, 2, 2,1,1],
    options:["step1","step2","step3","step4","step5"],
    maxMarks: 6
  }
  var table=$("#gtable");
  var selections = [];
    // Display initial question
    // displayNext();
    $('#submit').on('click', function (e) {
        e.preventDefault();
        
        // Suspend click listener during fade animation
        if(table.is(':animated')) {        
          return false;
        }

        if (selections.length<=1) {
            alert('Please make a selection!');
          } else {
            //when is dealing with current student over ??
            displayNext();
          }
        });

          // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    function displayNext() {
        table.fadeOut(function() {
          $('#question').remove();

        });
      }

var gradeSheet = new function () {
        // An array of JSON objects with values.
        this.header = [{ 'Marks': '', 'Comments': '', 'Check form': ''}]
        this.col = [];
        $.get('http://127.0.0.1:3000/ms',  // url
        function (data, textStatus, jqXHR) {  // success callback
          alert('status: ' + textStatus + ', data:' + data);
        });
        // const APIURL = "http://localhost:3000";
        // const getquestions = async () => {
        // const res = await fetch(`${APIURL}/ms`);
        // this.header=res.json();
        // this.createTable();
        // };
        // getquestions();
        
        this.createTable = function () {
            for (var i = 0; i < this.header.length; i++) {
                for (var key in this.header[i]) {
                    if (this.col.indexOf(key) === -1) {
                        this.col.push(key);
                    }
                }
            }

            // Create a table
            var table = document.createElement('table');
            table.setAttribute('id', 'mTable');

            var tr = table.insertRow(-1);

            for (var h = 0; h < this.col.length; h++) {
                // Add table header.
                var th = document.createElement('th');
                // if(typeof this.col[h]=="string")
                th.innerHTML = this.col[h].replace('_', ' ');
                tr.appendChild(th);            
                tr.setAttribute('style', 'background-color:#777;color:#fff;');
            }

            // Add new rows to the table using JSON data.
            for (var i = 1; i < this.header.length; i++) {
                tr = table.insertRow(-1); 

                for (var j = 0; j < this.col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = this.header[i][this.col[j]];
                    if(j==2){
                      if(String(this.header[i][this.col[j]])!="N.A."){
                        tabCell.innerHTML ='<input type="checkbox" value="yes" checked="true" id="isGraded3">'
                      }
                      else
                      tabCell.innerHTML ='<input type="checkbox" value="yes" id="isGraded3">'
                    }
                    
                }
            }
            console.log(this.header);

            tr = table.insertRow(-1);           // Create the last row.

            for (var j = 0; j < this.col.length; j++) {
                var newCell = tr.insertCell(-1);

                if (j >= 0) {
                    if (j == 1||j==0) {
                        var tBox = document.createElement('input');
                        tBox.setAttribute('type', 'text');
                        tBox.setAttribute('value', '');
                        newCell.appendChild(tBox);

                    }
                    else if (j == 2) {
                        // adding checkboxes to the last cell
                        var chk = document.createElement('input');

                        chk.setAttribute('type', 'checkbox');
                        chk.setAttribute('value', 'yes');
                        chk.setAttribute('id', 'isGraded' + i);

                        newCell.appendChild(chk);
                    }
                }
            }

            this.td = document.createElement('td');
            tr.appendChild(this.td);

            var btNew = document.createElement('input');

            btNew.setAttribute('type', 'button');
            btNew.setAttribute('value', 'Create');
            btNew.setAttribute('id', 'New' + i);
            btNew.setAttribute('onclick', 'gradeSheet.CreateNew(this)');
            this.td.appendChild(btNew);

            var div = document.getElementById('gtable');
            div.innerHTML = '';
            div.appendChild(table);    // Add the newly created table to the page.
        };

        // FUNCTION TO CREATE A NEW TABLE ROW.
        this.CreateNew = function (oButton) {
            var activeRow = oButton.parentNode.parentNode.rowIndex;
            var tab = document.getElementById('mTable').rows[activeRow];
            var obj = {};
            obj[this.col[0]] = '';

            // Add new values to header array.
            for (i = 1; i < this.col.length; i++) {

                var td = tab.getElementsByTagName("td")[i];
                if (td.childNodes[0].getAttribute('type') == 'text' || 
                    td.childNodes[0].getAttribute('type') == 'checkbox') {

                    var txtVal;
                    if (td.childNodes[0].getAttribute('type') == 'checkbox') {
                        // GET THE VALUE OF THE CHECKBOX.
                        if (td.childNodes[0].checked) txtVal = 'Yes';
                        else txtVal = 'N.A.';       
                    }
                    else {
                        if (td.childNodes[0].value !== '') {
                            txtVal = td.childNodes[0].value;
                        }
                        else {
                            txtVal = ' ';
                        }
                    }
                    if (txtVal != '') {
                        obj[this.col[i]] = txtVal.trim();
                    }
                }
            }
            // obj[this.col[0]] = this.header.length; // The new ID for Sr.No.

            if (Object.keys(obj).length > 0) {      
                this.header.push(obj);             // Add data to the JSON array.
                this.createTable();                 // Refresh the table.
            }
        }
    }

    gradeSheet.createTable();