/**
 * 小红书版本伪装与屏蔽更新脚本
 */

const targetVersion = "9.45";
const targetBuild = 9450825;
const targetBuildStr = "9450825";

if (typeof $response !== "undefined") {
    // 处理响应体：修改服务端返回的数据为空版本更新
    try {
        let obj = JSON.parse($response.body);
        if (obj.data) {
            obj.data.appVersionName = targetVersion;
            obj.data.appVersionCode = targetBuild;
            obj.data.items = [];
            obj.data.invalidVersions = [];
            $done({ body: JSON.stringify(obj) });
        } else {
            $done({});
        }
    } catch (e) {
        $done({});
    }
} else if (typeof $request !== "undefined") {
    // 处理请求头和请求体：伪装客户端版本号
    let headers = $request.headers;
    let body = $request.body;

    // 1. 修改 Headers
    if (headers["xy-platform-info"]) {
        headers["xy-platform-info"] = headers["xy-platform-info"]
            .replace(/version=[^&]+/, `version=${targetVersion}`)
            .replace(/build=[^&]+/, `build=${targetBuildStr}`);
    }

    if (headers["xy-common-params"]) {
        headers["xy-common-params"] = headers["xy-common-params"]
            .replace(/version=[^&]+/, `version=${targetVersion}`)
            .replace(/build=[^&]+/, `build=${targetBuildStr}`);
    }

    if (headers["User-Agent"] || headers["user-agent"]) {
        let uaKey = headers["User-Agent"] ? "User-Agent" : "user-agent";
        headers[uaKey] = headers[uaKey]
            .replace(/discover\/[^\s]+/, `discover/${targetVersion}`)
            .replace(/Version\/[^\s]+/, `Version/${targetVersion}`)
            .replace(/Build\/[^\s\)]+/, `Build/${targetBuildStr}`);
    }

    $done({ headers: headers, body: body });
} else {
    $done({});
}
