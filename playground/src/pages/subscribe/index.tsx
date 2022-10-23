import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Store = {
  first: string;
  second: string;
};

type Context<State> = {
  getStore: () => State;
  setStore: (v: Partial<State>) => void;
};

type SubscribeFn = () => void;

function createContainer<State>(initialValue: State) {
  const context = createContext<Context<State>>(null as unknown as Context<State>);

  const subscribers = new Set<SubscribeFn>();
  const subscribe = (fn: SubscribeFn) => {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  };
  const useContainer = () => {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
      return subscribe(() => forceUpdate((v) => v + 1));
    }, []);
    const { setStore, getStore } = useContext(context);
    return {
      store: getStore(),
      setStore,
    };
  };

  const Provider = (props: { children: React.ReactNode }) => {
    const { Provider } = context;
    const value = useRef<State>(initialValue);
    const setStore: Context<State>['setStore'] = (v) => {
      value.current = {
        ...value.current,
        ...v,
      };
      subscribers.forEach((callback) => callback());
    };
    return (
      <Provider
        {...props}
        value={{
          getStore: () => value.current,
          setStore,
        }}
      />
    );
  };

  return {
    Provider,
    useContainer,
  };
}

const { Provider, useContainer } = createContainer<Store>({
  first: '',
  second: '',
});

function Card() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/selector');
  };
  return (
    <Provider>
      <>
        <div className="p-3 border-4">
          Card
          <Form name="first form" />
          <Form name="second form" />
        </div>
        <button className="mt-4" onClick={handleNext}>
          next: use subscribe with selector
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
  const { setStore, store } = useContainer();
  return (
    <div>
      input: {name}
      <input
        className="border-2 block m-3"
        type="text"
        value={store[name]}
        onChange={(e) => setStore({ [name]: e.target.value })}
      />
    </div>
  );
}

export default Card;
