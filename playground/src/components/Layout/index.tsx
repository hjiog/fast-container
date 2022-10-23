import { Alert } from '@arco-design/web-react';
import { IconQuestionCircle } from '@arco-design/web-react/icon';

import { Preview } from '@/components/Preview';

import { warnTipsMap } from './config';
export const Layout: React.FC<{ children?: React.ReactElement<unknown> | null }> = ({
  children,
}) => {
  const { msg, question, success } =
    Object.entries(warnTipsMap).find(([key]) => location.pathname.includes(key))?.[1] ||
    {};

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between h-screen gap-10">
        <div className="h-full overflow-auto border-4 flex-1">
          <Preview />
        </div>
        <div className="flex-1">
          {children}
          <Alert content={msg} type="info" className="mt-4" />
          {question && (
            <Alert
              content={question}
              icon={<IconQuestionCircle />}
              type="warning"
              className="mt-4"
            />
          )}
          {success && <Alert content={success} type="success" className="mt-4" />}
        </div>
      </div>
    </div>
  );
};
