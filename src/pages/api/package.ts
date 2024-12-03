import { Parser, ReadEntry } from "tar";
import JSZip from "jszip";

import type { APIRoute } from "astro";

// Get tarball URL for scoped npm package
const getNpmTarball: (
	scope: string | null,
	packageName: string,
	version?: string,
) => Promise<string> = async (scope, packageName, version = "latest") => {
	const fullPackageName = scope ? `@${scope}/${packageName}` : packageName;
	const response = await fetch(
		`https://registry.npmjs.org/${fullPackageName}/${version}`,
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch metadata for ${fullPackageName}`);
	}

	const data = await response.json();
	return data.dist.tarball;
};

export const GET: APIRoute = async ({ url }) => {
	const modules = ["p5", "@ff6347/p5-easing"];

	const params = url.searchParams;
	const isMinimal = params.get("minimal") === "true";

	const zip = new JSZip();
	const moduleContents = await Promise.all(
		modules.map(async (moduleName) => {
			try {
				// Handle scoped and non-scoped package names
				const packageNameParts = moduleName.split("/");
				const scope =
					packageNameParts.length > 1
						? packageNameParts[0].replace("@", "")
						: null;
				const packageName =
					packageNameParts.length > 1 ? packageNameParts[1] : moduleName;

				// Get tarball URL
				const tarballUrl = await getNpmTarball(scope, packageName);

				const tarballResponse = await fetch(tarballUrl);

				if (!tarballResponse.ok) {
					throw new Error(`Failed to download tarball for ${moduleName}`);
				}

				const tarballArrayBuffer = await tarballResponse.arrayBuffer();

				// Extract tarball contents
				const extractedFiles: { [key: string]: string } = {};

				await new Promise((resolve, reject) => {
					const reader = new Parser();

					reader.on("entry", (entry: ReadEntry) => {
						let content = "";
						entry.on("data", (chunk: Buffer) => {
							content += new TextDecoder().decode(chunk);
						});
						entry.on("end", () => {
							// Strip package/ prefix and ignore node_modules
							const cleanPath = entry.path.replace(/^package\//, "");
							if (
								!cleanPath.startsWith(".") &&
								!cleanPath.includes("node_modules")
							) {
								extractedFiles[cleanPath] = content;
							}
						});
					});

					reader.on("finish", resolve);
					reader.on("error", reject);

					// Convert ArrayBuffer to Uint8Array and pipe to tar parser
					reader.write(new Uint8Array(tarballArrayBuffer));
					reader.end();
				});

				return {
					name: moduleName,
					version: extractedFiles["package.json"]
						? JSON.parse(extractedFiles["package.json"]).version
						: "unknown",
					files: extractedFiles,
				};
			} catch (error) {
				console.error(`Error processing module ${moduleName}:`, error);
				// Return a minimal object to prevent complete failure
				return {
					name: moduleName,
					version: "error",
					files: {},
				};
			}
		}),
	);

	if (!isMinimal) {
		zip.file(
			".editorconfig",
			`root = true
[*]
indent_style = tab
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 80

[*.{yml,yaml}]
indent_style = space`,
		);
		zip.file(
			".vscode/extensions.json",
			`{
	"recommendations": [
		"ms-vscode.live-server",
		"esbenp.prettier-vscode",
		"ritwickdey.liveserver"
	]
}`,
		);
		zip.file(".vscode/settings.json", `{ "prettier.useEditorConfig": true }`);
	}

	zip.file(
		"index.html",
		`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p5.js Starter Project</title>
    <style>
    html,
    body {
        height: 100%;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    main {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-end;
    }
    </style>
</head>
<body>
<main>
    <div id="sketch"></div>
    <a href="index.js">souce code</a>
    </main>
    <script src="${isMinimal ? "lib/p5.min.js" : "./modules/p5/lib/p5.min.js"}"></script>
    <!-- <script src="${isMinimal ? "lib/p5.sound.min.js" : "./modules/p5/lib/addons/p5.sound.min.js"}"></script> -->
   <!-- <script src="${isMinimal ? "lib/p5.easing.min.js" : "./modules/@ff6347/p5-easing/dist/p5.easing.min.js"}"></script> -->

    <script src="index.js"></script>
</body>
</html>`,
	);

	zip.file(
		"index.js",
		`

function setup(){
  const canvas = createCanvas(100,100);
  canvas.parent("sketch");
  background("black");
}

function draw() {}
`,
	);

	// Add module files to zip
	moduleContents.forEach((module) => {
		// Add entire package contents to modules directory
		Object.entries(module.files).forEach(([filepath, content]) => {
			if (isMinimal) {
				if (filepath.includes("p5.min.js")) {
					zip.file(`lib/p5.min.js`, content);
				}
				if (filepath.includes("p5.easing.min.js")) {
					zip.file(`lib/p5.easing.min.js`, content);
				}
				if (filepath.includes("p5.sound.min.js")) {
					zip.file(`lib/p5.sound.min.js`, content);
				}
			} else {
				zip.file(`modules/${module.name}/${filepath}`, content);
			}
		});
	});

	const zipContent = await zip.generateAsync({ type: "blob" });

	return new Response(zipContent, {
		headers: {
			"Content-Type": "application/zip",
			"Content-Disposition": `attachment; filename="p5-starter-${Date.now()}-${isMinimal ? "minimal" : "full"}.zip"`,
		},
	});
};
