import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AddIconButton from './AddIconButton'

describe('AddIconButton', () => {
  it('renders "Add icon" button when hasIcon is false', () => {
    const handleClick = jest.fn()
    const { getByText } = render(<AddIconButton hasIcon={false} onClick={handleClick} />)
    const buttonText = getByText('Add icon')
    expect(buttonText).toBeInTheDocument()

    fireEvent.click(buttonText)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when hasIcon is true', () => {
    const handleClick = jest.fn()
    const { container } = render(<AddIconButton hasIcon={true} onClick={handleClick} />)
    expect(container.firstChild).toBeNull()
  })
})
