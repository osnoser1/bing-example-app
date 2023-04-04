import { FC } from "react";

import cn from "classnames";

import s from "./Loader.module.scss";

interface Props {
  className?: string;
  text?: string;
}

const Loader: FC<Props> = ({ className, text = "Loading..." }) => {
  return (
    <div className={cn(s.root, className)}>
      <div className={s.spinner}></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;
