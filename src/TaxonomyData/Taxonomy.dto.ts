export interface TaxonomyDetails {
  commands?: string[];
  tips?: string[];
}

export interface TaxonomyNode {
  id: string;
  name: string;
  description?: string;
  details?: TaxonomyDetails;
  children?: TaxonomyNode[];
}

export interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  depth: number;
  hasChildren: boolean;
  data: TaxonomyNode;
}
