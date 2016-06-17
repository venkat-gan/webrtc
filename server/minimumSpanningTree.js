import {createMinHeap} from './heap';
// O(ELogV)
export const primMST = (graph) => {
  let numberOfVertices = graph.getNodes().length;

  let mst = [],key =[],pos = [];
  let {
    getHeap,
    setHeap,
    addHeapNode,
    minHeapify,
    extractMin,
    isInMinHeap,
    setPos,
    bottomUpHeapify,
    getSize
  } = createMinHeap(numberOfVertices);

  //Intialize the root Node value
    mst[0] = -1;
    key[0] = 0;
    addHeapNode(0,0);
    pos[0] = 0;

  for(let vertex=1;vertex<numberOfVertices;vertex++){
    mst[vertex] = -1;
    key[vertex] = Number.MAX_SAFE_INTEGER;
    addHeapNode(vertex,Number.MAX_SAFE_INTEGER);
    pos[vertex] = vertex;
  }


  setPos(pos);

  const isNotEmpty = (size)=>size!=0;

  while(isNotEmpty(getSize())){
    //Extract the root node in MinHeap tree
    let rootNode = extractMin();
    let u = rootNode.getVertex()
    //get the Node,edges and weigth list from the graph
    let uNode = graph.getNodes()[u];
    let edgesList = uNode.getEdges()
    let weightList = uNode.getWeights();

    //update edges key value if it is present Minimum spanning tree
    for(let index= 0; index<edgesList.length;index++){
      let v = edgesList[index];
      let name = v.getName();
      let weight = weightList[index];

      //update only if it less the previously known weight
      if(isInMinHeap(v.getName()) && weight< key[name]){
        key[name] = weight;
        mst[name] = u;
        bottomUpHeapify(name,key[name])
      }
    }

  }

  return mst;

}
