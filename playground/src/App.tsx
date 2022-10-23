import './App.css';
import 'virtual:uno.css';

import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import routes from '~react-pages';

import { Preview } from '@/components/Preview';

const Layout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>
        <div className="flex flex-row justify-between h-screen gap-10">
          <div className="h-full overflow-auto border-4 flex-1">
            <Preview />
          </div>
          <div className="flex-1">{useRoutes(routes)}</div>
        </div>
      </Layout>
    </Suspense>
  );
};

export default App;
