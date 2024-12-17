import React, { useState } from "react";
import ColorPicker from "@rc-component/color-picker";
import colorToHex from "../../../utils/convertohex";

interface ButtonSettingProps {
  setColor: (color: any) => void;
  setTextColor: (color: any) => void;
  setButtonRadius: (radius: any) => void;
  buttonRadius: number;
  setButtonAlignment: (alignment: "left" | "center" | "end") => void;
}

const ButtonSetting: React.FC<ButtonSettingProps> = ({
  setColor,
  setTextColor,
  setButtonRadius,
  buttonRadius,
  setButtonAlignment,
}) => {
  const [buttonStyle, setButtonStyle] = useState<"bg" | "text" | "css">("bg");
  const handleAlignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonAlignment(e.target.value as "left" | "center" | "end");
  };

  return (
    <div>
      <div className="   ">
        <div>
          <div className=" capitalize   rounded-tl-md rounded-tr-md bg-blue-300 text-white  py-3 px-5 flex items-center gap-3">
            <button
              onClick={() => setButtonStyle("bg")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "bg" && "border-blue-500 border-b "
              }`}
            >
              background color
            </button>
            <button
              onClick={() => setButtonStyle("text")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "text" && "border-blue-500 border-b "
              }`}
            >
              text color
            </button>
            <button
              onClick={() => setButtonStyle("css")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "css" && "border-blue-500 border-b "
              }`}
            >
              css
            </button>
          </div>
          {buttonStyle === "bg" && (
            <ColorPicker
              className=" w-full"
              // color={bgColor}
              onChange={(color) => setColor(color)}
            />
          )}
          {buttonStyle === "text" && (
            <ColorPicker
              className=" w-full"
              // color={textColor}
              onChange={(color) => setTextColor(colorToHex(color))}
            />
          )}
          {buttonStyle === "css" && (
            <div className=" p-3">
              <div className=" flex">
                <div className=" capitalize font-medium text-base">radius:</div>
                <div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={buttonRadius}
                    onChange={(e) => setButtonRadius(parseInt(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-value">{buttonRadius}%</div>{" "}
                </div>
              </div>
              <div className=" flex">
                <div className=" capitalize font-medium text-base">
                  alignment:
                </div>
                <div className=" flex  items-center gap-3">
                  <div className=" flex items-center gap-2">
                    <input
                      type="radio"
                      name="aligment"
                      value="left"
                      onChange={handleAlignment}
                    />
                    <span className=" capitalize font-medium text-base">
                      Left
                    </span>
                  </div>
                  <div className=" flex items-center gap-3">
                    <input
                      type="radio"
                      name="aligment"
                      value="center"
                      onChange={handleAlignment}
                    />
                    <span className=" capitalize font-medium text-base">
                      center
                    </span>
                  </div>
                  <div className=" flex items-center gap-3">
                    <input
                      type="radio"
                      name="aligment"
                      value="end"
                      onChange={handleAlignment}
                    />
                    <span className=" capitalize font-medium text-base">
                      Right
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonSetting;
