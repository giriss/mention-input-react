import { FC } from "react";
import { User } from ".";
import { css } from "@emotion/react";

const styles = css`
  border: solid 1px black;
  display: inline-block;
  position: absolute;
  background: white;
  box-shadow: 0 0 10px gray;
  border-radius: 5px;
  overflow: hidden;

  > div {
    padding: 5px 10px;
    :not(:last-of-type) {
      border-bottom: solid 1px black;
    }
  }
`

interface UserListProps {
  users: User[]
  position: [number, number]
  selectedIndex: number
}

const UserList: FC<UserListProps> = ({ users, position, selectedIndex }) => (
  <div css={css(styles, { left: position[0], top: position[1] })}>
    {users.map((user, index) => (
      <UserListItem key={user.id} user={user} selected={selectedIndex === index} />
    ))}
  </div>
)

const UserListItem: FC<{ user: User, selected?: boolean }> = ({ user, selected }) => (
  <div css={selected ? css({ background: "wheat" }) : undefined}>{user.fullname}</div>
)

export default UserList
