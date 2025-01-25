import * as fs from "fs";
import * as path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const INDEX_FILE = path.join(SRC_DIR, "index.ts");

function generateExports() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter(
      (file) => file.endsWith(".ts") && !file.includes(".test.") && !file.includes("index.") && !file.endsWith(".d.ts"),
    )
    .sort();

  // Generate export statements for each file
  const exportStatements = files
    .map((file) => {
      const basename = path.basename(file, ".ts");
      return `export * from './${basename}';`;
    })
    .join("\n");

  // Write the index.ts file
  fs.writeFileSync(INDEX_FILE, exportStatements + "\n");
  console.log("Successfully generated src/index.ts");
}

generateExports();
