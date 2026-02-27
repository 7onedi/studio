// This file is a simple script to test the Prisma client connection and query the database.
// You can run this script inside the Docker container or locally to verify that your Prisma setup is working correctly.
// npx tsx src/script.ts for running inside the container.
import { prisma } from "./lib/prisma";

async function main() {
  // Example: Fetch all records from a table
  // Replace 'user' with your actual model name
  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));
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