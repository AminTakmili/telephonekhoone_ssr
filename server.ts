import { environment } from './src/environments/environment';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';

import * as express from 'express';
import * as https from 'https';

import { join } from 'path';
import * as _ from 'lodash';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync } from 'fs';
import { ErrorLevel, SitemapIndexStream, SitemapIndexStreamOptions, SitemapItem, SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';

const axios = require('axios');
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine

  server.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');


    try {
      // const smis = new SitemapIndexStream({level : ErrorLevel.WARN });
      const sitemapStream = new SitemapIndexStream({
        // This is required because we will be adding sitemap entries using relative URLs
        level: ErrorLevel.WARN,

      });
      const pipeline = sitemapStream.pipe(createGzip());


      sitemapStream.write({ url: getUrl(req) + "static-page.xml" });
      sitemapStream.write({ url: getUrl(req) + "categories-sitemap.xml" });
      sitemapStream.write({ url: getUrl(req) + "advisers-sitemap.xml" });

      sitemapStream.end();

      pipeline.pipe(res).on('error', (error: Error) => {
        throw error;
      });



    } catch (error) {
      console.error(error);
      res.status(500).end();
    }



  });

  server.get('/static-page.xml', async (req, res) => {
    try {

      // const type = _.upperFirst(_.camelCase(req.params.type));
      // const SiteMapIndex = req.params.index;

      const sitemapStream = new SitemapStream({
        // This is required because we will be adding sitemap entries using relative URLs
        hostname: getUrl(req)
      });

      const pipeline = sitemapStream.pipe(createGzip());

      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip');

      // static pages
      const StaticPages = [
        "/",
        "/about",
        "/contact-us",
        "/rules",
      ]
      for (const entry of StaticPages) {
        sitemapStream.write({
          url: entry,
        } as SitemapItem);
      }

      //dybnamic limited site map

      // Stream write the response

      // Stream write the response
      sitemapStream.end();


      pipeline.pipe(res).on('error', (error: Error) => {
        throw error;
      });


    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });

  server.get('/categories-sitemap.xml', async (req, res) => {

    try {

      const sitemapStream = new SitemapStream({
        // This is required because we will be adding sitemap entries using relative URLs
        hostname: getUrl(req)
      });

      const pipeline = sitemapStream.pipe(createGzip());

      let siteMap = null;
      try {
        siteMap = await axios({
          method: 'get',
          url: 'https://app.telephonkhoneh.com/api/allCategories'
        });

        console.log(siteMap);
        
        // console.log(siteMap.data);
        // console.log(siteMap.data.length);
        // console.log(siteMap.data instanceof Array);
        
        if (siteMap !== null && siteMap.data.length > 0) {
          res.header('Content-Type', 'application/xml');
          res.header('Content-Encoding', 'gzip');
          for (const entry of siteMap.data) {

            let imageObject = [];
            if(entry.loc){
              for (const img of entry.images) {
                // console.log(img);
                
                imageObject['url'] = img;
                imageObject['caption'] = img.caption;
                imageObject['caption'] = entry.name;
                imageObject.push(imageObject)
              }
              sitemapStream.write({
                url: entry.level === 1 ? "c/"+entry.loc : "c/m/"+entry.loc,
                changefreq: "monthly",
                lastmod: entry.lastModified,
                priority: .9,
                img: imageObject,
              } as SitemapItem);
            }
            
          }
          // Stream write the response
          sitemapStream.end();

        } else {
          res.render(indexHtml, {
            req,
            providers: [
              { provide: APP_BASE_HREF, useValue: req.baseUrl },
            ]
          })
        }
        pipeline.pipe(res).on('error', (error: Error) => {
          throw error;
        });

      } catch (error) {
      
        if (error.response.status !== 200) {
          res.render(indexHtml, {
            req,
            providers: [
              { provide: APP_BASE_HREF, useValue: req.baseUrl },
            ]
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });

  server.get('/advisers-sitemap.xml', async (req, res) => {

    try {

      const sitemapStream = new SitemapStream({
        // This is required because we will be adding sitemap entries using relative URLs
        hostname: getUrl(req)
      });

      const pipeline = sitemapStream.pipe(createGzip());

      let siteMap = null;
      try {
        siteMap = await axios({
          method: 'get',
          url: 'https://app.telephonkhoneh.com/api/allConsultants'
        });

        // console.log(siteMap.data);
        // console.log(siteMap.data.length);
        // console.log(siteMap.data instanceof Array);
        
        if (siteMap !== null && siteMap.data.length > 0) {
          res.header('Content-Type', 'application/xml');
          res.header('Content-Encoding', 'gzip');
          for (const entry of siteMap.data) {

            let imageObject = [];
            
            for (const img of entry.images) {
              // console.log(img);
              
              imageObject['url'] = img;
              imageObject['caption'] = img.caption;
              imageObject.push(imageObject)
            }
            sitemapStream.write({
              url: "c/m/"+entry.loc,
              changefreq: "monthly",
              lastmod: entry.lastModified,
              priority: .9,
              img: imageObject,
            } as SitemapItem);
          }
          // Stream write the response
          sitemapStream.end();

        } else {
          res.render(indexHtml, {
            req,
            providers: [
              { provide: APP_BASE_HREF, useValue: req.baseUrl },
            ]
          })
        }
        pipeline.pipe(res).on('error', (error: Error) => {
          throw error;
        });

      } catch (error) {
      
        if (error.response.status !== 200) {
          res.render(indexHtml, {
            req,
            providers: [
              { provide: APP_BASE_HREF, useValue: req.baseUrl },
            ]
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });


  server.get('/robots.txt', async (req, res) => {
    res.header('Content-Type', 'text/plain');

    res.write(`User-agent: Googlebot
Disallow:

User-agent: googlebot-image
Disallow:

User-agent: googlebot-mobile
Disallow:

User-agent: MSNBot
Disallow:

User-agent: psbot
Disallow:

User-agent: Slurp
Disallow:

User-agent: yahoo-mmcrawler
Disallow:

User-agent: yahoo-blogs/v3.9
Disallow:

User-agent: teoma
Disallow:

User-agent: Scrubby
Disallow:

User-agent: ia_archiver
Disallow:

User-agent: *
Disallow: /sign-up/
Disallow: /login/
Disallow: /profile/
Disallow: /profile-consultant/
Sitemap: https://www.telephonekhooneh.com/sitemap.xml
`);


    res.end();
  });

  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function getUrl(req: any) {


  return "https://www.telephonekhooneh.com/";

}

function run(): void {
  const server = app();

  //*HTTPS && SERVER
  // if (process.env.NODE_ENV === 'production') {
  const portHttps = process.env.PORT || environment.SSL_PORT;
  const httpsServer = https.createServer(
    {
      key: readFileSync(environment.SSL_KEY),
      cert: readFileSync(environment.SSL_CERT),
      rejectUnauthorized: false,
      requestCert: false,
    },
    server
  );
  httpsServer.listen(portHttps, () => {
    console.log(
      `Node Express server listening on https://localhost:${portHttps}`
    );
  });
  // }
  //*HTTP && local
  // if (process.env.NODE_ENV === 'development') {
  // const portHttp = process.env.PORT || 4000;
  // server.listen(portHttp, () => {
  //   console.log(
  //     `Node Express server listening on http://localhost:${portHttp}`
  //   );
  // });
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
