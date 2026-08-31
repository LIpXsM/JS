/*
 * 小红书 iOS 旧版 9.10 (9100815) -> 9.45 (9450825) 请求版本伪装
 *
 * Loon 3.5.1 (983)+ 规则示例（将 GitHub RAW 地址替换为自己的）：
 * request if ${url} ~= /^https?:\/\/([a-z0-9-]+\.)?xiaohongshu\.com\//i then script("https://raw.githubusercontent.com/<OWNER>/<REPO>/<BRANCH>/loon-xhs-version-spoof.js") with tag="XHS 9.45 compatibility", timeout=10
 *
 * 旧版规则示例：
 * http-request ^https?:\/\/([a-z0-9-]+\.)?xiaohongshu\.com\/ script-path=https://raw.githubusercontent.com/<OWNER>/<REPO>/<BRANCH>/loon-xhs-version-spoof.js,tag=XHS 9.45 compatibility,timeout=10,enable=true
 *
 * 只改 HAR 中已证实的版本字段：User-Agent、xy-common-params、
 * xy-platform-info，以及 URL 查询参数 build。不要截取或改写请求体，
 * 因为请求体可能包含签名或二进制埋点。
 */

const OLD_VERSION = "9.10";
const OLD_BUILD = "9100815";
const TARGET_VERSION = "9.45";
const TARGET_BUILD = "9450825";

const headers = { ...$request.headers };

function headerName(name) {
  return Object.keys(headers).find((key) => key.toLowerCase() === name);
}

function updateHeader(name, transform) {
  const key = headerName(name);
  if (key && typeof headers[key] === "string") {
    headers[key] = transform(headers[key]);
  }
}

// 仅替换 User-Agent 里明确的 App 版本片段，保留机型、系统与网络信息。
updateHeader("user-agent", (value) => value
  .replace(/discover\/9\.10(?=\s|$)/g, `discover/${TARGET_VERSION}`)
  .replace(/Version\/9\.10(?=\s|$)/g, `Version/${TARGET_VERSION}`)
  .replace(/Build\/9100815(?=\s|$)/g, `Build/${TARGET_BUILD}`)
);

// HAR 表明这两个参数头也携带 build/version；按键值替换，避免误伤设备 ID 等字段。
function replaceCommonParams(value) {
  return value
    .replace(/(^|&)version=9\.10(?=&|$)/g, `$1version=${TARGET_VERSION}`)
    .replace(/(^|&)build=9100815(?=&|$)/g, `$1build=${TARGET_BUILD}`);
}

updateHeader("xy-common-params", replaceCommonParams);
updateHeader("xy-platform-info", replaceCommonParams);

// 启动接口在 URL 中显式提交 build，例如 system_service/launch?build=9100815。
const url = $request.url
  .replace(/([?&])build=9100815(?=&|$)/g, `$1build=${TARGET_BUILD}`);

$done({ url, headers });
