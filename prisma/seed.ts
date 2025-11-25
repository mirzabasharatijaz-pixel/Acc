import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@accflipper.test" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@accflipper.test",
      passwordHash: await hash("password123", 10),
      role: "admin",
      wallet: { create: {} },
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", buyerFeePercent: 2, sellerFeePercent: 2 },
  });

  await prisma.listing.createMany({
    data: [
      {
        title: "Premium game account",
        description: "Level 80 mage with rare skins. Credentials delivered via admin.",
        category: "gaming",
        tags: ["game", "account"],
        price: 500,
        sellerId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
