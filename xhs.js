// 小红书版本伪装 - 修复版（仅改header，不改body）
const TARGET_VERSION = "9.45";
const TARGET_BUILD = "9450825";

function modifyHeaders(headers) {
  if (!headers) return headers;
  // User-Agent
  if (headers["User-Agent"] || headers["user-agent"]) {
    let ua = headers["User-Agent"] || headers["user-agent"];
    ua = ua.replace(/discover\/[\d.]+/, `discover/${TARGET_VERSION}`)
           .replace(/Version\/[\d.]+/, `Version/${TARGET_VERSION}`)
           .replace(/Build\/\d+/, `Build/${TARGET_BUILD}`);
    headers["User-Agent"] = ua;
    headers["user-agent"] = ua;
  }
  // xy-platform-info
  if (headers["xy-platform-info"]) {
    headers["xy-platform-info"] = headers["xy-platform-info"]
      .replace(/version=[\d.]+/, `version=${TARGET_VERSION}`)
      .replace(/build=\d+/, `build=${TARGET_BUILD}`);
  }
  // xy-common-params
  if (headers["xy-common-params"]) {
    headers["xy-common-params"] = headers["xy-common-params"]
      .replace(/version=[\d.]+/, `version=${TARGET_VERSION}`)
      .replace(/build=\d+/, `build=${TARGET_BUILD}`);
  }
  return headers;
}

if (typeof $request !== "undefined") {
  $request.headers = modifyHeaders($request.headers);
  $done({ headers: $request.headers });
} else {
  $done({});
}
