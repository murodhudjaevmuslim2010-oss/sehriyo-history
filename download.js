const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson';
const dest = path.join(__dirname, 'assets', 'data', 'provinces.geojson');

console.log('Downloading provinces.geojson...');
const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Download completed: ' + dest);
  });
}).on('error', function(err) {
  fs.unlink(dest, () => {});
  console.error('Error downloading file:', err.message);
});
