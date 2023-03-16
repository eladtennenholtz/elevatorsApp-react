import { ReactComponent as ElevatorIcon } from "./images/icons8-elevator.svg";
import "./Elevator.css";

export default function Elevator(props) {
  return (
    <div>
      <ElevatorIcon style={{ fill: props.color }} className="elevator-img" />
    </div>
  );
}
