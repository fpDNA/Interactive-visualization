function guideRailsReverse() {
    var e = !0;
    if (0 == guideRailsPosition && (trivialGraph = {},
    trivialGraph.nodes = [],
    trivialGraph.links = [],
    d3.selectAll(".node").remove(),
    d3.selectAll(".link").remove(),
    quarantineMode = !1,
    diseaseIsSpreading = !1,
    timeToStop = !0,
    backEnable = !1,
    resetBack(),
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("font-size", "28px").attr("opacity", 0).text("Suppose this is you"),
    d3.select(".guide2").text(""),
    centerElement(guide, "guide"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.selectAll(".node").style("cursor", "pointer"),
    d3.select("#networkSxn").attr("class", "menuItemBold"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccineSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal"),
    trivialGraph.nodes.push(tailoredNodes[0]),
    stepWiseUpdate()),
    1 == guideRailsPosition) {
        quarantineMode = !1,
        trivialGraph.nodes = [],
        trivialGraph.links = [],
        trivialGraph.nodes.push(tailoredNodes[0]),
        trivialGraph.nodes.push(tailoredNodes[1]);
        for (var i = 0; i < tailoredLinks.length; i++) {
            var t = tailoredLinks[i];
            (t.source.id == tailoredNodes[0].id && t.target.id == tailoredNodes[1].id || t.source.id == tailoredNodes[1].id && t.target.id == tailoredNodes[0].id) && trivialGraph.links.push(t)
        }
        removeDuplicateEdges(trivialGraph),
        stepWiseUpdate()
    }
    if (2 == guideRailsPosition) {
        quarantineMode = !1,
        trivialGraph.nodes = [],
        trivialGraph.links = [],
        trivialGraph.nodes.push(tailoredNodes[0]),
        trivialGraph.nodes.push(tailoredNodes[1]),
        trivialGraph.nodes.push(tailoredNodes[4]),
        trivialGraph.nodes.push(tailoredNodes[5]),
        trivialGraph.nodes.push(tailoredNodes[12]);
        for (var a = 0; a < trivialGraph.nodes.length; a++)
            for (var s = 0; s < trivialGraph.nodes.length; s++)
                if (edgeExists(trivialGraph.nodes[a], trivialGraph.nodes[s], graph)) {
                    var r = {
                        source: trivialGraph.nodes[a],
                        target: trivialGraph.nodes[s],
                        remove: !1
                    };
                    if (testDuplicate(trivialGraph.links, r))
                        continue;
                    trivialGraph.links.push(r)
                }
        removeDuplicateEdges(trivialGraph),
        stepWiseUpdate()
    }
    if (3 == guideRailsPosition && (timestep = 0,
    guideRailsPosition++,
    guideRails()),
    4 == guideRailsPosition) {
        quarantineMode = !1,
        d3.select("#networkSxn").attr("class", "menuItemNormal"),
        d3.select("#epidemicSxn").attr("class", "menuItemBold"),
        d3.select("#vaccineSxn").attr("class", "menuItemNormal"),
        d3.select("#quarantineSxn").attr("class", "menuItemNormal"),
        d3.select(".redX").remove(),
        graph.nodes = [],
        graph.links = [],
        timestep = 0,
        diseaseIsSpreading = !1,
        timeToStop = !1;
        for (var i = 0; i < tailoredNodes.length; i++)
            tailoredNodes[i].status = "S",
            tailoredNodes[i].infectedBy = null,
            tailoredNodes[i].exposureTimestep = null,
            graph.nodes.push(tailoredNodes[i]);
        for (var a = 0; a < tailoredLinks.length; a++)
            graph.links.push(tailoredLinks[a]);
        removeDuplicateEdges(graph),
        tutorialUpdate(),
        net2epiTransition()
    }
    if (9 == guideRailsPosition) {
        force.stop(),
        quarantineMode = !1,
        hideQuarantine(),
        graph.nodes = [],
        graph.links = [];
        for (var i = 0; i < tailoredNodes.length; i++)
            tailoredNodes[i].status = "S",
            tailoredNodes[i].infectedBy = null,
            tailoredNodes[i].exposureTimestep = null;
        graph.nodes.push(tailoredNodes[2]),
        tutorialUpdate(),
        loadSyringe(),
        vax = 1,
        vaccineSupply = 1,
        d3.selectAll(".node").transition().duration(500).attr("r", function(e) {
            return "S" == e.status ? 8 : "V" == e.status ? 15 : void 0
        }).style("fill", function(e) {
            return "S" == e.status ? "#b7b7b7" : "V" == e.status ? "#d9d678" : void 0
        }),
        keepFlashing = !0
    }
    if (guideRailsPosition >= 13 && 17 >= guideRailsPosition) {
        backEnable = !0,
        nextEnable = !0,
        resetBack(),
        resetNext(),
        quarantineMode = !1,
        guideRailsPosition = 13,
        vaccineSupply = 3,
        vax = 3,
        graph.nodes = [],
        graph.links = [];
        for (var i = 0; i < tailoredNodes.length; i++)
            tailoredNodes[i].status = "S",
            tailoredNodes[i].fixed = !1,
            graph.nodes.push(tailoredNodes[i]);
        for (var a = 0; a < tailoredLinks.length; a++)
            graph.links.push(tailoredLinks[a]);
        removeDuplicateEdges(graph),
        tutorialUpdate(),
        timeToStop = !1,
        diseaseIsSpreading = !1,
        finalStop = !0,
        endGame = !1
    }
    guideRails(e)
}
