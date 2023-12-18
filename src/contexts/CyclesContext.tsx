import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { 
  addNewCycleAction, 
  interruptCurrentCycleAction, 
  markCurrentCycleAsFinishedAction 
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[],
  activeCycle: Cycle | undefined,
  activeCycleId: string | null,
  amountSecondsPassed: number,
  markCurrentCycleAsFinished: () => void,
  setSecondsPassed: (seconds: number) => void,
  createNewCycle: (data: CreateCycleData) => void,
  interruptCurrentCycle: () => void,
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

const initialState = {
  cycles: [],
  activeCycleId: null,
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, initialState, () => {
    const storageStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state');

    if (storageStateAsJSON) {
      return JSON.parse(storageStateAsJSON);
    }

    return initialState;
  });

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate),
      );
     }
    
    return 0;
  });
  
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem('@ignite-timer:cycles-state', stateJSON);
  }, [cyclesState]);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());
    const { task, minutesAmount } = data;

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle));
  
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}