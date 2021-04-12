# syto-panel

Frontend for `syto-app`.

## Installation

Default configurations assumes that app will work inside syto-app. Therefore paths defined in `.env.example` are pointing to static directory of Django app.

Running in standalone mode is possible although may require changes in API URIs inside store and altering `vue.config.js`.

To run inside syto-app you should clone syto-app repository and set proper paths in `.env` file. Standard commands ie.

    npm install
    npm run serve
    npm run build
    npm run lint

will work but app itself will be accessible at root path of Django development server `http://127.0.0.1:8000/`.
