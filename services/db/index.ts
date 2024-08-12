import "server-only";
import { cookies } from "next/headers";

const getUserInstances = async () => {
  // TODO: Replace this with auth
  const _ = cookies();

  const instances: Instance[] = [
    {
      id: "1",
      idx: 0,
      name: "marshdapro's Instance",
      imgSrc: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80",
    },
    {
      id: "2",
      idx: 1,
      name: "Other Instance",
    },
  ];

  return instances;
};

const service = {
  getUserInstances,
};

export default service;
