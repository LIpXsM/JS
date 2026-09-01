/**
 * 小红书 Launch 启动配置接口专属处理脚本
 */

const targetVersion = "9.45";
const targetBuild = "9450825";

if (typeof $response !== "undefined") {
    // 处理响应体：清空强更弹窗配置
    try {
        let obj = JSON.parse($response.body);
        if (obj && obj.data) {
            // 剔除可能存在的升级配置字段
            if (obj.data.upgrade) delete obj.data.upgrade;
            if (obj.data.force_update) obj.data.force_update = false;
            if (obj.data.app_update) delete obj.data.app_update;
            if (obj.data.pop_window) delete obj.data.pop_window;
            
            $done({ body: JSON.stringify(obj) });
        } else {
            $done({});
        }
    } catch (e) {
        $done({});
    }
} else if (typeof $request !== "undefined") {
    // 处理请求：修改 URL 参数和请求头
    let url = $request.url;
    let headers = $request.headers;

    // 1. 替换 URL Query 里的 build 参数
    url = url.replace(/build=\d+/, `build=${targetBuild}`);

    // 2. 替换请求头中的版本字段
    for (let key in headers) {
        let lower = key.toLowerCase();
        if (lower === "xy-platform-info" || lower === "xy-common-params") {
            headers[key] = headers[key]
                .replace(/version=[^&]+/, `version=${targetVersion}`)
                .replace(/build=[^&]+/, `build=${targetBuild}`);
        } else if (lower === "user-agent") {
            headers[key] = headers[key]
                .replace(/discover\/[^\s]+/, `discover/${targetVersion}`)
                .replace(/Version\/[^\s]+/, `Version/${targetVersion}`)
                .replace(/Build\/[^\s\)]+/, `Build=${targetBuild}`);
        }
    }

    $done({ url: url, headers: headers });
} else {
    $done({});
}
