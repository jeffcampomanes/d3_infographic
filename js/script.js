// SVG dimensions & colours
var     WIDTH = 600,
        HEIGHT = 250,
        RADIUS = Math.min(WIDTH, HEIGHT) / 2,
        MARGIN = 20,
        SPACING = 10,
        ORANGE_DK = "#ffbb33",
        ORANGE_LT = "#ffbb33";

// ***** CRIME infographic *****

var crimeJSON = {
    overview: {
        "new york city": 25
    },
    breakdown: {
        "burglary": 45,
        "violent": 35,
        "domestic": 10,
        "rape": 3
    }
};

var     crimeOverview = crimeJSON.overview,
        crimeCity = Object.keys(crimeOverview)[0],
        crimeNeighborhood = Object.keys(crimeOverview)[0],
        crimeBreakdown = crimeJSON.breakdown;


// Generate overview statistics
var crimePercentage = crimeOverview[crimeNeighborhood] / crimeOverview[crimeCity];
var crimeRadiusCity = RADIUS - 20;
var crimeRadiusNeighborhood = crimeRadiusCity * Math.sqrt(crimePercentage);
var crimeCircleRadii = [crimeRadiusCity, crimeRadiusNeighborhood];


// Generate breakdown statistics
var     crimeBreakdownArray = [],
        crimeLegendData = [],
        other,                  // data only lists top 4, catch others
        total = 0;              // total of breakdown stats <= 100

for (var key in crimeBreakdown) {
    if (crimeBreakdown.hasOwnProperty(key)) {
        total += crimeBreakdown[key];
        crimeBreakdownArray.push(crimeBreakdown[key]);
        crimeLegendData.push(key + " " + crimeBreakdown[key] + "%");
    }
}

other = 100 - total;
crimeBreakdownArray.push(other);
crimeLegendData.push("other " + other + "%");


// Choose colors from palette
var crimePalette = [ORANGE_LT, ORANGE_DK];
var crimeColor = d3.scale.ordinal()
        .range(crimePalette);


// Create overview graph
var crimeSVG = d3.select(".container--crime").append("svg")
        .attr("class", "crimeSVG")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", "translate(" + (crimeRadiusCity + MARGIN) + "," + HEIGHT / 2 + ")");

var crimeCircles = crimeSVG.selectAll("circle")
        .data(crimeCircleRadii)
    .enter().append("circle")
        .attr("cx", 0)
        .attr("cy", function(d, i) {return crimeRadiusCity - d})
        .attr("fill", function(d, i) {return crimeColor(i);})
        .attr("stroke", function(d, i) {return crimeColor(i);})
        .attr("r", 0)
        .transition()
        .duration(500)
        .delay(function(d, i) {return i*250;})
        .attr("r", function(d) {return d;});

crimeSVG.append("text")
        .attr("class", "citySVG")
        .attr("y", - crimeRadiusCity * 2/3)
        .attr("dy", ".3em")
        .text(crimeCity);

crimeSVG.append("text")
        .attr("class", "percentageSVG")
        .attr("y", crimeRadiusCity / 2)
        .attr("dy", "0.4em")
        .text(Math.floor(crimePercentage * 100) + "%");


// Create breakdown graph
var crimeArc = d3.svg.arc()
        .outerRadius(crimeRadiusCity)
        .innerRadius(0);

var crimePie = d3.layout.pie()
        .sort(null)
        .value(function(d) {return d;});

var crimePieChart = d3.select("svg").append("g")
        .attr("transform", "translate(" + (3 * crimeRadiusCity + MARGIN + 10) +
                "," + HEIGHT / 2 + ")")
    .selectAll("crimeArc")
        .data(crimePie(crimeBreakdownArray));

crimePieChart.enter().append("g")
        .attr("class", "crimeArc")
        .append("path")
        .style("fill", "#ffbb33")
        .style("stroke", "#ffffff")
        .style("stroke-width", 2)
        .transition()
        .duration(500)
        .delay(function(d, i) {return i * 250 + 1000})
        .attr("d", crimeArc);

crimePieChart.append("text")
        .transition()
        .delay(2250)
        .attr("class", "regionSVG")
        .attr("y", crimeRadiusCity + 2*SPACING)
        .text(crimeNeighborhood);

// Create breakdown legend
var crimeLegend = d3.select(".container--crime").append("div")
        .attr("class", "legend");

crimeLegend.selectAll("div")
        .data(crimeLegendData)
    .enter().append("div")
        .attr("class", "legendItem")
        .transition()
        .duration(500)
        .delay(function(d, i) {return i * 250 + 1100})
        .text(function(d) {return d}

);
