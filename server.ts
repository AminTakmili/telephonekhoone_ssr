import { environment } from './src/environments/environment';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';

import * as express from 'express';
import * as https from 'https';

import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  server.get('/robots.txt', async (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.write(
      `User-agent:
       GooglebotDisallow:User-agent:
       googlebot-imageDisallow:User-agent: 
      googlebot-mobileDisallow:User-agent:
       MSNBotDisallow:User-agent: 
      psbotDisallow:User-agent: SlurpDisallow:User-agent: yahoo-mmcrawlerDisallow:User-agent: yahoo-blogs/v3.9Disallow:User-agent: teomaDisallow:User-agent: ScrubbyDisallow:User-agent: ia_archiverDisallow:User-agent: *Disallow: /login/Disallow: /profile-consultant/Disallow: /profile/`
    );
    res.write(`Sitemap: ${getUrl(req)}sitemap.xml`);
    res.end();
  });

  return server;
}

function getUrl(req: any) {
  // let base_url: string = req.headers['x-forwarded-host'].toString();
  // base_url = req.headers['x-forwarded-proto'] + "://" + base_url.split(":")[0];
  // return base_url;
  if (process.env.NODE_ENV === "development") {
    let base_url: string = req.headers['x-forwarded-host'].toString();
    base_url = req.headers['x-forwarded-proto'] + "://" + base_url.split(":")[0];
    return base_url.slice(0, -1);
  }
  if (process.env.NODE_ENV === "production") {
    let base_url: string = req.headers['x-forwarded-host'].toString();
    base_url = req.headers['x-forwarded-proto'] + "://" + base_url.split(":")[0];
    return base_url;
  }
}

function run(): void {
  const server = app();

  //*HTTPS && SERVER
  // if (process.env.NODE_ENV === 'production') {
    // const portHttps = process.env.PORT || environment.SSL_PORT;
    // const httpsServer = https.createServer(
    //   {
    //     key: readFileSync(environment.SSL_KEY),
    //     cert: readFileSync(environment.SSL_CERT),
    //     rejectUnauthorized: false,
    //     requestCert: false,
    //   },
    //   server
    // );
    // httpsServer.listen(portHttps, () => {
    //   console.log(
    //     `Node Express server listening on https://localhost:${portHttps}`
    //   );
    // });
  // }
  //*HTTP && local
  // if (process.env.NODE_ENV === 'development') {
  const portHttp = process.env.PORT || 4000;
  server.listen(portHttp, () => {
    console.log(
      `Node Express server listening on http://localhost:${portHttp}`
    );
  });
  // }
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
