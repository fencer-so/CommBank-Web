import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import GoalCard from './GoalCard'
import goalsReducer, { createGoal } from '../../../../store/goalsSlice'
import modalReducer from '../../../../store/modalSlice'
import themeReducer from '../../../../store/themeSlice'
import userReducer from '../../../../store/userSlice'
import { Goal } from '../../../../api/types'

function renderWithStore(goal: Goal) {
  const store = configureStore({
    reducer: {
      goals: goalsReducer,
      modal: modalReducer,
      theme: themeReducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
  store.dispatch(createGoal(goal))

  return render(
    <Provider store={store}>
      <GoalCard id={goal.id} />
    </Provider>
  )
}

describe('GoalCard', () => {
  const sampleGoal: Goal = {
    id: '62a3f587102e921da1253d32',
    name: 'House Down Payment',
    targetAmount: 100000,
    balance: 73501.82,
    targetDate: new Date('2025-01-08T05:00:00Z'),
    created: new Date('2022-06-11T01:53:10.857Z'),
    accountId: '1',
    transactionIds: [],
    tagIds: [],
    icon: null,
  }

  it('renders goal without icon when icon is null', () => {
    const { getByText, queryByText } = renderWithStore(sampleGoal)
    expect(getByText('$100000')).toBeInTheDocument()
    expect(queryByText('🤺')).toBeNull()
  })

  it('renders goal with icon when icon is present', () => {
    const goalWithIcon: Goal = {
      ...sampleGoal,
      icon: '🤺',
    }
    const { getByText } = renderWithStore(goalWithIcon)
    expect(getByText('$100000')).toBeInTheDocument()
    expect(getByText('🤺')).toBeInTheDocument()
  })
})
