import { ComponentProps, FC } from "react";

type MentionProps = Omit<ComponentProps<"span">, "style">

const Mention: FC<MentionProps> = props => (
  <span
    style={{ color: "red", textShadow: "0 0 5px violet" }}
    {...props}
  />
)

export default Mention
