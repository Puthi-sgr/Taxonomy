import React, { createContext, useState } from "react";

interface TaxonomyContext {
  taxonomy: string;
  setTaxonomy: (taxonomy: string) => void;
}

const TaxonomyContext = createContext<TaxonomyContext>({
  taxonomy: "",
  setTaxonomy: () => {},
});

const TaxonomyProvider = ({ children }: { children: React.ReactNode }) => {
  const [taxonomy, setTaxonomy] = useState("");

  return (
    <TaxonomyContext.Provider value={{ taxonomy, setTaxonomy }}>
      {children}
    </TaxonomyContext.Provider>
  );
};

export { TaxonomyContext, TaxonomyProvider };
