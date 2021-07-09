import React, { useEffect } from "react";
import { IconButton, SvgIcon } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import MdiIcon from "components/common/mdi-icon";
import { EntityStore } from "../store/entity-store";
import { NodeText } from "./node-text";
import { ColumnNode } from "./column-node";
import { TreeNodeLabel } from "./tree-node-label";
import intl from "react-intl-universal";
import { RelationNode } from "./relation-node";
import { observer } from "mobx-react";
import { useModelsBoardStore } from "../store";
import { Addon } from '@antv/x6'
import { EntityView } from "../grahp-canvas/entity-view";
import { NODE_INIT_SIZE } from "../store/node-init-size";
import { EntityDeleteCommand } from "../command/entity-delete-command";
import { ColumnCreateCommand } from "../command/column-create-command";
import { createId } from "util/creat-id";
const { Dnd } = Addon

export const EntityNode = observer((props:{
  key?:string,
  entityStore: EntityStore
})=>{
  const {entityStore} = props;
  const [dnd, setDnd] = React.useState<any>();
  const bordStore = useModelsBoardStore();

  useEffect(()=>{
    const theDnd = bordStore.graph
    ? new Dnd({
      target: bordStore.graph,
      scaled: false,
      animation: true,

    })
    : undefined;
    setDnd(theDnd);
  },[bordStore.graph])

  const startDragHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(!bordStore.graph){
      return;
    }

    const node = bordStore.graph.createNode({
      ...NODE_INIT_SIZE,
      height: 70 + entityStore.columns.length * 26,
      isTempForDrag:true,
      shape: 'react-shape', 
      component: <EntityView />,
      data: {...entityStore.toMeta(), isTempForDrag: true}
    });
    dnd?.start(node, e.nativeEvent as any)
  }

  const handleClick = (event:React.MouseEvent)=>{
    bordStore.setSelectedElement(entityStore);
    event.stopPropagation();
  }
  const sourceRelations = entityStore.getSourceRelations();
  const targetRelations = entityStore.getTargetRelations();

  const handleDelete = ()=>{
    const command = new EntityDeleteCommand(entityStore);
    bordStore.excuteCommand(command);
  }

  const handlePlusColumn = (event:React.MouseEvent)=>{
    const command = new ColumnCreateCommand(entityStore, createId());
    bordStore.excuteCommand(command);
    event.stopPropagation();
  }

  return(
    <TreeItem nodeId= {entityStore.uuid} label={
      <TreeNodeLabel
        action = {
          <IconButton size = "small" onClick = {handleDelete}>
            <MdiIcon className="mdi-trash-can-outline" size="16" />
          </IconButton>
        }
        onClick = {handleClick}
        onDragStart={startDragHandle}
      >
        <SvgIcon>
          <path d="
            M 1,6
            L 14,6
            L 14,19
            L 1,19
            L 1,6
            M 1,11
            L 14,11
          " stroke="#000" strokeWidth="1" fill="#fff"></path>
        </SvgIcon>
        <NodeText><div style={{marginLeft:'-8px'}}>{entityStore.name}</div></NodeText>
      </TreeNodeLabel>
    }>
      <TreeItem nodeId= {entityStore.uuid + 'columns'} label={
        <TreeNodeLabel
          action = {
            <IconButton 
              size = "small"
              onClick = {handlePlusColumn}
            >
              <MdiIcon className="mdi-plus" size="16" />
            </IconButton>
          }
        >
          <NodeText>{intl.get('properties')}</NodeText>
        </TreeNodeLabel>
      }>
        {
          entityStore.columns.map(column=>{
            return (
              <ColumnNode key={column.uuid} columnStore = {column}/>
            )
          })
        }
      </TreeItem>
      {
        (sourceRelations.length > 0 || targetRelations.length > 0)  &&
        <TreeItem nodeId= {entityStore.uuid + 'relations'} label={
          <TreeNodeLabel>
            <NodeText>{intl.get('relations')}</NodeText>
          </TreeNodeLabel>
        }>
          {
            sourceRelations.map(relation=>{
              return (
                <RelationNode key={relation.uuid} relation = {relation} isSource entityStore = {entityStore} />
              )
            })
          }
          {
            targetRelations.map(relation=>{
              return (
                <RelationNode key={relation.uuid} relation = {relation} isSource = {false} entityStore = {entityStore} />
              )
            })
          }
        </TreeItem>      
      }

    </TreeItem>
  )
})
