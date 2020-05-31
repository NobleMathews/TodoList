var alltasks = new Array();
var rem = new Array();

var ListItem = React.createClass({ displayName: "ListItem",
  getInitialState: function () {
    return { name: this.props.value.name, checked: this.props.value.checked};
  },

  render: function () {
    return (
      React.createElement("tr", null,
      React.createElement("td", {style: {width:"60vw"}},React.createElement("span",{className:this.state.checked? 'strikethrough': ''},React.createElement("input", {style: {width:"60vw",border:"none"}, type: "text", name: "name",autoComplete:"false",readOnly:this.state.checked? 'readonly':'',value: this.state.name, onChange: this.handleChange, placeholder: "New Task Here ...." })) ),
      React.createElement("td", { className: "checkTd" }, React.createElement("div", { className: "flexcenter" }, React.createElement("input", { type: "checkbox", name: "checked", id: "c" + this.props.value.id, checked: this.state.checked, onChange: this.handleChange }), React.createElement("label", { htmlFor: "c" + this.props.value.id }, React.createElement("span", null))))
      ));


  },
  handleChange: function (event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if(parseInt(target.id.slice(1))==0){
      document.getElementById("sike").className += "fino";
    }
    if(target.type=='checkbox'){
      // var parsed=parseInt(target.id.slice(1))
      var parsed=this.props.value.id;
      // console.log("------");
      //
      var sub=0;
      rem.forEach((item, i) => {
        if(item<parsed){
        sub++;
        }
      });
      parsed=parsed-sub;
      console.log(parsed);
      if(parsed<0)
      parsed=0;
      alltasks[parsed]=value;
    }

    this.setState({
      [name]: value },
      this.props.updateGlobalTotal());
    // console.log(alltasks);

  },

  componentDidMount: function () {
    alltasks.push(false);

    this.props.updateGlobalTotal();
  },
   });



var Table = React.createClass({ displayName: "Table",
  getInitialState: function () {
    return { totale: 0,totals:0, checked: false };
  },
  render: function () {
    return (
      React.createElement("div", null,
      React.createElement("table", null,
      React.createElement("tr", null,
      React.createElement("th", {style:{textAlign:"left",paddingLeft:"7px"}}, "Task"),
      React.createElement("th", {className: "checkTh" },"Mark as done"),

      ),


      this.props.items.map((q) =>
      React.createElement(ListItem, { key: q.id, value: q, updateGlobalTotal: this.updateGlobalTotal })),

      React.createElement("tr", { className: "totalTr" },
      React.createElement("td", { className: "totalText" }, "Awesomness Score :  "+this.state.totale),
      React.createElement("td", { className: "totalTR" }, "Tasks Remaining :  "+ (alltasks.length-status))
      ))));




  },

  updateGlobalTotal: function () {
    var total = 0;
    status=0;
    for (var i = 0; i < alltasks.length; i++) {
      {
        if(alltasks[i]){total++;}
      }
    }
    status=total;
    // console.log(alltasks);
    this.setState({ totale: total+rem.length });
  } });



var AddNewRow = React.createClass({ displayName: "AddNewRow",
  render: function () {
    return (
      React.createElement("div", null,
      React.createElement("button", {className: "btn btn-dark", onClick: this.props.onClick,style:{fontWeight: "bold"}}, "Add Task"),
    ));
  } });

  var RemoveRow = React.createClass({ displayName: "AddNewRow",
    render: function () {
      return (
        React.createElement("div", null,
        React.createElement("button", {className: "btn btn-outline-danger", onClick: this.props.onClick,style:{fontWeight: "bold"}}, "Delete Finished"),
      ));
    } });
var Initiator = React.createClass({ displayName: "Initiator",
  getInitialState: function () {
    return {
      counter: this.props.len, lists: this.props.initialtask};

  },

  render: function () {
    return (
      React.createElement("div", { className: "container" },
      React.createElement(Table, { items: this.state.lists, ids: this.state.counter }),
      React.createElement(AddNewRow, { onClick: this.addRow }),
React.createElement(RemoveRow, { onClick: this.delRow })
         ));


  },

  addRow: function () {
    this.setState({ counter: this.state.counter + 1 });
    var listItem = { id: this.state.counter,name:this.state.name,checked:this.state.checked};
    var allItem = this.state.lists.concat([listItem]);
    this.setState({ lists: allItem });
  },
  delRow : function () {
      var allItem = this.state.lists;
      for (var i = allItem.length-1; i >= 0; i--)
      {
          if(alltasks[i]){
            status--;
            rem.push(allItem[i].id);
            allItem.splice(i, 1);
            alltasks.splice(i,1)
          }
      }
      this.setState({ lists: allItem });
    }
});



var initialtask = [{ "id": 0, "name": "Finish One Punch Mans training routine","checked": false }];
ReactDOM.render(
React.createElement(Initiator, { initialtask: initialtask, len: initialtask.length }),
document.getElementById('root'));
