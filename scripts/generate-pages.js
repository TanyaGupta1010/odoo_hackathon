import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  "Login",
  "Dashboard",
  "Organization",
  "Assets",
  "Allocation",
  "Booking",
  "Maintenance",
  "Audit",
  "Reports",
  "Notifications",
];

const pagesDir = path.join(__dirname, "..", "src", "pages");

for (const page of pages) {
  const folder = path.join(pagesDir, page);

  fs.mkdirSync(folder, { recursive: true });

  const component = `const ${page} = () => {
  return (
    <div>
      <h1>${page}</h1>
    </div>
  );
};

export default ${page};
`;

  const index = `export { default } from "./${page}";
`;

  fs.writeFileSync(path.join(folder, `${page}.tsx`), component);
  fs.writeFileSync(path.join(folder, "index.ts"), index);

  console.log(`✅ ${page}`);
}

console.log("\n🎉 All pages generated!");