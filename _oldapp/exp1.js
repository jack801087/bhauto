
// Download to a directory and save with the original filename
const options = {
  url: 'https://www.residentadvisor.net/images/profiles/ladymaru.jpg',
  dest: 'C:\\Users\\Giacomo\\Desktop\\bh_20181208\\newname.jpg'                  // Save to /path/to/dest/image.jpg
}

download.image(options)
  .then(({ filename, image }) => {
    console.log('File saved to', filename)
  })
  .catch((err) => {
    console.error(err)
  })
