/**
 * 小红书精准屏蔽更新脚本（仅篡改更新接口响应体，避免触发 406 风控）
 */

const targetVersion = "9.45";
const targetBuild = 9450825;

if (typeof $response !== "undefined") {
    try {
        let fakeBody = {
            code: 0,
            success: true,
            msg: "成功",
            data: {
                appVersionName: targetVersion,
                appVersionCode: targetBuild,
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