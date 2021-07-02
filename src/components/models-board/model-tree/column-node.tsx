import { IconButton } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import MdiIcon from "components/common/mdi-icon";
import { ColumnStore } from "../store/column";
import { NodeText } from "./node-text";
import { TreeNodeLabel } from "./tree-node-label";


export function ColumnNode(props:{
  key?:string,
  columnStore: ColumnStore
}){
const {columnStore} = props;

return(
  <TreeItem nodeId= {columnStore.id} label={
    <TreeNodeLabel
      action = {
        <IconButton size = "small">
          <MdiIcon className="mdi-dots-horizontal" size="16" />
        </IconButton>
      }
    >
      <MdiIcon iconClass = "mdi-plus" size={15} />
      <NodeText>{columnStore.name}</NodeText>
    </TreeNodeLabel>
  }>
  </TreeItem>
)
}