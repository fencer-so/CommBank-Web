import React from 'react'
import styled from 'styled-components'
import { media } from '../../../utils/media'
import GoalCard from './GoalCard'

type Props = { ids: string[] | null }

export default function GoalsContent(props: Props) {
  if (!props.ids) return null

  return (
    <Container>
      {props.ids.map((id) => (
        <GoalCard key={id} id={id} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 400px;
  padding: 2rem 4rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${media('<tablet')} {
    width: 100%;
    padding: 1rem 2rem;
  }
`
