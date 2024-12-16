interface IFeatureProps {
  icon: string;
  title: string;
  description: string;
}

export default function Feature({
  icon,
  title,
  description,
}: IFeatureProps): JSX.Element {
  return (
    <div className="p-4">
      <img src={icon} alt="Feature_logo" />
      <h6 className="mt-2 font-primary text-grey-900">{title}</h6>
      <p className="mt-2 font-primary text-body-md text-grey-900">
        {description}
      </p>
    </div>
  );
}
