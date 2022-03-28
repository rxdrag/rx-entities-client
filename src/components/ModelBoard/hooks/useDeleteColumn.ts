import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { classesState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useDeleteColumn(serviceId: number) {
  const setEntities = useSetRecoilState(classesState(serviceId));
  const backupSnapshot = useBackupSnapshot(serviceId);

  const deleteColumn = useCallback(
    (columnUuid: string) => {
      backupSnapshot();
      setEntities((entities) =>
        entities.map((entity) =>
          entity.attributes.find((col) => col.uuid === columnUuid)
            ? {
                ...entity,
                attributes: entity.attributes.filter(
                  (col) => col.uuid !== columnUuid
                ),
              }
            : entity
        )
      );
    },
    [backupSnapshot, setEntities]
  );

  return deleteColumn;
}