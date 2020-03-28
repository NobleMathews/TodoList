const { Map: LeafletMap, MapLayer, withLeaflet, TileLayer, Marker, Popup } = ReactLeaflet;
var active=[];
var recover=[];
var dead=[];

var getter = new function () {


var url ="https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise"  
const proxyurl = "https://sheltered-tundra-26605.herokuapp.com/";

this.ajaxxer = function () {
  active=[];
  recover=[];
  dead=[];
  var latt,longt;
  $.ajax({
      url: proxyurl + url,
      dataType: "json",
      type:'GET',
      crossDomain:true,
      contentType:"application/json",
      success:function (data) {
              // getter.header.push(element);
              var stats=data.data.statewise;
              var arrayLength = stats.length;
              for (var i = 0; i < arrayLength; i++) {

                  [latt,longt]=getter.stater(stats[i].state);
                  var obj = {};
                  obj["id"] = i;
                  obj["latitude"] = latt;
                  obj["longitude"] = longt;
                  obj["service"]=stats[i].state;
                  for(var a=1;a<=stats[i].active;a++){
                    active.push(obj);
                  }
                  for(var d=1;d<=stats[i].deaths;d++){
                    dead.push(obj);
                  }
                  for(var r=1;r<=stats[i].recovered;r++){
                    recover.push(obj);
                  }
              }
              // console.log(active,recover,dead);
          
        }
    });
    class ClusterGroup extends MapLayer {
      createLeafletElement({ children, leaflet: { map }, ...props }) {
        const clusterProps = {};
        const clusterEvents = {};
    
        // Splitting props and events to different objects
        Object.entries(props).forEach(
        ([propName, prop]) => propName.startsWith('on') ?
        clusterEvents[propName] = prop :
        clusterProps[propName] = prop);
    
    
        // Creating markerClusterGroup Leaflet element
        const markerClusterGroup = new L.markerClusterGroup(clusterProps);
        this.contextValue = { layerContainer: markerClusterGroup, map };
    
        // Initializing event listeners
        Object.entries(clusterEvents).forEach(
        ([eventAsProp, callback]) => {
          const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
          markerClusterGroup.on(clusterEvent, callback);
        });
    
        return markerClusterGroup;
      }}
    
    
    const MarkerClusterGroup = withLeaflet(ClusterGroup);
    
    
    const createClusterCustomIcon = function (cluster) {
      const reducer = (total, current) =>
      current.options.alt === "supplier" ? total + 1 : total;
      const supplier = cluster.getAllChildMarkers().reduce(reducer, 0);
      const total = cluster.getChildCount();
      let supplierPercent = Math.ceil(supplier / total * -100) + "s";
      if (supplierPercent === "-100s") supplierPercent = "-99.99s";
      let iconSize;
      if (total < 10) {
        iconSize = 15;
      } else if (total < 100) {
        iconSize = 20;
      } else {
        iconSize = 30;
      }
      return L.divIcon({
        html: `<div title="Supplier: ${supplier}, Bookings: ${total -
        supplier}" class="marker_cluster" style="animation-delay: ${supplierPercent}"><span>${total}</span><div>`,
        className: "marker_cluster_wrapper",
        iconSize: L.point(iconSize, iconSize, true) });
    
    };
    
    const initialState = {
      "Kerala": true,
      "Service 2": true,
      "Service 3": true,
      "Service 4": true,
      "Service 5": true,
      "Service 6": true };
    
    function reducer(state, action) {
      return Object.assign({}, state, {
        [`Service ${action.type}`]: action.value });
    
    }
    let mapRef;
    function App() {
      const [state, dispatch] = React.useReducer(reducer, initialState);
      const indiaExtent = [
      [36.942157, 64.855667],
      [7.843725, 98.254375]];
    
      const filteredBookings = dead.filter(booking => state[booking.service]);
      const filteredSuppliers = active.filter(
      supplier => state[supplier.service]);
    
      return (
        React.createElement("div", { className: "panel" },
        React.createElement("div", { className: "panel__header" },
        React.createElement("h1", null, "COVID: India tracker"),
        React.createElement("p", null, "Visualise the current state of the pandemic")),
    
    
    
    
        React.createElement("div", { className: "panel__map" },
        React.createElement("button", {
          onClick: () =>
          mapRef.flyToBounds(indiaExtent, {
            paddingTopLeft: [200, 0] }),
    
    
          className: "full-extent" }),
    
        React.createElement("div", { className: "sidebar" },
        React.createElement("h3", null, "List of Services"),
        React.createElement("div", { className: "panel__data" },
        React.createElement("label", null,
        React.createElement("strong", null, "Service 1"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 1"],
          onChange: e => dispatch({ type: 1, value: e.target.checked }) }),
    
        React.createElement("span", null)),
    
        React.createElement("label", null,
        React.createElement("strong", null, "Service 2"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 2"],
          onChange: e => dispatch({ type: 2, value: e.target.checked }) }),
    
        React.createElement("span", null)),
    
        React.createElement("label", null,
        React.createElement("strong", null, "Service 3"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 3"],
          onChange: e => dispatch({ type: 3, value: e.target.checked }) }),
    
        React.createElement("span", null)),
    
        React.createElement("label", null,
        React.createElement("strong", null, "Service 4"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 4"],
          onChange: e => dispatch({ type: 4, value: e.target.checked }) }),
    
        React.createElement("span", null)),
    
        React.createElement("label", null,
        React.createElement("strong", null, "Service 5"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 5"],
          onChange: e => dispatch({ type: 5, value: e.target.checked }) }),
    
        React.createElement("span", null)),
    
        React.createElement("label", null,
        React.createElement("strong", null, "Service 6"),
        React.createElement("input", {
          type: "checkbox",
          checked: state["Service 6"],
          onChange: e => dispatch({ type: 6, value: e.target.checked }) }),
    
        React.createElement("span", null))),
    
    
        React.createElement("h3", null, "Legend"),
        React.createElement("div", { className: "panel__legend" },
        React.createElement("div", { className: "panel__legend__suppliers" },
        React.createElement("span", null), " Suppliers (", filteredSuppliers.length, ")"),
    
        // React.createElement("div", { className: "panel__legend__deceased" },
        // React.createElement("span", null), " Deceased (", filteredDeceased.length, ")"),
    
        React.createElement("div", { className: "panel__legend__bookings" },
        React.createElement("span", null), " Bookings (", filteredBookings.length, ")"))),
    
    
    
        React.createElement(LeafletMap, {
          style: { width: "100%", height: "100%" },
          zoom: 2,
          zoomControl: false,
          maxZoom: 14,
          center: [13.622920, 79.487370],
          whenReady: e => {
            mapRef = e.target;
            e.target.flyToBounds(indiaExtent, {
              paddingTopLeft: [140, 0] });
    
          }
         },
    
        React.createElement(TileLayer, {
          attribution: "Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
          url: "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png" }),
    
    
        React.createElement(MarkerClusterGroup, {
          showCoverageOnHover: false,
          iconCreateFunction: createClusterCustomIcon },
    
        filteredBookings.map(booking => {
          if (booking.longitude)
          return (
            React.createElement(Marker, {
              key: booking.id,
              alt: "booking",
              position: [booking.latitude, booking.longitude],
              icon: L.divIcon({
                html: ``,
                className: "marker marker_booking",
                iconSize: L.point(15, 15, true) }) },
    
    
            React.createElement(Popup, { className: "popup popup_booking" },
            React.createElement("div", { className: "popup__title" }, "Booking #", booking.id),
            React.createElement("div", { className: "popup__info" },
            React.createElement("strong", null, booking.service)))));
    
    
    
    
          return null;
        }),
        filteredSuppliers.map(supplier => {
          if (supplier.longitude)
          return (
            React.createElement(Marker, {
              key: `supplier-${supplier.id}`,
              alt: "supplier",
              position: [supplier.latitude, supplier.longitude],
              icon: L.divIcon({
                html: "",
                className: `marker marker_supplier`,
                iconSize: L.point(15, 15, true) }) },
    
    
            React.createElement(Popup, { className: "popup popup_supplier" },
            React.createElement("div", { className: "popup__title" }, "Supplier #",
            supplier.id),
    
            React.createElement("div", { className: "popup__info" },
            React.createElement("strong", null, supplier.service)))));
    
    
    
    
          return null;
        })))),
    
    
    ));
    
    
    
    
    
    
    
    }
    
    const rootElement = document.getElementById("root");
    ReactDOM.render(React.createElement(App, null), rootElement);

  }
this.stater=function(state){
switch(state){
  case "Kerala":
    return [10.850516,76.271080];
    break;
  case "Maharashtra":
    return [19.751480,75.713890];
    break;
  case "Karnataka":
    return [14.5203896,75.7223521];
    break;
  case "Telangana":
    return [17.8495919,79.1151663];
    break;
  case "Uttar Pradesh":
    return [27.1303344,80.859666];
    break;
  case "Rajasthan":
    return [26.8105777,73.7684549];
    break;
  case "Gujarat":
    return [22.41540825,72.03149704];
    break;
  case "Delhi":
    return [28.6273928,77.1716954];
    break;
  case "Punjab":
    return [30.9293211,75.5004841];
    break;
  case "Tamil Nadu":
    return [10.9094334,78.3665347];
    break;
  case "Haryana":
    return [29,76];
    break;
  case "Madhya Pradesh":
    return [23.8143419,77.5340719];
    break;
  case "Jammu and Kashmir":
    return [33.53155445,75.31096353];
    break;
  case "Ladakh":
    return [33.9456407,77.6568576];
    break;
  case "Andhra Pradesh":
    return [15.9240905,80.1863809];
    break;
  case "West Bengal":
    return [22.9964948,87.6855882];
    break;
  case "Bihar":
    return [25.6440845,85.906508];
    break;
  case "Chandigarh":
    return [30.72984395,76.78414567];
    break;
  case "Chhattisgarh":
    return [21.6637359,81.8406351];
    break;
  case "Uttarakhand":
    return [30.0417376,79.089691];
    break;
  case "Himachal Pradesh":
    return [31.9292352,77.1828462];
    break;
  case "Goa":
    return [15.3004543,74.0855134];
    break;
  case "Odisha":
    return [20.5431241,84.6897321];
    break;
  case "Andaman and Nicobar Islands":
    return [10.2188344,92.5771329];
    break;
  case "Puducherry":
    return [10.91564885,79.8069488];
    break;
  case "Manipur":
    return [24.7208818,93.9229386];
    break;
  case "Mizoram":
    return [23.2146169,92.8687612];
    break;
  case "Assam":
    return [26.4073841,93.2551303];
    break;
  case "Meghalaya":
    return [25.5379432,91.2999102];
    break;
  case "Tripura":
    return [23.7750823,91.7025091];
    break;
  case "Arunachal Pradesh":
    return [27.6891712,96.4597226];
    break;
  case "Jharkhand":
    return [23.4559809,85.2557301];
    break;
  case "Nagaland":
    return [26.1630556,94.5884911];
    break;
  case "Sikkim":
    return [27.601029,88.45413639];
    break;
  case "Dadra and Nagar Haveli":
    return [20.2735169,73.0043578];
    break;
  case "Daman and Diu":
    return [20.71817495,70.93238695];
    break;
  case "Lakshadweep":
    return [10.8832771,72.8171069];
    break;
  default:
    return [22.3511148,78.6677428];
    break;
}
} 
}
getter.ajaxxer();