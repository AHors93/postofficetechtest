import { fireEvent, render } from '@testing-library/react-native';

import { CurrencyDropdown } from './CurrencyDropdown';

const OPTIONS = ['GBP', 'USD', 'EUR'];

describe('CurrencyDropdown', () => {
  it('renders the current value on the trigger', () => {
    const { getByTestId } = render(
      <CurrencyDropdown
        value="GBP"
        options={OPTIONS}
        onSelect={jest.fn()}
        testID="picker"
      />,
    );
    expect(getByTestId('picker')).toBeTruthy();
  });

  it('calls onSelect with the tapped code', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <CurrencyDropdown
        value="GBP"
        options={OPTIONS}
        onSelect={onSelect}
        testID="picker"
      />,
    );
    fireEvent.press(getByTestId('picker'));
    fireEvent.press(getByTestId('picker-EUR'));
    expect(onSelect).toHaveBeenCalledWith('EUR');
  });

  it('does not call onSelect when the current value is tapped', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <CurrencyDropdown
        value="GBP"
        options={OPTIONS}
        onSelect={onSelect}
        testID="picker"
      />,
    );
    fireEvent.press(getByTestId('picker'));
    fireEvent.press(getByTestId('picker-GBP'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
