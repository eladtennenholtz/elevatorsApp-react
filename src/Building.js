import React, { useState, useEffect } from "react";
import "./Building.css";
import Floor from "./Floor";
import Button from "./Button";
import Elevator from "./Elevator";
import sound from "./sound/341871__edsward__ping.wav";

function Building() {
  function play() {
    new Audio(sound).play();
  }
  const floors = [
    "9th",
    "8th",
    "7th",
    "6th",
    "5th",
    "4th",
    "3rd",
    "2nd",
    "1st",
    "Ground Floor",
  ];

  const [buttonQueue, setButtonQueue] = useState([]);
  const [elevatorCells, setElevatorCells] = useState([]);
  const [buttonStatus, setButtonStatus] = useState(new Array(10).fill("Call"));

  //what column, current floor, is elevator moving, which floor to go
  const [allElevators, setAllElevators] = useState([
    { colNumber: 0, floor: 10, is_occupied: false, to_floor: null },
    { colNumber: 1, floor: 1, is_occupied: false, to_floor: null },
    { colNumber: 2, floor: 1, is_occupied: false, to_floor: null },
    { colNumber: 3, floor: 1, is_occupied: false, to_floor: null },
    { colNumber: 4, floor: 1, is_occupied: false, to_floor: null },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Move each elevator one floor closer to its destination floor
      setAllElevators((prevElevators) =>
        prevElevators.map((elevator) => {
          if (elevator.is_occupied && elevator.floor !== elevator.to_floor) {
            const nextFloor =
              elevator.to_floor > elevator.floor
                ? elevator.floor + 1
                : elevator.floor - 1;
            return { ...elevator, floor: nextFloor };
          } else {
            if (elevator.floor === elevator.to_floor && elevator.is_occupied) {
              setButtonStatus((prevButtons) => {
                const buttons = prevButtons.map((button, index) => {
                  if (index + 1 === elevator.floor) {
                    play();
                    return "Arrived";
                  } else {
                    return button;
                  }
                });
                return buttons;
              });
            } else if (elevator.floor === elevator.to_floor) {
              setButtonStatus((prevButtons) => {
                const buttons = prevButtons.map((button, index) => {
                  if (index + 1 === elevator.floor) {
                    return "Call";
                  } else {
                    return button;
                  }
                });
                return buttons;
              });
            }
            return elevator;
          }
        })
      );
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updatedElevatorCells = [...Array(10)].map((_, rowIndex) =>
      [...Array(5)].map((_, colIndex) => {
        const elevator = allElevators.find(
          (elevator) =>
            elevator.colNumber === colIndex && elevator.floor === rowIndex + 1
        );
        let color = "black";
        if (allElevators[colIndex].is_occupied === true) {
          if (
            allElevators[colIndex].floor === allElevators[colIndex].to_floor
          ) {
            color = "green";
          } else {
            color = "red";
          }
        }
        return (
          <td key={colIndex}>{elevator ? <Elevator color={color} /> : null}</td>
        );
      })
    );
    setElevatorCells(updatedElevatorCells);
  }, [allElevators]);

  const buildingStructure = [...Array(10)].map((_, rowIndex) => (
    <tr key={rowIndex}>
      <td>
        <Floor floor={floors[rowIndex]} />
      </td>
      {elevatorCells[rowIndex]}
      <td>
        <Button
          label={buttonStatus[rowIndex]}
          onClick={() => handleCallElevator(rowIndex + 1)}
        />
      </td>
    </tr>
  ));

  const handleCallElevator = (floorNumber) => {
    setButtonStatus((prevButtons) => {
      const buttonsUpdated = prevButtons.map((button, index) => {
        if (index + 1 === floorNumber) {
          const tmp = "Waiting";
          return tmp;
        } else {
          return button;
        }
      });
      return buttonsUpdated;
    });

    // print all elevators and floor numbers
    console.log("allElevators", allElevators);
    console.log("eleveatorCells", elevatorCells);
    console.log("floorNumber", floorNumber);
    console.log("buttonQueue", buttonQueue);
    const availableElevators = allElevators.filter(
      (elevator) => !elevator.is_occupied
    );

    if (availableElevators.length > 0) {
      // Calculate the distance of each available elevator to the floor
      const distances = availableElevators.map((elevator) =>
        Math.abs(elevator.floor - floorNumber)
      );

      // Find the index of the closest elevator
      const closestElevatorIndex = distances.indexOf(Math.min(...distances));

      // Get the closest elevator
      const closestElevator = availableElevators[closestElevatorIndex];

      // Add the floor to the button queue of the closest elevator
      setAllElevators((prevElevators) =>
        prevElevators.map((elevator) =>
          elevator.colNumber === closestElevator.colNumber
            ? {
                ...elevator,
                to_floor: floorNumber,
                is_occupied: true,
              }
            : elevator
        )
      );

      // Add the button and selected floor to the queue
      setButtonQueue((prevQueue) => [
        ...prevQueue,
        { floor: floorNumber, elevatorColNumber: closestElevator.colNumber },
      ]);

      // Lock the closest elevator for 5 seconds
      setTimeout(() => {
        setAllElevators((prevElevators) =>
          prevElevators.map((elevator) =>
            elevator.colNumber === closestElevator.colNumber
              ? {
                  ...elevator,
                  is_occupied: false,
                }
              : elevator
          )
        );
        setButtonQueue((prevQueue) => prevQueue.slice(1));
      }, 2000);
    }
  };

  return (
    <div>
      <p className="elevator-title">Elevator Exercise</p>
      <div>
        <div className="container">
          <table>
            <tbody>{buildingStructure}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Building;
