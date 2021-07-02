import { IconButton } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import MdiIcon from "components/common/mdi-icon";
import { DiagramStore } from "../store/diagram";
import { NodeText } from "./node-text";
import { TreeNodeLabel } from "./tree-node-label";

export function DiagramNode(props:{
  key?:string,
  diagramStore: DiagramStore
}){
const {diagramStore} = props;

return(
  <TreeItem nodeId= {diagramStore.id} label={
    <TreeNodeLabel
      action = {
        <IconButton size = "small">
          <MdiIcon className="mdi-dots-horizontal" size="16" />
        </IconButton>
      }
    >
      <MdiIcon iconClass = "mdi-arrange-send-backward" size={15} />
      <NodeText>{diagramStore.name}</NodeText>
    </TreeNodeLabel>
  }>
  </TreeItem>
)
}