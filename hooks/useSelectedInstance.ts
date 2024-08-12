import { useInstancesContext } from "@/app/instance/InstancesProvider";
import { useParams } from "next/navigation";

const useSelectedInstance = (): Instance | undefined => {
  const instances = useInstancesContext();
  const params = useParams();

  const instanceIdx = params.instanceIdx;
  if (typeof instanceIdx !== "string") return undefined;

  const parsedInstanceIdx = parseInt(instanceIdx);
  if (isNaN(parsedInstanceIdx) || parsedInstanceIdx >= instances.length) {
    return undefined;
  }

  return instances[parsedInstanceIdx];
};

export default useSelectedInstance;