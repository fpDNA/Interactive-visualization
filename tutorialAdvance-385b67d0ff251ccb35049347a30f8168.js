function wiggleHack() {
    d3.select(".guide").text("Try dragging nodes around to get a different perspective.").attr("opacity", 0),
    d3.select(".guide2").text("Sometimes you'll find hidden connections you might otherwise miss.").attr("opacity", 0),
    centerElement(guide, "guide"),
    centerElement(guide2, "guide2"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.select(".guide2").transition().duration(500).attr("opacity", 1)
}
function resetBack() {
    d3.select(".backArrow").attr("fill", function() {
        return backEnable ? "white" : "#838383"
    }).on("click", function() {
        backEnable && (diseaseIsSpreading || (guideRailsPosition--,
        guideRailsReverse(),
        9 == guideRailsPosition && (loadSyringe(),
        backEnable = !1,
        resetBack())))
    })
}
function resetNext() {
    d3.select(".nextArrow").attr("fill", function() {
        return nextEnable ? "white" : "#838383"
    }).text("Next >").on("click", function() {
        nextEnable && (diseaseIsSpreading || (guideRailsPosition++,
        guideRails()))
    })
}
function resetMenu() {
    d3.select(".menuNav").attr("fill", function() {
        return diseaseIsSpreading ? "#838383" : "white"
    }).on("click", function() {
        diseaseIsSpreading || menuConfirm()
    })
}
function disableBack() {
    d3.select(".backArrow").attr("fill", "#838383").text("< Back").on("click", function() {})
}
function disableNext() {
    d3.select(".nextArrow").attr("fill", "#838383").text("Next >").on("click", function() {})
}
function wipeOut() {
    endGame = !1,
    timeToStop = !1,
    diseaseIsSpreading = !1,
    vaccinateMode = !1,
    quarantineMode = !1,
    finalStop = !1,
    intervention = !1;
    for (var e = 0; e < tailoredNodes.length; e++)
        tailoredNodes[e].status = "S",
        tailoredNodes[e].exposureTimestep = null,
        tailoredNodes[e].infectedBy = null;
    d3.select(".menuBox").remove(),
    d3.select(".stepwiseNavBar").remove(),
    d3.select(".svg").remove(),
    d3.select(".vaxLogoDiv").remove(),
    graph.nodes.length > 30 && resetToSmallGraph()
}
function resetToSmallGraph() {
    for (var e = 0; e < tailoredNodes.length; e++)
        tailoredNodes[e].infectedBy = null,
        tailoredNodes[e].exposureTimestep = null,
        tailoredNodes[e].status = "S",
        graph.nodes.push(tailoredNodes[e]);
    for (var e = 0; e < tailoredLinks.length; e++)
        graph.links.push(tailoredLinks[e])
}
function restoreVaccineLesson() {
    d3.select(".startButton").remove(),
    d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        slideOutMenuBox(),
        flashNode(),
        d3.select(this).remove()
    }),
    guideRailsPosition = 9,
    guideRailsReverse(),
    d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemBold"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal")
}
function restoreQuarantineLesson() {
    numberQuarantined = 0,
    d3.select(".startButton").remove(),
    diseaseIsSpreading = !1,
    backEnable = !1,
    nextEnable = !0,
    resetBack(),
    resetNext(),
    guideRailsPosition = 18,
    vax2QuarantineTransition(),
    d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemBold")
}
function restoreNetworkLesson() {
    d3.select(".startButton").remove(),
    d3.select("#networkSxn").attr("class", "menuItemBold"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal"),
    graph.nodes = [],
    graph.links = [];
    for (var e = 0; e < tailoredNodes.length; e++)
        tailoredNodes[e].status = "S",
        tailoredNodes[e].infectedBy = null,
        tailoredNodes[e].exposureTimestep = null,
        graph.nodes.push(tailoredNodes[e]);
    for (var e = 0; e < tailoredLinks.length; e++)
        graph.links.push(tailoredLinks[e]);
    removeDuplicateEdges(graph),
    quarantineMode = !1,
    vaccinateMode = !1,
    diseaseIsSpreading = !1,
    timeToStop = !1,
    hideQuarantine(),
    wipeOut(),
    svg = d3.select("body").append("svg").attr({
        width: "100%",
        height: "85%"
    }).attr("viewBox", "0 0 " + width + " " + height).attr("class", "svg").style("pointer-events", "all"),
    guideTextSVG = d3.select(".svg").append("svg:svg").attr("class", "guideTextSVG").attr("x", 0).attr("y", 500),
    guide = d3.select(".guideTextSVG").append("text").attr("class", "guide").attr("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text(""),
    lessonText = d3.select(".svg").append("text").attr("class", "lessonText").attr("x", 35).attr("y", 80).style("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 700).attr("opacity", 1).text("Lesson 1: Networks"),
    guide2 = d3.select(".guideTextSVG").append("text").attr("class", "guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text(""),
    trivialGraph = {},
    trivialGraph.nodes = [],
    trivialGraph.links = [],
    trivialGraph.nodes.push(tailoredNodes[0]),
    d3.selectAll(".node").style("fill", "#2fa0ef"),
    stepWiseUpdate(),
    d3.select("body").append("div").attr("class", "vaxLogoDiv").text("VAX!"),
    startButton = d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        guideRailsPosition++,
        guideRails(),
        slideOutMenuBox(),
        d3.select(this).transition().duration(500).attr("opacity", 0),
        d3.select(this).transition().duration(500).text("")
    }),
    force.stop(),
    force = [],
    force = d3.layout.force().nodes(trivialGraph.nodes).links(trivialGraph.links).size([width, height]).charge(charge).friction(friction).on("tick", tick).start(),
    link = [],
    link = svg.selectAll(".link").data(trivialGraph.links).enter().append("line").attr("class", "link"),
    node = [],
    node = svg.selectAll(".node").data(trivialGraph.nodes).enter().append("circle").attr("class", "node").attr("r", 15).style("fill", "#2fa0ef").call(force.drag).on("click", function(e) {
        if (vaccinateMode) {
            if (0 >= vaccineSupply)
                return window.alert("Out of Vaccines!"),
                void 0;
            e.status = "V",
            vaccineSupply--,
            numberVaccinated++
        }
    }),
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("font-size", "28px").attr("opacity", 0).text("Suppose this is you"),
    d3.select(".guide2").text(""),
    centerElement(guide, "guide"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.select(".vaxLogoDiv").style("visibility", "visible"),
    d3.select(".vaxLogoDiv").style("left", "-12px"),
    createMenuBox(1),
    guideRailsPosition = 0,
    d3.select(".node").attr("r", 15)
}
function restoreEpidemicLesson() {
    d3.select(".startButton").remove(),
    d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemBold"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal"),
    hideSyringe(),
    hideQuarantine(),
    quarantineMode = !1,
    d3.select(".redX").remove(),
    graph.nodes = [],
    graph.links = [],
    timestep = 0,
    diseaseIsSpreading = !1,
    timeToStop = !1,
    tailoredNodes.splice(13, 1);
    for (var e = 0; e < tailoredNodes.length; e++)
        tailoredNodes[e].status = "S",
        tailoredNodes[e].infectedBy = null,
        tailoredNodes[e].exposureTimestep = null,
        graph.nodes.push(tailoredNodes[e]);
    for (var t = 0; t < tailoredLinks.length; t++)
        graph.links.push(tailoredLinks[t]);
    removeDuplicateEdges(graph),
    tutorialUpdate(),
    endGame = !1,
    startButton = d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        var e = Math.floor(Math.random() * numberOfIndividuals);
        graph.nodes[e].status = "I",
        diseaseIsSpreading = !0,
        tutorialTimesteps(),
        slideOutMenuBox(),
        resetMenu(),
        nextEnable = !1,
        backEnable = !1,
        disableNext(),
        disableBack(),
        timeToStop = !1
    }),
    guideRailsPosition = 4,
    guideRails()
}
function net2epiTransition() {
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Next, we'll look at how diseases move through a network"),
    d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("in lesson 2: epidemics."),
    centerElement(guide, "guide"),
    centerElement(guide2, "guide2"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.select(".guide2").transition().duration(500).attr("opacity", 1),
    d3.selectAll(".node").style("cursor", "pointer"),
    d3.select(".nextArrow").text("Finish >").on("click", function() {
        guideRailsPosition++,
        guideRails(),
        slideOutStepwiseNav()
    }),
    resetBack()
}
function epi2VaxTransition() {
    slideOutStepwiseNav(),
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Coming up, in lesson 3: vaccines, we'll cover how to prevent"),
    d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("epidemics by containing outbreaks before they spread."),
    centerElement(guide, "guide"),
    centerElement(guide2, "guide2"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.select(".guide2").transition().duration(500).attr("opacity", 1)
}
function vax2QuarantineTransition() {
    d3.selectAll(".node").remove(),
    d3.select(".lessonText").text("Lesson 4: Quarantine"),
    graph.nodes = [],
    graph.links = [],
    graph = generateSmallWorld(35, rewire, meanDegree),
    quarantineUpdate(),
    removeDuplicateEdges(graph);
    for (var e = 0; e < graph.nodes.length; e++)
        graph.nodes[e].status = "S";
    hideSyringe(),
    d3.select(".lessonText").text("Lesson 4: Quarantine"),
    d3.select("#quarantineSxn").attr("class", "menuItemBold"),
    d3.select("#vaccineSxn").attr("class", "menuItemNormal"),
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Vaccines take time to 'kick in' so they're ineffective"),
    d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("if an infection has already begun to spread."),
    centerElement(guide, "guide"),
    centerElement(guide2, "guide2"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.select(".guide2").transition().duration(500).attr("opacity", 1),
    startButton = d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        guideRailsPosition++,
        guideRails(),
        slideOutMenuBox(),
        d3.select(this).transition().duration(500).attr("opacity", 0),
        d3.select(this).transition().duration(500).text("")
    })
}
function guideRails(e) {
    if (!diseaseIsSpreading) {
        if (0 == guideRailsPosition && (backEnable = !1),
        1 == guideRailsPosition && (nextEnable = !0,
        backEnable = !0,
        resetBack(),
        resetNext(),
        d3.select(".menuBox").style("right", "-1000px"),
        e || addOneFriend(),
        d3.selectAll(".node").style("cursor", "pointer"),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("And this is you with one friend. The connection"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("represents contact between you two."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        2 == guideRailsPosition && (nextEnable = !0,
        backEnable = !0,
        resetBack(),
        resetNext(),
        e || buildGraph(),
        d3.selectAll(".node").style("cursor", "pointer"),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Now here are more friends who are connected to you and"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("to each other. This is your immediate contact group."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        3 == guideRailsPosition && (nextEnable = !0,
        backEnable = !0,
        resetBack(),
        resetNext(),
        charge = -400,
        e || tutorialUpdate(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Your friends have friends, who may be strangers to you,"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("but together they make up your contact network."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1),
        d3.selectAll(".node").style("cursor", "pointer"),
        d3.select(".menuBox").style("visibility", "visible"),
        d3.select(".menuBox").style("right", "-5px"),
        d3.select("#networkSxn").attr("class", "menuItemBold"),
        removeDuplicateEdges(graph),
        d3.select(".nextArrow").on("click", function() {
            net2epiTransition()
        })),
        4 == guideRailsPosition) {
            if (d3.select(".lessonText").text("Lesson 2: Epidemics"),
            removeDuplicateEdges(graph),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("When someone in your contact network gets sick,"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("the infection will spread across the network..."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            d3.select(".guideTextSVG").append("text").attr("class", ".startButton").on("click", function() {
                var e = Math.floor(Math.random() * numberOfIndividuals);
                graph.nodes[e].status = "I",
                removeDuplicateEdges(graph),
                diseaseIsSpreading = !0,
                tutorialUpdate(),
                slideOutMenuBox(),
                tutorialTimesteps(),
                d3.select(this).remove()
            }),
            e) {
                var t = Math.floor(Math.random() * numberOfIndividuals);
                graph.nodes[t].status = "I",
                removeDuplicateEdges(graph),
                diseaseIsSpreading = !0,
                tutorialUpdate(),
                tutorialTimesteps()
            }
            resetMenu(),
            nextEnable = !1,
            backEnable = !1,
            disableNext(),
            disableBack(),
            timeToStop = !1
        }
        if (5 == guideRailsPosition) {
            nextEnable = !0,
            backEnable = !0,
            resetBack(),
            resetNext();
            var i = svg.selectAll("image").data([0]);
            i.enter().append("image").attr("xlink:href", "/assets/redX.svg").transition().duration(500).attr("x", "280").attr("y", "85").attr("width", "450").attr("height", "450").attr("opacity", .6).attr("class", "redX"),
            flashRedX(),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("If no action is taken, then pretty soon"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("the entire network will be infected."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            d3.select(".backArrow").on("click", function() {
                d3.select(".redX").remove(),
                guideRailsPosition = 3,
                guideRailsReverse()
            })
        }
        if (6 == guideRailsPosition) {
            nextEnable = !0,
            backEnable = !0,
            resetBack(),
            resetNext(),
            d3.select(".redX").remove();
            for (var a = 0; a < graph.nodes.length; a++)
                graph.nodes.status = "S";
            svg.selectAll("circle.node").style("fill", "#b7b7b7"),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("The chance that someone spreads the infection"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("depends on how many neighbors they have."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1)
        }
        if (7 == guideRailsPosition && (nextEnable = !0,
        backEnable = !0,
        resetBack(),
        resetNext(),
        d3.selectAll("circle.node").transition().duration(500).attr("r", function(e) {
            return 3 * findNeighbors(e).length
        }),
        force.nodes(graph.nodes).charge(-1100).links(graph.links).start(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Here the nodes have been resized based on the chance"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("that they'll infect at least one of their neighbors."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        8 == guideRailsPosition && (nextEnable = !0,
        backEnable = !0,
        resetBack(),
        resetNext(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Most of the time, focusing treatment on people with"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("a lot of neighbors is a good strategy, but not always..."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1),
        d3.select(".nextArrow").on("click", epi2VaxTransition)),
        9 == guideRailsPosition) {
            graph.nodes = [],
            nextEnable = !1,
            backEnable = !1,
            resetBack(),
            resetNext(),
            vaccineSupply = 1,
            vax = 1,
            numberVaccinated = 0,
            loadSyringe(),
            d3.select(".lessonText").text("Lesson 3: Vaccines"),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Select the 'Vaccinate' tool in the upper right"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("then click the flashing node to vaccinate it."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            graph.nodes = [],
            graph.links = [];
            for (var a = 0; a < tailoredNodes.length; a++)
                tailoredNodes[a].status = "S",
                tailoredNodes[a].infectedBy = null,
                tailoredNodes[a].exposureTimestep = null;
            graph.nodes.push(tailoredNodes[2]),
            graph.nodes.push(tailoredNodes[1]),
            graph.nodes.push(tailoredNodes[3]),
            graph.nodes.push(tailoredNodes[8]),
            graph.nodes.push(tailoredNodes[9]),
            graph.nodes.push(tailoredNodes[10]),
            graph.nodes.push(tailoredNodes[11]),
            graph.nodes.push(tailoredNodes[12]);
            for (var a = 0; a < tailoredLinks.length; a++) {
                var o = tailoredLinks[a];
                (o.source.id == tailoredNodes[2].id || o.target.id == tailoredNodes[2].id) && graph.links.push(o)
            }
            removeDuplicateEdges(graph),
            tutorialUpdate()
        }
        if (10 == guideRailsPosition && (nextEnable = !0,
        backEnable = !1,
        resetNext(),
        resetBack(),
        keepFlashing = !1,
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("When we vaccinate a node,"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("it is removed because it cannot be infected."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1),
        tutorialUpdate()),
        11 == guideRailsPosition) {
            weakTieNodes = getWeakTieNodes(),
            weakTieLinks = getWeakTieLinks(),
            nextEnable = !1,
            backEnable = !1,
            d3.select(".nextArrow").attr("fill", "#838383").on("click", function() {}),
            d3.select(".nextArrow").attr("fill", "#838383").on("click", function() {}),
            keepFlashing = !0,
            loadSyringe(),
            vaccineSupply = 1,
            numberVaccinated = 0,
            charge = -300,
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Separate this network into two groups"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("by vaccinating any of the flashing nodes."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            graph.nodes = [],
            graph.links = [];
            for (var a = 0; a < weakTieNodes.length; a++)
                graph.nodes.push(weakTieNodes[a]);
            for (var r = 0; r < weakTieLinks.length; r++)
                graph.links.push(weakTieLinks[r]);
            for (var d = 0; d < graph.nodes.length; d++) {
                for (var n = 0, s = graph.nodes[d], l = 0; l < graph.links.length; l++) {
                    var o = graph.links[l];
                    (o.source.id == s.id || o.target.id == s.id) && n++
                }
                0 == n && graph.nodes.splice(d, 1)
            }
            removeDuplicateEdges(graph),
            tutorialUpdate(),
            flashNodes()
        }
        if (12 == guideRailsPosition && (vaccinateMode = !1,
        d3.selectAll(".node").attr("r", 8).style("fill", "#b7b7b7"),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Now if an outbreak were to occur,"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("it would not spread to both groups."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1),
        d3.selectAll(".node").style("fill", "#b7b7b7")),
        13 == guideRailsPosition) {
            hideSyringe(),
            vaccinateMode = !1,
            timeToStop = !0,
            d3.select(".vaccineDepressedState").style("visibility", "hidden"),
            graph.nodes = [],
            graph.links = [],
            tailoredNodes.splice(13, 1);
            for (var a = 0; a < tailoredNodes.length; a++)
                graph.nodes.push(tailoredNodes[a]),
                graph.nodes[a].status = "S",
                graph.nodes[a].infectedBy = null,
                graph.nodes[a].exposureTimestep = null;
            for (var r = 0; r < tailoredLinks.length; r++)
                graph.links.push(tailoredLinks[r]);
            removeDuplicateEdges(graph),
            d3.selectAll(".node").on("click", function(e) {
                if (vaccinateMode) {
                    if (0 >= vaccineSupply)
                        return window.alert("Out of Vaccines!"),
                        void 0;
                    e.status = "V",
                    d3.select(this).style("fill", "#d9d678"),
                    vaccineSupply--,
                    numberVaccinated++,
                    2 == vaccineSupply && (guideRailsPosition++,
                    guideRails()),
                    0 == vaccineSupply && intervention && (guideRailsPosition++,
                    guideRails()),
                    removeDuplicateEdges(graph),
                    tutorialUpdate()
                }
            }),
            removeDuplicateEdges(graph),
            tutorialUpdate(),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Now let's look at the original network again, but this time"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("we'll use vaccines to break up the network. "),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            vaccinateMode = !1
        }
        if (14 == guideRailsPosition && (nextEnable = !1,
        backEnable = !0,
        resetBack(),
        resetNext(),
        timeToStop = !0,
        vaccineSupply = 3,
        vax = 3,
        wiggle = !0,
        loadSyringe(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Select the 'Vaccinate' tool in the upper right and select"),
        vaccineSupply = 3,
        diseaseIsSpreading = !1,
        postInitialOutbreak = !0,
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("nodes to vaccinate. You only get " + vaccineSupply + " vaccines, so choose wisely."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        15 == guideRailsPosition && (nextEnable = !0,
        resetNext(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("When you vaccinate a node, they are effectively removed from"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("the network because they can no longer spread the infection."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        16 == guideRailsPosition && (nextEnable = !0,
        resetNext(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Vaccinating breaks the network into smaller pieces"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("making it less likely for an infection to spread to every node."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        17 == guideRailsPosition) {
            nextEnable = !1,
            backEnable = !1,
            resetNext(),
            resetBack(),
            d3.select(".menuBox").style("right", "0px"),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Now, when an infection spreads, it is more likely"),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("to be confined to a smaller network."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1);
            var u = graph.nodes.length;
            do
                var c = Math.floor(Math.random() * u)
                  , g = graph.nodes[c];
            while ("V" == g.status);g.status = "I",
            diseaseIsSpreading = !0,
            resetMenu(),
            timestep = 0,
            timeToStop = !1,
            postInitialOutbreak = !1,
            finalStop = !0,
            tutorialTimesteps(),
            tutorialUpdate()
        }
        if (18 == guideRailsPosition && (finalStop = !1,
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("In lesson 4: quarantine, we'll consider actions that"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("can be taken after an infection has begun to spread."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1),
        vax = 0,
        vaccineSupply = 0,
        d3.select(".nextArrow").text("Finish >").on("click", function() {
            vax2QuarantineTransition(),
            slideOutStepwiseNav()
        })),
        19 == guideRailsPosition && (d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Quarantining is a way to immediately remove nodes that"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("are likely to be infected during an epidemic outbreak."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        20 == guideRailsPosition && (nextEnable = !1,
        backEnable = !1,
        resetNext(),
        resetBack(),
        transmissionRate = .35,
        rerun = !1,
        hideSyringe(),
        loadQuarantine(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Select the 'Quarantine' tool in the upper right and click uninfected nodes"),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text("to quarantine. A new round of infections begins after every quarantine."),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        21 == guideRailsPosition && (nextEnable = !0,
        resetNext(),
        d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text("Great! Now, let's see how many you saved..."),
        d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text(""),
        centerElement(guide, "guide"),
        centerElement(guide2, "guide2"),
        d3.select(".guide").transition().duration(500).attr("opacity", 1),
        d3.select(".guide2").transition().duration(500).attr("opacity", 1)),
        22 == guideRailsPosition) {
            countSaved();
            var p = graph.nodes.length;
            graph = {},
            graph.nodes = [],
            graph.links = [],
            quarantineUpdate();
            var y = ".";
            100 * (numberSaved / p) > 50 && (y = "!");
            var h = "Congratulations! You saved " + numberSaved + " people. That's about " + (100 * (numberSaved / p)).toFixed(0) + "%" + y
              , x = "This represents how effective you were at containing the outbreak.";
            1 == numberSaved && (h = "",
            x = "You only saved one person... ಠ_ಠ"),
            numberSaved >= p - 1 && (x = "Did you cheat? ಠ_ಠ",
            h = ""),
            d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("opacity", 0).text(x),
            d3.select(".guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("opacity", 0).text(h),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").transition().duration(500).attr("opacity", 1),
            d3.select(".guide2").transition().duration(500).attr("opacity", 1),
            d3.select("#quarantineSxn").attr("class", "menuItemNormal"),
            d3.select("#gameLink").attr("class", "menuItemBold"),
            initRecap(),
            hideQuarantine(),
            menuColors = ["#007138", "#ffffff"],
            d3.select(".nextArrow").text("Play!").on("click", function() {
                window.location.href = "/game"
            })
        }
    }
}
function flashFullGame() {
    colorIndex = menuColorFlash ? 0 : 1,
    d3.select("#gameLink").style("color", menuColors[colorIndex]),
    menuColorFlash = !menuColorFlash
}
var menuColorFlash = !0
  , colorIndex = 0
  , menuColors = ["#007138", "#ffffff"]
  , wiggle = !1;
