function homeToTutorial() {
    d3.select(".homeSVG").remove(),
    d3.select(".gameVaxLogoDiv").remove(),
    pop = document.getElementById("audio");
    var t = "undefined" != typeof InstallTrigger
      , e = !1 || document.documentMode;
    svg = t || e ? d3.select("body").append("svg").attr("x", 0).attr("y", 0).attr("width", 900).attr("height", 450).attr("class", "svg").style("pointer-events", "all") : d3.select("body").append("svg").attr("x", 0).attr("y", 0).attr({
        width: "75%",
        height: "65%"
    }).attr("viewBox", "0 0 " + width + " " + height).attr("class", "svg").style("margin-left", 135).style("pointer-events", "all"),
    guideTextSVG = d3.select(".svg").append("svg:svg").attr("class", "guideTextSVG").attr("x", 0).attr("y", 475),
    guide = d3.select(".guideTextSVG").append("text").attr("class", "guide").attr("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text(""),
    lessonText = d3.select(".svg").append("text").attr("class", "lessonText").attr("x", 35).attr("y", 80).style("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 700).attr("opacity", 1).text("Lesson 1: Networks"),
    guide2 = d3.select(".guideTextSVG").append("text").attr("class", "guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text(""),
    d3.select("body").append("div").attr("class", "about").style("right", "0px").text("More About Vax...").on("click", function() {
        window.location.href = "/about"
    }),
    advanceTutorial()
}
function advanceTutorial() {
    start ? guideRails() : (start = !0,
    initTutorial())
}
function tick() {
    node.attr("cx", function(t) {
        return t.x = Math.max(8, Math.min(width - 8, t.x))
    }).attr("cy", function(t) {
        return t.y = Math.max(8, Math.min(492, t.y))
    }),
    link.attr("x1", function(t) {
        return t.source.x
    }).attr("y1", function(t) {
        return t.source.y
    }).attr("x2", function(t) {
        return t.target.x
    }).attr("y2", function(t) {
        return t.target.y
    })
}
function tutorialUpdate() {
    3 == guideRailsPosition && d3.selectAll(".node").transition().duration(300).attr("r", 8);
    var t = removeVaccinatedNodes(graph)
      , e = removeOldLinks(graph);
    graph.links = e,
    updateCommunities(),
    force.nodes(t).charge(charge).friction(.75).links(e).start(),
    link = svg.selectAll("line.link").data(e, function(t) {
        return t.source.id + "-" + t.target.id
    }),
    link.enter().insert("svg:line", ".node").attr("class", "link").attr("x1", function(t) {
        return t.source.x
    }).attr("y1", function(t) {
        return t.source.y
    }).attr("x2", function(t) {
        return t.target.x
    }).attr("y2", function(t) {
        return t.target.y
    }),
    link.exit().remove(),
    node = svg.selectAll("circle.node").data(t, function(t) {
        return t.id
    }).attr("r", 8).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "R" == t.status && (e = "#9400D3"),
        "V" == t.status && (e = "#d9d678"),
        t.id == player.id && "I" != t.status && 6 > guideRailsPosition && (e = "#2fa0ef"),
        e
    }),
    node.enter().append("svg:circle").attr("class", "node").attr("cx", function(t) {
        return t.x
    }).attr("cy", function(t) {
        return t.y
    }).attr("r", 8).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "R" == t.status && (e = "#9400D3"),
        "V" == t.status && (e = "#d9d678"),
        t.id == player.id && "I" != t.status && 6 > guideRailsPosition && (e = "#2fa0ef"),
        e
    }).on("click", function(t) {
        if (quarantineMode) {
            try {
                pop.play()
            } catch (e) {}
            vaccinateMode = !1,
            d3.status = "Q"
        }
        if (vaccinateMode) {
            if (quarantineMode = !1,
            0 >= vaccineSupply)
                return window.alert("Out of Vaccines!"),
                void 0;
            t.status = "V";
            try {
                pop.play()
            } catch (e) {}
            vaccineSupply--,
            numberVaccinated++,
            tutorialUpdate()
        }
    }).call(force.drag),
    node.exit().remove(),
    d3.select(".vaccineCounterText").text(""),
    d3.select(".vaccineCounterText").text(vaccineSupply + " / " + vax)
}
function addOneFriend() {
    trivialGraph.nodes.push(graph.nodes[1]),
    trivialGraph.links.push({
        source: trivialGraph.nodes[0],
        target: trivialGraph.nodes[1],
        remove: !1
    }),
    stepWiseUpdate()
}
function centerElement(t, e) {
    var n = t.node().getBBox().x
      , a = t.node().getBBox().width
      , i = n + a
      , r = n - 0
      , s = 960 - i
      , o = r - s;
    if (o > 0) {
        var l = Math.round(.5 * o)
          , c = n - l
          , d = "." + e;
        d3.select(d).attr("x", c)
    }
    if (0 > o) {
        var l = Math.round(.5 * o)
          , c = n + l
          , d = "." + e;
        d3.select(d).attr("x", c)
    }
}
function buildGraph() {
    trivialGraph.nodes.splice(1, 1),
    trivialGraph.links = [],
    tutorial = !0;
    for (var t = 0; t < graph.nodes.length; t++)
        edgeExists(graph.nodes[t], trivialGraph.nodes[0], graph) && trivialGraph.nodes.push(graph.nodes[t]);
    for (var e = 0; e < trivialGraph.nodes.length; e++)
        for (var n = 0; n < trivialGraph.nodes.length; n++)
            if (edgeExists(trivialGraph.nodes[e], trivialGraph.nodes[n], graph)) {
                var a = {
                    source: trivialGraph.nodes[e],
                    target: trivialGraph.nodes[n],
                    remove: !1
                };
                if (testDuplicate(trivialGraph.links, a))
                    continue;
                trivialGraph.links.push(a)
            }
    stepWiseUpdate()
}
function stepWiseUpdate() {
    var t = trivialGraph.links
      , e = trivialGraph.nodes;
    updateCommunities(),
    force.nodes(e).charge(charge).friction(friction).links(t).start(),
    link = svg.selectAll("line.link").data(t, function(t) {
        return t.source.id + "-" + t.target.id
    }),
    link.enter().insert("svg:line", ".node").attr("class", "link").attr("x1", function(t) {
        return t.source.x
    }).attr("y1", function(t) {
        return t.source.y
    }).attr("x2", function(t) {
        return t.target.x
    }).attr("y2", function(t) {
        return t.target.y
    }),
    link.exit().remove(),
    node = svg.selectAll("circle.node").data(e, function(t) {
        return t.id
    }).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "R" == t.status && (e = "#9400D3"),
        "V" == t.status && (e = "#d9d678"),
        t.id == player.id && "I" != t.status && (e = "#2fa0ef"),
        e
    }).on("click", function(t) {
        if (vaccinateMode) {
            if (0 >= vaccineSupply)
                return window.alert("Out of Vaccines!"),
                void 0;
            t.status = "V";
            try {
                pop.play()
            } catch (e) {}
            d3.select(this).style("fill", "#d9d678"),
            vaccineSupply--,
            numberVaccinated++,
            tutorialUpdate()
        }
    }),
    node.enter().append("svg:circle").attr("class", "node").attr("cx", function(t) {
        return t.x
    }).attr("cy", function(t) {
        return t.y
    }).attr("r", 8).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "R" == t.status && (e = "#9400D3"),
        "V" == t.status && (e = "#d9d678"),
        t.id == player.id && "I" != t.status && (e = "#2fa0ef"),
        e
    }).call(force.drag).on("click", function(t) {
        if (vaccinateMode) {
            if (0 >= vaccineSupply)
                return window.alert("Out of Vaccines!"),
                void 0;
            t.status = "V";
            try {
                pop.play()
            } catch (e) {}
            vaccineSupply--,
            numberVaccinated++,
            tutorialUpdate()
        }
    }),
    node.exit().remove()
}
function getPathogen_xyCoords(t) {
    for (var e = [], n = [], a = 0; a < t.length; a++) {
        n.push(t[a].infectedBy);
        var i = {
            id: a,
            receiverX: t[a].x,
            receiverY: t[a].y,
            transmitterX: t[a].infectedBy.x,
            transmitterY: t[a].infectedBy.y
        };
        e.push(i)
    }
    return e
}
function movePathogens() {
    xyCoords = getPathogen_xyCoords(newInfections),
    d3.selectAll(".pathogen").sort().transition().duration(400).attr("cx", function(t) {
        return t.receiverX
    }).attr("cy", function(t) {
        return t.receiverY
    })
}
function createPathogens() {
    xyCoords = getPathogen_xyCoords(newInfections),
    svg.selectAll(".pathogen").data(xyCoords).enter().append("circle").attr("class", "pathogen").attr("cx", function(t) {
        return t.transmitterX
    }).attr("cy", function(t) {
        return t.transmitterY
    }).attr("r", 4).style("fill", "black")
}
function removePathogens() {
    d3.selectAll(".pathogen").transition().duration(200).style("opacity", 0),
    d3.selectAll(".node").transition().duration(200).attr("r", 8),
    d3.selectAll(".pathogen").remove()
}
function tutorialTimesteps() {
    infection(),
    stateChanges(),
    newInfections = [],
    newInfections = updateExposures(),
    detectCompletion(),
    this.timestep++,
    timeToStop ? (animatePathogens_thenUpdate(),
    nextEnable = !0,
    resetBack(),
    resetNext(),
    resetMenu()) : (animatePathogens_thenUpdate(),
    window.setTimeout(tutorialTimesteps, 1e3))
}
function animatePathogens_thenUpdate() {
    window.setTimeout(createPathogens, 150),
    window.setTimeout(movePathogens, 200),
    window.setTimeout(popNewInfection, 450),
    window.setTimeout(tutorialUpdate, 550),
    window.setTimeout(removePathogens, 600)
}
function animateQuarantinePathogens_thenUpdate() {
    window.setTimeout(createPathogens, 700),
    window.setTimeout(movePathogens, 900),
    window.setTimeout(popNewInfection, 1300),
    window.setTimeout(tutorialUpdate, 1400),
    window.setTimeout(removePathogens, 1500)
}
function popNewInfection() {
    d3.selectAll(".node").transition().duration(100).attr("r", function(t) {
        var e = 8;
        return "I" == t.status && 1 == timestep - t.exposureTimestep && (e = 12),
        e
    })
}
function detectCompletion() {
    for (var t = 0, e = 0; e < graph.nodes.length; e++) {
        var n = graph.nodes[e];
        "I" == n.status && t++
    }
    t == numberOfIndividuals ? (timeToStop = !0,
    diseaseIsSpreading = !1) : detectEndGame(),
    finalStop && (detectEndGame(),
    endGame && (timeToStop = !0))
}
function timedRemoval(t) {
    d3.select(t).remove()
}
function slideOutStepwiseNav(t) {
    d3.select(".stepwiseNavBar").style("right", "-1000px"),
    window.setTimeout(clearStepwiseNavBar, 500),
    window.setTimeout(function() {
        d3.select("body").append("div").attr("class", "menuBox").style("right", "-1000px").style("visibility", "visible"),
        window.setTimeout(initMenuBox, 500)
    }, 550),
    t || (startButton = d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        if (3 == guideRailsPosition && (slideOutMenuBox(),
        tutorialTimesteps()),
        4 == guideRailsPosition) {
            slideOutMenuBox();
            var t = Math.floor(Math.random() * numberOfIndividuals);
            graph.nodes[t].status = "I",
            removeDuplicateEdges(graph),
            diseaseIsSpreading = !0,
            tutorialUpdate(),
            tutorialTimesteps()
        }
        8 == guideRailsPosition && (slideOutMenuBox(),
        guideRailsPosition++,
        guideRails()),
        9 == guideRailsPosition && (loadSyringe(),
        flashNode()),
        18 == guideRailsPosition && (slideOutMenuBox(),
        guideRailsPosition++,
        guideRails()),
        d3.select(this).attr("opacity", "0")
    }))
}
function slideOutMenuBox() {
    d3.select(".menuBox").style("right", "-1000px"),
    window.setTimeout(clearMenuBox, 500),
    window.setTimeout(createStepwiseNavBar, 700),
    window.setTimeout(initNavBar, 750),
    d3.select(".startButton").remove()
}
function createMenuBox(t) {
    d3.select("body").append("div").attr("class", "menuBox").style("right", "-1000px").style("visibility", "visible"),
    window.setTimeout(initMenuBox, t)
}
function createStepwiseNavBar() {
    d3.select("body").append("div").attr("class", "stepwiseNavBar").style("right", "-1000px"),
    d3.select(".stepwiseNavBar").append("svg").attr("class", "stepwiseNavSVG").attr("width", 500).attr("height", 45).style("background", "#85bc99")
}
function clearStepwiseNavBar() {
    d3.select(".stepwiseNavBar").remove()
}
function clearMenuBox() {
    d3.select(".menuBox").remove()
}
function initMenuBox() {
    d3.select(".menuBox").append("div").attr("class", "menuItemNormal").attr("id", "networkSxn").text("Networks").on("click", restoreNetworkLesson),
    d3.select(".menuBox").append("div").attr("class", "menuItemNormal").attr("id", "epidemicSxn").text("Epidemics").on("click", restoreEpidemicLesson),
    d3.select(".menuBox").append("div").attr("class", "menuItemNormal").attr("id", "vaccinateSxn").text("Vaccines").on("click", restoreVaccineLesson),
    d3.select(".menuBox").append("div").attr("class", "menuItemNormal").attr("id", "quarantineSxn").text("Quarantine").on("click", restoreQuarantineLesson),
    d3.select(".menuBox").style("right", "0px"),
    0 == guideRailsPosition && (d3.select("#networkSxn").attr("class", "menuItemBold"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal")),
    4 == guideRailsPosition && (d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemBold"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal")),
    8 == guideRailsPosition && (d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemBold"),
    d3.select("#quarantineSxn").attr("class", "menuItemNormal")),
    (18 == guideRailsPosition || 19 == guideRailsPosition) && (d3.select("#networkSxn").attr("class", "menuItemNormal"),
    d3.select("#epidemicSxn").attr("class", "menuItemNormal"),
    d3.select("#vaccinateSxn").attr("class", "menuItemNormal"),
    d3.select("#quarantineSxn").attr("class", "menuItemBold"))
}
function initNavBar() {
    d3.select(".stepwiseNavBar").style("right", "-5px"),
    backArrow = d3.select(".stepwiseNavSVG").append("text").attr("class", "backArrow").attr("x", 25).attr("y", 20).attr("fill", function() {
        return backEnable ? "white" : "#838383"
    }).style("font-family", "Nunito").attr("opacity", 1).style("font-weight", 500).attr("font-size", "18px").text("< Back").on("click", function() {
        backEnable && (diseaseIsSpreading || (guideRailsPosition--,
        guideRailsReverse(),
        9 == guideRailsPosition && (loadSyringe(),
        backEnable = !1,
        resetBack())))
    }),
    nextArrow = d3.select(".stepwiseNavSVG").append("text").attr("class", "nextArrow").attr("x", 400).attr("y", 20).attr("fill", function() {
        return nextEnable ? "white" : "#838383"
    }).style("font-family", "Nunito").attr("opacity", 1).style("font-weight", 500).attr("font-size", "18px").text("Next >").on("click", function() {
        nextEnable && (diseaseIsSpreading || (guideRailsPosition++,
        guideRails()))
    }),
    d3.select(".stepwiseNavSVG").append("text").attr("class", "menuNav").attr("x", 215).attr("y", 20).style("font-family", "Nunito").attr("fill", function() {
        return diseaseIsSpreading ? "#838383" : "white"
    }).attr("opacity", 0).style("font-weight", 500).attr("font-size", "18px").text("Menu").style("cursor", "pointer").on("click", function() {
        diseaseIsSpreading || menuConfirm()
    }),
    d3.select(".menuNav").transition().duration(500).attr("opacity", 1)
}
function menuConfirm() {
    d3.select(".svg").append("rect").attr("class", "confirmShadow").attr("x", window.innerWidth / 4 + 62 + 5).attr("y", -200).attr("width", 300).attr("height", 125).attr("fill", "#838383"),
    d3.select(".svg").append("rect").attr("class", "confirmBOX").attr("x", window.innerWidth / 4 + 62).attr("y", -200).attr("width", 300).attr("height", 125).attr("fill", "#85bc99"),
    d3.select(".svg").append("text").attr("class", "confirmHEAD").attr("x", window.innerWidth / 4 + 110).attr("y", -200).style("font-family", "Nunito").style("fill", "white").style("font-weight", 500).style("font-size", "35px").text("Skip Lesson?"),
    d3.select(".svg").append("text").attr("class", "confirmYES").attr("x", window.innerWidth / 4 + 140).attr("y", -200).style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 500).style("font-size", "28px").style("cursor", "pointer").text("Yes").on("mouseover", function() {
        d3.select(this).style("fill", "#2692F2")
    }).on("mouseout", function() {
        d3.select(this).style("fill", "#707070")
    }).on("click", function() {
        d3.select(".confirmShadow").transition().duration(500).attr("y", -200),
        d3.select(".confirmBOX").transition().duration(500).attr("y", -200),
        d3.select(".confirmHEAD").transition().duration(500).attr("y", -200),
        d3.select(".confirmYES").transition().duration(500).attr("y", -200),
        d3.select(".confirmNO").transition().duration(500).attr("y", -200),
        window.setTimeout(function() {
            hideQuarantine(),
            hideSyringe(),
            wipeOut(),
            svg = d3.select("body").append("svg").attr({
                width: "100%",
                height: "85%"
            }).attr("viewBox", "0 0 " + width + " " + height).attr("class", "svg").style("pointer-events", "all"),
            guideTextSVG = d3.select(".svg").append("svg:svg").attr("class", "guideTextSVG").attr("x", 0).attr("y", 500),
            guide = d3.select(".guideTextSVG").append("text").attr("class", "guide").attr("font-size", "28px").attr("opacity", 0).attr("x", guideXCoord).attr("y", guideYCoord).style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text("Please select a lesson from"),
            lessonText = d3.select(".svg").append("text").attr("class", "lessonText").attr("x", 35).attr("y", 80).style("font-size", "28px").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 700).attr("opacity", 1).text("Lesson: "),
            guide2 = d3.select(".guideTextSVG").append("text").attr("class", "guide2").attr("x", guideXCoord).attr("y", guideYCoord + guide2YCoordChange).attr("font-size", "28px").attr("opacity", 0).style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 300).text("the menu bar below."),
            centerElement(guide, "guide"),
            centerElement(guide2, "guide2"),
            d3.select(".guide").attr("opacity", 1),
            d3.select(".guide2").attr("opacity", 1),
            d3.select("body").append("div").attr("class", "vaxLogoDiv").text("VAX!").style("cursor", "pointer").on("click", function() {
                window.location.href = "/"
            }),
            d3.select(".vaxLogoDiv").style("visibility", "visible"),
            d3.select(".vaxLogoDiv").style("left", "-12px"),
            createMenuBox(1),
            keepFlashing = !1
        }, 501)
    }),
    d3.select(".svg").append("text").attr("class", "confirmNO").attr("x", window.innerWidth / 4 + 240).attr("y", -200).style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 500).style("font-size", "28px").style("cursor", "pointer").text("No").on("mouseover", function() {
        d3.select(this).style("fill", "#2692F2")
    }).on("mouseout", function() {
        d3.select(this).style("fill", "#707070")
    }).on("click", function() {
        d3.select(".confirmShadow").transition().duration(500).attr("y", -200),
        d3.select(".confirmBOX").transition().duration(500).attr("y", -200),
        d3.select(".confirmHEAD").transition().duration(500).attr("y", -200),
        d3.select(".confirmYES").transition().duration(500).attr("y", -200),
        d3.select(".confirmNO").transition().duration(500).attr("y", -200)
    }),
    d3.select(".confirmShadow").transition().duration(500).attr("y", window.innerHeight / 2 - 300 + 7),
    d3.select(".confirmBOX").transition().duration(500).attr("y", window.innerHeight / 2 - 300),
    d3.select(".confirmHEAD").transition().duration(500).attr("y", window.innerHeight / 2 - 250),
    d3.select(".confirmYES").transition().duration(500).attr("y", window.innerHeight / 2 - 200),
    d3.select(".confirmNO").transition().duration(500).attr("y", window.innerHeight / 2 - 200)
}
function initTutorial() {
    d3.select("body").append("div").attr("class", "vaxLogoDiv").text("VAX!").style("cursor", "pointer").on("click", function() {
        window.location.href = "/"
    }),
    startButton = d3.select(".guideTextSVG").append("text").attr("class", "startButton").attr("font-size", "18px").attr("opacity", 1).attr("x", nextX).attr("y", nextY).style("cursor", "pointer").style("font-family", "Nunito").style("fill", "#707070").style("font-weight", 470).text("Start >").on("click", function() {
        guideRailsPosition++,
        guideRails(),
        slideOutMenuBox(),
        d3.select(this).transition().duration(500).attr("opacity", 0),
        d3.select(this).transition().duration(500).text("")
    }),
    force = d3.layout.force().nodes(trivialGraph.nodes).links(trivialGraph.links).size([width, height]).charge(charge).friction(friction).on("tick", tick).start(),
    link = svg.selectAll(".link").data(trivialGraph.links).enter().append("line").attr("class", "link"),
    node = svg.selectAll(".node").data(trivialGraph.nodes).enter().append("circle").attr("class", "node").attr("r", 15).style("fill", "#2fa0ef").call(force.drag).on("click", function(t) {
        if (vaccinateMode) {
            if (0 >= vaccineSupply)
                return window.alert("Out of Vaccines!"),
                void 0;
            try {
                pop.play()
            } catch (e) {}
            t.status = "V",
            vaccineSupply--,
            numberVaccinated++,
            tutorialUpdate()
        }
    }),
    d3.select(".guide").attr("x", guideXCoord).attr("y", guideYCoord).attr("font-size", "28px").attr("opacity", 0).text("Suppose this is you"),
    centerElement(guide, "guide"),
    d3.select(".guide").transition().duration(500).attr("opacity", 1),
    d3.selectAll(".node").style("cursor", "pointer"),
    d3.select(".lessonText").attr("opacity", 1),
    d3.select(".vaxLogoDiv").style("visibility", "visible"),
    d3.select(".vaxLogoDiv").style("left", "-12px"),
    createMenuBox(1)
}
function flashRedX() {
    if (!(xFlashCounter > 2)) {
        var t = [.15, .75];
        0 == opacityIndex ? opacityIndex = 1 : 1 == opacityIndex && (opacityIndex = 0),
        d3.selectAll(".redX").transition().duration(750).attr("opacity", t[opacityIndex]),
        xFlashCounter++,
        window.setTimeout(flashRedX, 750)
    }
}
function unFixNodes(t) {
    for (var e = 0; e < t.nodes.length; e++)
        1 == t.nodes[e].fixed && (t.nodes[e].fixed = !1)
}
function loadSyringe() {
    d3.select("#vaxShieldText").style("color", "white").style("fill", "white"),
    quarantineMode && hideQuarantine(),
    d3.select(".actionVax").style("visibility", "visible"),
    d3.select(".actionVax").style("right", 0),
    d3.select(".vaccineCounterText").remove(),
    d3.select(".actionVax").append("text").attr("class", "vaccineCounterText").style("font-size", "16px").style("font-family", "Nunito").style("font-weight", 300).style("fill", "white").text(""),
    d3.select(".vaccineCounterText").text(vaccineSupply + " / " + vax)
}
function hideSyringe() {
    vaccinationMode = !1,
    d3.select(".actionVax").style("right", "-200px"),
    d3.select(".svg").style("cursor", "pointer"),
    d3.selectAll(".node").style("cursor", "pointer"),
    d3.select(".vaccineDepressedState").style("visibility", "hidden")
}
function loadQuarantine() {
    d3.select("#quarantineText").style("color", "white"),
    vaccinateMode && hideSyringe(),
    quarantineMode = !0,
    d3.select(".actionQuarantine").style("visibility", "visible"),
    d3.select(".actionQuarantine").style("right", "0px"),
    d3.select(".quarantineCounterText").remove(),
    d3.select(".actionQuarantine").append("text").attr("class", "quarantineCounterText").style("font-size", "16px").style("font-family", "Nunito").style("font-weight", 300).style("fill", "white").text(""),
    d3.select(".quarantineCounterText").style("color", "white").text("x" + numberQuarantined)
}
function hideQuarantine() {
    quarantineMode = !1,
    d3.select(".actionQuarantine").style("right", "-200px"),
    d3.select(".svg").style("cursor", "pointer"),
    d3.selectAll(".node").style("cursor", "pointer"),
    d3.select(".quarantineDepressedState").style("visibility", "hidden")
}
function flashNode() {
    var t = graph.nodes[0];
    0 == currentFlash ? currentFlash = 1 : 1 == currentFlash && (currentFlash = 0);
    var e = ["#d9d678", "#b7b7b7"];
    d3.selectAll(".node").transition().duration(500).style("fill", function(n) {
        return n.id == t.id ? e[currentFlash] : e[1]
    }),
    d3.selectAll(".node").on("click", function(e) {
        if (e.id == t.id && vaccinateMode) {
            e.status = "V";
            try {
                pop.play()
            } catch (n) {}
            vaccineSupply--,
            numberVaccinated++,
            keepFlashing = !1,
            nextEnable = !0,
            backEnable = !1,
            resetBack(),
            resetNext(),
            tutorialUpdate()
        }
    }),
    keepFlashing && 9 == guideRailsPosition && window.setTimeout(flashNode, 500)
}
function flashNodes() {
    graph.nodes[3],
    graph.nodes[5],
    graph.nodes[9],
    0 == currentFlash ? currentFlash = 1 : 1 == currentFlash && (currentFlash = 0);
    var t = ["#d9d678", "#b7b7b7"];
    d3.selectAll(".node").transition().duration(500).style("fill", function(e) {
        return 10 == e.id || 4 == e.id || 6 == e.id ? t[currentFlash] : t[1]
    }),
    d3.selectAll(".node").on("click", function(t) {
        if ((10 == t.id || 4 == t.id || 6 == t.id) && vaccinateMode) {
            t.status = "V";
            try {
                pop.play()
            } catch (e) {}
            vaccineSupply--,
            numberVaccinated++,
            keepFlashing = !1,
            nextEnable = !0,
            backEnable = !1,
            resetBack(),
            resetNext(),
            tutorialUpdate()
        }
    }),
    keepFlashing && window.setTimeout(flashNodes, 500)
}
function activateVaccinationMode() {
    wiggle && wiggleHack(),
    wiggle = !1,
    vaccinateMode = !0,
    d3.selectAll(".node").style("cursor", "url(/assets/vax_cursor.cur)"),
    d3.select(".svg").style("cursor", "url(/assets/vax_cursor.cur)"),
    vaccineResearched = !0,
    intervention = !0,
    d3.select(".vaccineCounterText").style("color", "white").text(vaccineSupply + " / " + vax),
    d3.select(".vaccineDepressedState").style("visibility", "visible")
}
function activateQuarantineMode() {
    friction = .9,
    vaccinateMode = !1,
    quarantineMode = !0,
    d3.selectAll(".node").style("cursor", "url(/assets/vax_cursor.cur)"),
    d3.select(".svg").style("cursor", "url(/assets/vax_cursor.cur)"),
    d3.select(".quarantineDepressedState").style("visibility", "visible"),
    window.setTimeout(startQuarantineOutbreak, 500)
}
function startQuarantineOutbreak() {
    for (var t = 0; t < graph.nodes.length; t++)
        graph.nodes.status = "S",
        graph.nodes.infectedBy = null,
        graph.nodes.exposureTimestep = null;
    graph.nodes[5].status = "I",
    diseaseIsSpreading = !0,
    resetMenu(),
    timestep = 0,
    timeToStop = !1,
    postInitialOutbreak = !0,
    numberOfIndividuals = graph.nodes.length,
    quarantineUpdate()
}
function quarantineTimesteps() {
    exposureEdges = [],
    infection(),
    stateChanges(),
    newInfections = [],
    newInfections = updateExposures(),
    xyCoords = getPathogen_xyCoords(newInfections),
    this.timestep++,
    detectCompletion(),
    timeToStop ? (animateQuarantinePathogens_thenUpdate(),
    nextEnable = !0,
    resetNext(),
    resetMenu()) : animateQuarantinePathogens_thenUpdate()
}
function redraw() {
    quarantineMode && svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
}
function quarantineUpdate() {
    var t = removeVaccinatedNodes(graph)
      , e = removeOldLinks(graph);
    graph.links = e,
    updateCommunities(),
    force.nodes(t).charge(charge).friction(.8).links(e).start(),
    link = svg.selectAll("line.link").data(e, function(t) {
        return t.source.id + "-" + t.target.id
    }),
    link.enter().insert("svg:line", ".node").attr("class", "link").attr("x1", function(t) {
        return t.source.x
    }).attr("y1", function(t) {
        return t.source.y
    }).attr("x2", function(t) {
        return t.target.x
    }).attr("y2", function(t) {
        return t.target.y
    }),
    link.exit().remove(),
    node = svg.selectAll("circle.node").data(t, function(t) {
        return t.id
    }).attr("r", 8).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "V" == t.status && (e = "#d9d678"),
        e
    }),
    node.enter().append("svg:circle").attr("class", "node").attr("cx", function(t) {
        return t.x
    }).attr("cy", function(t) {
        return t.y
    }).attr("r", 8).style("fill", function(t) {
        var e = null;
        return "S" == t.status && (e = "#b7b7b7"),
        "E" == t.status && (e = "#ef5555"),
        "I" == t.status && (e = "#ef5555"),
        "V" == t.status && (e = "#d9d678"),
        "Q" == t.status && (e = "#d9d678"),
        e
    }).on("click", function(t) {
        if (quarantineMode && "S" == t.status) {
            t.status = "Q";
            try {
                pop.play()
            } catch (e) {}
            quarantineUpdate(),
            numberQuarantined++,
            d3.select(".quarantineCounterText").text("x" + numberQuarantined),
            quarantineTimesteps()
        }
    }).call(force.drag),
    node.exit().remove(),
    d3.select(".quarantineCounterText").style("color", "white").text("x" + numberQuarantined)
}
function countSaved() {
    numberSaved = 0;
    for (var t = 0; t < graph.nodes.length; t++)
        ("Q" == graph.nodes[t].status || "S" == graph.nodes[t].status) && numberSaved++
}
function initRecap() {
    d3.select(".svg").append("text").attr("class", "networkSizeText").attr("x", backX).attr("y", 195).text("Network Size: " + numberOfIndividuals),
    d3.select(".svg").append("text").attr("class", "numberQuarantinedText").attr("x", backX).attr("y", 230).text("Quarantined: " + numberQuarantined),
    d3.select(".svg").append("text").attr("class", "numberVaccinatedText").attr("x", backX).attr("y", 265).attr("opacity", 0).text("Vaccinated: " + numberVaccinated);
    var t = 100
      , e = 380
      , n = e - t
      , a = (1 - (numberSaved / numberOfIndividuals).toFixed(2)) * n
      , i = (numberSaved / numberOfIndividuals).toFixed(2) * n;
    infectedBar = d3.select(".svg").append("rect").attr("class", "infectedBar").attr("x", 1200).attr("y", 310).attr("height", a).attr("width", 85).attr("opacity", 0).attr("fill", "#ef5555"),
    centerElement(infectedBar, "infectedBar"),
    infectedBar.attr("opacity", 1),
    infectedBar.attr("x", infectedBar.node().getBBox().x + 35),
    uninfectedBar = d3.select(".svg").append("rect").attr("class", "uninfectedBar").attr("x", 1200).attr("y", 300).attr("height", i).attr("width", 85).attr("opacity", 0).attr("fill", "#b7b7b7"),
    centerElement(uninfectedBar, "uninfectedBar"),
    uninfectedBar.attr("opacity", 1),
    uninfectedBar.attr("y", infectedBar.node().getBBox().height + 15),
    infectedBar.attr("y", infectedBar.node().getBBox().y + 10),
    centerElement(uninfectedBar, "uninfectedBar"),
    uninfectedBar.attr("x", uninfectedBar.node().getBBox().x + 35),
    uninfectedBar.attr("opacity", 1),
    d3.select(".svg").append("text").attr("class", "uninfectedLegendText").attr("x", backX + 550).attr("y", 195).text("Uninfected"),
    d3.select(".svg").append("text").attr("class", "infectedLegendText").attr("x", backX + 550).attr("y", 245).text("Infected"),
    d3.select(".svg").append("text").attr("class", "uninfectedPercentage").attr("x", backX + 675).attr("y", 195).text(Math.round(100 * (numberSaved / numberOfIndividuals)).toFixed(0) + "%"),
    d3.select(".svg").append("rect").attr("class", "uninfectedLegendBox").attr("x", backX + 521).attr("y", 177).attr("height", 20).attr("width", 20).attr("fill", "#b7b7b7"),
    d3.select(".svg").append("rect").attr("class", "infectedLegendBox").attr("x", backX + 521).attr("y", 227).attr("height", 20).attr("width", 20).attr("fill", "#ef5555")
}
var rewire = .1, meanDegree = 3, diseaseIsSpreading = !1, transmissionRate = .35, recoveryRate = 0, maxRecoveryTime = 1e6, numberVaccinated = 0, timeToStop = !0, guideRailsPosition = 0, postInitialOutbreak = !1, finalStop = !1, endGame = !1, intervention = !1, tutorial = !1, charge = -400, newInfections = [], xyCoords = [], vax = 1, currentFlash = 0, keepFlashing = !0, xFlashCounter = 0, numberQuarantined = 0, vaccineSupply = 0, vaccinateMode = !1, quarantineMode = !1, twine = [], twineIndex = 0, numberOfCommunities = null, largestCommunity = null, communities = [], groupCounter = 1, bcScores = [], timestep = 0, indexCase = null, opacityIndex = 0, lessonText, start = !1, nextX = 750, nextY = 140, guideXCoord = 400, guideYCoord = 70, guide2YCoordChange = 35, width = 950, height = 673, svg, guideTextSVG, force, link, node, friction = .9, backX = 115, numberSaved = 0, infectedBar, uninfectedBar, exposureEdges = [], simulation = !0, vaccineResearched = !1, pleaseWait = !1, game = !1, startButton;
backEnable = !0,
nextEnable = !0;
var pop, tailoredGraph = {}, tailoredNodes = getTailoredNodes(), tailoredLinks = getTailoredLinks(), graph = {};
graph.nodes = tailoredNodes,
graph.links = tailoredLinks,
trivialGraph = {},
trivialGraph.nodes = [],
trivialGraph.links = [];
var player = graph.nodes[0];
trivialGraph.nodes.push(player);
var numberOfIndividuals = tailoredNodes.length, weakTieNodes = getWeakTieNodes(), weakTieLinks = getWeakTieLinks(), backArrow, nextArrow;
homeToTutorial();
