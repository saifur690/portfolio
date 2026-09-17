# Publish the fixed portfolio

The live repository was missing the images folder. Its MP4 files were uploaded
at the repository root, while the page requests them under videos/.
The portrait's CSS mask must also be uploaded with the images.

1. Open https://github.com/saifur690/portfolio and select the main branch.
2. Choose Add file > Upload files.
3. Drag the CONTENTS of the publish folder into GitHub: index.html, style.css,
   script.js, project-previews.js, and the images and videos folders.
   Do not upload the publish folder itself or the ZIP file.
4. Commit the uploaded files. After the Pages deployment finishes, hard-refresh
   https://saifur690.github.io/portfolio/ (Ctrl+F5).

Alternatively, extract portfolio-fixed.zip and upload its contents the same way.
Keep images/ and videos/ as folders; do not flatten their files into the root.

Check the portrait, project thumbnails, and centered logo. Hover over each
project on desktop or tap Play preview on mobile to play its video.

To rebuild the upload folder after future changes:

    node prepare-publish.cjs

This validates referenced files, including the portrait mask and filename case,
before copying them. The upload folder contains only files needed by the site.
