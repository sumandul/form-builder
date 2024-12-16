import ColorPicker from "@rc-component/color-picker";
import React, { useState } from "react";
import colorToHex from "../../../utils/convertohex";

const ButtonSetting = ({
  bgColor,
  setColor,
  setTextColor,
  textColor,
  setButtonRadius,
  buttonRadius,
  setButtonAlignment,
  buttonAlignment,
}) => {
  const [buttonStyle, setButtonStyle] = useState("bg");
  const [value, setValue] = useState(40);
  const handleAlignment = (e) => {
    console.log(e.target.value);
  };
  return (
    <div>
      <div className="   ">
        <div>
          <div className=" capitalize   rounded-tl-md rounded-tr-md bg-blue-300 text-white  py-3 px-5 flex items-center gap-3">
            {" "}
            <button
              onClick={() => setButtonStyle("bg")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "bg" && "border-blue-500 border-b "
              }  `}
            >
              background color{" "}
            </button>{" "}
            <button
              onClick={() => setButtonStyle("text")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "text" && "border-blue-500 border-b "
              }  `}
            >
              text color
            </button>{" "}
            <button
              onClick={() => setButtonStyle("css")}
              className={` text-base font-medium capitalize ${
                buttonStyle === "css" && "border-blue-500 border-b "
              }  `}
            >
              css
            </button>
          </div>
          {buttonStyle === "bg" && (
            <ColorPicker
              className=" w-full"
              color={bgColor}
              onChange={(color) => setColor(color)}
            />
          )}
          {buttonStyle === "text" && (
            <ColorPicker
              className=" w-full"
              color={textColor}
              onChange={(color) => setTextColor(colorToHex(color))}
            />
          )}
          {buttonStyle === "css" && (
            <>
              <div className=" p-3">
                <div className=" flex">
                  <div className=" capitalize font-medium text-base">
                    radius:
                  </div>
                  <div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={buttonRadius}
                      onChange={(e) => setButtonRadius(e.target.value)}
                      className="slider"
                    />
                    <div className="slider-value">{buttonRadius}%</div>{" "}
                    {/* Display the current value */}
                  </div>
                </div>
                <div className=" flex">
                  <div className=" capitalize font-medium text-base">
                    {" "}
                    alignment:
                  </div>
                  <div className=" flex  items-center gap-3">
                    <div className=" flex items-center gap-2">
                      <input
                        type="radio"
                        name="aligment"
                        id=""
                        onChange={(e) => setButtonAlignment(e.target.value)}
                        value={"left"}
                      />{" "}
                      <span className=" capitalize font-medium text-base">
                        Left
                      </span>
                    </div>
                    <div className=" flex items-center gap-3">
                      <input
                        type="radio"
                        name="aligment"
                        id=""
                        value={"center"}
                        onChange={(e) => setButtonAlignment(e.target.value)}
                      />{" "}
                      <span className=" capitalize font-medium text-base">
                        center
                      </span>
                    </div>
                    <div className=" flex items-center gap-3">
                      <input
                        type="radio"
                        name="aligment"
                        id=""
                        onChange={(e) => setButtonAlignment(e.target.value)}
                        value={"end"}
                      />{" "}
                      <span className=" capitalize font-medium text-base">
                        Right
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonSetting;
