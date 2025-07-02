import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, g as decodeKey } from './chunks/astro/server_C4pkSLoS.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/tomato/Documents/inpyjamas/p5kit.inpyjamas.dev/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/package","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/package\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"package","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/package.ts","pathname":"/api/package","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/versions","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/versions\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"versions","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/versions.ts","pathname":"/api/versions","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"async function c(){try{const t=await(await fetch(\"/api/versions\")).json(),o=document.getElementById(\"p5-version\");t.p5&&o&&t.p5.forEach(e=>{if(e!==\"latest\"){const n=document.createElement(\"option\");n.value=e,n.textContent=e,o.appendChild(n)}});const i=document.getElementById(\"p5-easing-version\");t[\"p5-easing\"]&&i&&t[\"p5-easing\"].forEach(e=>{if(e!==\"latest\"){const n=document.createElement(\"option\");n.value=e,n.textContent=e,i.appendChild(n)}})}catch(a){console.error(\"Failed to load versions:\",a)}}function s(){const a=document.getElementById(\"p5-version\")?.value,t=document.getElementById(\"p5-easing-version\")?.value,o=new URLSearchParams;a&&a!==\"latest\"&&o.set(\"p5\",a),t&&t!==\"latest\"&&o.set(\"p5-easing\",t);const i=document.getElementById(\"download-link\"),e=document.getElementById(\"download-link-minimal\");if(i&&(i.href=`/api/package${o.toString()?\"?\"+o.toString():\"\"}`),e){const n=new URLSearchParams(o);n.set(\"minimal\",\"true\"),e.href=`/api/package?${n.toString()}`}}document.addEventListener(\"DOMContentLoaded\",()=>{c(),document.getElementById(\"p5-version\")?.addEventListener(\"change\",s),document.getElementById(\"p5-easing-version\")?.addEventListener(\"change\",s)});\n"}],"styles":[{"type":"inline","content":"*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{margin:0;height:100%;display:flex;justify-content:space-between;align-items:center;flex-direction:column}[data-astro-cid-j7pv25f6]{font-family:Avenir,Montserrat,Corbel,URW Gothic,source-sans-pro,sans-serif}main[data-astro-cid-j7pv25f6]{font-weight:400;display:flex;flex-direction:column;align-items:center;gap:1rem;max-width:60ch;padding:16px}main[data-astro-cid-j7pv25f6] a[data-astro-cid-j7pv25f6]#download-link{display:inline-block;padding:1rem 2rem;background-color:#f0f0f0;color:#333;text-decoration:none;border-radius:0rem;transition:all .25s;max-width:fit-content}main[data-astro-cid-j7pv25f6] a[data-astro-cid-j7pv25f6]#download-link:hover{background-color:tomato;color:#f0f0f0}footer[data-astro-cid-j7pv25f6]{padding:16px;font-size:.8rem}.version-selector[data-astro-cid-j7pv25f6]{margin:1rem 0}.version-selector[data-astro-cid-j7pv25f6] summary[data-astro-cid-j7pv25f6]{cursor:pointer;font-size:.9rem;color:#666;margin-bottom:.5rem}.version-controls[data-astro-cid-j7pv25f6]{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;padding:.5rem 0}.version-controls[data-astro-cid-j7pv25f6] label[data-astro-cid-j7pv25f6]{font-size:.85rem;color:#333}.version-controls[data-astro-cid-j7pv25f6] select[data-astro-cid-j7pv25f6]{margin-left:.25rem;padding:.25rem;font-size:.8rem;border:1px solid #ccc;background:#fff}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/tomato/Documents/inpyjamas/p5kit.inpyjamas.dev/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/package@_@ts":"pages/api/package.astro.mjs","\u0000@astro-page:src/pages/api/versions@_@ts":"pages/api/versions.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_SptJ-Cvp.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.BVgYL2Eo.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/favicon.svg","/og.png"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"wf4u/rgGRUnw0hgy1NeC7+6P9rTSPp7vkNuCMFRLV8g=","experimentalEnvGetSecretEnabled":false});

export { manifest };
