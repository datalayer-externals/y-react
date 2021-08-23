import React from 'react'
import { Awareness } from 'y-protocols/awareness'

export const useAwareness = <T extends {} = { [x: string]: any }>(
  awareness: Awareness
): {
  states: Map<number, T>
  localState: T
  setLocalState: React.Dispatch<React.SetStateAction<T>>
} => {
  const [updateCounter, setUpdateCounter] = React.useState(0)

  const forceUpdate = (): void =>
    setUpdateCounter((prevState) => prevState + 1)

  awareness.on('change', () => {
    forceUpdate()
  })

  const [localState, setLocalState] = React.useState<T>({} as unknown as T)

  return ({
    states: React.useMemo(
      () => awareness.getStates() as Map<number, T>,
      [updateCounter, awareness]
    ),
    localState,
    setLocalState: React.useCallback(
      (nextState) => {
        awareness.setLocalState(
          typeof nextState === 'function'
            /* @ts-expect-error */
            ? nextState(awareness.getLocalState() as T)
            : nextState
        )

        setLocalState(nextState)
      },
      [awareness]
    )
  })
}