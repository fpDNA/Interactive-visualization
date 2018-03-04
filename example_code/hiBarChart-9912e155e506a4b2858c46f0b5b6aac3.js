function plotBar(t) {
    var e = ["10", "20", "30", "40", "50", "60", "70", "80", "90"],
        a = ["0", ".50", "1"];
    d3.selectAll(".xAxis")
        .remove(), d3.selectAll(".yAxis")
        .remove(), d3.selectAll(".repeatRemovalText")
        .remove();
    var r = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 85
        },
        l = 750 - r.left - r.right,
        s = 375 - r.top - r.bottom;
    x = d3.scale.ordinal()
        .rangeRoundBands([0, l]), y = d3.scale.linear()
        .range([s, 0]), xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(e), yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(a)
        .orient("left"), hiBarSVG = d3.select("#hiSVG")
        .append("svg")
        .attr("id", "barChart")
        .attr("x", 500)
        .attr("y", 225)
        .attr("width", l + r.left + r.right)
        .attr("height", s + r.top + r.bottom)
        .append("g")
        .attr("transform", "translate(" + r.left + "," + r.top + ")"), x.domain(t.map(function(t, e) {
            return e
        })), y.domain([0, 1]), hiBarSVG.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + s + ")")
        .call(xAxis), hiBarSVG.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .append("text")
        .style("stroke", "white")
        .style("color", "#BABABA")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em"), spacer = 15, hiBarSVG.selectAll(".bar")
        .data(t)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(t, e) {
            return x.rangeBand() * e + spacer / 2 + 3
        })
        .attr("width", x.rangeBand() - spacer)
        .attr("y", function(t) {
            return y(t)
        })
        .attr("height", 0)
        .transition()
        .duration(500)
        .attr("height", function(t) {
            return s - y(t)
        }), d3.select("#hiSVG")
        .append("text")
        .text("Vaccination Coverage (%)")
        .attr("class", "repeatRemovalText")
        .attr("x", 760)
        .attr("y", 635)
        .style("font-size", "24px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070"), d3.select("#hiSVG")
        .append("text")
        .text("Epidemic")
        .attr("class", "repeatRemovalText")
        .attr("x", 445)
        .attr("y", 305)
        .style("font-size", "24px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070"), d3.select("#hiSVG")
        .append("text")
        .text("Frequency")
        .attr("class", "repeatRemovalText")
        .attr("x", 441)
        .attr("y", 327)
        .style("font-size", "24px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070"), d3.select("#hiSVG")
        .append("text")
        .text("(Outbreaks > 3%)")
        .attr("class", "repeatRemovalText")
        .attr("x", 423)
        .attr("y", 347)
        .style("font-size", "18px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070")
}
var hiBarSVG, x, y, xAxis, yAxis, spacer, maxYaxis = 70;
