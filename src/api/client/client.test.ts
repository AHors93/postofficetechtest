import { fetchRates } from './client';

const mockResponse = {
  EUR: { rate: 1.16, name: 'Euro', symbol: '€' },
  USD: { rate: 1.26, name: 'US Dollar', symbol: '$' },
};

describe('fetchRates', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns parsed rates on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchRates('GBP');

    expect(result).toEqual(mockResponse);
  });

  it('lowercases the currency code in the URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchRates('GBP');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/rates/gbp'),
      expect.any(Object),
    );
  });

  it('sends the API key header', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchRates('GBP');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': expect.any(String) }),
      }),
    );
  });

  it('throws when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(fetchRates('GBP')).rejects.toThrow('Rates request failed: 500');
  });

  it('drops malformed entries from the response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        EUR: { rate: 1.16, name: 'Euro', symbol: '€' },
        BAD: { rate: 'not a number', name: 'Bad', symbol: 'X' },
      }),
    });

    const result = await fetchRates('GBP');

    expect(Object.keys(result)).toEqual(['EUR']);
  });
});
