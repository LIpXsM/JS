const V = "9.45", B = "9450825";

function fix(h) {
  if (!h) return h;
  let ua = h["User-Agent"] || h["user-agent"] || "";
  if (ua) {
    ua = ua.replace(/discover\/[\d.]+/, `discover/${V}`)
           .replace(/Version\/[\d.]+/, `Version/${V}`)
           .replace(/Build\/\d+/, `Build/${B}`);
    h["User-Agent"] = h["user-agent"] = ua;
  }
  if (h["xy-platform-info"]) {
    h["xy-platform-info"] = h["xy-platform-info"]
      .replace(/version=[\d.]+/, `version=${V}`)
      .replace(/build=\d+/, `build=${B}`);
  }
  if (h["xy-common-params"]) {
    h["xy-common-params"] = h["xy-common-params"]
      .replace(/version=[\d.]+/, `version=${V}`)
      .replace(/build=\d+/, `build=${B}`);
  }
  return h;
}

$done({headers: fix($request.headers)});
