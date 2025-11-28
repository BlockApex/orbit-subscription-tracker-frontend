"use client";
import clsx from "clsx";
import { Calendar } from "lucide-react";
import React, { useState } from "react";
import Input from "./Input";
import { Button } from "./Button";
import { Select } from "./Select";
import toast from "react-hot-toast";

export type BillingCycleValue = {
  name: string;
  value: string;
};

const cycles: BillingCycleValue[] = [
  { name: "Monthly", value: "monthly" },
  // { name: "Quarterly", value: "quarterly" },
  { name: "Yearly", value: "yearly" },
];

const types = [
  { _id: "day", title: "Day" },
  { _id: "week", title: "Week" },
  { _id: "month", title: "Month" },
  { _id: "year", title: "Year" },
];

const pluralize = (count: number, type: string) => {
  return count > 1 ? `${type}s` : type;
};

type BillingCycleProps = {
  value: BillingCycleValue;
  onChange: (cycle: BillingCycleValue) => void;
};

const BillingCycle: React.FC<BillingCycleProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState("1");
  const [type, setType] = useState(types[0]._id);

  const handleAdd = () => {
    const num = Number(count);

    if (!num || num <= 0) {
      toast.error("Please enter a valid count");
      return;
    }

    const finalType = pluralize(num, type);
    const newValue = `${num} ${finalType}`;

    const cycle: BillingCycleValue = {
      name: newValue,
      value: newValue,
    };

    onChange(cycle); // <-- parent receives the cycle

    setCount("1");
    setType(types[0]._id);
    setOpen(false);
  };

  const isCustom = () => {
    return !cycles.some((c) => c.value === value.value);
  };

  const renderCustomCycle = () => {
    if (isCustom()) {
      return <p className="text-base font-medium">{value.value}</p>;
    }
    return <Calendar className="w-5 h-5" />;
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700">Billing Cycle</label>

      <div className="w-full grid grid-cols-3 gap-4 mt-1">
        {cycles.map((c) => {
          const active = c.value === value.value;

          return (
            <div
              key={c.value}
              onClick={() => onChange(c)}
              className={clsx(
                "border border-primary p-4 rounded-xl cursor-pointer text-center transition-all duration-300",
                active ? "bg-primary/50 text-black" : "bg-transparent text-black"
              )}
            >
              <p className="text-base font-medium">{c.name}</p>
            </div>
          );
        })}

        {/* Custom Button */}
        <button
          className={clsx(
            "flex items-center justify-center border border-primary p-4 rounded-xl cursor-pointer transition-all duration-300",
            isCustom() ? "bg-primary/50 text-black" : "bg-transparent text-black"
          )}
          onClick={() => setOpen(true)}
        >
          {renderCustomCycle()}
        </button>
      </div>

      {open && (
        <div className="flex items-center gap-4 mt-4">
          <Input value={count} onChange={(v) => setCount(v)} />

          <Select
            label=""
            options={types}
            value={type}
            onChange={(value) => setType(value)}
            placeholder=""
            error={""}
          />

          <Button onClick={handleAdd} variant="primary" size="sm">
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default BillingCycle;
