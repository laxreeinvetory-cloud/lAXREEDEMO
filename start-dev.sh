#!/bin/bash
# Dev server launcher — keeps next dev alive across shell exits.
cd /home/z/my-project
exec /home/z/my-project/node_modules/.bin/next dev -p 3000
