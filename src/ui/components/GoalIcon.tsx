import styled from 'styled-components'
import { TransparentButton } from './TransparentButton'

const Icon = styled.h1`
  font-size: 6rem;
  cursor: pointer;
`

type Props = { icon: string | null; onClick: (event: React.MouseEvent) => void }

export default function GoalIcon(props: Props) {
  return (
    <TransparentButton onClick={props.onClick}>
      <Icon>{props.icon}</Icon>
    </TransparentButton>
  )
}