// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
// d3.csv("../../../data/data.csv", function (error, povData) {
// data
alert("Hi!")
//var dataArray = [1, 2, 3];
//var dataCategories = ["one", "two", "three"];

// svg container
var svgHeight = 960; //400 960 1024
var svgWidth = 768; //500 768

// margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60, //80
  left: 50 //100
  // top: 50,
  // right: 50,
  // bottom: 50,
  // left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .attr("chartWidth", svgWidth)
  .attr("chartHeight", svgHeight);

// shift everything over by the margins. Append an SVG group.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log("Inside app.js")

//Append a div to the body to create tooltips, assign it to a class
//d3.select(".chart").append("div").attr("class", "tooltip").style("opacity",0);

//Initial params
//var chosenXAxis = "poverty"

// function used for updating x-scale var upon click on axis label
// function xScale(povData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(povData, d => d[chosenXAxis]) * 0.8,
//       d3.max(povData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width])

//   return xLinearScale

// };

// d3.csv("../../data/data.csv", function(error, povData) {
  // Temporarily putting the file in the same directory because of 404 file not found error - not in SourceBufferList.
d3.csv("./assets/data/data.csv", function(error, povData) {
  // Log an error if one exists
  if (error) return console.warn(error);

  // Print the tvData
  console.log(povData);

  // Parse Data/Cast as numbers. Cast the hours value to a number for each piece of tvData
  povData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    //povData.state = povData.state;
  });

  console.log("Poverty:" + povData.poverty)
  console.log("Healthcare: " + povData.healthcare)

   // Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povData, d => d.poverty)]) //20
    .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povData, d => d.healthcare)])
    .range([chartHeight, 0]);

   // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles
  // ==============================
  // var circlesGroup = chartGroup.selectAll("circle")
  // .data(povData)
  // .enter()
  // .append("circle")
  // .attr("cx", d => xLinearScale(d.poverty))
  // .attr("cy", d => yLinearScale(d.healthcare))
  // .attr("r", "15")
  // .attr("fill", "lightblue") //pink
  // .attr("opacity", ".5")

  var circlesGroup = chartGroup.append("svg:g")
  circlesGroup.selectAll("circle") //dot
      .data(povData)
      .enter()
      .append("circle")
      .attr("fill", "lightblue")
      
      //.attr("cx", 50  )
      .attr("cx", function (d,i) { return xLinearScale(d.poverty); } ) //* 20
      //.attr("cx", function (d,i) { return xScale(d.poverty); } )
      .attr("cy", function (d) { return yLinearScale(d.healthcare); } )
      .attr("r", 15)
       // display tooltip on click
       .on("mouseenter", function(data) {
        toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

  circlesGroup.selectAll("text")
  .data(povData)
  .enter()
  .append("text")
  .text(function(d) {
    return d.abbr;
  })
  .style("text-anchor", "middle")
  .attr("x", function (d,i) { return xLinearScale(d.poverty); } ) // * 20 - 10 //-.1
  .attr("y", function (d) { return yLinearScale(d.healthcare - .2); } ) //- .3
  .attr("font-size", "15px")
  .attr("fill", "white");


// Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      //return (`${d.abbr}<br>Poverty: ${d.poverty}`);
      return (`${d.state}<br>Poverty: ${d.poverty}% <br>Obesity: ${d.obesity}%`  );
      //<br>Healthcare: ${d.healthcare}
    // .html(function (data) {
    //     var statename = data.state;
    //     var pov = +data.poverty;
    //     //return (`${d.abbr}<br>Poverty: ${d.poverty}`);
    //     console.log("Poverty:" + data.poverty)
    //     console.log("State:" + data.state)
    //     return (stateName + '<br> Poverty: ' + pov +'%'); 
        ////+ '% <br> Physically Active: ' + physAct +'%'
    });

     //Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  //==============================

  // circlesGroup.on("click", function (data) {
  //   toolTip.show(data);
  // })
  // // onmouseout event
  // .on("mouseout", function (data, index) {
  //   toolTip.hide(data);
  // });
  //chartGroup

   // Create axes labels
   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left) //+40  + 40
   .attr("x", 0 - (chartHeight / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Lacks Healthcare");

 chartGroup.append("text")
   .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 30})`)
   .attr("class", "axisText")
   .text("In Poverty");

});
//end of d3.csv