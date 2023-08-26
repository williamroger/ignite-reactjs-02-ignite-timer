import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separator, 
  StartCountdownButton, 
  TaskInput
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod
    .string()
    .min(3, 'Informe a tarefa.'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo deve ser de no mínimo 5 minutos')
    .max(60, 'O ciclo deve ser de no máximo 60 minutos')
})

export function Home() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema),
  }); 
  
  function handleCreateNewCycle(data: any) {
    console.log(data)
  }

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em </label>
          <TaskInput 
            type="text" 
            id="task" 
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto" 
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 01" />
            <option value="Projeto 02" />
            <option value="Projeto 03" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}