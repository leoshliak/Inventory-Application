const fs = require('fs');
const path = require('path');

function renderWithLayout(res, view, options = {}) {
  res.render(view, options, (err, html) => {
    if (err) throw err;
    res.render('layout', { ...options, body: html });
  });
}

function deleteImage(filePath) {
  const fullPath = path.join(__dirname, '.', 'public', filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
    } else {
      console.log('Image deleted:', fullPath);
    }
  });
}

module.exports = {
    renderWithLayout,
    deleteImage
}