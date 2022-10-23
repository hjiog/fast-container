import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shallowequal from 'shallowequal';

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
  const useContainer = <P,>(selector: (v: State) => P) => {
    const { setStore, getStore } = useContext(context);
    const preStore = useRef<P>(selector(getStore()));
    const [, forceUpdate] = useState(0);
    useEffect(() => {
      const sub = subscribe(() => {
        const store = selector(getStore());
        const isEqual = shallowequal(preStore.current, store);
        preStore.current = store;
        if (!isEqual) forceUpdate((v) => v + 1);
      });
      return sub;
    }, [getStore, selector]);
    return {
      store: preStore.current,
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
    navigate('/auto');
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
          next: use subscribe without selector
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
  const { setStore, store: value } = useContainer((pre) => pre[name]);
  return (
    <div>
      input: {name}
      <input
        className="border-2 block m-3"
        type="text"
        value={value}
        onChange={(e) => setStore({ [name]: e.target.value })}
      />
    </div>
  );
}

export default Card;
