function hiAdvance() {
    if (s = [], 1 == hiGuide && (d3.select("#advanceHI")
            .text("Next >"), d3.select("#hiGuideText")
            .html("What is herd immunity?"), d3.select("#headerHI")
            .transition()
            .duration(2e3)
            .attr("opacity", 0)), 2 == hiGuide && d3.select("#hiGuideText")
        .html("When a <b>large proportion</b> of a population acquires immunity, <br> the few that are still <b>susceptible</b> to a particular infectious disease <br> (the very old, young, and sick) <b>remain protected</b><i>...but why?</i>"), 3 == hiGuide && (d3.select("#hiGuideText")
            .html("If we vaccinate a <b>large proportion</b> of the population at <b>random</b>, <br> there are likely to be <b>few connected susceptible people</b>. <br>This is the <i>key</i> to understanding herd immunity..."), window.setTimeout(function() {
                for (var e = 0; e < graph.nodes.length; e++) graph.nodes[e].status = Math.random() < .8 ? "V" : "S";
                d3.selectAll(".node")
                    .style("fill", function(e) {
                        return "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : void 0
                    })
            }, 800)), 4 == hiGuide && (d3.select("#hiGuideText")
            .html("No matter how many times we randomly redistribute<br>  vaccines, susceptible clusters remain small. <br> <i>Sometimes they're even by themselves!</i>"), window.setTimeout(function() {
                redistribute = window.setInterval(function() {
                    d3.selectAll(".link")
                        .style("stroke-width", "2px"), d3.select(".maxNumber")
                        .remove(), window.setTimeout(function() {
                            for (var e = 0; e < graph.nodes.length; e++) graph.nodes[e].status = "S";
                            d3.selectAll(".node")
                                .style("fill", "#b7b7b7")
                        }, 200), window.setTimeout(function() {
                            for (var e = 0; e < graph.nodes.length; e++) graph.nodes[e].status = Math.random() < .8 ? "V" : "S";
                            d3.selectAll(".node")
                                .style("fill", function(e) {
                                    return "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : void 0
                                }), globalMax = findMaxConnectedByType("S", "S"), d3.selectAll(".node")
                                .transition()
                                .duration(500)
                                .attr("r", function(e) {
                                    return e.id == globalMax.id ? (globalMaxConnectedLabel = d3.select("#hiSVG")
                                        .append("text")
                                        .attr("class", "maxNumber")
                                        .attr("x", e.x - 4)
                                        .attr("y", e.y + 6)
                                        .style("font-family", "Nunito")
                                        .style("font-weight", "500")
                                        .style("font-size", "12px")
                                        .text(globalMaxConnected), 18) : 12
                                })
                                .style("fill", function(e) {
                                    return e.id == globalMax.id ? "#fab45a" : "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : void 0
                                }), d3.selectAll(".link")
                                .style("stroke-width", function(e) {
                                    return e.source == globalMax ? "S" == e.target.status ? "5px" : "0px" : e.target == globalMax ? "S" == e.source.status ? "5px" : "0px" : "S" == e.source.status && "S" == e.target.status ? "5px" : "0px"
                                })
                        }, 500)
                }, 1200)
            }, 250)), 5 == hiGuide && (d3.select(".maxNumber")
            .remove(), redistribute = window.clearInterval(redistribute), d3.select("#playNetSVG")
            .remove(), d3.select("#hiSVG")
            .append("text")
            .attr("class", "measlesText")
            .attr("x", 320)
            .attr("y", 350)
            .style("font-size", "60px")
            .style("font-family", "Nunito")
            .style("font-weight", 700)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Measles"), d3.select("#hiSVG")
            .append("text")
            .attr("class", "measlesText")
            .attr("x", 380)
            .attr("y", 400)
            .style("font-size", "24px")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Râ‚€ = 13-18"), d3.select("#hiGuideText")
            .html("We'll demonstrate the benefits of herd immunity by <b>simulating</b> a measles <b>outbreak</b>, <br> a <b>highly infectious virus</b> that causes childhood disease.")), 6 == hiGuide && (d3.selectAll(".measlesText")
            .transition()
            .duration(500)
            .attr("opacity", 0), window.setTimeout(function() {
                d3.selectAll(".measlesText")
                    .remove()
            }, 600), d3.select("#hiGuideText")
            .html("First some background, the average number of cases <br> that the <i>first infected person</i> will produce is called <br> the <b>basic reproductive number</b>, or <b>Râ‚€</b> ('<i>R naught</i>')."), drawPlayNet(), graph.nodes[0].status = "I", d3.selectAll(".node")
            .style("fill", function(e) {
                return "I" == e.status ? "#ef5555" : void 0
            })), 7 == hiGuide) {
        s = [], timestep = 1;
        for (var e = findNeighbors(graph.nodes[0]), t = 0; t < e.length; t++)
            for (var i = 0; i < graph.nodes.length; i++) e[t] == graph.nodes[i] && (graph.nodes[i].status = "I", graph.nodes[i].exposureTimestep = timestep, graph.nodes[i].infectedBy = graph.nodes[0], s.push(graph.nodes[i]));
        d3.select("#hiGuideText")
            .html("<b> Patient Zero </b> infected all " + e.length + " of their neighbors. <br> In this case the basic reproductive number, <b>Râ‚€</b>, equals " + e.length + "."), window.setTimeout(animateGamePathogens_thenUpdateHI, 500)
    }
    if (8 == hiGuide && d3.select("#hiGuideText")
        .html("Râ‚€ is powerfully affected by how easily it <i>spreads</i>, <br> how quickly people <i>recover</i>, and the <i>structure</i> of the contact network."), 9 == hiGuide) {
        transmissionRate = .9, recoveryRate = .2, d3.select("#hiSVG")
            .append("circle")
            .attr("cx", 925)
            .attr("cy", 400)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#b7b7b7")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070"), d3.select("#hiSVG")
            .append("text")
            .attr("x", 960)
            .attr("y", 410)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Susceptible"), d3.select("#hiSVG")
            .append("circle")
            .attr("cx", 925)
            .attr("cy", 475)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#ef5555")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070"), d3.select("#hiSVG")
            .append("text")
            .attr("x", 960)
            .attr("y", 485)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Infected"), d3.select("#hiSVG")
            .append("circle")
            .attr("cx", 925)
            .attr("cy", 550)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#fab45a")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070"), d3.select("#hiSVG")
            .append("text")
            .attr("x", 960)
            .attr("y", 560)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Recovered"), d3.select("#hiSVG")
            .append("circle")
            .attr("cx", 925)
            .attr("cy", 625)
            .attr("r", 16)
            .attr("class", "legendCircle")
            .attr("fill", "#76A788")
            .style("stroke-width", "2px")
            .attr("opacity", 1)
            .style("stroke", "#707070"), d3.select("#hiSVG")
            .append("text")
            .attr("x", 960)
            .attr("y", 635)
            .attr("class", "legendText")
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("font-size", "30px")
            .attr("opacity", 1)
            .text("Vaccinated"), d3.select("#hiGuideText")
            .html("Let's see how far a measles outbreak will spread with 10% vaccination coverage..."), d3.select("#advanceHI")
            .style("color", "#707070");
        for (var t = 0; t < graph.nodes.length; t++) graph.nodes[t].status = Math.random() < .1 ? "V" : "S", graph.nodes[t].infectedBy = null, graph.nodes[t].exposureTimestep = null;
        do var a = Math.floor(Math.random() * graph.nodes.length); while ("V" == graph.nodes[a].status);
        var s = [];
        timestep = 0, graph.nodes[a].status = "I", graph.nodes[a].infectedBy = null, graph.nodes[a].exposureTimestep = timestep, diseaseIsSpreading = !0, timeToStop = !1, timestep++, d3.selectAll(".node")
            .style("fill", function(e) {
                return "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : "I" == e.status ? "#ef5555" : void 0
            }), recoveryRate = .05, transmissionRate = .25, hiTimesteps()
    }
    10 == hiGuide && d3.select("#hiGuideText")
        .html("In most cases, everyone who wasn't vaccinated will be infected. <br> But let's play with the dials and run a <i>few thousand simulations...</i> <br><b>For Science!</b>"), 11 == hiGuide && (d3.selectAll(".legendText")
            .transition()
            .duration(500)
            .attr("opacity", 0), d3.selectAll(".legendCircle")
            .transition()
            .duration(500)
            .attr("opacity", 0), recoveryRate = .2, transmissionRate = .9, mainScreen = !0, hiNodeSize = 13, drawRepeatNet(), plotBar(outbreakFrequency), simSet = 0, runVisualizationSims()), 12 == hiGuide && d3.select("#hiGuideText")
        .html("For <b>measles</b>, the vaccination coverage required <br> to achieve herd immunity is about <b>90%</b>!"), 13 == hiGuide && d3.select("#hiGuideText")
        .html("Let's try that again, but with a less transmissible disease like influenza..."), 14 == hiGuide && (d3.selectAll(".repeatRemovalText")
            .remove(), d3.select("#playNetSVG")
            .remove(), d3.selectAll("#barChart")
            .remove(), d3.select("#hiSVG")
            .append("text")
            .attr("class", "fluText")
            .attr("x", 320)
            .attr("y", 350)
            .style("font-size", "60px")
            .style("font-family", "Nunito")
            .style("font-weight", 700)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Influenza"), d3.select("#hiSVG")
            .append("text")
            .attr("class", "fluText")
            .attr("x", 383)
            .attr("y", 400)
            .style("font-size", "30px")
            .style("font-family", "Nunito")
            .style("font-weight", 400)
            .style("fill", "#707070")
            .attr("opacity", 1)
            .text("Râ‚€ = 1.5-3")), 15 == hiGuide && (flu = !0, d3.selectAll(".fluText")
            .remove(), transmissionRate = .2, recoveryRate = .53, outbreakFrequency = [0, 0, 0, 0, 0, 0, 0, 0, 0], mainScreen = !0, hiNodeSize = 13, drawRepeatNet(), plotBar(outbreakFrequency), simSet = 0, runVisualizationSims()), 16 == hiGuide && d3.select("#hiGuideText")
        .html("For <b>influenza</b>, the herd immunity threshold is just over <b>50%</b>. <br> But the real world doesn't always work out like simulations..."), 17 == hiGuide && d3.select("#hiGuideText")
        .html("Flu vaccines are not always effective, so higher vaccination coverages are necessary."), 18 == hiGuide && d3.select("#hiGuideText")
        .html("So let's try that again but allow vaccines to fail for various reasons... <br><br> <div align=center> People who have <i>already been exposed</i></div>  <div align=center> <i>Weak</i> immune responses</div> <div align=center> <i>Defective</i> doses</div> "), 19 == hiGuide && (d3.select("#hiGuideText")
            .html("Here, we'll see that the vaccination coverage threshold required to achieve <br> herd immunity is higher (right-shifted) as a result of vaccine failure."), d3.select("#playNetSVG")
            .remove(), d3.selectAll("#barChart")
            .remove(), flu = !0, imperfectVaccines = !0, d3.selectAll(".fluText")
            .remove(), transmissionRate = .2, recoveryRate = .53, outbreakFrequency = [0, 0, 0, 0, 0, 0, 0, 0, 0], mainScreen = !0, hiNodeSize = 13, drawRepeatNet(), plotBar(outbreakFrequency), simSet = 0, runVisualizationSims()), 20 == hiGuide && d3.select("#hiGuideText")
        .html("Now that we understand <i>herd immunity</i> in more detail, <br> I'll leave you with one caveat..."), 21 == hiGuide && d3.select("#hiGuideText")
        .html("Herd Immunity <b>only</b> works when susceptible individuals are <b>randomly</b> dispersed in the network."), 22 == hiGuide && d3.select("#hiGuideText")
        .html("But herd immunity is <b>undermined when susceptibility is clustered</b> <br> (e.g., a community of vaccine refusers)."), 23 == hiGuide && (d3.select("#hiGuideText")
            .html("Keep yourself and your loved ones vaccinated. <br> If not for your own benefit then consider it <br> a favor to those with weakened immune systems. <br> (Young, sick, and elderly)"), d3.select("#advanceHI")
            .text("Game >")
            .on("click", function() {
                window.location.href = "/game"
            })), d3.select("#hiGuideText")
        .transition()
        .duration(500)
        .style("color", textHex)
}

function animateGamePathogens_thenUpdateHI() {
    window.setTimeout(createGamePathogensHI, .1 * visualizationTimesteps), window.setTimeout(moveGamePathogensHI, .2 * visualizationTimesteps), window.setTimeout(popNewGameInfectionHI, .3 * visualizationTimesteps), window.setTimeout(removeGamePathogensHI, .9 * visualizationTimesteps), window.setTimeout(function() {
        d3.selectAll(".node")
            .style("fill", function(e) {
                return "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : "I" == e.status ? "#ef5555" : "R" == e.status ? "#fab45a" : void 0
            })
    }, 550)
}

function popNewGameInfectionHI() {
    d3.selectAll(".node")
        .transition()
        .duration(.75 * visualizationTimesteps)
        .attr("r", function(e) {
            return "I" == e.status ? 1 == timestep - e.exposureTimestep ? 1.5 * hiNodeSize : hiNodeSize : hiNodeSize
        })
}

function moveGamePathogensHI() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(visualizationTimesteps)
        .attr("cx", function(e) {
            return e.receiverX
        })
        .attr("cy", function(e) {
            return e.receiverY
        })
}

function getPathogen_xyCoords(e) {
    for (var t = [], i = [], a = 0; a < e.length; a++) {
        i.push(e[a].infectedBy);
        var s = {
            id: a,
            receiverX: e[a].x,
            receiverY: e[a].y,
            transmitterX: e[a].infectedBy.x,
            transmitterY: e[a].infectedBy.y
        };
        t.push(s)
    }
    return t
}

function createGamePathogensHI() {
    xyCoords = getPathogen_xyCoords(newInfections), hiSVG.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(e) {
            return e.transmitterX
        })
        .attr("cy", function(e) {
            return e.transmitterY
        })
        .attr("r", 4)
        .style("fill", "black")
}

function removeGamePathogensHI() {
    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", hiNodeSize), d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0), d3.selectAll(".pathogen")
        .remove()
}

function hiTimesteps() {
    return console.log(simSet), d3.select("#advanceHI")
        .transition()
        .duration(500)
        .style("color", "#707070"), simSet >= 9 ? (d3.selectAll(".node")
            .style("fill", "#b7b7b7"), void 0) : (infection_noGuaranteedTransmission(), stateChanges(), newInfections = [], newInfections = updateExposures(), timestep++, detectVizSimCompletion(), !timeToStop && diseaseIsSpreading ? (animateGamePathogens_thenUpdateHI(), window.setTimeout(hiTimesteps, visualizationTimesteps)) : (11 > hiGuide && d3.select("#advanceHI")
            .transition()
            .duration(500)
            .style("color", "white"), animateGamePathogens_thenUpdateHI(), mainScreen && (updateBarChart(), 9 == simSet && 0 == meanFinalEpidemicSizes[8] && (diseaseIsSpreading = !1, timeToStop = !0, meanFinalEpidemicSizes[8] = .01, console.log(meanFinalEpidemicSizes), d3.select("#advanceHI")
                .transition()
                .duration(500)
                .style("color", "white")), meanFinalEpidemicSizes[8] > 0 && (d3.select("#advanceHI")
                .transition()
                .duration(500)
                .style("color", "white"), diseaseIsSpreading = !1))), void 0)
}

function updateBarChart() {
    simSet > 9 || (vaxCoverage = coverages[simSet], runSimsGivenCoverage(vaxCoverage), plotBar(outbreakFrequency), runVisualizationSims())
}

function detectVizSimCompletion() {
    0 == getStatuses("I") && timestep > 0 && (timeToStop = !0, diseaseIsSpreading = !1)
}

function findMaxConnectedByType(e, t) {
    susceptibleNeighbors = [];
    for (var i = 0, a = null, s = 0; s < graph.nodes.length; s++) {
        var n = 0,
            r = graph.nodes[s];
        if (r.status == e) {
            for (var o = findNeighbors(r), l = 0; l < o.length; l++) {
                var d = o[l];
                d.status == t && (susceptibleNeighbors.push(d), n++)
            }
            n > i && (i = n, a = r)
        }
    }
    return globalMaxConnected = i, a
}

function runVisualizationSims() {
    simSet > 9 || (revertNodeStatus(), patientZero(), updateNodeColor(), timestep = 1, hiTimesteps(), 1 == simSet && (flu ? imperfectVaccines || d3.select("#hiGuideText")
        .html("Immediately, we see that epidemics are much less <b>frequent</b>.") : d3.select("#hiGuideText")
        .html("At <b>10%</b> coverage, <i>only</i> those vaccinated benefit.")), 2 == simSet && (flu || d3.select("#hiGuideText")
        .html("As we increase vaccination coverage, <br> we see some improvement but widespread <b>epidemics are commonplace</b>.")), 4 == simSet && (flu || d3.select("#hiGuideText")
        .html("By now we should start to notice a drop <br> in the <b>frequency</b> and <b>size</b> of outbreaks.")), 6 == simSet && flu && (imperfectVaccines || d3.select("#hiGuideText")
        .html("Outbreaks <i>fizzle out quickly</i> and epidemics are exceedingly rare.")), 7 == simSet && (flu || d3.select("#hiGuideText")
        .html("At high rates vaccination coverage, <br> most outbreaks will not have a chance to become an epidemic.")))
}

function revertNodeStatus() {
    for (var e = 0; e < graph.nodes.length; e++) graph.nodes[e].status = Math.random() < coverages[simSet] ? "V" : "S", graph.nodes[e].infectedBy = null, graph.nodes[e].exposureTimestep = null
}

function updateNodeColor() {
    d3.selectAll(".node")
        .style("fill", function(e) {
            return "V" == e.status ? "#76A788" : "S" == e.status ? "#b7b7b7" : "I" == e.status ? "#ef5555" : void 0
        })
}

function patientZero() {
    if (!(simSet > 9)) {
        var e = 0;
        do {
            var t = Math.floor(Math.random() * graph.nodes.length);
            e++
        } while ("V" == graph.nodes[t].status && 100 > e);
        e > 100 && (t = 0), timestep = 0, graph.nodes[t].status = "I", graph.nodes[t].infectedBy = null, graph.nodes[t].exposureTimestep = timestep, diseaseIsSpreading = !0, timeToStop = !1
    }
}
var redistribute, globalMax, globalMaxConnected, globalMaxConnectedLabel, susceptibleNeighbors, meanFinalEpidemicSizes = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    coverages = [.1, .2, .3, .4, .5, .6, .7, .8, .9],
    meanMeasuredR0 = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    outbreakFrequency = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    hiNodeSize = 13,
    simSet = 0,
    vaxCoverage = 0,
    visualizationTimesteps = 400,
    mainScreen = !1,
    flu = !1,
    imperfectVaccines = !1,
    newInfections = [];