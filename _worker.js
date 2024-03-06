
// 部署完成后在网址后面加上这个，获取节点，/?token=xxoo

const mytoken = 'xxoo'; //可以随便取

//自建节点
const MainData = `
vless://xxx
vmess://xxx
`

//订阅url，可多个，也可为0
const urls = [
	'https:xxx.com',
  ''
	// 添加更多订阅,支持base64
];

let subconverter = "back.889876.xyz"; //在线订阅转换后端
let subconfig = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"; //订阅配置文件

//addEventListener('fetch', event => { event.respondWith(handleRequest(event.request)) })

export default {
	async fetch (request) {
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		//const tag = url.searchParams.get('tag');
		const token = url.searchParams.get('token'); // Get the token from the URL

		if (!(token == mytoken || url.pathname.includes("/"+ mytoken))) {
			//await sendMessage("#Token错误信息", request.headers.get('CF-Connecting-IP'), `Invalid Token: ${token}`);
			return new Response('Invalid token???', { status: 403 });
		}

		let req_data = "";
		req_data += MainData
		const responses = await Promise.all(urls.map(url => fetch(url,{
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		})));
			
		for (const response of responses) {
			if (response.ok) {
				const content = await response.text();
				req_data += atob(content) + '\n';
			}
		}

		await sendMessage("#获取订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);

		if (userAgent.includes('clash')) {
			const subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
				
				if (!subconverterResponse.ok) {
					throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				
				const subconverterContent = await subconverterResponse.text();
				
				return new Response(subconverterContent, {
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			} catch (error) {
				return new Response(`Error: ${error.message}`, {
					status: 500,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
		} else if (userAgent.includes('sing-box') || userAgent.includes('singbox')) {
			const subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
				
				if (!subconverterResponse.ok) {
					throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				
				const subconverterContent = await subconverterResponse.text();
				
				return new Response(subconverterContent, {
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			} catch (error) {
				return new Response(`Error: ${error.message}`, {
					status: 500,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
		} else {
			const utf8Encoder = new TextEncoder();
			const encodedData = utf8Encoder.encode(req_data);
			const base64Data = btoa(String.fromCharCode.apply(null, encodedData));
			return new Response(base64Data);
		}
	}
};