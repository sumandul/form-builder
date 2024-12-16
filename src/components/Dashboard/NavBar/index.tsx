/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FlexRow } from '@Components/common/Layouts';
import { NavLink, useNavigate } from 'react-router-dom';
import PortalTemplate from '@Components/common/PortalTemplate';
import CalculateRiskOverlay from '@Components/PortalOverlays/CalculateRiskOverlay';
import { useState } from 'react';
import stimsonimage from '@Assets/images/stimson.png';
import pinimage from '@Assets/images/logo_pin.png';
import csrcLogo from '@Assets/images/CSRClogo.png';
import startimage from '@Assets/images/start_network.png';
import ihrrimage from '@Assets/images/ihrr.png';
import australianAidLogo from '@Assets/images/australian_aid.png';
import Image from '@Components/RadixComponents/Image';
import UserProfile from './UserProfile';

export default function NavBar() {
  const navigateTo = useNavigate();
  const token = localStorage.getItem('token');
  interface Ilinks {
    link: string;
    name: string;
    index: number;
  }

  const authenticatedLinks: Ilinks[] = [
    {
      link: '/analytics?chart_type=precipitation',
      name: 'Analytics',
      index: 4,
    },
    {
      link: '/admin-dashboard/alert-threshold',
      name: 'Hydrometeorological Alert',
      index: 5,
    },
  ];
  const links: Ilinks[] = [
    { link: '/', name: 'Map', index: 0 },
    { link: '/about', name: 'About', index: 1 },
    // { link: '/pdf', name: 'PDF', index: 2 },
    ...(token ? authenticatedLinks : []),
  ];
  const [isCalculateRiskModalOpen, setIsCalculateRiskModalOpen] =
    useState(false);

  return (
    <>
      <FlexRow className="w-full justify-between bg-primary-500 px-3 py-3 text-white">
        <FlexRow
          className="gap-6 hover:cursor-pointer"
          onClick={() => navigateTo('/')}
        >
          <h4 className="font-primary">ForeC-Nepal</h4>
          <div className="flex flex-row gap-2">
            <Image src={stimsonimage} className="h-[1.7rem] pt-1" />
            <Image src={pinimage} className="h-[1.7rem] pt-1" />
            <Image src={ihrrimage} className="h-[2.2rem]  pt-1" />
            <Image src={startimage} className="h-[2.2rem]  pt-1" />
            <Image src={csrcLogo} className="h-[2.2rem] pt-1" />
            <Image src={australianAidLogo} className="h-[2.2rem] pt-1" />
          </div>
        </FlexRow>
        {token ? (
          <FlexRow className="gap-4">
            {links.map(({ link, name, index }) => (
              <NavLink
                key={index}
                to={link}
                className={navData =>
                  navData.isActive
                    ? 'h-[2.2rem] border-b-[2px] px-2.5 py-1 font-primary text-button-md font-semibold'
                    : 'h-[2.2rem] px-2.5 py-1 font-primary text-button-md font-semibold duration-100 hover:border-b-[2px]'
                }
              >
                {name}
              </NavLink>
            ))}
            {/* <NavLink
              to="/"
              onClick={() => {
                setIsCalculateRiskModalOpen(true);
              }}
              // className="px-2 py-1 font-primary text-button-md font-semibold duration-100 hover:border-b-[2px]"
              className="h-[2.2rem] px-2.5 py-1 font-primary text-button-md font-semibold duration-100 hover:border-b-[2px]"
            >
              Calculate Risk
            </NavLink> */}
            <UserProfile />
            {/* {!token ? (
            <Button
              variant="secondary"
              size="sm"
              className="font-primary text-button-md"
              onClick={() => {
                navigate('/signin');
              }}
            >
              SIGN IN
            </Button>
          ) : (
            <UserProfile />
          )} */}
          </FlexRow>
        ) : null}
      </FlexRow>
      {isCalculateRiskModalOpen && (
        <PortalTemplate>
          <CalculateRiskOverlay
            onCancel={() => setIsCalculateRiskModalOpen(false)}
          />
        </PortalTemplate>
      )}
    </>
  );
}
