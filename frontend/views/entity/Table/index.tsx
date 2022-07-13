import {
  ComponentIsLoading,
  ErrorAlert,
  OffCanvas,
  Table,
  DEFAULT_TABLE_PARAMS,
} from "@gothicgeeks/design-system";
import { IBEPaginatedDataState, usePaginatedData } from "@gothicgeeks/shared";
import { useState } from "react";
import { AppLayout } from "../../../_layouts/app";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";

import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "../../../lib/routing/constants";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { useTableMenuItems } from "./useTableMenuItems";
import { useTableColumns } from "./useTableColumns";
import { useDetailsOffCanvasStore } from "./hooks/useDetailsOffCanvas.store";
import { EntityDetailsView } from "../Details/DetailsView";
import { useViewStateMachine } from "../useViewStateMachine";

// TODO sync table to url
// TODO when table passes a limit then a non synced columns to show
// TODO crud views validations
export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityCrudSettings = useEntityCrudSettings();
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Table,
    EntityActionTypes.Diction,
    EntityActionTypes.Labels,
    EntityActionTypes.Types,
  ]);
  const menuItems = useTableMenuItems();
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );

  const [paginatedDataState, setPaginatedDataState] =
    useState<IBEPaginatedDataState>(DEFAULT_TABLE_PARAMS);

  const tableData = usePaginatedData(
    ENTITY_TABLE_PATH(entity),
    paginatedDataState,
    {
      enabled: entity && entity !== SLUG_LOADING_VALUE,
    }
  );

  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const columns = useTableColumns();

  const error =
    entityCrudSettings.error ||
    entityScalarFields.error ||
    hiddenTableColumns.error;

  const isLoading =
    entityCrudSettings.isLoading ||
    entityScalarFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    hiddenTableColumns.isLoading;

  const viewState = useViewStateMachine(isLoading, error);

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
      ]}
      actionItems={actionItems}
    >
      {viewState.type === "loading" && <ComponentIsLoading />}
      {viewState.type === "error" && <ErrorAlert message={viewState.message} />}
      {viewState.type === "render" && (
        <Table
          title=""
          {...{
            tableData,
            setPaginatedDataState,
            paginatedDataState,
          }}
          columns={columns}
          menuItems={menuItems}
        />
      )}
      <OffCanvas
        // Show the entity title here
        title="Details"
        onClose={closeDetailsCanvas}
        show={!!detailsCanvasEntity}
      >
        <EntityDetailsView id={detailsCanvasId} entity={detailsCanvasEntity} />
      </OffCanvas>
    </AppLayout>
  );
}
