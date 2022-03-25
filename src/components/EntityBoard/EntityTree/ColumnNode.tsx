import { IconButton, SvgIcon } from "@mui/material";
import { TreeItem } from "@mui/lab";
import { NodeText } from "./NodeText";
import { TreeNodeLabel } from "./TreeNodeLabel";
import { ColumnMeta } from "../meta/ColumnMeta";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { selectedElementState } from "../recoil/atoms";
import { useDeleteColumn } from "../hooks/useDeleteColumn";
import { useServiceId } from "../hooks/useServiceId";

export const ColumnNode = (props: { key?: string; column: ColumnMeta }) => {
  const { column } = props;
  const serviceId = useServiceId();
  const setSelectedElement = useSetRecoilState(selectedElementState(serviceId));
  const isId = useMemo(() => column.name === "id", [column.name]); /*&&
    column.entityStore.entityType !== EntityType.INTERFACE*/
  const deletedColumn = useDeleteColumn(serviceId);
  const handleClick = () => {
    setSelectedElement(column.uuid);
  };

  const handleDelete = () => {
    deletedColumn(column.uuid);
  };
  return (
    <TreeItem
      nodeId={column.uuid}
      label={
        <TreeNodeLabel
          action={
            !isId && (
              <IconButton size="small" onClick={handleDelete}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            )
          }
          onClick={handleClick}
        >
          <SvgIcon sx={{ fontSize: 12 }}>
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
            />
          </SvgIcon>
          <NodeText>{column.name}</NodeText>
        </TreeNodeLabel>
      }
    ></TreeItem>
  );
};
