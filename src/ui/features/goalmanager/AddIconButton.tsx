import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'date-fns'
import React from 'react'
import styled from 'styled-components'
import { TransparentButton } from '../../components/TransparentButton'

type Props = { hasIcon: boolean; onClick: (event: React.MouseEvent) => void }

export default function AddIconButton(props: Props) {
  if (props.hasIcon) return null

  return (
    <Container>
      <TransparentButton onClick={props.onClick}>
        <FontAwesomeIcon icon={faSmile} size="2x" />
        <Text>Add icon</Text>
      </TransparentButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Text = styled.span`
  margin-left: 0.6rem;
  font-size: 1.5rem;
  color: rgba(174, 174, 174, 1);
  text-decoration: underline;
  cursor: pointer;
`
