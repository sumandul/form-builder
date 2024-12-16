/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Button } from '@Components/RadixComponents/Button';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { scrollToComponent } from '@Hooks/useForm/useFormUtils';
import { postPDf } from '@Services/pdf';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { addPDFFormValidation } from '@Validators/index';
import info_icon from '@Assets/images/info_icon.png';
import Image from '@Components/RadixComponents/Image';
import Input from '@Components/RadixComponents/Input';
import InputLabel from '@Components/common/FormUI/NewFormControl/InputLabel';
import Textarea from '@Components/RadixComponents/TextArea';
import { getRasterLayerList } from '@Services/layerUpload';

const sections: Record<string, any>[] = [
  { id: 1, name: 'Vector features', value: 'vector_features' },
  { id: 2, name: 'Raster', value: 'raster' },
  { id: 3, name: 'Add WMS layer', value: 'add_wms_layer' },
];

const operators = [
  { id: 1, name: '+', value: '+' },
  { id: 2, name: '-', value: '-' },
  { id: 3, name: 'sqrt', value: 'sqrt' },
  { id: 4, name: '*', value: '*' },
  { id: 5, name: '/', value: '/' },
  { id: 6, name: '^', value: '^' },
  { id: 7, name: '<', value: '<' },
  { id: 8, name: '>', value: '>' },
  { id: 9, name: '=', value: '=' },
  { id: 10, name: 'abs', value: 'abs' },
  { id: 11, name: 'min', value: 'min' },
  { id: 12, name: 'max', value: 'max' },
];

export default function CalculateRiskOverlay({
  onCancel, // onConfirm,
}: {
  onCancel: () => void;
  // onConfirm: () => void;
}) {
  const [searchText, setLayerText] = useState('');

  const { data: LayerListData } = useQuery({
    queryKey: ['layer-list', searchText],
    queryFn: () => getRasterLayerList({ search: searchText }),
  });

  return (
    <div className="absolute left-1/2 top-1/2 h-[36.25rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div
          className="head flex w-full items-center justify-center gap-2 p-6"
          style={{ boxShadow: '0px 2px 20px 4px rgba(0, 0, 0, 0.12)' }}
        >
          <div className="content flex w-full flex-col  gap-2">
            <h4>Calculate Risk</h4>
            <p className="text-body-md">
              Please fill up the details to calculate risk for raster layer
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>
        {/* content */}
        <div className="bottom flex h-full w-full flex-col overflow-y-auto lg:flex-row">
          <div className="left flex h-full w-full flex-col gap-10 px-10 py-6 lg:w-[70%]">
            <div className="list flex flex-col gap-5">
              <div className="row flex max-h-[15.375rem] justify-between gap-6">
                <div className="layer-list w-[60%]">
                  <InputLabel label="Raster Layer" astric />
                  <div className="items mt-2 overflow-y-auto rounded-lg border border-gray-300 p-2">
                    <Input
                      placeholder="Search"
                      rightIconName="search"
                      hasIcon
                      value={searchText}
                      onChange={e => setLayerText(e.target.value)}
                    />
                    <div className="items scrollbar mt-2 h-40 overflow-y-auto">
                      {LayerListData?.data?.map((item: Record<string, any>) => (
                        <div
                          key={item.id}
                          className="item py-2 hover:bg-blue-50"
                        >
                          {item.name_en}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="operators-buttons flex w-[40%] flex-col gap-2">
                  <InputLabel label="Operator" />
                  <div className="operators grid h-full grid-cols-3 gap-1">
                    {operators.map(item => (
                      <Button
                        size="lg-icon"
                        key={item.id}
                        type="button"
                        variant="icon-primary"
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="calculator-field flex flex-col gap-2">
                <InputLabel label="Calculator Field" />
                <Textarea rows={2} />
              </div>
              <div className="actions flex w-full items-center justify-center">
                <Button>CALCULATE RISK</Button>
              </div>
            </div>
          </div>
          <div className="right flex w-full flex-col gap-5 bg-blue-50  p-5 lg:w-[40%]">
            <div className="title flex items-center gap-3">
              <Image src={info_icon} className="w-[2rem]" />
              <p>Info</p>
            </div>
            <div className="flex contents flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p className="text-button-md  tracking-wide">Step One</p>
                <p className="text-tooltip font-[400]  tracking-wide">
                  Select Raster layer to be calculated.
                </p>
                <hr style={{ background: '#BDBDBD', height: '0.09rem' }} />
              </div>
              <div className="flex flex-col gap-2  tracking-wider">
                <p className="text-button-md  tracking-wide">Step Two</p>
                <p className="text-tooltip font-[400]  tracking-wider">
                  Select Operator
                </p>
                <hr style={{ background: '#BDBDBD', height: '0.09rem' }} />
              </div>
              <div className="flex flex-col gap-2 tracking-wider">
                <p className="text-button-md  tracking-wide">Step Three</p>
                <p className="text-tooltip font-[400]  tracking-wide">
                  Select Raster layer to be calculated with first raster layer.
                  Or add value you want to. For example numbers.
                </p>
                <hr style={{ background: '#BDBDBD', height: '0.09rem' }} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-button-md tracking-wide">Step Four</p>
                <p className="text-tooltip font-[400]  tracking-wide">
                  Click on call to action button that says
                  <p className="text-button-md tracking-wider">
                    “Calculate risk”
                  </p>
                </p>
                <hr style={{ background: '#BDBDBD', height: '0.09rem' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
