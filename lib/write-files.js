const fs = require('fs');


function writeChartToFile(chartContainer, size) {
	const doctype = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;
	const markup = doctype + chartContainer.html().trim();

  // Save the resulting SVG
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(`${dir}/catalonia-latest-${size}.svg`, markup);
}

function writeHoldingPage(timestamp, dir){

  const dirPath = `../${dir}`;

  const htmlStart = fs.readFileSync('display-page-start.html');
  const htmlEnd = `</body></html>`;
  const fileList = fs.readdirSync(dirPath).reverse().filter(file => !file.includes('index') );
  const pictureMarkup = fileList.map((file) => {
    return `<h2>${file.split('-').splice(2).join(" ")}</h2>
            <a href='${s3Dir}${file}'>${s3Dir}${file}</a>
            <object type='image/svg+xml' data='${file}' style="display:block">
            </object>`;
  })
  const markup = htmlStart + pictureMarkup + htmlEnd;

  fs.writeFileSync(`${dir}/index.html`, markup);
}


module.exports = { writeChartToFile, writeHoldingPage };
