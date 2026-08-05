export { ShellsProvider, useShells } from "./context/ShellsContext";
export { SearchPage } from "./shells/SearchPage/SearchPage";
export { FormPage } from "./shells/FormPage/FormPage";
export { DetailPage } from "./shells/DetailPage/DetailPage";

export type {
  // Shell configs
  SearchPageConfig,
  FormPageConfig,
  DetailPageConfig,
  // Column / field / action definitions
  ColumnDef,
  ActionDef,
  FilterDef,
  FieldDef,
  DetailField,
  Condition,
  // Component contracts
  ComponentMap,
  ShellTableProps,
  ShellButtonProps,
  ShellDropdownProps,
  ShellInputProps,
  // Utilities
  Fetcher,
  ActionVariant,
  FilterType,
  FieldType,
  ConditionOperator,
} from "./types";
