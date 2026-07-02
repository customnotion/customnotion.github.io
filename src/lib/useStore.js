import { useSyncExternalStore } from 'react';
import { store } from './storage.js';

/** Subscribe a component to the local data store. Re-renders on any change. */
export function useSiteData() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
