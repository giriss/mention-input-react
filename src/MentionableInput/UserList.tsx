import { ComponentProps, FC } from "react"
import { User } from "."
import styled from "@emotion/styled"

const UserListBase = styled.div<{ position: [number, number] }>`
  border: solid 1px rgb(0, 190, 255);
  display: inline-block;
  position: absolute;
  background: white;
  box-shadow: 0 0 10px rgba(0, 190, 255, 0.8);
  border-radius: 5px;
  overflow: hidden;
  ${({ position: [left, top] }) => `left: ${left}px; top: ${top}px;`}
`

const UserListItemBase = styled.div<{ selected?: boolean }>`
  padding: 5px 10px;
  cursor: pointer;

  :not(:last-of-type) {
    border-bottom: solid 1px rgb(0, 190, 255);
  }

  :hover {
    background: rgba(0, 190, 255, 0.3);
  }

  ${({ selected }) => selected && `background: rgba(0, 190, 255, .3);`}
`

interface UserListProps {
  users: User[]
  position: [number, number]
  selectedIndex: number
  onSelect: (index: number) => void
}

const UserList: FC<UserListProps> = ({
  users,
  position,
  selectedIndex,
  onSelect,
}) => (
  <UserListBase position={position} data-testid="UserList">
    {users.map((user, index) => (
      <UserListItem
        key={user.id}
        user={user}
        selected={selectedIndex === index}
        onClick={() => onSelect(index)}
      />
    ))}
  </UserListBase>
)

interface UserListItemProps extends ComponentProps<"div"> {
  user: User
  selected?: boolean
}

const UserListItem: FC<UserListItemProps> = ({ user, ...restProps }) => (
  <UserListItemBase {...restProps}>{user.fullname}</UserListItemBase>
)

export default UserList
