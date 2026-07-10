let body = $response.body;

if (body) {
    const safeCss = `
    <style type="text/css">
        .mda {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        .imgad31, .imgad32, .imgad33, .imgad35,
        div[class*="imgad"] {
            display: none !important;
            width: 0 !important;
        }

        .van-tab a[href*="xbbbbing.com"],
        .van-tab a[href*="vlrubju.com"],
        .van-tab a[href*="formatj.com"],
        .van-tab a[href*="vrd2sdggs1swesh3sghs1dg"],
        .van-tab a[href*="fdep4jiowe8sdfew1wry"] {
            display: none !important;
            pointer-events: none !important;
        }

        .van-tab:has(a[href*="xbbbbing.com"]),
        .van-tab:has(a[href*="vlrubju.com"]) {
            display: none !important;
        }

        .ad-float, .ad-banner {
            display: none !important;
        }
    </style>
    `;

    if (body.indexOf('</head>') !== -1) {
        body = body.replace('</head>', safeCss + '</head>');
    } else {
        body = body.replace('</body>', safeCss + '</body>');
    }

    body = body.replace(/vant\.showDialog\(\{[\s\S]*?\}\);/g, '');

    $done({ body });
} else {
    $done({});
}
