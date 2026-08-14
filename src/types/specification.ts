// NOTE: dataType enum values are inferred from the example payload
// (NUMBER shown). Confirm the full enum list with backend before
// relying on this — same caveat as CategoryStatus in your API doc.
export type SpecificationDataType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "ENUM"
  | "DATE";

export interface Specification {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  dataType: SpecificationDataType;
  unit: string | null;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  displayOrder: number;
  placeholder: string | null;
  defaultValue: string | null;
  categoryId: number;
  categoryName: string;
}

export interface CreateSpecificationRequest {
  name: string;
  displayName: string;
  description?: string;
  dataType: SpecificationDataType;
  unit?: string;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  displayOrder: number;
  placeholder?: string;
  defaultValue?: string;
  categoryId: number;
}

export type UpdateSpecificationRequest = CreateSpecificationRequest;