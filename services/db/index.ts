import "server-only";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserInstances = async (userId: string, userName?: string): Promise<Instance[]> => {
  const user = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
      instances: {
        create: [
          {
            name: `${userName ? userName + "'s" : "New"} Instance`,
            imgSrc: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80",
            ownerId: userId,
          },
          {
            name: `Other Instance`,
            ownerId: userId,
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

const getInstance = async (instanceId: number) => {
  return prisma.instance.findFirst({
    where: {
      id: instanceId,
    },
    include: {
      manga: {
        include: {
          latestChapters: true,
        }
      },
      members: true,
      webhooks: true,
    },
  });
};

const getLatestChapter = async (mangaId: string, language: string) => {
  return prisma.latestChapter.findUnique({
    select: {
      chapterId: true,
      volume: true,
      chapter: true,
      readableAt: true,
    },
    where: {
      mangaId_language: { mangaId, language }
    }
  });
};

const cacheLatestChapter = async (mangaId: string, language: string, chapter: Chapter) => {
  await prisma.latestChapter.upsert({
    where: {
      mangaId_language: { mangaId, language }
    },
    create: { mangaId, language, ...chapter },
    update: chapter,
  });
};

const service = {
  getUserInstances,
  getInstance,
  getLatestChapter,
  cacheLatestChapter,
};

export default service;
