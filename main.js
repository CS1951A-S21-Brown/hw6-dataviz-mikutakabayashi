// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_3_width = (MAX_WIDTH / 2) - 10, graph_3_height = 350;
let graph_2_width = (MAX_WIDTH / 2), graph_2_height = 575;

// GRAPH 1
/*******************************************************************************************************************/
// Set up SVG object with width, height and margin
let svg1 = d3.select(graph1)
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left + 25},${margin.top})`);

let salesRef = svg1.append("g");

// Download data
d3.csv("./data/video_games.csv").then(function(data) {
    data = data.slice(0,10);

    // Create a linear scale for the x axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return d["Global_Sales"]; })])
        .range([0, graph_1_width - margin.left - margin.right]);
    
    // Create a scale band for the y axis
    let y = d3.scaleBand()
        .domain(data.map(function(d) { return d["Name"] }))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.1);

    // Add y-axis label
    svg1.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg1.selectAll("rect").data(data);

    // Setting the colors for the bars
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Name"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    // Rendering the bars for the graph
    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return color(d.Name) })
        .attr("x", x(0))
        .attr("y", function(d) { return y(d.Name) })       // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x(d.Global_Sales)})
        .attr("height",  y.bandwidth());

    let sales = salesRef.selectAll("text").data(data);

    // Render the text elements on the DOM
    sales.enter()
        .append("text")
        .merge(sales)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d["Global_Sales"]) + 5})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d["Name"]) + 12 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .style("font-size", 8)
        .text(function(d) { return (d["Global_Sales"]) });


    // Add x-axis label
    svg1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                     ${graph_1_height - margin.top - margin.bottom + 20})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Global Sales (in millions)");

    // Add y-axis label
    svg1.append("text")
        .attr("transform", `translate(-170, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Title");

    // Add chart title
    svg1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2 - 50}, -20)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Video Games of All Time by Global Sales");
});

// GRAPH 2
/*******************************************************************************************************************/
// Set up SVG object with width, height and margin
let svg2 = d3.select(graph2)
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left + 25},${margin.top})`);

var tooltip1 = d3.select(graph2).append("div").attr("class", "tooltip hidden");

// var geo_path = d3.geoPath();

var projection = d3.geoMercator()
  .scale(110)
  .center([0,20])
  .translate([graph_2_width / 2 - 235, graph_2_height / 2 + 30]);

var path = d3.geoPath().projection(projection);
// Data and color scale
var data = d3.map();

var url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
var data_file = "./data/Regions.csv"

Promise.all([d3.json(url), d3.csv(data_file)]).then(function(data){
    console.log(data);
    let mouseOver = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .5)

        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
        
        let html = `Region: ${getRegion(d.properties.name, data[1]).Region}<br/>
            Top 3 Genres:<br/>
            1: ${getRegion(d.properties.name, data[1]).First[0]}: ${getRegion(d.properties.name, data[1]).First[1]}% <br/>
            2: ${getRegion(d.properties.name, data[1]).Second[0]}: ${getRegion(d.properties.name, data[1]).Second[1]}%<br/>
            3: ${getRegion(d.properties.name, data[1]).Third[0]}: ${getRegion(d.properties.name, data[1]).Third[1]}%`;

        tooltip.html(html)
            .style("left", `${(d3.event.pageX)-50}px`)
            .style("top", `${(d3.event.pageY)-50}px`)
            .style("width", `160px`)
            .style("box-shadow", `2px 2px 5px #549cac`)  
            .transition()
            .duration(200)
            .style("opacity", 0.9) 
      }
    let mouseLeave = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .8)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "transparent")
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      }
      // Draw the map
    svg2.append("g")
      .selectAll("path")
      .data(data[0].features) // data[0] is the countries file
      .enter().append("path")
          .attr("fill", "#549cac")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
          .style("stroke", "#fff")
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )

    // Add chart title
    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2 - 80}, -20)`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 3 Video Games Genres by Percent of Top 100 Game Sales");
    
});

function getRegion(name, data) {
    if (name == 'USA' || name == 'Canada' || name == 'Mexico') {
        return {'Region': 'North America', 'First': [data[0].Genre, data[0].Percent], 'Second': [data[1].Genre, data[1].Percent], 
                'Third': [data[2].Genre, data[2].Percent]}
    }
    else if (name == 'Russia' || name == 'Germany' || name == 'England' || name == 'France' || name == 'Italy'|| name == 'Spain'
            || name == 'Ukraine' || name == 'Poland' || name == 'Romania' || name == 'Netherlands' || name == 'Belgium' || 
            name == 'Czech Republic' || name == 'Greece' || name == 'Portugal' || name == 'Sweden' || name == 'Hungary' || 
            name == 'Belarus' || name == 'Austria' || name == 'Serbia' || name == 'Switzerland' || name == 'Bulgaria' || 
            name == 'Denmark' || name == 'Finland' || name == 'Slovakia' || name == 'Norway' || name == 'Ireland' || 
            name == 'Croatia' || name == 'Moldova' || name == 'Bosnia and Herzegovina' || name == 'Albania' || name == 'Lithuania' 
            || name == 'Macedonia' || name == 'Slovenia' || name == 'Latvia' || name == 'Estonia' || name == 'Montenegro' || 
            name == 'Luxembourg' || name == 'Malta' || name == 'Iceland') {
        return {'Region': 'Europe', 'First': [data[3].Genre, data[3].Percent], 'Second': [data[4].Genre, data[4].Percent], 
                'Third': [data[5].Genre, data[5].Percent]}
    }
    else if (name == 'Japan') {
        return {'Region': 'Japan', 'First': [data[6].Genre, data[6].Percent], 'Second': [data[7].Genre, data[7].Percent], 
                'Third': [data[8].Genre, data[8].Percent]}
    }
    else {
        return {'Region': 'Other', 'First': [data[9].Genre, data[9].Percent], 'Second': [data[10].Genre, data[10].Percent], 
                'Third': [data[11].Genre, data[11].Percent]}
    }
}


// GRAPH 3
/*******************************************************************************************************************/
let tooltip = d3.select("#graph3")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// CSV filenames for the genres
let filenames = ["./data/Action.csv", "./data/Adventure.csv", "./data/Fighting.csv", "./data/Platform.csv",
                "./data/Puzzle.csv", "./data/Racing.csv", "./data/Role-Playing.csv", "./data/Shooter.csv",
                "./data/Simulation.csv", "./data/Sports.csv", "./data/Strategy.csv", "./data/Misc.csv"];

let genre = {0: "Action", 1: "Adventure", 2: "Fighting", 3: "Platform", 4: "Puzzle", 5: "Racing",
            6: "Role-Playing", 7: "Shooter", 8: "Simulation", 9: "Sports", 10: "Strategy", 11: "Misc"};

var radius = Math.min(graph_3_width, graph_3_height) / 2 - 20;

// Set up SVG object with width, height and margin
let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left+190},${margin.top+150})`);

let title = svg3.append("text")
    .attr("transform", `translate(10, -175)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

// A function that create / update the plot for a given variable:
function update() {
    index = document.querySelector('#index').value; 
    d3.csv(filenames[index]).then(function(data) {
        // data = data.slice(0, 10);
        data = convert2Dict(data);

        var color = d3.scaleOrdinal()
            .domain((function(d) { return d.key }))
            .range(d3.quantize(d3.interpolateHcl("#5494ac", "#fc7474"), 20));

        title.text("Publishers in the Worldwide Top 50 " + genre[index] + " Game Titles");

        // var outerArc = d3.arc()
        //     .innerRadius(radius * 1.3)
        //     .outerRadius(radius *1.2);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function(d) {return d.value; })
            .sort(function(a, b) {return b.value > a.value;}  ) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(data));

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var u = svg3.selectAll("path")
            .data(data_ready);

        // Build the pie chart
        u.enter()
            .append('path')
            .merge(u)
            .transition()
            .duration(800)
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // adds the mouseover and mouseout
        u
            .on('mouseover', function (d, i) {
                let color_span = `<span style="color: ${color(d.data.key)};">`;
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.5')

                let html = `Company: ${color_span}${d.data.key}<br/></span>
                    Number of Games in Top 50: ${color_span}${d.data.value}</span>`;
            
                tooltip.html(html)
                     .style("left", `${(d3.event.pageX)}px`)
                     .style("top", `${(d3.event.pageY) - 80}px`)
                     .style("box-shadow", `2px 2px 5px ${color(d.data.key)}`)  
                     .transition()
                     .duration(200)
                     .style("opacity", 0.9)         
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '1');
                tooltip.transition()
                     .duration(200)
                     .style("opacity", 0);});

            // var line = svg3
            // .selectAll('allPolylines')
            // .data(data_ready)
            // .enter()
            // .append('polyline')
            // .attr("stroke", "black")
            // .style("fill", "none")
            // .attr("stroke-width", 1)
            // .attr('points', function(d) {
            //     var posA = arcGenerator.centroid(d) // line insertion in the slice
            //     var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            //     var posC = outerArc.centroid(d); // Label position = almost the same as posB
            //     var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            //     posC[0] = radius * 1.2 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            //     return [posA, posB, posC]
            // })
            
            // line.transition()
            // .duration(1000)
            // // .style("opacity", 0)
            

            // var label = svg3
            // .selectAll('allLabels')
            // .data(data_ready)
            // .enter()
            // .append('text')
            //     .text( function(d) { console.log(d.data.key) ; return d.data.key } )
            //     .attr('transform', function(d) {
            //         var pos = outerArc.centroid(d);
            //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            //         pos[0] = radius *1.25 * (midangle < Math.PI ? 1 : -1);
            //         return 'translate(' + pos + ')';
            //     })
            //     .style('text-anchor', function(d) {
            //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            //         return (midangle < Math.PI ? 'start' : 'end')
            //     })
            
            // label.transition()
            // .duration(1000)
            // // .style("opacity", 0)    
            
        
        // remove the group that is not present anymore
        u
            .exit()
            .remove();
    });
}
update()

/**
 * Converts csv data to a dictionary
 */
function convert2Dict(data) {
    let keys = [], vals = [];
    for(i = 0; i < data.length; i++){
        keys.push(data[i]['Publisher']);
        vals.push(data[i]['count'])
    }
    const dict = {};
    for(i = 0; i < keys.length; i++){   
        dict[keys[i]] = vals[i];
    }
    return dict;
}
