import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useItemsList } from "../../store";
import moment from "moment"

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  

  return new Date(result);
}
const ItemsListBox = ({ item ,setTotalPrice}) => {
  
  const { updateItem, removeItem, itemsList, addItem } = useItemsList();
  const [units, setUnits] = useState(1);
  const [saved, setSaved] = useState(false);
  const buttonRef = useRef("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [error, setError] = useState("");
  const [dateValid, setDateValid] = useState(true);
  const [totalReserved, settotalReserved] = useState(0);
  const [reservedDates, setReserverDates] = useState(
    JSON.parse(item.reserved)?.map((item) => ({
      start: new Date(item.start).toLocaleDateString(),
      end: new Date(item.end).toLocaleDateString(),
    }))
  );

  const handleSave = async () => {
    if (!startDate || !endDate || !units) {
      return alert("Please Provide all details");
    }
    if (!dateValid) {
      return alert("Product in reserved between your selected dates");
    }
    if (startDate > endDate){
      return alert("Selected date are not valid, please verify");
    }
    console.log(item.stock)
    if (units <= item.stock){
      if (!saved) {
        addItem({ ...item, startDate, endDate, units: units });
      } else {
      
  
        updateItem(item.id, startDate, endDate, units);
      }
      console.log(saved)
      console.log(buttonRef.current.innerText);
      if (buttonRef.current.innerText === "Ajouter"){
        setSaved(true);
      }else{
        setSaved(false);
       
      };
    }else {
      alert(`Vous avez dépasser le nombre diponible en stock pour cette date, veuillez choisir un nombre maximum de ${item.stock}`)
    }
    
  };
  const handleRemove = () => {
    removeItem(item.id);
    setSaved(false);
  };
  useEffect(() => {
    settotalReserved(0);
    JSON.parse(item.reserved)?.forEach((obj) => {
      settotalReserved((val) => val + obj.reservedUnits);
    });
    if (item) {
      setReserverDates(
        JSON.parse(item.reserved)?.map((item) => ({
          start: new Date(item.start),
          end: new Date(item.end),
        }))
      );
    }
   
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    const found = itemsList?.find(({ id }) => {
      return id === item.id;
    });
    if(!found){
      setSaved(false);

    }
    if (found?.startDate && found?.endDate && found.units) {
      setStartDate(new Date(found.startDate));
      setEndDate(new Date(found.endDate));
      setUnits(found.units);
      setSaved(true);
    }
    console.log(itemsList.length)
    if (itemsList.length != 0) {
      console.log("tg")
      let calculatedPrice = 0;
      itemsList.forEach(({ startDate, endDate, units, price }) => {
        const start = moment(new Date(startDate));
        const end = moment(new Date(endDate));
        const numOfDays = end.diff(start, "days");
        if (numOfDays > 0) {
          calculatedPrice += units * price * numOfDays;
        } else {
          calculatedPrice += units * price;
        }
      });
   
      setTotalPrice(calculatedPrice)
    }
    // eslint-disable-next-line
  }, [saved,itemsList]);


  useEffect(() => {
    setError("");
    setDateValid(true);
    reservedDates?.forEach((date) => {
      if (
        units > item.stock - totalReserved &&
        new Date(startDate) < new Date(date.start) &&
        new Date(endDate) > new Date(date.end)
      ) {
        setError("Product is reserved between your selected dates");
        setDateValid(false);
      }
    });
    // eslint-disable-next-line
  }, [startDate, endDate]);
  return (
    <div className="itemsBox">
      <img src={item?.image} alt={item.name} width="180" height={"110"} />

      <h3 className="itemname">{item.name}</h3>

      <h4>
        <small>Prix unitaire :</small>{item.price}€
      </h4>
      <h4>
        <small> Prix total pour {units} unité:</small>{item.price * units}€
      </h4>

      <div>
        <h4>
          <small>Quantité :</small>
          <input
            type="number"
            className="qtyInput"
            min={1}
            max={item.stock}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="Enter units"
          />
        </h4>
      </div>
      <div>
      <small>Date de reservation :</small>
        <h4>
          <DatePicker
            className="inputBox"
            selected={startDate}
            minDate={addDays(new Date(), 1)}
            excludeDateIntervals={
              units > item.stock - totalReserved ? reservedDates : []
            }
            placeholderText="Rent Date"
            showYearDropdownr={true}
            // showMonthDropdown={true}
            showTimeInput={false}
            onChange={(e) => setStartDate(new Date(e))}
          />
        </h4>
      </div>
      <div>
        <h4>
          <DatePicker
            className="inputBox"
            minDate={addDays(startDate, 0)}
            selected={endDate}
            showYearDropdownr={true}
            placeholderText="Deliver Date"
            disabled={!startDate}
            excludeDateIntervals={
              units > item.stock - totalReserved ? reservedDates : []
            }
            showTimeInput={false}
            onChange={(e) => setEndDate(new Date(e))}
          />
        </h4>
      </div>
      <div className="buttonGroup">
        <button
          ref={buttonRef}
          disabled={!startDate || !endDate || !units || error}
          onClick={handleSave}
          style={{ margin: "10px", padding: "8px" }}
        >
          {saved ? "Modifier" : "Ajouter"}
        </button>
        <button
          onClick={handleRemove}
          style={{ margin: "10px", padding: "8px" }}
        >
          Retirer l'article
        </button>
      </div>

      <small style={{ color: "crimson" }}> {error}</small>

      {saved ? (
        <small style={{ color: "green" }}> Article ajouté </small>
      ) : (
        <small style={{ color: "red" }}>Article pas ajouté </small>
      )}
    </div>
  );
};

export default ItemsListBox;
