# ig-catalonia-polltracker

Polltracker and other graphics for the Catalonia 2017 regional election

## Data
The data from this app comes from a Bertha spreadsheet that is manually updated. Ask Aleks W. for access.

## To regenerate with new data
1) Add the new data to the above spreadsheet (changing column names may cause problems, see below)
2) In the #graphics-dev channel on Slack, command build bot to rebuild this app: `buildbot build catalonia-polltracker`
3) The s3 url where the latest svg image is hosted should be overwritten with the
new image within a few minutes. The new image should also be visible here:

## Running locally
1) Git clone the app
2) Run `npm run build` to create new files that will be visible in the `dist` folder of the app. When you do this, the app will grab the latest data from the spreadsheet, reflecting any new changes in there.
3) If you want to tweak the CSS or JS, unfortunately you need to point the browser at your file in the dist folder, run `npm run build` after every change, and hit refresh to see the change.


## Problems?
Changing column names - especially party names may cause problems.
Party names in the spreadsheet need to match party names in the app: [in this line in index.js](https://github.com/ft-interactive/catalonia-polltracker/blob/master/index.js#L17) (capitalisation does not matter, but spelling does!)
If you want a new party to show in the graphic, add it to the array in index.js linked above.

## How the app works
This app uses the pattern of rendering a D3 graph on the server, using JSDOM to allow for a virtual dom to created and manipulated on the server.
The D3 chart is written on this virtual dom.
The output is several files written to the `dist` folder - static svgs of the charts.
When the app is built and deployed on Circle, the whole app is written to S3, the static files inside `dist` can be accessed from there. 
