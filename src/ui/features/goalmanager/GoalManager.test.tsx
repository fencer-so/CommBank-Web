import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from 'styled-components'
import { GoalManager } from './GoalManager'
import goalsReducer, { createGoal } from '../../../store/goalsSlice'
import modalReducer from '../../../store/modalSlice'
import themeReducer from '../../../store/themeSlice'
import userReducer from '../../../store/userSlice'
import { Goal } from '../../../api/types'
import { DarkTheme } from '../../components/Theme'

function renderGoalManager(goal: Goal) {
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
      <ThemeProvider theme={DarkTheme}>
        <GoalManager goal={goal} />
      </ThemeProvider>
    </Provider>
  )
}

describe('GoalManager', () => {
  const goalWithoutIcon: Goal = {
    id: 'goal-1',
    name: 'Vacation',
    targetAmount: 5000,
    balance: 1000,
    targetDate: new Date('2025-12-31'),
    created: new Date('2022-01-01'),
    accountId: 'acc-1',
    transactionIds: [],
    tagIds: [],
    icon: null,
  }

  const goalWithIcon: Goal = {
    ...goalWithoutIcon,
    id: 'goal-2',
    icon: '✈️',
  }

  it('displays "Add icon" button when icon is null', () => {
    const { getByText, queryByText } = renderGoalManager(goalWithoutIcon)
    expect(getByText('Add icon')).toBeInTheDocument()
    expect(queryByText('✈️')).toBeNull()
  })

  it('displays GoalIcon when icon exists and hides "Add icon"', () => {
    const { getByText, queryByText } = renderGoalManager(goalWithIcon)
    expect(getByText('✈️')).toBeInTheDocument()
    expect(queryByText('Add icon')).toBeNull()
  })

  it('opens emoji picker when "Add icon" is clicked', () => {
    const { getByText, container } = renderGoalManager(goalWithoutIcon)
    const addIconButton = getByText('Add icon')

    fireEvent.click(addIconButton)

    // EmojiPickerContainer should have display: flex when open
    const picker = container.querySelector('.emoji-mart')
    expect(picker).toBeInTheDocument()
  })
})
