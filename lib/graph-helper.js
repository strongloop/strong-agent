module.exports = {

  startNode: function startNode(name, q, agent) {
    if (agent.graph == undefined) return;

    var nodeId = agent.graph.nodes.length;
    var node = {name: name, q: q, start: Date.now(), value: 1};
    agent.graph.nodes.push(node);

    var link = {source: agent.currentNode, target: nodeId, value: 1};
    agent.graph.links.push(link);

    var prevNode = agent.currentNode;
    agent.currentNode = nodeId;

    return {node: node, link: link, prevNode: prevNode};
  },

  updateTimes: function updateTimes(graphNode, time) {
    if (graphNode == undefined) return;
    graphNode.node.value = time.ms || 1;
    graphNode.link.value = time.ms || 1;
  }

};