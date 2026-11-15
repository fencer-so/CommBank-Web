import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import GoalIcon from './GoalIcon'

describe('GoalIcon', () => {
  it('renders the emoji icon and handles clicks', () => {
    const handleClick = jest.fn()
    const { getByText } = render(<GoalIcon icon="🤺" onClick={handleClick} />)
    const iconElement = getByText('🤺')
    expect(iconElement).toBeInTheDocument()

    fireEvent.click(iconElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
