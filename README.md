# Barcode Bill API

This is a barcode bill handling API.

Install it with the next steps:

Option 1 - local environment
- pre-reqs: nodejs
- clone the project
- run `npm install` in project root
- run `npm run dev` in project root
- open our [endpoint documentation](http://localhost:3000/doc)

Option 2 - container

- pre-reqs: docker
- clone the project
- run `docker build -t barcodebill-api .` in project root
- run `docker run -p 3000:3000 barcodebill-api`
- open our [endpoint documentation](http://localhost:3000/doc)