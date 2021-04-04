import * as React from 'react';
import { INITIAL_MANGA_STATE } from '../models/constants';
import { MangaAction, MangaContextType, MangaState } from '../models/types';

type MangaProviderProps = {
  children: React.ReactNode
};

const MangaContext = React.createContext<MangaContextType | undefined>(undefined);

const mangaReducer = (state: MangaState, action: MangaAction) => {
  switch (action.type) {
    case 'setPages': {
      return { ...state, pages: state.pages.concat([action.payload]) };
    };
    case 'currPage': {
      return { ...state, page: action.payload };
    }
    case 'nextPage': {
      return { ...state, currPage: state.currPage + 1 };
    };
    case 'prevPage': {
      return { ...state, currPage: state.currPage - 1 };
    };
    default: {
      throw new Error('Unhandled action type');
    };
  };
};

const MangaProvider = ({ children }: MangaProviderProps) => {
  const [state, dispatch] = React.useReducer(mangaReducer, INITIAL_MANGA_STATE);

  return (
    <MangaContext.Provider value={{ state, dispatch }}>
      {children}
    </MangaContext.Provider>
  );

};

const useManga = () => {
  const context = React.useContext(MangaContext);
  if (context === undefined) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};

export { MangaProvider, useManga };