// TaxonomyData.ts
import { DockerData } from "./DockerData";
import { LaravelData } from "./LaravelData";
import { TaxonomyNode } from "./Taxonomy.dto";

const dockerTaxonomy: TaxonomyNode = DockerData;

const laravelTaxonomy: TaxonomyNode = LaravelData;

const kubernetesTaxonomy: TaxonomyNode = {
  id: "kubernetes_root",
  name: "Kubernetes Root",
  children: [
    { id: "pod", name: "Pod" },
    { id: "deployment", name: "Deployment" },
  ],
};

const taxonomyData: { [key: string]: TaxonomyNode } = {
  docker: dockerTaxonomy,
  kubernetes: kubernetesTaxonomy,
  laravel: laravelTaxonomy,
};

export default taxonomyData;
