export interface GraphConfig {
  linkStrokeWidth: number;
  linkClass: string;
  nodeRadius: number;
  nodeStrokeWidth: number;
  labelPaddingX: number;
  labelStrokeWidth: number;
  nodeVerticalSpacing: number;
  nodeHorizontalSpacing: number;
  siblingSeparation: number;
  nonSiblingSeparation: number;
}

export const graphConfig: GraphConfig = {
  linkStrokeWidth: 2,
  linkClass: "fill-none stroke-slate-300",
  nodeRadius: 20,
  nodeStrokeWidth: 1,
  labelPaddingX: 14,
  labelStrokeWidth: 1.5,
  nodeVerticalSpacing: 100,
  nodeHorizontalSpacing: 300,
  siblingSeparation: 1,
  nonSiblingSeparation: 1,
};

export default graphConfig;
