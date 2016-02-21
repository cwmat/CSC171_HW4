(function(window, document) {
  'use strict';

  /* Generate Area Chart
   *    Create the d3 area chart.
   *
   *    return: undefined
   */
  function generateAreaChart(data) {
    // Local variables, scales, dimensions, axes, etc.

    // Margins
    var margin = {
      top: 20,
      right: 10,
      bottom: 20,
      left: 50
    };

    // Width and height for inner dimensions of chart area
    var width = 555 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Create SVG for chart
    var svg = d3.select("#area-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Date Scale (x-axis)
    var dateScaleX = d3.time.scale()
      .domain(d3.extent(data, function(d) {
        return d.date;
      }))
      .range([0, width]);

    // Population Scale (y-axis)
    var popScaleY = d3.scale.linear()
      .domain(d3.extent(data, function(d) {
        return d.population;
      }))
      .range([height, 0]);

    // Testing scales
    var format = d3.time.format("%Y-%m-%d");
    console.log(dateScaleX(format.parse("2011-01-01")));
    console.log(popScaleY(57250));

    var xAxis = d3.svg.axis()
      .scale(dateScaleX)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(popScaleY)
      .orient("left");

    // Area function for filling area under path
    var area = d3.svg.area()
      .x(function(d) {
        return dateScaleX(d.date);
      })
      .y0(height)
      .y1(function(d) {
        return popScaleY(d.population);
      });

    // Line function
    var line = d3.svg.line()
      .x(function(d) {
        return dateScaleX(d.date);
      })
      .y(function(d) {
        return popScaleY(d.population);
      });

    // Build chart
    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    svg.append("path")
      .attr("class", "line")
      .attr("d", line(data));

    // Add axiis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");



    // End generate
  }

  /* Generate Bar Chart
   *    Create the d3 bar chart.
   *
   *    return: undefined
   */
  function generateBarChart(data) {
    return undefined;
  }




  /* Convert Field to Integer
   *    Convert all values of an input datasets specified field to integer.
   *
   *    return: undefined
   */
  function convertFieldToInt(data, field) {
    data.forEach(function(item) {
      item[field] = Number(item[field]);
    });
  }

  /* Convert Field to Date
   *    Convert all values of an input datasets specified field to date assuming a y-m-day format, ex. 2013-01-14.
   *
   *    return: undefined
   */
  function convertFieldToDate(data, field) {
    data.forEach(function(item) {
      var format = d3.time.format("%Y-%m-%d");
      item[field] = format.parse(item[field]);
    });
  }

  /* Load data
   *    Load the external data and generate the d3 chart.
   *
   *    return: undefined
   */
  d3.csv("data/zaatari-refugee-camp-population.csv", function(error, data) {
    // Check for errors
    if (error) {
      console.log("Data did not load properly!");
      console.log(error.responseURL + " " + error.status + " " + error.statusText);
    } else {
      console.log("Data loaded!");
      convertFieldToInt(data, "population");
      convertFieldToDate(data, "date");
      console.log(data);
      generateAreaChart(data);
      generateBarChart(data);
    }
  });

  /* End IIFE */
}(window, document));
