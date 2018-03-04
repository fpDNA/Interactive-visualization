function drawPlayNet() {
    graph = generateSmallWorld(100, .1, 4), removeDuplicateEdges(graph), playNetSVG = d3.select("#hiSVG")
        .append("g")
        .attr("id", "playNetSVG")
        .attr("height", 600)
        .attr("width", 400), force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .charge(-400)
        .friction(.7)
        .gravity(.0075)
        .on("tick", hiTick)
        .start(), link = playNetSVG.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .style("stroke-width", "2px")
        .attr("class", "link"), node = playNetSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 12)
        .attr("fill", "#b7b7b7")
        .call(force.drag)
}

function drawRepeatNet() {
    d3.select("#playNetSVG")
        .remove(), graph = generateSmallWorld(100, .1, 4), removeDuplicateEdges(graph), playNetSVG = d3.select("#hiSVG")
        .append("g")
        .attr("id", "playNetSVG")
        .attr("height", 300)
        .attr("width", 300), force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .charge(-200)
        .friction(.7)
        .gravity(.0075)
        .on("tick", hiTick)
        .start(), link = playNetSVG.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .style("stroke-width", "2px")
        .attr("class", "link"), node = playNetSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 13)
        .attr("fill", "#b7b7b7")
        .call(force.drag), leftBound = 0, rightBound = 550, bottomBound = 50
}

function hiTick() {
    node.attr("cx", function(t) {
            return t.x = Math.max(leftBound, Math.min(width - rightBound, t.x))
        })
        .attr("cy", function(t) {
            return t.y = Math.max(topBound, Math.min(height - bottomBound, t.y))
        }), link.attr("x1", function(t) {
            return t.source.x
        })
        .attr("y1", function(t) {
            return t.source.y
        })
        .attr("x2", function(t) {
            return t.target.x
        })
        .attr("y2", function(t) {
            return t.target.y
        }), null != globalMaxConnectedLabel && globalMaxConnectedLabel.attr("x", globalMax.x - 4)
        .attr("y", globalMax.y + 6)
}
var playNetSVG, link, force, node, graph, leftBound = 0,
    rightBound = 100,
    topBound = 105,
    bottomBound = 15;
