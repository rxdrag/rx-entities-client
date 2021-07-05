import { useEffect } from "react";
import { useModelsBoardStore } from "../store";
import { Node } from '@antv/x6';

export function useSelectNode(){
  const modelStore = useModelsBoardStore();
  useEffect(()=>{
    if(modelStore.selectedCell)
    {
      const selectionId = modelStore.selectedCell?.id;
      modelStore.graph?.cleanSelection();
      modelStore.graph?.select( modelStore.graph?.getCellById(selectionId));
    }

  },[ modelStore.graph, modelStore.selectedCell])

  const handleNodeSelected = (arg: { node: Node<Node.Properties>; })=>{
    modelStore.selectClass(arg.node.id);
  }

  const handleNodeUnselected = ()=>{
    if(modelStore.openedDiagram?.getNodeById(modelStore.selectedCell?.id||'')){
      modelStore.setSelectedCell(undefined);      
    }
  }

  useEffect(()=>{
    const graph =  modelStore.graph;
    graph?.on('node:selected', handleNodeSelected);
    graph?.on('node:unselected', handleNodeUnselected);
    return ()=>{
      graph?.off('node:selected', handleNodeSelected);
      graph?.off('node:unselected', handleNodeUnselected);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[modelStore.graph])
}