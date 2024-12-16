import { Component, ReactNode } from 'react';
import Icon from '../Icon';

interface ErrorBoundaryProps {
  showError?: boolean;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: object | null;
}

class DefaultErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    if (this.props.showError === false) {
      this.state.error = null;
      this.state.errorInfo = null;
    }
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ error, errorInfo: info });
  }

  render() {
    if (this.state.errorInfo) {
      const [fileName, errorLocation] = (
        this.state.errorInfo as any
      ).componentStack
        .split('\n ')[1]
        .trim()
        .split(' (');
      return (
        <div className=" flex w-full flex-col items-center justify-center gap-1 bg-pink-200 p-4">
          <div className="title  flex flex-col items-center justify-center">
            <Icon
              name="running_with_errors"
              className="text-4xl text-red-600"
            />
            <p className="text-lg font-bold text-gray-800">
              {' '}
              An Error Occurred !
            </p>
          </div>
          <a
            href={errorLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 underline"
          >
            {fileName}
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default DefaultErrorBoundary;
