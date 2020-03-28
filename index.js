var getter = new function () {
  
    var url ="https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise"  
    const proxyurl = "https://sheltered-tundra-26605.herokuapp.com/";

    this.ajaxxer = function () {
        this.header=[];
        $.ajax({
            url: proxyurl + url,
            dataType: "json",
            type:'GET',
            crossDomain:true,
            contentType:"application/json",
            success:function (data) {
                    // getter.header.push(element);
                    console.log(data);
                
              }
          });
        }  
}
getter.ajaxxer();
const { Map: LeafletMap, MapLayer, withLeaflet, TileLayer, Marker, Popup } = ReactLeaflet;

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
  "Service 1": true,
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

  const filteredBookings = bookings.filter(booking => state[booking.service]);
  const filteredSuppliers = suppliers.filter(
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