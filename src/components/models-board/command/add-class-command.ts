import { X6NodeMeta } from "../meta/x6-node-meta";
import { ClassStore } from "../store/class-store";
import { DiagramStore } from "../store/diagram";
import { SelectedNode } from "../store/models-board";
import { Command } from "./command";

export class AddClassCommand implements Command{
  constructor(
    private readonly diagramStore: DiagramStore,
    private readonly classStore: ClassStore|undefined,
    private readonly nodeMeta: X6NodeMeta,
  ){}
  
  excute():SelectedNode{
    this.diagramStore?.addNode(this.nodeMeta);
    return this.classStore;
  }
  undo():SelectedNode{
    this.diagramStore?.deleteNode(this.nodeMeta.id);
    return undefined;
  };
}