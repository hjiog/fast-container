import { createContext, memo, useContext, useState } from 'react';
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

const InputMemo = memo(Input);
const FormMemo = memo(Form);
const CardMemo = memo(Card);

function Card() {
  const [store, setStore] = useState({
    first: '',
    second: '',
  });
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/subscribe');
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
          CardMemo
          <FormMemo name="first form" />
          <FormMemo name="second form" />
        </div>
        <button className="mt-4" onClick={handleNext}>
          next: use subscribe
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
        <InputMemo name="first" />
        <InputMemo name="second" />
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

export default CardMemo;
