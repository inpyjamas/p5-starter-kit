export { renderers } from '../../renderers.mjs';

const getPackageVersions = async (packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch versions for ${packageName}`);
  }
  const data = await response.json();
  const versions = Object.keys(data.versions || {});
  return versions.filter((version) => !version.includes("alpha") && !version.includes("beta") && !version.includes("rc")).sort((a, b) => {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) {
        return bPart - aPart;
      }
    }
    return 0;
  }).slice(0, 20);
};
const GET = async () => {
  try {
    const packages = {
      "p5": "p5",
      "p5-easing": "@ff6347/p5-easing"
    };
    const versionData = {};
    for (const [key, packageName] of Object.entries(packages)) {
      try {
        versionData[key] = await getPackageVersions(packageName);
      } catch (error) {
        console.error(`Error fetching versions for ${packageName}:`, error);
        versionData[key] = ["latest"];
      }
    }
    return new Response(JSON.stringify(versionData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
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
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
