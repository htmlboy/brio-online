# Brío online

Static publication for https://online.briorol.com/.

This repository contains compiled website files. The application source is maintained separately. Changes pushed to main are published by GitHub Pages. Firebase provides the online services; no hosting is provided by Netlify.

Firebase browser configuration is supplied to the Pages artifact from the repository Actions secret FIREBASE_CLIENT_CONFIG. The committed placeholder contains no API key. Runtime configuration remains public on the website. No service-account keys or publishing tokens are included.
