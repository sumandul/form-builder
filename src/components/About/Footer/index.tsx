// import naxalogo from '@Assets/images/NAXA.svg';
import stimsonlogo from '@Assets/images/stimson_logo.png';
import pinlogo from '@Assets/images/pin.png';
import ihrrlogo from '@Assets/images/ihrr.png';
import startimage from '@Assets/images/startnetwork.png';

export default function Footer(): JSX.Element {
  return (
    <div className="w-full bg-blue-50 py-5">
      <div className="mx-auto flex w-[80%] flex-col items-center gap-4 rounded-2xl bg-white shadow-lg md:flex-row md:justify-around">
        <img src={stimsonlogo} alt="logo2" className="h-[2rem] w-[7rem]" />
        <img src={pinlogo} alt="logo1" className="h-[4.5rem] w-[15rem]" />
        <img src={startimage} alt="logo1" className="h-[3rem] w-[15rem]" />
      </div>
      <div className="mx-auto my-5 flex w-[15rem] justify-around">
        <h1 className="font-primaryfont text-[0.90rem] leading-5">
          Technical Partner
        </h1>
        {/* <a target="_blank" href="https://naxa.com.np" rel="noreferrer">
          <img src={naxalogo} alt="logo" className="w-[4.438rem]" />
        </a> */}
        <a target="_blank" href="https://ihrr.org.np" rel="noreferrer">
          <img src={ihrrlogo} alt="logo" className="w-[4.438rem]" />
        </a>
      </div>
    </div>
  );
}
