/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import logo from '@Assets/images/Avatar-images.png';
import { logoutUser } from '@Services/authentication';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@Components/RadixComponents/DropDownMenu';
import { Button } from '@Components/RadixComponents/Button';
import Icon from '@Components/common/Icon';

export default function UserProfile() {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('token');

      // should dispatch this event to activate storage listner
      window.dispatchEvent(new Event('storage'));
      navigate('/signin');
    },
    onError: () => {
      // LogOut on error too due to userRole issues in the backend
      localStorage.removeItem('token');

      // should dispatch this event to activate storage listner
      window.dispatchEvent(new Event('storage'));
      navigate('/signin');
    },
  });

  const settingOptions = [
    {
      id: 1,
      name: 'Admin Dashboard',
      icon: 'dashboard',
      onClick: () => {
        // mutate();
        navigate('/admin-dashboard/category-management');
      },
    },
    {
      id: 2,
      name: 'LogOut',
      icon: 'logout',
      onClick: () => {
        mutate();
      },
    },
  ];

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <img className="rounded-full object-fill" src={logo} alt="avatar" />
        </DropdownMenuTrigger>
        <DropdownMenuSeparator />
        <DropdownMenuContent className="mr-1.5 min-w-[17.5rem]  bg-white">
          <DropdownMenuLabel>
            <div className="avatar flex w-full gap-3 border-b border-b-gray-300">
              <img
                className="h-12 w-12 rounded-full object-fill "
                src={logo}
                alt="avatar"
              />
              <div className="name-role">
                <h5>ForC Admin</h5>
                <p className="body-md text-gray-500">Super Admin</p>
              </div>
            </div>
          </DropdownMenuLabel>
          {settingOptions.map(item => (
            <DropdownMenuItem
              key={item.id}
              className="!hover:bg-white !h-10 !bg-white !px-3 !py-2"
            >
              <Button
                size="sm"
                onClick={item.onClick}
                className="flex w-full items-start !text-gray-500 "
                variant="link"
              >
                <div className="flex h-full w-full items-center gap-2 px-2">
                  <Icon name={item.icon} />
                  <p className="body-lg">{item.name}</p>
                </div>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
