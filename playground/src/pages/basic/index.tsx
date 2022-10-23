import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Store = {
  first: string;
  second: string;
};

type Context = {
  store: Store;
  setStore: React.Dispatch<
    React.SetStateAction<{
      first: string;
      second: string;
    }>
  >;
};

const context = createContext<Context>(null as any);
const { Provider } = context;

function Card() {
  const [store, setStore] = useState({
    first: '',
    second: '',
  });
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/memo');
  };
  return (
    <Provider
      value={{
        store,
        setStore,
      }}>
      <>
        <div className="p-3 border-4">
          Card
          <Form name="first form" />
          <Form name="second form" />
        </div>
        <button className="mt-4" onClick={handleNext}>
          next: use memo
        </button>
      </>
    </Provider>
  );
}

function Form({ name }: { name: string }) {
  const { setStore, store } = useContext(context);
  return (
    <div className="border-2 p-3 m-4">
      {name}
      <div>
        <Input
          className="border-2 block m-3"
          value={store?.first}
          onChange={input => setStore(v => ({ ...v, first: input }))}
        />
        <Input
          className="border-2 block m-3"
          value={store?.second}
          onChange={input => setStore(v => ({ ...v, second: input }))}
        />
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      className={className}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

export default Card;
