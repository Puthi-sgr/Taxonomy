import React from "react";

interface TaxonomyOption {
  value: string;
  label: string;
}

const taxonomyOptions: TaxonomyOption[] = [
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "aws", label: "AWS" },
  { value: "laravel", label: "Laravel" },
  // Add more options as needed
];

interface TaxonomySelectorProps {
  onSelectTaxonomy: (selectedTaxonomy: string) => void;
}
const TaxonomySelector = ({ onSelectTaxonomy }: TaxonomySelectorProps) => {
  const [selectedTaxonomy, setSelectedTaxonomy] = React.useState("docker");

  const handleTaxonomyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTaxonomy(event.target.value);
    onSelectTaxonomy(event.target.value);
  };

  return (
    <select value={selectedTaxonomy} onChange={handleTaxonomyChange}>
      {taxonomyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default TaxonomySelector;
