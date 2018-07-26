// D3 Scatterplot Assignment

// Follow your written instructions and create a scatter plot with D3.js.
// d3.csv("../../../data/data.csv", function (error, povData) {
//alert("Hi!")
d3.select(window).on("resize", handleResize);
// id,state,abbr,poverty,healthcare,obesity,medianAge
// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}

function loadChart() {
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

//Initial params. Set the default Y-axis.
var defaultYAxis = "obesity"

// function used for updating y-scale var upon click on axis label
function yScale(povData, defaultYAxis) {
//   // create scales

  var yLinearScale = d3.scaleLinear()
  //.domain([0, d3.max(povData, d => d.healthcare)])
  .domain([0, d3.max(povData, d => d[defaultYAxis])])
  .range([chartHeight, 0])

  return yLinearScale

};

// function used for updating xAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale)

  yAxis.transition()
    .duration(1000)
    .call(leftAxis)

  return yAxis
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, defaultYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[defaultYAxis]))

  return circlesGroup
};

function updateToolTip(defaultYAxis, circlesGroup) {

  if (defaultYAxis == "obesity") {
    var label = "Obesity: "
  } else {
    var label = "Lacks Healthcare: "
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      //need change NA
      return (`${d.state}<br>Poverty: ${d.poverty}% <br>{label} <br>Obesity: ${d.obesity}%`  );
    });

    chartGroup.call(toolTip);

  // circlesGroup.on("mouseover", function (data) {
  //     toolTip.show(data);
  //   })
  //   // onmouseout event
  //   .on("mouseout", function (data, index) {
  //     toolTip.hide(data);
  //   });

  return circlesGroup
}

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
    data.obesity = +data.obesity;
    //povData.state = povData.state;
  });

  console.log("Poverty:" + povData.poverty)
  console.log("Healthcare: " + povData.healthcare)
  console.log("Obesity: " + povData.obesity)

   // Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povData, d => d.poverty)]) //20
    .range([0, chartWidth]);

  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(povData, d => d.healthcare)])
  //   .range([chartHeight, 0]);

  //The above is the original with just poverty and healthcare. 
  //If there are two y-axes, we want the scale to be max based on that.
  function findMinAndMaxY(dataColumnY) {
    yMin = d3.min(povData, function (d) { return d[dataColumnY] * 0.8 });
    yMax = d3.max(povData, function (d) { return d[dataColumnY] * 1.2 });
};

// call the findMinAndMax() on the default X Axis
// findMinAndMaxX(defaultAxisLabelX)
findMinAndMaxY(defaultYAxis);
console.log("yMin:" + yMin);
   // set the domain of the axes
  //  xScale.domain([xMin, xMax]);

  // var yLinearScale = d3.scaleLinear()
  // .domain([yMin, yMax])
  // .range([chartHeight, 0]);

  var yLinearScale = yScale(povData, defaultYAxis)

   // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================

  // append x axis //GO BACK
  var yAxis = chartGroup.append("g")
    //.classed("x-axis", true) //NA
    .attr("transform", `translate(${chartHeight}, 0)`)
    .call(leftAxis)


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

  //append inital circles
  var circlesGroup = chartGroup.append("svg:g")
  circlesGroup.selectAll("circle") //dot
      .data(povData)
      .enter()
      .append("circle")
      .attr("fill", "lightblue")
      //.attr("cx", 50  )
      .attr("cx", function (d,i) { return xLinearScale(d.poverty); } ) //* 20
      //.attr("cx", function (d,i) { return xScale(d.poverty); } )
      .attr("cy", function (d) { return yLinearScale(d[defaultYAxis]); } )
      // .attr("cy", function (d) { return yLinearScale(d.healthcare); } )
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
  .attr("y", function (d) { return yLinearScale(d[defaultYAxis] - .2); } )
  // .attr("y", function (d) { return yLinearScale(d.healthcare - .2); } ) //- .3
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
//===============================================================
//Original y 
  //  chartGroup.append("text")
  //  .attr("transform", "rotate(-90)")
  //  .attr("y", 0 - margin.left) //+40  + 40
  //  .attr("x", 0 - (chartHeight / 2))
  //  .attr("dy", "1em")
  //  .attr("class", "axisText")
  //  .text("Lacks Healthcare (%)");



// Create group for  2 y- axis labels
var labelsGroup =  chartGroup.append("g")
.attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left) //+40  + 40
   .attr("x", 0 - (chartHeight / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
//.attr("transform", `translate(${width/2}, ${height + 20})`)

  var obesityLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "obesity") //value to grab for event listener
  .classed("active", true)
  .text("Obese (%)");
  
  var healthcareLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "healthcare") //value to grab for event listener
  .classed("inactive", true)
  .text("Lacks Healthcare (%)");

  //append x axis
 chartGroup.append("text")
   .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 30})`)
   .attr("class", "axisText")
   .text("In Poverty (%)");

//Custom functions depending on which Y axis is clicked on.
//=============================================

 // updateToolTip function above csv import
 var circlesGroup = updateToolTip(defaultYAxis, circlesGroup)

   // y axis labels event listener
 labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value")
      if (value != defaultYAxis) {

        // replaces defaultYAxis with value
        defaultYAxis = value;

        // console.log(defaultYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(povData, defaultYAxis);

        // updates y axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, defaultYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(defaultYAxis, circlesGroup);

        // changes classes to change bold text
        // if (defaultYAxis == "healthcare") {
        //   healthcareLabel
        //     .classed("active", true)
        //     .classed("inactive", false)
        //     obesityLabel
        //     .classed("active", false)
        //     .classed("inactive", true)
        // } else {
        //   healthcareLabel
        //     .classed("active", false)
        //     .classed("inactive", true)
        //     obesityLabel
        //     .classed("active", true)
        //     .classed("inactive", false)
        // };


    if (defaultYAxis == "obesity") {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true)
        obesityLabel
        .classed("active", true)
        .classed("inactive", false)
    } else {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false)
        obesityLabel
        .classed("active", false)
        .classed("inactive", true)
    };
  };
});


  
});  //end of d3.csv

} //end of loadChart. 
