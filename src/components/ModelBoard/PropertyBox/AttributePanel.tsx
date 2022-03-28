import React, { useCallback, useMemo } from "react";
import intl from "react-intl-universal";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import LazyTextField from "components/ModelBoard/PropertyBox/LazyTextField";
import { AttributeMeta } from "../meta/AttributeMeta";
import { ValueType } from "../meta/ValueType";
import { ClassMeta, StereoType } from "../meta/ClassMeta";
import { useChangeColumn } from "../hooks/useChangeColumn";
import { useEnums } from "../hooks/useEnums";
import { useInterfaces } from "../hooks/useInterfaces";
import { useServiceId } from "../hooks/useServiceId";

export const AttributePanel = (props: {
  column: AttributeMeta;
  entity: ClassMeta;
}) => {
  const { column, entity } = props;
  const serviceId = useServiceId()
  const changeColumn = useChangeColumn(serviceId);
  const enums = useEnums(serviceId);
  const interfaces = useInterfaces(serviceId);

  const handleStringChange = useCallback(
    (prop: any) => (event: React.ChangeEvent<{ value: string }>) => {
      changeColumn(
        {
          ...column,
          [prop]: event.target.value.trim(),
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  //默认值以后要改成一个单独控件
  const handleDefaultChange = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      changeColumn(
        {
          ...column,
          default: event.target.value === "" ? undefined : event.target.value,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  //不设置allValues， 类型改变会清空所有旧设置，保留nullable
  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<ValueType>) => {
      const type = event.target.value as any;
      let generated = column.generated;
      if (type !== ValueType.String && type !== ValueType.Int) {
        generated = undefined;
      }

      changeColumn(
        {
          ...column,
          type,
          generated,
          nullable: column.nullable,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const handleEnumEntiyChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      changeColumn(
        {
          ...column,
          typeUuid: event.target.value,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const handleInterfaceEntiyChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      changeColumn(
        {
          ...column,
          typeUuid: event.target.value,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const handleGeneratedChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      let value: any = event.target.value;
      if (value === "true") {
        value = true;
      }
      if (!value) {
        value = undefined;
      }

      changeColumn(
        {
          ...column,
          generated: value,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const handleBooleanChange = useCallback(
    (prop: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      changeColumn(
        {
          ...column,
          [prop]: event.target.checked,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked ? false : undefined;
      changeColumn(
        {
          ...column,
          select: value,
        },
        entity
      );
    },
    [changeColumn, column, entity]
  );

  const isId = useMemo(
    () => column.name === "id" && entity.stereoType !== StereoType.Interface,
    [column.name, entity.stereoType]
  );
  return (
    <>
      <Grid item xs={12}>
        <LazyTextField
          label={intl.get("name")}
          value={column.name || ""}
          onChange={handleStringChange("name")}
          disabled={isId}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth size="small" disabled={isId}>
          <InputLabel>{intl.get("data-type")}</InputLabel>
          <Select
            value={column.type}
            onChange={handleTypeChange}
            label={intl.get("data-type")}
          >
            <MenuItem value={ValueType.ID}>ID</MenuItem>
            <MenuItem value={ValueType.String}>String</MenuItem>
            <MenuItem value={ValueType.Int}>Int</MenuItem>
            <MenuItem value={ValueType.Float}>Float</MenuItem>
            <MenuItem value={ValueType.Boolean}>Boolean</MenuItem>
            <MenuItem value={ValueType.Date}>Date</MenuItem>
            <MenuItem value={ValueType.Enum}>Enum</MenuItem>
            <MenuItem value={ValueType.ValueObject}>
              {intl.get("simple-json")}
            </MenuItem>
            {/* <MenuItem value={ValueType.Array}>
              {intl.get("simple-array")}
            </MenuItem>
            <MenuItem value={ValueType.JsonArray}>
              {intl.get("json-array")}
            </MenuItem> */}
          </Select>
        </FormControl>
      </Grid>
      {column.type === ValueType.Enum && (
        <Grid item xs={12}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            disabled={isId}
          >
            <InputLabel>{intl.get("enum-class")}</InputLabel>
            <Select
              value={column.typeUuid || ""}
              onChange={handleEnumEntiyChange}
              label={intl.get("enum-class")}
            >
              {enums.map((enumEntity) => {
                return (
                  <MenuItem key={enumEntity.uuid} value={enumEntity.uuid}>
                    {enumEntity.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      )}
      {(column.type === ValueType.ValueObject ||
        column.type === ValueType.ValueObjectArray) && (
        <Grid item xs={12}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            disabled={isId}
          >
            <InputLabel>{intl.get("interface-class")}</InputLabel>
            <Select
              value={column.typeUuid || ""}
              onChange={handleInterfaceEntiyChange}
              label={intl.get("interface-class")}
            >
              {interfaces.map((interfaceEntity) => {
                return (
                  <MenuItem
                    key={interfaceEntity.uuid}
                    value={interfaceEntity.uuid}
                  >
                    {interfaceEntity.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      )}
      {isId && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={column.primary || false}
                onChange={handleBooleanChange("primary")}
                color="primary"
              />
            }
            disabled
            label={intl.get("primary-key")}
          />
        </Grid>
      )}
      {!isId && (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={column.nullable || false}
                onChange={handleBooleanChange("nullable")}
                color="primary"
              />
            }
            label={intl.get("nullable")}
          />
        </Grid>
      )}
      {!isId && (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={column.unique || false}
                onChange={handleBooleanChange("unique")}
                color="primary"
              />
            }
            label={intl.get("unique")}
          />
        </Grid>
      )}
      {!isId && (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={column.index || false}
                onChange={handleBooleanChange("index")}
                color="primary"
              />
            }
            label={intl.get("index")}
          />
        </Grid>
      )}

      {column.type === ValueType.Date && (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={column.createDate || false}
                onChange={handleBooleanChange("createDate")}
                color="primary"
              />
            }
            label={intl.get("create-date")}
          />
        </Grid>
      )}
      {column.type === ValueType.Date && (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={column.updateDate || false}
                onChange={handleBooleanChange("updateDate")}
                color="primary"
              />
            }
            label={intl.get("update-date")}
          />
        </Grid>
      )}
      {column.type === ValueType.Date && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={column.deleteDate || false}
                onChange={handleBooleanChange("deleteDate")}
                color="primary"
              />
            }
            label={intl.get("delete-date")}
          />
        </Grid>
      )}
      {!isId && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={column.select === false ? true : false}
                onChange={handleSelectChange}
                color="primary"
              />
            }
            label={intl.get("hide-field")}
          />
        </Grid>
      )}

      {!isId && (
        <Grid item xs={12}>
          <LazyTextField
            label={intl.get("default-value")}
            value={column.default || ""}
            onChange={handleDefaultChange}
          />
        </Grid>
      )}

      {!isId && column.type === ValueType.String && (
        <Grid item xs={12}>
          <LazyTextField
            label={intl.get("length")}
            value={column.default || ""}
            onChange={handleStringChange("length")}
          />
        </Grid>
      )}

      {(column.type === ValueType.Int ||
        column.type === ValueType.String) && (
        <Grid item xs={12}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            disabled={isId}
          >
            <InputLabel>{intl.get("generated")}</InputLabel>
            <Select
              value={
                (column.generated === true ? "true" : column.generated) || ""
              }
              onChange={handleGeneratedChange}
              label={intl.get("generated")}
            >
              <MenuItem value={""}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={"true"}>True</MenuItem>
              {column.type === ValueType.String && (
                <MenuItem value={"uuid"}>uuid</MenuItem>
              )}
              {column.type === ValueType.String && (
                <MenuItem value={"rowid"}>rowid</MenuItem>
              )}

              <MenuItem value={"increment"}>increment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <LazyTextField
          label={intl.get("description")}
          value={column.description || ""}
          multiline
          rows={4}
          onChange={handleStringChange("description")}
        />
      </Grid>
    </>
  );
};