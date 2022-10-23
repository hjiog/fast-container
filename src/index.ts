import type React from 'react';
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Context<State extends Record<string, unknown>> {
  getStore: () => State;
  setStore: (v: Partial<State>) => void;
}

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

export function createContainer<State extends Record<string, unknown>>(
  initialValue: State,
) {
  const context = createContext<Context<State>>(
    null as unknown as Context<State>,
  );

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
        const isNoEqual = !!Array.from(storeKeys.current).find(key => {
          return preStore.current[key] !== store[key];
        });
        preStore.current = store;
        if (isNoEqual) forceUpdate(v => v + 1);
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
    const setStore: Context<State>['setStore'] = v => {
      value.current = {
        ...value.current,
        ...v,
      };
      subscribers.forEach(callback => callback());
    };
    return createElement(
      Provider,
      {
        value: {
          getStore: () => value.current,
          setStore,
        },
      },
      props.children,
    );
  };

  return {
    Provider,
    useContainer,
  };
}
