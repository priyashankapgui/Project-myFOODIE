import {create} from 'zustand';

type LoaderState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoaderStore = create<LoaderState>((set) => ({
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
  }));