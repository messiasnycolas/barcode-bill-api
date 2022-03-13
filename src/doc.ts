import { JsonObject } from 'swagger-ui-express';

export const doc: JsonObject = {
    'swagger': '2.0',
    'info': {
      'description': 'This is a barcode bill handling API. Locally triggered by [http://localhost:3000](http://localhost:3000)',
      'version': '0.0.1',
      'title': 'Barcode Bill API',
      'contact': {
        'email': 'nycolaspmessias@gmail.com'
      }
    },
    'paths': {
      '/boleto': {
        'get': {
          'tags': [
            'Endpoints'
          ],
          'summary': 'Validate and outputs information about given line code',
          'produces': [
            'application/json'
          ],
          'parameters': [
            {
              'in': 'query',
              'name': 'line code',
              'description': 'Line Code to extract information',
              'required': true,
              'type': 'string'
            }
          ],
          'responses': {
            '200': {
              'description': 'OK',
              'schema': {
                '$ref': '#/definitions/ApiResponse'
              }
            },
            '400': {
              'description': 'Invalid input'
            }
          }
        }
      }
    },
    'definitions': {
      'ApiResponse': {
        'type': 'object',
        'properties': {
          'amount': {
            'type': 'string',
            'example': '170.22'
          },
          'barCode': {
            'type': 'string',
            'example': '07792894000000170227777011647204422418429101'
          },
          'expirationDate': {
            'type': 'string',
            'example': '2022-03-30'
          }
        }
      }
    },
    'externalDocs': {
      'description': 'GitHub Repository',
      'url': 'https://github.com/messiasnycolas/barcode-bill-api'
    }
  }