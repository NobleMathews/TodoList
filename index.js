// let myLabels = document.querySelectorAll('.lbl-toggle');

// Array.from(myLabels).forEach(label => {
//   label.addEventListener('keydown', e => {
//     // 32 === spacebar
//     // 13 === enter
//     if (e.which === 32 || e.which === 13) {
//       e.preventDefault();
//       label.click();
//     };
//   });
// });

async function app() {
  // Load the model.
  // model =  await tf.loadModel('D:\Repositories\InfodemicPeriod\tfjsv3\model.json');
  const model = await tf.loadLayersModel('model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  // const imgEl = document.getElementById('img');
  const stringy="do you want free real estate ?";
  const prediction = model.predict(["you suck"]);
  console.log(prediction);
}

app();

var ctx = document.getElementById('ch1').getContext('2d');


data = {
    datasets: [{
        data: [10, 20],
        backgroundColor : [
            "red", "blue"
          ],
          borderColor : [
            "#111", "#111"
          ],
          borderWidth : 3
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Red',
        'Blue'
    ]
};
ctx.canvas.width = 200;
ctx.canvas.height = 200;
var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    // options: options
});