import React, { memo } from "react";
import { Theme, IconButton, Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import intl from "react-intl-universal";
import RouterPrompt from "components/common/RouterPrompt";
import { useShowServerError } from "recoil/hooks/useShowServerError";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { successAlertState } from "recoil/atoms";
import {
  changedState,
  diagramsState,
  entitiesState,
  metaState,
  redoListState,
  relationsState,
  selectedElementState,
  undoListState,
  x6EdgesState,
  x6NodesState,
} from "../recoil/atoms";
import { useUndo } from "../hooks/useUndo";
import { useRedo } from "../hooks/useRedo";
import { useColumn } from "../hooks/useColumn";
import { useDeleteSelectedElement } from "../hooks/useDeleteSelectedElement";
import { LoadingButton } from "@mui/lab";
import { usePostOne } from "do-ents/usePostOne";
import { EntityNameMeta, Meta, MetaStatus } from "../meta/Meta";
import { SyncButton } from "./SyncButton";
import { useServiceId } from "../hooks/useServiceId";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: "flex",
      width: "100%",
      height: theme.spacing(6),
      borderBottom: `solid 1px ${theme.palette.divider}`,
      alignItems: "center",
    },
    toolbarInner: {
      flex: 1,
      display: "flex",
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(2),
    },
    iconButton: {
      width: "38px",
      height: "38px",
    },
    saveButtonShell: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing(4),
    },
  })
);

export const EntityToolbar = memo(() => {
  const classes = useStyles();
  const serviceId = useServiceId();
  const [meta, setMeta] = useRecoilState(metaState(serviceId));
  const entities = useRecoilValue(entitiesState(serviceId));
  const relations = useRecoilValue(relationsState(serviceId));
  const diagrams = useRecoilValue(diagramsState(serviceId));
  const x6Nodes = useRecoilValue(x6NodesState(serviceId));
  const x6Edges = useRecoilValue(x6EdgesState(serviceId));
  const setSuccessAlertState = useSetRecoilState(successAlertState);
  const [changed, setChanged] = useRecoilState(changedState(serviceId));
  const undoList = useRecoilValue(undoListState(serviceId));
  const redoList = useRecoilValue(redoListState(serviceId));
  const selectedElement = useRecoilValue(selectedElementState(serviceId));
  const { column } = useColumn(selectedElement || "", serviceId);
  const undo = useUndo(serviceId);
  const redo = useRedo(serviceId);
  const deleteSelectedElement = useDeleteSelectedElement(serviceId);

  const [excuteSave, { loading, error }] = usePostOne<Meta>({
    onCompleted(data: Meta) {
      setSuccessAlertState(true);
      setChanged(false);
      setMeta(data);
    },
  });

  useShowServerError(error);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleDelete = () => {
    deleteSelectedElement();
  };

  const handleSave = () => {
    const content = {
      entities,
      relations,
      diagrams,
      x6Nodes,
      x6Edges,
    };

    const data: Meta =
      meta?.status === MetaStatus.META_STATUS_PUBLISHED || !meta
        ? {
            __type: EntityNameMeta,
            content,
          }
        : {
            ...meta,
            __type: EntityNameMeta,
            content,
          };
    excuteSave(data);
  };

  return (
    <div className={classes.toolbar}>
      <div className={classes.toolbarInner}>
        <RouterPrompt
          promptBoolean={changed}
          message={intl.get("changing-not-save-message")}
        />
        <IconButton
          className={classes.iconButton}
          disabled={undoList.length === 0}
          onClick={handleUndo}
          size="large"
        >
          <UndoOutlinedIcon />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          disabled={redoList.length === 0}
          onClick={handleRedo}
          size="large"
        >
          <RedoOutlinedIcon />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          disabled={(column && column.name === "id") || !selectedElement}
          onClick={handleDelete}
          size="large"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <div className={classes.saveButtonShell}>
          <LoadingButton
            variant="contained"
            color="primary"
            size="medium"
            disabled={!changed}
            loading={loading}
            onClick={handleSave}
          >
            {intl.get("save")}
          </LoadingButton>
          <SyncButton />
        </div>
      </div>
    </div>
  );
});
