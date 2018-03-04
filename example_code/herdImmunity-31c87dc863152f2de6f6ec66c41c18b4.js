function init_hiSVG() {
    var t = "undefined" != typeof InstallTrigger,
        e = !1 || document.documentMode;
    hiSVG = t || e ? d3.select("body")
        .append("svg")
        .attr({
            width: 950,
            height: 600
        })
        .attr("id", "hiSVG")
        .attr("pointer-events", "all")
        .append("svg:g") : d3.select("body")
        .append("svg")
        .attr({
            width: "100%",
            height: "70%"
        })
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("id", "hiSVG")
        .attr("pointer-events", "all")
        .append("svg:g")
}

function init_hiSpace() {
    init_hiSVG(), d3.select("body")
        .append("div")
        .attr("id", "hiNav"), d3.select("body")
        .append("div")
        .attr("id", "vaxLogoDiv")
        .text("VAX!")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = "/"
        }), d3.select("#hiSVG")
        .append("text")
        .attr("id", "headerHI")
        .style("font-size", "60px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "#707070")
        .attr("x", -20)
        .attr("y", 80)
        .text("Herd Immunity")
        .attr("opacity", 1), d3.select("#hiNav")
        .append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "advanceHI")
        .style("right", "-40px")
        .style("font-size", "20px")
        .text("Start >")
        .on("click", function() {
            diseaseIsSpreading || (hiGuide++, d3.select("#hiGuideText")
                .transition()
                .duration(300)
                .style("color", backgroundHex), window.setTimeout(hiAdvance, 300))
        }), hiGuideText = d3.select("body")
        .append("div")
        .attr("id", "hiGuideText")
        .attr("fill", "#707070")
        .html("In this module, we'll look at how <i>herd immunity</i> works and </br> how it differs between different pathogens."), drawPlayNet()
}
var hiSVG, hiGuide = 0,
    width = 975,
    height = 705,
    hiGuideText, backgroundHex = "#F1F1F1",
    textHex = "#707070",
    diseaseIsSpreading = !1,
    game = !1,
    timestep = 0;
init_hiSpace();
