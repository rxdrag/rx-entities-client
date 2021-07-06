import { EntityMeta } from "../meta/entity-meta";
import { X6NodeMeta } from "../meta/x6-node-meta";
import { DiagramStore } from "../store/diagram";
import { SelectedNode } from "../store/models-board";
import { Command } from "./command";

export class CreateEntityCommand implements Command{
  constructor(
    private readonly diagramStore: DiagramStore,
    private readonly entityMeta: EntityMeta,
    private readonly nodeMeta: X6NodeMeta,
  ){}
  
  excute():SelectedNode{
    const entityStore = this.diagramStore?.belongsToPackage?.addNewEntity(this.entityMeta);
    this.diagramStore?.addNode(this.nodeMeta);
    return entityStore;
  }
  undo():SelectedNode{
    this.diagramStore?.belongsToPackage?.deleteEntity(this.entityMeta.id)
    this.diagramStore?.deleteNode(this.nodeMeta.id);
    return undefined;
  };
}