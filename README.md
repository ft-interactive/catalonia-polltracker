# ig-catalonia-polltracker

Polltracker and other graphics for the Catalonia 2017 regional election

## Data
The data from this app comes from a Bertha spreadsheet that is manually updated. Ask Aleks W. for access.

## To regenerate with new data
1) Add the new data to the above spreadsheet (changing column names may cause problems, see below)
2) In the #graphics-dev channel on Slack, command build bot to rebuild this app: `buildbot build ig-catalonia-polltracker`
3) The s3 url where the latest svg image is hosted should be overwritten with the
new image within a few minutes. The new image should also be visible here:

## Problems?
Changing column names - especially party names may cause problems.

## What this app does
This app uses the pattern
