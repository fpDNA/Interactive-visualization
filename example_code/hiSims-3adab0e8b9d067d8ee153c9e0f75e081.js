function initSimVars(e, a) {
    vaxCoverageInterval = e, maxSims = a, steps = 1 / vaxCoverageInterval - 1, coefficientOfVariation = measureCV(), effectiveR0 = estimateR0(), runSims()
}

function measureMeanDegree() {
    var e = 0;
    degreeMeasures = [];
    for (var a = 0; a < graph.nodes.length; a++) degreeMeasures.push(findNeighbors(graph.nodes[a])
        .length), e += degreeMeasures[a];
    meanDegree = e / degreeMeasures.length
}

function measureStandardDeviation() {
    for (var e = 0, a = 0; a < degreeMeasures.length; a++) e += Math.pow(degreeMeasures[a] - meanDegree, 2);
    stddev = 0, stddev = Math.pow(e / degreeMeasures.length, .5)
}

function measureCV() {
    return measureMeanDegree(), measureStandardDeviation(), stddev / meanDegree
}

function estimateR0() {
    return transmissionRate / recoveryRate * meanDegree * (1 + coefficientOfVariation * coefficientOfVariation)
}

function measureR0() {
    for (var e = 0, a = 0; a < graph.nodes.length; a++) graph.nodes[a].infectedBy == indexCase && e++;
    return e
}

function runSims() {
    testSimCounter = 0, testSimArray = [], meanFinalEpidemicSizes = [], meanMeasuredR0 = [];
    for (var e, a = 1; steps > a; a++) {
        var t = 0,
            s = 0;
        e = a * vaxCoverageInterval, coverages.push(formatPercent(e));
        for (var n = 0; maxSims > n; n++) resetInitials(), singleSim(e), t += getStatuses("R"), s += measureR0();
        meanMeasuredR0.push(s / maxSims), meanFinalEpidemicSizes.push(t / maxSims)
    }
}

function runSimsGivenCoverage(e) {
    for (var a = 0, t = 0, s = 0, n = 0; maxSims > n; n++) resetInitials(), singleSim(e), t += measureR0(), getStatuses("R") > threshold && (s++, a += getStatuses("R"));
    meanMeasuredR0[simSet] = t / maxSims, meanFinalEpidemicSizes[simSet] = a / maxSims, outbreakFrequency[simSet] = s / maxSims, simSet++
}

function singleSim(e) {
    diseaseIsSpreading = !0, vaccinateRandomly(e), selectIndexCase(), outbreakTimesteps()
}

function outbreakTimesteps() {
    simSet > 9 || (infection_noGuaranteedTransmission(), stateChanges(), newInfections = [], newInfections = updateExposures(), timestep++, detectSimCompletion())
}

function detectSimCompletion() {
    0 == getStatuses("I") && timestep > 0 ? (timeToStop = !0, diseaseIsSpreading = !1) : outbreakTimesteps()
}

function vaccinateRandomly(e) {
    if (null != e)
        for (var a = 0; a < graph.nodes.length; a++) {
            var t = graph.nodes[a];
            Math.random() < e && (t.status = "V", imperfectVaccines && Math.random() < .2 && (t.status = "S"))
        }
}

function resetInitials() {
    timestep = 0, diseaseIsSpreading = !1, timeToStop = !1;
    for (var e = 0; e < graph.nodes.length; e++) {
        var a = graph.nodes[e];
        a.status = "S", a.infectedBy = null, a.exposureTimestep = null
    }
}
var degreeMeasures = [],
    meanDegree, stddev, coefficientOfVariation, effectiveR0, threshold = 3,
    vaxCoverageInterval = .1,
    maxSims = 250,
    steps = 1 / vaxCoverageInterval,
    formatPercent = d3.format("%");
