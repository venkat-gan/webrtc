import {
    compose2, compose
}
from './utils';

export const createNode = (name) => {
    let adjList = [];
    let weights = [];


    return {
        addEdge: (neighbour, weight) => {
            adjList.push(neighbour);
            weights.push(weight);
        },
        getEdges: () => adjList,
        getWeights: () => weights,
        setEdges: (edgelist) => (adjList=edgelist),
        getName: () => name
    };

};

export default () => {
    let nodes = [];

    const pushNode = (node) => {nodes.push(node);return node;};


    const isNameNotEqual = (name,value) => {
      if(typeof(value.getName()) === "object"){console.log(value.getName()['name'])
          return value.getName()['name'] !== name;}
      else {
          return value.getName() !== name;
      }
    }

    const removeNodeFromList = (name) => {
        nodes = nodes.filter(
            (value) => isNameNotEqual(name,value))
        return name
    };

    const removeNodeFromEdge = (name) => nodes.forEach(
        compose (({edges,value})=>(value.setEdges(edges.filter(
          (value) => isNameNotEqual(name,value)
      ))),(value) => ({edges: value.getEdges(),value}))
    );

    return {
        addNode: compose(pushNode,createNode),
        removeNode: compose(removeNodeFromEdge,removeNodeFromList),
        getNodes: () => nodes,
        removeAllNodes: ()=>(nodes=[])
    };
}


export const haversineDistanceGraph = (computeHaversineDistance) => (graph) =>{
  const lookUp  = {};
  const addNode = (name) => {
      let prevNodes = Object.assign([],graph.getNodes());
      let srcNode = graph.addNode(name);
      let srcCoord = srcNode.getName()['coordinates'];
      let srcLat   = srcCoord.lat;
      let srcLong  = srcCoord.long;
      var distance = computeHaversineDistance(srcLat,srcLong);
      prevNodes.forEach((tarNode)=>{
        let {lat:targetLat,long:targetLong} = tarNode.getName()['coordinates'];

        if(!lookUp[[targetLat,targetLong,srcLat,srcLong]] ||
                        !lookUp[[srcLat,srcLong,targetLat,targetLong]]){
             let weight = distance(targetLat,targetLong);
             lookUp[[srcLat,srcLong,targetLat,targetLong]] =
                      lookUp[[targetLat,targetLong,srcLat,srcLong]] = weight;
        }

        srcNode.addEdge(tarNode,lookUp[[srcLat,srcLong,targetLat,targetLong]]);
        tarNode.addEdge(srcNode,lookUp[[targetLat,targetLong,srcLat,srcLong]]);
    });
    return srcNode;
  };

  return {
    addNode,
    removeNode:graph.removeNode,
    getNodes: graph.getNodes,
    removeAllNodes:graph.removeAllNodes
  }
};
