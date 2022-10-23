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

const context = createContext<Context>(null as unknown as Context);
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
      }}
    >
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
  return (
    <div className="border-2 p-3 m-4">
      {name}
      <div>
        <Input name="first" />
        <Input name="second" />
      </div>
    </div>
  );
}

function Input({ name }: { name: 'first' | 'second' }) {
  const { setStore, store } = useContext(context);
  return (
    <div>
      input: {name}
      <input
        className="border-2 block m-3"
        type="text"
        value={store[name]}
        onChange={(e) => setStore((v) => ({ ...v, [name]: e.target.value }))}
      />
    </div>
  );
}

export default Card;
