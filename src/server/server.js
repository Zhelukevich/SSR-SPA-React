
import express from 'express';
import ReactDOMServer from 'react-dom/server';

import { App } from '../App';

import { indexTemplate } from './indexTemplate';


const app = express();
const PORT = process.env.PORT || 3000;

app.use('/static', express.static('./dist/client', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  },
}));

app.get('*', (req, res) => {
  res.send(
    indexTemplate(ReactDOMServer.renderToString(App())),
  );
});


app.listen(PORT, () => {
  console.log(`server started on port http://localhost:${PORT}`);
});