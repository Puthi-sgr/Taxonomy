// TaxonomyData.ts
import { TaxonomyNode } from "./Taxonomy.dto";

const dockerTaxonomy: TaxonomyNode = {
  id: "docker_root",
  name: "Docker Root",
  children: [
    { id: "docker_image", name: "Docker Image" },
    { id: "docker_container", name: "Docker Container" },
  ],
};

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
};

export default taxonomyData;
