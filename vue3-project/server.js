import express from 'express';
import fetch from 'node-fetch';

const app = express();

// 代理接口：前端请求 /proxy-image?url=图片地址
// 需要node server.js单独启动图片服务
app.get('/proxy-image', async (req, res) => {
  const url = req.query.url;
  console.log(`Received request to proxy image: ${url}`);
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    // 请求目标图片，去掉 Referer
    const response = await fetch(url, {
      headers: {
        'Referer': ''   // 强制清空 Referer
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    } else {
      console.log(`Proxied image from ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.set('Content-Type', response.headers.get('content-type') || 'image/webp');
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
