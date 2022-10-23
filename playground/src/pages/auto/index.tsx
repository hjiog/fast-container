import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Store = {
  first: string;
  second: string;
};

type Context<State extends Record<string, unknown>> = {
  getStore: () => State;
  setStore: (v: Partial<State>) => void;
};

type SubscribeFn = () => void;

function createProxy<State extends Record<string, unknown>>(
  obj: State,
  dep: Set<string>,
) {
  const res = new Proxy(obj, {
    get(target, key, receiver) {
      dep.add(key as string);
      return Reflect.get(target, key, receiver);
    },
  });
  return res;
}

function createContainer<State extends Record<string, unknown>>(initialValue: State) {
  const context = createContext<Context<State>>(null as unknown as Context<State>);

  const subscribers = new Set<SubscribeFn>();
  const subscribe = (fn: SubscribeFn) => {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  };
  const useContainer = () => {
    const { setStore, getStore } = useContext(context);
    const preStore = useRef(getStore());
    const storeKeys = useRef(new Set<string>());
    const targetStore = createProxy(preStore.current, storeKeys.current);
    const [, forceUpdate] = useState(0);
    useEffect(() => {
      const sub = subscribe(() => {
        const store = getStore();
        const isNoEqual = !!Array.from(storeKeys.current).find((key) => {
          return preStore.current[key] !== store[key];
        });
        preStore.current = store;
        if (isNoEqual) forceUpdate((v) => v + 1);
      });
      return sub;
    }, [getStore]);
    return {
      store: targetStore,
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
  return (
    <Provider>
      <>
        <div className="p-3 border-4">
          Card
          <Form name="first form" />
          <Form name="second form" />
        </div>
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
