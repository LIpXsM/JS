/**
 * 小红书全局请求头版本伪装与屏蔽更新脚本
 */

const targetVersion = "9.45";
const targetBuild = 9450825;
const targetBuildStr = "9450825";

if (typeof $response !== "undefined") {
    // 针对更新接口的响应体进行清空处理
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
    // 全局处理小红书所有域名的请求头
    let headers = $request.headers;

    // 遍历所有请求头键名，确保大小写都能被精准替换
    for (let key in headers) {
        let lowerKey = key.toLowerCase();

        // 1. 替换 xy-platform-info
        if (lowerKey === "xy-platform-info") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuildStr}`);
        }

        // 2. 替换 xy-common-params
        if (lowerKey === "xy-common-params") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuildStr}`);
        }

        // 3. 替换 User-Agent
        if (lowerKey === "user-agent") {
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
