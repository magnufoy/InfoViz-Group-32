
// set the dimensions and margins of the graph
var marginDialogue = {top: 10, right: 30, bottom: 20, left: 50},
widthDialogue = 660 - marginDialogue.left - marginDialogue.right,
heightDialogue = 70 - marginDialogue.top - marginDialogue.bottom;
var name1="jon_snow", name2="varys";
var color1 = "green", color2="red";
let selectedEpisode = 42;
const xDialogue = d3.scaleLinear()
                .domain([1,73])
                .range([ 0, widthDialogue ]);

function init(){
    populateCharacters()
    if (name1){createDialogueGraph(name1, color1, 1)};
    if (name2){createDialogueGraph(name2, color2, 2)};
    if (!name1 && !name2){
        heightDialogue = heightheightDialogue*3;
        createDialogueGraph("sum","gray");
    };
    createBubbleChart(-1);
}

function createDialogueGraph(name, color, nr = 1){
    // append the svg object to the body of the page
    const svg = d3.select("#dialogueGraph")
        .append("svg")
        .attr("id",`graph-${nr}`)
        .attr("width", widthDialogue + marginDialogue.left+1)
        .attr("height", heightDialogue + marginDialogue.top + marginDialogue.bottom)
        .attr("display", "flex")
        .append("g")
        .attr("transform",`translate(${marginDialogue.left},${marginDialogue.top})`);
    
    //Read the data
    d3.csv(`data/dialogue_data/${name}.csv`,
    
        // When reading the csv, I must format variables:
        d => {
            return {episode : d.episode, dialogue_count : d.dialogue_count}
        }).then(
        
        // Now I can use this dataset:
        function(data) {
                
            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max([60, data.map(d=>d.dialogue_count).reduce((a, b) => Math.max(a, b), -Infinity)])])
                .range([ heightDialogue, 0 ]);
            
                
            // Add the area
            svg.append("path")
                .datum(data)
                .attr("fill", color)
                .attr("stroke", color)
                .attr("fill-opacity", 0.4)
                .attr("stroke-width", 1.0)
                .attr("d", d3.area()
                    .x(d => xDialogue(d.episode))
                    .y0(y(0))
                    .y1(d => y(d.dialogue_count))
                );

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${heightDialogue})`)
                .attr("color", "white")
                .call(d3.axisBottom(xDialogue));

            // Add Y axis   
            svg.append("g")
                .attr("color", "white")
                .call(d3
                    .axisLeft(y)
                    .ticks(3,"f"));
            
            svg.append("line")
                .attr("class", "selected-episode-line")
                .attr("x1", xDialogue(selectedEpisode))
                .attr("x2", xDialogue(selectedEpisode))
                .attr("y1", y(0))
                .attr("y2", d => y(innerHeight));
            
            svg.append("rect")
                .attr("width", innerWidth)
                .attr("height", heightDialogue + marginDialogue.top + marginDialogue.bottom)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .on("click", (event, d) => 
                handleMouseMove(Math.round(xDialogue.invert(event.x-52)))
                );                
                
        })
}

function handleMouseMoveAndSlider(episode){
    d3.selectAll(".selected-episode-line")
        .attr("x1", xDialogue(episode))
        .attr("x2", xDialogue(episode));

    d3.select("#rangeValue")
        .text(episode);
}

function handleMouseMove(episode){
    handleMouseMoveAndSlider(episode);
    update(episode);
}

function calculateEpisodeFromMouseMove(){
    var episode = Math.round(xDialogue.invert(event.x-52));
}

function searchCharacter(){
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("card");
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="";                 
        }
    }  
}

function populateCharacters(){
    let characters = [];
    d3.csv("data/characters.csv", function(data) {
        return characters.push(data.name);
    }).then(
        function(data){
        d3.select(".user-cards")
            .selectAll("div")
            .data(characters)
            .enter()
            .append("button")
            .attr("class", "card")
            .attr("id", d => d)
            .text(d => captitalizeFirstLetters(d.replaceAll("_", " ")))
            .on("click", function(){
                let color = Math.floor(Math.random()*16777215).toString(16);
                updateDialogueGraph(this.id, color)
            });
        }
    )
}

function captitalizeFirstLetters(str){
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2
}

function updateDialogueGraph(name, color){
    d3.select("#graph-2").remove();
    d3.select("#graph-1").attr("id", "graph-2");
    createDialogueGraph(name, `#${color}`, 1);
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const width = 500;
const height = 300;
const centre = { x: width/2, y: height/2 }; // location to centre the bubbles
const forceStrength = 0.03; // strength to apply to the position forces
let svg = null;
let bubbles = null;
let labels = null;
let nodes = [];


function createNodes(rawData) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    let data = rawData //.filter(function(d, i) { return d.episode_1 == 1;})
    const maxSize = d3.max(data, d => +d.killings_count);
    console.log(data)
    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([10, 70 ]);

    // use map() to convert raw data into node data
    const myNodes = data.map(d => ({
      ...d,
      radius: radiusScale(+d.killings_count),
      size: +d.killings_count,
      x: Math.random() * 900,
      y: Math.random() * 800
    }));

    return myNodes;
}

function bubbleChart() {
    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
      return Math.pow(d.radius, 2.0) * 0.01
    }
  
    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(charge))
      // .force('center', d3.forceCenter(centre.x, centre.y))
      .force('x', d3.forceX().strength(forceStrength).x(centre.x))
      .force('y', d3.forceY().strength(forceStrength).y(centre.y))
      .force('collision', d3.forceCollide().radius(d => d.radius + 1));
  
    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();
  
    // set up colour scale
    const fillColour = d3.scaleOrdinal()
        .domain(["Arryn", "Baelish", "Baratheon", "Bolton", "Brotherhood Without Banners", "Clegane", "Dothraki", "Faceless Men", "Free Folk", "Frey", "Good Masters", "Greyjoy", "Kingsguard", "Lannister", "Martell", "Night's Watch", "R'hllor", "Stark", "Targaryen", "Tarly", "The Thirteen", "The Undying Ones", "Tyrell", "Varys"])
        .range(["#1E91E7", "#92DC92", "#F4D71B", "#FFAEAE", "#8aa263", "#00EAB8", "#A25D0A", "#FF1DBE", "#FFFFFF", "#B9B9B9", "#0A208E", "#474747", "#600C0C", "#C61616", "#EF8F2F", "#000000", "#FFD597", "#F4F4F4", "#A000C6", "#185818", "#2B9A2B", "#D3A7FF"]);
  
    const emojiDeath = d3.scaleOrdinal()
        .domain(["Battle", "Boar", "Combat", "Dog", "Ended pains", "Execution", "Fire", "Magic", "Murder", "Poison", "Sacrifice", "Snow bear", "Suicide", "Treason", "Wolf", ""])
        .range(["🛡️", "🐗", "⚔️", "🐶", "😞", "⚖️", "🔥", "🔮", "🗡️", "💊", "🤝", "🐻", "👋", "😱", "🐺", ""]);
    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rD is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rD input
  
  
    // main entry point to bubble chart, returned by parent closure
    // prepares rD for visualisation and adds an svg element to the provided selector and starts the visualisation process
    let chart = function chart(selector, rawData) {
      // convert raw data into nodes data
      nodes = createNodes(rawData);
      
      // create svg element inside provided selector
      //var div = d3.select("body").append("div")
       //.attr("class", "tooltip")
       //.style("opacity", 0);
      
      svg = d3.select(selector)
        .append('svg')
        .attr("class", "bubbleSvg")
        .attr('width', width)
        .attr('height', height);
      
  
      // bind nodes data to circle elements
      const elements = svg.selectAll('.bubble')
        .data(nodes, d => d.name)
        .enter()
        .append('g');
        
  
  
      
      bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', d => d.radius)
        .attr('fill', d => fillColour(d.house))
        .attr('stroke', '#000000')
        .attr('stroke-width', d=> '0.5')
        .on("mouseover", function() {
          d3.select(this)
            .attr('stroke-width', d=> '3')})
        .on("click", function() {
          d3.selectAll('circle').filter(function(d) {console.log(d)})//return d.name == "Cersei Lannister";})
            .attr('stroke-width', d=> '3')
            .attr('stroke', 'red')
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr('r', d => d.radius)
            .attr('fill', d => fillColour(d.house))
            .attr('stroke', '#000000')
            .attr('stroke-width', d=> '0.5')
        })
  
  
      //labels
      titles = elements
        .append('title')
        .attr('dy', '.3em')
        .text(d => 'name: ' + d.name + '\n' + "house: " + d.house + '\n' + 'cause of death: ' + d.icd10_cause_text)
      
        labels = elements
        .append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .text(d => emojiDeath(d.icd10_cause_text))
  
      // set simulation's nodes to our newly created nodes array
      // simulation starts running automatically once nodes are set
      simulation.nodes(nodes)
        .on('tick', ticked)
        .restart();
    }
  
    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
  
    // return chart function from closure
    return chart;
}

function ticked() {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  }

function update(episode_nr) {
 
    // filter data set and redraw plot
    d3.selectAll(".bubbleSvg").remove();
    let myUpdatedBubbleChart = bubbleChart();

    // function called once promise is resolved and data is loaded from csv
    // calls bubble chart function to display inside #vis div
    function displayUpdatedData(data) {
      myUpdatedBubbleChart('#bubble', data, episode_nr);} // 1 hs the selectedEpisode

    // load data
    
    d3.csv(`bubble_data/episodes_appearances/episode_${episode_nr}.csv`).then(displayUpdatedData);

}

function createBubbleChart(episode_nr){

    // new bubble chart instance
    let myBubbleChart = bubbleChart();
    
    // function called once promise is resolved and data is loaded from csv
    // calls bubble chart function to display inside #vis div
    function displayData1(data) {
      myBubbleChart('#bubble', data, 1);} // 1 is the selectedEpisode
    
    // load data
    if (episode_nr == -1){
        d3.csv(`bubble_data/characters_v2.csv`).then(displayData1);
    }
    else {
        d3.csv(`bubble_data/episodes_appearances/episode_${episode_nr}.csv`).then(displayData1);
    }
    
    
        // files[0] will contain file1.csv
        // files[1] will contain file2.csv
    
        d3.csv("bubble_data/episodes.csv").then(function (data) {
      
            var margin = {left: 30, right: 30},
                width = 1000,
                height = 100,
                range = [1, 73],
                step = 1; // change the step and if null, it'll switch back to a normal slider
    
    
            // array useful for step sliders
            var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
            var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
                return d;
          });      
        });
}

