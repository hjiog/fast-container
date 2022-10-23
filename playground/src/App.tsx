import './App.css';
import 'virtual:uno.css';
import '@arco-design/web-react/dist/css/arco.css';

import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import routes from '~react-pages';

import { Layout } from './components/Layout';

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>{useRoutes(routes)}</Layout>
    </Suspense>
  );
};

export default App;
