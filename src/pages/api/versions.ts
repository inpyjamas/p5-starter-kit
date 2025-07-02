import type { APIRoute } from "astro";

// Get all versions for a package from npm registry
const getPackageVersions = async (packageName: string): Promise<string[]> => {
	const response = await fetch(`https://registry.npmjs.org/${packageName}`);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch versions for ${packageName}`);
	}
	
	const data = await response.json();
	const versions = Object.keys(data.versions || {});
	
	// Sort versions in descending order (newest first)
	return versions
		.filter(version => !version.includes('alpha') && !version.includes('beta') && !version.includes('rc'))
		.sort((a, b) => {
			// Simple version comparison - newer versions first
			const aParts = a.split('.').map(Number);
			const bParts = b.split('.').map(Number);
			
			for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
				const aPart = aParts[i] || 0;
				const bPart = bParts[i] || 0;
				
				if (aPart !== bPart) {
					return bPart - aPart; // Descending order
				}
			}
			return 0;
		})
		.slice(0, 20); // Limit to 20 most recent versions
};

export const GET: APIRoute = async () => {
	try {
		const packages = {
			"p5": "p5",
			"p5-easing": "@ff6347/p5-easing"
		};

		const versionData: Record<string, string[]> = {};

		// Fetch versions for each package
		for (const [key, packageName] of Object.entries(packages)) {
			try {
				versionData[key] = await getPackageVersions(packageName);
			} catch (error) {
				console.error(`Error fetching versions for ${packageName}:`, error);
				versionData[key] = ["latest"]; // Fallback
			}
		}

		return new Response(JSON.stringify(versionData), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("Error fetching package versions:", error);
		return new Response(
			JSON.stringify({ 
				error: "Failed to fetch versions",
				fallback: {
					"p5": ["latest"],
					"p5-easing": ["latest"]
				}
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};