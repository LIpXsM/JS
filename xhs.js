/**
 * 小红书精准版本伪装与强更阻断脚本
 */

const targetVersion = "9.45";
const targetBuild = "9450825";

if (typeof $response !== "undefined") {
    // 1. 处理更新检查接口 (shipinfo)
    if ($request.url.indexOf("/api/nike/v4/update/check/shipinfo") !== -1) {
        try {
            let fakeBody = {
                code: 0,
                success: true,
                msg: "成功",
                data: {
                    appVersionName: targetVersion,
                    appVersionCode: parseInt(targetBuild),
                    abi: "arm64",
                    baseType: 6,
                    items: [],
                    invalidVersions: []
                }
            };
            $done({ body: JSON.stringify(fakeBody) });
        } catch (e) {
            $done({});
        }
    } else {
        $done({});
    }
} else if (typeof $request !== "undefined") {
    // 2. 处理核心请求头 (针对 edith, www 等 API)
    let headers = $request.headers;

    for (let key in headers) {
        let lower = key.toLowerCase();
        
        // 精准替换 xy-platform-info
        if (lower === "xy-platform-info") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuild}`);
        }
        // 精准替换 xy-common-params
        else if (lower === "xy-common-params") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuild}`);
        }
        // 精准替换 User-Agent
        else if (lower === "user-agent") {
            headers[key] = headers[key]
                .replace(/discover\/[^\s]+/, `discover/${targetVersion}`)
                .replace(/Version\/[^\s]+/, `Version/${targetVersion}`)
                .replace(/Build\/[^\s\)]+/, `Build/${targetBuild}`);
        }
    }

    $done({ headers: headers });
} else {
    $done({});
}