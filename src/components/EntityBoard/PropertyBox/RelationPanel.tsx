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
  Typography,
} from "@mui/material";
import LazyTextField from "components/EntityBoard/PropertyBox/LazyTextField";
import { CascadeType, RelationMeta, RelationType } from "../meta/RelationMeta";
import { useEntity } from "../hooks/useEntity";
import { useChangeRelation } from "../hooks/useChangeRelation";
import { useGetEntity } from "../hooks/useGetEntity";
import { useServiceId } from "../hooks/useServiceId";

export const RelationPanel = (props: { relation: RelationMeta }) => {
  const { relation } = props;
  const serviceId = useServiceId();
  const source = useEntity(relation.sourceId, serviceId);
  const target = useEntity(relation.targetId, serviceId);
  const changeRelation = useChangeRelation(serviceId);
  const getEntity = useGetEntity(serviceId);

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<RelationType>) => {
      const ownerId =
        relation.relationType === RelationType.ONE_TO_MANY
          ? relation.sourceId
          : relation.targetId;

      changeRelation({
        ...relation,
        relationType: event.target.value as RelationType,
        ownerId: ownerId,
      });
    },
    [changeRelation, relation]
  );

  const handleSourceRoleChange = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      changeRelation({
        ...relation,
        roleOnSource: event.target.value.trim(),
      });
    },
    [changeRelation, relation]
  );

  const handleSourceDescriptionChange = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      changeRelation({
        ...relation,
        descriptionOnSource: event.target.value,
      });
    },
    [changeRelation, relation]
  );
  const handleTargetRoleChange = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      changeRelation({
        ...relation,
        roleOnTarget: event.target.value.trim(),
      });
    },
    [changeRelation, relation]
  );

  const handleTargetDescriptionChange = useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      changeRelation({
        ...relation,
        descriptionOnTarget: event.target.value,
      });
    },
    [changeRelation, relation]
  );


  const handleOwnerChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      changeRelation({
        ...relation,
        ownerId: event.target.value as string,
      });
    },
    [changeRelation, relation]
  );

  const handleCombinationOnSourceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      changeRelation({
        ...relation,
        cascadeType: event.target.checked ? CascadeType.ON_SOURCE : undefined,
      });
    },
    [changeRelation, relation]
  );

  const handleCombinationOnTargetChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      changeRelation({
        ...relation,
        cascadeType: event.target.checked ? CascadeType.ON_TARGET : undefined,
      });
    },
    [changeRelation, relation]
  );

  const isInherit = useMemo(
    () => RelationType.IMPLEMENTS === relation.relationType,
    [relation.relationType]
  );

  return (
    <>
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>{intl.get("relation-type")}</InputLabel>
          <Select
            value={relation.relationType}
            onChange={handleTypeChange}
            label={intl.get("relation-type")}
            disabled={isInherit}
          >
            <MenuItem value={RelationType.IMPLEMENTS}>
              {intl.get("implements")}
            </MenuItem>
            <MenuItem value={RelationType.ONE_TO_ONE}>
              {intl.get("one-to-one")}
            </MenuItem>
            <MenuItem value={RelationType.ONE_TO_MANY}>
              {intl.get("one-to-many")}
            </MenuItem>
            <MenuItem value={RelationType.MANY_TO_ONE}>
              {intl.get("many-to-one")}
            </MenuItem>
            <MenuItem value={RelationType.MANY_TO_MANY}>
              {intl.get("many-to-many")}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          disabled={
            relation.relationType === RelationType.ONE_TO_MANY ||
            relation.relationType === RelationType.MANY_TO_ONE ||
            isInherit
          }
        >
          <InputLabel>{intl.get("owner")}</InputLabel>
          <Select
            value={relation.ownerId}
            onChange={handleOwnerChange}
            label={intl.get("owner")}
          >
            <MenuItem value={relation.sourceId}>
              {getEntity(relation.sourceId)?.name}
            </MenuItem>
            <MenuItem value={relation.targetId}>
              {getEntity(relation.targetId)?.name}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {!isInherit && (
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {source?.name} {intl.get("side")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LazyTextField
              label={intl.get("role-name")}
              value={relation.roleOnSource || ""}
              onChange={handleSourceRoleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <LazyTextField
              label={intl.get("description")}
              value={relation.descriptionOnSource || ""}
              multiline
              rows={4}
              onChange={handleSourceDescriptionChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={relation.cascadeType === CascadeType.ON_SOURCE}
                  onChange={handleCombinationOnSourceChange}
                  color="primary"
                />
              }
              label={intl.get("cascade")}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {target?.name} {intl.get("side")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LazyTextField
              label={intl.get("role-name")}
              value={relation.roleOnTarget || ""}
              onChange={handleTargetRoleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <LazyTextField
              label={intl.get("description")}
              value={relation.descriptionOnTarget || ""}
              multiline
              rows={4}
              onChange={handleTargetDescriptionChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={relation.cascadeType === CascadeType.ON_TARGET}
                  onChange={handleCombinationOnTargetChange}
                  color="primary"
                />
              }
              label={intl.get("cascade")}
            />
          </Grid>
        </>
      )}
    </>
  );
};
