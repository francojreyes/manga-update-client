import { useInstancesContext } from "@/app/instance/InstancesProvider";
import { useParams } from "next/navigation";

const useSelectedInstance = (): Instance => {
  const instances = useInstancesContext();
  const params = useParams();

  const instanceIdx = params.instanceIdx;
  if (typeof instanceIdx !== "string") {
    throw new Error("No instance index");
  }

  const parsedInstanceIdx = parseInt(instanceIdx);
  if (isNaN(parsedInstanceIdx) || parsedInstanceIdx >= instances.length) {
    throw new Error("Invalid instance index");
  }

  return instances[parsedInstanceIdx];
};

export default useSelectedInstance;