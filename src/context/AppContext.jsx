import { createContext, useContext, useReducer, useCallback } from 'react';
import { INITIAL_APPOINTMENTS } from '../data';

// ─── State shape ──────────────────────────────────────────────────────────────
const initialState = {
  appointments: INITIAL_APPOINTMENTS,
  nextId: INITIAL_APPOINTMENTS.length + 1,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_APPOINTMENT': {
      const appt = { ...action.payload, id: state.nextId, status: 'pending' };
      return {
        ...state,
        appointments: [...state.appointments, appt],
        nextId: state.nextId + 1,
      };
    }
    case 'CONFIRM_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.id ? { ...a, status: 'confirmed' } : a
        ),
      };
    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(a => a.id !== action.id),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addAppointment = useCallback((appt) => {
    dispatch({ type: 'ADD_APPOINTMENT', payload: appt });
    // Return the id that will be assigned (nextId before dispatch)
    return state.nextId;
  }, [state.nextId]);

  const confirmAppointment = useCallback((id) => {
    dispatch({ type: 'CONFIRM_APPOINTMENT', id });
  }, []);

  const cancelAppointment = useCallback((id) => {
    dispatch({ type: 'CANCEL_APPOINTMENT', id });
  }, []);

  return (
    <AppContext.Provider value={{
      appointments: state.appointments,
      addAppointment,
      confirmAppointment,
      cancelAppointment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
