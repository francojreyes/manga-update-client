"use client";

import React, { useContext } from "react";

const InstancesContext = React.createContext<Instance[]>([]);

export const useInstancesContext = () => {
  return useContext(InstancesContext);
};

const InstancesProvider = ({
  children,
  instances,
}: {
  children: React.ReactNode,
  instances: Instance[],
}) => {
  return (
    <InstancesContext.Provider value={instances}>
      {children}
    </InstancesContext.Provider>
  );
};

export default InstancesProvider;
