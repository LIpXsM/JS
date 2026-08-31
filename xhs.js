/**
 * 小红书核心版本伪装脚本（高性能轻量版）
 */

const targetVersion = "9.45";
const targetBuild = 9450825;
const targetBuildStr = "9450825";

if (typeof $response !== "undefined") {
    try {
        let obj = JSON.parse($response.body);
        if (obj && obj.data) {
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
    let headers = $request.headers;

    // 针对核心字段进行快速精准替换
    for (let key in headers) {
        let lower = key.toLowerCase();
        if (lower === "xy-platform-info" || lower === "xy-common-params") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuildStr}`);
        } else if (lower === "user-agent") {
            headers[key] = headers[key]
                .replace(/discover\/[^\s]+/, `discover/${targetVersion}`)
                .replace(/Version\/[^\s]+/, `Version/${targetVersion}`)
                .replace(/Build\/[^\s\)]+/, `Build/${targetBuildStr}`);
        }
    }

    $done({ headers: headers });
} else {
    $done({});
}
