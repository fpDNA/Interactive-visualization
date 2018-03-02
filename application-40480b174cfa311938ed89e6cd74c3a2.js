/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
function generateSmallWorld(t, e, n) {
    for (var r = [], i = [], o = [], a = 0; t > a; a++) {
        r.push(a);
        var u = {
            id: r[a],
            status: "S",
            group: null,
            edges: [],
            marked: !1,
            degree: null,
            bcScore: null,
            exposureTimestep: null,
            infectedBy: null
        };
        o.push(u)
    }
    for (var s = 0; t > s; s++)
        for (var l = 0; n > l; l++) {
            var c = Math.floor(l / 2 + 1);
            1 == l % 2 && (c *= -1);
            var f = s + c;
            0 > f && (f += t), f >= t && (f -= t);
            var h = [s, f];
            i.push(h)
        }
    for (var d = 0; d < i.length; d++)
        if (Math.random() < e) {
            var p = i[d][0];
            do var g = Math.floor(Math.random() * t),
                m = r[g]; while (p == m);
            i[d][1] = m
        }
    for (var v = {}, y = [], b = 0; b < i.length; b++) {
        var x = {
            source: i[b][0],
            target: i[b][1],
            remove: !1
        };
        testDuplicate(y, x) || y.push(x)
    }
    return v.nodes = o, v.links = y, v
}

function removeDuplicateEdges(t) {
    for (var e = 0; e < t.nodes.length; e++)
        for (var n = t.nodes[e], r = 0; r < t.nodes.length; r++) {
            var i = t.nodes[r];
            spliceDuplicateEdges(n, i, t)
        }
}

function testDuplicate(t, e) {
    for (var n = e.source, r = e.target, i = !1, o = 0; o < t.length; o++) {
        var a = t[o],
            u = a.source,
            s = a.target;
        u == n && s == r && (i = !0), u == r && s == n && (i = !0)
    }
    return i
}

function degree(t) {
    for (var e = 0, n = 0; n < graph.links.length; n++)(graph.links[n].source == t || graph.links[n].target == t) && e++;
    return e
}

function findNeighbors(t) {
    for (var e = [], n = 0; n < graph.links.length; n++) {
        var r = graph.links[n];
        r.source == t && e.push(r.target), r.target == t && e.push(r.source)
    }
    return e
}

function findLink(t, e) {
    for (var n = null, r = 0; r < graph.links.length; r++) graph.links[r].source == t && graph.links[r].target == e && (n = graph.links[r]), graph.links[r].target == t && graph.links[r].source == e && (n = graph.links[r]);
    return n
}

function edgeExists(t, e, n) {
    for (var r = !1, i = 0; i < n.links.length; i++) {
        var o = n.links[i];
        o.source.id == t.id ? o.target.id == e.id && (r = !0) : o.target.id == t.id && o.source.id == e.id && (r = !0)
    }
    return r
}

function spliceDuplicateEdges(t, e, n) {
    for (var r = 0, i = 0; i < n.links.length; i++) {
        var o = n.links[i];
        o.source.id == t.id && o.target.id == e.id && r++, o.target.id == t.id && o.source.id == e.id && r++, r > 1 && (r = 1, n.links.splice(i, 1))
    }
    return r
}

function removeVaccinatedNodes(t) {
    for (var e = [], n = 0; n < t.nodes.length; n++) "V" != t.nodes[n].status && "Q" != t.nodes[n].status && "VOL" != t.nodes[n].status && e.push(t.nodes[n]);
    return e
}

function removeOldLinks(t) {
    for (var e = [], n = 0; n < t.links.length; n++) "V" != t.links[n].source.status && "V" != t.links[n].target.status && "R" != t.links[n].source.status && "R" != t.links[n].target.status && "Q" != t.links[n].source.status && "Q" != t.links[n].target.status && 1 != t.links[n].remove && e.push(t.links[n]);
    return e
}

function assignEdgeListsToNodes(t) {
    for (var e = 0; e < t.nodes.length; e++)
        for (var n = t.nodes[e], r = 0; r < t.links.length; r++) {
            var i = t.links[r];
            (i.source == n || i.target == n) && n.edges.push(i)
        }
    return t
}

function updateCommunities() {
    twine = [], twineIndex = 0, groupCounter = 1;
    for (var t = 0; t < graph.nodes.length; t++) {
        var e = graph.nodes[t];
        e.group = null, e.marked = !1
    }
    assignGroups()
}

function assignGroups() {
    for (;;) {
        var t = getUnmarkedUngroupedNodes();
        if (0 == t.length) {
            numberOfCommunities = groupCounter - 1;
            break
        }
        pacMan(t[0]) && 0 != t.length && groupCounter++
    }
}

function getUnmarkedUngroupedNodes() {
    for (var t = [], e = 0; e < graph.nodes.length; e++) {
        var n = graph.nodes[e];
        0 == n.marked && t.push(n)
    }
    return t
}

function pacMan(t) {
    t.group = groupCounter;
    var e = null;
    if (null != t && !t.marked) {
        t.marked = !0, t.group = groupCounter, twine.push(t);
        for (var n = degree(t), r = findNeighbors(t), i = 0; n > i; i++) {
            var o = r[i];
            o.marked || (e = o, pacMan(e))
        }
    }
    return null != t || 0 == twineIndex ? !0 : (twineIndex = -1, e = twine[twineIndex], pacMan(e), void 0)
}

function findLargestCommunity() {
    communities = [];
    for (var t = 0; groupCounter > t; t++) communities[t] = 0;
    for (var e = 0; groupCounter > e; e++)
        for (var n = 0; n < graph.nodes.length; n++) graph.nodes[n].group == e && communities[e]++;
    largestCommunity = Array.max(communities)
}

function convertGraphForNetX(t) {
    for (var e = [], n = [], r = jsnx.Graph(), i = 0; i < t.nodes.length; i++) e.push(t.nodes[i].id);
    for (var o = 0; o < t.links.length; o++) {
        var a = [];
        a.push(t.links[o].source.id), a.push(t.links[o].target.id), n.push(a)
    }
    return r.add_nodes_from(e), r.add_edges_from(n), r
}

function assignDegree() {
    for (var t = 0; t < graph.nodes.length; t++) graph.nodes[t].degree = degree(graph.nodes[t])
}

function computeBetweennessCentrality() {
    G = convertGraphForNetX(graph);
    for (var t = jsnx.betweenness_centrality(G), e = 0; e < graph.nodes.length; e++) 0 == t[e] && (t[e] = 1e-4), graph.nodes[e].bcScore = t[e];
    return t
}

function shuffle(t) {
    for (var e, n, r = t.length; r; e = Math.floor(Math.random() * r), n = t[--r], t[r] = t[e], t[e] = n);
    return t
}

function getTailoredNodes() {
    for (var t = [], e = 0; 13 > e; e++) {
        var n = {
            id: e + 13,
            status: "S",
            group: null,
            edges: [],
            marked: !1,
            degree: null,
            bcScore: null,
            exposureTimestep: null,
            infectedBy: null
        };
        t.push(n)
    }
    return t
}

function cleanup(t, e) {
    var n = [],
        r = {};
    for (var i in t) r[t[i][e]] = t[i];
    for (i in r) n.push(r[i]);
    return n
}

function getTailoredLinks() {
    var t = [];
    return t = [{
        source: tailoredNodes[0],
        target: tailoredNodes[1],
        remove: !1
    }, {
        source: tailoredNodes[0],
        target: tailoredNodes[4],
        remove: !1
    }, {
        source: tailoredNodes[0],
        target: tailoredNodes[5],
        remove: !1
    }, {
        source: tailoredNodes[0],
        target: tailoredNodes[12],
        remove: !1
    }, {
        source: tailoredNodes[1],
        target: tailoredNodes[0],
        remove: !1
    }, {
        source: tailoredNodes[1],
        target: tailoredNodes[12],
        remove: !1
    }, {
        source: tailoredNodes[1],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[1],
        target: tailoredNodes[7],
        remove: !1
    }, {
        source: tailoredNodes[1],
        target: tailoredNodes[10],
        remove: !1
    }, {
        source: tailoredNodes[4],
        target: tailoredNodes[0],
        remove: !1
    }, {
        source: tailoredNodes[4],
        target: tailoredNodes[5],
        remove: !1
    }, {
        source: tailoredNodes[4],
        target: tailoredNodes[6],
        remove: !1
    }, {
        source: tailoredNodes[5],
        target: tailoredNodes[0],
        remove: !1
    }, {
        source: tailoredNodes[5],
        target: tailoredNodes[4],
        remove: !1
    }, {
        source: tailoredNodes[5],
        target: tailoredNodes[6],
        remove: !1
    }, {
        source: tailoredNodes[12],
        target: tailoredNodes[0],
        remove: !1
    }, {
        source: tailoredNodes[12],
        target: tailoredNodes[1],
        remove: !1
    }, {
        source: tailoredNodes[12],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[12],
        target: tailoredNodes[3],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[1],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[12],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[10],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[3],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[8],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[9],
        remove: !1
    }, {
        source: tailoredNodes[2],
        target: tailoredNodes[11],
        remove: !1
    }, {
        source: tailoredNodes[7],
        target: tailoredNodes[1],
        remove: !1
    }, {
        source: tailoredNodes[10],
        target: tailoredNodes[1],
        remove: !1
    }, {
        source: tailoredNodes[10],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[10],
        target: tailoredNodes[8],
        remove: !1
    }, {
        source: tailoredNodes[3],
        target: tailoredNodes[12],
        remove: !1
    }, {
        source: tailoredNodes[3],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[3],
        target: tailoredNodes[8],
        remove: !1
    }, {
        source: tailoredNodes[3],
        target: tailoredNodes[6],
        remove: !1
    }, {
        source: tailoredNodes[8],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[8],
        target: tailoredNodes[10],
        remove: !1
    }, {
        source: tailoredNodes[8],
        target: tailoredNodes[3],
        remove: !1
    }, {
        source: tailoredNodes[8],
        target: tailoredNodes[9],
        remove: !1
    }, {
        source: tailoredNodes[9],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[9],
        target: tailoredNodes[8],
        remove: !1
    }, {
        source: tailoredNodes[11],
        target: tailoredNodes[2],
        remove: !1
    }, {
        source: tailoredNodes[6],
        target: tailoredNodes[4],
        remove: !1
    }, {
        source: tailoredNodes[6],
        target: tailoredNodes[5],
        remove: !1
    }, {
        source: tailoredNodes[6],
        target: tailoredNodes[3],
        remove: !1
    }]
}

function getWeakTieNodes() {
    for (var t = [], e = 0; 30 > e; e++) {
        var n = {
            id: e,
            status: "S",
            group: null,
            edges: [],
            marked: !1,
            degree: null,
            bcScore: null,
            exposureTimestep: null,
            infectedBy: null
        };
        t.push(n)
    }
    return t
}

function getWeakTieLinks() {
    var t = [{
        source: weakTieNodes[1],
        target: weakTieNodes[3],
        remove: !1
    }, {
        source: weakTieNodes[3],
        target: weakTieNodes[6],
        remove: !1
    }, {
        source: weakTieNodes[4],
        target: weakTieNodes[1],
        remove: !1
    }, {
        source: weakTieNodes[4],
        target: weakTieNodes[2],
        remove: !1
    }, {
        source: weakTieNodes[4],
        target: weakTieNodes[3],
        remove: !1
    }, {
        source: weakTieNodes[4],
        target: weakTieNodes[8],
        remove: !1
    }, {
        source: weakTieNodes[4],
        target: weakTieNodes[9],
        remove: !1
    }, {
        source: weakTieNodes[5],
        target: weakTieNodes[16],
        remove: !1
    }, {
        source: weakTieNodes[6],
        target: weakTieNodes[1],
        remove: !1
    }, {
        source: weakTieNodes[8],
        target: weakTieNodes[12],
        remove: !1
    }, {
        source: weakTieNodes[8],
        target: weakTieNodes[13],
        remove: !1
    }, {
        source: weakTieNodes[9],
        target: weakTieNodes[15],
        remove: !1
    }, {
        source: weakTieNodes[10],
        target: weakTieNodes[6],
        remove: !1
    }, {
        source: weakTieNodes[10],
        target: weakTieNodes[18],
        remove: !1
    }, {
        source: weakTieNodes[12],
        target: weakTieNodes[2],
        remove: !1
    }, {
        source: weakTieNodes[12],
        target: weakTieNodes[9],
        remove: !1
    }, {
        source: weakTieNodes[13],
        target: weakTieNodes[2],
        remove: !1
    }, {
        source: weakTieNodes[13],
        target: weakTieNodes[17],
        remove: !1
    }, {
        source: weakTieNodes[14],
        target: weakTieNodes[13],
        remove: !1
    }, {
        source: weakTieNodes[14],
        target: weakTieNodes[15],
        remove: !1
    }, {
        source: weakTieNodes[15],
        target: weakTieNodes[2],
        remove: !1
    }, {
        source: weakTieNodes[15],
        target: weakTieNodes[5],
        remove: !1
    }, {
        source: weakTieNodes[16],
        target: weakTieNodes[14],
        remove: !1
    }, {
        source: weakTieNodes[16],
        target: weakTieNodes[17],
        remove: !1
    }, {
        source: weakTieNodes[18],
        target: weakTieNodes[19],
        remove: !1
    }, {
        source: weakTieNodes[19],
        target: weakTieNodes[10],
        remove: !1
    }, {
        source: weakTieNodes[19],
        target: weakTieNodes[24],
        remove: !1
    }, {
        source: weakTieNodes[19],
        target: weakTieNodes[28],
        remove: !1
    }, {
        source: weakTieNodes[21],
        target: weakTieNodes[23],
        remove: !1
    }, {
        source: weakTieNodes[21],
        target: weakTieNodes[28],
        remove: !1
    }, {
        source: weakTieNodes[22],
        target: weakTieNodes[18],
        remove: !1
    }, {
        source: weakTieNodes[23],
        target: weakTieNodes[19],
        remove: !1
    }, {
        source: weakTieNodes[23],
        target: weakTieNodes[22],
        remove: !1
    }, {
        source: weakTieNodes[24],
        target: weakTieNodes[26],
        remove: !1
    }, {
        source: weakTieNodes[28],
        target: weakTieNodes[24],
        remove: !1
    }, {
        source: weakTieNodes[29],
        target: weakTieNodes[26],
        remove: !1
    }];
    return t
}

function generateFrontGraph() {
    var t = -3e4;
    frontGraph = {}, frontNodes = [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2
        }, {
            id: 3
        }], frontLinks = [{
            source: frontNodes[0],
            target: frontNodes[1]
        }, {
            source: frontNodes[1],
            target: frontNodes[2]
        }, {
            source: frontNodes[2],
            target: frontNodes[0]
        }, {
            source: frontNodes[1],
            target: frontNodes[3]
        }], frontGraph.nodes = frontNodes, frontGraph.links = frontLinks, frontForce = d3.layout.force()
        .nodes(frontGraph.nodes)
        .links(frontGraph.links)
        .size([width, height])
        .charge(t)
        .friction(.8)
        .on("tick", frontTick)
        .start(), frontLink = homeSVG.selectAll(".link")
        .data(frontGraph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("fill", "#707070")
        .style("stroke-width", "10px")
        .style("stroke", "#d5d5d5"), frontNode = homeSVG.selectAll(".node")
        .data(frontGraph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 50)
        .style("stroke", "#b7b7b7")
        .style("stroke-width", "10px")
        .attr("fill", function(t) {
            return 3 == t.id ? "#f1d2d2" : "#d5d5d5"
        })
        .call(frontForce.drag)
}

function frontTick() {
    frontNode.attr("cx", function(t) {
            return t.x = Math.max(8, Math.min(width - 50, t.x))
        })
        .attr("cy", function(t) {
            return t.y = Math.max(8, Math.min(450, t.y))
        }), frontLink.attr("x1", function(t) {
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
        })
}

function selectIndexCase() {
    var t = graph.nodes.length,
        e = 0;
    do {
        var n = Math.floor(Math.random() * t),
            r = graph.nodes[n];
        e++
    } while ("V" == r.status && 500 > e);
    500 == e && (r.status = "S"), this.indexCase = null, this.indexCase = r, infectIndividual(this.indexCase)
}

function infectIndividual(t) {
    ("S" == t.status || "REF" == t.status) && (t.status = "I", t.exposureTimestep = this.timestep)
}

function exposeIndividual(t, e) {
    exposureEdges = [], ("S" == t.status || "REF" == t.status) && (t.status = "E", t.infectedBy = e);
    for (var n = 0; n < graph.links.length; n++) graph.links[n].source.id == e.id && graph.links[n].target.id == t.id ? exposureEdges.push(graph.links[n]) : graph.links[n].source.id == t.id && graph.links[n].target.id == e.id && exposureEdges.push(graph.links[n])
}

function updateExposures() {
    for (var t = [], e = 0; e < graph.nodes.length; e++) "E" == graph.nodes[e].status && (graph.nodes[e].status = "I", t.push(graph.nodes[e]), graph.nodes[e].exposureTimestep = this.timestep);
    return t
}

function infectedToRecovered(t) {
    if ("I" == t.status) {
        var e = this.timestep - t.exposureTimestep;
        if (Math.random() < 1 - Math.pow(1 - recoveryRate, e) || e > 10) {
            if (game) return;
            t.status = "R"
        }
    }
}

function forceRecovery(t) {
    "I" == t.status && (t.status = "R")
}

function stateChanges() {
    for (var t = 0; t < graph.nodes.length; t++) {
        var e = graph.nodes[t];
        infectedToRecovered(e)
    }
}

function infection() {
    transmissionRate = rerun ? 1 : .35;
    for (var t = 0, e = 0; e < graph.nodes.length; e++)
        if ("S" == graph.nodes[e].status) {
            for (var n = graph.nodes[e], r = findNeighbors(n), i = [], o = 0, a = 0; a < r.length; a++) {
                var u = r[a];
                "I" == u.status && (i.push(r[a]), o++)
            }
            var s = 1 - Math.pow(1 - transmissionRate, o);
            if (Math.random() < s) {
                t++;
                var l = shuffle(i),
                    c = l[0];
                exposeIndividual(n, c)
            }
        }
    if (t > 0) rerun = !1, transmissionRate = .35;
    else {
        if (game ? detectGameCompletion() : detectCompletion(), timeToStop) return;
        rerun = !0, transmissionRate = 1, infection()
    }
}

function infection_noGuaranteedTransmission() {
    for (var t = 0, e = 0; e < graph.nodes.length; e++)
        if ("S" == graph.nodes[e].status) {
            for (var n = graph.nodes[e], r = findNeighbors(n), i = [], o = 0, a = 0; a < r.length; a++) {
                var u = r[a];
                "I" == u.status && (i.push(r[a]), o++)
            }
            var s = 1 - Math.pow(1 - transmissionRate, o);
            if (Math.random() < s) {
                t++;
                var l = shuffle(i),
                    c = l[0];
                exposeIndividual(n, c)
            }
        }
}

function getStatuses(t) {
    for (var e = 0, n = 0, r = 0, i = 0, o = 0; o < graph.nodes.length; o++) {
        var a = graph.nodes[o];
        "S" == a.status && e++, "I" == a.status && n++, "R" == a.status && r++, "V" == a.status && i++
    }
    return "S" == t ? e : "I" == t ? n : "R" == t ? r : "V" == t ? i : void 0
}

function detectEndGame() {
    updateCommunities();
    for (var t = 0, e = 1; numberOfCommunities + 1 > e; e++) {
        for (var n = 0, r = 0, i = 0; i < graph.nodes.length; i++) {
            var o = graph.nodes[i];
            parseFloat(o.group) != e || ("S" == o.status && n++, "I" == o.status && r++, "E" == o.status && r++)
        }
        r > 0 && n > 0 && t++
    }
    0 == t && diseaseIsSpreading && (endGame = !0, diseaseIsSpreading = !1, timeToStop = !0, !vaccinateMode || quarantineMode || game || (animatePathogens_thenUpdate(), tutorialUpdate()))
}! function(t, e) {
    function n(t) {
        var e = t.length,
            n = se.type(t);
        return se.isWindow(t) ? !1 : 1 === t.nodeType && e ? !0 : "array" === n || "function" !== n && (0 === e || "number" == typeof e && e > 0 && e - 1 in t)
    }

    function r(t) {
        var e = ke[t] = {};
        return se.each(t.match(ce) || [], function(t, n) {
            e[n] = !0
        }), e
    }

    function i(t, n, r, i) {
        if (se.acceptData(t)) {
            var o, a, u = se.expando,
                s = "string" == typeof n,
                l = t.nodeType,
                c = l ? se.cache : t,
                f = l ? t[u] : t[u] && u;
            if (f && c[f] && (i || c[f].data) || !s || r !== e) return f || (l ? t[u] = f = K.pop() || se.guid++ : f = u), c[f] || (c[f] = {}, l || (c[f].toJSON = se.noop)), ("object" == typeof n || "function" == typeof n) && (i ? c[f] = se.extend(c[f], n) : c[f].data = se.extend(c[f].data, n)), o = c[f], i || (o.data || (o.data = {}), o = o.data), r !== e && (o[se.camelCase(n)] = r), s ? (a = o[n], null == a && (a = o[se.camelCase(n)])) : a = o, a
        }
    }

    function o(t, e, n) {
        if (se.acceptData(t)) {
            var r, i, o, a = t.nodeType,
                s = a ? se.cache : t,
                l = a ? t[se.expando] : se.expando;
            if (s[l]) {
                if (e && (o = n ? s[l] : s[l].data)) {
                    se.isArray(e) ? e = e.concat(se.map(e, se.camelCase)) : e in o ? e = [e] : (e = se.camelCase(e), e = e in o ? [e] : e.split(" "));
                    for (r = 0, i = e.length; i > r; r++) delete o[e[r]];
                    if (!(n ? u : se.isEmptyObject)(o)) return
                }(n || (delete s[l].data, u(s[l]))) && (a ? se.cleanData([t], !0) : se.support.deleteExpando || s != s.window ? delete s[l] : s[l] = null)
            }
        }
    }

    function a(t, n, r) {
        if (r === e && 1 === t.nodeType) {
            var i = "data-" + n.replace(Te, "-$1")
                .toLowerCase();
            if (r = t.getAttribute(i), "string" == typeof r) {
                try {
                    r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : Ne.test(r) ? se.parseJSON(r) : r
                } catch (o) {}
                se.data(t, n, r)
            } else r = e
        }
        return r
    }

    function u(t) {
        var e;
        for (e in t)
            if (("data" !== e || !se.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
        return !0
    }

    function s() {
        return !0
    }

    function l() {
        return !1
    }

    function c(t, e) {
        do t = t[e]; while (t && 1 !== t.nodeType);
        return t
    }

    function f(t, e, n) {
        if (e = e || 0, se.isFunction(e)) return se.grep(t, function(t, r) {
            var i = !!e.call(t, r, t);
            return i === n
        });
        if (e.nodeType) return se.grep(t, function(t) {
            return t === e === n
        });
        if ("string" == typeof e) {
            var r = se.grep(t, function(t) {
                return 1 === t.nodeType
            });
            if (We.test(e)) return se.filter(e, r, !n);
            e = se.filter(e, r)
        }
        return se.grep(t, function(t) {
            return se.inArray(t, e) >= 0 === n
        })
    }

    function h(t) {
        var e = Ue.split("|"),
            n = t.createDocumentFragment();
        if (n.createElement)
            for (; e.length;) n.createElement(e.pop());
        return n
    }

    function d(t, e) {
        return t.getElementsByTagName(e)[0] || t.appendChild(t.ownerDocument.createElement(e))
    }

    function p(t) {
        var e = t.getAttributeNode("type");
        return t.type = (e && e.specified) + "/" + t.type, t
    }

    function g(t) {
        var e = on.exec(t.type);
        return e ? t.type = e[1] : t.removeAttribute("type"), t
    }

    function m(t, e) {
        for (var n, r = 0; null != (n = t[r]); r++) se._data(n, "globalEval", !e || se._data(e[r], "globalEval"))
    }

    function v(t, e) {
        if (1 === e.nodeType && se.hasData(t)) {
            var n, r, i, o = se._data(t),
                a = se._data(e, o),
                u = o.events;
            if (u) {
                delete a.handle, a.events = {};
                for (n in u)
                    for (r = 0, i = u[n].length; i > r; r++) se.event.add(e, n, u[n][r])
            }
            a.data && (a.data = se.extend({}, a.data))
        }
    }

    function y(t, e) {
        var n, r, i;
        if (1 === e.nodeType) {
            if (n = e.nodeName.toLowerCase(), !se.support.noCloneEvent && e[se.expando]) {
                i = se._data(e);
                for (r in i.events) se.removeEvent(e, r, i.handle);
                e.removeAttribute(se.expando)
            }
            "script" === n && e.text !== t.text ? (p(e)
                .text = t.text, g(e)) : "object" === n ? (e.parentNode && (e.outerHTML = t.outerHTML), se.support.html5Clone && t.innerHTML && !se.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === n && en.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === n ? e.defaultSelected = e.selected = t.defaultSelected : ("input" === n || "textarea" === n) && (e.defaultValue = t.defaultValue)
        }
    }

    function b(t, n) {
        var r, i, o = 0,
            a = typeof t.getElementsByTagName !== Y ? t.getElementsByTagName(n || "*") : typeof t.querySelectorAll !== Y ? t.querySelectorAll(n || "*") : e;
        if (!a)
            for (a = [], r = t.childNodes || t; null != (i = r[o]); o++) !n || se.nodeName(i, n) ? a.push(i) : se.merge(a, b(i, n));
        return n === e || n && se.nodeName(t, n) ? se.merge([t], a) : a
    }

    function x(t) {
        en.test(t.type) && (t.defaultChecked = t.checked)
    }

    function M(t, e) {
        if (e in t) return e;
        for (var n = e.charAt(0)
                .toUpperCase() + e.slice(1), r = e, i = Tn.length; i--;)
            if (e = Tn[i] + n, e in t) return e;
        return r
    }

    function w(t, e) {
        return t = e || t, "none" === se.css(t, "display") || !se.contains(t.ownerDocument, t)
    }

    function k(t, e) {
        for (var n, r, i, o = [], a = 0, u = t.length; u > a; a++) r = t[a], r.style && (o[a] = se._data(r, "olddisplay"), n = r.style.display, e ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && w(r) && (o[a] = se._data(r, "olddisplay", _(r.nodeName)))) : o[a] || (i = w(r), (n && "none" !== n || !i) && se._data(r, "olddisplay", i ? n : se.css(r, "display"))));
        for (a = 0; u > a; a++) r = t[a], r.style && (e && "none" !== r.style.display && "" !== r.style.display || (r.style.display = e ? o[a] || "" : "none"));
        return t
    }

    function N(t, e, n) {
        var r = yn.exec(e);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : e
    }

    function T(t, e, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === e ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += se.css(t, n + Nn[o], !0, i)), r ? ("content" === n && (a -= se.css(t, "padding" + Nn[o], !0, i)), "margin" !== n && (a -= se.css(t, "border" + Nn[o] + "Width", !0, i))) : (a += se.css(t, "padding" + Nn[o], !0, i), "padding" !== n && (a += se.css(t, "border" + Nn[o] + "Width", !0, i)));
        return a
    }

    function S(t, e, n) {
        var r = !0,
            i = "width" === e ? t.offsetWidth : t.offsetHeight,
            o = fn(t),
            a = se.support.boxSizing && "border-box" === se.css(t, "boxSizing", !1, o);
        if (0 >= i || null == i) {
            if (i = hn(t, e, o), (0 > i || null == i) && (i = t.style[e]), bn.test(i)) return i;
            r = a && (se.support.boxSizingReliable || i === t.style[e]), i = parseFloat(i) || 0
        }
        return i + T(t, e, n || (a ? "border" : "content"), r, o) + "px"
    }

    function _(t) {
        var e = V,
            n = Mn[t];
        return n || (n = E(t, e), "none" !== n && n || (cn = (cn || se("<iframe frameborder='0' width='0' height='0'/>")
                .css("cssText", "display:block !important"))
            .appendTo(e.documentElement), e = (cn[0].contentWindow || cn[0].contentDocument)
            .document, e.write("<!doctype html><html><body>"), e.close(), n = E(t, e), cn.detach()), Mn[t] = n), n
    }

    function E(t, e) {
        var n = se(e.createElement(t))
            .appendTo(e.body),
            r = se.css(n[0], "display");
        return n.remove(), r
    }

    function C(t, e, n, r) {
        var i;
        if (se.isArray(e)) se.each(e, function(e, i) {
            n || _n.test(t) ? r(t, i) : C(t + "[" + ("object" == typeof i ? e : "") + "]", i, n, r)
        });
        else if (n || "object" !== se.type(e)) r(t, e);
        else
            for (i in e) C(t + "[" + i + "]", e[i], n, r)
    }

    function A(t) {
        return function(e, n) {
            "string" != typeof e && (n = e, e = "*");
            var r, i = 0,
                o = e.toLowerCase()
                .match(ce) || [];
            if (se.isFunction(n))
                for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (t[r] = t[r] || [])
                        .unshift(n)) : (t[r] = t[r] || [])
                    .push(n)
        }
    }

    function j(t, e, n, r) {
        function i(u) {
            var s;
            return o[u] = !0, se.each(t[u] || [], function(t, u) {
                var l = u(e, n, r);
                return "string" != typeof l || a || o[l] ? a ? !(s = l) : void 0 : (e.dataTypes.unshift(l), i(l), !1)
            }), s
        }
        var o = {},
            a = t === $n;
        return i(e.dataTypes[0]) || !o["*"] && i("*")
    }

    function D(t, n) {
        var r, i, o = se.ajaxSettings.flatOptions || {};
        for (i in n) n[i] !== e && ((o[i] ? t : r || (r = {}))[i] = n[i]);
        return r && se.extend(!0, t, r), t
    }

    function q(t, n, r) {
        var i, o, a, u, s = t.contents,
            l = t.dataTypes,
            c = t.responseFields;
        for (u in c) u in r && (n[c[u]] = r[u]);
        for (;
            "*" === l[0];) l.shift(), o === e && (o = t.mimeType || n.getResponseHeader("Content-Type"));
        if (o)
            for (u in s)
                if (s[u] && s[u].test(o)) {
                    l.unshift(u);
                    break
                }
        if (l[0] in r) a = l[0];
        else {
            for (u in r) {
                if (!l[0] || t.converters[u + " " + l[0]]) {
                    a = u;
                    break
                }
                i || (i = u)
            }
            a = a || i
        }
        return a ? (a !== l[0] && l.unshift(a), r[a]) : void 0
    }

    function L(t, e) {
        var n, r, i, o, a = {},
            u = 0,
            s = t.dataTypes.slice(),
            l = s[0];
        if (t.dataFilter && (e = t.dataFilter(e, t.dataType)), s[1])
            for (i in t.converters) a[i.toLowerCase()] = t.converters[i];
        for (; r = s[++u];)
            if ("*" !== r) {
                if ("*" !== l && l !== r) {
                    if (i = a[l + " " + r] || a["* " + r], !i)
                        for (n in a)
                            if (o = n.split(" "), o[1] === r && (i = a[l + " " + o[0]] || a["* " + o[0]])) {
                                i === !0 ? i = a[n] : a[n] !== !0 && (r = o[0], s.splice(u--, 0, r));
                                break
                            }
                    if (i !== !0)
                        if (i && t["throws"]) e = i(e);
                        else try {
                            e = i(e)
                        } catch (c) {
                            return {
                                state: "parsererror",
                                error: i ? c : "No conversion from " + l + " to " + r
                            }
                        }
                }
                l = r
            }
        return {
            state: "success",
            data: e
        }
    }

    function H() {
        try {
            return new t.XMLHttpRequest
        } catch (e) {}
    }

    function F() {
        try {
            return new t.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
    }

    function R() {
        return setTimeout(function() {
            Kn = e
        }), Kn = se.now()
    }

    function O(t, e) {
        se.each(e, function(e, n) {
            for (var r = (or[e] || [])
                    .concat(or["*"]), i = 0, o = r.length; o > i; i++)
                if (r[i].call(t, e, n)) return
        })
    }

    function z(t, e, n) {
        var r, i, o = 0,
            a = ir.length,
            u = se.Deferred()
            .always(function() {
                delete s.elem
            }),
            s = function() {
                if (i) return !1;
                for (var e = Kn || R(), n = Math.max(0, l.startTime + l.duration - e), r = n / l.duration || 0, o = 1 - r, a = 0, s = l.tweens.length; s > a; a++) l.tweens[a].run(o);
                return u.notifyWith(t, [l, o, n]), 1 > o && s ? n : (u.resolveWith(t, [l]), !1)
            },
            l = u.promise({
                elem: t,
                props: se.extend({}, e),
                opts: se.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: e,
                originalOptions: n,
                startTime: Kn || R(),
                duration: n.duration,
                tweens: [],
                createTween: function(e, n) {
                    var r = se.Tween(t, l.opts, e, n, l.opts.specialEasing[e] || l.opts.easing);
                    return l.tweens.push(r), r
                },
                stop: function(e) {
                    var n = 0,
                        r = e ? l.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) l.tweens[n].run(1);
                    return e ? u.resolveWith(t, [l, e]) : u.rejectWith(t, [l, e]), this
                }
            }),
            c = l.props;
        for (P(c, l.opts.specialEasing); a > o; o++)
            if (r = ir[o].call(l, t, c, l.opts)) return r;
        return O(l, c), se.isFunction(l.opts.start) && l.opts.start.call(t, l), se.fx.timer(se.extend(s, {
                elem: t,
                anim: l,
                queue: l.opts.queue
            })), l.progress(l.opts.progress)
            .done(l.opts.done, l.opts.complete)
            .fail(l.opts.fail)
            .always(l.opts.always)
    }

    function P(t, e) {
        var n, r, i, o, a;
        for (i in t)
            if (r = se.camelCase(i), o = e[r], n = t[i], se.isArray(n) && (o = n[1], n = t[i] = n[0]), i !== r && (t[r] = n, delete t[i]), a = se.cssHooks[r], a && "expand" in a) {
                n = a.expand(n), delete t[r];
                for (i in n) i in t || (t[i] = n[i], e[i] = o)
            } else e[r] = o
    }

    function I(t, e, n) {
        var r, i, o, a, u, s, l, c, f, h = this,
            d = t.style,
            p = {},
            g = [],
            m = t.nodeType && w(t);
        n.queue || (c = se._queueHooks(t, "fx"), null == c.unqueued && (c.unqueued = 0, f = c.empty.fire, c.empty.fire = function() {
            c.unqueued || f()
        }), c.unqueued++, h.always(function() {
            h.always(function() {
                c.unqueued--, se.queue(t, "fx")
                    .length || c.empty.fire()
            })
        })), 1 === t.nodeType && ("height" in e || "width" in e) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], "inline" === se.css(t, "display") && "none" === se.css(t, "float") && (se.support.inlineBlockNeedsLayout && "inline" !== _(t.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", se.support.shrinkWrapBlocks || h.always(function() {
            d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
        }));
        for (i in e)
            if (a = e[i], er.exec(a)) {
                if (delete e[i], s = s || "toggle" === a, a === (m ? "hide" : "show")) continue;
                g.push(i)
            }
        if (o = g.length) {
            u = se._data(t, "fxshow") || se._data(t, "fxshow", {}), "hidden" in u && (m = u.hidden), s && (u.hidden = !m), m ? se(t)
                .show() : h.done(function() {
                    se(t)
                        .hide()
                }), h.done(function() {
                    var e;
                    se._removeData(t, "fxshow");
                    for (e in p) se.style(t, e, p[e])
                });
            for (i = 0; o > i; i++) r = g[i], l = h.createTween(r, m ? u[r] : 0), p[r] = u[r] || se.style(t, r), r in u || (u[r] = l.start, m && (l.end = l.start, l.start = "width" === r || "height" === r ? 1 : 0))
        }
    }

    function B(t, e, n, r, i) {
        return new B.prototype.init(t, e, n, r, i)
    }

    function W(t, e) {
        var n, r = {
                height: t
            },
            i = 0;
        for (e = e ? 1 : 0; 4 > i; i += 2 - e) n = Nn[i], r["margin" + n] = r["padding" + n] = t;
        return e && (r.opacity = r.width = t), r
    }

    function $(t) {
        return se.isWindow(t) ? t : 9 === t.nodeType ? t.defaultView || t.parentWindow : !1
    }
    var X, U, Y = typeof e,
        V = t.document,
        G = t.location,
        Z = t.jQuery,
        J = t.$,
        Q = {},
        K = [],
        te = "1.9.1",
        ee = K.concat,
        ne = K.push,
        re = K.slice,
        ie = K.indexOf,
        oe = Q.toString,
        ae = Q.hasOwnProperty,
        ue = te.trim,
        se = function(t, e) {
            return new se.fn.init(t, e, U)
        },
        le = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ce = /\S+/g,
        fe = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        he = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        de = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        pe = /^[\],:{}\s]*$/,
        ge = /(?:^|:|,)(?:\s*\[)+/g,
        me = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        ve = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
        ye = /^-ms-/,
        be = /-([\da-z])/gi,
        xe = function(t, e) {
            return e.toUpperCase()
        },
        Me = function(t) {
            (V.addEventListener || "load" === t.type || "complete" === V.readyState) && (we(), se.ready())
        },
        we = function() {
            V.addEventListener ? (V.removeEventListener("DOMContentLoaded", Me, !1), t.removeEventListener("load", Me, !1)) : (V.detachEvent("onreadystatechange", Me), t.detachEvent("onload", Me))
        };
    se.fn = se.prototype = {
        jquery: te,
        constructor: se,
        init: function(t, n, r) {
            var i, o;
            if (!t) return this;
            if ("string" == typeof t) {
                if (i = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : he.exec(t), !i || !i[1] && n) return !n || n.jquery ? (n || r)
                    .find(t) : this.constructor(n)
                    .find(t);
                if (i[1]) {
                    if (n = n instanceof se ? n[0] : n, se.merge(this, se.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : V, !0)), de.test(i[1]) && se.isPlainObject(n))
                        for (i in n) se.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                    return this
                }
                if (o = V.getElementById(i[2]), o && o.parentNode) {
                    if (o.id !== i[2]) return r.find(t);
                    this.length = 1, this[0] = o
                }
                return this.context = V, this.selector = t, this
            }
            return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : se.isFunction(t) ? r.ready(t) : (t.selector !== e && (this.selector = t.selector, this.context = t.context), se.makeArray(t, this))
        },
        selector: "",
        length: 0,
        size: function() {
            return this.length
        },
        toArray: function() {
            return re.call(this)
        },
        get: function(t) {
            return null == t ? this.toArray() : 0 > t ? this[this.length + t] : this[t]
        },
        pushStack: function(t) {
            var e = se.merge(this.constructor(), t);
            return e.prevObject = this, e.context = this.context, e
        },
        each: function(t, e) {
            return se.each(this, t, e)
        },
        ready: function(t) {
            return se.ready.promise()
                .done(t), this
        },
        slice: function() {
            return this.pushStack(re.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(t) {
            var e = this.length,
                n = +t + (0 > t ? e : 0);
            return this.pushStack(n >= 0 && e > n ? [this[n]] : [])
        },
        map: function(t) {
            return this.pushStack(se.map(this, function(e, n) {
                return t.call(e, n, e)
            }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: ne,
        sort: [].sort,
        splice: [].splice
    }, se.fn.init.prototype = se.fn, se.extend = se.fn.extend = function() {
        var t, n, r, i, o, a, u = arguments[0] || {},
            s = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof u && (c = u, u = arguments[1] || {}, s = 2), "object" == typeof u || se.isFunction(u) || (u = {}), l === s && (u = this, --s); l > s; s++)
            if (null != (o = arguments[s]))
                for (i in o) t = u[i], r = o[i], u !== r && (c && r && (se.isPlainObject(r) || (n = se.isArray(r))) ? (n ? (n = !1, a = t && se.isArray(t) ? t : []) : a = t && se.isPlainObject(t) ? t : {}, u[i] = se.extend(c, a, r)) : r !== e && (u[i] = r));
        return u
    }, se.extend({
        noConflict: function(e) {
            return t.$ === se && (t.$ = J), e && t.jQuery === se && (t.jQuery = Z), se
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(t) {
            t ? se.readyWait++ : se.ready(!0)
        },
        ready: function(t) {
            if (t === !0 ? !--se.readyWait : !se.isReady) {
                if (!V.body) return setTimeout(se.ready);
                se.isReady = !0, t !== !0 && --se.readyWait > 0 || (X.resolveWith(V, [se]), se.fn.trigger && se(V)
                    .trigger("ready")
                    .off("ready"))
            }
        },
        isFunction: function(t) {
            return "function" === se.type(t)
        },
        isArray: Array.isArray || function(t) {
            return "array" === se.type(t)
        },
        isWindow: function(t) {
            return null != t && t == t.window
        },
        isNumeric: function(t) {
            return !isNaN(parseFloat(t)) && isFinite(t)
        },
        type: function(t) {
            return null == t ? String(t) : "object" == typeof t || "function" == typeof t ? Q[oe.call(t)] || "object" : typeof t
        },
        isPlainObject: function(t) {
            if (!t || "object" !== se.type(t) || t.nodeType || se.isWindow(t)) return !1;
            try {
                if (t.constructor && !ae.call(t, "constructor") && !ae.call(t.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            var r;
            for (r in t);
            return r === e || ae.call(t, r)
        },
        isEmptyObject: function(t) {
            var e;
            for (e in t) return !1;
            return !0
        },
        error: function(t) {
            throw new Error(t)
        },
        parseHTML: function(t, e, n) {
            if (!t || "string" != typeof t) return null;
            "boolean" == typeof e && (n = e, e = !1), e = e || V;
            var r = de.exec(t),
                i = !n && [];
            return r ? [e.createElement(r[1])] : (r = se.buildFragment([t], e, i), i && se(i)
                .remove(), se.merge([], r.childNodes))
        },
        parseJSON: function(e) {
            return t.JSON && t.JSON.parse ? t.JSON.parse(e) : null === e ? e : "string" == typeof e && (e = se.trim(e), e && pe.test(e.replace(me, "@")
                .replace(ve, "]")
                .replace(ge, ""))) ? new Function("return " + e)() : (se.error("Invalid JSON: " + e), void 0)
        },
        parseXML: function(n) {
            var r, i;
            if (!n || "string" != typeof n) return null;
            try {
                t.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
            } catch (o) {
                r = e
            }
            return r && r.documentElement && !r.getElementsByTagName("parsererror")
                .length || se.error("Invalid XML: " + n), r
        },
        noop: function() {},
        globalEval: function(e) {
            e && se.trim(e) && (t.execScript || function(e) {
                t.eval.call(t, e)
            })(e)
        },
        camelCase: function(t) {
            return t.replace(ye, "ms-")
                .replace(be, xe)
        },
        nodeName: function(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        },
        each: function(t, e, r) {
            var i, o = 0,
                a = t.length,
                u = n(t);
            if (r) {
                if (u)
                    for (; a > o && (i = e.apply(t[o], r), i !== !1); o++);
                else
                    for (o in t)
                        if (i = e.apply(t[o], r), i === !1) break
            } else if (u)
                for (; a > o && (i = e.call(t[o], o, t[o]), i !== !1); o++);
            else
                for (o in t)
                    if (i = e.call(t[o], o, t[o]), i === !1) break;
            return t
        },
        trim: ue && !ue.call("ï»¿Â ") ? function(t) {
            return null == t ? "" : ue.call(t)
        } : function(t) {
            return null == t ? "" : (t + "")
                .replace(fe, "")
        },
        makeArray: function(t, e) {
            var r = e || [];
            return null != t && (n(Object(t)) ? se.merge(r, "string" == typeof t ? [t] : t) : ne.call(r, t)), r
        },
        inArray: function(t, e, n) {
            var r;
            if (e) {
                if (ie) return ie.call(e, t, n);
                for (r = e.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)
                    if (n in e && e[n] === t) return n
            }
            return -1
        },
        merge: function(t, n) {
            var r = n.length,
                i = t.length,
                o = 0;
            if ("number" == typeof r)
                for (; r > o; o++) t[i++] = n[o];
            else
                for (; n[o] !== e;) t[i++] = n[o++];
            return t.length = i, t
        },
        grep: function(t, e, n) {
            var r, i = [],
                o = 0,
                a = t.length;
            for (n = !!n; a > o; o++) r = !!e(t[o], o), n !== r && i.push(t[o]);
            return i
        },
        map: function(t, e, r) {
            var i, o = 0,
                a = t.length,
                u = n(t),
                s = [];
            if (u)
                for (; a > o; o++) i = e(t[o], o, r), null != i && (s[s.length] = i);
            else
                for (o in t) i = e(t[o], o, r), null != i && (s[s.length] = i);
            return ee.apply([], s)
        },
        guid: 1,
        proxy: function(t, n) {
            var r, i, o;
            return "string" == typeof n && (o = t[n], n = t, t = o), se.isFunction(t) ? (r = re.call(arguments, 2), i = function() {
                return t.apply(n || this, r.concat(re.call(arguments)))
            }, i.guid = t.guid = t.guid || se.guid++, i) : e
        },
        access: function(t, n, r, i, o, a, u) {
            var s = 0,
                l = t.length,
                c = null == r;
            if ("object" === se.type(r)) {
                o = !0;
                for (s in r) se.access(t, n, s, r[s], !0, a, u)
            } else if (i !== e && (o = !0, se.isFunction(i) || (u = !0), c && (u ? (n.call(t, i), n = null) : (c = n, n = function(t, e, n) {
                    return c.call(se(t), n)
                })), n))
                for (; l > s; s++) n(t[s], r, u ? i : i.call(t[s], s, n(t[s], r)));
            return o ? t : c ? n.call(t) : l ? n(t[0], r) : a
        },
        now: function() {
            return (new Date)
                .getTime()
        }
    }), se.ready.promise = function(e) {
        if (!X)
            if (X = se.Deferred(), "complete" === V.readyState) setTimeout(se.ready);
            else if (V.addEventListener) V.addEventListener("DOMContentLoaded", Me, !1), t.addEventListener("load", Me, !1);
        else {
            V.attachEvent("onreadystatechange", Me), t.attachEvent("onload", Me);
            var n = !1;
            try {
                n = null == t.frameElement && V.documentElement
            } catch (r) {}
            n && n.doScroll && function i() {
                if (!se.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (t) {
                        return setTimeout(i, 50)
                    }
                    we(), se.ready()
                }
            }()
        }
        return X.promise(e)
    }, se.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
        Q["[object " + e + "]"] = e.toLowerCase()
    }), U = se(V);
    var ke = {};
    se.Callbacks = function(t) {
        t = "string" == typeof t ? ke[t] || r(t) : se.extend({}, t);
        var n, i, o, a, u, s, l = [],
            c = !t.once && [],
            f = function(e) {
                for (i = t.memory && e, o = !0, u = s || 0, s = 0, a = l.length, n = !0; l && a > u; u++)
                    if (l[u].apply(e[0], e[1]) === !1 && t.stopOnFalse) {
                        i = !1;
                        break
                    }
                n = !1, l && (c ? c.length && f(c.shift()) : i ? l = [] : h.disable())
            },
            h = {
                add: function() {
                    if (l) {
                        var e = l.length;
                        ! function r(e) {
                            se.each(e, function(e, n) {
                                var i = se.type(n);
                                "function" === i ? t.unique && h.has(n) || l.push(n) : n && n.length && "string" !== i && r(n)
                            })
                        }(arguments), n ? a = l.length : i && (s = e, f(i))
                    }
                    return this
                },
                remove: function() {
                    return l && se.each(arguments, function(t, e) {
                        for (var r;
                            (r = se.inArray(e, l, r)) > -1;) l.splice(r, 1), n && (a >= r && a--, u >= r && u--)
                    }), this
                },
                has: function(t) {
                    return t ? se.inArray(t, l) > -1 : !(!l || !l.length)
                },
                empty: function() {
                    return l = [], this
                },
                disable: function() {
                    return l = c = i = e, this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return c = e, i || h.disable(), this
                },
                locked: function() {
                    return !c
                },
                fireWith: function(t, e) {
                    return e = e || [], e = [t, e.slice ? e.slice() : e], !l || o && !c || (n ? c.push(e) : f(e)), this
                },
                fire: function() {
                    return h.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!o
                }
            };
        return h
    }, se.extend({
        Deferred: function(t) {
            var e = [
                    ["resolve", "done", se.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", se.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", se.Callbacks("memory")]
                ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments)
                            .fail(arguments), this
                    },
                    then: function() {
                        var t = arguments;
                        return se.Deferred(function(n) {
                                se.each(e, function(e, o) {
                                    var a = o[0],
                                        u = se.isFunction(t[e]) && t[e];
                                    i[o[1]](function() {
                                        var t = u && u.apply(this, arguments);
                                        t && se.isFunction(t.promise) ? t.promise()
                                            .done(n.resolve)
                                            .fail(n.reject)
                                            .progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, u ? [t] : arguments)
                                    })
                                }), t = null
                            })
                            .promise()
                    },
                    promise: function(t) {
                        return null != t ? se.extend(t, r) : r
                    }
                },
                i = {};
            return r.pipe = r.then, se.each(e, function(t, o) {
                var a = o[2],
                    u = o[3];
                r[o[1]] = a.add, u && a.add(function() {
                    n = u
                }, e[1 ^ t][2].disable, e[2][2].lock), i[o[0]] = function() {
                    return i[o[0] + "With"](this === i ? r : this, arguments), this
                }, i[o[0] + "With"] = a.fireWith
            }), r.promise(i), t && t.call(i, i), i
        },
        when: function(t) {
            var e, n, r, i = 0,
                o = re.call(arguments),
                a = o.length,
                u = 1 !== a || t && se.isFunction(t.promise) ? a : 0,
                s = 1 === u ? t : se.Deferred(),
                l = function(t, n, r) {
                    return function(i) {
                        n[t] = this, r[t] = arguments.length > 1 ? re.call(arguments) : i, r === e ? s.notifyWith(n, r) : --u || s.resolveWith(n, r)
                    }
                };
            if (a > 1)
                for (e = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && se.isFunction(o[i].promise) ? o[i].promise()
                    .done(l(i, r, o))
                    .fail(s.reject)
                    .progress(l(i, n, e)) : --u;
            return u || s.resolveWith(r, o), s.promise()
        }
    }), se.support = function() {
        var e, n, r, i, o, a, u, s, l, c, f = V.createElement("div");
        if (f.setAttribute("className", "t"), f.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = f.getElementsByTagName("*"), r = f.getElementsByTagName("a")[0], !n || !r || !n.length) return {};
        o = V.createElement("select"), u = o.appendChild(V.createElement("option")), i = f.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", e = {
                getSetAttribute: "t" !== f.className,
                leadingWhitespace: 3 === f.firstChild.nodeType,
                tbody: !f.getElementsByTagName("tbody")
                    .length,
                htmlSerialize: !!f.getElementsByTagName("link")
                    .length,
                style: /top/.test(r.getAttribute("style")),
                hrefNormalized: "/a" === r.getAttribute("href"),
                opacity: /^0.5/.test(r.style.opacity),
                cssFloat: !!r.style.cssFloat,
                checkOn: !!i.value,
                optSelected: u.selected,
                enctype: !!V.createElement("form")
                    .enctype,
                html5Clone: "<:nav></:nav>" !== V.createElement("nav")
                    .cloneNode(!0)
                    .outerHTML,
                boxModel: "CSS1Compat" === V.compatMode,
                deleteExpando: !0,
                noCloneEvent: !0,
                inlineBlockNeedsLayout: !1,
                shrinkWrapBlocks: !1,
                reliableMarginRight: !0,
                boxSizingReliable: !0,
                pixelPosition: !1
            }, i.checked = !0, e.noCloneChecked = i.cloneNode(!0)
            .checked, o.disabled = !0, e.optDisabled = !u.disabled;
        try {
            delete f.test
        } catch (h) {
            e.deleteExpando = !1
        }
        i = V.createElement("input"), i.setAttribute("value", ""), e.input = "" === i.getAttribute("value"), i.value = "t", i.setAttribute("type", "radio"), e.radioValue = "t" === i.value, i.setAttribute("checked", "t"), i.setAttribute("name", "t"), a = V.createDocumentFragment(), a.appendChild(i), e.appendChecked = i.checked, e.checkClone = a.cloneNode(!0)
            .cloneNode(!0)
            .lastChild.checked, f.attachEvent && (f.attachEvent("onclick", function() {
                    e.noCloneEvent = !1
                }), f.cloneNode(!0)
                .click());
        for (c in {
                submit: !0,
                change: !0,
                focusin: !0
            }) f.setAttribute(s = "on" + c, "t"), e[c + "Bubbles"] = s in t || f.attributes[s].expando === !1;
        return f.style.backgroundClip = "content-box", f.cloneNode(!0)
            .style.backgroundClip = "", e.clearCloneStyle = "content-box" === f.style.backgroundClip, se(function() {
                var n, r, i, o = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                    a = V.getElementsByTagName("body")[0];
                a && (n = V.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", a.appendChild(n)
                    .appendChild(f), f.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = f.getElementsByTagName("td"), i[0].style.cssText = "padding:0;margin:0;border:0;display:none", l = 0 === i[0].offsetHeight, i[0].style.display = "", i[1].style.display = "none", e.reliableHiddenOffsets = l && 0 === i[0].offsetHeight, f.innerHTML = "", f.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", e.boxSizing = 4 === f.offsetWidth, e.doesNotIncludeMarginInBodyOffset = 1 !== a.offsetTop, t.getComputedStyle && (e.pixelPosition = "1%" !== (t.getComputedStyle(f, null) || {})
                        .top, e.boxSizingReliable = "4px" === (t.getComputedStyle(f, null) || {
                            width: "4px"
                        })
                        .width, r = f.appendChild(V.createElement("div")), r.style.cssText = f.style.cssText = o, r.style.marginRight = r.style.width = "0", f.style.width = "1px", e.reliableMarginRight = !parseFloat((t.getComputedStyle(r, null) || {})
                            .marginRight)), typeof f.style.zoom !== Y && (f.innerHTML = "", f.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", e.inlineBlockNeedsLayout = 3 === f.offsetWidth, f.style.display = "block", f.innerHTML = "<div></div>", f.firstChild.style.width = "5px", e.shrinkWrapBlocks = 3 !== f.offsetWidth, e.inlineBlockNeedsLayout && (a.style.zoom = 1)), a.removeChild(n), n = f = i = r = null)
            }), n = o = a = u = r = i = null, e
    }();
    var Ne = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        Te = /([A-Z])/g;
    se.extend({
        cache: {},
        expando: "jQuery" + (te + Math.random())
            .replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(t) {
            return t = t.nodeType ? se.cache[t[se.expando]] : t[se.expando], !!t && !u(t)
        },
        data: function(t, e, n) {
            return i(t, e, n)
        },
        removeData: function(t, e) {
            return o(t, e)
        },
        _data: function(t, e, n) {
            return i(t, e, n, !0)
        },
        _removeData: function(t, e) {
            return o(t, e, !0)
        },
        acceptData: function(t) {
            if (t.nodeType && 1 !== t.nodeType && 9 !== t.nodeType) return !1;
            var e = t.nodeName && se.noData[t.nodeName.toLowerCase()];
            return !e || e !== !0 && t.getAttribute("classid") === e
        }
    }), se.fn.extend({
        data: function(t, n) {
            var r, i, o = this[0],
                u = 0,
                s = null;
            if (t === e) {
                if (this.length && (s = se.data(o), 1 === o.nodeType && !se._data(o, "parsedAttrs"))) {
                    for (r = o.attributes; u < r.length; u++) i = r[u].name, i.indexOf("data-") || (i = se.camelCase(i.slice(5)), a(o, i, s[i]));
                    se._data(o, "parsedAttrs", !0)
                }
                return s
            }
            return "object" == typeof t ? this.each(function() {
                se.data(this, t)
            }) : se.access(this, function(n) {
                return n === e ? o ? a(o, t, se.data(o, t)) : null : (this.each(function() {
                    se.data(this, t, n)
                }), void 0)
            }, null, n, arguments.length > 1, null, !0)
        },
        removeData: function(t) {
            return this.each(function() {
                se.removeData(this, t)
            })
        }
    }), se.extend({
        queue: function(t, e, n) {
            var r;
            return t ? (e = (e || "fx") + "queue", r = se._data(t, e), n && (!r || se.isArray(n) ? r = se._data(t, e, se.makeArray(n)) : r.push(n)), r || []) : void 0
        },
        dequeue: function(t, e) {
            e = e || "fx";
            var n = se.queue(t, e),
                r = n.length,
                i = n.shift(),
                o = se._queueHooks(t, e),
                a = function() {
                    se.dequeue(t, e)
                };
            "inprogress" === i && (i = n.shift(), r--), o.cur = i, i && ("fx" === e && n.unshift("inprogress"), delete o.stop, i.call(t, a, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(t, e) {
            var n = e + "queueHooks";
            return se._data(t, n) || se._data(t, n, {
                empty: se.Callbacks("once memory")
                    .add(function() {
                        se._removeData(t, e + "queue"), se._removeData(t, n)
                    })
            })
        }
    }), se.fn.extend({
        queue: function(t, n) {
            var r = 2;
            return "string" != typeof t && (n = t, t = "fx", r--), arguments.length < r ? se.queue(this[0], t) : n === e ? this : this.each(function() {
                var e = se.queue(this, t, n);
                se._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && se.dequeue(this, t)
            })
        },
        dequeue: function(t) {
            return this.each(function() {
                se.dequeue(this, t)
            })
        },
        delay: function(t, e) {
            return t = se.fx ? se.fx.speeds[t] || t : t, e = e || "fx", this.queue(e, function(e, n) {
                var r = setTimeout(e, t);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        clearQueue: function(t) {
            return this.queue(t || "fx", [])
        },
        promise: function(t, n) {
            var r, i = 1,
                o = se.Deferred(),
                a = this,
                u = this.length,
                s = function() {
                    --i || o.resolveWith(a, [a])
                };
            for ("string" != typeof t && (n = t, t = e), t = t || "fx"; u--;) r = se._data(a[u], t + "queueHooks"), r && r.empty && (i++, r.empty.add(s));
            return s(), o.promise(n)
        }
    });
    var Se, _e, Ee = /[\t\r\n]/g,
        Ce = /\r/g,
        Ae = /^(?:input|select|textarea|button|object)$/i,
        je = /^(?:a|area)$/i,
        De = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        qe = /^(?:checked|selected)$/i,
        Le = se.support.getSetAttribute,
        He = se.support.input;
    se.fn.extend({
        attr: function(t, e) {
            return se.access(this, se.attr, t, e, arguments.length > 1)
        },
        removeAttr: function(t) {
            return this.each(function() {
                se.removeAttr(this, t)
            })
        },
        prop: function(t, e) {
            return se.access(this, se.prop, t, e, arguments.length > 1)
        },
        removeProp: function(t) {
            return t = se.propFix[t] || t, this.each(function() {
                try {
                    this[t] = e, delete this[t]
                } catch (n) {}
            })
        },
        addClass: function(t) {
            var e, n, r, i, o, a = 0,
                u = this.length,
                s = "string" == typeof t && t;
            if (se.isFunction(t)) return this.each(function(e) {
                se(this)
                    .addClass(t.call(this, e, this.className))
            });
            if (s)
                for (e = (t || "")
                    .match(ce) || []; u > a; a++)
                    if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ")
                            .replace(Ee, " ") : " ")) {
                        for (o = 0; i = e[o++];) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        n.className = se.trim(r)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a = 0,
                u = this.length,
                s = 0 === arguments.length || "string" == typeof t && t;
            if (se.isFunction(t)) return this.each(function(e) {
                se(this)
                    .removeClass(t.call(this, e, this.className))
            });
            if (s)
                for (e = (t || "")
                    .match(ce) || []; u > a; a++)
                    if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ")
                            .replace(Ee, " ") : "")) {
                        for (o = 0; i = e[o++];)
                            for (; r.indexOf(" " + i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
                        n.className = t ? se.trim(r) : ""
                    }
            return this
        },
        toggleClass: function(t, e) {
            var n = typeof t,
                r = "boolean" == typeof e;
            return se.isFunction(t) ? this.each(function(n) {
                se(this)
                    .toggleClass(t.call(this, n, this.className, e), e)
            }) : this.each(function() {
                if ("string" === n)
                    for (var i, o = 0, a = se(this), u = e, s = t.match(ce) || []; i = s[o++];) u = r ? u : !a.hasClass(i), a[u ? "addClass" : "removeClass"](i);
                else(n === Y || "boolean" === n) && (this.className && se._data(this, "__className__", this.className), this.className = this.className || t === !1 ? "" : se._data(this, "__className__") || "")
            })
        },
        hasClass: function(t) {
            for (var e = " " + t + " ", n = 0, r = this.length; r > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ")
                    .replace(Ee, " ")
                    .indexOf(e) >= 0) return !0;
            return !1
        },
        val: function(t) {
            var n, r, i, o = this[0]; {
                if (arguments.length) return i = se.isFunction(t), this.each(function(n) {
                    var o, a = se(this);
                    1 === this.nodeType && (o = i ? t.call(this, n, a.val()) : t, null == o ? o = "" : "number" == typeof o ? o += "" : se.isArray(o) && (o = se.map(o, function(t) {
                        return null == t ? "" : t + ""
                    })), r = se.valHooks[this.type] || se.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== e || (this.value = o))
                });
                if (o) return r = se.valHooks[o.type] || se.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== e ? n : (n = o.value, "string" == typeof n ? n.replace(Ce, "") : null == n ? "" : n)
            }
        }
    }), se.extend({
        valHooks: {
            option: {
                get: function(t) {
                    var e = t.attributes.value;
                    return !e || e.specified ? t.value : t.text
                }
            },
            select: {
                get: function(t) {
                    for (var e, n, r = t.options, i = t.selectedIndex, o = "select-one" === t.type || 0 > i, a = o ? null : [], u = o ? i + 1 : r.length, s = 0 > i ? u : o ? i : 0; u > s; s++)
                        if (n = r[s], !(!n.selected && s !== i || (se.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && se.nodeName(n.parentNode, "optgroup"))) {
                            if (e = se(n)
                                .val(), o) return e;
                            a.push(e)
                        }
                    return a
                },
                set: function(t, e) {
                    var n = se.makeArray(e);
                    return se(t)
                        .find("option")
                        .each(function() {
                            this.selected = se.inArray(se(this)
                                .val(), n) >= 0
                        }), n.length || (t.selectedIndex = -1), n
                }
            }
        },
        attr: function(t, n, r) {
            var i, o, a, u = t.nodeType;
            if (t && 3 !== u && 8 !== u && 2 !== u) return typeof t.getAttribute === Y ? se.prop(t, n, r) : (o = 1 !== u || !se.isXMLDoc(t), o && (n = n.toLowerCase(), i = se.attrHooks[n] || (De.test(n) ? _e : Se)), r === e ? i && o && "get" in i && null !== (a = i.get(t, n)) ? a : (typeof t.getAttribute !== Y && (a = t.getAttribute(n)), null == a ? e : a) : null !== r ? i && o && "set" in i && (a = i.set(t, r, n)) !== e ? a : (t.setAttribute(n, r + ""), r) : (se.removeAttr(t, n), void 0))
        },
        removeAttr: function(t, e) {
            var n, r, i = 0,
                o = e && e.match(ce);
            if (o && 1 === t.nodeType)
                for (; n = o[i++];) r = se.propFix[n] || n, De.test(n) ? !Le && qe.test(n) ? t[se.camelCase("default-" + n)] = t[r] = !1 : t[r] = !1 : se.attr(t, n, ""), t.removeAttribute(Le ? n : r)
        },
        attrHooks: {
            type: {
                set: function(t, e) {
                    if (!se.support.radioValue && "radio" === e && se.nodeName(t, "input")) {
                        var n = t.value;
                        return t.setAttribute("type", e), n && (t.value = n), e
                    }
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(t, n, r) {
            var i, o, a, u = t.nodeType;
            if (t && 3 !== u && 8 !== u && 2 !== u) return a = 1 !== u || !se.isXMLDoc(t), a && (n = se.propFix[n] || n, o = se.propHooks[n]), r !== e ? o && "set" in o && (i = o.set(t, r, n)) !== e ? i : t[n] = r : o && "get" in o && null !== (i = o.get(t, n)) ? i : t[n]
        },
        propHooks: {
            tabIndex: {
                get: function(t) {
                    var n = t.getAttributeNode("tabindex");
                    return n && n.specified ? parseInt(n.value, 10) : Ae.test(t.nodeName) || je.test(t.nodeName) && t.href ? 0 : e
                }
            }
        }
    }), _e = {
        get: function(t, n) {
            var r = se.prop(t, n),
                i = "boolean" == typeof r && t.getAttribute(n),
                o = "boolean" == typeof r ? He && Le ? null != i : qe.test(n) ? t[se.camelCase("default-" + n)] : !!i : t.getAttributeNode(n);
            return o && o.value !== !1 ? n.toLowerCase() : e
        },
        set: function(t, e, n) {
            return e === !1 ? se.removeAttr(t, n) : He && Le || !qe.test(n) ? t.setAttribute(!Le && se.propFix[n] || n, n) : t[se.camelCase("default-" + n)] = t[n] = !0, n
        }
    }, He && Le || (se.attrHooks.value = {
        get: function(t, n) {
            var r = t.getAttributeNode(n);
            return se.nodeName(t, "input") ? t.defaultValue : r && r.specified ? r.value : e
        },
        set: function(t, e, n) {
            return se.nodeName(t, "input") ? (t.defaultValue = e, void 0) : Se && Se.set(t, e, n)
        }
    }), Le || (Se = se.valHooks.button = {
        get: function(t, n) {
            var r = t.getAttributeNode(n);
            return r && ("id" === n || "name" === n || "coords" === n ? "" !== r.value : r.specified) ? r.value : e
        },
        set: function(t, n, r) {
            var i = t.getAttributeNode(r);
            return i || t.setAttributeNode(i = t.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === t.getAttribute(r) ? n : e
        }
    }, se.attrHooks.contenteditable = {
        get: Se.get,
        set: function(t, e, n) {
            Se.set(t, "" === e ? !1 : e, n)
        }
    }, se.each(["width", "height"], function(t, e) {
        se.attrHooks[e] = se.extend(se.attrHooks[e], {
            set: function(t, n) {
                return "" === n ? (t.setAttribute(e, "auto"), n) : void 0
            }
        })
    })), se.support.hrefNormalized || (se.each(["href", "src", "width", "height"], function(t, n) {
        se.attrHooks[n] = se.extend(se.attrHooks[n], {
            get: function(t) {
                var r = t.getAttribute(n, 2);
                return null == r ? e : r
            }
        })
    }), se.each(["href", "src"], function(t, e) {
        se.propHooks[e] = {
            get: function(t) {
                return t.getAttribute(e, 4)
            }
        }
    })), se.support.style || (se.attrHooks.style = {
        get: function(t) {
            return t.style.cssText || e
        },
        set: function(t, e) {
            return t.style.cssText = e + ""
        }
    }), se.support.optSelected || (se.propHooks.selected = se.extend(se.propHooks.selected, {
        get: function(t) {
            var e = t.parentNode;
            return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
        }
    })), se.support.enctype || (se.propFix.enctype = "encoding"), se.support.checkOn || se.each(["radio", "checkbox"], function() {
        se.valHooks[this] = {
            get: function(t) {
                return null === t.getAttribute("value") ? "on" : t.value
            }
        }
    }), se.each(["radio", "checkbox"], function() {
        se.valHooks[this] = se.extend(se.valHooks[this], {
            set: function(t, e) {
                return se.isArray(e) ? t.checked = se.inArray(se(t)
                    .val(), e) >= 0 : void 0
            }
        })
    });
    var Fe = /^(?:input|select|textarea)$/i,
        Re = /^key/,
        Oe = /^(?:mouse|contextmenu)|click/,
        ze = /^(?:focusinfocus|focusoutblur)$/,
        Pe = /^([^.]*)(?:\.(.+)|)$/;
    se.event = {
            global: {},
            add: function(t, n, r, i, o) {
                var a, u, s, l, c, f, h, d, p, g, m, v = se._data(t);
                if (v) {
                    for (r.handler && (l = r, r = l.handler, o = l.selector), r.guid || (r.guid = se.guid++), (u = v.events) || (u = v.events = {}), (f = v.handle) || (f = v.handle = function(t) {
                            return typeof se === Y || t && se.event.triggered === t.type ? e : se.event.dispatch.apply(f.elem, arguments)
                        }, f.elem = t), n = (n || "")
                        .match(ce) || [""], s = n.length; s--;) a = Pe.exec(n[s]) || [], p = m = a[1], g = (a[2] || "")
                        .split(".")
                        .sort(), c = se.event.special[p] || {}, p = (o ? c.delegateType : c.bindType) || p, c = se.event.special[p] || {}, h = se.extend({
                            type: p,
                            origType: m,
                            data: i,
                            handler: r,
                            guid: r.guid,
                            selector: o,
                            needsContext: o && se.expr.match.needsContext.test(o),
                            namespace: g.join(".")
                        }, l), (d = u[p]) || (d = u[p] = [], d.delegateCount = 0, c.setup && c.setup.call(t, i, g, f) !== !1 || (t.addEventListener ? t.addEventListener(p, f, !1) : t.attachEvent && t.attachEvent("on" + p, f))), c.add && (c.add.call(t, h), h.handler.guid || (h.handler.guid = r.guid)), o ? d.splice(d.delegateCount++, 0, h) : d.push(h), se.event.global[p] = !0;
                    t = null
                }
            },
            remove: function(t, e, n, r, i) {
                var o, a, u, s, l, c, f, h, d, p, g, m = se.hasData(t) && se._data(t);
                if (m && (c = m.events)) {
                    for (e = (e || "")
                        .match(ce) || [""], l = e.length; l--;)
                        if (u = Pe.exec(e[l]) || [], d = g = u[1], p = (u[2] || "")
                            .split(".")
                            .sort(), d) {
                            for (f = se.event.special[d] || {}, d = (r ? f.delegateType : f.bindType) || d, h = c[d] || [], u = u[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = o = h.length; o--;) a = h[o], !i && g !== a.origType || n && n.guid !== a.guid || u && !u.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (h.splice(o, 1), a.selector && h.delegateCount--, f.remove && f.remove.call(t, a));
                            s && !h.length && (f.teardown && f.teardown.call(t, p, m.handle) !== !1 || se.removeEvent(t, d, m.handle), delete c[d])
                        } else
                            for (d in c) se.event.remove(t, d + e[l], n, r, !0);
                    se.isEmptyObject(c) && (delete m.handle, se._removeData(t, "events"))
                }
            },
            trigger: function(n, r, i, o) {
                var a, u, s, l, c, f, h, d = [i || V],
                    p = ae.call(n, "type") ? n.type : n,
                    g = ae.call(n, "namespace") ? n.namespace.split(".") : [];
                if (s = f = i = i || V, 3 !== i.nodeType && 8 !== i.nodeType && !ze.test(p + se.event.triggered) && (p.indexOf(".") >= 0 && (g = p.split("."), p = g.shift(), g.sort()), u = p.indexOf(":") < 0 && "on" + p, n = n[se.expando] ? n : new se.Event(p, "object" == typeof n && n), n.isTrigger = !0, n.namespace = g.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = e, n.target || (n.target = i), r = null == r ? [n] : se.makeArray(r, [n]), c = se.event.special[p] || {}, o || !c.trigger || c.trigger.apply(i, r) !== !1)) {
                    if (!o && !c.noBubble && !se.isWindow(i)) {
                        for (l = c.delegateType || p, ze.test(l + p) || (s = s.parentNode); s; s = s.parentNode) d.push(s), f = s;
                        f === (i.ownerDocument || V) && d.push(f.defaultView || f.parentWindow || t)
                    }
                    for (h = 0;
                        (s = d[h++]) && !n.isPropagationStopped();) n.type = h > 1 ? l : c.bindType || p, a = (se._data(s, "events") || {})[n.type] && se._data(s, "handle"), a && a.apply(s, r), a = u && s[u], a && se.acceptData(s) && a.apply && a.apply(s, r) === !1 && n.preventDefault();
                    if (n.type = p, !(o || n.isDefaultPrevented() || c._default && c._default.apply(i.ownerDocument, r) !== !1 || "click" === p && se.nodeName(i, "a") || !se.acceptData(i) || !u || !i[p] || se.isWindow(i))) {
                        f = i[u], f && (i[u] = null), se.event.triggered = p;
                        try {
                            i[p]()
                        } catch (m) {}
                        se.event.triggered = e, f && (i[u] = f)
                    }
                    return n.result
                }
            },
            dispatch: function(t) {
                t = se.event.fix(t);
                var n, r, i, o, a, u = [],
                    s = re.call(arguments),
                    l = (se._data(this, "events") || {})[t.type] || [],
                    c = se.event.special[t.type] || {};
                if (s[0] = t, t.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, t) !== !1) {
                    for (u = se.event.handlers.call(this, t, l), n = 0;
                        (o = u[n++]) && !t.isPropagationStopped();)
                        for (t.currentTarget = o.elem, a = 0;
                            (i = o.handlers[a++]) && !t.isImmediatePropagationStopped();)(!t.namespace_re || t.namespace_re.test(i.namespace)) && (t.handleObj = i, t.data = i.data, r = ((se.event.special[i.origType] || {})
                                .handle || i.handler)
                            .apply(o.elem, s), r !== e && (t.result = r) === !1 && (t.preventDefault(), t.stopPropagation()));
                    return c.postDispatch && c.postDispatch.call(this, t), t.result
                }
            },
            handlers: function(t, n) {
                var r, i, o, a, u = [],
                    s = n.delegateCount,
                    l = t.target;
                if (s && l.nodeType && (!t.button || "click" !== t.type))
                    for (; l != this; l = l.parentNode || this)
                        if (1 === l.nodeType && (l.disabled !== !0 || "click" !== t.type)) {
                            for (o = [], a = 0; s > a; a++) i = n[a], r = i.selector + " ", o[r] === e && (o[r] = i.needsContext ? se(r, this)
                                .index(l) >= 0 : se.find(r, this, null, [l])
                                .length), o[r] && o.push(i);
                            o.length && u.push({
                                elem: l,
                                handlers: o
                            })
                        }
                return s < n.length && u.push({
                    elem: this,
                    handlers: n.slice(s)
                }), u
            },
            fix: function(t) {
                if (t[se.expando]) return t;
                var e, n, r, i = t.type,
                    o = t,
                    a = this.fixHooks[i];
                for (a || (this.fixHooks[i] = a = Oe.test(i) ? this.mouseHooks : Re.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, t = new se.Event(o), e = r.length; e--;) n = r[e], t[n] = o[n];
                return t.target || (t.target = o.srcElement || V), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, a.filter ? a.filter(t, o) : t
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(t, e) {
                    return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(t, n) {
                    var r, i, o, a = n.button,
                        u = n.fromElement;
                    return null == t.pageX && null != n.clientX && (i = t.target.ownerDocument || V, o = i.documentElement, r = i.body, t.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), t.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !t.relatedTarget && u && (t.relatedTarget = u === t.target ? n.toElement : u), t.which || a === e || (t.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), t
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                click: {
                    trigger: function() {
                        return se.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                    }
                },
                focus: {
                    trigger: function() {
                        if (this !== V.activeElement && this.focus) try {
                            return this.focus(), !1
                        } catch (t) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === V.activeElement && this.blur ? (this.blur(), !1) : void 0
                    },
                    delegateType: "focusout"
                },
                beforeunload: {
                    postDispatch: function(t) {
                        t.result !== e && (t.originalEvent.returnValue = t.result)
                    }
                }
            },
            simulate: function(t, e, n, r) {
                var i = se.extend(new se.Event, n, {
                    type: t,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? se.event.trigger(i, null, e) : se.event.dispatch.call(e, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, se.removeEvent = V.removeEventListener ? function(t, e, n) {
            t.removeEventListener && t.removeEventListener(e, n, !1)
        } : function(t, e, n) {
            var r = "on" + e;
            t.detachEvent && (typeof t[r] === Y && (t[r] = null), t.detachEvent(r, n))
        }, se.Event = function(t, e) {
            return this instanceof se.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.returnValue === !1 || t.getPreventDefault && t.getPreventDefault() ? s : l) : this.type = t, e && se.extend(this, e), this.timeStamp = t && t.timeStamp || se.now(), this[se.expando] = !0, void 0) : new se.Event(t, e)
        }, se.Event.prototype = {
            isDefaultPrevented: l,
            isPropagationStopped: l,
            isImmediatePropagationStopped: l,
            preventDefault: function() {
                var t = this.originalEvent;
                this.isDefaultPrevented = s, t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
            },
            stopPropagation: function() {
                var t = this.originalEvent;
                this.isPropagationStopped = s, t && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = s, this.stopPropagation()
            }
        }, se.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(t, e) {
            se.event.special[t] = {
                delegateType: e,
                bindType: e,
                handle: function(t) {
                    var n, r = this,
                        i = t.relatedTarget,
                        o = t.handleObj;
                    return (!i || i !== r && !se.contains(r, i)) && (t.type = o.origType, n = o.handler.apply(this, arguments), t.type = e), n
                }
            }
        }), se.support.submitBubbles || (se.event.special.submit = {
            setup: function() {
                return se.nodeName(this, "form") ? !1 : (se.event.add(this, "click._submit keypress._submit", function(t) {
                    var n = t.target,
                        r = se.nodeName(n, "input") || se.nodeName(n, "button") ? n.form : e;
                    r && !se._data(r, "submitBubbles") && (se.event.add(r, "submit._submit", function(t) {
                        t._submit_bubble = !0
                    }), se._data(r, "submitBubbles", !0))
                }), void 0)
            },
            postDispatch: function(t) {
                t._submit_bubble && (delete t._submit_bubble, this.parentNode && !t.isTrigger && se.event.simulate("submit", this.parentNode, t, !0))
            },
            teardown: function() {
                return se.nodeName(this, "form") ? !1 : (se.event.remove(this, "._submit"), void 0)
            }
        }), se.support.changeBubbles || (se.event.special.change = {
            setup: function() {
                return Fe.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (se.event.add(this, "propertychange._change", function(t) {
                    "checked" === t.originalEvent.propertyName && (this._just_changed = !0)
                }), se.event.add(this, "click._change", function(t) {
                    this._just_changed && !t.isTrigger && (this._just_changed = !1), se.event.simulate("change", this, t, !0)
                })), !1) : (se.event.add(this, "beforeactivate._change", function(t) {
                    var e = t.target;
                    Fe.test(e.nodeName) && !se._data(e, "changeBubbles") && (se.event.add(e, "change._change", function(t) {
                        !this.parentNode || t.isSimulated || t.isTrigger || se.event.simulate("change", this.parentNode, t, !0)
                    }), se._data(e, "changeBubbles", !0))
                }), void 0)
            },
            handle: function(t) {
                var e = t.target;
                return this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type ? t.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function() {
                return se.event.remove(this, "._change"), !Fe.test(this.nodeName)
            }
        }), se.support.focusinBubbles || se.each({
            focus: "focusin",
            blur: "focusout"
        }, function(t, e) {
            var n = 0,
                r = function(t) {
                    se.event.simulate(e, t.target, se.event.fix(t), !0)
                };
            se.event.special[e] = {
                setup: function() {
                    0 === n++ && V.addEventListener(t, r, !0)
                },
                teardown: function() {
                    0 === --n && V.removeEventListener(t, r, !0)
                }
            }
        }), se.fn.extend({
            on: function(t, n, r, i, o) {
                var a, u;
                if ("object" == typeof t) {
                    "string" != typeof n && (r = r || n, n = e);
                    for (a in t) this.on(a, n, r, t[a], o);
                    return this
                }
                if (null == r && null == i ? (i = n, r = n = e) : null == i && ("string" == typeof n ? (i = r, r = e) : (i = r, r = n, n = e)), i === !1) i = l;
                else if (!i) return this;
                return 1 === o && (u = i, i = function(t) {
                    return se()
                        .off(t), u.apply(this, arguments)
                }, i.guid = u.guid || (u.guid = se.guid++)), this.each(function() {
                    se.event.add(this, t, i, r, n)
                })
            },
            one: function(t, e, n, r) {
                return this.on(t, e, n, r, 1)
            },
            off: function(t, n, r) {
                var i, o;
                if (t && t.preventDefault && t.handleObj) return i = t.handleObj, se(t.delegateTarget)
                    .off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof t) {
                    for (o in t) this.off(o, n, t[o]);
                    return this
                }
                return (n === !1 || "function" == typeof n) && (r = n, n = e), r === !1 && (r = l), this.each(function() {
                    se.event.remove(this, t, r, n)
                })
            },
            bind: function(t, e, n) {
                return this.on(t, null, e, n)
            },
            unbind: function(t, e) {
                return this.off(t, null, e)
            },
            delegate: function(t, e, n, r) {
                return this.on(e, t, n, r)
            },
            undelegate: function(t, e, n) {
                return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
            },
            trigger: function(t, e) {
                return this.each(function() {
                    se.event.trigger(t, e, this)
                })
            },
            triggerHandler: function(t, e) {
                var n = this[0];
                return n ? se.event.trigger(t, e, n, !0) : void 0
            }
        }),
        /*!
         * Sizzle CSS Selector Engine
         * Copyright 2012 jQuery Foundation and other contributors
         * Released under the MIT license
         * http://sizzlejs.com/
         */
        function(t, e) {
            function n(t) {
                return pe.test(t + "")
            }

            function r() {
                var t, e = [];
                return t = function(n, r) {
                    return e.push(n += " ") > N.cacheLength && delete t[e.shift()], t[n] = r
                }
            }

            function i(t) {
                return t[z] = !0, t
            }

            function o(t) {
                var e = j.createElement("div");
                try {
                    return t(e)
                } catch (n) {
                    return !1
                } finally {
                    e = null
                }
            }

            function a(t, e, n, r) {
                var i, o, a, u, s, l, c, d, p, g;
                if ((e ? e.ownerDocument || e : P) !== j && A(e), e = e || j, n = n || [], !t || "string" != typeof t) return n;
                if (1 !== (u = e.nodeType) && 9 !== u) return [];
                if (!q && !r) {
                    if (i = ge.exec(t))
                        if (a = i[1]) {
                            if (9 === u) {
                                if (o = e.getElementById(a), !o || !o.parentNode) return n;
                                if (o.id === a) return n.push(o), n
                            } else if (e.ownerDocument && (o = e.ownerDocument.getElementById(a)) && R(e, o) && o.id === a) return n.push(o), n
                        } else {
                            if (i[2]) return J.apply(n, Q.call(e.getElementsByTagName(t), 0)), n;
                            if ((a = i[3]) && I.getByClassName && e.getElementsByClassName) return J.apply(n, Q.call(e.getElementsByClassName(a), 0)), n
                        }
                    if (I.qsa && !L.test(t)) {
                        if (c = !0, d = z, p = e, g = 9 === u && t, 1 === u && "object" !== e.nodeName.toLowerCase()) {
                            for (l = f(t), (c = e.getAttribute("id")) ? d = c.replace(ye, "\\$&") : e.setAttribute("id", d), d = "[id='" + d + "'] ", s = l.length; s--;) l[s] = d + h(l[s]);
                            p = de.test(t) && e.parentNode || e, g = l.join(",")
                        }
                        if (g) try {
                            return J.apply(n, Q.call(p.querySelectorAll(g), 0)), n
                        } catch (m) {} finally {
                            c || e.removeAttribute("id")
                        }
                    }
                }
                return x(t.replace(ae, "$1"), e, n, r)
            }

            function u(t, e) {
                var n = e && t,
                    r = n && (~e.sourceIndex || V) - (~t.sourceIndex || V);
                if (r) return r;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === e) return -1;
                return t ? 1 : -1
            }

            function s(t) {
                return function(e) {
                    var n = e.nodeName.toLowerCase();
                    return "input" === n && e.type === t
                }
            }

            function l(t) {
                return function(e) {
                    var n = e.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && e.type === t
                }
            }

            function c(t) {
                return i(function(e) {
                    return e = +e, i(function(n, r) {
                        for (var i, o = t([], n.length, e), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }

            function f(t, e) {
                var n, r, i, o, u, s, l, c = X[t + " "];
                if (c) return e ? 0 : c.slice(0);
                for (u = t, s = [], l = N.preFilter; u;) {
                    (!n || (r = ue.exec(u))) && (r && (u = u.slice(r[0].length) || u), s.push(i = [])), n = !1, (r = le.exec(u)) && (n = r.shift(), i.push({
                        value: n,
                        type: r[0].replace(ae, " ")
                    }), u = u.slice(n.length));
                    for (o in N.filter) !(r = he[o].exec(u)) || l[o] && !(r = l[o](r)) || (n = r.shift(), i.push({
                        value: n,
                        type: o,
                        matches: r
                    }), u = u.slice(n.length));
                    if (!n) break
                }
                return e ? u.length : u ? a.error(t) : X(t, s)
                    .slice(0)
            }

            function h(t) {
                for (var e = 0, n = t.length, r = ""; n > e; e++) r += t[e].value;
                return r
            }

            function d(t, e, n) {
                var r = e.dir,
                    i = n && "parentNode" === r,
                    o = W++;
                return e.first ? function(e, n, o) {
                    for (; e = e[r];)
                        if (1 === e.nodeType || i) return t(e, n, o)
                } : function(e, n, a) {
                    var u, s, l, c = B + " " + o;
                    if (a) {
                        for (; e = e[r];)
                            if ((1 === e.nodeType || i) && t(e, n, a)) return !0
                    } else
                        for (; e = e[r];)
                            if (1 === e.nodeType || i)
                                if (l = e[z] || (e[z] = {}), (s = l[r]) && s[0] === c) {
                                    if ((u = s[1]) === !0 || u === k) return u === !0
                                } else if (s = l[r] = [c], s[1] = t(e, n, a) || k, s[1] === !0) return !0
                }
            }

            function p(t) {
                return t.length > 1 ? function(e, n, r) {
                    for (var i = t.length; i--;)
                        if (!t[i](e, n, r)) return !1;
                    return !0
                } : t[0]
            }

            function g(t, e, n, r, i) {
                for (var o, a = [], u = 0, s = t.length, l = null != e; s > u; u++)(o = t[u]) && (!n || n(o, r, i)) && (a.push(o), l && e.push(u));
                return a
            }

            function m(t, e, n, r, o, a) {
                return r && !r[z] && (r = m(r)), o && !o[z] && (o = m(o, a)), i(function(i, a, u, s) {
                    var l, c, f, h = [],
                        d = [],
                        p = a.length,
                        m = i || b(e || "*", u.nodeType ? [u] : u, []),
                        v = !t || !i && e ? m : g(m, h, t, u, s),
                        y = n ? o || (i ? t : p || r) ? [] : a : v;
                    if (n && n(v, y, u, s), r)
                        for (l = g(y, d), r(l, [], u, s), c = l.length; c--;)(f = l[c]) && (y[d[c]] = !(v[d[c]] = f));
                    if (i) {
                        if (o || t) {
                            if (o) {
                                for (l = [], c = y.length; c--;)(f = y[c]) && l.push(v[c] = f);
                                o(null, y = [], l, s)
                            }
                            for (c = y.length; c--;)(f = y[c]) && (l = o ? K.call(i, f) : h[c]) > -1 && (i[l] = !(a[l] = f))
                        }
                    } else y = g(y === a ? y.splice(p, y.length) : y), o ? o(null, a, y, s) : J.apply(a, y)
                })
            }

            function v(t) {
                for (var e, n, r, i = t.length, o = N.relative[t[0].type], a = o || N.relative[" "], u = o ? 1 : 0, s = d(function(t) {
                        return t === e
                    }, a, !0), l = d(function(t) {
                        return K.call(e, t) > -1
                    }, a, !0), c = [function(t, n, r) {
                        return !o && (r || n !== C) || ((e = n)
                            .nodeType ? s(t, n, r) : l(t, n, r))
                    }]; i > u; u++)
                    if (n = N.relative[t[u].type]) c = [d(p(c), n)];
                    else {
                        if (n = N.filter[t[u].type].apply(null, t[u].matches), n[z]) {
                            for (r = ++u; i > r && !N.relative[t[r].type]; r++);
                            return m(u > 1 && p(c), u > 1 && h(t.slice(0, u - 1))
                                .replace(ae, "$1"), n, r > u && v(t.slice(u, r)), i > r && v(t = t.slice(r)), i > r && h(t))
                        }
                        c.push(n)
                    }
                return p(c)
            }

            function y(t, e) {
                var n = 0,
                    r = e.length > 0,
                    o = t.length > 0,
                    u = function(i, u, s, l, c) {
                        var f, h, d, p = [],
                            m = 0,
                            v = "0",
                            y = i && [],
                            b = null != c,
                            x = C,
                            M = i || o && N.find.TAG("*", c && u.parentNode || u),
                            w = B += null == x ? 1 : Math.random() || .1;
                        for (b && (C = u !== j && u, k = n); null != (f = M[v]); v++) {
                            if (o && f) {
                                for (h = 0; d = t[h++];)
                                    if (d(f, u, s)) {
                                        l.push(f);
                                        break
                                    }
                                b && (B = w, k = ++n)
                            }
                            r && ((f = !d && f) && m--, i && y.push(f))
                        }
                        if (m += v, r && v !== m) {
                            for (h = 0; d = e[h++];) d(y, p, u, s);
                            if (i) {
                                if (m > 0)
                                    for (; v--;) y[v] || p[v] || (p[v] = Z.call(l));
                                p = g(p)
                            }
                            J.apply(l, p), b && !i && p.length > 0 && m + e.length > 1 && a.uniqueSort(l)
                        }
                        return b && (B = w, C = x), y
                    };
                return r ? i(u) : u
            }

            function b(t, e, n) {
                for (var r = 0, i = e.length; i > r; r++) a(t, e[r], n);
                return n
            }

            function x(t, e, n, r) {
                var i, o, a, u, s, l = f(t);
                if (!r && 1 === l.length) {
                    if (o = l[0] = l[0].slice(0), o.length > 2 && "ID" === (a = o[0])
                        .type && 9 === e.nodeType && !q && N.relative[o[1].type]) {
                        if (e = N.find.ID(a.matches[0].replace(xe, Me), e)[0], !e) return n;
                        t = t.slice(o.shift()
                            .value.length)
                    }
                    for (i = he.needsContext.test(t) ? 0 : o.length; i-- && (a = o[i], !N.relative[u = a.type]);)
                        if ((s = N.find[u]) && (r = s(a.matches[0].replace(xe, Me), de.test(o[0].type) && e.parentNode || e))) {
                            if (o.splice(i, 1), t = r.length && h(o), !t) return J.apply(n, Q.call(r, 0)), n;
                            break
                        }
                }
                return _(t, l)(r, e, q, n, de.test(t)), n
            }

            function M() {}
            var w, k, N, T, S, _, E, C, A, j, D, q, L, H, F, R, O, z = "sizzle" + -new Date,
                P = t.document,
                I = {},
                B = 0,
                W = 0,
                $ = r(),
                X = r(),
                U = r(),
                Y = typeof e,
                V = 1 << 31,
                G = [],
                Z = G.pop,
                J = G.push,
                Q = G.slice,
                K = G.indexOf || function(t) {
                    for (var e = 0, n = this.length; n > e; e++)
                        if (this[e] === t) return e;
                    return -1
                },
                te = "[\\x20\\t\\r\\n\\f]",
                ee = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                ne = ee.replace("w", "w#"),
                re = "([*^$|!~]?=)",
                ie = "\\[" + te + "*(" + ee + ")" + te + "*(?:" + re + te + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + ne + ")|)|)" + te + "*\\]",
                oe = ":(" + ee + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ie.replace(3, 8) + ")*)|.*)\\)|)",
                ae = new RegExp("^" + te + "+|((?:^|[^\\\\])(?:\\\\.)*)" + te + "+$", "g"),
                ue = new RegExp("^" + te + "*," + te + "*"),
                le = new RegExp("^" + te + "*([\\x20\\t\\r\\n\\f>+~])" + te + "*"),
                ce = new RegExp(oe),
                fe = new RegExp("^" + ne + "$"),
                he = {
                    ID: new RegExp("^#(" + ee + ")"),
                    CLASS: new RegExp("^\\.(" + ee + ")"),
                    NAME: new RegExp("^\\[name=['\"]?(" + ee + ")['\"]?\\]"),
                    TAG: new RegExp("^(" + ee.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + ie),
                    PSEUDO: new RegExp("^" + oe),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + te + "*(even|odd|(([+-]|)(\\d*)n|)" + te + "*(?:([+-]|)" + te + "*(\\d+)|))" + te + "*\\)|)", "i"),
                    needsContext: new RegExp("^" + te + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + te + "*((?:-\\d)?\\d*)" + te + "*\\)|)(?=[^-]|$)", "i")
                },
                de = /[\x20\t\r\n\f]*[+~]/,
                pe = /^[^{]+\{\s*\[native code/,
                ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                me = /^(?:input|select|textarea|button)$/i,
                ve = /^h\d$/i,
                ye = /'|\\/g,
                be = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                xe = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
                Me = function(t, e) {
                    var n = "0x" + e - 65536;
                    return n !== n ? e : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode(55296 | n >> 10, 56320 | 1023 & n)
                };
            try {
                Q.call(P.documentElement.childNodes, 0)[0].nodeType
            } catch (we) {
                Q = function(t) {
                    for (var e, n = []; e = this[t++];) n.push(e);
                    return n
                }
            }
            S = a.isXML = function(t) {
                var e = t && (t.ownerDocument || t)
                    .documentElement;
                return e ? "HTML" !== e.nodeName : !1
            }, A = a.setDocument = function(t) {
                var r = t ? t.ownerDocument || t : P;
                return r !== j && 9 === r.nodeType && r.documentElement ? (j = r, D = r.documentElement, q = S(r), I.tagNameNoComments = o(function(t) {
                    return t.appendChild(r.createComment("")), !t.getElementsByTagName("*")
                        .length
                }), I.attributes = o(function(t) {
                    t.innerHTML = "<select></select>";
                    var e = typeof t.lastChild.getAttribute("multiple");
                    return "boolean" !== e && "string" !== e
                }), I.getByClassName = o(function(t) {
                    return t.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", t.getElementsByClassName && t.getElementsByClassName("e")
                        .length ? (t.lastChild.className = "e", 2 === t.getElementsByClassName("e")
                            .length) : !1
                }), I.getByName = o(function(t) {
                    t.id = z + 0, t.innerHTML = "<a name='" + z + "'></a><div name='" + z + "'></div>", D.insertBefore(t, D.firstChild);
                    var e = r.getElementsByName && r.getElementsByName(z)
                        .length === 2 + r.getElementsByName(z + 0)
                        .length;
                    return I.getIdNotName = !r.getElementById(z), D.removeChild(t), e
                }), N.attrHandle = o(function(t) {
                    return t.innerHTML = "<a href='#'></a>", t.firstChild && typeof t.firstChild.getAttribute !== Y && "#" === t.firstChild.getAttribute("href")
                }) ? {} : {
                    href: function(t) {
                        return t.getAttribute("href", 2)
                    },
                    type: function(t) {
                        return t.getAttribute("type")
                    }
                }, I.getIdNotName ? (N.find.ID = function(t, e) {
                    if (typeof e.getElementById !== Y && !q) {
                        var n = e.getElementById(t);
                        return n && n.parentNode ? [n] : []
                    }
                }, N.filter.ID = function(t) {
                    var e = t.replace(xe, Me);
                    return function(t) {
                        return t.getAttribute("id") === e
                    }
                }) : (N.find.ID = function(t, n) {
                    if (typeof n.getElementById !== Y && !q) {
                        var r = n.getElementById(t);
                        return r ? r.id === t || typeof r.getAttributeNode !== Y && r.getAttributeNode("id")
                            .value === t ? [r] : e : []
                    }
                }, N.filter.ID = function(t) {
                    var e = t.replace(xe, Me);
                    return function(t) {
                        var n = typeof t.getAttributeNode !== Y && t.getAttributeNode("id");
                        return n && n.value === e
                    }
                }), N.find.TAG = I.tagNameNoComments ? function(t, e) {
                    return typeof e.getElementsByTagName !== Y ? e.getElementsByTagName(t) : void 0
                } : function(t, e) {
                    var n, r = [],
                        i = 0,
                        o = e.getElementsByTagName(t);
                    if ("*" === t) {
                        for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                        return r
                    }
                    return o
                }, N.find.NAME = I.getByName && function(t, e) {
                    return typeof e.getElementsByName !== Y ? e.getElementsByName(name) : void 0
                }, N.find.CLASS = I.getByClassName && function(t, e) {
                    return typeof e.getElementsByClassName === Y || q ? void 0 : e.getElementsByClassName(t)
                }, H = [], L = [":focus"], (I.qsa = n(r.querySelectorAll)) && (o(function(t) {
                    t.innerHTML = "<select><option selected=''></option></select>", t.querySelectorAll("[selected]")
                        .length || L.push("\\[" + te + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), t.querySelectorAll(":checked")
                        .length || L.push(":checked")
                }), o(function(t) {
                    t.innerHTML = "<input type='hidden' i=''/>", t.querySelectorAll("[i^='']")
                        .length && L.push("[*^$]=" + te + "*(?:\"\"|'')"), t.querySelectorAll(":enabled")
                        .length || L.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), L.push(",.*:")
                })), (I.matchesSelector = n(F = D.matchesSelector || D.mozMatchesSelector || D.webkitMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && o(function(t) {
                    I.disconnectedMatch = F.call(t, "div"), F.call(t, "[s!='']:x"), H.push("!=", oe)
                }), L = new RegExp(L.join("|")), H = new RegExp(H.join("|")), R = n(D.contains) || D.compareDocumentPosition ? function(t, e) {
                    var n = 9 === t.nodeType ? t.documentElement : t,
                        r = e && e.parentNode;
                    return t === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(r)))
                } : function(t, e) {
                    if (e)
                        for (; e = e.parentNode;)
                            if (e === t) return !0;
                    return !1
                }, O = D.compareDocumentPosition ? function(t, e) {
                    var n;
                    return t === e ? (E = !0, 0) : (n = e.compareDocumentPosition && t.compareDocumentPosition && t.compareDocumentPosition(e)) ? 1 & n || t.parentNode && 11 === t.parentNode.nodeType ? t === r || R(P, t) ? -1 : e === r || R(P, e) ? 1 : 0 : 4 & n ? -1 : 1 : t.compareDocumentPosition ? -1 : 1
                } : function(t, e) {
                    var n, i = 0,
                        o = t.parentNode,
                        a = e.parentNode,
                        s = [t],
                        l = [e];
                    if (t === e) return E = !0, 0;
                    if (!o || !a) return t === r ? -1 : e === r ? 1 : o ? -1 : a ? 1 : 0;
                    if (o === a) return u(t, e);
                    for (n = t; n = n.parentNode;) s.unshift(n);
                    for (n = e; n = n.parentNode;) l.unshift(n);
                    for (; s[i] === l[i];) i++;
                    return i ? u(s[i], l[i]) : s[i] === P ? -1 : l[i] === P ? 1 : 0
                }, E = !1, [0, 0].sort(O), I.detectDuplicates = E, j) : j
            }, a.matches = function(t, e) {
                return a(t, null, null, e)
            }, a.matchesSelector = function(t, e) {
                if ((t.ownerDocument || t) !== j && A(t), e = e.replace(be, "='$1']"), !(!I.matchesSelector || q || H && H.test(e) || L.test(e))) try {
                    var n = F.call(t, e);
                    if (n || I.disconnectedMatch || t.document && 11 !== t.document.nodeType) return n
                } catch (r) {}
                return a(e, j, null, [t])
                    .length > 0
            }, a.contains = function(t, e) {
                return (t.ownerDocument || t) !== j && A(t), R(t, e)
            }, a.attr = function(t, e) {
                var n;
                return (t.ownerDocument || t) !== j && A(t), q || (e = e.toLowerCase()), (n = N.attrHandle[e]) ? n(t) : q || I.attributes ? t.getAttribute(e) : ((n = t.getAttributeNode(e)) || t.getAttribute(e)) && t[e] === !0 ? e : n && n.specified ? n.value : null
            }, a.error = function(t) {
                throw new Error("Syntax error, unrecognized expression: " + t)
            }, a.uniqueSort = function(t) {
                var e, n = [],
                    r = 1,
                    i = 0;
                if (E = !I.detectDuplicates, t.sort(O), E) {
                    for (; e = t[r]; r++) e === t[r - 1] && (i = n.push(r));
                    for (; i--;) t.splice(n[i], 1)
                }
                return t
            }, T = a.getText = function(t) {
                var e, n = "",
                    r = 0,
                    i = t.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof t.textContent) return t.textContent;
                        for (t = t.firstChild; t; t = t.nextSibling) n += T(t)
                    } else if (3 === i || 4 === i) return t.nodeValue
                } else
                    for (; e = t[r]; r++) n += T(e);
                return n
            }, N = a.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: he,
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(t) {
                        return t[1] = t[1].replace(xe, Me), t[3] = (t[4] || t[5] || "")
                            .replace(xe, Me), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                    },
                    CHILD: function(t) {
                        return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || a.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && a.error(t[0]), t
                    },
                    PSEUDO: function(t) {
                        var e, n = !t[5] && t[2];
                        return he.CHILD.test(t[0]) ? null : (t[4] ? t[2] = t[4] : n && ce.test(n) && (e = f(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(t) {
                        return "*" === t ? function() {
                            return !0
                        } : (t = t.replace(xe, Me)
                            .toLowerCase(),
                            function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            })
                    },
                    CLASS: function(t) {
                        var e = $[t + " "];
                        return e || (e = new RegExp("(^|" + te + ")" + t + "(" + te + "|$)")) && $(t, function(t) {
                            return e.test(t.className || typeof t.getAttribute !== Y && t.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(t, e, n) {
                        return function(r) {
                            var i = a.attr(r, t);
                            return null == i ? "!=" === e : e ? (i += "", "=" === e ? i === n : "!=" === e ? i !== n : "^=" === e ? n && 0 === i.indexOf(n) : "*=" === e ? n && i.indexOf(n) > -1 : "$=" === e ? n && i.slice(-n.length) === n : "~=" === e ? (" " + i + " ")
                                .indexOf(n) > -1 : "|=" === e ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                        }
                    },
                    CHILD: function(t, e, n, r, i) {
                        var o = "nth" !== t.slice(0, 3),
                            a = "last" !== t.slice(-4),
                            u = "of-type" === e;
                        return 1 === r && 0 === i ? function(t) {
                            return !!t.parentNode
                        } : function(e, n, s) {
                            var l, c, f, h, d, p, g = o !== a ? "nextSibling" : "previousSibling",
                                m = e.parentNode,
                                v = u && e.nodeName.toLowerCase(),
                                y = !s && !u;
                            if (m) {
                                if (o) {
                                    for (; g;) {
                                        for (f = e; f = f[g];)
                                            if (u ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                        p = g = "only" === t && !p && "nextSibling"
                                    }
                                    return !0
                                }
                                if (p = [a ? m.firstChild : m.lastChild], a && y) {
                                    for (c = m[z] || (m[z] = {}), l = c[t] || [], d = l[0] === B && l[1], h = l[0] === B && l[2], f = d && m.childNodes[d]; f = ++d && f && f[g] || (h = d = 0) || p.pop();)
                                        if (1 === f.nodeType && ++h && f === e) {
                                            c[t] = [B, d, h];
                                            break
                                        }
                                } else if (y && (l = (e[z] || (e[z] = {}))[t]) && l[0] === B) h = l[1];
                                else
                                    for (;
                                        (f = ++d && f && f[g] || (h = d = 0) || p.pop()) && ((u ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++h || (y && ((f[z] || (f[z] = {}))[t] = [B, h]), f !== e)););
                                return h -= i, h === r || 0 === h % r && h / r >= 0
                            }
                        }
                    },
                    PSEUDO: function(t, e) {
                        var n, r = N.pseudos[t] || N.setFilters[t.toLowerCase()] || a.error("unsupported pseudo: " + t);
                        return r[z] ? r(e) : r.length > 1 ? (n = [t, t, "", e], N.setFilters.hasOwnProperty(t.toLowerCase()) ? i(function(t, n) {
                            for (var i, o = r(t, e), a = o.length; a--;) i = K.call(t, o[a]), t[i] = !(n[i] = o[a])
                        }) : function(t) {
                            return r(t, 0, n)
                        }) : r
                    }
                },
                pseudos: {
                    not: i(function(t) {
                        var e = [],
                            n = [],
                            r = _(t.replace(ae, "$1"));
                        return r[z] ? i(function(t, e, n, i) {
                            for (var o, a = r(t, null, i, []), u = t.length; u--;)(o = a[u]) && (t[u] = !(e[u] = o))
                        }) : function(t, i, o) {
                            return e[0] = t, r(e, null, o, n), !n.pop()
                        }
                    }),
                    has: i(function(t) {
                        return function(e) {
                            return a(t, e)
                                .length > 0
                        }
                    }),
                    contains: i(function(t) {
                        return function(e) {
                            return (e.textContent || e.innerText || T(e))
                                .indexOf(t) > -1
                        }
                    }),
                    lang: i(function(t) {
                        return fe.test(t || "") || a.error("unsupported lang: " + t), t = t.replace(xe, Me)
                            .toLowerCase(),
                            function(e) {
                                var n;
                                do
                                    if (n = q ? e.getAttribute("xml:lang") || e.getAttribute("lang") : e.lang) return n = n.toLowerCase(), n === t || 0 === n.indexOf(t + "-"); while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var n = t.location && t.location.hash;
                        return n && n.slice(1) === e.id
                    },
                    root: function(t) {
                        return t === D
                    },
                    focus: function(t) {
                        return t === j.activeElement && (!j.hasFocus || j.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                    },
                    enabled: function(t) {
                        return t.disabled === !1
                    },
                    disabled: function(t) {
                        return t.disabled === !0
                    },
                    checked: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && !!t.checked || "option" === e && !!t.selected
                    },
                    selected: function(t) {
                        return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
                    },
                    empty: function(t) {
                        for (t = t.firstChild; t; t = t.nextSibling)
                            if (t.nodeName > "@" || 3 === t.nodeType || 4 === t.nodeType) return !1;
                        return !0
                    },
                    parent: function(t) {
                        return !N.pseudos.empty(t)
                    },
                    header: function(t) {
                        return ve.test(t.nodeName)
                    },
                    input: function(t) {
                        return me.test(t.nodeName)
                    },
                    button: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && "button" === t.type || "button" === e
                    },
                    text: function(t) {
                        var e;
                        return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || e.toLowerCase() === t.type)
                    },
                    first: c(function() {
                        return [0]
                    }),
                    last: c(function(t, e) {
                        return [e - 1]
                    }),
                    eq: c(function(t, e, n) {
                        return [0 > n ? n + e : n]
                    }),
                    even: c(function(t, e) {
                        for (var n = 0; e > n; n += 2) t.push(n);
                        return t
                    }),
                    odd: c(function(t, e) {
                        for (var n = 1; e > n; n += 2) t.push(n);
                        return t
                    }),
                    lt: c(function(t, e, n) {
                        for (var r = 0 > n ? n + e : n; --r >= 0;) t.push(r);
                        return t
                    }),
                    gt: c(function(t, e, n) {
                        for (var r = 0 > n ? n + e : n; ++r < e;) t.push(r);
                        return t
                    })
                }
            };
            for (w in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) N.pseudos[w] = s(w);
            for (w in {
                    submit: !0,
                    reset: !0
                }) N.pseudos[w] = l(w);
            _ = a.compile = function(t, e) {
                var n, r = [],
                    i = [],
                    o = U[t + " "];
                if (!o) {
                    for (e || (e = f(t)), n = e.length; n--;) o = v(e[n]), o[z] ? r.push(o) : i.push(o);
                    o = U(t, y(i, r))
                }
                return o
            }, N.pseudos.nth = N.pseudos.eq, N.filters = M.prototype = N.pseudos, N.setFilters = new M, A(), a.attr = se.attr, se.find = a, se.expr = a.selectors, se.expr[":"] = se.expr.pseudos, se.unique = a.uniqueSort, se.text = a.getText, se.isXMLDoc = a.isXML, se.contains = a.contains
        }(t);
    var Ie = /Until$/,
        Be = /^(?:parents|prev(?:Until|All))/,
        We = /^.[^:#\[\.,]*$/,
        $e = se.expr.match.needsContext,
        Xe = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    se.fn.extend({
        find: function(t) {
            var e, n, r, i = this.length;
            if ("string" != typeof t) return r = this, this.pushStack(se(t)
                .filter(function() {
                    for (e = 0; i > e; e++)
                        if (se.contains(r[e], this)) return !0
                }));
            for (n = [], e = 0; i > e; e++) se.find(t, this[e], n);
            return n = this.pushStack(i > 1 ? se.unique(n) : n), n.selector = (this.selector ? this.selector + " " : "") + t, n
        },
        has: function(t) {
            var e, n = se(t, this),
                r = n.length;
            return this.filter(function() {
                for (e = 0; r > e; e++)
                    if (se.contains(this, n[e])) return !0
            })
        },
        not: function(t) {
            return this.pushStack(f(this, t, !1))
        },
        filter: function(t) {
            return this.pushStack(f(this, t, !0))
        },
        is: function(t) {
            return !!t && ("string" == typeof t ? $e.test(t) ? se(t, this.context)
                .index(this[0]) >= 0 : se.filter(t, this)
                .length > 0 : this.filter(t)
                .length > 0)
        },
        closest: function(t, e) {
            for (var n, r = 0, i = this.length, o = [], a = $e.test(t) || "string" != typeof t ? se(t, e || this.context) : 0; i > r; r++)
                for (n = this[r]; n && n.ownerDocument && n !== e && 11 !== n.nodeType;) {
                    if (a ? a.index(n) > -1 : se.find.matchesSelector(n, t)) {
                        o.push(n);
                        break
                    }
                    n = n.parentNode
                }
            return this.pushStack(o.length > 1 ? se.unique(o) : o)
        },
        index: function(t) {
            return t ? "string" == typeof t ? se.inArray(this[0], se(t)) : se.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first()
                .prevAll()
                .length : -1
        },
        add: function(t, e) {
            var n = "string" == typeof t ? se(t, e) : se.makeArray(t && t.nodeType ? [t] : t),
                r = se.merge(this.get(), n);
            return this.pushStack(se.unique(r))
        },
        addBack: function(t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
        }
    }), se.fn.andSelf = se.fn.addBack, se.each({
        parent: function(t) {
            var e = t.parentNode;
            return e && 11 !== e.nodeType ? e : null
        },
        parents: function(t) {
            return se.dir(t, "parentNode")
        },
        parentsUntil: function(t, e, n) {
            return se.dir(t, "parentNode", n)
        },
        next: function(t) {
            return c(t, "nextSibling")
        },
        prev: function(t) {
            return c(t, "previousSibling")
        },
        nextAll: function(t) {
            return se.dir(t, "nextSibling")
        },
        prevAll: function(t) {
            return se.dir(t, "previousSibling")
        },
        nextUntil: function(t, e, n) {
            return se.dir(t, "nextSibling", n)
        },
        prevUntil: function(t, e, n) {
            return se.dir(t, "previousSibling", n)
        },
        siblings: function(t) {
            return se.sibling((t.parentNode || {})
                .firstChild, t)
        },
        children: function(t) {
            return se.sibling(t.firstChild)
        },
        contents: function(t) {
            return se.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : se.merge([], t.childNodes)
        }
    }, function(t, e) {
        se.fn[t] = function(n, r) {
            var i = se.map(this, e, n);
            return Ie.test(t) || (r = n), r && "string" == typeof r && (i = se.filter(r, i)), i = this.length > 1 && !Xe[t] ? se.unique(i) : i, this.length > 1 && Be.test(t) && (i = i.reverse()), this.pushStack(i)
        }
    }), se.extend({
        filter: function(t, e, n) {
            return n && (t = ":not(" + t + ")"), 1 === e.length ? se.find.matchesSelector(e[0], t) ? [e[0]] : [] : se.find.matches(t, e)
        },
        dir: function(t, n, r) {
            for (var i = [], o = t[n]; o && 9 !== o.nodeType && (r === e || 1 !== o.nodeType || !se(o)
                    .is(r));) 1 === o.nodeType && i.push(o), o = o[n];
            return i
        },
        sibling: function(t, e) {
            for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
            return n
        }
    });
    var Ue = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Ye = / jQuery\d+="(?:null|\d+)"/g,
        Ve = new RegExp("<(?:" + Ue + ")[\\s/>]", "i"),
        Ge = /^\s+/,
        Ze = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Je = /<([\w:]+)/,
        Qe = /<tbody/i,
        Ke = /<|&#?\w+;/,
        tn = /<(?:script|style|link)/i,
        en = /^(?:checkbox|radio)$/i,
        nn = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rn = /^$|\/(?:java|ecma)script/i,
        on = /^true\/(.*)/,
        an = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        un = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: se.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        sn = h(V),
        ln = sn.appendChild(V.createElement("div"));
    un.optgroup = un.option, un.tbody = un.tfoot = un.colgroup = un.caption = un.thead, un.th = un.td, se.fn.extend({
        text: function(t) {
            return se.access(this, function(t) {
                return t === e ? se.text(this) : this.empty()
                    .append((this[0] && this[0].ownerDocument || V)
                        .createTextNode(t))
            }, null, t, arguments.length)
        },
        wrapAll: function(t) {
            if (se.isFunction(t)) return this.each(function(e) {
                se(this)
                    .wrapAll(t.call(this, e))
            });
            if (this[0]) {
                var e = se(t, this[0].ownerDocument)
                    .eq(0)
                    .clone(!0);
                this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                        for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
                        return t
                    })
                    .append(this)
            }
            return this
        },
        wrapInner: function(t) {
            return se.isFunction(t) ? this.each(function(e) {
                se(this)
                    .wrapInner(t.call(this, e))
            }) : this.each(function() {
                var e = se(this),
                    n = e.contents();
                n.length ? n.wrapAll(t) : e.append(t)
            })
        },
        wrap: function(t) {
            var e = se.isFunction(t);
            return this.each(function(n) {
                se(this)
                    .wrapAll(e ? t.call(this, n) : t)
            })
        },
        unwrap: function() {
            return this.parent()
                .each(function() {
                    se.nodeName(this, "body") || se(this)
                        .replaceWith(this.childNodes)
                })
                .end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(t) {
                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.appendChild(t)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(t) {
                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.insertBefore(t, this.firstChild)
            })
        },
        before: function() {
            return this.domManip(arguments, !1, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this)
            })
        },
        after: function() {
            return this.domManip(arguments, !1, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
            })
        },
        remove: function(t, e) {
            for (var n, r = 0; null != (n = this[r]); r++)(!t || se.filter(t, [n])
                .length > 0) && (e || 1 !== n.nodeType || se.cleanData(b(n)), n.parentNode && (e && se.contains(n.ownerDocument, n) && m(b(n, "script")), n.parentNode.removeChild(n)));
            return this
        },
        empty: function() {
            for (var t, e = 0; null != (t = this[e]); e++) {
                for (1 === t.nodeType && se.cleanData(b(t, !1)); t.firstChild;) t.removeChild(t.firstChild);
                t.options && se.nodeName(t, "select") && (t.options.length = 0)
            }
            return this
        },
        clone: function(t, e) {
            return t = null == t ? !1 : t, e = null == e ? t : e, this.map(function() {
                return se.clone(this, t, e)
            })
        },
        html: function(t) {
            return se.access(this, function(t) {
                var n = this[0] || {},
                    r = 0,
                    i = this.length;
                if (t === e) return 1 === n.nodeType ? n.innerHTML.replace(Ye, "") : e;
                if (!("string" != typeof t || tn.test(t) || !se.support.htmlSerialize && Ve.test(t) || !se.support.leadingWhitespace && Ge.test(t) || un[(Je.exec(t) || ["", ""])[1].toLowerCase()])) {
                    t = t.replace(Ze, "<$1></$2>");
                    try {
                        for (; i > r; r++) n = this[r] || {}, 1 === n.nodeType && (se.cleanData(b(n, !1)), n.innerHTML = t);
                        n = 0
                    } catch (o) {}
                }
                n && this.empty()
                    .append(t)
            }, null, t, arguments.length)
        },
        replaceWith: function(t) {
            var e = se.isFunction(t);
            return e || "string" == typeof t || (t = se(t)
                .not(this)
                .detach()), this.domManip([t], !0, function(t) {
                var e = this.nextSibling,
                    n = this.parentNode;
                n && (se(this)
                    .remove(), n.insertBefore(t, e))
            })
        },
        detach: function(t) {
            return this.remove(t, !0)
        },
        domManip: function(t, n, r) {
            t = ee.apply([], t);
            var i, o, a, u, s, l, c = 0,
                f = this.length,
                h = this,
                m = f - 1,
                v = t[0],
                y = se.isFunction(v);
            if (y || !(1 >= f || "string" != typeof v || se.support.checkClone) && nn.test(v)) return this.each(function(i) {
                var o = h.eq(i);
                y && (t[0] = v.call(this, i, n ? o.html() : e)), o.domManip(t, n, r)
            });
            if (f && (l = se.buildFragment(t, this[0].ownerDocument, !1, this), i = l.firstChild, 1 === l.childNodes.length && (l = i), i)) {
                for (n = n && se.nodeName(i, "tr"), u = se.map(b(l, "script"), p), a = u.length; f > c; c++) o = l, c !== m && (o = se.clone(o, !0, !0), a && se.merge(u, b(o, "script"))), r.call(n && se.nodeName(this[c], "table") ? d(this[c], "tbody") : this[c], o, c);
                if (a)
                    for (s = u[u.length - 1].ownerDocument, se.map(u, g), c = 0; a > c; c++) o = u[c], rn.test(o.type || "") && !se._data(o, "globalEval") && se.contains(s, o) && (o.src ? se.ajax({
                        url: o.src,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        "throws": !0
                    }) : se.globalEval((o.text || o.textContent || o.innerHTML || "")
                        .replace(an, "")));
                l = i = null
            }
            return this
        }
    }), se.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(t, e) {
        se.fn[t] = function(t) {
            for (var n, r = 0, i = [], o = se(t), a = o.length - 1; a >= r; r++) n = r === a ? this : this.clone(!0), se(o[r])[e](n), ne.apply(i, n.get());
            return this.pushStack(i)
        }
    }), se.extend({
        clone: function(t, e, n) {
            var r, i, o, a, u, s = se.contains(t.ownerDocument, t);
            if (se.support.html5Clone || se.isXMLDoc(t) || !Ve.test("<" + t.nodeName + ">") ? o = t.cloneNode(!0) : (ln.innerHTML = t.outerHTML, ln.removeChild(o = ln.firstChild)), !(se.support.noCloneEvent && se.support.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || se.isXMLDoc(t)))
                for (r = b(o), u = b(t), a = 0; null != (i = u[a]); ++a) r[a] && y(i, r[a]);
            if (e)
                if (n)
                    for (u = u || b(t), r = r || b(o), a = 0; null != (i = u[a]); a++) v(i, r[a]);
                else v(t, o);
            return r = b(o, "script"), r.length > 0 && m(r, !s && b(t, "script")), r = u = i = null, o
        },
        buildFragment: function(t, e, n, r) {
            for (var i, o, a, u, s, l, c, f = t.length, d = h(e), p = [], g = 0; f > g; g++)
                if (o = t[g], o || 0 === o)
                    if ("object" === se.type(o)) se.merge(p, o.nodeType ? [o] : o);
                    else if (Ke.test(o)) {
                for (u = u || d.appendChild(e.createElement("div")), s = (Je.exec(o) || ["", ""])[1].toLowerCase(), c = un[s] || un._default, u.innerHTML = c[1] + o.replace(Ze, "<$1></$2>") + c[2], i = c[0]; i--;) u = u.lastChild;
                if (!se.support.leadingWhitespace && Ge.test(o) && p.push(e.createTextNode(Ge.exec(o)[0])), !se.support.tbody)
                    for (o = "table" !== s || Qe.test(o) ? "<table>" !== c[1] || Qe.test(o) ? 0 : u : u.firstChild, i = o && o.childNodes.length; i--;) se.nodeName(l = o.childNodes[i], "tbody") && !l.childNodes.length && o.removeChild(l);
                for (se.merge(p, u.childNodes), u.textContent = ""; u.firstChild;) u.removeChild(u.firstChild);
                u = d.lastChild
            } else p.push(e.createTextNode(o));
            for (u && d.removeChild(u), se.support.appendChecked || se.grep(b(p, "input"), x), g = 0; o = p[g++];)
                if ((!r || -1 === se.inArray(o, r)) && (a = se.contains(o.ownerDocument, o), u = b(d.appendChild(o), "script"), a && m(u), n))
                    for (i = 0; o = u[i++];) rn.test(o.type || "") && n.push(o);
            return u = null, d
        },
        cleanData: function(t, e) {
            for (var n, r, i, o, a = 0, u = se.expando, s = se.cache, l = se.support.deleteExpando, c = se.event.special; null != (n = t[a]); a++)
                if ((e || se.acceptData(n)) && (i = n[u], o = i && s[i])) {
                    if (o.events)
                        for (r in o.events) c[r] ? se.event.remove(n, r) : se.removeEvent(n, r, o.handle);
                    s[i] && (delete s[i], l ? delete n[u] : typeof n.removeAttribute !== Y ? n.removeAttribute(u) : n[u] = null, K.push(i))
                }
        }
    });
    var cn, fn, hn, dn = /alpha\([^)]*\)/i,
        pn = /opacity\s*=\s*([^)]*)/,
        gn = /^(top|right|bottom|left)$/,
        mn = /^(none|table(?!-c[ea]).+)/,
        vn = /^margin/,
        yn = new RegExp("^(" + le + ")(.*)$", "i"),
        bn = new RegExp("^(" + le + ")(?!px)[a-z%]+$", "i"),
        xn = new RegExp("^([+-])=(" + le + ")", "i"),
        Mn = {
            BODY: "block"
        },
        wn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        kn = {
            letterSpacing: 0,
            fontWeight: 400
        },
        Nn = ["Top", "Right", "Bottom", "Left"],
        Tn = ["Webkit", "O", "Moz", "ms"];
    se.fn.extend({
        css: function(t, n) {
            return se.access(this, function(t, n, r) {
                var i, o, a = {},
                    u = 0;
                if (se.isArray(n)) {
                    for (o = fn(t), i = n.length; i > u; u++) a[n[u]] = se.css(t, n[u], !1, o);
                    return a
                }
                return r !== e ? se.style(t, n, r) : se.css(t, n)
            }, t, n, arguments.length > 1)
        },
        show: function() {
            return k(this, !0)
        },
        hide: function() {
            return k(this)
        },
        toggle: function(t) {
            var e = "boolean" == typeof t;
            return this.each(function() {
                (e ? t : w(this)) ? se(this)
                    .show(): se(this)
                    .hide()
            })
        }
    }), se.extend({
        cssHooks: {
            opacity: {
                get: function(t, e) {
                    if (e) {
                        var n = hn(t, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": se.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(t, n, r, i) {
            if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                var o, a, u, s = se.camelCase(n),
                    l = t.style;
                if (n = se.cssProps[s] || (se.cssProps[s] = M(l, s)), u = se.cssHooks[n] || se.cssHooks[s], r === e) return u && "get" in u && (o = u.get(t, !1, i)) !== e ? o : l[n];
                if (a = typeof r, "string" === a && (o = xn.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(se.css(t, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || se.cssNumber[s] || (r += "px"), se.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (l[n] = "inherit"), u && "set" in u && (r = u.set(t, r, i)) === e))) try {
                    l[n] = r
                } catch (c) {}
            }
        },
        css: function(t, n, r, i) {
            var o, a, u, s = se.camelCase(n);
            return n = se.cssProps[s] || (se.cssProps[s] = M(t.style, s)), u = se.cssHooks[n] || se.cssHooks[s], u && "get" in u && (a = u.get(t, !0, r)), a === e && (a = hn(t, n, i)), "normal" === a && n in kn && (a = kn[n]), "" === r || r ? (o = parseFloat(a), r === !0 || se.isNumeric(o) ? o || 0 : a) : a
        },
        swap: function(t, e, n, r) {
            var i, o, a = {};
            for (o in e) a[o] = t.style[o], t.style[o] = e[o];
            i = n.apply(t, r || []);
            for (o in e) t.style[o] = a[o];
            return i
        }
    }), t.getComputedStyle ? (fn = function(e) {
        return t.getComputedStyle(e, null)
    }, hn = function(t, n, r) {
        var i, o, a, u = r || fn(t),
            s = u ? u.getPropertyValue(n) || u[n] : e,
            l = t.style;
        return u && ("" !== s || se.contains(t.ownerDocument, t) || (s = se.style(t, n)), bn.test(s) && vn.test(n) && (i = l.width, o = l.minWidth, a = l.maxWidth, l.minWidth = l.maxWidth = l.width = s, s = u.width, l.width = i, l.minWidth = o, l.maxWidth = a)), s
    }) : V.documentElement.currentStyle && (fn = function(t) {
        return t.currentStyle
    }, hn = function(t, n, r) {
        var i, o, a, u = r || fn(t),
            s = u ? u[n] : e,
            l = t.style;
        return null == s && l && l[n] && (s = l[n]), bn.test(s) && !gn.test(n) && (i = l.left, o = t.runtimeStyle, a = o && o.left, a && (o.left = t.currentStyle.left), l.left = "fontSize" === n ? "1em" : s, s = l.pixelLeft + "px", l.left = i, a && (o.left = a)), "" === s ? "auto" : s
    }), se.each(["height", "width"], function(t, e) {
        se.cssHooks[e] = {
            get: function(t, n, r) {
                return n ? 0 === t.offsetWidth && mn.test(se.css(t, "display")) ? se.swap(t, wn, function() {
                    return S(t, e, r)
                }) : S(t, e, r) : void 0
            },
            set: function(t, n, r) {
                var i = r && fn(t);
                return N(t, n, r ? T(t, e, r, se.support.boxSizing && "border-box" === se.css(t, "boxSizing", !1, i), i) : 0)
            }
        }
    }), se.support.opacity || (se.cssHooks.opacity = {
        get: function(t, e) {
            return pn.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
        },
        set: function(t, e) {
            var n = t.style,
                r = t.currentStyle,
                i = se.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
                o = r && r.filter || n.filter || "";
            n.zoom = 1, (e >= 1 || "" === e) && "" === se.trim(o.replace(dn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === e || r && !r.filter) || (n.filter = dn.test(o) ? o.replace(dn, i) : o + " " + i)
        }
    }), se(function() {
        se.support.reliableMarginRight || (se.cssHooks.marginRight = {
            get: function(t, e) {
                return e ? se.swap(t, {
                    display: "inline-block"
                }, hn, [t, "marginRight"]) : void 0
            }
        }), !se.support.pixelPosition && se.fn.position && se.each(["top", "left"], function(t, e) {
            se.cssHooks[e] = {
                get: function(t, n) {
                    return n ? (n = hn(t, e), bn.test(n) ? se(t)
                        .position()[e] + "px" : n) : void 0
                }
            }
        })
    }), se.expr && se.expr.filters && (se.expr.filters.hidden = function(t) {
        return t.offsetWidth <= 0 && t.offsetHeight <= 0 || !se.support.reliableHiddenOffsets && "none" === (t.style && t.style.display || se.css(t, "display"))
    }, se.expr.filters.visible = function(t) {
        return !se.expr.filters.hidden(t)
    }), se.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(t, e) {
        se.cssHooks[t + e] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[t + Nn[r] + e] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, vn.test(t) || (se.cssHooks[t + e].set = N)
    });
    var Sn = /%20/g,
        _n = /\[\]$/,
        En = /\r?\n/g,
        Cn = /^(?:submit|button|image|reset|file)$/i,
        An = /^(?:input|select|textarea|keygen)/i;
    se.fn.extend({
        serialize: function() {
            return se.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                    var t = se.prop(this, "elements");
                    return t ? se.makeArray(t) : this
                })
                .filter(function() {
                    var t = this.type;
                    return this.name && !se(this)
                        .is(":disabled") && An.test(this.nodeName) && !Cn.test(t) && (this.checked || !en.test(t))
                })
                .map(function(t, e) {
                    var n = se(this)
                        .val();
                    return null == n ? null : se.isArray(n) ? se.map(n, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(En, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: n.replace(En, "\r\n")
                    }
                })
                .get()
        }
    }), se.param = function(t, n) {
        var r, i = [],
            o = function(t, e) {
                e = se.isFunction(e) ? e() : null == e ? "" : e, i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
            };
        if (n === e && (n = se.ajaxSettings && se.ajaxSettings.traditional), se.isArray(t) || t.jquery && !se.isPlainObject(t)) se.each(t, function() {
            o(this.name, this.value)
        });
        else
            for (r in t) C(r, t[r], n, o);
        return i.join("&")
            .replace(Sn, "+")
    }, se.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
        se.fn[e] = function(t, n) {
            return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
        }
    }), se.fn.hover = function(t, e) {
        return this.mouseenter(t)
            .mouseleave(e || t)
    };
    var jn, Dn, qn = se.now(),
        Ln = /\?/,
        Hn = /#.*$/,
        Fn = /([?&])_=[^&]*/,
        Rn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        On = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        zn = /^(?:GET|HEAD)$/,
        Pn = /^\/\//,
        In = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        Bn = se.fn.load,
        Wn = {},
        $n = {},
        Xn = "*/".concat("*");
    try {
        Dn = G.href
    } catch (Un) {
        Dn = V.createElement("a"), Dn.href = "", Dn = Dn.href
    }
    jn = In.exec(Dn.toLowerCase()) || [], se.fn.load = function(t, n, r) {
        if ("string" != typeof t && Bn) return Bn.apply(this, arguments);
        var i, o, a, u = this,
            s = t.indexOf(" ");
        return s >= 0 && (i = t.slice(s, t.length), t = t.slice(0, s)), se.isFunction(n) ? (r = n, n = e) : n && "object" == typeof n && (a = "POST"), u.length > 0 && se.ajax({
                url: t,
                type: a,
                dataType: "html",
                data: n
            })
            .done(function(t) {
                o = arguments, u.html(i ? se("<div>")
                    .append(se.parseHTML(t))
                    .find(i) : t)
            })
            .complete(r && function(t, e) {
                u.each(r, o || [t.responseText, e, t])
            }), this
    }, se.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
        se.fn[e] = function(t) {
            return this.on(e, t)
        }
    }), se.each(["get", "post"], function(t, n) {
        se[n] = function(t, r, i, o) {
            return se.isFunction(r) && (o = o || i, i = r, r = e), se.ajax({
                url: t,
                type: n,
                dataType: o,
                data: r,
                success: i
            })
        }
    }), se.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Dn,
            type: "GET",
            isLocal: On.test(jn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Xn,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": t.String,
                "text html": !0,
                "text json": se.parseJSON,
                "text xml": se.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(t, e) {
            return e ? D(D(t, se.ajaxSettings), e) : D(se.ajaxSettings, t)
        },
        ajaxPrefilter: A(Wn),
        ajaxTransport: A($n),
        ajax: function(t, n) {
            function r(t, n, r, i) {
                var o, f, y, b, M, k = n;
                2 !== x && (x = 2, s && clearTimeout(s), c = e, u = i || "", w.readyState = t > 0 ? 4 : 0, r && (b = q(h, w, r)), t >= 200 && 300 > t || 304 === t ? (h.ifModified && (M = w.getResponseHeader("Last-Modified"), M && (se.lastModified[a] = M), M = w.getResponseHeader("etag"), M && (se.etag[a] = M)), 204 === t ? (o = !0, k = "nocontent") : 304 === t ? (o = !0, k = "notmodified") : (o = L(h, b), k = o.state, f = o.data, y = o.error, o = !y)) : (y = k, (t || !k) && (k = "error", 0 > t && (t = 0))), w.status = t, w.statusText = (n || k) + "", o ? g.resolveWith(d, [f, k, w]) : g.rejectWith(d, [w, k, y]), w.statusCode(v), v = e, l && p.trigger(o ? "ajaxSuccess" : "ajaxError", [w, h, o ? f : y]), m.fireWith(d, [w, k]), l && (p.trigger("ajaxComplete", [w, h]), --se.active || se.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = e), n = n || {};
            var i, o, a, u, s, l, c, f, h = se.ajaxSetup({}, n),
                d = h.context || h,
                p = h.context && (d.nodeType || d.jquery) ? se(d) : se.event,
                g = se.Deferred(),
                m = se.Callbacks("once memory"),
                v = h.statusCode || {},
                y = {},
                b = {},
                x = 0,
                M = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(t) {
                        var e;
                        if (2 === x) {
                            if (!f)
                                for (f = {}; e = Rn.exec(u);) f[e[1].toLowerCase()] = e[2];
                            e = f[t.toLowerCase()]
                        }
                        return null == e ? null : e
                    },
                    getAllResponseHeaders: function() {
                        return 2 === x ? u : null
                    },
                    setRequestHeader: function(t, e) {
                        var n = t.toLowerCase();
                        return x || (t = b[n] = b[n] || t, y[t] = e), this
                    },
                    overrideMimeType: function(t) {
                        return x || (h.mimeType = t), this
                    },
                    statusCode: function(t) {
                        var e;
                        if (t)
                            if (2 > x)
                                for (e in t) v[e] = [v[e], t[e]];
                            else w.always(t[w.status]);
                        return this
                    },
                    abort: function(t) {
                        var e = t || M;
                        return c && c.abort(e), r(0, e), this
                    }
                };
            if (g.promise(w)
                .complete = m.add, w.success = w.done, w.error = w.fail, h.url = ((t || h.url || Dn) + "")
                .replace(Hn, "")
                .replace(Pn, jn[1] + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = se.trim(h.dataType || "*")
                .toLowerCase()
                .match(ce) || [""], null == h.crossDomain && (i = In.exec(h.url.toLowerCase()), h.crossDomain = !(!i || i[1] === jn[1] && i[2] === jn[2] && (i[3] || ("http:" === i[1] ? 80 : 443)) == (jn[3] || ("http:" === jn[1] ? 80 : 443)))), h.data && h.processData && "string" != typeof h.data && (h.data = se.param(h.data, h.traditional)), j(Wn, h, n, w), 2 === x) return w;
            l = h.global, l && 0 === se.active++ && se.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !zn.test(h.type), a = h.url, h.hasContent || (h.data && (a = h.url += (Ln.test(a) ? "&" : "?") + h.data, delete h.data), h.cache === !1 && (h.url = Fn.test(a) ? a.replace(Fn, "$1_=" + qn++) : a + (Ln.test(a) ? "&" : "?") + "_=" + qn++)), h.ifModified && (se.lastModified[a] && w.setRequestHeader("If-Modified-Since", se.lastModified[a]), se.etag[a] && w.setRequestHeader("If-None-Match", se.etag[a])), (h.data && h.hasContent && h.contentType !== !1 || n.contentType) && w.setRequestHeader("Content-Type", h.contentType), w.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Xn + "; q=0.01" : "") : h.accepts["*"]);
            for (o in h.headers) w.setRequestHeader(o, h.headers[o]);
            if (h.beforeSend && (h.beforeSend.call(d, w, h) === !1 || 2 === x)) return w.abort();
            M = "abort";
            for (o in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) w[o](h[o]);
            if (c = j($n, h, n, w)) {
                w.readyState = 1, l && p.trigger("ajaxSend", [w, h]), h.async && h.timeout > 0 && (s = setTimeout(function() {
                    w.abort("timeout")
                }, h.timeout));
                try {
                    x = 1, c.send(y, r)
                } catch (k) {
                    if (!(2 > x)) throw k;
                    r(-1, k)
                }
            } else r(-1, "No Transport");
            return w
        },
        getScript: function(t, n) {
            return se.get(t, e, n, "script")
        },
        getJSON: function(t, e, n) {
            return se.get(t, e, n, "json")
        }
    }), se.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(t) {
                return se.globalEval(t), t
            }
        }
    }), se.ajaxPrefilter("script", function(t) {
        t.cache === e && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
    }), se.ajaxTransport("script", function(t) {
        if (t.crossDomain) {
            var n, r = V.head || se("head")[0] || V.documentElement;
            return {
                send: function(e, i) {
                    n = V.createElement("script"), n.async = !0, t.scriptCharset && (n.charset = t.scriptCharset), n.src = t.url, n.onload = n.onreadystatechange = function(t, e) {
                        (e || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, e || i(200, "success"))
                    }, r.insertBefore(n, r.firstChild)
                },
                abort: function() {
                    n && n.onload(e, !0)
                }
            }
        }
    });
    var Yn = [],
        Vn = /(=)\?(?=&|$)|\?\?/;
    se.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var t = Yn.pop() || se.expando + "_" + qn++;
            return this[t] = !0, t
        }
    }), se.ajaxPrefilter("json jsonp", function(n, r, i) {
        var o, a, u, s = n.jsonp !== !1 && (Vn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "")
            .indexOf("application/x-www-form-urlencoded") && Vn.test(n.data) && "data");
        return s || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = se.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, s ? n[s] = n[s].replace(Vn, "$1" + o) : n.jsonp !== !1 && (n.url += (Ln.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function() {
            return u || se.error(o + " was not called"), u[0]
        }, n.dataTypes[0] = "json", a = t[o], t[o] = function() {
            u = arguments
        }, i.always(function() {
            t[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Yn.push(o)), u && se.isFunction(a) && a(u[0]), u = a = e
        }), "script") : void 0
    });
    var Gn, Zn, Jn = 0,
        Qn = t.ActiveXObject && function() {
            var t;
            for (t in Gn) Gn[t](e, !0)
        };
    se.ajaxSettings.xhr = t.ActiveXObject ? function() {
        return !this.isLocal && H() || F()
    } : H, Zn = se.ajaxSettings.xhr(), se.support.cors = !!Zn && "withCredentials" in Zn, Zn = se.support.ajax = !!Zn, Zn && se.ajaxTransport(function(n) {
        if (!n.crossDomain || se.support.cors) {
            var r;
            return {
                send: function(i, o) {
                    var a, u, s = n.xhr();
                    if (n.username ? s.open(n.type, n.url, n.async, n.username, n.password) : s.open(n.type, n.url, n.async), n.xhrFields)
                        for (u in n.xhrFields) s[u] = n.xhrFields[u];
                    n.mimeType && s.overrideMimeType && s.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (u in i) s.setRequestHeader(u, i[u])
                    } catch (l) {}
                    s.send(n.hasContent && n.data || null), r = function(t, i) {
                        var u, l, c, f;
                        try {
                            if (r && (i || 4 === s.readyState))
                                if (r = e, a && (s.onreadystatechange = se.noop, Qn && delete Gn[a]), i) 4 !== s.readyState && s.abort();
                                else {
                                    f = {}, u = s.status, l = s.getAllResponseHeaders(), "string" == typeof s.responseText && (f.text = s.responseText);
                                    try {
                                        c = s.statusText
                                    } catch (h) {
                                        c = ""
                                    }
                                    u || !n.isLocal || n.crossDomain ? 1223 === u && (u = 204) : u = f.text ? 200 : 404
                                }
                        } catch (d) {
                            i || o(-1, d)
                        }
                        f && o(u, c, f, l)
                    }, n.async ? 4 === s.readyState ? setTimeout(r) : (a = ++Jn, Qn && (Gn || (Gn = {}, se(t)
                        .unload(Qn)), Gn[a] = r), s.onreadystatechange = r) : r()
                },
                abort: function() {
                    r && r(e, !0)
                }
            }
        }
    });
    var Kn, tr, er = /^(?:toggle|show|hide)$/,
        nr = new RegExp("^(?:([+-])=|)(" + le + ")([a-z%]*)$", "i"),
        rr = /queueHooks$/,
        ir = [I],
        or = {
            "*": [function(t, e) {
                var n, r, i = this.createTween(t, e),
                    o = nr.exec(e),
                    a = i.cur(),
                    u = +a || 0,
                    s = 1,
                    l = 20;
                if (o) {
                    if (n = +o[2], r = o[3] || (se.cssNumber[t] ? "" : "px"), "px" !== r && u) {
                        u = se.css(i.elem, t, !0) || n || 1;
                        do s = s || ".5", u /= s, se.style(i.elem, t, u + r); while (s !== (s = i.cur() / a) && 1 !== s && --l)
                    }
                    i.unit = r, i.start = u, i.end = o[1] ? u + (o[1] + 1) * n : n
                }
                return i
            }]
        };
    se.Animation = se.extend(z, {
        tweener: function(t, e) {
            se.isFunction(t) ? (e = t, t = ["*"]) : t = t.split(" ");
            for (var n, r = 0, i = t.length; i > r; r++) n = t[r], or[n] = or[n] || [], or[n].unshift(e)
        },
        prefilter: function(t, e) {
            e ? ir.unshift(t) : ir.push(t)
        }
    }), se.Tween = B, B.prototype = {
        constructor: B,
        init: function(t, e, n, r, i, o) {
            this.elem = t, this.prop = n, this.easing = i || "swing", this.options = e, this.start = this.now = this.cur(), this.end = r, this.unit = o || (se.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var t = B.propHooks[this.prop];
            return t && t.get ? t.get(this) : B.propHooks._default.get(this)
        },
        run: function(t) {
            var e, n = B.propHooks[this.prop];
            return this.pos = e = this.options.duration ? se.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : B.propHooks._default.set(this), this
        }
    }, B.prototype.init.prototype = B.prototype, B.propHooks = {
        _default: {
            get: function(t) {
                var e;
                return null == t.elem[t.prop] || t.elem.style && null != t.elem.style[t.prop] ? (e = se.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0) : t.elem[t.prop]
            },
            set: function(t) {
                se.fx.step[t.prop] ? se.fx.step[t.prop](t) : t.elem.style && (null != t.elem.style[se.cssProps[t.prop]] || se.cssHooks[t.prop]) ? se.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now
            }
        }
    }, B.propHooks.scrollTop = B.propHooks.scrollLeft = {
        set: function(t) {
            t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
        }
    }, se.each(["toggle", "show", "hide"], function(t, e) {
        var n = se.fn[e];
        se.fn[e] = function(t, r, i) {
            return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(W(e, !0), t, r, i)
        }
    }), se.fn.extend({
        fadeTo: function(t, e, n, r) {
            return this.filter(w)
                .css("opacity", 0)
                .show()
                .end()
                .animate({
                    opacity: e
                }, t, n, r)
        },
        animate: function(t, e, n, r) {
            var i = se.isEmptyObject(t),
                o = se.speed(e, n, r),
                a = function() {
                    var e = z(this, se.extend({}, t), o);
                    a.finish = function() {
                        e.stop(!0)
                    }, (i || se._data(this, "finish")) && e.stop(!0)
                };
            return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(t, n, r) {
            var i = function(t) {
                var e = t.stop;
                delete t.stop, e(r)
            };
            return "string" != typeof t && (r = n, n = t, t = e), n && t !== !1 && this.queue(t || "fx", []), this.each(function() {
                var e = !0,
                    n = null != t && t + "queueHooks",
                    o = se.timers,
                    a = se._data(this);
                if (n) a[n] && a[n].stop && i(a[n]);
                else
                    for (n in a) a[n] && a[n].stop && rr.test(n) && i(a[n]);
                for (n = o.length; n--;) o[n].elem !== this || null != t && o[n].queue !== t || (o[n].anim.stop(r), e = !1, o.splice(n, 1));
                (e || !r) && se.dequeue(this, t)
            })
        },
        finish: function(t) {
            return t !== !1 && (t = t || "fx"), this.each(function() {
                var e, n = se._data(this),
                    r = n[t + "queue"],
                    i = n[t + "queueHooks"],
                    o = se.timers,
                    a = r ? r.length : 0;
                for (n.finish = !0, se.queue(this, t, []), i && i.cur && i.cur.finish && i.cur.finish.call(this), e = o.length; e--;) o[e].elem === this && o[e].queue === t && (o[e].anim.stop(!0), o.splice(e, 1));
                for (e = 0; a > e; e++) r[e] && r[e].finish && r[e].finish.call(this);
                delete n.finish
            })
        }
    }), se.each({
        slideDown: W("show"),
        slideUp: W("hide"),
        slideToggle: W("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(t, e) {
        se.fn[t] = function(t, n, r) {
            return this.animate(e, t, n, r)
        }
    }), se.speed = function(t, e, n) {
        var r = t && "object" == typeof t ? se.extend({}, t) : {
            complete: n || !n && e || se.isFunction(t) && t,
            duration: t,
            easing: n && e || e && !se.isFunction(e) && e
        };
        return r.duration = se.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in se.fx.speeds ? se.fx.speeds[r.duration] : se.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            se.isFunction(r.old) && r.old.call(this), r.queue && se.dequeue(this, r.queue)
        }, r
    }, se.easing = {
        linear: function(t) {
            return t
        },
        swing: function(t) {
            return .5 - Math.cos(t * Math.PI) / 2
        }
    }, se.timers = [], se.fx = B.prototype.init, se.fx.tick = function() {
        var t, n = se.timers,
            r = 0;
        for (Kn = se.now(); r < n.length; r++) t = n[r], t() || n[r] !== t || n.splice(r--, 1);
        n.length || se.fx.stop(), Kn = e
    }, se.fx.timer = function(t) {
        t() && se.timers.push(t) && se.fx.start()
    }, se.fx.interval = 13, se.fx.start = function() {
        tr || (tr = setInterval(se.fx.tick, se.fx.interval))
    }, se.fx.stop = function() {
        clearInterval(tr), tr = null
    }, se.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, se.fx.step = {}, se.expr && se.expr.filters && (se.expr.filters.animated = function(t) {
        return se.grep(se.timers, function(e) {
                return t === e.elem
            })
            .length
    }), se.fn.offset = function(t) {
        if (arguments.length) return t === e ? this : this.each(function(e) {
            se.offset.setOffset(this, t, e)
        });
        var n, r, i = {
                top: 0,
                left: 0
            },
            o = this[0],
            a = o && o.ownerDocument;
        if (a) return n = a.documentElement, se.contains(n, o) ? (typeof o.getBoundingClientRect !== Y && (i = o.getBoundingClientRect()), r = $(a), {
            top: i.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
            left: i.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
        }) : i
    }, se.offset = {
        setOffset: function(t, e, n) {
            var r = se.css(t, "position");
            "static" === r && (t.style.position = "relative");
            var i, o, a = se(t),
                u = a.offset(),
                s = se.css(t, "top"),
                l = se.css(t, "left"),
                c = ("absolute" === r || "fixed" === r) && se.inArray("auto", [s, l]) > -1,
                f = {},
                h = {};
            c ? (h = a.position(), i = h.top, o = h.left) : (i = parseFloat(s) || 0, o = parseFloat(l) || 0), se.isFunction(e) && (e = e.call(t, n, u)), null != e.top && (f.top = e.top - u.top + i), null != e.left && (f.left = e.left - u.left + o), "using" in e ? e.using.call(t, f) : a.css(f)
        }
    }, se.fn.extend({
        position: function() {
            if (this[0]) {
                var t, e, n = {
                        top: 0,
                        left: 0
                    },
                    r = this[0];
                return "fixed" === se.css(r, "position") ? e = r.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), se.nodeName(t[0], "html") || (n = t.offset()), n.top += se.css(t[0], "borderTopWidth", !0), n.left += se.css(t[0], "borderLeftWidth", !0)), {
                    top: e.top - n.top - se.css(r, "marginTop", !0),
                    left: e.left - n.left - se.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var t = this.offsetParent || V.documentElement; t && !se.nodeName(t, "html") && "static" === se.css(t, "position");) t = t.offsetParent;
                return t || V.documentElement
            })
        }
    }), se.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, n) {
        var r = /Y/.test(n);
        se.fn[t] = function(i) {
            return se.access(this, function(t, i, o) {
                var a = $(t);
                return o === e ? a ? n in a ? a[n] : a.document.documentElement[i] : t[i] : (a ? a.scrollTo(r ? se(a)
                    .scrollLeft() : o, r ? o : se(a)
                    .scrollTop()) : t[i] = o, void 0)
            }, t, i, arguments.length, null)
        }
    }), se.each({
        Height: "height",
        Width: "width"
    }, function(t, n) {
        se.each({
            padding: "inner" + t,
            content: n,
            "": "outer" + t
        }, function(r, i) {
            se.fn[i] = function(i, o) {
                var a = arguments.length && (r || "boolean" != typeof i),
                    u = r || (i === !0 || o === !0 ? "margin" : "border");
                return se.access(this, function(n, r, i) {
                    var o;
                    return se.isWindow(n) ? n.document.documentElement["client" + t] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + t], o["scroll" + t], n.body["offset" + t], o["offset" + t], o["client" + t])) : i === e ? se.css(n, r, u) : se.style(n, r, i, u)
                }, n, a ? i : e, a, null)
            }
        })
    }), t.jQuery = t.$ = se, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return se
    })
}(window), d3 = function() {
    function t(t) {
        return null != t && !isNaN(t)
    }

    function e(t) {
        return t.length
    }

    function n(t) {
        for (var e = 1; t * e % 1;) e *= 10;
        return e
    }

    function r(t, e) {
        try {
            for (var n in e) Object.defineProperty(t.prototype, n, {
                value: e[n],
                enumerable: !1
            })
        } catch (r) {
            t.prototype = e
        }
    }

    function i() {}

    function o() {}

    function a(t, e, n) {
        return function() {
            var r = n.apply(e, arguments);
            return r === e ? t : r
        }
    }

    function u() {}

    function s(t) {
        function e() {
            for (var e, r = n, i = -1, o = r.length; ++i < o;)(e = r[i].on) && e.apply(this, arguments);
            return t
        }
        var n = [],
            r = new i;
        return e.on = function(e, i) {
            var o, a = r.get(e);
            return arguments.length < 2 ? a && a.on : (a && (a.on = null, n = n.slice(0, o = n.indexOf(a))
                .concat(n.slice(o + 1)), r.remove(e)), i && n.push(r.set(e, {
                on: i
            })), t)
        }, e
    }

    function l() {
        ua.event.stopPropagation(), ua.event.preventDefault()
    }

    function c() {
        for (var t, e = ua.event; t = e.sourceEvent;) e = t;
        return e
    }

    function f(t, e) {
        function n() {
            t.on(e, null)
        }
        t.on(e, function() {
            l(), n()
        }, !0), setTimeout(n, 0)
    }

    function h(t) {
        for (var e = new u, n = 0, r = arguments.length; ++n < r;) e[arguments[n]] = s(e);
        return e.of = function(n, r) {
            return function(i) {
                try {
                    var o = i.sourceEvent = ua.event;
                    i.target = t, ua.event = i, e[i.type].apply(n, r)
                } finally {
                    ua.event = o
                }
            }
        }, e
    }

    function d(t, e) {
        var n = t.ownerSVGElement || t;
        if (n.createSVGPoint) {
            var r = n.createSVGPoint();
            if (0 > ma && (la.scrollX || la.scrollY)) {
                n = ua.select(sa.body)
                    .append("svg")
                    .style("position", "absolute")
                    .style("top", 0)
                    .style("left", 0);
                var i = n[0][0].getScreenCTM();
                ma = !(i.f || i.e), n.remove()
            }
            return ma ? (r.x = e.pageX, r.y = e.pageY) : (r.x = e.clientX, r.y = e.clientY), r = r.matrixTransform(t.getScreenCTM()
                .inverse()), [r.x, r.y]
        }
        var o = t.getBoundingClientRect();
        return [e.clientX - o.left - t.clientLeft, e.clientY - o.top - t.clientTop]
    }

    function p(t) {
        for (var e = -1, n = t.length, r = []; ++e < n;) r.push(t[e]);
        return r
    }

    function g(t) {
        return Array.prototype.slice.call(t)
    }

    function m(t) {
        return ba(t, Ta), t
    }

    function v(t) {
        return function() {
            return xa(t, this)
        }
    }

    function y(t) {
        return function() {
            return Ma(t, this)
        }
    }

    function x(t, e) {
        function n() {
            this.removeAttribute(t)
        }

        function r() {
            this.removeAttributeNS(t.space, t.local)
        }

        function i() {
            this.setAttribute(t, e)
        }

        function o() {
            this.setAttributeNS(t.space, t.local, e)
        }

        function a() {
            var n = e.apply(this, arguments);
            null == n ? this.removeAttribute(t) : this.setAttribute(t, n)
        }

        function u() {
            var n = e.apply(this, arguments);
            null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n)
        }
        return t = ua.ns.qualify(t), null == e ? t.local ? r : n : "function" == typeof e ? t.local ? u : a : t.local ? o : i
    }

    function M(t) {
        return t.trim()
            .replace(/\s+/g, " ")
    }

    function w(t) {
        return RegExp("(?:^|\\s+)" + ua.requote(t) + "(?:\\s+|$)", "g")
    }

    function k(t, e) {
        function n() {
            for (var n = -1; ++n < i;) t[n](this, e)
        }

        function r() {
            for (var n = -1, r = e.apply(this, arguments); ++n < i;) t[n](this, r)
        }
        t = t.trim()
            .split(/\s+/)
            .map(N);
        var i = t.length;
        return "function" == typeof e ? r : n
    }

    function N(t) {
        var e = w(t);
        return function(n, r) {
            if (i = n.classList) return r ? i.add(t) : i.remove(t);
            var i = n.getAttribute("class") || "";
            r ? (e.lastIndex = 0, e.test(i) || n.setAttribute("class", M(i + " " + t))) : n.setAttribute("class", M(i.replace(e, " ")))
        }
    }

    function T(t, e, n) {
        function r() {
            this.style.removeProperty(t)
        }

        function i() {
            this.style.setProperty(t, e, n)
        }

        function o() {
            var r = e.apply(this, arguments);
            null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n)
        }
        return null == e ? r : "function" == typeof e ? o : i
    }

    function S(t, e) {
        function n() {
            delete this[t]
        }

        function r() {
            this[t] = e
        }

        function i() {
            var n = e.apply(this, arguments);
            null == n ? delete this[t] : this[t] = n
        }
        return null == e ? n : "function" == typeof e ? i : r
    }

    function _(t) {
        return {
            __data__: t
        }
    }

    function E(t) {
        return function() {
            return Na(this, t)
        }
    }

    function C(t) {
        return arguments.length || (t = ua.ascending),
            function(e, n) {
                return !e - !n || t(e.__data__, n.__data__)
            }
    }

    function A() {}

    function j(t, e, n) {
        function r() {
            var e = this[a];
            e && (this.removeEventListener(t, e, e.$), delete this[a])
        }

        function i() {
            var i = s(e, va(arguments));
            r.call(this), this.addEventListener(t, this[a] = i, i.$ = n), i._ = e
        }

        function o() {
            var e, n = RegExp("^__on([^.]+)" + ua.requote(t) + "$");
            for (var r in this)
                if (e = r.match(n)) {
                    var i = this[r];
                    this.removeEventListener(e[1], i, i.$), delete this[r]
                }
        }
        var a = "__on" + t,
            u = t.indexOf("."),
            s = D;
        u > 0 && (t = t.substring(0, u));
        var l = Ea.get(t);
        return l && (t = l, s = q), u ? e ? i : r : e ? A : o
    }

    function D(t, e) {
        return function(n) {
            var r = ua.event;
            ua.event = n, e[0] = this.__data__;
            try {
                t.apply(this, e)
            } finally {
                ua.event = r
            }
        }
    }

    function q(t, e) {
        var n = D(t, e);
        return function(t) {
            var e = this,
                r = t.relatedTarget;
            r && (r === e || 8 & r.compareDocumentPosition(e)) || n.call(e, t)
        }
    }

    function L(t, e) {
        for (var n = 0, r = t.length; r > n; n++)
            for (var i, o = t[n], a = 0, u = o.length; u > a; a++)(i = o[a]) && e(i, a, n);
        return t
    }

    function H(t) {
        return ba(t, Ca), t
    }

    function F() {}

    function R(t, e, n) {
        return new O(t, e, n)
    }

    function O(t, e, n) {
        this.h = t, this.s = e, this.l = n
    }

    function z(t, e, n) {
        function r(t) {
            return t > 360 ? t -= 360 : 0 > t && (t += 360), 60 > t ? o + (a - o) * t / 60 : 180 > t ? a : 240 > t ? o + (a - o) * (240 - t) / 60 : o
        }

        function i(t) {
            return Math.round(255 * r(t))
        }
        var o, a;
        return t = isNaN(t) ? 0 : (t %= 360) < 0 ? t + 360 : t, e = isNaN(e) ? 0 : 0 > e ? 0 : e > 1 ? 1 : e, n = 0 > n ? 0 : n > 1 ? 1 : n, a = .5 >= n ? n * (1 + e) : n + e - n * e, o = 2 * n - a, ne(i(t + 120), i(t), i(t - 120))
    }

    function P(t) {
        return t > 0 ? 1 : 0 > t ? -1 : 0
    }

    function I(t) {
        return Math.acos(Math.max(-1, Math.min(1, t)))
    }

    function B(t) {
        return t > 1 ? Ha / 2 : -1 > t ? -Ha / 2 : Math.asin(t)
    }

    function W(t) {
        return (Math.exp(t) - Math.exp(-t)) / 2
    }

    function $(t) {
        return (Math.exp(t) + Math.exp(-t)) / 2
    }

    function X(t) {
        return (t = Math.sin(t / 2)) * t
    }

    function U(t, e, n) {
        return new Y(t, e, n)
    }

    function Y(t, e, n) {
        this.h = t, this.c = e, this.l = n
    }

    function V(t, e, n) {
        return isNaN(t) && (t = 0), isNaN(e) && (e = 0), G(n, Math.cos(t *= Ra) * e, Math.sin(t) * e)
    }

    function G(t, e, n) {
        return new Z(t, e, n)
    }

    function Z(t, e, n) {
        this.l = t, this.a = e, this.b = n
    }

    function J(t, e, n) {
        var r = (t + 16) / 116,
            i = r + e / 500,
            o = r - n / 200;
        return i = K(i) * Ia, r = K(r) * Ba, o = K(o) * Wa, ne(ee(3.2404542 * i - 1.5371385 * r - .4985314 * o), ee(-.969266 * i + 1.8760108 * r + .041556 * o), ee(.0556434 * i - .2040259 * r + 1.0572252 * o))
    }

    function Q(t, e, n) {
        return t > 0 ? U(Math.atan2(n, e) * Oa, Math.sqrt(e * e + n * n), t) : U(0 / 0, 0 / 0, t)
    }

    function K(t) {
        return t > .206893034 ? t * t * t : (t - 4 / 29) / 7.787037
    }

    function te(t) {
        return t > .008856 ? Math.pow(t, 1 / 3) : 7.787037 * t + 4 / 29
    }

    function ee(t) {
        return Math.round(255 * (.00304 >= t ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055))
    }

    function ne(t, e, n) {
        return new re(t, e, n)
    }

    function re(t, e, n) {
        this.r = t, this.g = e, this.b = n
    }

    function ie(t) {
        return 16 > t ? "0" + Math.max(0, t)
            .toString(16) : Math.min(255, t)
            .toString(16)
    }

    function oe(t, e, n) {
        var r, i, o, a = 0,
            u = 0,
            s = 0;
        if (r = /([a-z]+)\((.*)\)/i.exec(t)) switch (i = r[2].split(","), r[1]) {
            case "hsl":
                return n(parseFloat(i[0]), parseFloat(i[1]) / 100, parseFloat(i[2]) / 100);
            case "rgb":
                return e(le(i[0]), le(i[1]), le(i[2]))
        }
        return (o = Ua.get(t)) ? e(o.r, o.g, o.b) : (null != t && "#" === t.charAt(0) && (4 === t.length ? (a = t.charAt(1), a += a, u = t.charAt(2), u += u, s = t.charAt(3), s += s) : 7 === t.length && (a = t.substring(1, 3), u = t.substring(3, 5), s = t.substring(5, 7)), a = parseInt(a, 16), u = parseInt(u, 16), s = parseInt(s, 16)), e(a, u, s))
    }

    function ae(t, e, n) {
        var r, i, o = Math.min(t /= 255, e /= 255, n /= 255),
            a = Math.max(t, e, n),
            u = a - o,
            s = (a + o) / 2;
        return u ? (i = .5 > s ? u / (a + o) : u / (2 - a - o), r = t == a ? (e - n) / u + (n > e ? 6 : 0) : e == a ? (n - t) / u + 2 : (t - e) / u + 4, r *= 60) : (r = 0 / 0, i = s > 0 && 1 > s ? 0 : r), R(r, i, s)
    }

    function ue(t, e, n) {
        t = se(t), e = se(e), n = se(n);
        var r = te((.4124564 * t + .3575761 * e + .1804375 * n) / Ia),
            i = te((.2126729 * t + .7151522 * e + .072175 * n) / Ba),
            o = te((.0193339 * t + .119192 * e + .9503041 * n) / Wa);
        return G(116 * i - 16, 500 * (r - i), 200 * (i - o))
    }

    function se(t) {
        return (t /= 255) <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
    }

    function le(t) {
        var e = parseFloat(t);
        return "%" === t.charAt(t.length - 1) ? Math.round(2.55 * e) : e
    }

    function ce(t) {
        return "function" == typeof t ? t : function() {
            return t
        }
    }

    function fe(t) {
        return t
    }

    function he(t) {
        return 1 === t.length ? function(e, n) {
            t(null == e ? n : null)
        } : t
    }

    function de(t, e) {
        function n(t, n, o) {
            arguments.length < 3 && (o = n, n = null);
            var a = ua.xhr(t, e, o);
            return a.row = function(t) {
                return arguments.length ? a.response(null == (n = t) ? r : i(t)) : n
            }, a.row(n)
        }

        function r(t) {
            return n.parse(t.responseText)
        }

        function i(t) {
            return function(e) {
                return n.parse(e.responseText, t)
            }
        }

        function a(e) {
            return e.map(u)
                .join(t)
        }

        function u(t) {
            return s.test(t) ? '"' + t.replace(/\"/g, '""') + '"' : t
        }
        var s = RegExp('["' + t + "\n]"),
            l = t.charCodeAt(0);
        return n.parse = function(t, e) {
            var r;
            return n.parseRows(t, function(t, n) {
                if (r) return r(t, n - 1);
                var i = Function("d", "return {" + t.map(function(t, e) {
                        return JSON.stringify(t) + ": d[" + e + "]"
                    })
                    .join(",") + "}");
                r = e ? function(t, n) {
                    return e(i(t), n)
                } : i
            })
        }, n.parseRows = function(t, e) {
            function n() {
                if (c >= s) return a;
                if (i) return i = !1, o;
                var e = c;
                if (34 === t.charCodeAt(e)) {
                    for (var n = e; n++ < s;)
                        if (34 === t.charCodeAt(n)) {
                            if (34 !== t.charCodeAt(n + 1)) break;
                            ++n
                        }
                    c = n + 2;
                    var r = t.charCodeAt(n + 1);
                    return 13 === r ? (i = !0, 10 === t.charCodeAt(n + 2) && ++c) : 10 === r && (i = !0), t.substring(e + 1, n)
                        .replace(/""/g, '"')
                }
                for (; s > c;) {
                    var r = t.charCodeAt(c++),
                        u = 1;
                    if (10 === r) i = !0;
                    else if (13 === r) i = !0, 10 === t.charCodeAt(c) && (++c, ++u);
                    else if (r !== l) continue;
                    return t.substring(e, c - u)
                }
                return t.substring(e)
            }
            for (var r, i, o = {}, a = {}, u = [], s = t.length, c = 0, f = 0;
                (r = n()) !== a;) {
                for (var h = []; r !== o && r !== a;) h.push(r), r = n();
                (!e || (h = e(h, f++))) && u.push(h)
            }
            return u
        }, n.format = function(e) {
            if (Array.isArray(e[0])) return n.formatRows(e);
            var r = new o,
                i = [];
            return e.forEach(function(t) {
                    for (var e in t) r.has(e) || i.push(r.add(e))
                }), [i.map(u)
                    .join(t)
                ].concat(e.map(function(e) {
                    return i.map(function(t) {
                            return u(e[t])
                        })
                        .join(t)
                }))
                .join("\n")
        }, n.formatRows = function(t) {
            return t.map(a)
                .join("\n")
        }, n
    }

    function pe() {
        for (var t, e = Date.now(), n = Ja; n;) t = e - n.then, t >= n.delay && (n.flush = n.callback(t)), n = n.next;
        var r = ge() - e;
        r > 24 ? (isFinite(r) && (clearTimeout(Va), Va = setTimeout(pe, r)), Ya = 0) : (Ya = 1, Qa(pe))
    }

    function ge() {
        for (var t = null, e = Ja, n = 1 / 0; e;) e.flush ? (delete Za[e.callback.id], e = t ? t.next = e.next : Ja = e.next) : (n = Math.min(n, e.then + e.delay), e = (t = e)
            .next);
        return n
    }

    function me(t, e) {
        var n = Math.pow(10, 3 * Math.abs(8 - e));
        return {
            scale: e > 8 ? function(t) {
                return t / n
            } : function(t) {
                return t * n
            },
            symbol: t
        }
    }

    function ve(t, e) {
        return e - (t ? Math.ceil(Math.log(t) / Math.LN10) : 1)
    }

    function ye(t) {
        return t + ""
    }

    function be(t, e) {
        t && su.hasOwnProperty(t.type) && su[t.type](t, e)
    }

    function xe(t, e, n) {
        var r, i = -1,
            o = t.length - n;
        for (e.lineStart(); ++i < o;) r = t[i], e.point(r[0], r[1]);
        e.lineEnd()
    }

    function Me(t, e) {
        var n = -1,
            r = t.length;
        for (e.polygonStart(); ++n < r;) xe(t[n], e, 1);
        e.polygonEnd()
    }

    function we() {
        function t(t, e) {
            t *= Ra, e = e * Ra / 2 + Ha / 4;
            var n = t - r,
                a = Math.cos(e),
                u = Math.sin(e),
                s = o * u,
                l = i * a + s * Math.cos(n),
                c = s * Math.sin(n);
            cu += Math.atan2(c, l), r = t, i = a, o = u
        }
        var e, n, r, i, o;
        fu.point = function(a, u) {
            fu.point = t, r = (e = a) * Ra, i = Math.cos(u = (n = u) * Ra / 2 + Ha / 4), o = Math.sin(u)
        }, fu.lineEnd = function() {
            t(e, n)
        }
    }

    function ke(t) {
        var e = t[0],
            n = t[1],
            r = Math.cos(n);
        return [r * Math.cos(e), r * Math.sin(e), Math.sin(n)]
    }

    function Ne(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
    }

    function Te(t, e) {
        return [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]]
    }

    function Se(t, e) {
        t[0] += e[0], t[1] += e[1], t[2] += e[2]
    }

    function _e(t, e) {
        return [t[0] * e, t[1] * e, t[2] * e]
    }

    function Ee(t) {
        var e = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
        t[0] /= e, t[1] /= e, t[2] /= e
    }

    function Ce(t) {
        return [Math.atan2(t[1], t[0]), Math.asin(Math.max(-1, Math.min(1, t[2])))]
    }

    function Ae(t, e) {
        return Math.abs(t[0] - e[0]) < Fa && Math.abs(t[1] - e[1]) < Fa
    }

    function je(t, e) {
        if (!hu) {
            ++du, t *= Ra;
            var n = Math.cos(e *= Ra);
            pu += (n * Math.cos(t) - pu) / du, gu += (n * Math.sin(t) - gu) / du, mu += (Math.sin(e) - mu) / du
        }
    }

    function De() {
        var t, e;
        hu = 1, qe(), hu = 2;
        var n = vu.point;
        vu.point = function(r, i) {
            n(t = r, e = i)
        }, vu.lineEnd = function() {
            vu.point(t, e), Le(), vu.lineEnd = Le
        }
    }

    function qe() {
        function t(t, i) {
            t *= Ra;
            var o = Math.cos(i *= Ra),
                a = o * Math.cos(t),
                u = o * Math.sin(t),
                s = Math.sin(i),
                l = Math.atan2(Math.sqrt((l = n * s - r * u) * l + (l = r * a - e * s) * l + (l = e * u - n * a) * l), e * a + n * u + r * s);
            du += l, pu += l * (e + (e = a)), gu += l * (n + (n = u)), mu += l * (r + (r = s))
        }
        var e, n, r;
        hu > 1 || (1 > hu && (hu = 1, du = pu = gu = mu = 0), vu.point = function(i, o) {
            i *= Ra;
            var a = Math.cos(o *= Ra);
            e = a * Math.cos(i), n = a * Math.sin(i), r = Math.sin(o), vu.point = t
        })
    }

    function Le() {
        vu.point = je
    }

    function He() {
        return !0
    }

    function Fe(t, e, n, r, i) {
        var o = [],
            a = [];
        if (t.forEach(function(t) {
                if (!((e = t.length - 1) <= 0)) {
                    var e, n = t[0],
                        r = t[e];
                    if (Ae(n, r)) {
                        i.lineStart();
                        for (var u = 0; e > u; ++u) i.point((n = t[u])[0], n[1]);
                        return i.lineEnd(), void 0
                    }
                    var s = {
                            point: n,
                            points: t,
                            other: null,
                            visited: !1,
                            entry: !0,
                            subject: !0
                        },
                        l = {
                            point: n,
                            points: [n],
                            other: s,
                            visited: !1,
                            entry: !1,
                            subject: !1
                        };
                    s.other = l, o.push(s), a.push(l), s = {
                        point: r,
                        points: [r],
                        other: null,
                        visited: !1,
                        entry: !1,
                        subject: !0
                    }, l = {
                        point: r,
                        points: [r],
                        other: s,
                        visited: !1,
                        entry: !0,
                        subject: !1
                    }, s.other = l, o.push(s), a.push(l)
                }
            }), a.sort(e), Re(o), Re(a), o.length) {
            if (n)
                for (var u = 1, s = !n(a[0].point), l = a.length; l > u; ++u) a[u].entry = s = !s;
            for (var c, f, h, d = o[0];;) {
                for (c = d; c.visited;)
                    if ((c = c.next) === d) return;
                f = c.points, i.lineStart();
                do {
                    if (c.visited = c.other.visited = !0, c.entry) {
                        if (c.subject)
                            for (var u = 0; u < f.length; u++) i.point((h = f[u])[0], h[1]);
                        else r(c.point, c.next.point, 1, i);
                        c = c.next
                    } else {
                        if (c.subject) {
                            f = c.prev.points;
                            for (var u = f.length; --u >= 0;) i.point((h = f[u])[0], h[1])
                        } else r(c.point, c.prev.point, -1, i);
                        c = c.prev
                    }
                    c = c.other, f = c.points
                } while (!c.visited);
                i.lineEnd()
            }
        }
    }

    function Re(t) {
        if (e = t.length) {
            for (var e, n, r = 0, i = t[0]; ++r < e;) i.next = n = t[r], n.prev = i, i = n;
            i.next = n = t[0], n.prev = i
        }
    }

    function Oe(t, e, n) {
        return function(r) {
            function i(e, n) {
                t(e, n) && r.point(e, n)
            }

            function o(t, e) {
                m.point(t, e)
            }

            function a() {
                v.point = o, m.lineStart()
            }

            function u() {
                v.point = i, m.lineEnd()
            }

            function s(t, e) {
                b.point(t, e), g.push([t, e])
            }

            function l() {
                b.lineStart(), g = []
            }

            function c() {
                s(g[0][0], g[0][1]), b.lineEnd();
                var t, e = b.clean(),
                    n = y.buffer(),
                    i = n.length;
                if (!i) return p = !0, d += Ie(g, -1), g = null, void 0;
                if (g = null, 1 & e) {
                    t = n[0], h += Ie(t, 1);
                    var o, i = t.length - 1,
                        a = -1;
                    for (r.lineStart(); ++a < i;) r.point((o = t[a])[0], o[1]);
                    return r.lineEnd(), void 0
                }
                i > 1 && 2 & e && n.push(n.pop()
                    .concat(n.shift())), f.push(n.filter(ze))
            }
            var f, h, d, p, g, m = e(r),
                v = {
                    point: i,
                    lineStart: a,
                    lineEnd: u,
                    polygonStart: function() {
                        v.point = s, v.lineStart = l, v.lineEnd = c, p = !1, d = h = 0, f = [], r.polygonStart()
                    },
                    polygonEnd: function() {
                        v.point = i, v.lineStart = a, v.lineEnd = u, f = ua.merge(f), f.length ? Fe(f, Be, null, n, r) : (-Fa > h || p && -Fa > d) && (r.lineStart(), n(null, null, 1, r), r.lineEnd()), r.polygonEnd(), f = null
                    },
                    sphere: function() {
                        r.polygonStart(), r.lineStart(), n(null, null, 1, r), r.lineEnd(), r.polygonEnd()
                    }
                },
                y = Pe(),
                b = e(y);
            return v
        }
    }

    function ze(t) {
        return t.length > 1
    }

    function Pe() {
        var t, e = [];
        return {
            lineStart: function() {
                e.push(t = [])
            },
            point: function(e, n) {
                t.push([e, n])
            },
            lineEnd: A,
            buffer: function() {
                var n = e;
                return e = [], t = null, n
            },
            rejoin: function() {
                e.length > 1 && e.push(e.pop()
                    .concat(e.shift()))
            }
        }
    }

    function Ie(t, e) {
        if (!(n = t.length)) return 0;
        for (var n, r, i, o = 0, a = 0, u = t[0], s = u[0], l = u[1], c = Math.cos(l), f = Math.atan2(e * Math.sin(s) * c, Math.sin(l)), h = 1 - e * Math.cos(s) * c, d = f; ++o < n;) u = t[o], c = Math.cos(l = u[1]), r = Math.atan2(e * Math.sin(s = u[0]) * c, Math.sin(l)), i = 1 - e * Math.cos(s) * c, Math.abs(h - 2) < Fa && Math.abs(i - 2) < Fa || (Math.abs(i) < Fa || Math.abs(h) < Fa || (Math.abs(Math.abs(r - f) - Ha) < Fa ? i + h > 2 && (a += 4 * (r - f)) : a += Math.abs(h - 2) < Fa ? 4 * (r - d) : ((3 * Ha + r - f) % (2 * Ha) - Ha) * (h + i)), d = f, f = r, h = i);
        return a
    }

    function Be(t, e) {
        return ((t = t.point)[0] < 0 ? t[1] - Ha / 2 - Fa : Ha / 2 - t[1]) - ((e = e.point)[0] < 0 ? e[1] - Ha / 2 - Fa : Ha / 2 - e[1])
    }

    function We(t) {
        var e, n = 0 / 0,
            r = 0 / 0,
            i = 0 / 0;
        return {
            lineStart: function() {
                t.lineStart(), e = 1
            },
            point: function(o, a) {
                var u = o > 0 ? Ha : -Ha,
                    s = Math.abs(o - n);
                Math.abs(s - Ha) < Fa ? (t.point(n, r = (r + a) / 2 > 0 ? Ha / 2 : -Ha / 2), t.point(i, r), t.lineEnd(), t.lineStart(), t.point(u, r), t.point(o, r), e = 0) : i !== u && s >= Ha && (Math.abs(n - i) < Fa && (n -= i * Fa), Math.abs(o - u) < Fa && (o -= u * Fa), r = $e(n, r, o, a), t.point(i, r), t.lineEnd(), t.lineStart(), t.point(u, r), e = 0), t.point(n = o, r = a), i = u
            },
            lineEnd: function() {
                t.lineEnd(), n = r = 0 / 0
            },
            clean: function() {
                return 2 - e
            }
        }
    }

    function $e(t, e, n, r) {
        var i, o, a = Math.sin(t - n);
        return Math.abs(a) > Fa ? Math.atan((Math.sin(e) * (o = Math.cos(r)) * Math.sin(n) - Math.sin(r) * (i = Math.cos(e)) * Math.sin(t)) / (i * o * a)) : (e + r) / 2
    }

    function Xe(t, e, n, r) {
        var i;
        if (null == t) i = n * Ha / 2, r.point(-Ha, i), r.point(0, i), r.point(Ha, i), r.point(Ha, 0), r.point(Ha, -i), r.point(0, -i), r.point(-Ha, -i), r.point(-Ha, 0), r.point(-Ha, i);
        else if (Math.abs(t[0] - e[0]) > Fa) {
            var o = (t[0] < e[0] ? 1 : -1) * Ha;
            i = n * o / 2, r.point(-o, i), r.point(0, i), r.point(o, i)
        } else r.point(e[0], e[1])
    }

    function Ue(t) {
        function e(t, e) {
            return Math.cos(t) * Math.cos(e) > o
        }

        function n(t) {
            var n, o, s, l, c;
            return {
                lineStart: function() {
                    l = s = !1, c = 1
                },
                point: function(f, h) {
                    var d, p = [f, h],
                        g = e(f, h),
                        m = a ? g ? 0 : i(f, h) : g ? i(f + (0 > f ? Ha : -Ha), h) : 0;
                    if (!n && (l = s = g) && t.lineStart(), g !== s && (d = r(n, p), (Ae(n, d) || Ae(p, d)) && (p[0] += Fa, p[1] += Fa, g = e(p[0], p[1]))), g !== s) c = 0, g ? (t.lineStart(), d = r(p, n), t.point(d[0], d[1])) : (d = r(n, p), t.point(d[0], d[1]), t.lineEnd()), n = d;
                    else if (u && n && a ^ g) {
                        var v;
                        m & o || !(v = r(p, n, !0)) || (c = 0, a ? (t.lineStart(), t.point(v[0][0], v[0][1]), t.point(v[1][0], v[1][1]), t.lineEnd()) : (t.point(v[1][0], v[1][1]), t.lineEnd(), t.lineStart(), t.point(v[0][0], v[0][1])))
                    }!g || n && Ae(n, p) || t.point(p[0], p[1]), n = p, s = g, o = m
                },
                lineEnd: function() {
                    s && t.lineEnd(), n = null
                },
                clean: function() {
                    return c | (l && s) << 1
                }
            }
        }

        function r(t, e, n) {
            var r = ke(t),
                i = ke(e),
                a = [1, 0, 0],
                u = Te(r, i),
                s = Ne(u, u),
                l = u[0],
                c = s - l * l;
            if (!c) return !n && t;
            var f = o * s / c,
                h = -o * l / c,
                d = Te(a, u),
                p = _e(a, f),
                g = _e(u, h);
            Se(p, g);
            var m = d,
                v = Ne(p, m),
                y = Ne(m, m),
                b = v * v - y * (Ne(p, p) - 1);
            if (!(0 > b)) {
                var x = Math.sqrt(b),
                    M = _e(m, (-v - x) / y);
                if (Se(M, p), M = Ce(M), !n) return M;
                var w, k = t[0],
                    N = e[0],
                    T = t[1],
                    S = e[1];
                k > N && (w = k, k = N, N = w);
                var _ = N - k,
                    E = Math.abs(_ - Ha) < Fa,
                    C = E || Fa > _;
                if (!E && T > S && (w = T, T = S, S = w), C ? E ? T + S > 0 ^ M[1] < (Math.abs(M[0] - k) < Fa ? T : S) : T <= M[1] && M[1] <= S : _ > Ha ^ (k <= M[0] && M[0] <= N)) {
                    var A = _e(m, (-v + x) / y);
                    return Se(A, p), [M, Ce(A)]
                }
            }
        }

        function i(e, n) {
            var r = a ? t : Ha - t,
                i = 0;
            return -r > e ? i |= 1 : e > r && (i |= 2), -r > n ? i |= 4 : n > r && (i |= 8), i
        }
        var o = Math.cos(t),
            a = o > 0,
            u = Math.abs(o) > Fa,
            s = an(t, 6 * Ra);
        return Oe(e, n, s)
    }

    function Ye(t, e, n, r) {
        function i(r, i) {
            return Math.abs(r[0] - t) < Fa ? i > 0 ? 0 : 3 : Math.abs(r[0] - n) < Fa ? i > 0 ? 2 : 1 : Math.abs(r[1] - e) < Fa ? i > 0 ? 1 : 0 : i > 0 ? 3 : 2
        }

        function o(t, e) {
            return a(t.point, e.point)
        }

        function a(t, e) {
            var n = i(t, 1),
                r = i(e, 1);
            return n !== r ? n - r : 0 === n ? e[1] - t[1] : 1 === n ? t[0] - e[0] : 2 === n ? t[1] - e[1] : e[0] - t[0]
        }

        function u(i, o) {
            var a = o[0] - i[0],
                u = o[1] - i[1],
                s = [0, 1];
            return Math.abs(a) < Fa && Math.abs(u) < Fa ? t <= i[0] && i[0] <= n && e <= i[1] && i[1] <= r : Ve(t - i[0], a, s) && Ve(i[0] - n, -a, s) && Ve(e - i[1], u, s) && Ve(i[1] - r, -u, s) ? (s[1] < 1 && (o[0] = i[0] + s[1] * a, o[1] = i[1] + s[1] * u), s[0] > 0 && (i[0] += s[0] * a, i[1] += s[0] * u), !0) : !1
        }
        return function(s) {
            function l(o) {
                var a = i(o, -1),
                    u = c([0 === a || 3 === a ? t : n, a > 1 ? r : e]);
                return u
            }

            function c(t) {
                for (var e = 0, n = x.length, r = t[1], i = 0; n > i; ++i)
                    for (var o = 1, a = x[i], u = a.length, s = a[0]; u > o; ++o) b = a[o], s[1] <= r ? b[1] > r && f(s, b, t) > 0 && ++e : b[1] <= r && f(s, b, t) < 0 && --e, s = b;
                return 0 !== e
            }

            function f(t, e, n) {
                return (e[0] - t[0]) * (n[1] - t[1]) - (n[0] - t[0]) * (e[1] - t[1])
            }

            function h(o, u, s, l) {
                var c = 0,
                    f = 0;
                if (null == o || (c = i(o, s)) !== (f = i(u, s)) || a(o, u) < 0 ^ s > 0) {
                    do l.point(0 === c || 3 === c ? t : n, c > 1 ? r : e); while ((c = (c + s + 4) % 4) !== f)
                } else l.point(u[0], u[1])
            }

            function d(i, o) {
                return i >= t && n >= i && o >= e && r >= o
            }

            function p(t, e) {
                d(t, e) && s.point(t, e)
            }

            function g() {
                j.point = v, x && x.push(M = []), E = !0, _ = !1, T = S = 0 / 0
            }

            function m() {
                y && (v(w, k), N && _ && A.rejoin(), y.push(A.buffer())), j.point = p, _ && s.lineEnd()
            }

            function v(t, e) {
                t = Math.max(-bu, Math.min(bu, t)), e = Math.max(-bu, Math.min(bu, e));
                var n = d(t, e);
                if (x && M.push([t, e]), E) w = t, k = e, N = n, E = !1, n && (s.lineStart(), s.point(t, e));
                else if (n && _) s.point(t, e);
                else {
                    var r = [T, S],
                        i = [t, e];
                    u(r, i) ? (_ || (s.lineStart(), s.point(r[0], r[1])), s.point(i[0], i[1]), n || s.lineEnd()) : n && (s.lineStart(), s.point(t, e))
                }
                T = t, S = e, _ = n
            }
            var y, x, M, w, k, N, T, S, _, E, C = s,
                A = Pe(),
                j = {
                    point: p,
                    lineStart: g,
                    lineEnd: m,
                    polygonStart: function() {
                        s = A, y = [], x = []
                    },
                    polygonEnd: function() {
                        s = C, (y = ua.merge(y))
                            .length ? (s.polygonStart(), Fe(y, o, l, h, s), s.polygonEnd()) : c([t, e]) && (s.polygonStart(), s.lineStart(), h(null, null, 1, s), s.lineEnd(), s.polygonEnd()), y = x = M = null
                    }
                };
            return j
        }
    }

    function Ve(t, e, n) {
        if (Math.abs(e) < Fa) return 0 >= t;
        var r = t / e;
        if (e > 0) {
            if (r > n[1]) return !1;
            r > n[0] && (n[0] = r)
        } else {
            if (r < n[0]) return !1;
            r < n[1] && (n[1] = r)
        }
        return !0
    }

    function Ge(t, e) {
        function n(n, r) {
            return n = t(n, r), e(n[0], n[1])
        }
        return t.invert && e.invert && (n.invert = function(n, r) {
            return n = e.invert(n, r), n && t.invert(n[0], n[1])
        }), n
    }

    function Ze(t) {
        function e(e) {
            function r(n, r) {
                n = t(n, r), e.point(n[0], n[1])
            }

            function o() {
                c = 0 / 0, g.point = a, e.lineStart()
            }

            function a(r, o) {
                var a = ke([r, o]),
                    u = t(r, o);
                n(c, f, l, h, d, p, c = u[0], f = u[1], l = r, h = a[0], d = a[1], p = a[2], i, e), e.point(c, f)
            }

            function u() {
                g.point = r, e.lineEnd()
            }

            function s() {
                var t, r, s, m, v, y, b;
                o(), g.point = function(e, n) {
                    a(t = e, r = n), s = c, m = f, v = h, y = d, b = p, g.point = a
                }, g.lineEnd = function() {
                    n(c, f, l, h, d, p, s, m, t, v, y, b, i, e), g.lineEnd = u, u()
                }
            }
            var l, c, f, h, d, p, g = {
                point: r,
                lineStart: o,
                lineEnd: u,
                polygonStart: function() {
                    e.polygonStart(), g.lineStart = s
                },
                polygonEnd: function() {
                    e.polygonEnd(), g.lineStart = o
                }
            };
            return g
        }

        function n(e, i, o, a, u, s, l, c, f, h, d, p, g, m) {
            var v = l - e,
                y = c - i,
                b = v * v + y * y;
            if (b > 4 * r && g--) {
                var x = a + h,
                    M = u + d,
                    w = s + p,
                    k = Math.sqrt(x * x + M * M + w * w),
                    N = Math.asin(w /= k),
                    T = Math.abs(Math.abs(w) - 1) < Fa ? (o + f) / 2 : Math.atan2(M, x),
                    S = t(T, N),
                    _ = S[0],
                    E = S[1],
                    C = _ - e,
                    A = E - i,
                    j = y * C - v * A;
                (j * j / b > r || Math.abs((v * C + y * A) / b - .5) > .3) && (n(e, i, o, a, u, s, _, E, T, x /= k, M /= k, w, g, m), m.point(_, E), n(_, E, T, x, M, w, l, c, f, h, d, p, g, m))
            }
        }
        var r = .5,
            i = 16;
        return e.precision = function(t) {
            return arguments.length ? (i = (r = t * t) > 0 && 16, e) : Math.sqrt(r)
        }, e
    }

    function Je(t) {
        return Qe(function() {
            return t
        })()
    }

    function Qe(t) {
        function e(t) {
            return t = a(t[0] * Ra, t[1] * Ra), [t[0] * c + u, s - t[1] * c]
        }

        function n(t) {
            return t = a.invert((t[0] - u) / c, (s - t[1]) / c), t && [t[0] * Oa, t[1] * Oa]
        }

        function r() {
            a = Ge(o = en(g, m, v), i);
            var t = i(d, p);
            return u = f - t[0] * c, s = h + t[1] * c, e
        }
        var i, o, a, u, s, l = Ze(function(t, e) {
                return t = i(t, e), [t[0] * c + u, s - t[1] * c]
            }),
            c = 150,
            f = 480,
            h = 250,
            d = 0,
            p = 0,
            g = 0,
            m = 0,
            v = 0,
            y = yu,
            b = fe,
            x = null,
            M = null;
        return e.stream = function(t) {
                return Ke(o, y(l(b(t))))
            }, e.clipAngle = function(t) {
                return arguments.length ? (y = null == t ? (x = t, yu) : Ue((x = +t) * Ra), e) : x
            }, e.clipExtent = function(t) {
                return arguments.length ? (M = t, b = null == t ? fe : Ye(t[0][0], t[0][1], t[1][0], t[1][1]), e) : M
            }, e.scale = function(t) {
                return arguments.length ? (c = +t, r()) : c
            }, e.translate = function(t) {
                return arguments.length ? (f = +t[0], h = +t[1], r()) : [f, h]
            }, e.center = function(t) {
                return arguments.length ? (d = t[0] % 360 * Ra, p = t[1] % 360 * Ra, r()) : [d * Oa, p * Oa]
            }, e.rotate = function(t) {
                return arguments.length ? (g = t[0] % 360 * Ra, m = t[1] % 360 * Ra, v = t.length > 2 ? t[2] % 360 * Ra : 0, r()) : [g * Oa, m * Oa, v * Oa]
            }, ua.rebind(e, l, "precision"),
            function() {
                return i = t.apply(this, arguments), e.invert = i.invert && n, r()
            }
    }

    function Ke(t, e) {
        return {
            point: function(n, r) {
                r = t(n * Ra, r * Ra), n = r[0], e.point(n > Ha ? n - 2 * Ha : -Ha > n ? n + 2 * Ha : n, r[1])
            },
            sphere: function() {
                e.sphere()
            },
            lineStart: function() {
                e.lineStart()
            },
            lineEnd: function() {
                e.lineEnd()
            },
            polygonStart: function() {
                e.polygonStart()
            },
            polygonEnd: function() {
                e.polygonEnd()
            }
        }
    }

    function tn(t, e) {
        return [t, e]
    }

    function en(t, e, n) {
        return t ? e || n ? Ge(rn(t), on(e, n)) : rn(t) : e || n ? on(e, n) : tn
    }

    function nn(t) {
        return function(e, n) {
            return e += t, [e > Ha ? e - 2 * Ha : -Ha > e ? e + 2 * Ha : e, n]
        }
    }

    function rn(t) {
        var e = nn(t);
        return e.invert = nn(-t), e
    }

    function on(t, e) {
        function n(t, e) {
            var n = Math.cos(e),
                u = Math.cos(t) * n,
                s = Math.sin(t) * n,
                l = Math.sin(e),
                c = l * r + u * i;
            return [Math.atan2(s * o - c * a, u * r - l * i), Math.asin(Math.max(-1, Math.min(1, c * o + s * a)))]
        }
        var r = Math.cos(t),
            i = Math.sin(t),
            o = Math.cos(e),
            a = Math.sin(e);
        return n.invert = function(t, e) {
            var n = Math.cos(e),
                u = Math.cos(t) * n,
                s = Math.sin(t) * n,
                l = Math.sin(e),
                c = l * o - s * a;
            return [Math.atan2(s * o + l * a, u * r + c * i), Math.asin(Math.max(-1, Math.min(1, c * r - u * i)))]
        }, n
    }

    function an(t, e) {
        var n = Math.cos(t),
            r = Math.sin(t);
        return function(i, o, a, u) {
            null != i ? (i = un(n, i), o = un(n, o), (a > 0 ? o > i : i > o) && (i += 2 * a * Ha)) : (i = t + 2 * a * Ha, o = t);
            for (var s, l = a * e, c = i; a > 0 ? c > o : o > c; c -= l) u.point((s = Ce([n, -r * Math.cos(c), -r * Math.sin(c)]))[0], s[1])
        }
    }

    function un(t, e) {
        var n = ke(e);
        n[0] -= t, Ee(n);
        var r = I(-n[1]);
        return ((-n[2] < 0 ? -r : r) + 2 * Math.PI - Fa) % (2 * Math.PI)
    }

    function sn(t, e, n) {
        var r = ua.range(t, e - Fa, n)
            .concat(e);
        return function(t) {
            return r.map(function(e) {
                return [t, e]
            })
        }
    }

    function ln(t, e, n) {
        var r = ua.range(t, e - Fa, n)
            .concat(e);
        return function(t) {
            return r.map(function(e) {
                return [e, t]
            })
        }
    }

    function cn(t) {
        return t.source
    }

    function fn(t) {
        return t.target
    }

    function hn(t, e, n, r) {
        var i = Math.cos(e),
            o = Math.sin(e),
            a = Math.cos(r),
            u = Math.sin(r),
            s = i * Math.cos(t),
            l = i * Math.sin(t),
            c = a * Math.cos(n),
            f = a * Math.sin(n),
            h = 2 * Math.asin(Math.sqrt(X(r - e) + i * a * X(n - t))),
            d = 1 / Math.sin(h),
            p = h ? function(t) {
                var e = Math.sin(t *= h) * d,
                    n = Math.sin(h - t) * d,
                    r = n * s + e * c,
                    i = n * l + e * f,
                    a = n * o + e * u;
                return [Math.atan2(i, r) * Oa, Math.atan2(a, Math.sqrt(r * r + i * i)) * Oa]
            } : function() {
                return [t * Oa, e * Oa]
            };
        return p.distance = h, p
    }

    function dn() {
        function t(t, i) {
            var o = Math.sin(i *= Ra),
                a = Math.cos(i),
                u = Math.abs((t *= Ra) - e),
                s = Math.cos(u);
            xu += Math.atan2(Math.sqrt((u = a * Math.sin(u)) * u + (u = r * o - n * a * s) * u), n * o + r * a * s), e = t, n = o, r = a
        }
        var e, n, r;
        Mu.point = function(i, o) {
            e = i * Ra, n = Math.sin(o *= Ra), r = Math.cos(o), Mu.point = t
        }, Mu.lineEnd = function() {
            Mu.point = Mu.lineEnd = A
        }
    }

    function pn(t) {
        var e = 0,
            n = Ha / 3,
            r = Qe(t),
            i = r(e, n);
        return i.parallels = function(t) {
            return arguments.length ? r(e = t[0] * Ha / 180, n = t[1] * Ha / 180) : [180 * (e / Ha), 180 * (n / Ha)]
        }, i
    }

    function gn(t, e) {
        function n(t, e) {
            var n = Math.sqrt(o - 2 * i * Math.sin(e)) / i;
            return [n * Math.sin(t *= i), a - n * Math.cos(t)]
        }
        var r = Math.sin(t),
            i = (r + Math.sin(e)) / 2,
            o = 1 + r * (2 * i - r),
            a = Math.sqrt(o) / i;
        return n.invert = function(t, e) {
            var n = a - e;
            return [Math.atan2(t, n) / i, B((o - (t * t + n * n) * i * i) / (2 * i))]
        }, n
    }

    function mn() {
        function t(t, e) {
            ku += i * t - r * e, r = t, i = e
        }
        var e, n, r, i;
        Eu.point = function(o, a) {
            Eu.point = t, e = r = o, n = i = a
        }, Eu.lineEnd = function() {
            t(e, n)
        }
    }

    function vn(t, e) {
        Nu > t && (Nu = t), t > Su && (Su = t), Tu > e && (Tu = e), e > _u && (_u = e)
    }

    function yn() {
        function t(t, e) {
            a.push("M", t, ",", e, o)
        }

        function e(t, e) {
            a.push("M", t, ",", e), u.point = n
        }

        function n(t, e) {
            a.push("L", t, ",", e)
        }

        function r() {
            u.point = t
        }

        function i() {
            a.push("Z")
        }
        var o = bn(4.5),
            a = [],
            u = {
                point: t,
                lineStart: function() {
                    u.point = e
                },
                lineEnd: r,
                polygonStart: function() {
                    u.lineEnd = i
                },
                polygonEnd: function() {
                    u.lineEnd = r, u.point = t
                },
                pointRadius: function(t) {
                    return o = bn(t), u
                },
                result: function() {
                    if (a.length) {
                        var t = a.join("");
                        return a = [], t
                    }
                }
            };
        return u
    }

    function bn(t) {
        return "m0," + t + "a" + t + "," + t + " 0 1,1 0," + -2 * t + "a" + t + "," + t + " 0 1,1 0," + 2 * t + "z"
    }

    function xn(t, e) {
        hu || (pu += t, gu += e, ++mu)
    }

    function Mn() {
        function t(t, r) {
            var i = t - e,
                o = r - n,
                a = Math.sqrt(i * i + o * o);
            pu += a * (e + t) / 2, gu += a * (n + r) / 2, mu += a, e = t, n = r
        }
        var e, n;
        if (1 !== hu) {
            if (!(1 > hu)) return;
            hu = 1, pu = gu = mu = 0
        }
        Au.point = function(r, i) {
            Au.point = t, e = r, n = i
        }
    }

    function wn() {
        Au.point = xn
    }

    function kn() {
        function t(t, e) {
            var n = i * t - r * e;
            pu += n * (r + t), gu += n * (i + e), mu += 3 * n, r = t, i = e
        }
        var e, n, r, i;
        2 > hu && (hu = 2, pu = gu = mu = 0), Au.point = function(o, a) {
            Au.point = t, e = r = o, n = i = a
        }, Au.lineEnd = function() {
            t(e, n)
        }
    }

    function Nn(t) {
        function e(e, n) {
            t.moveTo(e, n), t.arc(e, n, a, 0, 2 * Ha)
        }

        function n(e, n) {
            t.moveTo(e, n), u.point = r
        }

        function r(e, n) {
            t.lineTo(e, n)
        }

        function i() {
            u.point = e
        }

        function o() {
            t.closePath()
        }
        var a = 4.5,
            u = {
                point: e,
                lineStart: function() {
                    u.point = n
                },
                lineEnd: i,
                polygonStart: function() {
                    u.lineEnd = o
                },
                polygonEnd: function() {
                    u.lineEnd = i, u.point = e
                },
                pointRadius: function(t) {
                    return a = t, u
                },
                result: A
            };
        return u
    }

    function Tn(t) {
        var e = Ze(function(e, n) {
            return t([e * Oa, n * Oa])
        });
        return function(t) {
            return t = e(t), {
                point: function(e, n) {
                    t.point(e * Ra, n * Ra)
                },
                sphere: function() {
                    t.sphere()
                },
                lineStart: function() {
                    t.lineStart()
                },
                lineEnd: function() {
                    t.lineEnd()
                },
                polygonStart: function() {
                    t.polygonStart()
                },
                polygonEnd: function() {
                    t.polygonEnd()
                }
            }
        }
    }

    function Sn(t, e) {
        function n(e, n) {
            var r = Math.cos(e),
                i = Math.cos(n),
                o = t(r * i);
            return [o * i * Math.sin(e), o * Math.sin(n)]
        }
        return n.invert = function(t, n) {
            var r = Math.sqrt(t * t + n * n),
                i = e(r),
                o = Math.sin(i),
                a = Math.cos(i);
            return [Math.atan2(t * o, r * a), Math.asin(r && n * o / r)]
        }, n
    }

    function _n(t, e) {
        function n(t, e) {
            var n = Math.abs(Math.abs(e) - Ha / 2) < Fa ? 0 : a / Math.pow(i(e), o);
            return [n * Math.sin(o * t), a - n * Math.cos(o * t)]
        }
        var r = Math.cos(t),
            i = function(t) {
                return Math.tan(Ha / 4 + t / 2)
            },
            o = t === e ? Math.sin(t) : Math.log(r / Math.cos(e)) / Math.log(i(e) / i(t)),
            a = r * Math.pow(i(t), o) / o;
        return o ? (n.invert = function(t, e) {
            var n = a - e,
                r = P(o) * Math.sqrt(t * t + n * n);
            return [Math.atan2(t, n) / o, 2 * Math.atan(Math.pow(a / r, 1 / o)) - Ha / 2]
        }, n) : Cn
    }

    function En(t, e) {
        function n(t, e) {
            var n = o - e;
            return [n * Math.sin(i * t), o - n * Math.cos(i * t)]
        }
        var r = Math.cos(t),
            i = t === e ? Math.sin(t) : (r - Math.cos(e)) / (e - t),
            o = r / i + t;
        return Math.abs(i) < Fa ? tn : (n.invert = function(t, e) {
            var n = o - e;
            return [Math.atan2(t, n) / i, o - P(i) * Math.sqrt(t * t + n * n)]
        }, n)
    }

    function Cn(t, e) {
        return [t, Math.log(Math.tan(Ha / 4 + e / 2))]
    }

    function An(t) {
        var e, n = Je(t),
            r = n.scale,
            i = n.translate,
            o = n.clipExtent;
        return n.scale = function() {
            var t = r.apply(n, arguments);
            return t === n ? e ? n.clipExtent(null) : n : t
        }, n.translate = function() {
            var t = i.apply(n, arguments);
            return t === n ? e ? n.clipExtent(null) : n : t
        }, n.clipExtent = function(t) {
            var a = o.apply(n, arguments);
            if (a === n) {
                if (e = null == t) {
                    var u = Ha * r(),
                        s = i();
                    o([
                        [s[0] - u, s[1] - u],
                        [s[0] + u, s[1] + u]
                    ])
                }
            } else e && (a = null);
            return a
        }, n.clipExtent(null)
    }

    function jn(t, e) {
        var n = Math.cos(e) * Math.sin(t);
        return [Math.log((1 + n) / (1 - n)) / 2, Math.atan2(Math.tan(e), Math.cos(t))]
    }

    function Dn(t) {
        function e(e) {
            function a() {
                l.push("M", o(t(c), u))
            }
            for (var s, l = [], c = [], f = -1, h = e.length, d = ce(n), p = ce(r); ++f < h;) i.call(this, s = e[f], f) ? c.push([+d.call(this, s, f), +p.call(this, s, f)]) : c.length && (a(), c = []);
            return c.length && a(), l.length ? l.join("") : null
        }
        var n = qn,
            r = Ln,
            i = He,
            o = Hn,
            a = o.key,
            u = .7;
        return e.x = function(t) {
            return arguments.length ? (n = t, e) : n
        }, e.y = function(t) {
            return arguments.length ? (r = t, e) : r
        }, e.defined = function(t) {
            return arguments.length ? (i = t, e) : i
        }, e.interpolate = function(t) {
            return arguments.length ? (a = "function" == typeof t ? o = t : (o = Fu.get(t) || Hn)
                .key, e) : a
        }, e.tension = function(t) {
            return arguments.length ? (u = t, e) : u
        }, e
    }

    function qn(t) {
        return t[0]
    }

    function Ln(t) {
        return t[1]
    }

    function Hn(t) {
        return t.join("L")
    }

    function Fn(t) {
        return Hn(t) + "Z"
    }

    function Rn(t) {
        for (var e = 0, n = t.length, r = t[0], i = [r[0], ",", r[1]]; ++e < n;) i.push("V", (r = t[e])[1], "H", r[0]);
        return i.join("")
    }

    function On(t) {
        for (var e = 0, n = t.length, r = t[0], i = [r[0], ",", r[1]]; ++e < n;) i.push("H", (r = t[e])[0], "V", r[1]);
        return i.join("")
    }

    function zn(t, e) {
        return t.length < 4 ? Hn(t) : t[1] + Bn(t.slice(1, t.length - 1), Wn(t, e))
    }

    function Pn(t, e) {
        return t.length < 3 ? Hn(t) : t[0] + Bn((t.push(t[0]), t), Wn([t[t.length - 2]].concat(t, [t[1]]), e))
    }

    function In(t, e) {
        return t.length < 3 ? Hn(t) : t[0] + Bn(t, Wn(t, e))
    }

    function Bn(t, e) {
        if (e.length < 1 || t.length != e.length && t.length != e.length + 2) return Hn(t);
        var n = t.length != e.length,
            r = "",
            i = t[0],
            o = t[1],
            a = e[0],
            u = a,
            s = 1;
        if (n && (r += "Q" + (o[0] - 2 * a[0] / 3) + "," + (o[1] - 2 * a[1] / 3) + "," + o[0] + "," + o[1], i = t[1], s = 2), e.length > 1) {
            u = e[1], o = t[s], s++, r += "C" + (i[0] + a[0]) + "," + (i[1] + a[1]) + "," + (o[0] - u[0]) + "," + (o[1] - u[1]) + "," + o[0] + "," + o[1];
            for (var l = 2; l < e.length; l++, s++) o = t[s], u = e[l], r += "S" + (o[0] - u[0]) + "," + (o[1] - u[1]) + "," + o[0] + "," + o[1]
        }
        if (n) {
            var c = t[s];
            r += "Q" + (o[0] + 2 * u[0] / 3) + "," + (o[1] + 2 * u[1] / 3) + "," + c[0] + "," + c[1]
        }
        return r
    }

    function Wn(t, e) {
        for (var n, r = [], i = (1 - e) / 2, o = t[0], a = t[1], u = 1, s = t.length; ++u < s;) n = o, o = a, a = t[u], r.push([i * (a[0] - n[0]), i * (a[1] - n[1])]);
        return r
    }

    function $n(t) {
        if (t.length < 3) return Hn(t);
        var e = 1,
            n = t.length,
            r = t[0],
            i = r[0],
            o = r[1],
            a = [i, i, i, (r = t[1])[0]],
            u = [o, o, o, r[1]],
            s = [i, ",", o];
        for (Gn(s, a, u); ++e < n;) r = t[e], a.shift(), a.push(r[0]), u.shift(), u.push(r[1]), Gn(s, a, u);
        for (e = -1; ++e < 2;) a.shift(), a.push(r[0]), u.shift(), u.push(r[1]), Gn(s, a, u);
        return s.join("")
    }

    function Xn(t) {
        if (t.length < 4) return Hn(t);
        for (var e, n = [], r = -1, i = t.length, o = [0], a = [0]; ++r < 3;) e = t[r], o.push(e[0]), a.push(e[1]);
        for (n.push(Vn(zu, o) + "," + Vn(zu, a)), --r; ++r < i;) e = t[r], o.shift(), o.push(e[0]), a.shift(), a.push(e[1]), Gn(n, o, a);
        return n.join("")
    }

    function Un(t) {
        for (var e, n, r = -1, i = t.length, o = i + 4, a = [], u = []; ++r < 4;) n = t[r % i], a.push(n[0]), u.push(n[1]);
        for (e = [Vn(zu, a), ",", Vn(zu, u)], --r; ++r < o;) n = t[r % i], a.shift(), a.push(n[0]), u.shift(), u.push(n[1]), Gn(e, a, u);
        return e.join("")
    }

    function Yn(t, e) {
        var n = t.length - 1;
        if (n)
            for (var r, i, o = t[0][0], a = t[0][1], u = t[n][0] - o, s = t[n][1] - a, l = -1; ++l <= n;) r = t[l], i = l / n, r[0] = e * r[0] + (1 - e) * (o + i * u), r[1] = e * r[1] + (1 - e) * (a + i * s);
        return $n(t)
    }

    function Vn(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
    }

    function Gn(t, e, n) {
        t.push("C", Vn(Ru, e), ",", Vn(Ru, n), ",", Vn(Ou, e), ",", Vn(Ou, n), ",", Vn(zu, e), ",", Vn(zu, n))
    }

    function Zn(t, e) {
        return (e[1] - t[1]) / (e[0] - t[0])
    }

    function Jn(t) {
        for (var e = 0, n = t.length - 1, r = [], i = t[0], o = t[1], a = r[0] = Zn(i, o); ++e < n;) r[e] = (a + (a = Zn(i = o, o = t[e + 1]))) / 2;
        return r[e] = a, r
    }

    function Qn(t) {
        for (var e, n, r, i, o = [], a = Jn(t), u = -1, s = t.length - 1; ++u < s;) e = Zn(t[u], t[u + 1]), Math.abs(e) < 1e-6 ? a[u] = a[u + 1] = 0 : (n = a[u] / e, r = a[u + 1] / e, i = n * n + r * r, i > 9 && (i = 3 * e / Math.sqrt(i), a[u] = i * n, a[u + 1] = i * r));
        for (u = -1; ++u <= s;) i = (t[Math.min(s, u + 1)][0] - t[Math.max(0, u - 1)][0]) / (6 * (1 + a[u] * a[u])), o.push([i || 0, a[u] * i || 0]);
        return o
    }

    function Kn(t) {
        return t.length < 3 ? Hn(t) : t[0] + Bn(t, Qn(t))
    }

    function tr(t, e, n, r) {
        var i, o, a, u, s, l, c;
        return i = r[t], o = i[0], a = i[1], i = r[e], u = i[0], s = i[1], i = r[n], l = i[0], c = i[1], (c - a) * (u - o) - (s - a) * (l - o) > 0
    }

    function er(t, e, n) {
        return (n[0] - e[0]) * (t[1] - e[1]) < (n[1] - e[1]) * (t[0] - e[0])
    }

    function nr(t, e, n, r) {
        var i = t[0],
            o = n[0],
            a = e[0] - i,
            u = r[0] - o,
            s = t[1],
            l = n[1],
            c = e[1] - s,
            f = r[1] - l,
            h = (u * (s - l) - f * (i - o)) / (f * a - u * c);
        return [i + h * a, s + h * c]
    }

    function rr(t, e) {
        var n = {
                list: t.map(function(t, e) {
                        return {
                            index: e,
                            x: t[0],
                            y: t[1]
                        }
                    })
                    .sort(function(t, e) {
                        return t.y < e.y ? -1 : t.y > e.y ? 1 : t.x < e.x ? -1 : t.x > e.x ? 1 : 0
                    }),
                bottomSite: null
            },
            r = {
                list: [],
                leftEnd: null,
                rightEnd: null,
                init: function() {
                    r.leftEnd = r.createHalfEdge(null, "l"), r.rightEnd = r.createHalfEdge(null, "l"), r.leftEnd.r = r.rightEnd, r.rightEnd.l = r.leftEnd, r.list.unshift(r.leftEnd, r.rightEnd)
                },
                createHalfEdge: function(t, e) {
                    return {
                        edge: t,
                        side: e,
                        vertex: null,
                        l: null,
                        r: null
                    }
                },
                insert: function(t, e) {
                    e.l = t, e.r = t.r, t.r.l = e, t.r = e
                },
                leftBound: function(t) {
                    var e = r.leftEnd;
                    do e = e.r; while (e != r.rightEnd && i.rightOf(e, t));
                    return e = e.l
                },
                del: function(t) {
                    t.l.r = t.r, t.r.l = t.l, t.edge = null
                },
                right: function(t) {
                    return t.r
                },
                left: function(t) {
                    return t.l
                },
                leftRegion: function(t) {
                    return null == t.edge ? n.bottomSite : t.edge.region[t.side]
                },
                rightRegion: function(t) {
                    return null == t.edge ? n.bottomSite : t.edge.region[Pu[t.side]]
                }
            },
            i = {
                bisect: function(t, e) {
                    var n = {
                            region: {
                                l: t,
                                r: e
                            },
                            ep: {
                                l: null,
                                r: null
                            }
                        },
                        r = e.x - t.x,
                        i = e.y - t.y,
                        o = r > 0 ? r : -r,
                        a = i > 0 ? i : -i;
                    return n.c = t.x * r + t.y * i + .5 * (r * r + i * i), o > a ? (n.a = 1, n.b = i / r, n.c /= r) : (n.b = 1, n.a = r / i, n.c /= i), n
                },
                intersect: function(t, e) {
                    var n = t.edge,
                        r = e.edge;
                    if (!n || !r || n.region.r == r.region.r) return null;
                    var i = n.a * r.b - n.b * r.a;
                    if (Math.abs(i) < 1e-10) return null;
                    var o, a, u = (n.c * r.b - r.c * n.b) / i,
                        s = (r.c * n.a - n.c * r.a) / i,
                        l = n.region.r,
                        c = r.region.r;
                    l.y < c.y || l.y == c.y && l.x < c.x ? (o = t, a = n) : (o = e, a = r);
                    var f = u >= a.region.r.x;
                    return f && "l" === o.side || !f && "r" === o.side ? null : {
                        x: u,
                        y: s
                    }
                },
                rightOf: function(t, e) {
                    var n = t.edge,
                        r = n.region.r,
                        i = e.x > r.x;
                    if (i && "l" === t.side) return 1;
                    if (!i && "r" === t.side) return 0;
                    if (1 === n.a) {
                        var o = e.y - r.y,
                            a = e.x - r.x,
                            u = 0,
                            s = 0;
                        if (!i && n.b < 0 || i && n.b >= 0 ? s = u = o >= n.b * a : (s = e.x + e.y * n.b > n.c, n.b < 0 && (s = !s), s || (u = 1)), !u) {
                            var l = r.x - n.region.l.x;
                            s = n.b * (a * a - o * o) < l * o * (1 + 2 * a / l + n.b * n.b), n.b < 0 && (s = !s)
                        }
                    } else {
                        var c = n.c - n.a * e.x,
                            f = e.y - c,
                            h = e.x - r.x,
                            d = c - r.y;
                        s = f * f > h * h + d * d
                    }
                    return "l" === t.side ? s : !s
                },
                endPoint: function(t, n, r) {
                    t.ep[n] = r, t.ep[Pu[n]] && e(t)
                },
                distance: function(t, e) {
                    var n = t.x - e.x,
                        r = t.y - e.y;
                    return Math.sqrt(n * n + r * r)
                }
            },
            o = {
                list: [],
                insert: function(t, e, n) {
                    t.vertex = e, t.ystar = e.y + n;
                    for (var r = 0, i = o.list, a = i.length; a > r; r++) {
                        var u = i[r];
                        if (!(t.ystar > u.ystar || t.ystar == u.ystar && e.x > u.vertex.x)) break
                    }
                    i.splice(r, 0, t)
                },
                del: function(t) {
                    for (var e = 0, n = o.list, r = n.length; r > e && n[e] != t; ++e);
                    n.splice(e, 1)
                },
                empty: function() {
                    return 0 === o.list.length
                },
                nextEvent: function(t) {
                    for (var e = 0, n = o.list, r = n.length; r > e; ++e)
                        if (n[e] == t) return n[e + 1];
                    return null
                },
                min: function() {
                    var t = o.list[0];
                    return {
                        x: t.vertex.x,
                        y: t.ystar
                    }
                },
                extractMin: function() {
                    return o.list.shift()
                }
            };
        r.init(), n.bottomSite = n.list.shift();
        for (var a, u, s, l, c, f, h, d, p, g, m, v, y, b = n.list.shift();;)
            if (o.empty() || (a = o.min()), b && (o.empty() || b.y < a.y || b.y == a.y && b.x < a.x)) u = r.leftBound(b), s = r.right(u), h = r.rightRegion(u), v = i.bisect(h, b), f = r.createHalfEdge(v, "l"), r.insert(u, f), g = i.intersect(u, f), g && (o.del(u), o.insert(u, g, i.distance(g, b))), u = f, f = r.createHalfEdge(v, "r"), r.insert(u, f), g = i.intersect(f, s), g && o.insert(f, g, i.distance(g, b)), b = n.list.shift();
            else {
                if (o.empty()) break;
                u = o.extractMin(), l = r.left(u), s = r.right(u), c = r.right(s), h = r.leftRegion(u), d = r.rightRegion(s), m = u.vertex, i.endPoint(u.edge, u.side, m), i.endPoint(s.edge, s.side, m), r.del(u), o.del(s), r.del(s), y = "l", h.y > d.y && (p = h, h = d, d = p, y = "r"), v = i.bisect(h, d), f = r.createHalfEdge(v, y), r.insert(l, f), i.endPoint(v, Pu[y], m), g = i.intersect(l, f), g && (o.del(l), o.insert(l, g, i.distance(g, h))), g = i.intersect(f, c), g && o.insert(f, g, i.distance(g, h))
            }
        for (u = r.right(r.leftEnd); u != r.rightEnd; u = r.right(u)) e(u.edge)
    }

    function ir(t) {
        return t.x
    }

    function or(t) {
        return t.y
    }

    function ar() {
        return {
            leaf: !0,
            nodes: [],
            point: null,
            x: null,
            y: null
        }
    }

    function ur(t, e, n, r, i, o) {
        if (!t(e, n, r, i, o)) {
            var a = .5 * (n + i),
                u = .5 * (r + o),
                s = e.nodes;
            s[0] && ur(t, s[0], n, r, a, u), s[1] && ur(t, s[1], a, r, i, u), s[2] && ur(t, s[2], n, u, a, o), s[3] && ur(t, s[3], a, u, i, o)
        }
    }

    function sr(t, e) {
        t = ua.rgb(t), e = ua.rgb(e);
        var n = t.r,
            r = t.g,
            i = t.b,
            o = e.r - n,
            a = e.g - r,
            u = e.b - i;
        return function(t) {
            return "#" + ie(Math.round(n + o * t)) + ie(Math.round(r + a * t)) + ie(Math.round(i + u * t))
        }
    }

    function lr(t) {
        var e = [t.a, t.b],
            n = [t.c, t.d],
            r = fr(e),
            i = cr(e, n),
            o = fr(hr(n, e, -i)) || 0;
        e[0] * n[1] < n[0] * e[1] && (e[0] *= -1, e[1] *= -1, r *= -1, i *= -1), this.rotate = (r ? Math.atan2(e[1], e[0]) : Math.atan2(-n[0], n[1])) * Oa, this.translate = [t.e, t.f], this.scale = [r, o], this.skew = o ? Math.atan2(i, o) * Oa : 0
    }

    function cr(t, e) {
        return t[0] * e[0] + t[1] * e[1]
    }

    function fr(t) {
        var e = Math.sqrt(cr(t, t));
        return e && (t[0] /= e, t[1] /= e), e
    }

    function hr(t, e, n) {
        return t[0] += n * e[0], t[1] += n * e[1], t
    }

    function dr(t, e) {
        return e -= t = +t,
            function(n) {
                return t + e * n
            }
    }

    function pr(t, e) {
        var n, r = [],
            i = [],
            o = ua.transform(t),
            a = ua.transform(e),
            u = o.translate,
            s = a.translate,
            l = o.rotate,
            c = a.rotate,
            f = o.skew,
            h = a.skew,
            d = o.scale,
            p = a.scale;
        return u[0] != s[0] || u[1] != s[1] ? (r.push("translate(", null, ",", null, ")"), i.push({
                i: 1,
                x: dr(u[0], s[0])
            }, {
                i: 3,
                x: dr(u[1], s[1])
            })) : s[0] || s[1] ? r.push("translate(" + s + ")") : r.push(""), l != c ? (l - c > 180 ? c += 360 : c - l > 180 && (l += 360), i.push({
                i: r.push(r.pop() + "rotate(", null, ")") - 2,
                x: dr(l, c)
            })) : c && r.push(r.pop() + "rotate(" + c + ")"), f != h ? i.push({
                i: r.push(r.pop() + "skewX(", null, ")") - 2,
                x: dr(f, h)
            }) : h && r.push(r.pop() + "skewX(" + h + ")"), d[0] != p[0] || d[1] != p[1] ? (n = r.push(r.pop() + "scale(", null, ",", null, ")"), i.push({
                i: n - 4,
                x: dr(d[0], p[0])
            }, {
                i: n - 2,
                x: dr(d[1], p[1])
            })) : (1 != p[0] || 1 != p[1]) && r.push(r.pop() + "scale(" + p + ")"), n = i.length,
            function(t) {
                for (var e, o = -1; ++o < n;) r[(e = i[o])
                    .i] = e.x(t);
                return r.join("")
            }
    }

    function gr(t, e) {
        var n, r = {},
            i = {};
        for (n in t) n in e ? r[n] = yr(n)(t[n], e[n]) : i[n] = t[n];
        for (n in e) n in t || (i[n] = e[n]);
        return function(t) {
            for (n in r) i[n] = r[n](t);
            return i
        }
    }

    function mr(t, e) {
        var n, r, i, o, a, u = 0,
            s = 0,
            l = [],
            c = [];
        for (t += "", e += "", Bu.lastIndex = 0, r = 0; n = Bu.exec(e); ++r) n.index && l.push(e.substring(u, s = n.index)), c.push({
            i: l.length,
            x: n[0]
        }), l.push(null), u = Bu.lastIndex;
        for (u < e.length && l.push(e.substring(u)), r = 0, o = c.length;
            (n = Bu.exec(t)) && o > r; ++r)
            if (a = c[r], a.x == n[0]) {
                if (a.i)
                    if (null == l[a.i + 1])
                        for (l[a.i - 1] += a.x, l.splice(a.i, 1), i = r + 1; o > i; ++i) c[i].i--;
                    else
                        for (l[a.i - 1] += a.x + l[a.i + 1], l.splice(a.i, 2), i = r + 1; o > i; ++i) c[i].i -= 2;
                else if (null == l[a.i + 1]) l[a.i] = a.x;
                else
                    for (l[a.i] = a.x + l[a.i + 1], l.splice(a.i + 1, 1), i = r + 1; o > i; ++i) c[i].i--;
                c.splice(r, 1), o--, r--
            } else a.x = dr(parseFloat(n[0]), parseFloat(a.x));
        for (; o > r;) a = c.pop(), null == l[a.i + 1] ? l[a.i] = a.x : (l[a.i] = a.x + l[a.i + 1], l.splice(a.i + 1, 1)), o--;
        return 1 === l.length ? null == l[0] ? (a = c[0].x, function(t) {
            return a(t) + ""
        }) : function() {
            return e
        } : function(t) {
            for (r = 0; o > r; ++r) l[(a = c[r])
                .i] = a.x(t);
            return l.join("")
        }
    }

    function vr(t, e) {
        for (var n, r = ua.interpolators.length; --r >= 0 && !(n = ua.interpolators[r](t, e)););
        return n
    }

    function yr(t) {
        return "transform" == t ? pr : vr
    }

    function br(t, e) {
        var n, r = [],
            i = [],
            o = t.length,
            a = e.length,
            u = Math.min(t.length, e.length);
        for (n = 0; u > n; ++n) r.push(vr(t[n], e[n]));
        for (; o > n; ++n) i[n] = t[n];
        for (; a > n; ++n) i[n] = e[n];
        return function(t) {
            for (n = 0; u > n; ++n) i[n] = r[n](t);
            return i
        }
    }

    function xr(t) {
        return function(e) {
            return 0 >= e ? 0 : e >= 1 ? 1 : t(e)
        }
    }

    function Mr(t) {
        return function(e) {
            return 1 - t(1 - e)
        }
    }

    function wr(t) {
        return function(e) {
            return .5 * (.5 > e ? t(2 * e) : 2 - t(2 - 2 * e))
        }
    }

    function kr(t) {
        return t * t
    }

    function Nr(t) {
        return t * t * t
    }

    function Tr(t) {
        if (0 >= t) return 0;
        if (t >= 1) return 1;
        var e = t * t,
            n = e * t;
        return 4 * (.5 > t ? n : 3 * (t - e) + n - .75)
    }

    function Sr(t) {
        return function(e) {
            return Math.pow(e, t)
        }
    }

    function _r(t) {
        return 1 - Math.cos(t * Ha / 2)
    }

    function Er(t) {
        return Math.pow(2, 10 * (t - 1))
    }

    function Cr(t) {
        return 1 - Math.sqrt(1 - t * t)
    }

    function Ar(t, e) {
        var n;
        return arguments.length < 2 && (e = .45), arguments.length ? n = e / (2 * Ha) * Math.asin(1 / t) : (t = 1, n = e / 4),
            function(r) {
                return 1 + t * Math.pow(2, 10 * -r) * Math.sin(2 * (r - n) * Ha / e)
            }
    }

    function jr(t) {
        return t || (t = 1.70158),
            function(e) {
                return e * e * ((t + 1) * e - t)
            }
    }

    function Dr(t) {
        return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
    }

    function qr(t, e) {
        t = ua.hcl(t), e = ua.hcl(e);
        var n = t.h,
            r = t.c,
            i = t.l,
            o = e.h - n,
            a = e.c - r,
            u = e.l - i;
        return isNaN(a) && (a = 0, r = isNaN(r) ? e.c : r), isNaN(o) ? (o = 0, n = isNaN(n) ? e.h : n) : o > 180 ? o -= 360 : -180 > o && (o += 360),
            function(t) {
                return V(n + o * t, r + a * t, i + u * t) + ""
            }
    }

    function Lr(t, e) {
        t = ua.hsl(t), e = ua.hsl(e);
        var n = t.h,
            r = t.s,
            i = t.l,
            o = e.h - n,
            a = e.s - r,
            u = e.l - i;
        return isNaN(a) && (a = 0, r = isNaN(r) ? e.s : r), isNaN(o) ? (o = 0, n = isNaN(n) ? e.h : n) : o > 180 ? o -= 360 : -180 > o && (o += 360),
            function(t) {
                return z(n + o * t, r + a * t, i + u * t) + ""
            }
    }

    function Hr(t, e) {
        t = ua.lab(t), e = ua.lab(e);
        var n = t.l,
            r = t.a,
            i = t.b,
            o = e.l - n,
            a = e.a - r,
            u = e.b - i;
        return function(t) {
            return J(n + o * t, r + a * t, i + u * t) + ""
        }
    }

    function Fr(t, e) {
        return e -= t,
            function(n) {
                return Math.round(t + e * n)
            }
    }

    function Rr(t, e) {
        return e = e - (t = +t) ? 1 / (e - t) : 0,
            function(n) {
                return (n - t) * e
            }
    }

    function Or(t, e) {
        return e = e - (t = +t) ? 1 / (e - t) : 0,
            function(n) {
                return Math.max(0, Math.min(1, (n - t) * e))
            }
    }

    function zr(t) {
        for (var e = t.source, n = t.target, r = Ir(e, n), i = [e]; e !== r;) e = e.parent, i.push(e);
        for (var o = i.length; n !== r;) i.splice(o, 0, n), n = n.parent;
        return i
    }

    function Pr(t) {
        for (var e = [], n = t.parent; null != n;) e.push(t), t = n, n = n.parent;
        return e.push(t), e
    }

    function Ir(t, e) {
        if (t === e) return t;
        for (var n = Pr(t), r = Pr(e), i = n.pop(), o = r.pop(), a = null; i === o;) a = i, i = n.pop(), o = r.pop();
        return a
    }

    function Br(t) {
        t.fixed |= 2
    }

    function Wr(t) {
        t.fixed &= -7
    }

    function $r(t) {
        t.fixed |= 4, t.px = t.x, t.py = t.y
    }

    function Xr(t) {
        t.fixed &= -5
    }

    function Ur(t, e, n) {
        var r = 0,
            i = 0;
        if (t.charge = 0, !t.leaf)
            for (var o, a = t.nodes, u = a.length, s = -1; ++s < u;) o = a[s], null != o && (Ur(o, e, n), t.charge += o.charge, r += o.charge * o.cx, i += o.charge * o.cy);
        if (t.point) {
            t.leaf || (t.point.x += Math.random() - .5, t.point.y += Math.random() - .5);
            var l = e * n[t.point.index];
            t.charge += t.pointCharge = l, r += l * t.point.x, i += l * t.point.y
        }
        t.cx = r / t.charge, t.cy = i / t.charge
    }

    function Yr(t, e) {
        return ua.rebind(t, e, "sort", "children", "value"), t.nodes = t, t.links = Jr, t
    }

    function Vr(t) {
        return t.children
    }

    function Gr(t) {
        return t.value
    }

    function Zr(t, e) {
        return e.value - t.value
    }

    function Jr(t) {
        return ua.merge(t.map(function(t) {
            return (t.children || [])
                .map(function(e) {
                    return {
                        source: t,
                        target: e
                    }
                })
        }))
    }

    function Qr(t) {
        return t.x
    }

    function Kr(t) {
        return t.y
    }

    function ti(t, e, n) {
        t.y0 = e, t.y = n
    }

    function ei(t) {
        return ua.range(t.length)
    }

    function ni(t) {
        for (var e = -1, n = t[0].length, r = []; ++e < n;) r[e] = 0;
        return r
    }

    function ri(t) {
        for (var e, n = 1, r = 0, i = t[0][1], o = t.length; o > n; ++n)(e = t[n][1]) > i && (r = n, i = e);
        return r
    }

    function ii(t) {
        return t.reduce(oi, 0)
    }

    function oi(t, e) {
        return t + e[1]
    }

    function ai(t, e) {
        return ui(t, Math.ceil(Math.log(e.length) / Math.LN2 + 1))
    }

    function ui(t, e) {
        for (var n = -1, r = +t[0], i = (t[1] - r) / e, o = []; ++n <= e;) o[n] = i * n + r;
        return o
    }

    function si(t) {
        return [ua.min(t), ua.max(t)]
    }

    function li(t, e) {
        return t.parent == e.parent ? 1 : 2
    }

    function ci(t) {
        var e = t.children;
        return e && e.length ? e[0] : t._tree.thread
    }

    function fi(t) {
        var e, n = t.children;
        return n && (e = n.length) ? n[e - 1] : t._tree.thread
    }

    function hi(t, e) {
        var n = t.children;
        if (n && (i = n.length))
            for (var r, i, o = -1; ++o < i;) e(r = hi(n[o], e), t) > 0 && (t = r);
        return t
    }

    function di(t, e) {
        return t.x - e.x
    }

    function pi(t, e) {
        return e.x - t.x
    }

    function gi(t, e) {
        return t.depth - e.depth
    }

    function mi(t, e) {
        function n(t, r) {
            var i = t.children;
            if (i && (a = i.length))
                for (var o, a, u = null, s = -1; ++s < a;) o = i[s], n(o, u), u = o;
            e(t, r)
        }
        n(t, null)
    }

    function vi(t) {
        for (var e, n = 0, r = 0, i = t.children, o = i.length; --o >= 0;) e = i[o]._tree, e.prelim += n, e.mod += n, n += e.shift + (r += e.change)
    }

    function yi(t, e, n) {
        t = t._tree, e = e._tree;
        var r = n / (e.number - t.number);
        t.change += r, e.change -= r, e.shift += n, e.prelim += n, e.mod += n
    }

    function bi(t, e, n) {
        return t._tree.ancestor.parent == e.parent ? t._tree.ancestor : n
    }

    function xi(t, e) {
        return t.value - e.value
    }

    function Mi(t, e) {
        var n = t._pack_next;
        t._pack_next = e, e._pack_prev = t, e._pack_next = n, n._pack_prev = e
    }

    function wi(t, e) {
        t._pack_next = e, e._pack_prev = t
    }

    function ki(t, e) {
        var n = e.x - t.x,
            r = e.y - t.y,
            i = t.r + e.r;
        return i * i - n * n - r * r > .001
    }

    function Ni(t) {
        function e(t) {
            c = Math.min(t.x - t.r, c), f = Math.max(t.x + t.r, f), h = Math.min(t.y - t.r, h), d = Math.max(t.y + t.r, d)
        }
        if ((n = t.children) && (l = n.length)) {
            var n, r, i, o, a, u, s, l, c = 1 / 0,
                f = -1 / 0,
                h = 1 / 0,
                d = -1 / 0;
            if (n.forEach(Ti), r = n[0], r.x = -r.r, r.y = 0, e(r), l > 1 && (i = n[1], i.x = i.r, i.y = 0, e(i), l > 2))
                for (o = n[2], Ei(r, i, o), e(o), Mi(r, o), r._pack_prev = o, Mi(o, i), i = r._pack_next, a = 3; l > a; a++) {
                    Ei(r, i, o = n[a]);
                    var p = 0,
                        g = 1,
                        m = 1;
                    for (u = i._pack_next; u !== i; u = u._pack_next, g++)
                        if (ki(u, o)) {
                            p = 1;
                            break
                        }
                    if (1 == p)
                        for (s = r._pack_prev; s !== u._pack_prev && !ki(s, o); s = s._pack_prev, m++);
                    p ? (m > g || g == m && i.r < r.r ? wi(r, i = u) : wi(r = s, i), a--) : (Mi(r, o), i = o, e(o))
                }
            var v = (c + f) / 2,
                y = (h + d) / 2,
                b = 0;
            for (a = 0; l > a; a++) o = n[a], o.x -= v, o.y -= y, b = Math.max(b, o.r + Math.sqrt(o.x * o.x + o.y * o.y));
            t.r = b, n.forEach(Si)
        }
    }

    function Ti(t) {
        t._pack_next = t._pack_prev = t
    }

    function Si(t) {
        delete t._pack_next, delete t._pack_prev
    }

    function _i(t, e, n, r) {
        var i = t.children;
        if (t.x = e += r * t.x, t.y = n += r * t.y, t.r *= r, i)
            for (var o = -1, a = i.length; ++o < a;) _i(i[o], e, n, r)
    }

    function Ei(t, e, n) {
        var r = t.r + n.r,
            i = e.x - t.x,
            o = e.y - t.y;
        if (r && (i || o)) {
            var a = e.r + n.r,
                u = i * i + o * o;
            a *= a, r *= r;
            var s = .5 + (r - a) / (2 * u),
                l = Math.sqrt(Math.max(0, 2 * a * (r + u) - (r -= u) * r - a * a)) / (2 * u);
            n.x = t.x + s * i + l * o, n.y = t.y + s * o - l * i
        } else n.x = t.x + r, n.y = t.y
    }

    function Ci(t) {
        return 1 + ua.max(t, function(t) {
            return t.y
        })
    }

    function Ai(t) {
        return t.reduce(function(t, e) {
            return t + e.x
        }, 0) / t.length
    }

    function ji(t) {
        var e = t.children;
        return e && e.length ? ji(e[0]) : t
    }

    function Di(t) {
        var e, n = t.children;
        return n && (e = n.length) ? Di(n[e - 1]) : t
    }

    function qi(t) {
        return {
            x: t.x,
            y: t.y,
            dx: t.dx,
            dy: t.dy
        }
    }

    function Li(t, e) {
        var n = t.x + e[3],
            r = t.y + e[0],
            i = t.dx - e[1] - e[3],
            o = t.dy - e[0] - e[2];
        return 0 > i && (n += i / 2, i = 0), 0 > o && (r += o / 2, o = 0), {
            x: n,
            y: r,
            dx: i,
            dy: o
        }
    }

    function Hi(t) {
        var e = t[0],
            n = t[t.length - 1];
        return n > e ? [e, n] : [n, e]
    }

    function Fi(t) {
        return t.rangeExtent ? t.rangeExtent() : Hi(t.range())
    }

    function Ri(t, e, n, r) {
        var i = n(t[0], t[1]),
            o = r(e[0], e[1]);
        return function(t) {
            return o(i(t))
        }
    }

    function Oi(t, e) {
        var n, r = 0,
            i = t.length - 1,
            o = t[r],
            a = t[i];
        return o > a && (n = r, r = i, i = n, n = o, o = a, a = n), (e = e(a - o)) && (t[r] = e.floor(o), t[i] = e.ceil(a)), t
    }

    function zi(t, e, n, r) {
        var i = [],
            o = [],
            a = 0,
            u = Math.min(t.length, e.length) - 1;
        for (t[u] < t[0] && (t = t.slice()
                .reverse(), e = e.slice()
                .reverse()); ++a <= u;) i.push(n(t[a - 1], t[a])), o.push(r(e[a - 1], e[a]));
        return function(e) {
            var n = ua.bisect(t, e, 1, u) - 1;
            return o[n](i[n](e))
        }
    }

    function Pi(t, e, n, r) {
        function i() {
            var i = Math.min(t.length, e.length) > 2 ? zi : Ri,
                s = r ? Or : Rr;
            return a = i(t, e, s, n), u = i(e, t, s, vr), o
        }

        function o(t) {
            return a(t)
        }
        var a, u;
        return o.invert = function(t) {
            return u(t)
        }, o.domain = function(e) {
            return arguments.length ? (t = e.map(Number), i()) : t
        }, o.range = function(t) {
            return arguments.length ? (e = t, i()) : e
        }, o.rangeRound = function(t) {
            return o.range(t)
                .interpolate(Fr)
        }, o.clamp = function(t) {
            return arguments.length ? (r = t, i()) : r
        }, o.interpolate = function(t) {
            return arguments.length ? (n = t, i()) : n
        }, o.ticks = function(e) {
            return $i(t, e)
        }, o.tickFormat = function(e, n) {
            return Xi(t, e, n)
        }, o.nice = function() {
            return Oi(t, Bi), i()
        }, o.copy = function() {
            return Pi(t, e, n, r)
        }, i()
    }

    function Ii(t, e) {
        return ua.rebind(t, e, "range", "rangeRound", "interpolate", "clamp")
    }

    function Bi(t) {
        return t = Math.pow(10, Math.round(Math.log(t) / Math.LN10) - 1), t && {
            floor: function(e) {
                return Math.floor(e / t) * t
            },
            ceil: function(e) {
                return Math.ceil(e / t) * t
            }
        }
    }

    function Wi(t, e) {
        var n = Hi(t),
            r = n[1] - n[0],
            i = Math.pow(10, Math.floor(Math.log(r / e) / Math.LN10)),
            o = e / r * i;
        return .15 >= o ? i *= 10 : .35 >= o ? i *= 5 : .75 >= o && (i *= 2), n[0] = Math.ceil(n[0] / i) * i, n[1] = Math.floor(n[1] / i) * i + .5 * i, n[2] = i, n
    }

    function $i(t, e) {
        return ua.range.apply(ua, Wi(t, e))
    }

    function Xi(t, e, n) {
        var r = -Math.floor(Math.log(Wi(t, e)[2]) / Math.LN10 + .01);
        return ua.format(n ? n.replace(ru, function(t, e, n, i, o, a, u, s, l, c) {
            return [e, n, i, o, a, u, s, l || "." + (r - 2 * ("%" === c)), c].join("")
        }) : ",." + r + "f")
    }

    function Ui(t, e, n, r, i) {
        function o(e) {
            return t(n(e))
        }

        function a() {
            return n === Yi ? {
                floor: u,
                ceil: s
            } : {
                floor: function(t) {
                    return -s(-t)
                },
                ceil: function(t) {
                    return -u(-t)
                }
            }
        }

        function u(t) {
            return Math.pow(e, Math.floor(Math.log(t) / Math.log(e)))
        }

        function s(t) {
            return Math.pow(e, Math.ceil(Math.log(t) / Math.log(e)))
        }
        return o.invert = function(e) {
            return r(t.invert(e))
        }, o.domain = function(e) {
            return arguments.length ? (e[0] < 0 ? (n = Gi, r = Zi) : (n = Yi, r = Vi), t.domain((i = e.map(Number))
                .map(n)), o) : i
        }, o.base = function(t) {
            return arguments.length ? (e = +t, o) : e
        }, o.nice = function() {
            return t.domain(Oi(i, a)
                .map(n)), o
        }, o.ticks = function() {
            var i = Hi(t.domain()),
                o = [];
            if (i.every(isFinite)) {
                var a = Math.log(e),
                    u = Math.floor(i[0] / a),
                    s = Math.ceil(i[1] / a),
                    l = r(i[0]),
                    c = r(i[1]),
                    f = e % 1 ? 2 : e;
                if (n === Gi)
                    for (o.push(-Math.pow(e, -u)); u++ < s;)
                        for (var h = f - 1; h > 0; h--) o.push(-Math.pow(e, -u) * h);
                else {
                    for (; s > u; u++)
                        for (var h = 1; f > h; h++) o.push(Math.pow(e, u) * h);
                    o.push(Math.pow(e, u))
                }
                for (u = 0; o[u] < l; u++);
                for (s = o.length; o[s - 1] > c; s--);
                o = o.slice(u, s)
            }
            return o
        }, o.tickFormat = function(t, i) {
            if (arguments.length < 2 && (i = Ju), !arguments.length) return i;
            var a, u = Math.log(e),
                s = Math.max(.1, t / o.ticks()
                    .length),
                l = n === Gi ? (a = -1e-12, Math.floor) : (a = 1e-12, Math.ceil);
            return function(t) {
                return t / r(u * l(n(t) / u + a)) <= s ? i(t) : ""
            }
        }, o.copy = function() {
            return Ui(t.copy(), e, n, r, i)
        }, Ii(o, t)
    }

    function Yi(t) {
        return Math.log(0 > t ? 0 : t)
    }

    function Vi(t) {
        return Math.exp(t)
    }

    function Gi(t) {
        return -Math.log(t > 0 ? 0 : -t)
    }

    function Zi(t) {
        return -Math.exp(-t)
    }

    function Ji(t, e, n) {
        function r(e) {
            return t(i(e))
        }
        var i = Qi(e),
            o = Qi(1 / e);
        return r.invert = function(e) {
            return o(t.invert(e))
        }, r.domain = function(e) {
            return arguments.length ? (t.domain((n = e.map(Number))
                .map(i)), r) : n
        }, r.ticks = function(t) {
            return $i(n, t)
        }, r.tickFormat = function(t, e) {
            return Xi(n, t, e)
        }, r.nice = function() {
            return r.domain(Oi(n, Bi))
        }, r.exponent = function(a) {
            return arguments.length ? (i = Qi(e = a), o = Qi(1 / e), t.domain(n.map(i)), r) : e
        }, r.copy = function() {
            return Ji(t.copy(), e, n)
        }, Ii(r, t)
    }

    function Qi(t) {
        return function(e) {
            return 0 > e ? -Math.pow(-e, t) : Math.pow(e, t)
        }
    }

    function Ki(t, e) {
        function n(e) {
            return a[((o.get(e) || o.set(e, t.push(e))) - 1) % a.length]
        }

        function r(e, n) {
            return ua.range(t.length)
                .map(function(t) {
                    return e + n * t
                })
        }
        var o, a, u;
        return n.domain = function(r) {
            if (!arguments.length) return t;
            t = [], o = new i;
            for (var a, u = -1, s = r.length; ++u < s;) o.has(a = r[u]) || o.set(a, t.push(a));
            return n[e.t].apply(n, e.a)
        }, n.range = function(t) {
            return arguments.length ? (a = t, u = 0, e = {
                t: "range",
                a: arguments
            }, n) : a
        }, n.rangePoints = function(i, o) {
            arguments.length < 2 && (o = 0);
            var s = i[0],
                l = i[1],
                c = (l - s) / (Math.max(1, t.length - 1) + o);
            return a = r(t.length < 2 ? (s + l) / 2 : s + c * o / 2, c), u = 0, e = {
                t: "rangePoints",
                a: arguments
            }, n
        }, n.rangeBands = function(i, o, s) {
            arguments.length < 2 && (o = 0), arguments.length < 3 && (s = o);
            var l = i[1] < i[0],
                c = i[l - 0],
                f = i[1 - l],
                h = (f - c) / (t.length - o + 2 * s);
            return a = r(c + h * s, h), l && a.reverse(), u = h * (1 - o), e = {
                t: "rangeBands",
                a: arguments
            }, n
        }, n.rangeRoundBands = function(i, o, s) {
            arguments.length < 2 && (o = 0), arguments.length < 3 && (s = o);
            var l = i[1] < i[0],
                c = i[l - 0],
                f = i[1 - l],
                h = Math.floor((f - c) / (t.length - o + 2 * s)),
                d = f - c - (t.length - o) * h;
            return a = r(c + Math.round(d / 2), h), l && a.reverse(), u = Math.round(h * (1 - o)), e = {
                t: "rangeRoundBands",
                a: arguments
            }, n
        }, n.rangeBand = function() {
            return u
        }, n.rangeExtent = function() {
            return Hi(e.a[0])
        }, n.copy = function() {
            return Ki(t, e)
        }, n.domain(t)
    }

    function to(t, e) {
        function n() {
            var n = 0,
                o = e.length;
            for (i = []; ++n < o;) i[n - 1] = ua.quantile(t, n / o);
            return r
        }

        function r(t) {
            return isNaN(t = +t) ? 0 / 0 : e[ua.bisect(i, t)]
        }
        var i;
        return r.domain = function(e) {
            return arguments.length ? (t = e.filter(function(t) {
                    return !isNaN(t)
                })
                .sort(ua.ascending), n()) : t
        }, r.range = function(t) {
            return arguments.length ? (e = t, n()) : e
        }, r.quantiles = function() {
            return i
        }, r.copy = function() {
            return to(t, e)
        }, n()
    }

    function eo(t, e, n) {
        function r(e) {
            return n[Math.max(0, Math.min(a, Math.floor(o * (e - t))))]
        }

        function i() {
            return o = n.length / (e - t), a = n.length - 1, r
        }
        var o, a;
        return r.domain = function(n) {
            return arguments.length ? (t = +n[0], e = +n[n.length - 1], i()) : [t, e]
        }, r.range = function(t) {
            return arguments.length ? (n = t, i()) : n
        }, r.copy = function() {
            return eo(t, e, n)
        }, i()
    }

    function no(t, e) {
        function n(n) {
            return e[ua.bisect(t, n)]
        }
        return n.domain = function(e) {
            return arguments.length ? (t = e, n) : t
        }, n.range = function(t) {
            return arguments.length ? (e = t, n) : e
        }, n.copy = function() {
            return no(t, e)
        }, n
    }

    function ro(t) {
        function e(t) {
            return +t
        }
        return e.invert = e, e.domain = e.range = function(n) {
            return arguments.length ? (t = n.map(e), e) : t
        }, e.ticks = function(e) {
            return $i(t, e)
        }, e.tickFormat = function(e, n) {
            return Xi(t, e, n)
        }, e.copy = function() {
            return ro(t)
        }, e
    }

    function io(t) {
        return t.innerRadius
    }

    function oo(t) {
        return t.outerRadius
    }

    function ao(t) {
        return t.startAngle
    }

    function uo(t) {
        return t.endAngle
    }

    function so(t) {
        for (var e, n, r, i = -1, o = t.length; ++i < o;) e = t[i], n = e[0], r = e[1] + ns, e[0] = n * Math.cos(r), e[1] = n * Math.sin(r);
        return t
    }

    function lo(t) {
        function e(e) {
            function s() {
                g.push("M", u(t(v), f), c, l(t(m.reverse()), f), "Z")
            }
            for (var h, d, p, g = [], m = [], v = [], y = -1, b = e.length, x = ce(n), M = ce(i), w = n === r ? function() {
                    return d
                } : ce(r), k = i === o ? function() {
                    return p
                } : ce(o); ++y < b;) a.call(this, h = e[y], y) ? (m.push([d = +x.call(this, h, y), p = +M.call(this, h, y)]), v.push([+w.call(this, h, y), +k.call(this, h, y)])) : m.length && (s(), m = [], v = []);
            return m.length && s(), g.length ? g.join("") : null
        }
        var n = qn,
            r = qn,
            i = 0,
            o = Ln,
            a = He,
            u = Hn,
            s = u.key,
            l = u,
            c = "L",
            f = .7;
        return e.x = function(t) {
            return arguments.length ? (n = r = t, e) : r
        }, e.x0 = function(t) {
            return arguments.length ? (n = t, e) : n
        }, e.x1 = function(t) {
            return arguments.length ? (r = t, e) : r
        }, e.y = function(t) {
            return arguments.length ? (i = o = t, e) : o
        }, e.y0 = function(t) {
            return arguments.length ? (i = t, e) : i
        }, e.y1 = function(t) {
            return arguments.length ? (o = t, e) : o
        }, e.defined = function(t) {
            return arguments.length ? (a = t, e) : a
        }, e.interpolate = function(t) {
            return arguments.length ? (s = "function" == typeof t ? u = t : (u = Fu.get(t) || Hn)
                .key, l = u.reverse || u, c = u.closed ? "M" : "L", e) : s
        }, e.tension = function(t) {
            return arguments.length ? (f = t, e) : f
        }, e
    }

    function co(t) {
        return t.radius
    }

    function fo(t) {
        return [t.x, t.y]
    }

    function ho(t) {
        return function() {
            var e = t.apply(this, arguments),
                n = e[0],
                r = e[1] + ns;
            return [n * Math.cos(r), n * Math.sin(r)]
        }
    }

    function po() {
        return 64
    }

    function go() {
        return "circle"
    }

    function mo(t) {
        var e = Math.sqrt(t / Ha);
        return "M0," + e + "A" + e + "," + e + " 0 1,1 0," + -e + "A" + e + "," + e + " 0 1,1 0," + e + "Z"
    }

    function vo(t, e) {
        return ba(t, ss), t.id = e, t
    }

    function yo(t, e, n, r) {
        var i = t.id;
        return L(t, "function" == typeof n ? function(t, o, a) {
            t.__transition__[i].tween.set(e, r(n.call(t, t.__data__, o, a)))
        } : (n = r(n), function(t) {
            t.__transition__[i].tween.set(e, n)
        }))
    }

    function bo(t) {
        return null == t && (t = ""),
            function() {
                this.textContent = t
            }
    }

    function xo(t, e, n, r) {
        var o = t.__transition__ || (t.__transition__ = {
                active: 0,
                count: 0
            }),
            a = o[n];
        if (!a) {
            var u = r.time;
            return a = o[n] = {
                tween: new i,
                event: ua.dispatch("start", "end"),
                time: u,
                ease: r.ease,
                delay: r.delay,
                duration: r.duration
            }, ++o.count, ua.timer(function(r) {
                function i(r) {
                    return o.active > n ? l() : (o.active = n, h.start.call(t, c, e), a.tween.forEach(function(n, r) {
                        (r = r.call(t, c, e)) && g.push(r)
                    }), s(r) || ua.timer(s, 0, u), 1)
                }

                function s(r) {
                    if (o.active !== n) return l();
                    for (var i = (r - d) / p, a = f(i), u = g.length; u > 0;) g[--u].call(t, a);
                    return i >= 1 ? (l(), h.end.call(t, c, e), 1) : void 0
                }

                function l() {
                    return --o.count ? delete o[n] : delete t.__transition__, 1
                }
                var c = t.__data__,
                    f = a.ease,
                    h = a.event,
                    d = a.delay,
                    p = a.duration,
                    g = [];
                return r >= d ? i(r) : ua.timer(i, d, u), 1
            }, 0, u), a
        }
    }

    function Mo(t, e) {
        t.attr("transform", function(t) {
            return "translate(" + e(t) + ",0)"
        })
    }

    function wo(t, e) {
        t.attr("transform", function(t) {
            return "translate(0," + e(t) + ")"
        })
    }

    function ko(t, e, n) {
        if (r = [], n && e.length > 1) {
            for (var r, i, o, a = Hi(t.domain()), u = -1, s = e.length, l = (e[1] - e[0]) / ++n; ++u < s;)
                for (i = n; --i > 0;)(o = +e[u] - i * l) >= a[0] && r.push(o);
            for (--u, i = 0; ++i < n && (o = +e[u] + i * l) < a[1];) r.push(o)
        }
        return r
    }

    function No() {
        this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
    }

    function To(t, e, n) {
        function r(e) {
            var n = t(e),
                r = o(n, 1);
            return r - e > e - n ? n : r
        }

        function i(n) {
            return e(n = t(new gs(n - 1)), 1), n
        }

        function o(t, n) {
            return e(t = new gs(+t), n), t
        }

        function a(t, r, o) {
            var a = i(t),
                u = [];
            if (o > 1)
                for (; r > a;) n(a) % o || u.push(new Date(+a)), e(a, 1);
            else
                for (; r > a;) u.push(new Date(+a)), e(a, 1);
            return u
        }

        function u(t, e, n) {
            try {
                gs = No;
                var r = new No;
                return r._ = t, a(r, e, n)
            } finally {
                gs = Date
            }
        }
        t.floor = t, t.round = r, t.ceil = i, t.offset = o, t.range = a;
        var s = t.utc = So(t);
        return s.floor = s, s.round = So(r), s.ceil = So(i), s.offset = So(o), s.range = u, t
    }

    function So(t) {
        return function(e, n) {
            try {
                gs = No;
                var r = new No;
                return r._ = e, t(r, n)
                    ._
            } finally {
                gs = Date
            }
        }
    }

    function _o(t, e, n, r) {
        for (var i, o, a = 0, u = e.length, s = n.length; u > a;) {
            if (r >= s) return -1;
            if (i = e.charCodeAt(a++), 37 === i) {
                if (o = qs[e.charAt(a++)], !o || (r = o(t, n, r)) < 0) return -1
            } else if (i != n.charCodeAt(r++)) return -1
        }
        return r
    }

    function Eo(t) {
        return RegExp("^(?:" + t.map(ua.requote)
            .join("|") + ")", "i")
    }

    function Co(t) {
        for (var e = new i, n = -1, r = t.length; ++n < r;) e.set(t[n].toLowerCase(), n);
        return e
    }

    function Ao(t, e, n) {
        t += "";
        var r = t.length;
        return n > r ? Array(n - r + 1)
            .join(e) + t : t
    }

    function jo(t, e, n) {
        Ss.lastIndex = 0;
        var r = Ss.exec(e.substring(n));
        return r ? n += r[0].length : -1
    }

    function Do(t, e, n) {
        Ts.lastIndex = 0;
        var r = Ts.exec(e.substring(n));
        return r ? n += r[0].length : -1
    }

    function qo(t, e, n) {
        Cs.lastIndex = 0;
        var r = Cs.exec(e.substring(n));
        return r ? (t.m = As.get(r[0].toLowerCase()), n += r[0].length) : -1
    }

    function Lo(t, e, n) {
        _s.lastIndex = 0;
        var r = _s.exec(e.substring(n));
        return r ? (t.m = Es.get(r[0].toLowerCase()), n += r[0].length) : -1
    }

    function Ho(t, e, n) {
        return _o(t, "" + Ds.c, e, n)
    }

    function Fo(t, e, n) {
        return _o(t, "" + Ds.x, e, n)
    }

    function Ro(t, e, n) {
        return _o(t, "" + Ds.X, e, n)
    }

    function Oo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 4));
        return r ? (t.y = +r[0], n += r[0].length) : -1
    }

    function zo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.y = Po(+r[0]), n += r[0].length) : -1
    }

    function Po(t) {
        return t + (t > 68 ? 1900 : 2e3)
    }

    function Io(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.m = r[0] - 1, n += r[0].length) : -1
    }

    function Bo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.d = +r[0], n += r[0].length) : -1
    }

    function Wo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.H = +r[0], n += r[0].length) : -1
    }

    function $o(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.M = +r[0], n += r[0].length) : -1
    }

    function Xo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 2));
        return r ? (t.S = +r[0], n += r[0].length) : -1
    }

    function Uo(t, e, n) {
        Ls.lastIndex = 0;
        var r = Ls.exec(e.substring(n, n + 3));
        return r ? (t.L = +r[0], n += r[0].length) : -1
    }

    function Yo(t, e, n) {
        var r = Hs.get(e.substring(n, n += 2)
            .toLowerCase());
        return null == r ? -1 : (t.p = r, n)
    }

    function Vo(t) {
        var e = t.getTimezoneOffset(),
            n = e > 0 ? "-" : "+",
            r = ~~(Math.abs(e) / 60),
            i = Math.abs(e) % 60;
        return n + Ao(r, "0", 2) + Ao(i, "0", 2)
    }

    function Go(t) {
        return t.toISOString()
    }

    function Zo(t, e, n) {
        function r(e) {
            return t(e)
        }
        return r.invert = function(e) {
            return Jo(t.invert(e))
        }, r.domain = function(e) {
            return arguments.length ? (t.domain(e), r) : t.domain()
                .map(Jo)
        }, r.nice = function(t) {
            return r.domain(Oi(r.domain(), function() {
                return t
            }))
        }, r.ticks = function(n, i) {
            var o = Hi(r.domain());
            if ("function" != typeof n) {
                var a = o[1] - o[0],
                    u = a / n,
                    s = ua.bisect(Rs, u);
                if (s == Rs.length) return e.year(o, n);
                if (!s) return t.ticks(n)
                    .map(Jo);
                Math.log(u / Rs[s - 1]) < Math.log(Rs[s] / u) && --s, n = e[s], i = n[1], n = n[0].range
            }
            return n(o[0], new Date(+o[1] + 1), i)
        }, r.tickFormat = function() {
            return n
        }, r.copy = function() {
            return Zo(t.copy(), e, n)
        }, Ii(r, t)
    }

    function Jo(t) {
        return new Date(t)
    }

    function Qo(t) {
        return function(e) {
            for (var n = t.length - 1, r = t[n]; !r[1](e);) r = t[--n];
            return r[0](e)
        }
    }

    function Ko(t) {
        var e = new Date(t, 0, 1);
        return e.setFullYear(t), e
    }

    function ta(t) {
        var e = t.getFullYear(),
            n = Ko(e),
            r = Ko(e + 1);
        return e + (t - n) / (r - n)
    }

    function ea(t) {
        var e = new Date(Date.UTC(t, 0, 1));
        return e.setUTCFullYear(t), e
    }

    function na(t) {
        var e = t.getUTCFullYear(),
            n = ea(e),
            r = ea(e + 1);
        return e + (t - n) / (r - n)
    }

    function ra(t) {
        return t.responseText
    }

    function ia(t) {
        return JSON.parse(t.responseText)
    }

    function oa(t) {
        var e = sa.createRange();
        return e.selectNode(sa.body), e.createContextualFragment(t.responseText)
    }

    function aa(t) {
        return t.responseXML
    }
    var ua = {
        version: "3.1.9"
    };
    Date.now || (Date.now = function() {
        return +new Date
    });
    var sa = document,
        la = window;
    try {
        sa.createElement("div")
            .style.setProperty("opacity", 0, "")
    } catch (ca) {
        var fa = la.CSSStyleDeclaration.prototype,
            ha = fa.setProperty;
        fa.setProperty = function(t, e, n) {
            ha.call(this, t, e + "", n)
        }
    }
    ua.ascending = function(t, e) {
        return e > t ? -1 : t > e ? 1 : t >= e ? 0 : 0 / 0
    }, ua.descending = function(t, e) {
        return t > e ? -1 : e > t ? 1 : e >= t ? 0 : 0 / 0
    }, ua.min = function(t, e) {
        var n, r, i = -1,
            o = t.length;
        if (1 === arguments.length) {
            for (; ++i < o && (null == (n = t[i]) || n != n);) n = void 0;
            for (; ++i < o;) null != (r = t[i]) && n > r && (n = r)
        } else {
            for (; ++i < o && (null == (n = e.call(t, t[i], i)) || n != n);) n = void 0;
            for (; ++i < o;) null != (r = e.call(t, t[i], i)) && n > r && (n = r)
        }
        return n
    }, ua.max = function(t, e) {
        var n, r, i = -1,
            o = t.length;
        if (1 === arguments.length) {
            for (; ++i < o && (null == (n = t[i]) || n != n);) n = void 0;
            for (; ++i < o;) null != (r = t[i]) && r > n && (n = r)
        } else {
            for (; ++i < o && (null == (n = e.call(t, t[i], i)) || n != n);) n = void 0;
            for (; ++i < o;) null != (r = e.call(t, t[i], i)) && r > n && (n = r)
        }
        return n
    }, ua.extent = function(t, e) {
        var n, r, i, o = -1,
            a = t.length;
        if (1 === arguments.length) {
            for (; ++o < a && (null == (n = i = t[o]) || n != n);) n = i = void 0;
            for (; ++o < a;) null != (r = t[o]) && (n > r && (n = r), r > i && (i = r))
        } else {
            for (; ++o < a && (null == (n = i = e.call(t, t[o], o)) || n != n);) n = void 0;
            for (; ++o < a;) null != (r = e.call(t, t[o], o)) && (n > r && (n = r), r > i && (i = r))
        }
        return [n, i]
    }, ua.sum = function(t, e) {
        var n, r = 0,
            i = t.length,
            o = -1;
        if (1 === arguments.length)
            for (; ++o < i;) isNaN(n = +t[o]) || (r += n);
        else
            for (; ++o < i;) isNaN(n = +e.call(t, t[o], o)) || (r += n);
        return r
    }, ua.mean = function(e, n) {
        var r, i = e.length,
            o = 0,
            a = -1,
            u = 0;
        if (1 === arguments.length)
            for (; ++a < i;) t(r = e[a]) && (o += (r - o) / ++u);
        else
            for (; ++a < i;) t(r = n.call(e, e[a], a)) && (o += (r - o) / ++u);
        return u ? o : void 0
    }, ua.quantile = function(t, e) {
        var n = (t.length - 1) * e + 1,
            r = Math.floor(n),
            i = +t[r - 1],
            o = n - r;
        return o ? i + o * (t[r] - i) : i
    }, ua.median = function(e, n) {
        return arguments.length > 1 && (e = e.map(n)), e = e.filter(t), e.length ? ua.quantile(e.sort(ua.ascending), .5) : void 0
    }, ua.bisector = function(t) {
        return {
            left: function(e, n, r, i) {
                for (arguments.length < 3 && (r = 0), arguments.length < 4 && (i = e.length); i > r;) {
                    var o = r + i >>> 1;
                    t.call(e, e[o], o) < n ? r = o + 1 : i = o
                }
                return r
            },
            right: function(e, n, r, i) {
                for (arguments.length < 3 && (r = 0), arguments.length < 4 && (i = e.length); i > r;) {
                    var o = r + i >>> 1;
                    n < t.call(e, e[o], o) ? i = o : r = o + 1
                }
                return r
            }
        }
    };
    var da = ua.bisector(function(t) {
        return t
    });
    ua.bisectLeft = da.left, ua.bisect = ua.bisectRight = da.right, ua.shuffle = function(t) {
        for (var e, n, r = t.length; r;) n = 0 | Math.random() * r--, e = t[r], t[r] = t[n], t[n] = e;
        return t
    }, ua.permute = function(t, e) {
        for (var n = [], r = -1, i = e.length; ++r < i;) n[r] = t[e[r]];
        return n
    }, ua.zip = function() {
        if (!(i = arguments.length)) return [];
        for (var t = -1, n = ua.min(arguments, e), r = Array(n); ++t < n;)
            for (var i, o = -1, a = r[t] = Array(i); ++o < i;) a[o] = arguments[o][t];
        return r
    }, ua.transpose = function(t) {
        return ua.zip.apply(ua, t)
    }, ua.keys = function(t) {
        var e = [];
        for (var n in t) e.push(n);
        return e
    }, ua.values = function(t) {
        var e = [];
        for (var n in t) e.push(t[n]);
        return e
    }, ua.entries = function(t) {
        var e = [];
        for (var n in t) e.push({
            key: n,
            value: t[n]
        });
        return e
    }, ua.merge = function(t) {
        return Array.prototype.concat.apply([], t)
    }, ua.range = function(t, e, r) {
        if (arguments.length < 3 && (r = 1, arguments.length < 2 && (e = t, t = 0)), 1 / 0 === (e - t) / r) throw Error("infinite range");
        var i, o = [],
            a = n(Math.abs(r)),
            u = -1;
        if (t *= a, e *= a, r *= a, 0 > r)
            for (;
                (i = t + r * ++u) > e;) o.push(i / a);
        else
            for (;
                (i = t + r * ++u) < e;) o.push(i / a);
        return o
    }, ua.map = function(t) {
        var e = new i;
        for (var n in t) e.set(n, t[n]);
        return e
    }, r(i, {
        has: function(t) {
            return pa + t in this
        },
        get: function(t) {
            return this[pa + t]
        },
        set: function(t, e) {
            return this[pa + t] = e
        },
        remove: function(t) {
            return t = pa + t, t in this && delete this[t]
        },
        keys: function() {
            var t = [];
            return this.forEach(function(e) {
                t.push(e)
            }), t
        },
        values: function() {
            var t = [];
            return this.forEach(function(e, n) {
                t.push(n)
            }), t
        },
        entries: function() {
            var t = [];
            return this.forEach(function(e, n) {
                t.push({
                    key: e,
                    value: n
                })
            }), t
        },
        forEach: function(t) {
            for (var e in this) e.charCodeAt(0) === ga && t.call(this, e.substring(1), this[e])
        }
    });
    var pa = "\0",
        ga = pa.charCodeAt(0);
    ua.nest = function() {
        function t(e, u, s) {
            if (s >= a.length) return r ? r.call(o, u) : n ? u.sort(n) : u;
            for (var l, c, f, h, d = -1, p = u.length, g = a[s++], m = new i; ++d < p;)(h = m.get(l = g(c = u[d]))) ? h.push(c) : m.set(l, [c]);
            return e ? (c = e(), f = function(n, r) {
                c.set(n, t(e, r, s))
            }) : (c = {}, f = function(n, r) {
                c[n] = t(e, r, s)
            }), m.forEach(f), c
        }

        function e(t, n) {
            if (n >= a.length) return t;
            var r = [],
                i = u[n++];
            return t.forEach(function(t, i) {
                r.push({
                    key: t,
                    values: e(i, n)
                })
            }), i ? r.sort(function(t, e) {
                return i(t.key, e.key)
            }) : r
        }
        var n, r, o = {},
            a = [],
            u = [];
        return o.map = function(e, n) {
            return t(n, e, 0)
        }, o.entries = function(n) {
            return e(t(ua.map, n, 0), 0)
        }, o.key = function(t) {
            return a.push(t), o
        }, o.sortKeys = function(t) {
            return u[a.length - 1] = t, o
        }, o.sortValues = function(t) {
            return n = t, o
        }, o.rollup = function(t) {
            return r = t, o
        }, o
    }, ua.set = function(t) {
        var e = new o;
        if (t)
            for (var n = 0; n < t.length; n++) e.add(t[n]);
        return e
    }, r(o, {
        has: function(t) {
            return pa + t in this
        },
        add: function(t) {
            return this[pa + t] = !0, t
        },
        remove: function(t) {
            return t = pa + t, t in this && delete this[t]
        },
        values: function() {
            var t = [];
            return this.forEach(function(e) {
                t.push(e)
            }), t
        },
        forEach: function(t) {
            for (var e in this) e.charCodeAt(0) === ga && t.call(this, e.substring(1))
        }
    }), ua.behavior = {}, ua.rebind = function(t, e) {
        for (var n, r = 1, i = arguments.length; ++r < i;) t[n = arguments[r]] = a(t, e, e[n]);
        return t
    }, ua.dispatch = function() {
        for (var t = new u, e = -1, n = arguments.length; ++e < n;) t[arguments[e]] = s(t);
        return t
    }, u.prototype.on = function(t, e) {
        var n = t.indexOf("."),
            r = "";
        if (n >= 0 && (r = t.substring(n + 1), t = t.substring(0, n)), t) return arguments.length < 2 ? this[t].on(r) : this[t].on(r, e);
        if (2 === arguments.length) {
            if (null == e)
                for (t in this) this.hasOwnProperty(t) && this[t].on(r, null);
            return this
        }
    }, ua.event = null, ua.mouse = function(t) {
        return d(t, c())
    };
    var ma = /WebKit/.test(la.navigator.userAgent) ? -1 : 0,
        va = g;
    try {
        va(sa.documentElement.childNodes)[0].nodeType
    } catch (ya) {
        va = p
    }
    var ba = [].__proto__ ? function(t, e) {
        t.__proto__ = e
    } : function(t, e) {
        for (var n in e) t[n] = e[n]
    };
    ua.touches = function(t, e) {
        return arguments.length < 2 && (e = c()
                .touches), e ? va(e)
            .map(function(e) {
                var n = d(t, e);
                return n.identifier = e.identifier, n
            }) : []
    }, ua.behavior.drag = function() {
        function t() {
            this.on("mousedown.drag", e)
                .on("touchstart.drag", e)
        }

        function e() {
            function t() {
                var t = a.parentNode;
                return null != c ? ua.touches(t)
                    .filter(function(t) {
                        return t.identifier === c
                    })[0] : ua.mouse(t)
            }

            function e() {
                if (!a.parentNode) return i();
                var e = t(),
                    n = e[0] - h[0],
                    r = e[1] - h[1];
                d |= n | r, h = e, l(), u({
                    type: "drag",
                    x: e[0] + o[0],
                    y: e[1] + o[1],
                    dx: n,
                    dy: r
                })
            }

            function i() {
                u({
                        type: "dragend"
                    }), d && (l(), ua.event.target === s && f(p, "click")), p.on(null != c ? "touchmove.drag-" + c : "mousemove.drag", null)
                    .on(null != c ? "touchend.drag-" + c : "mouseup.drag", null)
            }
            var o, a = this,
                u = n.of(a, arguments),
                s = ua.event.target,
                c = ua.event.touches ? ua.event.changedTouches[0].identifier : null,
                h = t(),
                d = 0,
                p = ua.select(la)
                .on(null != c ? "touchmove.drag-" + c : "mousemove.drag", e)
                .on(null != c ? "touchend.drag-" + c : "mouseup.drag", i, !0);
            r ? (o = r.apply(a, arguments), o = [o.x - h[0], o.y - h[1]]) : o = [0, 0], null == c && l(), u({
                type: "dragstart"
            })
        }
        var n = h(t, "drag", "dragstart", "dragend"),
            r = null;
        return t.origin = function(e) {
            return arguments.length ? (r = e, t) : r
        }, ua.rebind(t, n, "on")
    };
    var xa = function(t, e) {
            return e.querySelector(t)
        },
        Ma = function(t, e) {
            return e.querySelectorAll(t)
        },
        wa = sa.documentElement,
        ka = wa.matchesSelector || wa.webkitMatchesSelector || wa.mozMatchesSelector || wa.msMatchesSelector || wa.oMatchesSelector,
        Na = function(t, e) {
            return ka.call(t, e)
        };
    "function" == typeof Sizzle && (xa = function(t, e) {
        return Sizzle(t, e)[0] || null
    }, Ma = function(t, e) {
        return Sizzle.uniqueSort(Sizzle(t, e))
    }, Na = Sizzle.matchesSelector), ua.selection = function() {
        return Aa
    };
    var Ta = ua.selection.prototype = [];
    Ta.select = function(t) {
        var e, n, r, i, o = [];
        "function" != typeof t && (t = v(t));
        for (var a = -1, u = this.length; ++a < u;) {
            o.push(e = []), e.parentNode = (r = this[a])
                .parentNode;
            for (var s = -1, l = r.length; ++s < l;)(i = r[s]) ? (e.push(n = t.call(i, i.__data__, s)), n && "__data__" in i && (n.__data__ = i.__data__)) : e.push(null)
        }
        return m(o)
    }, Ta.selectAll = function(t) {
        var e, n, r = [];
        "function" != typeof t && (t = y(t));
        for (var i = -1, o = this.length; ++i < o;)
            for (var a = this[i], u = -1, s = a.length; ++u < s;)(n = a[u]) && (r.push(e = va(t.call(n, n.__data__, u))), e.parentNode = n);
        return m(r)
    };
    var Sa = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    ua.ns = {
        prefix: Sa,
        qualify: function(t) {
            var e = t.indexOf(":"),
                n = t;
            return e >= 0 && (n = t.substring(0, e), t = t.substring(e + 1)), Sa.hasOwnProperty(n) ? {
                space: Sa[n],
                local: t
            } : t
        }
    }, Ta.attr = function(t, e) {
        if (arguments.length < 2) {
            if ("string" == typeof t) {
                var n = this.node();
                return t = ua.ns.qualify(t), t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t)
            }
            for (e in t) this.each(x(e, t[e]));
            return this
        }
        return this.each(x(t, e))
    }, ua.requote = function(t) {
        return t.replace(_a, "\\$&")
    };
    var _a = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
    Ta.classed = function(t, e) {
        if (arguments.length < 2) {
            if ("string" == typeof t) {
                var n = this.node(),
                    r = (t = t.trim()
                        .split(/^|\s+/g))
                    .length,
                    i = -1;
                if (e = n.classList) {
                    for (; ++i < r;)
                        if (!e.contains(t[i])) return !1
                } else
                    for (e = n.getAttribute("class"); ++i < r;)
                        if (!w(t[i])
                            .test(e)) return !1;
                return !0
            }
            for (e in t) this.each(k(e, t[e]));
            return this
        }
        return this.each(k(t, e))
    }, Ta.style = function(t, e, n) {
        var r = arguments.length;
        if (3 > r) {
            if ("string" != typeof t) {
                2 > r && (e = "");
                for (n in t) this.each(T(n, t[n], e));
                return this
            }
            if (2 > r) return la.getComputedStyle(this.node(), null)
                .getPropertyValue(t);
            n = ""
        }
        return this.each(T(t, e, n))
    }, Ta.property = function(t, e) {
        if (arguments.length < 2) {
            if ("string" == typeof t) return this.node()[t];
            for (e in t) this.each(S(e, t[e]));
            return this
        }
        return this.each(S(t, e))
    }, Ta.text = function(t) {
        return arguments.length ? this.each("function" == typeof t ? function() {
                var e = t.apply(this, arguments);
                this.textContent = null == e ? "" : e
            } : null == t ? function() {
                this.textContent = ""
            } : function() {
                this.textContent = t
            }) : this.node()
            .textContent
    }, Ta.html = function(t) {
        return arguments.length ? this.each("function" == typeof t ? function() {
                var e = t.apply(this, arguments);
                this.innerHTML = null == e ? "" : e
            } : null == t ? function() {
                this.innerHTML = ""
            } : function() {
                this.innerHTML = t
            }) : this.node()
            .innerHTML
    }, Ta.append = function(t) {
        function e() {
            return this.appendChild(sa.createElementNS(this.namespaceURI, t))
        }

        function n() {
            return this.appendChild(sa.createElementNS(t.space, t.local))
        }
        return t = ua.ns.qualify(t), this.select(t.local ? n : e)
    }, Ta.insert = function(t, e) {
        function n(n, r) {
            return this.insertBefore(sa.createElementNS(this.namespaceURI, t), e.call(this, n, r))
        }

        function r(n, r) {
            return this.insertBefore(sa.createElementNS(t.space, t.local), e.call(this, n, r))
        }
        return t = ua.ns.qualify(t), "function" != typeof e && (e = v(e)), this.select(t.local ? r : n)
    }, Ta.remove = function() {
        return this.each(function() {
            var t = this.parentNode;
            t && t.removeChild(this)
        })
    }, Ta.data = function(t, e) {
        function n(t, n) {
            var r, o, a, u = t.length,
                f = n.length,
                h = Math.min(u, f),
                d = Array(f),
                p = Array(f),
                g = Array(u);
            if (e) {
                var m, v = new i,
                    y = new i,
                    b = [];
                for (r = -1; ++r < u;) m = e.call(o = t[r], o.__data__, r), v.has(m) ? g[r] = o : v.set(m, o), b.push(m);
                for (r = -1; ++r < f;) m = e.call(n, a = n[r], r), (o = v.get(m)) ? (d[r] = o, o.__data__ = a) : y.has(m) || (p[r] = _(a)), y.set(m, a), v.remove(m);
                for (r = -1; ++r < u;) v.has(b[r]) && (g[r] = t[r])
            } else {
                for (r = -1; ++r < h;) o = t[r], a = n[r], o ? (o.__data__ = a, d[r] = o) : p[r] = _(a);
                for (; f > r; ++r) p[r] = _(n[r]);
                for (; u > r; ++r) g[r] = t[r]
            }
            p.update = d, p.parentNode = d.parentNode = g.parentNode = t.parentNode, s.push(p), l.push(d), c.push(g)
        }
        var r, o, a = -1,
            u = this.length;
        if (!arguments.length) {
            for (t = Array(u = (r = this[0])
                    .length); ++a < u;)(o = r[a]) && (t[a] = o.__data__);
            return t
        }
        var s = H([]),
            l = m([]),
            c = m([]);
        if ("function" == typeof t)
            for (; ++a < u;) n(r = this[a], t.call(r, r.parentNode.__data__, a));
        else
            for (; ++a < u;) n(r = this[a], t);
        return l.enter = function() {
            return s
        }, l.exit = function() {
            return c
        }, l
    }, Ta.datum = function(t) {
        return arguments.length ? this.property("__data__", t) : this.property("__data__")
    }, Ta.filter = function(t) {
        var e, n, r, i = [];
        "function" != typeof t && (t = E(t));
        for (var o = 0, a = this.length; a > o; o++) {
            i.push(e = []), e.parentNode = (n = this[o])
                .parentNode;
            for (var u = 0, s = n.length; s > u; u++)(r = n[u]) && t.call(r, r.__data__, u) && e.push(r)
        }
        return m(i)
    }, Ta.order = function() {
        for (var t = -1, e = this.length; ++t < e;)
            for (var n, r = this[t], i = r.length - 1, o = r[i]; --i >= 0;)(n = r[i]) && (o && o !== n.nextSibling && o.parentNode.insertBefore(n, o), o = n);
        return this
    }, Ta.sort = function(t) {
        t = C.apply(this, arguments);
        for (var e = -1, n = this.length; ++e < n;) this[e].sort(t);
        return this.order()
    }, Ta.on = function(t, e, n) {
        var r = arguments.length;
        if (3 > r) {
            if ("string" != typeof t) {
                2 > r && (e = !1);
                for (n in t) this.each(j(n, t[n], e));
                return this
            }
            if (2 > r) return (r = this.node()["__on" + t]) && r._;
            n = !1
        }
        return this.each(j(t, e, n))
    };
    var Ea = ua.map({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    });
    Ea.forEach(function(t) {
        "on" + t in sa && Ea.remove(t)
    }), Ta.each = function(t) {
        return L(this, function(e, n, r) {
            t.call(e, e.__data__, n, r)
        })
    }, Ta.call = function(t) {
        var e = va(arguments);
        return t.apply(e[0] = this, e), this
    }, Ta.empty = function() {
        return !this.node()
    }, Ta.node = function() {
        for (var t = 0, e = this.length; e > t; t++)
            for (var n = this[t], r = 0, i = n.length; i > r; r++) {
                var o = n[r];
                if (o) return o
            }
        return null
    };
    var Ca = [];
    ua.selection.enter = H, ua.selection.enter.prototype = Ca, Ca.append = Ta.append, Ca.insert = Ta.insert, Ca.empty = Ta.empty, Ca.node = Ta.node, Ca.select = function(t) {
        for (var e, n, r, i, o, a = [], u = -1, s = this.length; ++u < s;) {
            r = (i = this[u])
                .update, a.push(e = []), e.parentNode = i.parentNode;
            for (var l = -1, c = i.length; ++l < c;)(o = i[l]) ? (e.push(r[l] = n = t.call(i.parentNode, o.__data__, l)), n.__data__ = o.__data__) : e.push(null)
        }
        return m(a)
    }, Ta.transition = function() {
        var t, e, n = os || ++ls,
            r = [],
            i = Object.create(cs);
        i.time = Date.now();
        for (var o = -1, a = this.length; ++o < a;) {
            r.push(t = []);
            for (var u = this[o], s = -1, l = u.length; ++s < l;)(e = u[s]) && xo(e, s, n, i), t.push(e)
        }
        return vo(r, n)
    }, ua.select = function(t) {
        var e = ["string" == typeof t ? xa(t, sa) : t];
        return e.parentNode = wa, m([e])
    }, ua.selectAll = function(t) {
        var e = va("string" == typeof t ? Ma(t, sa) : t);
        return e.parentNode = wa, m([e])
    };
    var Aa = ua.select(wa);
    ua.behavior.zoom = function() {
        function t() {
            this.on("mousedown.zoom", u)
                .on("mousemove.zoom", c)
                .on(qa + ".zoom", s)
                .on("dblclick.zoom", d)
                .on("touchstart.zoom", p)
                .on("touchmove.zoom", g)
                .on("touchend.zoom", p)
        }

        function e(t) {
            return [(t[0] - k[0]) / N, (t[1] - k[1]) / N]
        }

        function n(t) {
            return [t[0] * N + k[0], t[1] * N + k[1]]
        }

        function r(t) {
            N = Math.max(T[0], Math.min(T[1], t))
        }

        function i(t, e) {
            e = n(e), k[0] += t[0] - e[0], k[1] += t[1] - e[1]
        }

        function o() {
            b && b.domain(y.range()
                .map(function(t) {
                    return (t - k[0]) / N
                })
                .map(y.invert)), M && M.domain(x.range()
                .map(function(t) {
                    return (t - k[1]) / N
                })
                .map(x.invert))
        }

        function a(t) {
            o(), ua.event.preventDefault(), t({
                type: "zoom",
                scale: N,
                translate: k
            })
        }

        function u() {
            function t() {
                s = 1, i(ua.mouse(r), h), a(o)
            }

            function n() {
                s && l(), c.on("mousemove.zoom", null)
                    .on("mouseup.zoom", null), s && ua.event.target === u && f(c, "click.zoom")
            }
            var r = this,
                o = S.of(r, arguments),
                u = ua.event.target,
                s = 0,
                c = ua.select(la)
                .on("mousemove.zoom", t)
                .on("mouseup.zoom", n),
                h = e(ua.mouse(r));
            la.focus(), l()
        }

        function s() {
            m || (m = e(ua.mouse(this))), r(Math.pow(2, .002 * ja()) * N), i(ua.mouse(this), m), a(S.of(this, arguments))
        }

        function c() {
            m = null
        }

        function d() {
            var t = ua.mouse(this),
                n = e(t),
                o = Math.log(N) / Math.LN2;
            r(Math.pow(2, ua.event.shiftKey ? Math.ceil(o) - 1 : Math.floor(o) + 1)), i(t, n), a(S.of(this, arguments))
        }

        function p() {
            var t = ua.touches(this),
                n = Date.now();
            if (v = N, m = {}, t.forEach(function(t) {
                    m[t.identifier] = e(t)
                }), l(), 1 === t.length) {
                if (500 > n - w) {
                    var o = t[0],
                        u = e(t[0]);
                    r(2 * N), i(o, u), a(S.of(this, arguments))
                }
                w = n
            }
        }

        function g() {
            var t = ua.touches(this),
                e = t[0],
                n = m[e.identifier];
            if (o = t[1]) {
                var o, u = m[o.identifier];
                e = [(e[0] + o[0]) / 2, (e[1] + o[1]) / 2], n = [(n[0] + u[0]) / 2, (n[1] + u[1]) / 2], r(ua.event.scale * v)
            }
            i(e, n), w = null, a(S.of(this, arguments))
        }
        var m, v, y, b, x, M, w, k = [0, 0],
            N = 1,
            T = Da,
            S = h(t, "zoom");
        return t.translate = function(e) {
            return arguments.length ? (k = e.map(Number), o(), t) : k
        }, t.scale = function(e) {
            return arguments.length ? (N = +e, o(), t) : N
        }, t.scaleExtent = function(e) {
            return arguments.length ? (T = null == e ? Da : e.map(Number), t) : T
        }, t.x = function(e) {
            return arguments.length ? (b = e, y = e.copy(), k = [0, 0], N = 1, t) : b
        }, t.y = function(e) {
            return arguments.length ? (M = e, x = e.copy(), k = [0, 0], N = 1, t) : M
        }, ua.rebind(t, S, "on")
    };
    var ja, Da = [0, 1 / 0],
        qa = "onwheel" in sa ? (ja = function() {
            return -ua.event.deltaY * (ua.event.deltaMode ? 120 : 1)
        }, "wheel") : "onmousewheel" in sa ? (ja = function() {
            return ua.event.wheelDelta
        }, "mousewheel") : (ja = function() {
            return -ua.event.detail
        }, "MozMousePixelScroll");
    F.prototype.toString = function() {
        return this.rgb() + ""
    }, ua.hsl = function(t, e, n) {
        return 1 === arguments.length ? t instanceof O ? R(t.h, t.s, t.l) : oe("" + t, ae, R) : R(+t, +e, +n)
    };
    var La = O.prototype = new F;
    La.brighter = function(t) {
        return t = Math.pow(.7, arguments.length ? t : 1), R(this.h, this.s, this.l / t)
    }, La.darker = function(t) {
        return t = Math.pow(.7, arguments.length ? t : 1), R(this.h, this.s, t * this.l)
    }, La.rgb = function() {
        return z(this.h, this.s, this.l)
    };
    var Ha = Math.PI,
        Fa = 1e-6,
        Ra = Ha / 180,
        Oa = 180 / Ha;
    ua.hcl = function(t, e, n) {
        return 1 === arguments.length ? t instanceof Y ? U(t.h, t.c, t.l) : t instanceof Z ? Q(t.l, t.a, t.b) : Q((t = ue((t = ua.rgb(t))
                .r, t.g, t.b))
            .l, t.a, t.b) : U(+t, +e, +n)
    };
    var za = Y.prototype = new F;
    za.brighter = function(t) {
        return U(this.h, this.c, Math.min(100, this.l + Pa * (arguments.length ? t : 1)))
    }, za.darker = function(t) {
        return U(this.h, this.c, Math.max(0, this.l - Pa * (arguments.length ? t : 1)))
    }, za.rgb = function() {
        return V(this.h, this.c, this.l)
            .rgb()
    }, ua.lab = function(t, e, n) {
        return 1 === arguments.length ? t instanceof Z ? G(t.l, t.a, t.b) : t instanceof Y ? V(t.l, t.c, t.h) : ue((t = ua.rgb(t))
            .r, t.g, t.b) : G(+t, +e, +n)
    };
    var Pa = 18,
        Ia = .95047,
        Ba = 1,
        Wa = 1.08883,
        $a = Z.prototype = new F;
    $a.brighter = function(t) {
        return G(Math.min(100, this.l + Pa * (arguments.length ? t : 1)), this.a, this.b)
    }, $a.darker = function(t) {
        return G(Math.max(0, this.l - Pa * (arguments.length ? t : 1)), this.a, this.b)
    }, $a.rgb = function() {
        return J(this.l, this.a, this.b)
    }, ua.rgb = function(t, e, n) {
        return 1 === arguments.length ? t instanceof re ? ne(t.r, t.g, t.b) : oe("" + t, ne, z) : ne(~~t, ~~e, ~~n)
    };
    var Xa = re.prototype = new F;
    Xa.brighter = function(t) {
        t = Math.pow(.7, arguments.length ? t : 1);
        var e = this.r,
            n = this.g,
            r = this.b,
            i = 30;
        return e || n || r ? (e && i > e && (e = i), n && i > n && (n = i), r && i > r && (r = i), ne(Math.min(255, Math.floor(e / t)), Math.min(255, Math.floor(n / t)), Math.min(255, Math.floor(r / t)))) : ne(i, i, i)
    }, Xa.darker = function(t) {
        return t = Math.pow(.7, arguments.length ? t : 1), ne(Math.floor(t * this.r), Math.floor(t * this.g), Math.floor(t * this.b))
    }, Xa.hsl = function() {
        return ae(this.r, this.g, this.b)
    }, Xa.toString = function() {
        return "#" + ie(this.r) + ie(this.g) + ie(this.b)
    };
    var Ua = ua.map({
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    });
    Ua.forEach(function(t, e) {
        Ua.set(t, oe(e, ne, z))
    }), ua.functor = ce, ua.xhr = function(t, e, n) {
        function r() {
            var t = s.status;
            !t && s.responseText || t >= 200 && 300 > t || 304 === t ? o.load.call(i, u.call(i, s)) : o.error.call(i, s)
        }
        var i = {},
            o = ua.dispatch("progress", "load", "error"),
            a = {},
            u = fe,
            s = new(la.XDomainRequest && /^(http(s)?:)?\/\//.test(t) ? XDomainRequest : XMLHttpRequest);
        return "onload" in s ? s.onload = s.onerror = r : s.onreadystatechange = function() {
            s.readyState > 3 && r()
        }, s.onprogress = function(t) {
            var e = ua.event;
            ua.event = t;
            try {
                o.progress.call(i, s)
            } finally {
                ua.event = e
            }
        }, i.header = function(t, e) {
            return t = (t + "")
                .toLowerCase(), arguments.length < 2 ? a[t] : (null == e ? delete a[t] : a[t] = e + "", i)
        }, i.mimeType = function(t) {
            return arguments.length ? (e = null == t ? null : t + "", i) : e
        }, i.response = function(t) {
            return u = t, i
        }, ["get", "post"].forEach(function(t) {
            i[t] = function() {
                return i.send.apply(i, [t].concat(va(arguments)))
            }
        }), i.send = function(n, r, o) {
            if (2 === arguments.length && "function" == typeof r && (o = r, r = null), s.open(n, t, !0), null == e || "accept" in a || (a.accept = e + ",*/*"), s.setRequestHeader)
                for (var u in a) s.setRequestHeader(u, a[u]);
            return null != e && s.overrideMimeType && s.overrideMimeType(e), null != o && i.on("error", o)
                .on("load", function(t) {
                    o(null, t)
                }), s.send(null == r ? null : r), i
        }, i.abort = function() {
            return s.abort(), i
        }, ua.rebind(i, o, "on"), 2 === arguments.length && "function" == typeof e && (n = e, e = null), null == n ? i : i.get(he(n))
    }, ua.csv = de(",", "text/csv"), ua.tsv = de("	", "text/tab-separated-values");
    var Ya, Va, Ga = 0,
        Za = {},
        Ja = null;
    ua.timer = function(t, e, n) {
        if (arguments.length < 3) {
            if (arguments.length < 2) e = 0;
            else if (!isFinite(e)) return;
            n = Date.now()
        }
        var r = Za[t.id];
        r && r.callback === t ? (r.then = n, r.delay = e) : Za[t.id = ++Ga] = Ja = {
            callback: t,
            then: n,
            delay: e,
            next: Ja
        }, Ya || (Va = clearTimeout(Va), Ya = 1, Qa(pe))
    }, ua.timer.flush = function() {
        for (var t, e = Date.now(), n = Ja; n;) t = e - n.then, n.delay || (n.flush = n.callback(t)), n = n.next;
        ge()
    };
    var Qa = la.requestAnimationFrame || la.webkitRequestAnimationFrame || la.mozRequestAnimationFrame || la.oRequestAnimationFrame || la.msRequestAnimationFrame || function(t) {
            setTimeout(t, 17)
        },
        Ka = ".",
        tu = ",",
        eu = [3, 3],
        nu = ["y", "z", "a", "f", "p", "n", "Âµ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(me);
    ua.formatPrefix = function(t, e) {
        var n = 0;
        return t && (0 > t && (t *= -1), e && (t = ua.round(t, ve(t, e))), n = 1 + Math.floor(1e-12 + Math.log(t) / Math.LN10), n = Math.max(-24, Math.min(24, 3 * Math.floor((0 >= n ? n + 1 : n - 1) / 3)))), nu[8 + n / 3]
    }, ua.round = function(t, e) {
        return e ? Math.round(t * (e = Math.pow(10, e))) / e : Math.round(t)
    }, ua.format = function(t) {
        var e = ru.exec(t),
            n = e[1] || " ",
            r = e[2] || ">",
            i = e[3] || "",
            o = e[4] || "",
            a = e[5],
            u = +e[6],
            s = e[7],
            l = e[8],
            c = e[9],
            f = 1,
            h = "",
            d = !1;
        switch (l && (l = +l.substring(1)), (a || "0" === n && "=" === r) && (a = n = "0", r = "=", s && (u -= Math.floor((u - 1) / 4))), c) {
            case "n":
                s = !0, c = "g";
                break;
            case "%":
                f = 100, h = "%", c = "f";
                break;
            case "p":
                f = 100, h = "%", c = "r";
                break;
            case "b":
            case "o":
            case "x":
            case "X":
                o && (o = "0" + c.toLowerCase());
            case "c":
            case "d":
                d = !0, l = 0;
                break;
            case "s":
                f = -1, c = "r"
        }
        "#" === o && (o = ""), "r" != c || l || (c = "g"), null != l && ("g" == c ? l = Math.max(1, Math.min(21, l)) : ("e" == c || "f" == c) && (l = Math.max(0, Math.min(20, l)))), c = iu.get(c) || ye;
        var p = a && s;
        return function(t) {
            if (d && t % 1) return "";
            var e = 0 > t || 0 === t && 0 > 1 / t ? (t = -t, "-") : i;
            if (0 > f) {
                var g = ua.formatPrefix(t, l);
                t = g.scale(t), h = g.symbol
            } else t *= f;
            t = c(t, l), !a && s && (t = ou(t));
            var m = o.length + t.length + (p ? 0 : e.length),
                v = u > m ? Array(m = u - m + 1)
                .join(n) : "";
            return p && (t = ou(v + t)), Ka && t.replace(".", Ka), e += o, ("<" === r ? e + t + v : ">" === r ? v + e + t : "^" === r ? v.substring(0, m >>= 1) + e + t + v.substring(m) : e + (p ? t : v + t)) + h
        }
    };
    var ru = /(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,
        iu = ua.map({
            b: function(t) {
                return t.toString(2)
            },
            c: function(t) {
                return String.fromCharCode(t)
            },
            o: function(t) {
                return t.toString(8)
            },
            x: function(t) {
                return t.toString(16)
            },
            X: function(t) {
                return t.toString(16)
                    .toUpperCase()
            },
            g: function(t, e) {
                return t.toPrecision(e)
            },
            e: function(t, e) {
                return t.toExponential(e)
            },
            f: function(t, e) {
                return t.toFixed(e)
            },
            r: function(t, e) {
                return (t = ua.round(t, ve(t, e)))
                    .toFixed(Math.max(0, Math.min(20, ve(t * (1 + 1e-15), e))))
            }
        }),
        ou = fe;
    if (eu) {
        var au = eu.length;
        ou = function(t) {
            for (var e = t.lastIndexOf("."), n = e >= 0 ? "." + t.substring(e + 1) : (e = t.length, ""), r = [], i = 0, o = eu[0]; e > 0 && o > 0;) r.push(t.substring(e -= o, e + o)), o = eu[i = (i + 1) % au];
            return r.reverse()
                .join(tu || "") + n
        }
    }
    ua.geo = {}, ua.geo.stream = function(t, e) {
        t && uu.hasOwnProperty(t.type) ? uu[t.type](t, e) : be(t, e)
    };
    var uu = {
            Feature: function(t, e) {
                be(t.geometry, e)
            },
            FeatureCollection: function(t, e) {
                for (var n = t.features, r = -1, i = n.length; ++r < i;) be(n[r].geometry, e)
            }
        },
        su = {
            Sphere: function(t, e) {
                e.sphere()
            },
            Point: function(t, e) {
                var n = t.coordinates;
                e.point(n[0], n[1])
            },
            MultiPoint: function(t, e) {
                for (var n, r = t.coordinates, i = -1, o = r.length; ++i < o;) n = r[i], e.point(n[0], n[1])
            },
            LineString: function(t, e) {
                xe(t.coordinates, e, 0)
            },
            MultiLineString: function(t, e) {
                for (var n = t.coordinates, r = -1, i = n.length; ++r < i;) xe(n[r], e, 0)
            },
            Polygon: function(t, e) {
                Me(t.coordinates, e)
            },
            MultiPolygon: function(t, e) {
                for (var n = t.coordinates, r = -1, i = n.length; ++r < i;) Me(n[r], e)
            },
            GeometryCollection: function(t, e) {
                for (var n = t.geometries, r = -1, i = n.length; ++r < i;) be(n[r], e)
            }
        };
    ua.geo.area = function(t) {
        return lu = 0, ua.geo.stream(t, fu), lu
    };
    var lu, cu, fu = {
        sphere: function() {
            lu += 4 * Ha
        },
        point: A,
        lineStart: A,
        lineEnd: A,
        polygonStart: function() {
            cu = 0, fu.lineStart = we
        },
        polygonEnd: function() {
            var t = 2 * cu;
            lu += 0 > t ? 4 * Ha + t : t, fu.lineStart = fu.lineEnd = fu.point = A
        }
    };
    ua.geo.bounds = function() {
        function t(t, e) {
            b.push(x = [c = t, h = t]), f > e && (f = e), e > d && (d = e)
        }

        function e(e, n) {
            var r = ke([e * Ra, n * Ra]);
            if (v) {
                var i = Te(v, r),
                    o = [i[1], -i[0], 0],
                    a = Te(o, i);
                Ee(a), a = Ce(a);
                var s = e - p,
                    l = s > 0 ? 1 : -1,
                    g = a[0] * Oa * l,
                    m = Math.abs(s) > 180;
                if (m ^ (g > l * p && l * e > g)) {
                    var y = a[1] * Oa;
                    y > d && (d = y)
                } else if (g = (g + 360) % 360 - 180, m ^ (g > l * p && l * e > g)) {
                    var y = -a[1] * Oa;
                    f > y && (f = y)
                } else f > n && (f = n), n > d && (d = n);
                m ? p > e ? u(c, e) > u(c, h) && (h = e) : u(e, h) > u(c, h) && (c = e) : h >= c ? (c > e && (c = e), e > h && (h = e)) : e > p ? u(c, e) > u(c, h) && (h = e) : u(e, h) > u(c, h) && (c = e)
            } else t(e, n);
            v = r, p = e
        }

        function n() {
            M.point = e
        }

        function r() {
            x[0] = c, x[1] = h, M.point = t, v = null
        }

        function i(t, n) {
            if (v) {
                var r = t - p;
                y += Math.abs(r) > 180 ? r + (r > 0 ? 360 : -360) : r
            } else g = t, m = n;
            fu.point(t, n), e(t, n)
        }

        function o() {
            fu.lineStart()
        }

        function a() {
            i(g, m), fu.lineEnd(), Math.abs(y) > Fa && (c = -(h = 180)), x[0] = c, x[1] = h, v = null
        }

        function u(t, e) {
            return (e -= t) < 0 ? e + 360 : e
        }

        function s(t, e) {
            return t[0] - e[0]
        }

        function l(t, e) {
            return e[0] <= e[1] ? e[0] <= t && t <= e[1] : t < e[0] || e[1] < t
        }
        var c, f, h, d, p, g, m, v, y, b, x, M = {
            point: t,
            lineStart: n,
            lineEnd: r,
            polygonStart: function() {
                M.point = i, M.lineStart = o, M.lineEnd = a, y = 0, fu.polygonStart()
            },
            polygonEnd: function() {
                fu.polygonEnd(), M.point = t, M.lineStart = n, M.lineEnd = r, 0 > cu ? (c = -(h = 180), f = -(d = 90)) : y > Fa ? d = 90 : -Fa > y && (f = -90), x[0] = c, x[1] = h
            }
        };
        return function(t) {
            d = h = -(c = f = 1 / 0), b = [], ua.geo.stream(t, M), b.sort(s);
            for (var e, n = 1, r = b.length, i = b[0], o = [i]; r > n; ++n) e = b[n], l(e[0], i) || l(e[1], i) ? (u(i[0], e[1]) > u(i[0], i[1]) && (i[1] = e[1]), u(e[0], i[1]) > u(i[0], i[1]) && (i[0] = e[0])) : o.push(i = e);
            for (var a, e, p = -1 / 0, r = o.length - 1, n = 0, i = o[r]; r >= n; i = e, ++n) e = o[n], (a = u(i[1], e[0])) > p && (p = a, c = e[0], h = i[1]);
            return b = x = null, [
                [c, f],
                [h, d]
            ]
        }
    }(), ua.geo.centroid = function(t) {
        hu = du = pu = gu = mu = 0, ua.geo.stream(t, vu);
        var e;
        return du && Math.abs(e = Math.sqrt(pu * pu + gu * gu + mu * mu)) > Fa ? [Math.atan2(gu, pu) * Oa, Math.asin(Math.max(-1, Math.min(1, mu / e))) * Oa] : void 0
    };
    var hu, du, pu, gu, mu, vu = {
            sphere: function() {
                2 > hu && (hu = 2, du = pu = gu = mu = 0)
            },
            point: je,
            lineStart: qe,
            lineEnd: Le,
            polygonStart: function() {
                2 > hu && (hu = 2, du = pu = gu = mu = 0), vu.lineStart = De
            },
            polygonEnd: function() {
                vu.lineStart = qe
            }
        },
        yu = Oe(He, We, Xe),
        bu = 1e9;
    ua.geo.projection = Je, ua.geo.projectionMutator = Qe, (ua.geo.equirectangular = function() {
            return Je(tn)
        })
        .raw = tn.invert = tn, ua.geo.rotation = function(t) {
            function e(e) {
                return e = t(e[0] * Ra, e[1] * Ra), e[0] *= Oa, e[1] *= Oa, e
            }
            return t = en(t[0] % 360 * Ra, t[1] * Ra, t.length > 2 ? t[2] * Ra : 0), e.invert = function(e) {
                return e = t.invert(e[0] * Ra, e[1] * Ra), e[0] *= Oa, e[1] *= Oa, e
            }, e
        }, ua.geo.circle = function() {
            function t() {
                var t = "function" == typeof r ? r.apply(this, arguments) : r,
                    e = en(-t[0] * Ra, -t[1] * Ra, 0)
                    .invert,
                    i = [];
                return n(null, null, 1, {
                    point: function(t, n) {
                        i.push(t = e(t, n)), t[0] *= Oa, t[1] *= Oa
                    }
                }), {
                    type: "Polygon",
                    coordinates: [i]
                }
            }
            var e, n, r = [0, 0],
                i = 6;
            return t.origin = function(e) {
                return arguments.length ? (r = e, t) : r
            }, t.angle = function(r) {
                return arguments.length ? (n = an((e = +r) * Ra, i * Ra), t) : e
            }, t.precision = function(r) {
                return arguments.length ? (n = an(e * Ra, (i = +r) * Ra), t) : i
            }, t.angle(90)
        }, ua.geo.distance = function(t, e) {
            var n, r = (e[0] - t[0]) * Ra,
                i = t[1] * Ra,
                o = e[1] * Ra,
                a = Math.sin(r),
                u = Math.cos(r),
                s = Math.sin(i),
                l = Math.cos(i),
                c = Math.sin(o),
                f = Math.cos(o);
            return Math.atan2(Math.sqrt((n = f * a) * n + (n = l * c - s * f * u) * n), s * c + l * f * u)
        }, ua.geo.graticule = function() {
            function t() {
                return {
                    type: "MultiLineString",
                    coordinates: e()
                }
            }

            function e() {
                return ua.range(Math.ceil(o / m) * m, i, m)
                    .map(h)
                    .concat(ua.range(Math.ceil(l / v) * v, s, v)
                        .map(d))
                    .concat(ua.range(Math.ceil(r / p) * p, n, p)
                        .filter(function(t) {
                            return Math.abs(t % m) > Fa
                        })
                        .map(c))
                    .concat(ua.range(Math.ceil(u / g) * g, a, g)
                        .filter(function(t) {
                            return Math.abs(t % v) > Fa
                        })
                        .map(f))
            }
            var n, r, i, o, a, u, s, l, c, f, h, d, p = 10,
                g = p,
                m = 90,
                v = 360,
                y = 2.5;
            return t.lines = function() {
                    return e()
                        .map(function(t) {
                            return {
                                type: "LineString",
                                coordinates: t
                            }
                        })
                }, t.outline = function() {
                    return {
                        type: "Polygon",
                        coordinates: [h(o)
                            .concat(d(s)
                                .slice(1), h(i)
                                .reverse()
                                .slice(1), d(l)
                                .reverse()
                                .slice(1))
                        ]
                    }
                }, t.extent = function(e) {
                    return arguments.length ? t.majorExtent(e)
                        .minorExtent(e) : t.minorExtent()
                }, t.majorExtent = function(e) {
                    return arguments.length ? (o = +e[0][0], i = +e[1][0], l = +e[0][1], s = +e[1][1], o > i && (e = o, o = i, i = e), l > s && (e = l, l = s, s = e), t.precision(y)) : [
                        [o, l],
                        [i, s]
                    ]
                }, t.minorExtent = function(e) {
                    return arguments.length ? (r = +e[0][0], n = +e[1][0], u = +e[0][1], a = +e[1][1], r > n && (e = r, r = n, n = e), u > a && (e = u, u = a, a = e), t.precision(y)) : [
                        [r, u],
                        [n, a]
                    ]
                }, t.step = function(e) {
                    return arguments.length ? t.majorStep(e)
                        .minorStep(e) : t.minorStep()
                }, t.majorStep = function(e) {
                    return arguments.length ? (m = +e[0], v = +e[1], t) : [m, v]
                }, t.minorStep = function(e) {
                    return arguments.length ? (p = +e[0], g = +e[1], t) : [p, g]
                }, t.precision = function(e) {
                    return arguments.length ? (y = +e, c = sn(u, a, 90), f = ln(r, n, y), h = sn(l, s, 90), d = ln(o, i, y), t) : y
                }, t.majorExtent([
                    [-180, -90 + Fa],
                    [180, 90 - Fa]
                ])
                .minorExtent([
                    [-180, -80 - Fa],
                    [180, 80 + Fa]
                ])
        }, ua.geo.greatArc = function() {
            function t() {
                return {
                    type: "LineString",
                    coordinates: [e || r.apply(this, arguments), n || i.apply(this, arguments)]
                }
            }
            var e, n, r = cn,
                i = fn;
            return t.distance = function() {
                return ua.geo.distance(e || r.apply(this, arguments), n || i.apply(this, arguments))
            }, t.source = function(n) {
                return arguments.length ? (r = n, e = "function" == typeof n ? null : n, t) : r
            }, t.target = function(e) {
                return arguments.length ? (i = e, n = "function" == typeof e ? null : e, t) : i
            }, t.precision = function() {
                return arguments.length ? t : 0
            }, t
        }, ua.geo.interpolate = function(t, e) {
            return hn(t[0] * Ra, t[1] * Ra, e[0] * Ra, e[1] * Ra)
        }, ua.geo.length = function(t) {
            return xu = 0, ua.geo.stream(t, Mu), xu
        };
    var xu, Mu = {
        sphere: A,
        point: A,
        lineStart: dn,
        lineEnd: A,
        polygonStart: A,
        polygonEnd: A
    };
    (ua.geo.conicEqualArea = function() {
        return pn(gn)
    })
    .raw = gn, ua.geo.albers = function() {
        return ua.geo.conicEqualArea()
            .rotate([96, 0])
            .center([-.6, 38.7])
            .parallels([29.5, 45.5])
            .scale(1070)
    }, ua.geo.albersUsa = function() {
        function t(t) {
            var o = t[0],
                a = t[1];
            return e = null, n(o, a), e || (r(o, a), e) || i(o, a), e
        }
        var e, n, r, i, o = ua.geo.albers(),
            a = ua.geo.conicEqualArea()
            .rotate([154, 0])
            .center([-2, 58.5])
            .parallels([55, 65]),
            u = ua.geo.conicEqualArea()
            .rotate([157, 0])
            .center([-3, 19.9])
            .parallels([8, 18]),
            s = {
                point: function(t, n) {
                    e = [t, n]
                }
            };
        return t.invert = function(t) {
            var e = o.scale(),
                n = o.translate(),
                r = (t[0] - n[0]) / e,
                i = (t[1] - n[1]) / e;
            return (i >= .12 && .234 > i && r >= -.425 && -.214 > r ? a : i >= .166 && .234 > i && r >= -.214 && -.115 > r ? u : o)
                .invert(t)
        }, t.stream = function(t) {
            var e = o.stream(t),
                n = a.stream(t),
                r = u.stream(t);
            return {
                point: function(t, i) {
                    e.point(t, i), n.point(t, i), r.point(t, i)
                },
                sphere: function() {
                    e.sphere(), n.sphere(), r.sphere()
                },
                lineStart: function() {
                    e.lineStart(), n.lineStart(), r.lineStart()
                },
                lineEnd: function() {
                    e.lineEnd(), n.lineEnd(), r.lineEnd()
                },
                polygonStart: function() {
                    e.polygonStart(), n.polygonStart(), r.polygonStart()
                },
                polygonEnd: function() {
                    e.polygonEnd(), n.polygonEnd(), r.polygonEnd()
                }
            }
        }, t.precision = function(e) {
            return arguments.length ? (o.precision(e), a.precision(e), u.precision(e), t) : o.precision()
        }, t.scale = function(e) {
            return arguments.length ? (o.scale(e), a.scale(.35 * e), u.scale(e), t.translate(o.translate())) : o.scale()
        }, t.translate = function(e) {
            if (!arguments.length) return o.translate();
            var l = o.scale(),
                c = +e[0],
                f = +e[1];
            return n = o.translate(e)
                .clipExtent([
                    [c - .455 * l, f - .238 * l],
                    [c + .455 * l, f + .238 * l]
                ])
                .stream(s)
                .point, r = a.translate([c - .307 * l, f + .201 * l])
                .clipExtent([
                    [c - .425 * l + Fa, f + .12 * l + Fa],
                    [c - .214 * l - Fa, f + .234 * l - Fa]
                ])
                .stream(s)
                .point, i = u.translate([c - .205 * l, f + .212 * l])
                .clipExtent([
                    [c - .214 * l + Fa, f + .166 * l + Fa],
                    [c - .115 * l - Fa, f + .234 * l - Fa]
                ])
                .stream(s)
                .point, t
        }, t.scale(1070)
    };
    var wu, ku, Nu, Tu, Su, _u, Eu = {
            point: A,
            lineStart: A,
            lineEnd: A,
            polygonStart: function() {
                ku = 0, Eu.lineStart = mn
            },
            polygonEnd: function() {
                Eu.lineStart = Eu.lineEnd = Eu.point = A, wu += Math.abs(ku / 2)
            }
        },
        Cu = {
            point: vn,
            lineStart: A,
            lineEnd: A,
            polygonStart: A,
            polygonEnd: A
        },
        Au = {
            point: xn,
            lineStart: Mn,
            lineEnd: wn,
            polygonStart: function() {
                Au.lineStart = kn
            },
            polygonEnd: function() {
                Au.point = xn, Au.lineStart = Mn, Au.lineEnd = wn
            }
        };
    ua.geo.path = function() {
        function t(t) {
            return t && ua.geo.stream(t, r(i.pointRadius("function" == typeof o ? +o.apply(this, arguments) : o))), i.result()
        }
        var e, n, r, i, o = 4.5;
        return t.area = function(t) {
                return wu = 0, ua.geo.stream(t, r(Eu)), wu
            }, t.centroid = function(t) {
                return hu = pu = gu = mu = 0, ua.geo.stream(t, r(Au)), mu ? [pu / mu, gu / mu] : void 0
            }, t.bounds = function(t) {
                return Su = _u = -(Nu = Tu = 1 / 0), ua.geo.stream(t, r(Cu)), [
                    [Nu, Tu],
                    [Su, _u]
                ]
            }, t.projection = function(n) {
                return arguments.length ? (r = (e = n) ? n.stream || Tn(n) : fe, t) : e
            }, t.context = function(e) {
                return arguments.length ? (i = null == (n = e) ? new yn : new Nn(e), t) : n
            }, t.pointRadius = function(e) {
                return arguments.length ? (o = "function" == typeof e ? e : +e, t) : o
            }, t.projection(ua.geo.albersUsa())
            .context(null)
    };
    var ju = Sn(function(t) {
        return Math.sqrt(2 / (1 + t))
    }, function(t) {
        return 2 * Math.asin(t / 2)
    });
    (ua.geo.azimuthalEqualArea = function() {
        return Je(ju)
    })
    .raw = ju;
    var Du = Sn(function(t) {
        var e = Math.acos(t);
        return e && e / Math.sin(e)
    }, fe);
    (ua.geo.azimuthalEquidistant = function() {
        return Je(Du)
    })
    .raw = Du, (ua.geo.conicConformal = function() {
            return pn(_n)
        })
        .raw = _n, (ua.geo.conicEquidistant = function() {
            return pn(En)
        })
        .raw = En;
    var qu = Sn(function(t) {
        return 1 / t
    }, Math.atan);
    (ua.geo.gnomonic = function() {
        return Je(qu)
    })
    .raw = qu, Cn.invert = function(t, e) {
            return [t, 2 * Math.atan(Math.exp(e)) - Ha / 2]
        }, (ua.geo.mercator = function() {
            return An(Cn)
        })
        .raw = Cn;
    var Lu = Sn(function() {
        return 1
    }, Math.asin);
    (ua.geo.orthographic = function() {
        return Je(Lu)
    })
    .raw = Lu;
    var Hu = Sn(function(t) {
        return 1 / (1 + t)
    }, function(t) {
        return 2 * Math.atan(t)
    });
    (ua.geo.stereographic = function() {
        return Je(Hu)
    })
    .raw = Hu, jn.invert = function(t, e) {
            return [Math.atan2(W(t), Math.cos(e)), B(Math.sin(e) / $(t))]
        }, (ua.geo.transverseMercator = function() {
            return An(jn)
        })
        .raw = jn, ua.geom = {}, ua.svg = {}, ua.svg.line = function() {
            return Dn(fe)
        };
    var Fu = ua.map({
        linear: Hn,
        "linear-closed": Fn,
        "step-before": Rn,
        "step-after": On,
        basis: $n,
        "basis-open": Xn,
        "basis-closed": Un,
        bundle: Yn,
        cardinal: In,
        "cardinal-open": zn,
        "cardinal-closed": Pn,
        monotone: Kn
    });
    Fu.forEach(function(t, e) {
        e.key = t, e.closed = /-closed$/.test(t)
    });
    var Ru = [0, 2 / 3, 1 / 3, 0],
        Ou = [0, 1 / 3, 2 / 3, 0],
        zu = [0, 1 / 6, 2 / 3, 1 / 6];
    ua.geom.hull = function(t) {
        function e(t) {
            if (t.length < 3) return [];
            var e, i, o, a, u, s, l, c, f, h, d, p, g = ce(n),
                m = ce(r),
                v = t.length,
                y = v - 1,
                b = [],
                x = [],
                M = 0;
            if (g === qn && r === Ln) e = t;
            else
                for (o = 0, e = []; v > o; ++o) e.push([+g.call(this, i = t[o], o), +m.call(this, i, o)]);
            for (o = 1; v > o; ++o)(e[o][1] < e[M][1] || e[o][1] == e[M][1] && e[o][0] < e[M][0]) && (M = o);
            for (o = 0; v > o; ++o) o !== M && (s = e[o][1] - e[M][1], u = e[o][0] - e[M][0], b.push({
                angle: Math.atan2(s, u),
                index: o
            }));
            for (b.sort(function(t, e) {
                    return t.angle - e.angle
                }), d = b[0].angle, h = b[0].index, f = 0, o = 1; y > o; ++o) {
                if (a = b[o].index, d == b[o].angle) {
                    if (u = e[h][0] - e[M][0], s = e[h][1] - e[M][1], l = e[a][0] - e[M][0], c = e[a][1] - e[M][1], u * u + s * s >= l * l + c * c) {
                        b[o].index = -1;
                        continue
                    }
                    b[f].index = -1
                }
                d = b[o].angle, f = o, h = a
            }
            for (x.push(M), o = 0, a = 0; 2 > o; ++a) b[a].index > -1 && (x.push(b[a].index), o++);
            for (p = x.length; y > a; ++a)
                if (!(b[a].index < 0)) {
                    for (; !tr(x[p - 2], x[p - 1], b[a].index, e);) --p;
                    x[p++] = b[a].index
                }
            var w = [];
            for (o = p - 1; o >= 0; --o) w.push(t[x[o]]);
            return w
        }
        var n = qn,
            r = Ln;
        return arguments.length ? e(t) : (e.x = function(t) {
            return arguments.length ? (n = t, e) : n
        }, e.y = function(t) {
            return arguments.length ? (r = t, e) : r
        }, e)
    }, ua.geom.polygon = function(t) {
        return t.area = function() {
            for (var e = 0, n = t.length, r = t[n - 1][1] * t[0][0] - t[n - 1][0] * t[0][1]; ++e < n;) r += t[e - 1][1] * t[e][0] - t[e - 1][0] * t[e][1];
            return .5 * r
        }, t.centroid = function(e) {
            var n, r, i = -1,
                o = t.length,
                a = 0,
                u = 0,
                s = t[o - 1];
            for (arguments.length || (e = -1 / (6 * t.area())); ++i < o;) n = s, s = t[i], r = n[0] * s[1] - s[0] * n[1], a += (n[0] + s[0]) * r, u += (n[1] + s[1]) * r;
            return [a * e, u * e]
        }, t.clip = function(e) {
            for (var n, r, i, o, a, u, s = -1, l = t.length, c = t[l - 1]; ++s < l;) {
                for (n = e.slice(), e.length = 0, o = t[s], a = n[(i = n.length) - 1], r = -1; ++r < i;) u = n[r], er(u, c, o) ? (er(a, c, o) || e.push(nr(a, u, c, o)), e.push(u)) : er(a, c, o) && e.push(nr(a, u, c, o)), a = u;
                c = o
            }
            return e
        }, t
    }, ua.geom.delaunay = function(t) {
        var e = t.map(function() {
                return []
            }),
            n = [];
        return rr(t, function(n) {
            e[n.region.l.index].push(t[n.region.r.index])
        }), e.forEach(function(e, r) {
            var i = t[r],
                o = i[0],
                a = i[1];
            e.forEach(function(t) {
                t.angle = Math.atan2(t[0] - o, t[1] - a)
            }), e.sort(function(t, e) {
                return t.angle - e.angle
            });
            for (var u = 0, s = e.length - 1; s > u; u++) n.push([i, e[u], e[u + 1]])
        }), n
    }, ua.geom.voronoi = function(t) {
        function e(t) {
            var e, r, a, u = t.map(function() {
                    return []
                }),
                s = ce(i),
                l = ce(o),
                c = t.length,
                f = 1e6;
            if (s === qn && l === Ln) e = t;
            else
                for (e = [], a = 0; c > a; ++a) e.push([+s.call(this, r = t[a], a), +l.call(this, r, a)]);
            if (rr(e, function(t) {
                    var e, n, r, i, o, a;
                    1 === t.a && t.b >= 0 ? (e = t.ep.r, n = t.ep.l) : (e = t.ep.l, n = t.ep.r), 1 === t.a ? (o = e ? e.y : -f, r = t.c - t.b * o, a = n ? n.y : f, i = t.c - t.b * a) : (r = e ? e.x : -f, o = t.c - t.a * r, i = n ? n.x : f, a = t.c - t.a * i);
                    var s = [r, o],
                        l = [i, a];
                    u[t.region.l.index].push(s, l), u[t.region.r.index].push(s, l)
                }), u = u.map(function(t, n) {
                    var r = e[n][0],
                        i = e[n][1],
                        o = t.map(function(t) {
                            return Math.atan2(t[0] - r, t[1] - i)
                        }),
                        a = ua.range(t.length)
                        .sort(function(t, e) {
                            return o[t] - o[e]
                        });
                    return a.filter(function(t, e) {
                            return !e || o[t] - o[a[e - 1]] > Fa
                        })
                        .map(function(e) {
                            return t[e]
                        })
                }), u.forEach(function(t, n) {
                    var r = t.length;
                    if (!r) return t.push([-f, -f], [-f, f], [f, f], [f, -f]);
                    if (!(r > 2)) {
                        var i = e[n],
                            o = t[0],
                            a = t[1],
                            u = i[0],
                            s = i[1],
                            l = o[0],
                            c = o[1],
                            h = a[0],
                            d = a[1],
                            p = Math.abs(h - l),
                            g = d - c;
                        if (Math.abs(g) < Fa) {
                            var m = c > s ? -f : f;
                            t.push([-f, m], [f, m])
                        } else if (Fa > p) {
                            var v = l > u ? -f : f;
                            t.push([v, -f], [v, f])
                        } else {
                            var m = (l - u) * (d - c) > (h - l) * (c - s) ? f : -f,
                                y = Math.abs(g) - p;
                            Math.abs(y) < Fa ? t.push([0 > g ? m : -m, m]) : (y > 0 && (m *= -1), t.push([-f, m], [f, m]))
                        }
                    }
                }), n)
                for (a = 0; c > a; ++a) n(u[a]);
            for (a = 0; c > a; ++a) u[a].point = t[a];
            return u
        }
        var n, r = null,
            i = qn,
            o = Ln;
        return arguments.length ? e(t) : (e.x = function(t) {
            return arguments.length ? (i = t, e) : i
        }, e.y = function(t) {
            return arguments.length ? (o = t, e) : o
        }, e.size = function(t) {
            return arguments.length ? (null == t ? n = null : (r = [+t[0], +t[1]], n = ua.geom.polygon([
                    [0, 0],
                    [0, r[1]], r, [r[0], 0]
                ])
                .clip), e) : r
        }, e.links = function(t) {
            var e, n, r, a = t.map(function() {
                    return []
                }),
                u = [],
                s = ce(i),
                l = ce(o),
                c = t.length;
            if (s === qn && l === Ln) e = t;
            else
                for (r = 0; c > r; ++r) e.push([+s.call(this, n = t[r], r), +l.call(this, n, r)]);
            return rr(e, function(e) {
                var n = e.region.l.index,
                    r = e.region.r.index;
                a[n][r] || (a[n][r] = a[r][n] = !0, u.push({
                    source: t[n],
                    target: t[r]
                }))
            }), u
        }, e.triangles = function(t) {
            if (i === qn && o === Ln) return ua.geom.delaunay(t);
            var e, n, r, a, u, s = ce(i),
                l = ce(o);
            for (a = 0, e = [], u = t.length; u > a; ++a) n = [+s.call(this, r = t[a], a), +l.call(this, r, a)], n.data = r, e.push(n);
            return ua.geom.delaunay(e)
                .map(function(t) {
                    return t.map(function(t) {
                        return t.data
                    })
                })
        }, e)
    };
    var Pu = {
        l: "r",
        r: "l"
    };
    ua.geom.quadtree = function(t, e, n, r, i) {
        function o(t) {
            function o(t, e, n, r, i, o, a, u) {
                if (!isNaN(n) && !isNaN(r))
                    if (t.leaf) {
                        var s = t.x,
                            c = t.y;
                        if (null != s)
                            if (Math.abs(s - n) + Math.abs(c - r) < .01) l(t, e, n, r, i, o, a, u);
                            else {
                                var f = t.point;
                                t.x = t.y = t.point = null, l(t, f, s, c, i, o, a, u), l(t, e, n, r, i, o, a, u)
                            }
                        else t.x = n, t.y = r, t.point = e
                    } else l(t, e, n, r, i, o, a, u)
            }

            function l(t, e, n, r, i, a, u, s) {
                var l = .5 * (i + u),
                    c = .5 * (a + s),
                    f = n >= l,
                    h = r >= c,
                    d = (h << 1) + f;
                t.leaf = !1, t = t.nodes[d] || (t.nodes[d] = ar()), f ? i = l : u = l, h ? a = c : s = c, o(t, e, n, r, i, a, u, s)
            }
            var c, f, h, d, p, g, m, v, y, b = ce(u),
                x = ce(s);
            if (null != e) g = e, m = n, v = r, y = i;
            else if (v = y = -(g = m = 1 / 0), f = [], h = [], p = t.length, a)
                for (d = 0; p > d; ++d) c = t[d], c.x < g && (g = c.x), c.y < m && (m = c.y), c.x > v && (v = c.x), c.y > y && (y = c.y), f.push(c.x), h.push(c.y);
            else
                for (d = 0; p > d; ++d) {
                    var M = +b(c = t[d], d),
                        w = +x(c, d);
                    g > M && (g = M), m > w && (m = w), M > v && (v = M), w > y && (y = w), f.push(M), h.push(w)
                }
            var k = v - g,
                N = y - m;
            k > N ? y = m + k : v = g + N;
            var T = ar();
            if (T.add = function(t) {
                    o(T, t, +b(t, ++d), +x(t, d), g, m, v, y)
                }, T.visit = function(t) {
                    ur(t, T, g, m, v, y)
                }, d = -1, null == e) {
                for (; ++d < p;) o(T, t[d], f[d], h[d], g, m, v, y);
                --d
            } else t.forEach(T.add);
            return f = h = t = c = null, T
        }
        var a, u = qn,
            s = Ln;
        return (a = arguments.length) ? (u = ir, s = or, 3 === a && (i = n, r = e, n = e = 0), o(t)) : (o.x = function(t) {
            return arguments.length ? (u = t, o) : u
        }, o.y = function(t) {
            return arguments.length ? (s = t, o) : s
        }, o.size = function(t) {
            return arguments.length ? (null == t ? e = n = r = i = null : (e = n = 0, r = +t[0], i = +t[1]), o) : null == e ? null : [r, i]
        }, o)
    }, ua.interpolateRgb = sr, ua.transform = function(t) {
        var e = sa.createElementNS(ua.ns.prefix.svg, "g");
        return (ua.transform = function(t) {
            if (null != t) {
                e.setAttribute("transform", t);
                var n = e.transform.baseVal.consolidate()
            }
            return new lr(n ? n.matrix : Iu)
        })(t)
    }, lr.prototype.toString = function() {
        return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")"
    };
    var Iu = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
    };
    ua.interpolateNumber = dr, ua.interpolateTransform = pr, ua.interpolateObject = gr, ua.interpolateString = mr;
    var Bu = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
    ua.interpolate = vr, ua.interpolators = [function(t, e) {
        var n = typeof e;
        return ("string" === n ? Ua.has(e) || /^(#|rgb\(|hsl\()/.test(e) ? sr : mr : e instanceof F ? sr : "object" === n ? Array.isArray(e) ? br : gr : dr)(t, e)
    }], ua.interpolateArray = br;
    var Wu = function() {
            return fe
        },
        $u = ua.map({
            linear: Wu,
            poly: Sr,
            quad: function() {
                return kr
            },
            cubic: function() {
                return Nr
            },
            sin: function() {
                return _r
            },
            exp: function() {
                return Er
            },
            circle: function() {
                return Cr
            },
            elastic: Ar,
            back: jr,
            bounce: function() {
                return Dr
            }
        }),
        Xu = ua.map({
            "in": fe,
            out: Mr,
            "in-out": wr,
            "out-in": function(t) {
                return wr(Mr(t))
            }
        });
    ua.ease = function(t) {
        var e = t.indexOf("-"),
            n = e >= 0 ? t.substring(0, e) : t,
            r = e >= 0 ? t.substring(e + 1) : "in";
        return n = $u.get(n) || Wu, r = Xu.get(r) || fe, xr(r(n.apply(null, Array.prototype.slice.call(arguments, 1))))
    }, ua.interpolateHcl = qr, ua.interpolateHsl = Lr, ua.interpolateLab = Hr, ua.interpolateRound = Fr, ua.layout = {}, ua.layout.bundle = function() {
        return function(t) {
            for (var e = [], n = -1, r = t.length; ++n < r;) e.push(zr(t[n]));
            return e
        }
    }, ua.layout.chord = function() {
        function t() {
            var t, l, f, h, d, p = {},
                g = [],
                m = ua.range(o),
                v = [];
            for (n = [], r = [], t = 0, h = -1; ++h < o;) {
                for (l = 0, d = -1; ++d < o;) l += i[h][d];
                g.push(l), v.push(ua.range(o)), t += l
            }
            for (a && m.sort(function(t, e) {
                    return a(g[t], g[e])
                }), u && v.forEach(function(t, e) {
                    t.sort(function(t, n) {
                        return u(i[e][t], i[e][n])
                    })
                }), t = (2 * Ha - c * o) / t, l = 0, h = -1; ++h < o;) {
                for (f = l, d = -1; ++d < o;) {
                    var y = m[h],
                        b = v[y][d],
                        x = i[y][b],
                        M = l,
                        w = l += x * t;
                    p[y + "-" + b] = {
                        index: y,
                        subindex: b,
                        startAngle: M,
                        endAngle: w,
                        value: x
                    }
                }
                r[y] = {
                    index: y,
                    startAngle: f,
                    endAngle: l,
                    value: (l - f) / t
                }, l += c
            }
            for (h = -1; ++h < o;)
                for (d = h - 1; ++d < o;) {
                    var k = p[h + "-" + d],
                        N = p[d + "-" + h];
                    (k.value || N.value) && n.push(k.value < N.value ? {
                        source: N,
                        target: k
                    } : {
                        source: k,
                        target: N
                    })
                }
            s && e()
        }

        function e() {
            n.sort(function(t, e) {
                return s((t.source.value + t.target.value) / 2, (e.source.value + e.target.value) / 2)
            })
        }
        var n, r, i, o, a, u, s, l = {},
            c = 0;
        return l.matrix = function(t) {
            return arguments.length ? (o = (i = t) && i.length, n = r = null, l) : i
        }, l.padding = function(t) {
            return arguments.length ? (c = t, n = r = null, l) : c
        }, l.sortGroups = function(t) {
            return arguments.length ? (a = t, n = r = null, l) : a
        }, l.sortSubgroups = function(t) {
            return arguments.length ? (u = t, n = null, l) : u
        }, l.sortChords = function(t) {
            return arguments.length ? (s = t, n && e(), l) : s
        }, l.chords = function() {
            return n || t(), n
        }, l.groups = function() {
            return r || t(), r
        }, l
    }, ua.layout.force = function() {
        function t(t) {
            return function(e, n, r, i) {
                if (e.point !== t) {
                    var o = e.cx - t.x,
                        a = e.cy - t.y,
                        u = 1 / Math.sqrt(o * o + a * a);
                    if (g > (i - n) * u) {
                        var s = e.charge * u * u;
                        return t.px -= o * s, t.py -= a * s, !0
                    }
                    if (e.point && isFinite(u)) {
                        var s = e.pointCharge * u * u;
                        t.px -= o * s, t.py -= a * s
                    }
                }
                return !e.charge
            }
        }

        function e(t) {
            t.px = ua.event.x, t.py = ua.event.y, u.resume()
        }
        var n, r, i, o, a, u = {},
            s = ua.dispatch("start", "tick", "end"),
            l = [1, 1],
            c = .9,
            f = Uu,
            h = Yu,
            d = -30,
            p = .1,
            g = .8,
            m = [],
            v = [];
        return u.tick = function() {
            if ((r *= .99) < .005) return s.end({
                type: "end",
                alpha: r = 0
            }), !0;
            var e, n, u, f, h, g, y, b, x, M = m.length,
                w = v.length;
            for (n = 0; w > n; ++n) u = v[n], f = u.source, h = u.target, b = h.x - f.x, x = h.y - f.y, (g = b * b + x * x) && (g = r * o[n] * ((g = Math.sqrt(g)) - i[n]) / g, b *= g, x *= g, h.x -= b * (y = f.weight / (h.weight + f.weight)), h.y -= x * y, f.x += b * (y = 1 - y), f.y += x * y);
            if ((y = r * p) && (b = l[0] / 2, x = l[1] / 2, n = -1, y))
                for (; ++n < M;) u = m[n], u.x += (b - u.x) * y, u.y += (x - u.y) * y;
            if (d)
                for (Ur(e = ua.geom.quadtree(m), r, a), n = -1; ++n < M;)(u = m[n])
                    .fixed || e.visit(t(u));
            for (n = -1; ++n < M;) u = m[n], u.fixed ? (u.x = u.px, u.y = u.py) : (u.x -= (u.px - (u.px = u.x)) * c, u.y -= (u.py - (u.py = u.y)) * c);
            s.tick({
                type: "tick",
                alpha: r
            })
        }, u.nodes = function(t) {
            return arguments.length ? (m = t, u) : m
        }, u.links = function(t) {
            return arguments.length ? (v = t, u) : v
        }, u.size = function(t) {
            return arguments.length ? (l = t, u) : l
        }, u.linkDistance = function(t) {
            return arguments.length ? (f = "function" == typeof t ? t : +t, u) : f
        }, u.distance = u.linkDistance, u.linkStrength = function(t) {
            return arguments.length ? (h = "function" == typeof t ? t : +t, u) : h
        }, u.friction = function(t) {
            return arguments.length ? (c = +t, u) : c
        }, u.charge = function(t) {
            return arguments.length ? (d = "function" == typeof t ? t : +t, u) : d
        }, u.gravity = function(t) {
            return arguments.length ? (p = +t, u) : p
        }, u.theta = function(t) {
            return arguments.length ? (g = +t, u) : g
        }, u.alpha = function(t) {
            return arguments.length ? (t = +t, r ? r = t > 0 ? t : 0 : t > 0 && (s.start({
                type: "start",
                alpha: r = t
            }), ua.timer(u.tick)), u) : r
        }, u.start = function() {
            function t(t, r) {
                for (var i, o = e(n), a = -1, u = o.length; ++a < u;)
                    if (!isNaN(i = o[a][t])) return i;
                return Math.random() * r
            }

            function e() {
                if (!s) {
                    for (s = [], r = 0; p > r; ++r) s[r] = [];
                    for (r = 0; g > r; ++r) {
                        var t = v[r];
                        s[t.source.index].push(t.target), s[t.target.index].push(t.source)
                    }
                }
                return s[n]
            }
            var n, r, s, c, p = m.length,
                g = v.length,
                y = l[0],
                b = l[1];
            for (n = 0; p > n; ++n)(c = m[n])
                .index = n, c.weight = 0;
            for (n = 0; g > n; ++n) c = v[n], "number" == typeof c.source && (c.source = m[c.source]), "number" == typeof c.target && (c.target = m[c.target]), ++c.source.weight, ++c.target.weight;
            for (n = 0; p > n; ++n) c = m[n], isNaN(c.x) && (c.x = t("x", y)), isNaN(c.y) && (c.y = t("y", b)), isNaN(c.px) && (c.px = c.x), isNaN(c.py) && (c.py = c.y);
            if (i = [], "function" == typeof f)
                for (n = 0; g > n; ++n) i[n] = +f.call(this, v[n], n);
            else
                for (n = 0; g > n; ++n) i[n] = f;
            if (o = [], "function" == typeof h)
                for (n = 0; g > n; ++n) o[n] = +h.call(this, v[n], n);
            else
                for (n = 0; g > n; ++n) o[n] = h;
            if (a = [], "function" == typeof d)
                for (n = 0; p > n; ++n) a[n] = +d.call(this, m[n], n);
            else
                for (n = 0; p > n; ++n) a[n] = d;
            return u.resume()
        }, u.resume = function() {
            return u.alpha(.1)
        }, u.stop = function() {
            return u.alpha(0)
        }, u.drag = function() {
            return n || (n = ua.behavior.drag()
                .origin(fe)
                .on("dragstart.force", Br)
                .on("drag.force", e)
                .on("dragend.force", Wr)), arguments.length ? (this.on("mouseover.force", $r)
                .on("mouseout.force", Xr)
                .call(n), void 0) : n
        }, ua.rebind(u, s, "on")
    };
    var Uu = 20,
        Yu = 1;
    ua.layout.hierarchy = function() {
        function t(e, a, u) {
            var s = i.call(n, e, a);
            if (e.depth = a, u.push(e), s && (l = s.length)) {
                for (var l, c, f = -1, h = e.children = [], d = 0, p = a + 1; ++f < l;) c = t(s[f], p, u), c.parent = e, h.push(c), d += c.value;
                r && h.sort(r), o && (e.value = d)
            } else o && (e.value = +o.call(n, e, a) || 0);
            return e
        }

        function e(t, r) {
            var i = t.children,
                a = 0;
            if (i && (u = i.length))
                for (var u, s = -1, l = r + 1; ++s < u;) a += e(i[s], l);
            else o && (a = +o.call(n, t, r) || 0);
            return o && (t.value = a), a
        }

        function n(e) {
            var n = [];
            return t(e, 0, n), n
        }
        var r = Zr,
            i = Vr,
            o = Gr;
        return n.sort = function(t) {
            return arguments.length ? (r = t, n) : r
        }, n.children = function(t) {
            return arguments.length ? (i = t, n) : i
        }, n.value = function(t) {
            return arguments.length ? (o = t, n) : o
        }, n.revalue = function(t) {
            return e(t, 0), t
        }, n
    }, ua.layout.partition = function() {
        function t(e, n, r, i) {
            var o = e.children;
            if (e.x = n, e.y = e.depth * i, e.dx = r, e.dy = i, o && (a = o.length)) {
                var a, u, s, l = -1;
                for (r = e.value ? r / e.value : 0; ++l < a;) t(u = o[l], n, s = u.value * r, i), n += s
            }
        }

        function e(t) {
            var n = t.children,
                r = 0;
            if (n && (i = n.length))
                for (var i, o = -1; ++o < i;) r = Math.max(r, e(n[o]));
            return 1 + r
        }

        function n(n, o) {
            var a = r.call(this, n, o);
            return t(a[0], 0, i[0], i[1] / e(a[0])), a
        }
        var r = ua.layout.hierarchy(),
            i = [1, 1];
        return n.size = function(t) {
            return arguments.length ? (i = t, n) : i
        }, Yr(n, r)
    }, ua.layout.pie = function() {
        function t(o) {
            var a = o.map(function(n, r) {
                    return +e.call(t, n, r)
                }),
                u = +("function" == typeof r ? r.apply(this, arguments) : r),
                s = (("function" == typeof i ? i.apply(this, arguments) : i) - u) / ua.sum(a),
                l = ua.range(o.length);
            null != n && l.sort(n === Vu ? function(t, e) {
                return a[e] - a[t]
            } : function(t, e) {
                return n(o[t], o[e])
            });
            var c = [];
            return l.forEach(function(t) {
                var e;
                c[t] = {
                    data: o[t],
                    value: e = a[t],
                    startAngle: u,
                    endAngle: u += e * s
                }
            }), c
        }
        var e = Number,
            n = Vu,
            r = 0,
            i = 2 * Ha;
        return t.value = function(n) {
            return arguments.length ? (e = n, t) : e
        }, t.sort = function(e) {
            return arguments.length ? (n = e, t) : n
        }, t.startAngle = function(e) {
            return arguments.length ? (r = e, t) : r
        }, t.endAngle = function(e) {
            return arguments.length ? (i = e, t) : i
        }, t
    };
    var Vu = {};
    ua.layout.stack = function() {
        function t(u, s) {
            var l = u.map(function(n, r) {
                    return e.call(t, n, r)
                }),
                c = l.map(function(e) {
                    return e.map(function(e, n) {
                        return [o.call(t, e, n), a.call(t, e, n)]
                    })
                }),
                f = n.call(t, c, s);
            l = ua.permute(l, f), c = ua.permute(c, f);
            var h, d, p, g = r.call(t, c, s),
                m = l.length,
                v = l[0].length;
            for (d = 0; v > d; ++d)
                for (i.call(t, l[0][d], p = g[d], c[0][d][1]), h = 1; m > h; ++h) i.call(t, l[h][d], p += c[h - 1][d][1], c[h][d][1]);
            return u
        }
        var e = fe,
            n = ei,
            r = ni,
            i = ti,
            o = Qr,
            a = Kr;
        return t.values = function(n) {
            return arguments.length ? (e = n, t) : e
        }, t.order = function(e) {
            return arguments.length ? (n = "function" == typeof e ? e : Gu.get(e) || ei, t) : n
        }, t.offset = function(e) {
            return arguments.length ? (r = "function" == typeof e ? e : Zu.get(e) || ni, t) : r
        }, t.x = function(e) {
            return arguments.length ? (o = e, t) : o
        }, t.y = function(e) {
            return arguments.length ? (a = e, t) : a
        }, t.out = function(e) {
            return arguments.length ? (i = e, t) : i
        }, t
    };
    var Gu = ua.map({
            "inside-out": function(t) {
                var e, n, r = t.length,
                    i = t.map(ri),
                    o = t.map(ii),
                    a = ua.range(r)
                    .sort(function(t, e) {
                        return i[t] - i[e]
                    }),
                    u = 0,
                    s = 0,
                    l = [],
                    c = [];
                for (e = 0; r > e; ++e) n = a[e], s > u ? (u += o[n], l.push(n)) : (s += o[n], c.push(n));
                return c.reverse()
                    .concat(l)
            },
            reverse: function(t) {
                return ua.range(t.length)
                    .reverse()
            },
            "default": ei
        }),
        Zu = ua.map({
            silhouette: function(t) {
                var e, n, r, i = t.length,
                    o = t[0].length,
                    a = [],
                    u = 0,
                    s = [];
                for (n = 0; o > n; ++n) {
                    for (e = 0, r = 0; i > e; e++) r += t[e][n][1];
                    r > u && (u = r), a.push(r)
                }
                for (n = 0; o > n; ++n) s[n] = (u - a[n]) / 2;
                return s
            },
            wiggle: function(t) {
                var e, n, r, i, o, a, u, s, l, c = t.length,
                    f = t[0],
                    h = f.length,
                    d = [];
                for (d[0] = s = l = 0, n = 1; h > n; ++n) {
                    for (e = 0, i = 0; c > e; ++e) i += t[e][n][1];
                    for (e = 0, o = 0, u = f[n][0] - f[n - 1][0]; c > e; ++e) {
                        for (r = 0, a = (t[e][n][1] - t[e][n - 1][1]) / (2 * u); e > r; ++r) a += (t[r][n][1] - t[r][n - 1][1]) / u;
                        o += a * t[e][n][1]
                    }
                    d[n] = s -= i ? o / i * u : 0, l > s && (l = s)
                }
                for (n = 0; h > n; ++n) d[n] -= l;
                return d
            },
            expand: function(t) {
                var e, n, r, i = t.length,
                    o = t[0].length,
                    a = 1 / i,
                    u = [];
                for (n = 0; o > n; ++n) {
                    for (e = 0, r = 0; i > e; e++) r += t[e][n][1];
                    if (r)
                        for (e = 0; i > e; e++) t[e][n][1] /= r;
                    else
                        for (e = 0; i > e; e++) t[e][n][1] = a
                }
                for (n = 0; o > n; ++n) u[n] = 0;
                return u
            },
            zero: ni
        });
    ua.layout.histogram = function() {
        function t(t, o) {
            for (var a, u, s = [], l = t.map(n, this), c = r.call(this, l, o), f = i.call(this, c, l, o), o = -1, h = l.length, d = f.length - 1, p = e ? 1 : 1 / h; ++o < d;) a = s[o] = [], a.dx = f[o + 1] - (a.x = f[o]), a.y = 0;
            if (d > 0)
                for (o = -1; ++o < h;) u = l[o], u >= c[0] && u <= c[1] && (a = s[ua.bisect(f, u, 1, d) - 1], a.y += p, a.push(t[o]));
            return s
        }
        var e = !0,
            n = Number,
            r = si,
            i = ai;
        return t.value = function(e) {
            return arguments.length ? (n = e, t) : n
        }, t.range = function(e) {
            return arguments.length ? (r = ce(e), t) : r
        }, t.bins = function(e) {
            return arguments.length ? (i = "number" == typeof e ? function(t) {
                return ui(t, e)
            } : ce(e), t) : i
        }, t.frequency = function(n) {
            return arguments.length ? (e = !!n, t) : e
        }, t
    }, ua.layout.tree = function() {
        function t(t, i) {
            function o(t, e) {
                var r = t.children,
                    i = t._tree;
                if (r && (a = r.length)) {
                    for (var a, s, l, c = r[0], f = c, h = -1; ++h < a;) l = r[h], o(l, s), f = u(l, s, f), s = l;
                    vi(t);
                    var d = .5 * (c._tree.prelim + l._tree.prelim);
                    e ? (i.prelim = e._tree.prelim + n(t, e), i.mod = i.prelim - d) : i.prelim = d
                } else e && (i.prelim = e._tree.prelim + n(t, e))
            }

            function a(t, e) {
                t.x = t._tree.prelim + e;
                var n = t.children;
                if (n && (r = n.length)) {
                    var r, i = -1;
                    for (e += t._tree.mod; ++i < r;) a(n[i], e)
                }
            }

            function u(t, e, r) {
                if (e) {
                    for (var i, o = t, a = t, u = e, s = t.parent.children[0], l = o._tree.mod, c = a._tree.mod, f = u._tree.mod, h = s._tree.mod; u = fi(u), o = ci(o), u && o;) s = ci(s), a = fi(a), a._tree.ancestor = t, i = u._tree.prelim + f - o._tree.prelim - l + n(u, o), i > 0 && (yi(bi(u, t, r), t, i), l += i, c += i), f += u._tree.mod, l += o._tree.mod, h += s._tree.mod, c += a._tree.mod;
                    u && !fi(a) && (a._tree.thread = u, a._tree.mod += f - c), o && !ci(s) && (s._tree.thread = o, s._tree.mod += l - h, r = t)
                }
                return r
            }
            var s = e.call(this, t, i),
                l = s[0];
            mi(l, function(t, e) {
                t._tree = {
                    ancestor: t,
                    prelim: 0,
                    mod: 0,
                    change: 0,
                    shift: 0,
                    number: e ? e._tree.number + 1 : 0
                }
            }), o(l), a(l, -l._tree.prelim);
            var c = hi(l, pi),
                f = hi(l, di),
                h = hi(l, gi),
                d = c.x - n(c, f) / 2,
                p = f.x + n(f, c) / 2,
                g = h.depth || 1;
            return mi(l, function(t) {
                t.x = (t.x - d) / (p - d) * r[0], t.y = t.depth / g * r[1], delete t._tree
            }), s
        }
        var e = ua.layout.hierarchy()
            .sort(null)
            .value(null),
            n = li,
            r = [1, 1];
        return t.separation = function(e) {
            return arguments.length ? (n = e, t) : n
        }, t.size = function(e) {
            return arguments.length ? (r = e, t) : r
        }, Yr(t, e)
    }, ua.layout.pack = function() {
        function t(t, i) {
            var o = e.call(this, t, i),
                a = o[0];
            a.x = 0, a.y = 0, mi(a, function(t) {
                t.r = Math.sqrt(t.value)
            }), mi(a, Ni);
            var u = r[0],
                s = r[1],
                l = Math.max(2 * a.r / u, 2 * a.r / s);
            if (n > 0) {
                var c = n * l / 2;
                mi(a, function(t) {
                    t.r += c
                }), mi(a, Ni), mi(a, function(t) {
                    t.r -= c
                }), l = Math.max(2 * a.r / u, 2 * a.r / s)
            }
            return _i(a, u / 2, s / 2, 1 / l), o
        }
        var e = ua.layout.hierarchy()
            .sort(xi),
            n = 0,
            r = [1, 1];
        return t.size = function(e) {
            return arguments.length ? (r = e, t) : r
        }, t.padding = function(e) {
            return arguments.length ? (n = +e, t) : n
        }, Yr(t, e)
    }, ua.layout.cluster = function() {
        function t(t, i) {
            var o, a = e.call(this, t, i),
                u = a[0],
                s = 0;
            mi(u, function(t) {
                var e = t.children;
                e && e.length ? (t.x = Ai(e), t.y = Ci(e)) : (t.x = o ? s += n(t, o) : 0, t.y = 0, o = t)
            });
            var l = ji(u),
                c = Di(u),
                f = l.x - n(l, c) / 2,
                h = c.x + n(c, l) / 2;
            return mi(u, function(t) {
                t.x = (t.x - f) / (h - f) * r[0], t.y = (1 - (u.y ? t.y / u.y : 1)) * r[1]
            }), a
        }
        var e = ua.layout.hierarchy()
            .sort(null)
            .value(null),
            n = li,
            r = [1, 1];
        return t.separation = function(e) {
            return arguments.length ? (n = e, t) : n
        }, t.size = function(e) {
            return arguments.length ? (r = e, t) : r
        }, Yr(t, e)
    }, ua.layout.treemap = function() {
        function t(t, e) {
            for (var n, r, i = -1, o = t.length; ++i < o;) r = (n = t[i])
                .value * (0 > e ? 0 : e), n.area = isNaN(r) || 0 >= r ? 0 : r
        }

        function e(n) {
            var o = n.children;
            if (o && o.length) {
                var a, u, s, l = f(n),
                    c = [],
                    h = o.slice(),
                    p = 1 / 0,
                    g = "slice" === d ? l.dx : "dice" === d ? l.dy : "slice-dice" === d ? 1 & n.depth ? l.dy : l.dx : Math.min(l.dx, l.dy);
                for (t(h, l.dx * l.dy / n.value), c.area = 0;
                    (s = h.length) > 0;) c.push(a = h[s - 1]), c.area += a.area, "squarify" !== d || (u = r(c, g)) <= p ? (h.pop(), p = u) : (c.area -= c.pop()
                    .area, i(c, g, l, !1), g = Math.min(l.dx, l.dy), c.length = c.area = 0, p = 1 / 0);
                c.length && (i(c, g, l, !0), c.length = c.area = 0), o.forEach(e)
            }
        }

        function n(e) {
            var r = e.children;
            if (r && r.length) {
                var o, a = f(e),
                    u = r.slice(),
                    s = [];
                for (t(u, a.dx * a.dy / e.value), s.area = 0; o = u.pop();) s.push(o), s.area += o.area, null != o.z && (i(s, o.z ? a.dx : a.dy, a, !u.length), s.length = s.area = 0);
                r.forEach(n)
            }
        }

        function r(t, e) {
            for (var n, r = t.area, i = 0, o = 1 / 0, a = -1, u = t.length; ++a < u;)(n = t[a].area) && (o > n && (o = n), n > i && (i = n));
            return r *= r, e *= e, r ? Math.max(e * i * p / r, r / (e * o * p)) : 1 / 0
        }

        function i(t, e, n, r) {
            var i, o = -1,
                a = t.length,
                u = n.x,
                l = n.y,
                c = e ? s(t.area / e) : 0;
            if (e == n.dx) {
                for ((r || c > n.dy) && (c = n.dy); ++o < a;) i = t[o], i.x = u, i.y = l, i.dy = c, u += i.dx = Math.min(n.x + n.dx - u, c ? s(i.area / c) : 0);
                i.z = !0, i.dx += n.x + n.dx - u, n.y += c, n.dy -= c
            } else {
                for ((r || c > n.dx) && (c = n.dx); ++o < a;) i = t[o], i.x = u, i.y = l, i.dx = c, l += i.dy = Math.min(n.y + n.dy - l, c ? s(i.area / c) : 0);
                i.z = !1, i.dy += n.y + n.dy - l, n.x += c, n.dx -= c
            }
        }

        function o(r) {
            var i = a || u(r),
                o = i[0];
            return o.x = 0, o.y = 0, o.dx = l[0], o.dy = l[1], a && u.revalue(o), t([o], o.dx * o.dy / o.value), (a ? n : e)(o), h && (a = i), i
        }
        var a, u = ua.layout.hierarchy(),
            s = Math.round,
            l = [1, 1],
            c = null,
            f = qi,
            h = !1,
            d = "squarify",
            p = .5 * (1 + Math.sqrt(5));
        return o.size = function(t) {
            return arguments.length ? (l = t, o) : l
        }, o.padding = function(t) {
            function e(e) {
                var n = t.call(o, e, e.depth);
                return null == n ? qi(e) : Li(e, "number" == typeof n ? [n, n, n, n] : n)
            }

            function n(e) {
                return Li(e, t)
            }
            if (!arguments.length) return c;
            var r;
            return f = null == (c = t) ? qi : "function" == (r = typeof t) ? e : "number" === r ? (t = [t, t, t, t], n) : n, o
        }, o.round = function(t) {
            return arguments.length ? (s = t ? Math.round : Number, o) : s != Number
        }, o.sticky = function(t) {
            return arguments.length ? (h = t, a = null, o) : h
        }, o.ratio = function(t) {
            return arguments.length ? (p = t, o) : p
        }, o.mode = function(t) {
            return arguments.length ? (d = t + "", o) : d
        }, Yr(o, u)
    }, ua.random = {
        normal: function(t, e) {
            var n = arguments.length;
            return 2 > n && (e = 1), 1 > n && (t = 0),
                function() {
                    var n, r, i;
                    do n = 2 * Math.random() - 1, r = 2 * Math.random() - 1, i = n * n + r * r; while (!i || i > 1);
                    return t + e * n * Math.sqrt(-2 * Math.log(i) / i)
                }
        },
        logNormal: function() {
            var t = ua.random.normal.apply(ua, arguments);
            return function() {
                return Math.exp(t())
            }
        },
        irwinHall: function(t) {
            return function() {
                for (var e = 0, n = 0; t > n; n++) e += Math.random();
                return e / t
            }
        }
    }, ua.scale = {}, ua.scale.linear = function() {
        return Pi([0, 1], [0, 1], vr, !1)
    }, ua.scale.log = function() {
        return Ui(ua.scale.linear()
            .domain([0, Math.LN10]), 10, Yi, Vi, [1, 10])
    };
    var Ju = ua.format(".0e");
    ua.scale.pow = function() {
        return Ji(ua.scale.linear(), 1, [0, 1])
    }, ua.scale.sqrt = function() {
        return ua.scale.pow()
            .exponent(.5)
    }, ua.scale.ordinal = function() {
        return Ki([], {
            t: "range",
            a: [
                []
            ]
        })
    }, ua.scale.category10 = function() {
        return ua.scale.ordinal()
            .range(Qu)
    }, ua.scale.category20 = function() {
        return ua.scale.ordinal()
            .range(Ku)
    }, ua.scale.category20b = function() {
        return ua.scale.ordinal()
            .range(ts)
    }, ua.scale.category20c = function() {
        return ua.scale.ordinal()
            .range(es)
    };
    var Qu = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        Ku = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
        ts = ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"],
        es = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
    ua.scale.quantile = function() {
        return to([], [])
    }, ua.scale.quantize = function() {
        return eo(0, 1, [0, 1])
    }, ua.scale.threshold = function() {
        return no([.5], [0, 1])
    }, ua.scale.identity = function() {
        return ro([0, 1])
    }, ua.svg.arc = function() {
        function t() {
            var t = e.apply(this, arguments),
                o = n.apply(this, arguments),
                a = r.apply(this, arguments) + ns,
                u = i.apply(this, arguments) + ns,
                s = (a > u && (s = a, a = u, u = s), u - a),
                l = Ha > s ? "0" : "1",
                c = Math.cos(a),
                f = Math.sin(a),
                h = Math.cos(u),
                d = Math.sin(u);
            return s >= rs ? t ? "M0," + o + "A" + o + "," + o + " 0 1,1 0," + -o + "A" + o + "," + o + " 0 1,1 0," + o + "M0," + t + "A" + t + "," + t + " 0 1,0 0," + -t + "A" + t + "," + t + " 0 1,0 0," + t + "Z" : "M0," + o + "A" + o + "," + o + " 0 1,1 0," + -o + "A" + o + "," + o + " 0 1,1 0," + o + "Z" : t ? "M" + o * c + "," + o * f + "A" + o + "," + o + " 0 " + l + ",1 " + o * h + "," + o * d + "L" + t * h + "," + t * d + "A" + t + "," + t + " 0 " + l + ",0 " + t * c + "," + t * f + "Z" : "M" + o * c + "," + o * f + "A" + o + "," + o + " 0 " + l + ",1 " + o * h + "," + o * d + "L0,0" + "Z"
        }
        var e = io,
            n = oo,
            r = ao,
            i = uo;
        return t.innerRadius = function(n) {
            return arguments.length ? (e = ce(n), t) : e
        }, t.outerRadius = function(e) {
            return arguments.length ? (n = ce(e), t) : n
        }, t.startAngle = function(e) {
            return arguments.length ? (r = ce(e), t) : r
        }, t.endAngle = function(e) {
            return arguments.length ? (i = ce(e), t) : i
        }, t.centroid = function() {
            var t = (e.apply(this, arguments) + n.apply(this, arguments)) / 2,
                o = (r.apply(this, arguments) + i.apply(this, arguments)) / 2 + ns;
            return [Math.cos(o) * t, Math.sin(o) * t]
        }, t
    };
    var ns = -Ha / 2,
        rs = 2 * Ha - 1e-6;
    ua.svg.line.radial = function() {
        var t = Dn(so);
        return t.radius = t.x, delete t.x, t.angle = t.y, delete t.y, t
    }, Rn.reverse = On, On.reverse = Rn, ua.svg.area = function() {
        return lo(fe)
    }, ua.svg.area.radial = function() {
        var t = lo(so);
        return t.radius = t.x, delete t.x, t.innerRadius = t.x0, delete t.x0, t.outerRadius = t.x1, delete t.x1, t.angle = t.y, delete t.y, t.startAngle = t.y0, delete t.y0, t.endAngle = t.y1, delete t.y1, t
    }, ua.svg.chord = function() {
        function t(t, u) {
            var s = e(this, o, t, u),
                l = e(this, a, t, u);
            return "M" + s.p0 + r(s.r, s.p1, s.a1 - s.a0) + (n(s, l) ? i(s.r, s.p1, s.r, s.p0) : i(s.r, s.p1, l.r, l.p0) + r(l.r, l.p1, l.a1 - l.a0) + i(l.r, l.p1, s.r, s.p0)) + "Z"
        }

        function e(t, e, n, r) {
            var i = e.call(t, n, r),
                o = u.call(t, i, r),
                a = s.call(t, i, r) + ns,
                c = l.call(t, i, r) + ns;
            return {
                r: o,
                a0: a,
                a1: c,
                p0: [o * Math.cos(a), o * Math.sin(a)],
                p1: [o * Math.cos(c), o * Math.sin(c)]
            }
        }

        function n(t, e) {
            return t.a0 == e.a0 && t.a1 == e.a1
        }

        function r(t, e, n) {
            return "A" + t + "," + t + " 0 " + +(n > Ha) + ",1 " + e
        }

        function i(t, e, n, r) {
            return "Q 0,0 " + r
        }
        var o = cn,
            a = fn,
            u = co,
            s = ao,
            l = uo;
        return t.radius = function(e) {
            return arguments.length ? (u = ce(e), t) : u
        }, t.source = function(e) {
            return arguments.length ? (o = ce(e), t) : o
        }, t.target = function(e) {
            return arguments.length ? (a = ce(e), t) : a
        }, t.startAngle = function(e) {
            return arguments.length ? (s = ce(e), t) : s
        }, t.endAngle = function(e) {
            return arguments.length ? (l = ce(e), t) : l
        }, t
    }, ua.svg.diagonal = function() {
        function t(t, i) {
            var o = e.call(this, t, i),
                a = n.call(this, t, i),
                u = (o.y + a.y) / 2,
                s = [o, {
                    x: o.x,
                    y: u
                }, {
                    x: a.x,
                    y: u
                }, a];
            return s = s.map(r), "M" + s[0] + "C" + s[1] + " " + s[2] + " " + s[3]
        }
        var e = cn,
            n = fn,
            r = fo;
        return t.source = function(n) {
            return arguments.length ? (e = ce(n), t) : e
        }, t.target = function(e) {
            return arguments.length ? (n = ce(e), t) : n
        }, t.projection = function(e) {
            return arguments.length ? (r = e, t) : r
        }, t
    }, ua.svg.diagonal.radial = function() {
        var t = ua.svg.diagonal(),
            e = fo,
            n = t.projection;
        return t.projection = function(t) {
            return arguments.length ? n(ho(e = t)) : e
        }, t
    }, ua.svg.symbol = function() {
        function t(t, r) {
            return (is.get(e.call(this, t, r)) || mo)(n.call(this, t, r))
        }
        var e = go,
            n = po;
        return t.type = function(n) {
            return arguments.length ? (e = ce(n), t) : e
        }, t.size = function(e) {
            return arguments.length ? (n = ce(e), t) : n
        }, t
    };
    var is = ua.map({
        circle: mo,
        cross: function(t) {
            var e = Math.sqrt(t / 5) / 2;
            return "M" + -3 * e + "," + -e + "H" + -e + "V" + -3 * e + "H" + e + "V" + -e + "H" + 3 * e + "V" + e + "H" + e + "V" + 3 * e + "H" + -e + "V" + e + "H" + -3 * e + "Z"
        },
        diamond: function(t) {
            var e = Math.sqrt(t / (2 * us)),
                n = e * us;
            return "M0," + -e + "L" + n + ",0" + " 0," + e + " " + -n + ",0" + "Z"
        },
        square: function(t) {
            var e = Math.sqrt(t) / 2;
            return "M" + -e + "," + -e + "L" + e + "," + -e + " " + e + "," + e + " " + -e + "," + e + "Z"
        },
        "triangle-down": function(t) {
            var e = Math.sqrt(t / as),
                n = e * as / 2;
            return "M0," + n + "L" + e + "," + -n + " " + -e + "," + -n + "Z"
        },
        "triangle-up": function(t) {
            var e = Math.sqrt(t / as),
                n = e * as / 2;
            return "M0," + -n + "L" + e + "," + n + " " + -e + "," + n + "Z"
        }
    });
    ua.svg.symbolTypes = is.keys();
    var os, as = Math.sqrt(3),
        us = Math.tan(30 * Ra),
        ss = [],
        ls = 0,
        cs = {
            ease: Tr,
            delay: 0,
            duration: 250
        };
    ss.call = Ta.call, ss.empty = Ta.empty, ss.node = Ta.node, ua.transition = function(t) {
        return arguments.length ? os ? t.transition() : t : Aa.transition()
    }, ua.transition.prototype = ss, ss.select = function(t) {
        var e, n, r, i = this.id,
            o = [];
        "function" != typeof t && (t = v(t));
        for (var a = -1, u = this.length; ++a < u;) {
            o.push(e = []);
            for (var s = this[a], l = -1, c = s.length; ++l < c;)(r = s[l]) && (n = t.call(r, r.__data__, l)) ? ("__data__" in r && (n.__data__ = r.__data__), xo(n, l, i, r.__transition__[i]), e.push(n)) : e.push(null)
        }
        return vo(o, i)
    }, ss.selectAll = function(t) {
        var e, n, r, i, o, a = this.id,
            u = [];
        "function" != typeof t && (t = y(t));
        for (var s = -1, l = this.length; ++s < l;)
            for (var c = this[s], f = -1, h = c.length; ++f < h;)
                if (r = c[f]) {
                    o = r.__transition__[a], n = t.call(r, r.__data__, f), u.push(e = []);
                    for (var d = -1, p = n.length; ++d < p;) xo(i = n[d], d, a, o), e.push(i)
                }
        return vo(u, a)
    }, ss.filter = function(t) {
        var e, n, r, i = [];
        "function" != typeof t && (t = E(t));
        for (var o = 0, a = this.length; a > o; o++) {
            i.push(e = []);
            for (var n = this[o], u = 0, s = n.length; s > u; u++)(r = n[u]) && t.call(r, r.__data__, u) && e.push(r)
        }
        return vo(i, this.id, this.time)
            .ease(this.ease())
    }, ss.tween = function(t, e) {
        var n = this.id;
        return arguments.length < 2 ? this.node()
            .__transition__[n].tween.get(t) : L(this, null == e ? function(e) {
                e.__transition__[n].tween.remove(t)
            } : function(r) {
                r.__transition__[n].tween.set(t, e)
            })
    }, ss.attr = function(t, e) {
        function n() {
            this.removeAttribute(u)
        }

        function r() {
            this.removeAttributeNS(u.space, u.local)
        }

        function i(t) {
            return null == t ? n : (t += "", function() {
                var e, n = this.getAttribute(u);
                return n !== t && (e = a(n, t), function(t) {
                    this.setAttribute(u, e(t))
                })
            })
        }

        function o(t) {
            return null == t ? r : (t += "", function() {
                var e, n = this.getAttributeNS(u.space, u.local);
                return n !== t && (e = a(n, t), function(t) {
                    this.setAttributeNS(u.space, u.local, e(t))
                })
            })
        }
        if (arguments.length < 2) {
            for (e in t) this.attr(e, t[e]);
            return this
        }
        var a = yr(t),
            u = ua.ns.qualify(t);
        return yo(this, "attr." + t, e, u.local ? o : i)
    }, ss.attrTween = function(t, e) {
        function n(t, n) {
            var r = e.call(this, t, n, this.getAttribute(i));
            return r && function(t) {
                this.setAttribute(i, r(t))
            }
        }

        function r(t, n) {
            var r = e.call(this, t, n, this.getAttributeNS(i.space, i.local));
            return r && function(t) {
                this.setAttributeNS(i.space, i.local, r(t))
            }
        }
        var i = ua.ns.qualify(t);
        return this.tween("attr." + t, i.local ? r : n)
    }, ss.style = function(t, e, n) {
        function r() {
            this.style.removeProperty(t)
        }

        function i(e) {
            return null == e ? r : (e += "", function() {
                var r, i = la.getComputedStyle(this, null)
                    .getPropertyValue(t);
                return i !== e && (r = a(i, e), function(e) {
                    this.style.setProperty(t, r(e), n)
                })
            })
        }
        var o = arguments.length;
        if (3 > o) {
            if ("string" != typeof t) {
                2 > o && (e = "");
                for (n in t) this.style(n, t[n], e);
                return this
            }
            n = ""
        }
        var a = yr(t);
        return yo(this, "style." + t, e, i)
    }, ss.styleTween = function(t, e, n) {
        function r(r, i) {
            var o = e.call(this, r, i, la.getComputedStyle(this, null)
                .getPropertyValue(t));
            return o && function(e) {
                this.style.setProperty(t, o(e), n)
            }
        }
        return arguments.length < 3 && (n = ""), this.tween("style." + t, r)
    }, ss.text = function(t) {
        return yo(this, "text", t, bo)
    }, ss.remove = function() {
        return this.each("end.transition", function() {
            var t;
            !this.__transition__ && (t = this.parentNode) && t.removeChild(this)
        })
    }, ss.ease = function(t) {
        var e = this.id;
        return arguments.length < 1 ? this.node()
            .__transition__[e].ease : ("function" != typeof t && (t = ua.ease.apply(ua, arguments)), L(this, function(n) {
                n.__transition__[e].ease = t
            }))
    }, ss.delay = function(t) {
        var e = this.id;
        return L(this, "function" == typeof t ? function(n, r, i) {
            n.__transition__[e].delay = 0 | t.call(n, n.__data__, r, i)
        } : (t |= 0, function(n) {
            n.__transition__[e].delay = t
        }))
    }, ss.duration = function(t) {
        var e = this.id;
        return L(this, "function" == typeof t ? function(n, r, i) {
            n.__transition__[e].duration = Math.max(1, 0 | t.call(n, n.__data__, r, i))
        } : (t = Math.max(1, 0 | t), function(n) {
            n.__transition__[e].duration = t
        }))
    }, ss.each = function(t, e) {
        var n = this.id;
        if (arguments.length < 2) {
            var r = cs,
                i = os;
            os = n, L(this, function(e, r, i) {
                cs = e.__transition__[n], t.call(e, e.__data__, r, i)
            }), cs = r, os = i
        } else L(this, function(r) {
            r.__transition__[n].event.on(t, e)
        });
        return this
    }, ss.transition = function() {
        for (var t, e, n, r, i = this.id, o = ++ls, a = [], u = 0, s = this.length; s > u; u++) {
            a.push(t = []);
            for (var e = this[u], l = 0, c = e.length; c > l; l++)(n = e[l]) && (r = Object.create(n.__transition__[i]), r.delay += r.duration, xo(n, l, o, r)), t.push(n)
        }
        return vo(a, o)
    }, ua.svg.axis = function() {
        function t(t) {
            t.each(function() {
                var t, f = ua.select(this),
                    h = null == l ? n.ticks ? n.ticks.apply(n, s) : n.domain() : l,
                    d = null == e ? n.tickFormat ? n.tickFormat.apply(n, s) : String : e,
                    p = ko(n, h, c),
                    g = f.selectAll(".tick.minor")
                    .data(p, String),
                    m = g.enter()
                    .insert("line", ".tick")
                    .attr("class", "tick minor")
                    .style("opacity", 1e-6),
                    v = ua.transition(g.exit())
                    .style("opacity", 1e-6)
                    .remove(),
                    y = ua.transition(g)
                    .style("opacity", 1),
                    b = f.selectAll(".tick.major")
                    .data(h, String),
                    x = b.enter()
                    .insert("g", "path")
                    .attr("class", "tick major")
                    .style("opacity", 1e-6),
                    M = ua.transition(b.exit())
                    .style("opacity", 1e-6)
                    .remove(),
                    w = ua.transition(b)
                    .style("opacity", 1),
                    k = Fi(n),
                    N = f.selectAll(".domain")
                    .data([0]),
                    T = (N.enter()
                        .append("path")
                        .attr("class", "domain"), ua.transition(N)),
                    S = n.copy(),
                    _ = this.__chart__ || S;
                this.__chart__ = S, x.append("line"), x.append("text");
                var E = x.select("line"),
                    C = w.select("line"),
                    A = b.select("text")
                    .text(d),
                    j = x.select("text"),
                    D = w.select("text");
                switch (r) {
                    case "bottom":
                        t = Mo, m.attr("y2", o), y.attr("x2", 0)
                            .attr("y2", o), E.attr("y2", i), j.attr("y", Math.max(i, 0) + u), C.attr("x2", 0)
                            .attr("y2", i), D.attr("x", 0)
                            .attr("y", Math.max(i, 0) + u), A.attr("dy", ".71em")
                            .style("text-anchor", "middle"), T.attr("d", "M" + k[0] + "," + a + "V0H" + k[1] + "V" + a);
                        break;
                    case "top":
                        t = Mo, m.attr("y2", -o), y.attr("x2", 0)
                            .attr("y2", -o), E.attr("y2", -i), j.attr("y", -(Math.max(i, 0) + u)), C.attr("x2", 0)
                            .attr("y2", -i), D.attr("x", 0)
                            .attr("y", -(Math.max(i, 0) + u)), A.attr("dy", "0em")
                            .style("text-anchor", "middle"), T.attr("d", "M" + k[0] + "," + -a + "V0H" + k[1] + "V" + -a);
                        break;
                    case "left":
                        t = wo, m.attr("x2", -o), y.attr("x2", -o)
                            .attr("y2", 0), E.attr("x2", -i), j.attr("x", -(Math.max(i, 0) + u)), C.attr("x2", -i)
                            .attr("y2", 0), D.attr("x", -(Math.max(i, 0) + u))
                            .attr("y", 0), A.attr("dy", ".32em")
                            .style("text-anchor", "end"), T.attr("d", "M" + -a + "," + k[0] + "H0V" + k[1] + "H" + -a);
                        break;
                    case "right":
                        t = wo, m.attr("x2", o), y.attr("x2", o)
                            .attr("y2", 0), E.attr("x2", i), j.attr("x", Math.max(i, 0) + u), C.attr("x2", i)
                            .attr("y2", 0), D.attr("x", Math.max(i, 0) + u)
                            .attr("y", 0), A.attr("dy", ".32em")
                            .style("text-anchor", "start"), T.attr("d", "M" + a + "," + k[0] + "H0V" + k[1] + "H" + a)
                }
                if (n.ticks) x.call(t, _), w.call(t, S), M.call(t, S), m.call(t, _), y.call(t, S), v.call(t, S);
                else {
                    var q = S.rangeBand() / 2,
                        L = function(t) {
                            return S(t) + q
                        };
                    x.call(t, L), w.call(t, L)
                }
            })
        }
        var e, n = ua.scale.linear(),
            r = fs,
            i = 6,
            o = 6,
            a = 6,
            u = 3,
            s = [10],
            l = null,
            c = 0;
        return t.scale = function(e) {
            return arguments.length ? (n = e, t) : n
        }, t.orient = function(e) {
            return arguments.length ? (r = e in hs ? e + "" : fs, t) : r
        }, t.ticks = function() {
            return arguments.length ? (s = arguments, t) : s
        }, t.tickValues = function(e) {
            return arguments.length ? (l = e, t) : l
        }, t.tickFormat = function(n) {
            return arguments.length ? (e = n, t) : e
        }, t.tickSize = function(e, n) {
            if (!arguments.length) return i;
            var r = arguments.length - 1;
            return i = +e, o = r > 1 ? +n : i, a = r > 0 ? +arguments[r] : i, t
        }, t.tickPadding = function(e) {
            return arguments.length ? (u = +e, t) : u
        }, t.tickSubdivide = function(e) {
            return arguments.length ? (c = +e, t) : c
        }, t
    };
    var fs = "bottom",
        hs = {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        };
    ua.svg.brush = function() {
        function t(o) {
            o.each(function() {
                var o, a = ua.select(this),
                    l = a.selectAll(".background")
                    .data([0]),
                    f = a.selectAll(".extent")
                    .data([0]),
                    h = a.selectAll(".resize")
                    .data(c, String);
                a.style("pointer-events", "all")
                    .on("mousedown.brush", i)
                    .on("touchstart.brush", i), l.enter()
                    .append("rect")
                    .attr("class", "background")
                    .style("visibility", "hidden")
                    .style("cursor", "crosshair"), f.enter()
                    .append("rect")
                    .attr("class", "extent")
                    .style("cursor", "move"), h.enter()
                    .append("g")
                    .attr("class", function(t) {
                        return "resize " + t
                    })
                    .style("cursor", function(t) {
                        return ds[t]
                    })
                    .append("rect")
                    .attr("x", function(t) {
                        return /[ew]$/.test(t) ? -3 : null
                    })
                    .attr("y", function(t) {
                        return /^[ns]/.test(t) ? -3 : null
                    })
                    .attr("width", 6)
                    .attr("height", 6)
                    .style("visibility", "hidden"), h.style("display", t.empty() ? "none" : null), h.exit()
                    .remove(), u && (o = Fi(u), l.attr("x", o[0])
                        .attr("width", o[1] - o[0]), n(a)), s && (o = Fi(s), l.attr("y", o[0])
                        .attr("height", o[1] - o[0]), r(a)), e(a)
            })
        }

        function e(t) {
            t.selectAll(".resize")
                .attr("transform", function(t) {
                    return "translate(" + f[+/e$/.test(t)][0] + "," + f[+/^s/.test(t)][1] + ")"
                })
        }

        function n(t) {
            t.select(".extent")
                .attr("x", f[0][0]), t.selectAll(".extent,.n>rect,.s>rect")
                .attr("width", f[1][0] - f[0][0])
        }

        function r(t) {
            t.select(".extent")
                .attr("y", f[0][1]), t.selectAll(".extent,.e>rect,.w>rect")
                .attr("height", f[1][1] - f[0][1])
        }

        function i() {
            function i() {
                var t = ua.event.changedTouches;
                return t ? ua.touches(y, t)[0] : ua.mouse(y)
            }

            function c() {
                32 == ua.event.keyCode && (T || (m = null, S[0] -= f[1][0], S[1] -= f[1][1], T = 2), l())
            }

            function h() {
                32 == ua.event.keyCode && 2 == T && (S[0] += f[1][0], S[1] += f[1][1], T = 0, l())
            }

            function d() {
                var t = i(),
                    o = !1;
                v && (t[0] += v[0], t[1] += v[1]), T || (ua.event.altKey ? (m || (m = [(f[0][0] + f[1][0]) / 2, (f[0][1] + f[1][1]) / 2]), S[0] = f[+(t[0] < m[0])][0], S[1] = f[+(t[1] < m[1])][1]) : m = null), k && p(t, u, 0) && (n(M), o = !0), N && p(t, s, 1) && (r(M), o = !0), o && (e(M), x({
                    type: "brush",
                    mode: T ? "move" : "resize"
                }))
            }

            function p(t, e, n) {
                var r, i, a = Fi(e),
                    u = a[0],
                    s = a[1],
                    l = S[n],
                    c = f[1][n] - f[0][n];
                return T && (u -= l, s -= c + l), r = Math.max(u, Math.min(s, t[n])), T ? i = (r += l) + c : (m && (l = Math.max(u, Math.min(s, 2 * m[n] - r))), r > l ? (i = r, r = l) : i = l), f[0][n] !== r || f[1][n] !== i ? (o = null, f[0][n] = r, f[1][n] = i, !0) : void 0
            }

            function g() {
                d(), M.style("pointer-events", "all")
                    .selectAll(".resize")
                    .style("display", t.empty() ? "none" : null), ua.select("body")
                    .style("cursor", null), _.on("mousemove.brush", null)
                    .on("mouseup.brush", null)
                    .on("touchmove.brush", null)
                    .on("touchend.brush", null)
                    .on("keydown.brush", null)
                    .on("keyup.brush", null), x({
                        type: "brushend"
                    }), l()
            }
            var m, v, y = this,
                b = ua.select(ua.event.target),
                x = a.of(y, arguments),
                M = ua.select(y),
                w = b.datum(),
                k = !/^(n|s)$/.test(w) && u,
                N = !/^(e|w)$/.test(w) && s,
                T = b.classed("extent"),
                S = i(),
                _ = ua.select(la)
                .on("mousemove.brush", d)
                .on("mouseup.brush", g)
                .on("touchmove.brush", d)
                .on("touchend.brush", g)
                .on("keydown.brush", c)
                .on("keyup.brush", h);
            if (T) S[0] = f[0][0] - S[0], S[1] = f[0][1] - S[1];
            else if (w) {
                var E = +/w$/.test(w),
                    C = +/^n/.test(w);
                v = [f[1 - E][0] - S[0], f[1 - C][1] - S[1]], S[0] = f[E][0], S[1] = f[C][1]
            } else ua.event.altKey && (m = S.slice());
            M.style("pointer-events", "none")
                .selectAll(".resize")
                .style("display", null), ua.select("body")
                .style("cursor", b.style("cursor")), x({
                    type: "brushstart"
                }), d(), l()
        }
        var o, a = h(t, "brushstart", "brush", "brushend"),
            u = null,
            s = null,
            c = ps[0],
            f = [
                [0, 0],
                [0, 0]
            ];
        return t.x = function(e) {
            return arguments.length ? (u = e, c = ps[!u << 1 | !s], t) : u
        }, t.y = function(e) {
            return arguments.length ? (s = e, c = ps[!u << 1 | !s], t) : s
        }, t.extent = function(e) {
            var n, r, i, a, l;
            return arguments.length ? (o = [
                [0, 0],
                [0, 0]
            ], u && (n = e[0], r = e[1], s && (n = n[0], r = r[0]), o[0][0] = n, o[1][0] = r, u.invert && (n = u(n), r = u(r)), n > r && (l = n, n = r, r = l), f[0][0] = 0 | n, f[1][0] = 0 | r), s && (i = e[0], a = e[1], u && (i = i[1], a = a[1]), o[0][1] = i, o[1][1] = a, s.invert && (i = s(i), a = s(a)), i > a && (l = i, i = a, a = l), f[0][1] = 0 | i, f[1][1] = 0 | a), t) : (e = o || f, u && (n = e[0][0], r = e[1][0], o || (n = f[0][0], r = f[1][0], u.invert && (n = u.invert(n), r = u.invert(r)), n > r && (l = n, n = r, r = l))), s && (i = e[0][1], a = e[1][1], o || (i = f[0][1], a = f[1][1], s.invert && (i = s.invert(i), a = s.invert(a)), i > a && (l = i, i = a, a = l))), u && s ? [
                [n, i],
                [r, a]
            ] : u ? [n, r] : s && [i, a])
        }, t.clear = function() {
            return o = null, f[0][0] = f[0][1] = f[1][0] = f[1][1] = 0, t
        }, t.empty = function() {
            return u && f[0][0] === f[1][0] || s && f[0][1] === f[1][1]
        }, ua.rebind(t, a, "on")
    };
    var ds = {
            n: "ns-resize",
            e: "ew-resize",
            s: "ns-resize",
            w: "ew-resize",
            nw: "nwse-resize",
            ne: "nesw-resize",
            se: "nwse-resize",
            sw: "nesw-resize"
        },
        ps = [
            ["n", "e", "s", "w", "nw", "ne", "se", "sw"],
            ["e", "w"],
            ["n", "s"],
            []
        ];
    ua.time = {};
    var gs = Date,
        ms = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    No.prototype = {
        getDate: function() {
            return this._.getUTCDate()
        },
        getDay: function() {
            return this._.getUTCDay()
        },
        getFullYear: function() {
            return this._.getUTCFullYear()
        },
        getHours: function() {
            return this._.getUTCHours()
        },
        getMilliseconds: function() {
            return this._.getUTCMilliseconds()
        },
        getMinutes: function() {
            return this._.getUTCMinutes()
        },
        getMonth: function() {
            return this._.getUTCMonth()
        },
        getSeconds: function() {
            return this._.getUTCSeconds()
        },
        getTime: function() {
            return this._.getTime()
        },
        getTimezoneOffset: function() {
            return 0
        },
        valueOf: function() {
            return this._.valueOf()
        },
        setDate: function() {
            vs.setUTCDate.apply(this._, arguments)
        },
        setDay: function() {
            vs.setUTCDay.apply(this._, arguments)
        },
        setFullYear: function() {
            vs.setUTCFullYear.apply(this._, arguments)
        },
        setHours: function() {
            vs.setUTCHours.apply(this._, arguments)
        },
        setMilliseconds: function() {
            vs.setUTCMilliseconds.apply(this._, arguments)
        },
        setMinutes: function() {
            vs.setUTCMinutes.apply(this._, arguments)
        },
        setMonth: function() {
            vs.setUTCMonth.apply(this._, arguments)
        },
        setSeconds: function() {
            vs.setUTCSeconds.apply(this._, arguments)
        },
        setTime: function() {
            vs.setTime.apply(this._, arguments)
        }
    };
    var vs = Date.prototype,
        ys = "%a %b %e %X %Y",
        bs = "%m/%d/%Y",
        xs = "%H:%M:%S",
        Ms = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        ws = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        ks = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        Ns = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    ua.time.year = To(function(t) {
        return t = ua.time.day(t), t.setMonth(0, 1), t
    }, function(t, e) {
        t.setFullYear(t.getFullYear() + e)
    }, function(t) {
        return t.getFullYear()
    }), ua.time.years = ua.time.year.range, ua.time.years.utc = ua.time.year.utc.range, ua.time.day = To(function(t) {
        var e = new gs(1970, 0);
        return e.setFullYear(t.getFullYear(), t.getMonth(), t.getDate()), e
    }, function(t, e) {
        t.setDate(t.getDate() + e)
    }, function(t) {
        return t.getDate() - 1
    }), ua.time.days = ua.time.day.range, ua.time.days.utc = ua.time.day.utc.range, ua.time.dayOfYear = function(t) {
        var e = ua.time.year(t);
        return Math.floor((t - e - 6e4 * (t.getTimezoneOffset() - e.getTimezoneOffset())) / 864e5)
    }, ms.forEach(function(t, e) {
        t = t.toLowerCase(), e = 7 - e;
        var n = ua.time[t] = To(function(t) {
            return (t = ua.time.day(t))
                .setDate(t.getDate() - (t.getDay() + e) % 7), t
        }, function(t, e) {
            t.setDate(t.getDate() + 7 * Math.floor(e))
        }, function(t) {
            var n = ua.time.year(t)
                .getDay();
            return Math.floor((ua.time.dayOfYear(t) + (n + e) % 7) / 7) - (n !== e)
        });
        ua.time[t + "s"] = n.range, ua.time[t + "s"].utc = n.utc.range, ua.time[t + "OfYear"] = function(t) {
            var n = ua.time.year(t)
                .getDay();
            return Math.floor((ua.time.dayOfYear(t) + (n + e) % 7) / 7)
        }
    }), ua.time.week = ua.time.sunday, ua.time.weeks = ua.time.sunday.range, ua.time.weeks.utc = ua.time.sunday.utc.range, ua.time.weekOfYear = ua.time.sundayOfYear, ua.time.format = function(t) {
        function e(e) {
            for (var r, i, o, a = [], u = -1, s = 0; ++u < n;) 37 === t.charCodeAt(u) && (a.push(t.substring(s, u)), null != (i = js[r = t.charAt(++u)]) && (r = t.charAt(++u)), (o = Ds[r]) && (r = o(e, null == i ? "e" === r ? " " : "0" : i)), a.push(r), s = u + 1);
            return a.push(t.substring(s, u)), a.join("")
        }
        var n = t.length;
        return e.parse = function(e) {
            var n = {
                    y: 1900,
                    m: 0,
                    d: 1,
                    H: 0,
                    M: 0,
                    S: 0,
                    L: 0
                },
                r = _o(n, t, e, 0);
            if (r != e.length) return null;
            "p" in n && (n.H = n.H % 12 + 12 * n.p);
            var i = new gs;
            return i.setFullYear(n.y, n.m, n.d), i.setHours(n.H, n.M, n.S, n.L), i
        }, e.toString = function() {
            return t
        }, e
    };
    var Ts = Eo(Ms),
        Ss = Eo(ws),
        _s = Eo(ks),
        Es = Co(ks),
        Cs = Eo(Ns),
        As = Co(Ns),
        js = {
            "-": "",
            _: " ",
            0: "0"
        },
        Ds = {
            a: function(t) {
                return ws[t.getDay()]
            },
            A: function(t) {
                return Ms[t.getDay()]
            },
            b: function(t) {
                return Ns[t.getMonth()]
            },
            B: function(t) {
                return ks[t.getMonth()]
            },
            c: ua.time.format(ys),
            d: function(t, e) {
                return Ao(t.getDate(), e, 2)
            },
            e: function(t, e) {
                return Ao(t.getDate(), e, 2)
            },
            H: function(t, e) {
                return Ao(t.getHours(), e, 2)
            },
            I: function(t, e) {
                return Ao(t.getHours() % 12 || 12, e, 2)
            },
            j: function(t, e) {
                return Ao(1 + ua.time.dayOfYear(t), e, 3)
            },
            L: function(t, e) {
                return Ao(t.getMilliseconds(), e, 3)
            },
            m: function(t, e) {
                return Ao(t.getMonth() + 1, e, 2)
            },
            M: function(t, e) {
                return Ao(t.getMinutes(), e, 2)
            },
            p: function(t) {
                return t.getHours() >= 12 ? "PM" : "AM"
            },
            S: function(t, e) {
                return Ao(t.getSeconds(), e, 2)
            },
            U: function(t, e) {
                return Ao(ua.time.sundayOfYear(t), e, 2)
            },
            w: function(t) {
                return t.getDay()
            },
            W: function(t, e) {
                return Ao(ua.time.mondayOfYear(t), e, 2)
            },
            x: ua.time.format(bs),
            X: ua.time.format(xs),
            y: function(t, e) {
                return Ao(t.getFullYear() % 100, e, 2)
            },
            Y: function(t, e) {
                return Ao(t.getFullYear() % 1e4, e, 4)
            },
            Z: Vo,
            "%": function() {
                return "%"
            }
        },
        qs = {
            a: jo,
            A: Do,
            b: qo,
            B: Lo,
            c: Ho,
            d: Bo,
            e: Bo,
            H: Wo,
            I: Wo,
            L: Uo,
            m: Io,
            M: $o,
            p: Yo,
            S: Xo,
            x: Fo,
            X: Ro,
            y: zo,
            Y: Oo
        },
        Ls = /^\s*\d+/,
        Hs = ua.map({
            am: 0,
            pm: 1
        });
    ua.time.format.utc = function(t) {
        function e(t) {
            try {
                gs = No;
                var e = new gs;
                return e._ = t, n(e)
            } finally {
                gs = Date
            }
        }
        var n = ua.time.format(t);
        return e.parse = function(t) {
            try {
                gs = No;
                var e = n.parse(t);
                return e && e._
            } finally {
                gs = Date
            }
        }, e.toString = n.toString, e
    };
    var Fs = ua.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
    ua.time.format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? Go : Fs, Go.parse = function(t) {
        var e = new Date(t);
        return isNaN(e) ? null : e
    }, Go.toString = Fs.toString, ua.time.second = To(function(t) {
        return new gs(1e3 * Math.floor(t / 1e3))
    }, function(t, e) {
        t.setTime(t.getTime() + 1e3 * Math.floor(e))
    }, function(t) {
        return t.getSeconds()
    }), ua.time.seconds = ua.time.second.range, ua.time.seconds.utc = ua.time.second.utc.range, ua.time.minute = To(function(t) {
        return new gs(6e4 * Math.floor(t / 6e4))
    }, function(t, e) {
        t.setTime(t.getTime() + 6e4 * Math.floor(e))
    }, function(t) {
        return t.getMinutes()
    }), ua.time.minutes = ua.time.minute.range, ua.time.minutes.utc = ua.time.minute.utc.range, ua.time.hour = To(function(t) {
        var e = t.getTimezoneOffset() / 60;
        return new gs(36e5 * (Math.floor(t / 36e5 - e) + e))
    }, function(t, e) {
        t.setTime(t.getTime() + 36e5 * Math.floor(e))
    }, function(t) {
        return t.getHours()
    }), ua.time.hours = ua.time.hour.range, ua.time.hours.utc = ua.time.hour.utc.range, ua.time.month = To(function(t) {
        return t = ua.time.day(t), t.setDate(1), t
    }, function(t, e) {
        t.setMonth(t.getMonth() + e)
    }, function(t) {
        return t.getMonth()
    }), ua.time.months = ua.time.month.range, ua.time.months.utc = ua.time.month.utc.range;
    var Rs = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6],
        Os = [
            [ua.time.second, 1],
            [ua.time.second, 5],
            [ua.time.second, 15],
            [ua.time.second, 30],
            [ua.time.minute, 1],
            [ua.time.minute, 5],
            [ua.time.minute, 15],
            [ua.time.minute, 30],
            [ua.time.hour, 1],
            [ua.time.hour, 3],
            [ua.time.hour, 6],
            [ua.time.hour, 12],
            [ua.time.day, 1],
            [ua.time.day, 2],
            [ua.time.week, 1],
            [ua.time.month, 1],
            [ua.time.month, 3],
            [ua.time.year, 1]
        ],
        zs = [
            [ua.time.format("%Y"), He],
            [ua.time.format("%B"), function(t) {
                return t.getMonth()
            }],
            [ua.time.format("%b %d"), function(t) {
                return 1 != t.getDate()
            }],
            [ua.time.format("%a %d"), function(t) {
                return t.getDay() && 1 != t.getDate()
            }],
            [ua.time.format("%I %p"), function(t) {
                return t.getHours()
            }],
            [ua.time.format("%I:%M"), function(t) {
                return t.getMinutes()
            }],
            [ua.time.format(":%S"), function(t) {
                return t.getSeconds()
            }],
            [ua.time.format(".%L"), function(t) {
                return t.getMilliseconds()
            }]
        ],
        Ps = ua.scale.linear(),
        Is = Qo(zs);
    Os.year = function(t, e) {
        return Ps.domain(t.map(ta))
            .ticks(e)
            .map(Ko)
    }, ua.time.scale = function() {
        return Zo(ua.scale.linear(), Os, Is)
    };
    var Bs = Os.map(function(t) {
            return [t[0].utc, t[1]]
        }),
        Ws = [
            [ua.time.format.utc("%Y"), He],
            [ua.time.format.utc("%B"), function(t) {
                return t.getUTCMonth()
            }],
            [ua.time.format.utc("%b %d"), function(t) {
                return 1 != t.getUTCDate()
            }],
            [ua.time.format.utc("%a %d"), function(t) {
                return t.getUTCDay() && 1 != t.getUTCDate()
            }],
            [ua.time.format.utc("%I %p"), function(t) {
                return t.getUTCHours()
            }],
            [ua.time.format.utc("%I:%M"), function(t) {
                return t.getUTCMinutes()
            }],
            [ua.time.format.utc(":%S"), function(t) {
                return t.getUTCSeconds()
            }],
            [ua.time.format.utc(".%L"), function(t) {
                return t.getUTCMilliseconds()
            }]
        ],
        $s = Qo(Ws);
    return Bs.year = function(t, e) {
        return Ps.domain(t.map(na))
            .ticks(e)
            .map(ea)
    }, ua.time.scale.utc = function() {
        return Zo(ua.scale.linear(), Bs, $s)
    }, ua.text = function() {
        return ua.xhr.apply(ua, arguments)
            .response(ra)
    }, ua.json = function(t, e) {
        return ua.xhr(t, "application/json", e)
            .response(ia)
    }, ua.html = function(t, e) {
        return ua.xhr(t, "text/html", e)
            .response(oa)
    }, ua.xml = function() {
        return ua.xhr.apply(ua, arguments)
            .response(aa)
    }, ua
}(), Array.max = function(t) {
    return Math.max.apply(Math, t)
};
var rerun = !1;
! function(t, e) {
    var n = function() {
        var e = t._data(document, "events");
        return e && e.click && t.grep(e.click, function(t) {
                return "rails" === t.namespace
            })
            .length
    };
    n() && t.error("jquery-ujs has already been loaded!");
    var r;
    t.rails = r = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])",
        disableSelector: "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
        fileInputSelector: "input[type=file]",
        linkDisableSelector: "a[data-disable-with]",
        CSRFProtection: function(e) {
            var n = t('meta[name="csrf-token"]')
                .attr("content");
            n && e.setRequestHeader("X-CSRF-Token", n)
        },
        fire: function(e, n, r) {
            var i = t.Event(n);
            return e.trigger(i, r), i.result !== !1
        },
        confirm: function(t) {
            return confirm(t)
        },
        ajax: function(e) {
            return t.ajax(e)
        },
        href: function(t) {
            return t.attr("href")
        },
        handleRemote: function(n) {
            var i, o, a, u, s, l, c, f;
            if (r.fire(n, "ajax:before")) {
                if (u = n.data("cross-domain"), s = u === e ? null : u, l = n.data("with-credentials") || null, c = n.data("type") || t.ajaxSettings && t.ajaxSettings.dataType, n.is("form")) {
                    i = n.attr("method"), o = n.attr("action"), a = n.serializeArray();
                    var h = n.data("ujs:submit-button");
                    h && (a.push(h), n.data("ujs:submit-button", null))
                } else n.is(r.inputChangeSelector) ? (i = n.data("method"), o = n.data("url"), a = n.serialize(), n.data("params") && (a = a + "&" + n.data("params"))) : (i = n.data("method"), o = r.href(n), a = n.data("params") || null);
                f = {
                    type: i || "GET",
                    data: a,
                    dataType: c,
                    beforeSend: function(t, i) {
                        return i.dataType === e && t.setRequestHeader("accept", "*/*;q=0.5, " + i.accepts.script), r.fire(n, "ajax:beforeSend", [t, i])
                    },
                    success: function(t, e, r) {
                        n.trigger("ajax:success", [t, e, r])
                    },
                    complete: function(t, e) {
                        n.trigger("ajax:complete", [t, e])
                    },
                    error: function(t, e, r) {
                        n.trigger("ajax:error", [t, e, r])
                    },
                    crossDomain: s
                }, l && (f.xhrFields = {
                    withCredentials: l
                }), o && (f.url = o);
                var d = r.ajax(f);
                return n.trigger("ajax:send", d), d
            }
            return !1
        },
        handleMethod: function(n) {
            var i = r.href(n),
                o = n.data("method"),
                a = n.attr("target"),
                u = t("meta[name=csrf-token]")
                .attr("content"),
                s = t("meta[name=csrf-param]")
                .attr("content"),
                l = t('<form method="post" action="' + i + '"></form>'),
                c = '<input name="_method" value="' + o + '" type="hidden" />';
            s !== e && u !== e && (c += '<input name="' + s + '" value="' + u + '" type="hidden" />'), a && l.attr("target", a), l.hide()
                .append(c)
                .appendTo("body"), l.submit()
        },
        disableFormElements: function(e) {
            e.find(r.disableSelector)
                .each(function() {
                    var e = t(this),
                        n = e.is("button") ? "html" : "val";
                    e.data("ujs:enable-with", e[n]()), e[n](e.data("disable-with")), e.prop("disabled", !0)
                })
        },
        enableFormElements: function(e) {
            e.find(r.enableSelector)
                .each(function() {
                    var e = t(this),
                        n = e.is("button") ? "html" : "val";
                    e.data("ujs:enable-with") && e[n](e.data("ujs:enable-with")), e.prop("disabled", !1)
                })
        },
        allowAction: function(t) {
            var e, n = t.data("confirm"),
                i = !1;
            return n ? (r.fire(t, "confirm") && (i = r.confirm(n), e = r.fire(t, "confirm:complete", [i])), i && e) : !0
        },
        blankInputs: function(e, n, r) {
            var i, o, a = t(),
                u = n || "input,textarea",
                s = e.find(u);
            return s.each(function() {
                if (i = t(this), o = i.is("input[type=checkbox],input[type=radio]") ? i.is(":checked") : i.val(), !o == !r) {
                    if (i.is("input[type=radio]") && s.filter('input[type=radio]:checked[name="' + i.attr("name") + '"]')
                        .length) return !0;
                    a = a.add(i)
                }
            }), a.length ? a : !1
        },
        nonBlankInputs: function(t, e) {
            return r.blankInputs(t, e, !0)
        },
        stopEverything: function(e) {
            return t(e.target)
                .trigger("ujs:everythingStopped"), e.stopImmediatePropagation(), !1
        },
        callFormSubmitBindings: function(n, r) {
            var i = n.data("events"),
                o = !0;
            return i !== e && i.submit !== e && t.each(i.submit, function(t, e) {
                return "function" == typeof e.handler ? o = e.handler(r) : void 0
            }), o
        },
        disableElement: function(t) {
            t.data("ujs:enable-with", t.html()), t.html(t.data("disable-with")), t.bind("click.railsDisable", function(t) {
                return r.stopEverything(t)
            })
        },
        enableElement: function(t) {
            t.data("ujs:enable-with") !== e && (t.html(t.data("ujs:enable-with")), t.data("ujs:enable-with", !1)), t.unbind("click.railsDisable")
        }
    }, r.fire(t(document), "rails:attachBindings") && (t.ajaxPrefilter(function(t, e, n) {
            t.crossDomain || r.CSRFProtection(n)
        }), t(document)
        .delegate(r.linkDisableSelector, "ajax:complete", function() {
            r.enableElement(t(this))
        }), t(document)
        .delegate(r.linkClickSelector, "click.rails", function(n) {
            var i = t(this),
                o = i.data("method"),
                a = i.data("params");
            if (!r.allowAction(i)) return r.stopEverything(n);
            if (i.is(r.linkDisableSelector) && r.disableElement(i), i.data("remote") !== e) {
                if (!(!n.metaKey && !n.ctrlKey || o && "GET" !== o || a)) return !0;
                var u = r.handleRemote(i);
                return u === !1 ? r.enableElement(i) : u.error(function() {
                    r.enableElement(i)
                }), !1
            }
            return i.data("method") ? (r.handleMethod(i), !1) : void 0
        }), t(document)
        .delegate(r.inputChangeSelector, "change.rails", function(e) {
            var n = t(this);
            return r.allowAction(n) ? (r.handleRemote(n), !1) : r.stopEverything(e)
        }), t(document)
        .delegate(r.formSubmitSelector, "submit.rails", function(n) {
            var i = t(this),
                o = i.data("remote") !== e,
                a = r.blankInputs(i, r.requiredInputSelector),
                u = r.nonBlankInputs(i, r.fileInputSelector);
            if (!r.allowAction(i)) return r.stopEverything(n);
            if (a && i.attr("novalidate") == e && r.fire(i, "ajax:aborted:required", [a])) return r.stopEverything(n);
            if (o) {
                if (u) {
                    setTimeout(function() {
                        r.disableFormElements(i)
                    }, 13);
                    var s = r.fire(i, "ajax:aborted:file", [u]);
                    return s || setTimeout(function() {
                        r.enableFormElements(i)
                    }, 13), s
                }
                return !t.support.submitBubbles && t()
                    .jquery < "1.7" && r.callFormSubmitBindings(i, n) === !1 ? r.stopEverything(n) : (r.handleRemote(i), !1)
            }
            setTimeout(function() {
                r.disableFormElements(i)
            }, 13)
        }), t(document)
        .delegate(r.formInputClickSelector, "click.rails", function(e) {
            var n = t(this);
            if (!r.allowAction(n)) return r.stopEverything(e);
            var i = n.attr("name"),
                o = i ? {
                    name: i,
                    value: n.val()
                } : null;
            n.closest("form")
                .data("ujs:submit-button", o)
        }), t(document)
        .delegate(r.formSubmitSelector, "ajax:beforeSend.rails", function(e) {
            this == e.target && r.disableFormElements(t(this))
        }), t(document)
        .delegate(r.formSubmitSelector, "ajax:complete.rails", function(e) {
            this == e.target && r.enableFormElements(t(this))
        }), t(function() {
            var e = t("meta[name=csrf-token]")
                .attr("content"),
                n = t("meta[name=csrf-param]")
                .attr("content");
            t('form input[name="' + n + '"]')
                .val(e)
        }))
}(jQuery);