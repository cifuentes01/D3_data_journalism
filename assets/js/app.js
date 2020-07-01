// // @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;
// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Select scatter, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    return xLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
}
// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));                               //--------d-->data

    return circlesGroup;
}
//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup,) {
    var label;  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    }
    
    else {
      label = "Age:";
    }
 

    var toolTip = d3.tip()
      .attr("class", "d3-tip")                                                 // ---------updated tooltip-->d3-tip
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
    }

// Load data from data.csv
d3.csv("./assets/data/data.csv").then(function(Data, err) {
    console.log(Data);
    if (err) throw err;
  
    // parse data
    Data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
//         console.log(data);
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(Data, chosenXAxis);
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d.healthcare)])
        .range([height, 0]);
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis
//     var xAxis = chartGroup.append("g")
//         .classed("x-axis", true)
// //         .attr("transform", `translate(0, ${height})`)
//         .attr("transform", `translate(0, 400)`)
//         .call(bottomAxis);

var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);


    // append y axis
    chartGroup.append("g")
        .call(leftAxis);
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "pink")
        .attr("opacity", ".5");
    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(Data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    // append y axis
    chartGroup.append("text")
//         .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
    //create group for y-axis labels
    // var yLabelsGroup = chartGroup.append("g")
    //     .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);
    // var healthcareLabel = yLabelsGroup.append("text")
    //     .classed("active", true)
    //     .attr("x", 0)
    //     .attr("y", 0 - 20)
    //     .attr("dy", "1em")
    //     .attr("transform", "rotate(-90)")
    //     .attr("value", "healthcare")
    //     .text("Lacks Healthcare (%)");


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
//                 console.log(chosenXAxis);
                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(Data, chosenXAxis);
                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                // updates textGroup with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis); 
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function(error) {
  console.log(error);
});
