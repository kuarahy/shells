import React, { useCallback, useEffect, useState } from "react";
import type { SearchPageConfig } from "../../types";
import { useShells } from "../../context/ShellsContext";

function buildUrl(endpoint: string, params: Record<string, unknown>): string {
  const active = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (active.length === 0) return endpoint;
  const qs = new URLSearchParams(active.map(([k, v]) => [k, String(v)]));
  return `${endpoint}?${qs.toString()}`;
}

export function SearchPage({
  title,
  endpoint,
  columns,
  actions = [],
  filters = [],
}: SearchPageConfig): React.ReactElement {
  const {
    components: { Table, Dropdown, Input },
    fetcher,
  } = useShells();

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetcher(buildUrl(endpoint, filterValues))
      .then((res) => setData(res as Record<string, unknown>[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint, fetcher, filterValues]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRowAction = useCallback(
    async (actionLabel: string, row: Record<string, unknown>) => {
      const action = actions.find((a) => a.label === actionLabel);
      if (!action) return;
      const id = String(row["id"] ?? row["Id"] ?? "");
      const url = action.endpoint.replace(":id", id);
      await fetcher(url, { method: "POST" });
      load();
    },
    [actions, fetcher, load]
  );

  const setFilter = useCallback((field: string, value: unknown) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div data-shell="search-page">
      <h1>{title}</h1>

      {filters.length > 0 && (
        <div data-shell="filters">
          {filters.map((f) => {
            if (f.type === "dropdown" && Dropdown) {
              return (
                <Dropdown
                  key={f.field}
                  value={filterValues[f.field]}
                  options={(f.options ?? []).map((o) => ({ label: o, value: o }))}
                  onChange={(v) => setFilter(f.field, v)}
                  placeholder={f.placeholder}
                />
              );
            }
            if (f.type === "text" && Input) {
              return (
                <Input
                  key={f.field}
                  value={String(filterValues[f.field] ?? "")}
                  onChange={(v) => setFilter(f.field, v)}
                  placeholder={f.placeholder}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      <Table
        data={data}
        columns={columns}
        actions={actions}
        onRowAction={handleRowAction}
        loading={loading}
      />
    </div>
  );
}
