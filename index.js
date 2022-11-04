
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
width = 660 - margin.left - margin.right,
height = 70 - margin.top - margin.bottom;
var name1="jon_snow", name2="varys";
var color1 = "green", color2="red";
let selectedEpisode = 42;
const x = d3.scaleLinear()
                .domain([1,73])
                .range([ 0, width ]);

function init(){
    populateCharacters()
    if (name1){createDialogueGraph(name1, color1, 1)};
    if (name2){createDialogueGraph(name2, color2, 2)};
    if (!name1 && !name2){
        height = height*3;
        createDialogueGraph("sum","gray");
    };
}

function createDialogueGraph(name, color, nr = 1){
    // append the svg object to the body of the page
    const svg = d3.select("#dialogueGraph")
        .append("svg")
        .attr("id",`graph-${nr}`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("display", "flex")
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);
    
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
                .range([ height, 0 ]);
            
                
            // Add the area
            svg.append("path")
                .datum(data)
                .attr("fill", color)
                .attr("stroke", color)
                .attr("fill-opacity", 0.2)
                .attr("stroke-width", 1.0)
                .attr("d", d3.area()
                    .x(d => x(d.episode))
                    .y0(y(0))
                    .y1(d => y(d.dialogue_count))
                );

            // Add X axis
            svg
                .append("g")
                .attr("transform", `translate(0,${height})`)
                .attr("color", "white")
                .call(d3.axisBottom(x));

            // Add Y axis   
            svg
                .append("g")
                .attr("color", "white")
                .call(d3
                    .axisLeft(y)
                    .ticks(3,"f"));
            
            svg.append("line")
                .attr("class", "selected-episode-line")
                .attr("x1", x(selectedEpisode))
                .attr("x2", x(selectedEpisode))
                .attr("y1", y(0))
                .attr("y2", d => y(innerHeight));
            
            svg.append("rect")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .on("mousemove", (event, d) => handleMouseMove(d));


        })
}

function handleMouseMove(item){
    var line_x = Math.round(x.invert(event.x-52));
    d3.selectAll(".selected-episode-line")
        .attr("x1", x(line_x))
        .attr("x2", x(line_x))
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
        characters.push(data.name)
        d3.select(".user-cards")
        .selectAll("div")
        .data(characters)
        .enter()
        .append("div")
        .attr("class", "card")
        .attr("id", d => d)
        .text(d => captitalizeFirstLetters(d.replaceAll("_", " ")))
        .on("click", function(){
            let color = Math.floor(Math.random()*16777215).toString(16);
            updateDialogueGraph(this.id, color);
        });
    });
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