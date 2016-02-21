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
      .domain([0, d3.max(data, function(d) { return d.population; })])
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

    // Create focus
    var focus = svg.append("focus")
      .style("display", "none");

    focus.append("circle")
      .attr("class", "y")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("r", 4);

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    /* Mouse move
     *    Handle mouse mouve events for area chart.
     *
     *    return: undefined
     */
    function mousemove() {
      var x0 = dateScaleX.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      console.log(x0);

      focus.select("circle.y")
        .attr("transform", "translate(" + dateScaleX(d.date) + "," + popScaleY(d.population) + ")");
    }

    svg.append("rectangle")
      .attr({
        width: width,
        height: height,
      })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemoove", mousemove());



    // End generate
  }

  /* Generate Bar Chart
   *    Create the d3 bar chart.
   *
   *    return: undefined
   */
  function generateBarChart(data) {
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

    // Bar width
    var barWidth = width / data.length;

    // Create SVG for chart
    var svg = d3.select("#bar-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Shelter Type Scale (x-axis)
    var shelterScaleX = d3.scale.ordinal()
      .domain(data.map(function(d) { return d.type; }))
      .rangeRoundBands([0, width], 0.1);

    // Percent Scale (y-axis)
    var percentScaleY = d3.scale.linear()
      .domain([0.0, 1.0])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(shelterScaleX)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(percentScaleY)
      .tickFormat(d3.format("%"))
      .orient("left");

    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return shelterScaleX(d.type); })
      .attr("width", shelterScaleX.rangeBand())
      .attr("y", function(d) { return percentScaleY(d.percent); })
      .attr("height", function(d) { return height - percentScaleY(d.percent); });

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
      .text("Percentage");

    // End generate
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
      generateAreaChart(data);
    }
  });

  d3.json("data/shelter.json", function(error, data) {
    // Check for errors
    if (error) {
      console.log("Data did not load properly!");
      console.log(error.responseURL + " " + error.status + " " + error.statusText);
    } else {
      console.log("Data loaded!");
      convertFieldToInt(data, "percent");
      generateBarChart(data);
    }
  });

  /* End IIFE */
}(window, document));
