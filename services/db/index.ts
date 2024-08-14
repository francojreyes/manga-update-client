import "server-only";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserInstances = async (): Promise<Instance[]> => {
  const session = await auth();

  // TODO: handle unauthorised better?
  if (!session?.user) return [];

  const user = await prisma.user.upsert({
    where: {
      id: session.user.discordId,
    },
    update: {},
    create: {
      id: session.user.discordId,
      instances: {
        create: [
          {
            name: `${session.user.name}'s Instance`,
            imgSrc: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80",
            ownerId: session.user.discordId,
          },
          {
            name: `Other Instance`,
            ownerId: session.user.discordId,
          },
        ]
      }
    },
    include: {
      instances: true,
    }
  });

  return user.instances.map((instance, idx) => ({
    id: instance.id,
    idx: idx,
    name: instance.name,
    imgSrc: instance.imgSrc ?? undefined,
  }));
};

const service = {
  getUserInstances,
};

export default service;
